---
name: task-management
description: Task management CLI for tracking and managing feature subtasks with status, dependencies, and validation
version: 1.0.0
author: opencode
type: skill
category: development
tags:
  - tasks
  - management
  - tracking
  - dependencies
  - cli
---

# Task Management Skill

> **Purpose**: Track, manage, and validate feature implementations with atomic task breakdowns, dependency resolution, and progress monitoring.

---

## When to Use

This skill activates when the user wants to track, manage, or validate feature implementation tasks.

---

## Trigger Phrases

- "show task status"
- "what's next task"
- "mark task complete"
- "check blocked tasks"
- "validate tasks"
- "find parallel tasks"
- "show task dependencies"
- "track feature progress"

---

## Tone & Style

Direct, actionable output. Focus on clear status reporting and task progression.

---

## Placeholders

| Placeholder | Description | Type | Required |
|-------------|-------------|------|----------|
| `FEATURE_NAME` | The feature/task folder name to operate on | string | No |
| `SUBTASK_SEQ` | The sequence number of the subtask (e.g., 05) | string | No |
| `COMPLETION_SUMMARY` | Summary text when marking a task complete | string | No |
| `COMMAND` | The command to execute: status, next, blocked, complete, validate, deps, parallel | enum | Yes |

---

## Workflow

### Conditional Paths

- **Command is 'status'**: Show task status summary for all features or specified feature
- **Command is 'next'**: Show eligible tasks (dependencies satisfied)
- **Command is 'blocked'**: Show blocked tasks and why they are blocked
- **Command is 'parallel'**: Show tasks that can run in parallel
- **Command is 'complete'**: Mark subtask complete with summary (requires FEATURE_NAME, SUBTASK_SEQ, COMPLETION_SUMMARY)
- **Command is 'validate'**: Validate JSON files and dependency trees
- **Command is 'deps'**: Show dependency tree for specific subtask

### Steps

#### Step 1: Execute Command

Call the appropriate router.sh command based on user's request.

**Parameters:** COMMAND, FEATURE_NAME, SUBTASK_SEQ, COMPLETION_SUMMARY

**Prompts for**: `COMMAND`, `FEATURE_NAME`, `SUBTASK_SEQ`, `COMPLETION_SUMMARY` (as needed)

---

## Validation Rules

### COMMAND

- **Type**: enum
- **Values**: status, next, blocked, complete, validate, deps, parallel
- **Error**: Must be a valid command

### FEATURE_NAME

- **Type**: string
- **Pattern**: `^[a-z0-9-]+$`
- **Error**: Must be lowercase with hyphens (e.g., my-feature)

### SUBTASK_SEQ

- **Type**: pattern
- **Pattern**: `^\d{2}$`
- **Error**: Must be two-digit sequence (e.g., 01, 02)

---

## Examples

### Example 1: Check Overall Progress

**User says:** "Show me the task status"

**Actions:**

1. Execute `bash .opencode/skills/task-management/router.sh status`
2. Return formatted output showing all features and their progress

**Result:**
```
[my-feature] My Feature Implementation
  Status: active | Progress: 45% (5/11)
  Pending: 3 | In Progress: 2 | Completed: 5 | Blocked: 1
```

### Example 2: Find What's Next

**User says:** "What tasks can I work on next?"

**Actions:**

1. Execute `bash .opencode/skills/task-management/router.sh next`
2. Return tasks with satisfied dependencies

**Result:**
```
=== Ready Tasks (deps satisfied) ===

[my-feature]
  06 - Implement API endpoint [sequential]
  08 - Write unit tests [parallel]
```

### Example 3: Mark Task Complete

**User says:** "Mark subtask 05 as complete with summary 'Implemented authentication module'"

**Actions:**

1. Execute `bash .opencode/skills/task-management/router.sh complete my-feature 05 "Implemented authentication module"`
2. Return confirmation with updated progress

**Result:**
```
✓ Marked my-feature/05 as completed
  Summary: Implemented authentication module
  Progress: 6/11
```

### Example 4: Check Dependencies

**User says:** "Show dependencies for subtask 07"

**Actions:**

1. Execute `bash .opencode/skills/task-management/router.sh deps my-feature 07`
2. Return dependency tree

**Result:**
```
=== Dependency Tree: my-feature/07 ===

07 - Write integration tests [pending]
  ├── ✓ 05 - Implement authentication module [completed]
  └── ○ 06 - Implement API endpoint [in_progress]
```

### Example 5: Validate Tasks

**User says:** "Validate all tasks"

**Actions:**

1. Execute `bash .opencode/skills/task-management/router.sh validate`
2. Return validation results

**Result:**
```
=== Validation Results ===

[my-feature]
  ✓ All checks passed
```

---

## Task File Structure

Tasks are stored in `.tmp/tasks/` at the project root:

```
.tmp/tasks/
├── {feature-slug}/
│   ├── task.json                     # Feature-level metadata
│   ├── subtask_01.json               # Subtask definitions
│   ├── subtask_02.json
│   └── ...
└── completed/
    └── {feature-slug}/               # Completed tasks
```

### task.json Schema

```json
{
  "id": "my-feature",
  "name": "My Feature",
  "status": "active",
  "objective": "Implement X",
  "context_files": ["docs/spec.md"],
  "reference_files": ["src/existing.ts"],
  "exit_criteria": ["Tests pass", "Code reviewed"],
  "subtask_count": 5,
  "completed_count": 2,
  "created_at": "2026-01-11T10:00:00Z",
  "completed_at": null
}
```

### subtask_##.json Schema

