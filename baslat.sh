#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

command -v node >/dev/null || { echo "HATA: Node.js bulunamadi -> https://nodejs.org"; exit 1; }
[ -d node_modules ] || npm install

echo "1) dev   2) preview   3) build   4) typecheck"
read -rp "Seciminiz [1]: " mod
case "${mod:-1}" in
  2) npm run build && npm run preview -- --open ;;
  3) npm run build ;;
  4) npm run typecheck ;;
  *) npm run dev -- --open ;;
esac
