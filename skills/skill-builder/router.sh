#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

show_help() {
  cat << EOF
Skill Builder - Create Anthropic-aligned skills

Usage: skill-builder <command> [options]

Commands:
  init <name>         Initialize new skill folder (kebab-case)
  generate <def.json> Generate SKILL.md from JSON definition
  validate <file>     Validate skill (checks triggers, MCP tools, examples)
  template            Show available templates
  help                Show this help message

Features (Anthropic-aligned):
  - Trigger phrases for automatic skill activation
  - MCP tool mapping in workflow steps
  - Enhanced examples with user prompts
  - Troubleshooting section

Examples:
  skill-builder init my-skill
  skill-builder generate skill-def.json
  skill-builder validate my-skill/SKILL.md

For more info, see SKILL.md
EOF
}

cmd_init() {
  local name="$1"
  if [ -z "$name" ]; then
    echo "Error: Skill name required"
    echo "Usage: skill-builder init <skill-name>"
    exit 1
  fi
  
  # Convert to kebab-case (Anthropic requirement)
  local dir=$(echo "$name" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr '_' '-')
  mkdir -p "$dir/templates"
  mkdir -p "$dir/scripts"
  mkdir -p "$dir/references"
  mkdir -p "$dir/assets"
  
  cat > "$dir/definition-schema.json" << 'SCHEMA'
{
  "metadata": {
    "name": "",
    "description": "",
    "version": "1.0.0",
    "author": "",
    "category": "general",
    "tags": []
  },
  "triggers": [],
  "when_to_use": "",
  "mcp": "",
  "purpose": "",
  "tone": "",
  "placeholders": [],
  "workflow": {
    "conditionals": [],
    "steps": []
  },
  "validation": [],
  "templates": [],
  "examples": [],
  "common_errors": []
}
SCHEMA

  cat > "$dir/TEMPLATE.md" << 'TEMPLATE'
# {SKILL_NAME}

> **Purpose**: [One-line purpose statement]

---

## When to Use

This skill activates when [describe when the user would use this skill].

## Trigger Phrases

- "[trigger phrase 1]"
- "[trigger phrase 2]"
- "[trigger phrase 3]"

---

## Tone & Style

[Describe the tone and style guidelines for outputs]

---

## Placeholders

| Placeholder | Description | Type | Required |
|-------------|-------------|------|----------|
| | | | |

---

## Workflow

### Conditional Paths

- **[Condition]**: [Action]

### Steps

#### Step 1: [Step Title]

Call MCP tool: `[tool_name]`
[Description of what happens in this step]

**Parameters:** [list of parameters]

---

## Validation Rules

---

## Templates

Reference these template files:

- `[template file]`

---

## Examples

### Example 1: [Common Scenario]

**User says:** "[example trigger phrase]"

**Actions:**

1. [First action]
2. [Second action]
3. [Third action]

**Result:** [Expected outcome]

---

## Troubleshooting

### Error: [Common error message]

**Cause:** [Why it happens]

**Solution:** [How to fix]

TEMPLATE

  echo "Created skill structure: $dir/"
  echo "Edit definition-schema.json to define your skill"
  echo ""
  echo "Generated skill will follow Anthropic guide pattern with:"
  echo "  - Trigger phrases for automatic activation"
  echo "  - MCP tool mapping in workflow steps"
  echo "  - Enhanced examples with user prompts"
  echo "  - Troubleshooting section"
}

cmd_generate() {
  local def_file="$1"
  if [ -z "$def_file" ]; then
    echo "Error: Definition file required"
    echo "Usage: skill-builder generate <definition.json>"
    exit 1
  fi
  
  if [ ! -f "$def_file" ]; then
    echo "Error: File not found: $def_file"
    exit 1
  fi
  
  node "$SCRIPT_DIR/scripts/generate-skill.js" "$def_file"
}

cmd_validate() {
  local file="$1"
  if [ -z "$file" ]; then
    echo "Error: File required"
    echo "Usage: skill-builder validate <file>"
    exit 1
  fi
  
  if [ ! -f "$file" ]; then
    echo "Error: File not found: $file"
    exit 1
  fi
  
  echo "Validating $file..."
  echo ""
  
  # Check frontmatter delimiters
  if grep -q "^---$" "$file"; then
    echo "✓ Has frontmatter delimiter"
  else
    echo "✗ Missing frontmatter delimiter"
  fi
  
  # Check name field
  if grep -q "^name: " "$file"; then
    echo "✓ Has name field"
  else
    echo "✗ Missing name field"
  fi
  
  # Check description field
  if grep -q "^description: " "$file"; then
    echo "✓ Has description field"
  else
    echo "✗ Missing description field"
  fi
  
  # Check for trigger phrases in description (Anthropic best practice)
  if grep -qi "use when\|trigger\|says.*\"" "$file" > /dev/null; then
    echo "✓ Contains trigger phrases (Anthropic-aligned)"
  else
    echo "⚠ Warning: No trigger phrases found - skill may not activate automatically"
    echo "  Tip: Add phrases like 'Use when user says \"create a...\"'"
  fi
  
  # Check for MCP tool references in workflow
  if grep -qi "Call MCP tool\|mcp_tool" "$file" > /dev/null; then
    echo "✓ Contains MCP tool mappings"
  else
    echo "⚠ Warning: No MCP tool mappings found in workflow"
    echo "  Tip: Add 'Call MCP tool: [tool_name]' to each step"
  fi
  
  # Check for troubleshooting section
  if grep -qi "^## Troubleshooting\|^### Error" "$file" > /dev/null; then
    echo "✓ Contains troubleshooting section"
  else
    echo "⚠ Warning: No troubleshooting section found"
    echo "  Tip: Add common errors and solutions"
  fi
  
  # Check for examples
  if grep -qi "^## Examples\|^### Example" "$file" > /dev/null; then
    echo "✓ Contains examples section"
  else
    echo "⚠ Warning: No examples section found"
    echo "  Tip: Add example user prompts and expected outcomes"
  fi
  
  echo ""
  echo "Validation complete"
}

cmd_template() {
  echo "Available templates:"
  echo ""
  ls -1 "$SCRIPT_DIR/templates/"
}

COMMAND="${1:-help}"
shift 2>/dev/null

case "$COMMAND" in
  init)    cmd_init "$@" ;;
  generate) cmd_generate "$@" ;;
  validate) cmd_validate "$@" ;;
  template) cmd_template ;;
  help|--help|-h) show_help ;;
  *)       show_help ;;
esac
