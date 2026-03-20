## Why

The repository currently mixes OpenSpec `/opsx:*` workflows with a separate custom Copilot workflow kit under `.github/agents`, `.github/prompts`, and related customization docs. That overlap makes the supported workflow surface unclear and increases maintenance cost when both systems need to be kept in sync.

## What Changes

- Remove the repo-specific custom workflow kit and keep the OpenSpec `/opsx:*` workflow path as the only supported proposal and implementation workflow.
- Remove or trim customization files that exist only to support the custom workflow kit when they are redundant with OpenSpec.
- Update remaining workflow-facing instructions so they no longer point contributors at deleted custom workflows or deleted documentation.
- Preserve OpenSpec change authoring and application flows already used by `/opsx:new`, `/opsx:apply`, `/opsx:archive`, and `/opsx:explore`.

## Capabilities

### New Capabilities
- `opsx-workflows`: Defines the repository-supported workflow surface so contributors have one canonical OpenSpec-driven path for change proposal and implementation.

### Modified Capabilities
- None.

## Impact

- Affected areas: `.github/agents/`, `.github/prompts/`, `.github/skills/`, `.github/copilot-instructions.md`, and other workflow-facing repo metadata.
- No product runtime behavior changes are expected in `apps/web` or `apps/api`.
- Existing contributors using custom workflow entry points will need to use `/opsx:*` commands instead.