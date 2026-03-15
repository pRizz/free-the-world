#!/usr/bin/env bash

set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "Usage: bash scripts/ci/archive-pages-artifact.sh <input-dir> <output-tar>" >&2
  exit 1
fi

input_dir="$1"
output_tar="$2"

if tar --help 2>&1 | grep -q -- "--hard-dereference"; then
  tar \
    --dereference \
    --hard-dereference \
    --directory "$input_dir" \
    -cvf "$output_tar" \
    --exclude=.git \
    --exclude=.github \
    --exclude=".[^/]*" \
    .
  exit 0
fi

shopt -s nullglob
visible_entries=("$input_dir"/*)

if [ "${#visible_entries[@]}" -eq 0 ]; then
  tar --dereference -cvf "$output_tar" -T /dev/null
  exit 0
fi

relative_entries=()
for entry in "${visible_entries[@]}"; do
  relative_entries+=("$(basename "$entry")")
done

tar \
  --dereference \
  --directory "$input_dir" \
  -cvf "$output_tar" \
  "${relative_entries[@]}"