```json
{
  "id": "my-feature-05",
  "seq": "05",
  "title": "Implement authentication",
  "status": "pending",
  "depends_on": ["03", "04"],
  "parallel": false,
  "suggested_agent": "coder-agent",
  "context_files": ["docs/auth.md"],
  "reference_files": ["src/auth-old.ts"],
  "acceptance_criteria": ["Login works", "JWT tokens valid"],
  "deliverables": ["auth.ts", "auth.test.ts"],
  "started_at": null,
  "completed_at": null,
  "completion_summary": null
}
```

---

## Key Concepts

### 1. Dependency Resolution
Subtasks can depend on other subtasks. A task is "ready" only when all its dependencies are complete.

### 2. Parallel Execution
Set `parallel: true` to indicate a subtask can run alongside other parallel tasks with satisfied dependencies.

### 3. Status Tracking
- **pending** - Not started, waiting for dependencies
- **in_progress** - Currently being worked on
- **completed** - Finished with summary
- **blocked** - Explicitly blocked (not waiting for deps)

### 4. Exit Criteria
Each feature has exit_criteria that must be met before marking the feature complete.

### 5. Validation Rules

The `validate` command performs comprehensive checks on task files:

**Task-Level Validation:**
- ✅ task.json file exists for the feature
- ✅ Task ID matches feature slug
- ✅ Subtask count in task.json matches actual subtask files
- ✅ All required fields are present

**Subtask-Level Validation:**
- ✅ All subtask IDs start with feature name (e.g., "my-feature-01")
- ✅ Sequence numbers are unique and properly formatted (01, 02, etc.)
- ✅ All dependencies reference existing subtasks
- ✅ No circular dependencies exist
- ✅ Each subtask has acceptance criteria defined
- ✅ Each subtask has deliverables specified
- ✅ Status values are valid (pending, in_progress, completed, blocked)

**Dependency Validation:**
- ✅ All depends_on references point to existing subtasks
- ✅ No task depends on itself
- ✅ No circular dependency chains
- ✅ Dependency graph is acyclic

### 6. Context and Reference Files
- **context_files** - Standards, conventions, and guidelines to follow
- **reference_files** - Existing project files to look at or build upon

---

## Integration with TaskManager

The TaskManager subagent creates task files using this format. When you delegate to TaskManager:

```javascript
task(
  subagent_type="TaskManager",
  description="Implement feature X",
  prompt="Break down this feature into atomic subtasks..."
)
```

TaskManager creates:
1. `.tmp/tasks/{feature}/task.json` - Feature metadata
2. `.tmp/tasks/{feature}/subtask_XX.json` - Individual subtasks

You can then use this skill to track and manage progress.

---

## Common Workflows

### Starting a New Feature

```bash
# 1. TaskManager creates the task structure
task(subagent_type="TaskManager", description="Implement feature X", ...)

# 2. Check what's ready
bash .opencode/skills/task-management/router.sh next

# 3. Delegate first task to working agent
task(subagent_type="CoderAgent", description="Implement subtask 01", ...)
```

### Tracking Progress

```bash
# Check overall status
bash .opencode/skills/task-management/router.sh status my-feature

# See what's next
bash .opencode/skills/task-management/router.sh next my-feature

# Check what's blocked
bash .opencode/skills/task-management/router.sh blocked my-feature
```

### Completing Tasks

```bash
# After working agent finishes
bash .opencode/skills/task-management/router.sh complete my-feature 05 "Implemented auth module with JWT support"

# Check progress
bash .opencode/skills/task-management/router.sh status my-feature

# Find next task
bash .opencode/skills/task-management/router.sh next my-feature
```

---

## Tips & Best Practices

### 1. Use Meaningful Summaries
When marking tasks complete, provide clear summaries:
```bash
# Good
complete my-feature 05 "Implemented JWT authentication with refresh tokens and error handling"

# Avoid
complete my-feature 05 "Done"
```

### 2. Check Dependencies Before Starting
```bash
# See what a task depends on
bash .opencode/skills/task-management/router.sh deps my-feature 07
```

### 3. Identify Parallelizable Work
```bash
# Find tasks that can run in parallel
bash .opencode/skills/task-management/router.sh parallel my-feature
```

### 4. Regular Validation
```bash
# Validate regularly to catch issues early
bash .opencode/skills/task-management/router.sh validate
```

---

## Troubleshooting

### Error: "task-cli.ts not found"

**Cause:** Not running from project root or router.sh cannot find the CLI script

**Solution:** Ensure you're running from the project root directory

### Error: "No tasks found"

**Cause:** No tasks have been created yet

**Solution:** Use TaskManager to create tasks first, then run `status` to see them

### Error: "Dependency not satisfied"

**Cause:** Task has unresolved dependencies

**Solution:** Check the dependency tree with `deps` to see what's blocking the task

### Error: "Validation failed"

**Cause:** Task JSON files have inconsistencies or errors

**Solution:** Run `validate` to see specific issues, then check the JSON files in `.tmp/tasks/`

---

## Architecture

```
.opencode/skills/task-management/
├── SKILL.md                          # This file
├── router.sh                         # CLI router (entry point)
└── scripts/
    └── task-cli.ts                   # Task management CLI implementation
```

---

## File Locations

- **Skill**: `.opencode/skills/task-management/`
- **Router**: `.opencode/skills/task-management/router.sh`
- **CLI**: `.opencode/skills/task-management/scripts/task-cli.ts`
- **Tasks**: `.tmp/tasks/` (created by TaskManager)

---

**Task Management Skill** - Track, manage, and validate your feature implementations!
