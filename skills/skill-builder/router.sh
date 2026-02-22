#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

show_help() {
  cat << EOF
Skill Builder - Create consistent, deterministic skills

Usage: skill-builder <command> [options]

Commands:
  init <name>         Initialize a new skill folder structure
  generate <def.json> Generate SKILL.md from JSON definition
  validate <file>     Validate a skill definition file
  template            Show available templates
  help                Show this help message

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
  
  local dir="$name"
  mkdir -p "$dir/templates"
  mkdir -p "$dir/scripts"
  
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
  "purpose": "",
  "tone": "",
  "placeholders": [],
  "workflow": {
    "conditionals": [],
    "steps": []
  },
  "validation": [],
  "templates": [],
  "examples": []
}
SCHEMA

  cat > "$dir/TEMPLATE.md" << 'TEMPLATE'
# {SKILL_NAME}

> **Purpose**: 

---

## Tone & Style

---

## Placeholders

| Placeholder | Description | Type | Required |
|-------------|-------------|------|----------|
| | | | |

---

## Workflow

### Conditional Paths
- 

### Steps
#### Step 1: 

---

## Validation Rules

---

## Templates

---

## Examples

TEMPLATE

  echo "Created skill structure: $dir/"
  echo "Edit definition-schema.json to define your skill"
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
  
  if grep -q "^---$" "$file"; then
    echo "✓ Has frontmatter delimiter"
  else
    echo "✗ Missing frontmatter delimiter"
  fi
  
  if grep -q "^name: " "$file"; then
    echo "✓ Has name field"
  else
    echo "✗ Missing name field"
  fi
  
  if grep -q "^description: " "$file"; then
    echo "✓ Has description field"
  else
    echo "✗ Missing description field"
  fi
  
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
