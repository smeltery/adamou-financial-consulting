#!/bin/sh
set -eu
bun run check
actionlint
git diff --check
