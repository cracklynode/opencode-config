---
name: skill-builder
description: Create consistent, deterministic skills with structured templates, placeholders, workflows, and validation rules
version: 1.0.0
author: nickfoard
type: skill
category: development
tags:
  - skill
  - builder
  - generator
  - template
---

# Skill Builder

> **Purpose**: Create consistent, deterministic AI skills with enforced formatting rules, required sections, and validation

---

## Overview

Skill Builder helps you create skills that produce deterministic, consistent outputs. Unlike probabilistic AI responses, skills built with this tool enforce specific rules and structures.

### Why Use Skill Builder?

- **Consistency** - Enforce naming conventions, formatting rules
- **Validation** - Built-in rules for field validation
- **Workflows** - Step-by-step prompts with conditional paths
- **Templates** - Reference external template files

---

## Quick Start

### 1. Initialize a New Skill

```bash
bash .opencode/skills/skill-builder/router.sh init my-skill
```

This creates:

```
my-skill/
├── definition-schema.json   # JSON template for skill definition
├── TEMPLATE.md              # Markdown template for SKILL.md
├── templates/               # Place for reference templates
├── scripts/                 # Place for generator scripts
└── SKILL.md                 # Generated skill (edit TEMPLATE.md)
```

### 2. Define Your Skill

Edit `definition-schema.json` with your skill's:

- **Metadata** - name, description, version, author, category, tags
- **Purpose** - What the skill does
- **Tone/Style** - Writing conventions
- **Placeholders** - Input fields with validation rules
- **Workflow** - Step-by-step prompts
- **Validation** - Field validation rules
- **Templates** - Reference files

### 3. Generate SKILL.md

```bash
bash .opencode/skills/skill-builder/router.sh generate my-skill/definition-schema.json
```

---

## Skill Definition Schema

```json
{
  "metadata": {
    "name": "skill-name",
    "description": "What this skill does",
    "version": "1.0.0",
    "author": "Your Name",
    "category": "business|development|documentation",
    "tags": ["tag1", "tag2"]
  },
  "purpose": "One-line purpose statement",
  "tone": "Tone and style guidelines",
  "placeholders": [
    {
      "name": "PLACEHOLDER_NAME",
      "description": "What this field is for",
      "type": "string|number|email|date",
      "format": "description of format",
      "required": true,
      "validation": "validation rule"
    }
  ],
  "workflow": {
    "conditionals": [
      {
        "condition": "IF user chooses X",
        "action": "DO Y"
      }
    ],
    "steps": [
      {
        "title": "Step Title",
        "description": "What happens in this step",
        "promptsFor": ["PLACEHOLDER_NAME"],
        "offerSuggestion": true,
        "validation": "numeric|email|format"
      }
    ]
  },
  "validation": [
    {
      "field": "PLACEHOLDER_NAME",
      "type": "numeric|email|pattern|enum|range",
      "pattern": "regex pattern",
      "message": "Error message"
    }
  ],
  "templates": ["path/to/template.docx"],
  "examples": [
    {
      "title": "Example Title",
      "description": "What this demonstrates",
      "code": "example code"
    }
  ]
}
```

---

## Placeholders

Define all input fields your skill needs:

| Placeholder | Description | Type | Required |
|-------------|-------------|------|----------|
| `PLACEHOLDER_NAME` | What the field is for | string/number/email/date | Yes/No |

### Placeholder Properties

- **name**: Variable name (UPPER_SNAKE_CASE)
- **description**: What to ask the user
- **type**: `string`, `number`, `email`, `date`, `enum`
- **format**: Expected format description
- **required**: `true` or `false`
- **validation**: Specific validation rule
- **default**: Default value if not provided

---

## Workflow

Define how the skill interacts with users:

### Conditional Paths

Handle different user choices:

```json
{
  "conditionals": [
    {
      "condition": "User chooses 'step-by-step'",
      "action": "Walk through each placeholder one by one"
    },
    {
      "condition": "User chooses 'autocomplete'",
      "action": "Prompt for all notes, auto-fill sections"
    }
  ]
}
```

