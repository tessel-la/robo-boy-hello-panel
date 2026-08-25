import { readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(
  await readFile(resolve(projectRoot, "roboboy.panel.json"), "utf8"),
);
const module = await import(
  pathToFileURL(resolve(projectRoot, manifest.entryPoint)).href
);

if (
  manifest.schemaVersion !== 1 ||
  !manifest.id ||
  !manifest.version ||
  !manifest.entryPoint
) {
  throw new Error("roboboy.panel.json is missing required metadata.");
}
if (
  !module.default ||
  module.default.id !== manifest.id ||
  module.default.apiVersion !== "1.0.0"
) {
  throw new Error("The built module does not match roboboy.panel.json.");
}
if (typeof module.default.activate !== "function") {
  throw new Error("The built module must export an activate function.");
}

console.log(`Validated ${manifest.id}@${manifest.version}`);
