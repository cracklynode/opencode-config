---
name: project-manager
description: Manages project workspaces with persistent context and memory across sessions
version: 1.0.0
author: Nick Foard
type: skill
category: business
tags:
  - project
  - workspace
  - memory
  - context
---


# project-manager

> **Purpose**: Load project context (instructions.md, project_memory.md, documents), maintain conversation history across sessions, and provide persistent workspace memory

---

## Tone & Style

Helpful, professional, proactive in maintaining project memory

---

## Placeholders

| Placeholder | Description | Type | Required |
|-------------|-------------|------|----------|
| `PROJECT_PARENT_PATH` | The parent folder containing all projects (e.g., C:/Users/nick.foard/Projects) | string | Yes |
| `PROJECT_NAME` | The name of the project folder to work with | string | No |
| `CUSTOM_INSTRUCTIONS` | Custom instructions or workflow preferences for this project | string | No |

---

## Workflow

### Conditional Paths

- **User says 'load project' or 'switch to project' or 'work on project'**: Scan PROJECT_PARENT_PATH for folders containing project.json, present list to user, then load selected project
- **User provides a specific project name**: Verify project exists, load its project.json, instructions.md, and project_memory.md into context
- **User asks to create a new project**: Walk through new project creation workflow

### Steps

#### Step 1: Scan Available Projects

Search PROJECT_PARENT_PATH for folders containing project.json

**Prompts for**: 

#### Step 2: Load Project Context

Read project.json, instructions.md, and project_memory.md from selected project

**Prompts for**: `PROJECT_NAME`

#### Step 3: Confirm Loaded

Tell user what was loaded and confirm ready for questions

**Prompts for**: 

#### Step 4: Update Project Memory

After each Q&A, append summary to project_memory.md

**Prompts for**: 

---

## Validation Rules

### PROJECT_PARENT_PATH

- **Type**: pattern
- **Pattern**: `^[A-Za-z]:[/\\].+`
- **Error**: Must be a valid Windows path

---

## Templates

Reference these template files:

- `templates/project.json`
- `templates/instructions.md`
- `templates/project_memory.md`

---

## Examples

### Load existing project

User wants to work on an existing project

```
User: Load the sales-proposal-2026 project
Skill: Scanning C:/Users/nick.foard/Projects... Found 5 projects with project.json: [list]. Which one?
```

### Create new project

User wants to start a new project

```
User: Create a new project called Q1-Marketing-Campaign
Skill: Creating folder structure...
```

