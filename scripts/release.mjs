import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const plugin = JSON.parse(readFileSync(join(root, "plugin.json"), "utf8"));

const releaseDir = join(root, "release");
const stageDir = join(releaseDir, "stage");
const packageDir = join(stageDir, plugin.name);
const zipName = `${plugin.name}-v${plugin.version}.zip`;
const zipPath = join(releaseDir, zipName);

const contents = ["plugin.json", "README.md", "LICENSE", "backend", ".millennium"];

execFileSync(process.execPath, [join(root, "scripts", "build.mjs")], { stdio: "inherit" });

rmSync(stageDir, { recursive: true, force: true });
rmSync(zipPath, { force: true });
mkdirSync(packageDir, { recursive: true });

for (const entry of contents) {
    const from = join(root, entry);
    if (existsSync(from)) cpSync(from, join(packageDir, entry), { recursive: true });
}

if (process.platform === "win32") {
    const tar = join(process.env.SystemRoot || "C:\\Windows", "System32", "tar.exe");
    execFileSync(tar, ["-a", "-c", "-f", zipPath, "-C", stageDir, plugin.name], { stdio: "inherit" });
} else {
    execFileSync("zip", ["-r", "-q", zipPath, plugin.name], { cwd: stageDir, stdio: "inherit" });
}

rmSync(stageDir, { recursive: true, force: true });

console.log(`Release ready: release/${zipName}`);
