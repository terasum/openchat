#!/usr/bin/env sh
set -evx
FILEPATH=$(readlink -f $0)
ROOTDIR=$(readlink -f "$(dirname "$FILEPATH")/../")
echo ${ROOTDIR}
echo args: $@
if [ -e "${ROOTDIR}/src-tauri/Cargo.toml" ]; then
    sed "s|#__ROOTDIR__#|${ROOTDIR}|g" ${ROOTDIR}/src-tauri/tauri.conf.template.json > ${ROOTDIR}/src-tauri/tauri.conf.json
    npx tauri $@
else
    echo "${ROOTDIR}src-tauri/Cargo.toml not found, skipping tauri commands"
fi
