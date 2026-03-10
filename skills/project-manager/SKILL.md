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

## When to Use

This skill activates when the user wants to work with project workspaces, load project context, or manage project memory.

---

## Trigger Phrases

- "load project"
- "switch to project"
- "work on project"
- "create new project"
- "show available projects"
- "load project context"
- "switch project"

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

- **User says 'load project', 'switch to project', 'work on project', or 'show available projects'**: Scan PROJECT_PARENT_PATH for folders containing project.json, present list to user, then load selected project
- **User provides a specific project name**: Verify project exists, load its project.json, instructions.md, and project_memory.md into context
- **User asks to 'create a new project' or 'create project'**: Walk through new project creation workflow
- **User asks about current project**: Display loaded project context and memory

### Steps

#### Step 1: Scan Available Projects

Search PROJECT_PARENT_PATH for folders containing project.json

**Prompts for**: `PROJECT_PARENT_PATH`

#### Step 2: Present Project List

Display found projects to user for selection

**Prompts for**: 

#### Step 3: Load Project Context

Read project.json, instructions.md, and project_memory.md from selected project

**Prompts for**: `PROJECT_NAME`

#### Step 4: Confirm Loaded

Tell user what was loaded and confirm ready for questions

**Prompts for**: 

#### Step 5: Update Project Memory

After each Q&A, append summary to project_memory.md

**Prompts for**: 

---

## Validation Rules

### PROJECT_PARENT_PATH

- **Type**: pattern
- **Pattern**: `^[A-Za-z]:[/\\].+`
- **Error**: Must be a valid Windows path

### PROJECT_NAME

- **Type**: string
- **Pattern**: `^[a-zA-Z0-9-_]+$`
- **Error**: Must be alphanumeric with hyphens/underscores allowed

---

## Templates

Reference these template files:

- `templates/project.json`
- `templates/instructions.md`
- `templates/project_memory.md`

---

## Examples

### Example 1: Load Existing Project

**User says:** "Load the sales-proposal-2026 project"

**Actions:**

1. Scan PROJECT_PARENT_PATH for project.json files
2. Verify sales-proposal-2026 exists
3. Load project.json, instructions.md, and project_memory.md
4. Confirm what was loaded

**Result:** "Loaded sales-proposal-2026. Context: [summary of project]. Ready for your questions."

### Example 2: Show Available Projects

**User says:** "Show me what projects I can work on"

**Actions:**

1. Scan PROJECT_PARENT_PATH for project.json files
2. Present list of available projects with brief descriptions

**Result:** "Found 5 projects: [list with names and descriptions]. Which one would you like to work on?"

### Example 3: Create New Project

**User says:** "Create a new project called Q1-Marketing-Campaign"

**Actions:**

1. Create folder structure at PROJECT_PARENT_PATH/Q1-Marketing-Campaign/
2. Create project.json from template
3. Create instructions.md from template
4. Create project_memory.md from template
5. Confirm creation

**Result:** "Created Q1-Marketing-Campaign with standard template. Would you like to add custom instructions?"

### Example 4: Switch Projects

**User says:** "Switch to the website-redesign project"

**Actions:**

1. Verify website-redesign exists
2. Save current project memory if loaded
3. Load website-redesign context
4. Confirm switch

**Result:** "Switched to website-redesign. Context loaded from [date]. What would you like to work on?"

---

## Project Structure

Each project folder should contain:

```
{project-name}/
├── project.json           # Project metadata
├── instructions.md        # Project-specific instructions
├── project_memory.md      # Persistent memory/context
└── ...                    # Project files
```

### project.json Schema

```json
{
  "id": "project-name",
  "name": "Project Name",
  "description": "Brief project description",
  "created_at": "2026-01-01T00:00:00Z",
  "last_loaded": "2026-03-10T00:00:00Z"
}
```

### instructions.md

Contains project-specific guidelines, conventions, and instructions for the AI to follow when working on this project.

### project_memory.md

Persistent memory that retains:
- Key decisions made
- Important context from previous sessions
- Project-specific terminology
- User preferences

---

## Best Practices

### 1. Update Memory After Each Session
Always append session summaries to project_memory.md to maintain context across sessions.

### 2. Use Consistent Project Names
Use lowercase with hyphens: `my-project-name` not `My Project Name`

### 3. Keep Instructions Updated
Review and update instructions.md when project conventions change.

### 4. Load Projects Early
At the start of each session, load the project context before beginning work.

---

## Common Workflows

### Starting a New Session

```bash
# User wants to continue working on a project
User: Load the website-redesign project
Skill: [loads context from project files]
```

### Switching Projects

```bash
# User wants to switch to different project
User: Switch to the API-integration project
Skill: [saves current memory, loads new project]
```

### Creating New Project

```bash
# User starts entirely new project
User: Create a new project called mobile-app-v2
Skill: [creates folder structure from templates]
```

---

## Tips

### 1. Always Specify PROJECT_PARENT_PATH
If not already configured, ask the user for the parent path containing all projects.

### 2. Verify Project Exists
Before loading, always verify the project folder and required files exist.

### 3. Maintain Memory Continuity
Append to project_memory.md after significant conversations to preserve context.

### 4. Use Templates
When creating new projects, use the provided templates for consistency.

---

## Troubleshooting

### Error: "No projects found"

**Cause:** PROJECT_PARENT_PATH doesn't contain any folders with project.json

**Solution:** Verify the path is correct and projects have been created there

### Error: "Project not found"

**Cause:** Specified project doesn't exist in PROJECT_PARENT_PATH

**Solution:** Run "show available projects" to see valid options

### Error: "Missing project files"

**Cause:** Project folder exists but missing required files (project.json, instructions.md, project_memory.md)

**Solution:** Recreate missing files from templates or create new project

### Error: "Invalid path"

**Cause:** PROJECT_PARENT_PATH is not a valid Windows path

**Solution:** Ensure path starts with drive letter (e.g., C:/ or D:/)

---

## File Locations

- **Skill**: `.opencode/skills/project-manager/`
- **Templates**: `.opencode/skills/project-manager/templates/`
- **Documentation**: `.opencode/skills/project-manager/SKILL.md` (this file)

---

**Project Manager Skill** - Manage project workspaces with persistent context and memory!
