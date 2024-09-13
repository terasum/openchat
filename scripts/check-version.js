/* eslint-disable no-console */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import toml from 'toml'

import versionJson from '../src/version.json' assert { type: 'json' }

const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const base_dir = path.join(path.dirname(__filename), '..')

// package.json
const package_version_file = path.join(base_dir, 'package.json')
const package_info = JSON.parse(fs.readFileSync(package_version_file))
const package_version = package_info.version

// cargo.toml
const tauri_conf_file = path.join(base_dir, 'src-tauri', 'cargo.toml')
var tauri_data = toml.parse(fs.readFileSync(tauri_conf_file))
const cargo_package_version = tauri_data.package.version

// =========================== main ================
const src_version = versionJson.version

if (
  package_version !== cargo_package_version ||
  package_version !== src_version ||
  cargo_package_version !== src_version
) {
  console.log('package.json version:', package_version)
  console.log('src/version.json version:', src_version)
  console.log('cargo.toml version:', cargo_package_version)
  console.log('version not match')
  // eslint-disable-next-line no-undef
  process.exit(1)
}

console.log(package_version)
