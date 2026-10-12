#!/bin/sh
set -eu
# Run the same browser and fonts on macOS and CI; only reviewed updates replace baselines.
docker run --rm --ipc=host --platform linux/amd64 \
  --user "$(id -u):$(id -g)" -e HOME=/tmp \
  -v "$PWD:/work" -w /work/apps/site \
  mcr.microsoft.com/playwright:v1.64.0-noble@sha256:06a9939e57531807f8d5fd76ce44b53165ffb7d7501d87ab10e285c20b1e971f \
  node ../../node_modules/@playwright/test/cli.js test --config playwright.visual.config.ts "$@"
