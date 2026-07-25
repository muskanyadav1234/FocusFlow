#!/usr/bin/env bash
set -e

printf '\n========================================\n'
printf '  FocusFlow - Local Development Server\n'
printf '========================================\n\n'

if [ ! -f package.json ]; then
  echo "package.json was not found in this folder."
  echo "Open the real FocusFlow project folder that contains package.json, src, and vite.config.ts."
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed. Install Node.js LTS from https://nodejs.org/ and try again."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is not installed. Reinstall Node.js LTS from https://nodejs.org/ and try again."
  exit 1
fi

echo "Installing dependencies..."
npm install

echo
echo "Starting FocusFlow..."
npm run dev
