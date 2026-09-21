#!/bin/zsh
cd "$(dirname "$0")"
open http://127.0.0.1:8765/fleet.html
python3 -m http.server 8765 --bind 127.0.0.1
