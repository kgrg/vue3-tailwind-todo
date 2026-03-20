## ADDED Requirements

### Requirement: Repository exposes a single guided workflow system
The repository SHALL expose OpenSpec `/opsx:*` workflows as the only guided workflow path for proposing, exploring, applying, and archiving changes.

#### Scenario: Contributor looks for workflow entry points
- **WHEN** a contributor inspects repository workflow customization files
- **THEN** the remaining workflow guidance points to OpenSpec `/opsx:*` commands rather than a parallel custom workflow kit

### Requirement: Redundant custom workflow artifacts are removed
The repository SHALL remove repo-specific workflow artifacts whose primary purpose duplicates OpenSpec workflow orchestration.

#### Scenario: Redundant workflow files are present before cleanup
- **WHEN** the cleanup change is applied
- **THEN** duplicated custom workflow agents, prompts, and related workflow-only artifacts are removed from the repository

### Requirement: Surviving guidance remains internally consistent
The repository SHALL update surviving workflow-facing instructions so they do not reference removed custom workflows or deleted workflow-supporting documents.

#### Scenario: A surviving instruction references deleted workflow content
- **WHEN** a contributor reads the remaining workflow guidance after cleanup
- **THEN** they are not directed to files or commands that were removed by this change