#!/usr/bin/env bash
set -euo pipefail
if [ $# -lt 1 ]; then
  echo "Usage: $0 /absolute/path/to/game-repo"
  exit 1
fi
TARGET="$1"
echo "Applying game forwarder into: $TARGET"
mkdir -p "$TARGET/api"
cp -v "api/track-proxy.js" "$TARGET/api/track-proxy.js"
cp -v ".env.example" "$TARGET/.env.example"
echo "Done. Commit and deploy on your GAME project."
