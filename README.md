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

Install dependencies and build:

```bash
npm install
npm run build
npm run integrity
npm run validate
```

The SDK is imported with `import type`, so it contributes no runtime code. Until the SDK package is published,
point its development dependency at Robo-Boy's local `panel-sdk/` directory. `dist/index.js` has no bare imports
and can be loaded directly by a browser or Tauri webview.

After any bundle change, copy the value printed by `npm run integrity` into `roboboy.panel.json`. Validation checks
that hash as well as the module ID, API version, activation function, and required mount/unmount lifecycle.

## Publish

Create an immutable release containing `roboboy.panel.json` and `dist/index.js`, then add or update this panel's
metadata and integrity value in the separate Robo-Boy Panel Inventory repository. Installation copies the
artifact into a versioned Robo-Boy path such as `panels/hello-panel/1.0.0/index.js` and adds the installed
manifest to `panels/installed.json`.

The declared `storage` capability gives this example a host-namespaced JSON store. The greeting counter
demonstrates that state survives panel remounts and workspace export/import without direct access to Robo-Boy's
internal stores.

This directory is a workspace prototype. The repository/package names describe the intended publication shape;
they do not imply that a public npm package or GitHub release already exists.
