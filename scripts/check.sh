#!/bin/sh
set -eu
bun run check
# Blacksmith is the runner used by the reference HAB project.
actionlint -ignore 'label "blacksmith-2vcpu-ubuntu-2404" is unknown'
git diff --check
