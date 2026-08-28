import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(
  await readFile(resolve(projectRoot, "roboboy.panel.json"), "utf8"),
);
const module = await import(
  pathToFileURL(resolve(projectRoot, manifest.entryPoint)).href
);
const bundle = await readFile(resolve(projectRoot, manifest.entryPoint));
const integrity = `sha256-${createHash("sha256").update(bundle).digest("base64")}`;

if (
  manifest.schemaVersion !== 1 ||
  !manifest.id ||
  !manifest.version ||
  !manifest.entryPoint ||
  !manifest.integrity
) {
  throw new Error("roboboy.panel.json is missing required metadata.");
}
if (integrity !== manifest.integrity) {
  throw new Error(
    `Bundle integrity does not match roboboy.panel.json: expected ${manifest.integrity}, received ${integrity}.`,
  );
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

const instance = await module.default.activate({
  storage: null,
  logger: { debug() {}, info() {}, warn() {}, error() {} },
});
if (
  typeof instance?.mount !== "function" ||
  typeof instance?.unmount !== "function"
) {
  throw new Error(
    "The panel instance must provide mount and unmount functions.",
  );
}

console.log(`Validated ${manifest.id}@${manifest.version}`);
