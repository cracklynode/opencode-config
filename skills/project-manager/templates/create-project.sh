#!/bin/bash

# Create Project Folder Structure
# Usage: ./create-project.sh <PROJECT_NAME> <PROJECT_PARENT_PATH> [PROJECT_DESCRIPTION]

PROJECT_NAME="$1"
PROJECT_PATH="$2"
PROJECT_DESCRIPTION="${3:-Project description here}"

if [ -z "$PROJECT_NAME" ] || [ -z "$PROJECT_PATH" ]; then
    echo "Usage: create-project.sh <PROJECT_NAME> <PROJECT_PARENT_PATH> [PROJECT_DESCRIPTION]"
    exit 1
fi

FULL_PATH="$PROJECT_PATH/$PROJECT_NAME"

echo "Creating project: $PROJECT_NAME"
echo "Location: $FULL_PATH"

# Create main project folder
mkdir -p "$FULL_PATH/documents"

# Create project.json
cat > "$FULL_PATH/project.json" << EOF
{
  "name": "$PROJECT_NAME",
  "version": "1.0.0",
  "created": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "description": "$PROJECT_DESCRIPTION",
  "documentsFolder": "documents",
  "instructionsFile": "instructions.md",
  "memoryFile": "project_memory.md",
  "tags": []
}
EOF

# Create instructions.md
cat > "$FULL_PATH/instructions.md" << EOF
# Project Instructions: $PROJECT_NAME

## Overview
$PROJECT_DESCRIPTION

## Working Style
- Be concise and direct
- Provide actionable recommendations
- Reference documents from the documents/ folder when relevant

## Standard Workflow (CREATE Framework)
1. **C** - Clarify the request
2. **R** - Research and gather information  
3. **E** - Explore possible approaches
4. **A** - Architect a solution
5. **T** - Implement the solution
6. **E** - Evaluate and iterate

## Document Preferences
- Word documents: Extract and summarize key information
- Excel spreadsheets: Show relevant data tables and calculations
- PowerPoint: Summarize slides and key points
- PDFs: Extract text and summarize

---
*This file provides persistent context for all project sessions*
EOF

# Create project_memory.md
cat > "$FULL_PATH/project_memory.md" << EOF
# Project Memory: $PROJECT_NAME

## Session History

*No previous sessions yet.*

---
*This file grows with each session. Review before starting new work.*
EOF

# Create .gitkeep in documents
touch "$FULL_PATH/documents/.gitkeep"

echo ""
echo "Project created successfully!"
echo "  - $FULL_PATH/project.json"
echo "  - $FULL_PATH/instructions.md"
echo "  - $FULL_PATH/project_memory.md"
echo "  - $FULL_PATH/documents/"
