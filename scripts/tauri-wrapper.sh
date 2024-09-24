#!/usr/bin/env sh
set -evx
FILEPATH=$(readlink -f $0)
ROOTDIR=$(readlink -f "$(dirname "$FILEPATH")/../")
echo $ROOTDIR
echo args: $@
if [ -e src-tauri/Cargo.toml ]; then
    sed "s|#__ROOTDIR__#|${ROOTDIR}|g" src-tauri/tauri.conf.template.json > src-tauri/tauri.conf.json
    npx tauri $@
else
    echo "src-tauri/Cargo.toml not found, skipping tauri commands"
fi
