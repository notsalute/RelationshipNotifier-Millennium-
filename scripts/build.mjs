import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const loader = join(root, "frontend", "loader");
const src = join(root, "frontend", "src");
const output = join(root, ".millennium", "Dist", "index.js");

const sources = [
    "core/constants.js",
    "core/kinds.js",
    "core/storage.js",
    "core/settings.js",
    "steam/friends.js",
    "steam/selfActions.js",
    "steam/windows.js",
    "steam/desktopNotify.js",
    "ui/styles.js",
    "ui/icons.js",
    "ui/dom.js",
    "ui/toast.js",
    "core/notify.js",
    "core/watcher.js",
    "ui/tray.js",
    "ui/panel.js",
    "ui/millenniumTab.js",
    "ui/hotkeys.js",
    "main.js",
];

const read = (path) => readFileSync(path, "utf8").trim();

const bundle = [
    read(join(loader, "header.js")),
    ...sources.map((file) => read(join(src, file))),
    read(join(loader, "footer.js")),
].join("\n\n") + "\n";

mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, bundle);

console.log(`Built .millennium/Dist/index.js from ${sources.length} source files`);
