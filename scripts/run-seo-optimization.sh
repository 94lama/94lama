#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: scripts/run-seo-optimization.sh [options]

Run a repo-wide SEO audit or fix pass through the local `seo-optimization`
project skill using `claude -p`, then save the prompt and outputs to a
workspace folder.

Options:
  --mode <audit|fix>       Execution mode. Default: audit
  --focus <text>           Extra focus area, e.g. "technical SEO"
  --prompt-file <path>     Append extra instructions from a file
  --model <model-id>       Optional Claude model override
  --workspace <path>       Output workspace root
  --dry-run                Print the generated prompt and exit
  --help                   Show this help

Examples:
  scripts/run-seo-optimization.sh
  scripts/run-seo-optimization.sh --mode fix --focus "technical SEO and metadata"
  scripts/run-seo-optimization.sh --prompt-file .seo-extra-prompt.md
EOF
}

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
SKILL_PATH="$ROOT_DIR/.agents/skills/seo-optimization/SKILL.md"
MODE="audit"
FOCUS=""
EXTRA_PROMPT_FILE=""
MODEL=""
WORKSPACE_ROOT="$ROOT_DIR/.seo-optimization-workspace"
DRY_RUN="false"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --mode)
      MODE="${2:-}"
      shift 2
      ;;
    --focus)
      FOCUS="${2:-}"
      shift 2
      ;;
    --prompt-file)
      EXTRA_PROMPT_FILE="${2:-}"
      shift 2
      ;;
    --model)
      MODEL="${2:-}"
      shift 2
      ;;
    --workspace)
      WORKSPACE_ROOT="${2:-}"
      shift 2
      ;;
    --dry-run)
      DRY_RUN="true"
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      printf 'Unknown argument: %s\n\n' "$1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ "$MODE" != "audit" && "$MODE" != "fix" ]]; then
  printf 'Invalid --mode: %s\n' "$MODE" >&2
  exit 1
fi

if ! command -v claude >/dev/null 2>&1; then
  printf 'Error: `claude` CLI is not installed or not on PATH.\n' >&2
  exit 1
fi

if [[ ! -f "$SKILL_PATH" ]]; then
  printf 'Error: SEO skill not found at %s\n' "$SKILL_PATH" >&2
  exit 1
fi

if [[ -n "$EXTRA_PROMPT_FILE" && ! -f "$EXTRA_PROMPT_FILE" ]]; then
  printf 'Error: prompt file not found: %s\n' "$EXTRA_PROMPT_FILE" >&2
  exit 1
fi

mkdir -p "$WORKSPACE_ROOT"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
RUN_DIR="$WORKSPACE_ROOT/$TIMESTAMP"
mkdir -p "$RUN_DIR"
ln -sfn "$RUN_DIR" "$WORKSPACE_ROOT/latest"

PROMPT_PATH="$RUN_DIR/prompt.md"
REPORT_PATH="$RUN_DIR/report.md"
STDERR_PATH="$RUN_DIR/claude.stderr.log"
STATUS_PATH="$RUN_DIR/git-status.txt"
DIFFSTAT_PATH="$RUN_DIR/git-diff-stat.txt"
META_PATH="$RUN_DIR/run-metadata.txt"

if [[ -d "$ROOT_DIR/app" ]]; then
  APP_HINT='- app/ exists; prioritize routed pages, layouts, metadata generation, and user-facing content there.'
else
  APP_HINT='- No app/ directory detected; inspect the actual routing and page structure you find.'
fi

if [[ -d "$ROOT_DIR/public" ]]; then
  PUBLIC_HINT='- public/ exists; inspect assets that matter for SEO such as robots.txt, sitemap files, and public metadata artifacts.'
else
  PUBLIC_HINT='- No public/ directory detected; inspect generated or configured public SEO artifacts where they live.'
fi

if [[ -f "$ROOT_DIR/next.config.ts" || -f "$ROOT_DIR/next.config.js" || -f "$ROOT_DIR/next.config.mjs" ]]; then
  FRAMEWORK_HINT='- This appears to be a Next.js repo; inspect Next metadata, route files, sitemap or robots handlers, canonicals, schema output, and internal links.'
