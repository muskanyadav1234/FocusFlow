# FocusFlow - VS Code Setup

## Easiest way on Windows

1. Unzip the project.
2. Open the unzipped `FocusFlow` folder in VS Code.
3. Double-click `run-windows.cmd`, or run this in the VS Code terminal:

```powershell
.\run-windows.cmd
```

The script automatically moves into the correct folder, installs packages, and starts the app.

## Manual run

If you prefer commands, open the folder that contains `package.json`, then run:

```bash
npm install
npm run dev
```

## If you see `Missing script: "dev"`

You are not in the correct folder, or you are using an old/wrong zip.

Run this command:

```bash
dir
```

You must see `package.json`, `src`, `vite.config.ts`, and `run-windows.cmd` in the same folder. If not, open the inner `FocusFlow` folder in VS Code.

## Normal npm messages

- `packages are looking for funding` is normal.
- The npm update notice is optional.
- Audit warnings can be reviewed with `npm audit`, but they do not stop `npm run dev` from working.