### Steps

Define ordered steps:

```json
{
  "steps": [
    {
      "title": "Get Client Name",
      "description": "Prompt for the company name entering into the agreement",
      "promptsFor": ["CLIENT_NAME"],
      "validation": "required"
    },
    {
      "title": "Get Service Description",
      "description": "Ask for service description or offer to draft one",
      "promptsFor": ["SERVICE_DESCRIPTION"],
      "offerSuggestion": true
    }
  ]
}
```

---

## Validation Rules

Enforce data quality:

### Numeric Validation

```json
{
  "field": "SOW_TASK_HOURS",
  "type": "numeric",
  "message": "Hours must be a number"
}
```

### Email Validation

```json
{
  "field": "SOW_BILLING_CONTACT_EMAIL",
  "type": "email",
  "message": "Email must contain @"
}
```

### Pattern/Format

```json
{
  "field": "SOW_NUMBER_AND_TITLE",
  "type": "pattern",
  "pattern": "^[A-Z]+ - SOW\\d+ - .+",
  "message": "Title must be: Company - SOWnn - Work Name"
}
```

### Enum/Allowed Values

```json
{
  "field": "SOW_BILLING_BASIS",
  "type": "enum",
  "values": ["Fixed Cost", "Time and Materials"],
  "message": "Must be 'Fixed Cost' or 'Time and Materials'"
}
```

---

## Templates

Reference external template files:

```json
{
  "templates": [
    "SOW_Simple_Service_Template.DOCX",
    "templates/header.html"
  ]
}
```

Place template files in the `templates/` folder.

---

## Examples

### Minimal Skill Definition

```json
{
  "metadata": {
    "name": "hello-skill",
    "description": "Simple greeting skill",
    "version": "1.0.0",
    "author": "you"
  },
  "purpose": "Generate personalized greetings",
  "placeholders": [
    { "name": "NAME", "description": "Name to greet", "type": "string", "required": true }
  ]
}
```

### Full SOW Skill (from your input)

See `examples/sow-definition.json` for a complete example matching your SOW agent requirements.

---

## Commands

| Command | Description |
|---------|-------------|
| `skill-builder init <name>` | Create new skill folder structure |
| `skill-builder generate <file>` | Generate SKILL.md from JSON definition |
| `skill-builder validate <file>` | Validate a skill definition |
| `skill-builder template` | List available templates |
| `skill-builder help` | Show help |

---

## Architecture

```
.opencode/skills/skill-builder/
├── SKILL.md                    # This file
├── router.sh                   # CLI entry point
├── templates/                  # Template snippets
│   ├── frontmatter.yaml
│   ├── workflow-step.md
│   ├── placeholder.md
│   └── validation.md
├── scripts/
│   └── generate-skill.js       # SKILL.md generator
└── examples/
    └── sow-definition.json     # Full SOW example
```

---

## Tips

### 1. Start with Purpose
Always define the skill's purpose first - this guides all other decisions.

### 2. List All Placeholders
Write out every field you'll need before designing the workflow.

### 3. Define Validation Early
Catch bad data at input time, not after processing.

### 4. Use Conditional Paths
Handle different user preferences (step-by-step vs autocomplete).

### 5. Test with Real Data
Validate your skill definition with actual use cases.

---

## Troubleshooting

### "generate-skill.js not found"
Run from project root or ensure script path is correct.

### "JSON parse error"
Check that your definition JSON is valid (use a JSON validator).

### "Missing placeholder"
Ensure all placeholders referenced in workflow are defined in placeholders array.

---

## File Locations

- **Skill**: `.opencode/skills/skill-builder/`
- **Router**: `.opencode/skills/skill-builder/router.sh`
- **Generator**: `.opencode/skills/skill-builder/scripts/generate-skill.js`
- **Templates**: `.opencode/skills/skill-builder/templates/`

---

**Skill Builder** - Create deterministic, consistent AI skills