else
  FRAMEWORK_HINT='- Inspect the actual framework and routing setup before deciding where SEO logic lives.'
fi

{
  cat <<EOF
Use the project skill named 'seo-optimization' if it is available in this repository.

Repository root: $ROOT_DIR
Mode: $MODE

Task:
Perform a repo-wide SEO pass for this codebase, focused on organic Google Search.
Inspect the full repository, but prioritize files and templates that affect public,
indexable pages and search behavior.

Repo guidance:
$APP_HINT
$PUBLIC_HINT
$FRAMEWORK_HINT
- Ignore generated or dependency directories unless they directly affect shipped SEO behavior, especially .git/, node_modules/, and .next/.
- Look for technical SEO, on-page SEO, internal linking, local SEO, migration risks, and template-level SEO issues.
- Keep the scope practical: focus on the highest-impact findings, not a giant checklist.

Output requirements:
- Name the lead SEO lane you chose.
- Explain the most important repo-wide SEO issues first.
- When useful, point to concrete files, routes, templates, or page types.
- End with a prioritized action plan and a short measurement plan.
- Do not commit or push changes.
EOF

  if [[ "$MODE" == "audit" ]]; then
    cat <<'EOF'

Audit mode instructions:
- Do not modify files.
- Produce an implementation-ready audit for the whole repo.
- Call out the smallest high-impact fixes that should be made next.
EOF
  else
    cat <<'EOF'

Fix mode instructions:
- Make the smallest coherent repo changes that meaningfully improve SEO.
- Prefer template-level or configuration-level fixes over scattered one-off edits when the issue is systemic.
- After making changes, summarize exactly what you changed and any remaining gaps you could not safely fix.
EOF
  fi

  if [[ -n "$FOCUS" ]]; then
    printf '\nAdditional focus area:\n- %s\n' "$FOCUS"
  fi

  if [[ -n "$EXTRA_PROMPT_FILE" ]]; then
    printf '\nAdditional instructions from %s:\n\n' "$EXTRA_PROMPT_FILE"
    cat "$EXTRA_PROMPT_FILE"
    printf '\n'
  fi
} > "$PROMPT_PATH"

{
  printf 'timestamp=%s\n' "$TIMESTAMP"
  printf 'root_dir=%s\n' "$ROOT_DIR"
  printf 'mode=%s\n' "$MODE"
  printf 'focus=%s\n' "$FOCUS"
  printf 'skill_path=%s\n' "$SKILL_PATH"
  printf 'prompt_file=%s\n' "$PROMPT_PATH"
  printf 'report_file=%s\n' "$REPORT_PATH"
  printf 'stderr_file=%s\n' "$STDERR_PATH"
  if [[ -n "$MODEL" ]]; then
    printf 'model=%s\n' "$MODEL"
  fi
} > "$META_PATH"

if [[ "$DRY_RUN" == "true" ]]; then
  cat "$PROMPT_PATH"
  exit 0
fi

CLAUDE_CMD=(claude -p --output-format text)
if [[ -n "$MODEL" ]]; then
  CLAUDE_CMD+=(--model "$MODEL")
fi

printf 'Running SEO %s via claude -p...\n' "$MODE"
printf 'Workspace: %s\n' "$RUN_DIR"

if ! env -u CLAUDECODE "${CLAUDE_CMD[@]}" < "$PROMPT_PATH" \
  > >(tee "$REPORT_PATH") \
  2> >(tee "$STDERR_PATH" >&2); then
  printf '\nSEO run failed. See %s\n' "$STDERR_PATH" >&2
  exit 1
fi

git -C "$ROOT_DIR" status --short > "$STATUS_PATH"
git -C "$ROOT_DIR" diff --stat > "$DIFFSTAT_PATH" || true

printf '\nSaved files:\n'
printf '  prompt: %s\n' "$PROMPT_PATH"
printf '  report: %s\n' "$REPORT_PATH"
printf '  stderr: %s\n' "$STDERR_PATH"
printf '  git status: %s\n' "$STATUS_PATH"
printf '  git diff stat: %s\n' "$DIFFSTAT_PATH"
