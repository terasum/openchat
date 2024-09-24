import { globbySync } from "globby";
import { resolve } from "path";

function getTauriDir(root) {
  const tauriConfPaths = globbySync(
    ["**/tauri.conf.json", "**/tauri.conf.json5", "**/Tauri.toml", "**/tauri.conf.template.json"],
    {
      gitignore: true,
      cwd: root,
      // Forcefully ignore target and node_modules dirs
      ignore: ["**/target", "**/node_modules"],
    }
  );

  if (tauriConfPaths.length === 0) {
    return null;
  }

  return resolve(root, tauriConfPaths[0], "..");
}

const projectPath = process.argv[2];
console.log(projectPath);

const tauriDir = getTauriDir(projectPath);
console.log(tauriDir);
