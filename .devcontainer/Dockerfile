ARG NODE_VARIANT=22-bookworm
FROM mcr.microsoft.com/devcontainers/javascript-node:1-${NODE_VARIANT}

ARG OPENCODE_VERSION=1.4.3
ARG GSD_OPENCODE_VERSION=1.33.1

RUN npm install -g "opencode-ai@${OPENCODE_VERSION}" "gsd-opencode@${GSD_OPENCODE_VERSION}" \
    && npm cache clean --force
