# Robo-Boy Hello Panel

This is the smallest viable independently maintained Robo-Boy panel. Its source and release artifact live outside
the Robo-Boy core repository.

## Structure

```text
roboboy.panel.json       Panel metadata, compatibility, capabilities, and entry point
src/index.ts             Typed source using @tessel-la/roboboy-panel-sdk
dist/index.js            Framework-neutral ESM release artifact
scripts/validate-artifact.mjs
```

## Develop

Install the published type-only SDK and build:

```bash
npm install
npm run build
npm run validate
```

The SDK is imported with `import type`, so it contributes no runtime code. `dist/index.js` has no bare imports and
can be loaded directly by a browser or Tauri webview.

## Publish

Create a release containing `roboboy.panel.json` and `dist/index.js`, then add or update this panel's metadata in
the separate Robo-Boy Panel Inventory repository. Installation copies the artifact into a Robo-Boy deployment's
same-origin `panels/` directory and adds the manifest to `panels/installed.json`.

The declared `storage` capability gives this example a host-namespaced JSON store. The greeting counter
demonstrates that state survives panel remounts and workspace export/import without direct access to Robo-Boy's
internal stores.
