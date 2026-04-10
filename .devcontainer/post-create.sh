#!/usr/bin/env bash
set -euo pipefail

OPENCODE_CONFIG_DIR="${OPENCODE_CONFIG_DIR:-$HOME/.config/opencode}"
export OPENCODE_CONFIG_DIR

mkdir -p "$OPENCODE_CONFIG_DIR"

if [ ! -f "$OPENCODE_CONFIG_DIR/VERSION" ]; then
  gsd-opencode install --global
fi

if [ -f "package.json" ]; then
  if [ -f "pnpm-lock.yaml" ]; then
    corepack pnpm install
  elif [ -f "yarn.lock" ]; then
    corepack yarn install
  elif [ -f "package-lock.json" ]; then
    npm ci
  else
    npm install
  fi
fi

printf '\nOpenCode and Get Shit Done for OpenCode are installed. Start it with `opencode`, then run `/connect` and `/gsd-help`.\n'
