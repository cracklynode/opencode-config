#!/usr/bin/env node

const fs = require(' = require('pathfs');
const path');

function generateSkill(definition, outputPath) {
  let content = '';

  content += generateFrontmatter(definition.metadata);
  content += '\n# ' + definition.metadata.name + '\n\n';
  
  if (definition.purpose) {
    content += '> **Purpose**: ' + definition.purpose + '\n\n---\n\n';
  }

  if (definition.tone) {
    content += '## Tone & Style\n\n' + definition.tone + '\n\n---\n\n';
  }

  if (definition.placeholders && definition.placeholders.length > 0) {
    content += '## Placeholders\n\n';
    content += '| Placeholder | Description | Type | Required |\n';
    content += '|-------------|-------------|------|----------|\n';
    definition.placeholders.forEach(p => {
      content += `| \`${p.name}\` | ${p.description} | ${p.type} | ${p.required ? 'Yes' : 'No'} |\n`;
    });
    content += '\n---\n\n';
  }

  if (definition.workflow) {
    content += '## Workflow\n\n';
    if (definition.workflow.conditionals) {
      content += '### Conditional Paths\n\n';
      definition.workflow.conditionals.forEach(c => {
        content += `- **${c.condition}**: ${c.action}\n`;
      });
      content += '\n';
    }
    
    if (definition.workflow.steps) {
      content += '### Steps\n\n';
      definition.workflow.steps.forEach((step, idx) => {
        content += `#### Step ${idx + 1}: ${step.title}\n\n`;
        content += step.description + '\n\n';
        if (step.promptsFor) {
          content += '**Prompts for**: ' + step.promptsFor.map(p => `\`${p}\``).join(', ') + '\n\n';
        }
        if (step.offerSuggestion) {
          content += '**Offer suggestion**: Yes - suggest draft for user review\n\n';
        }
        if (step.validation) {
          content += '**Validation**: ' + step.validation + '\n\n';
        }
      });
    }
    content += '---\n\n';
  }

  if (definition.validation && definition.validation.length > 0) {
    content += '## Validation Rules\n\n';
    definition.validation.forEach(v => {
      content += `### ${v.field}\n\n`;
      content += `- **Type**: ${v.type}\n`;
      if (v.pattern) content += `- **Pattern**: \`${v.pattern}\`\n`;
      if (v.message) content += `- **Error**: ${v.message}\n`;
      content += '\n';
    });
    content += '---\n\n';
  }

  if (definition.templates) {
    content += '## Templates\n\n';
    content += 'Reference these template files:\n\n';
    definition.templates.forEach(t => {
      content += `- \`${t}\`\n`;
    });
    content += '\n---\n\n';
  }

  if (definition.examples && definition.examples.length > 0) {
    content += '## Examples\n\n';
    definition.examples.forEach(ex => {
      content += '### ' + ex.title + '\n\n';
      content += ex.description + '\n\n';
      if (ex.code) {
        content += '```\n' + ex.code + '\n```\n\n';
      }
    });
  }

  fs.writeFileSync(outputPath, content);
  console.log('Generated:', outputPath);
}

function generateFrontmatter(metadata) {
  let fm = '---\n';
  fm += 'name: ' + metadata.name + '\n';
  fm += 'description: ' + metadata.description + '\n';
  fm += 'version: ' + (metadata.version || '1.0.0') + '\n';
  fm += 'author: ' + (metadata.author || '') + '\n';
  fm += 'type: skill\n';
  fm += 'category: ' + (metadata.category || 'general') + '\n';
  fm += 'tags:\n';
  if (metadata.tags && metadata.tags.length > 0) {
    metadata.tags.forEach(t => {
      fm += '  - ' + t + '\n';
    });
  } else {
    fm += '  - ' + metadata.name + '\n';
  }
  fm += '---\n\n';
  return fm;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log('Usage: generate-skill.js <definition.json> [output.md]');
    process.exit(1);
  }
  
  const definitionPath = args[0];
  const outputPath = args[1] || 'SKILL.md';
  
  const definition = JSON.parse(fs.readFileSync(definitionPath, 'utf8'));
  generateSkill(definition, outputPath);
}

module.exports = { generateSkill, generateFrontmatter };
