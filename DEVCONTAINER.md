# Devcontainer

This repo now includes a devcontainer for a Next.js + TypeScript workflow with OpenCode and Get Shit Done for OpenCode preinstalled.

## Included

- Node.js 22
- `opencode-ai@1.4.3`
- Get Shit Done for OpenCode via `gsd-opencode@1.33.1`
- Port `3000` forwarding for `next dev`
- A persistent volume for `~/.config/opencode` so OpenCode auth and GSD setup survive rebuilds

## Use it

1. Open the repository in the devcontainer.
2. Wait for `.devcontainer/post-create.sh` to finish.
3. Run `opencode`.
4. In OpenCode, run `/connect` to configure your provider.
5. Run `/gsd-help` to confirm Get Shit Done for OpenCode is available.
6. Start your app with your package manager, for example `npm run dev`.

If `package.json` already exists, the post-create script installs dependencies automatically.

If you have not scaffolded the Next app yet, do it from inside the container:

```bash
npx create-next-app@latest . --ts
```
