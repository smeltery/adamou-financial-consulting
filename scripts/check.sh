#!/bin/sh
set -eu
bun run check
bun run check:visual
actionlint
git diff --check
