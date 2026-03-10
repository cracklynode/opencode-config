#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function generateSkill(definition, outputPath) {
  let content = '';

  // Generate enhanced frontmatter with triggers
  content += generateFrontmatter(definition);
  content += '\n# ' + definition.metadata.name + '\n\n';

  // Purpose (if provided)
  if (definition.purpose) {
    content += '> **Purpose**: ' + definition.purpose + '\n\n---\n\n';
  }

  // When to Use section (NEW - Anthropic-aligned)
  if (definition.when_to_use) {
    content += '## When to Use\n\n' + definition.when_to_use + '\n\n---\n\n';
  } else {
    // Generate default if not provided
    content += '## When to Use\n\n';
    content += 'This skill activates when the user wants to ' + (definition.purpose || 'accomplish the defined task') + '.\n\n---\n\n';
  }

  // Trigger Phrases section (NEW - Anthropic-aligned)
  content += '## Trigger Phrases\n\n';
  if (definition.triggers && definition.triggers.length > 0) {
    definition.triggers.forEach(trigger => {
      content += '- "' + trigger + '"\n';
    });
  } else {
    content += '- "[Describe what the user would say]"\n';
  }
  content += '\n---\n\n';

  // Tone & Style (if provided)
  if (definition.tone) {
    content += '## Tone & Style\n\n' + definition.tone + '\n\n---\n\n';
  }

  // Placeholders
  if (definition.placeholders && definition.placeholders.length > 0) {
    content += '## Placeholders\n\n';
    content += '| Placeholder | Description | Type | Required |\n';
    content += '|-------------|-------------|------|----------|\n';
    definition.placeholders.forEach(p => {
      content += `| \`${p.name}\` | ${p.description} | ${p.type || 'string'} | ${p.required ? 'Yes' : 'No'} |\n`;
    });
    content += '\n---\n\n';
  }

  // Workflow
  if (definition.workflow) {
    content += '## Workflow\n\n';
    
    // Conditional Paths
    if (definition.workflow.conditionals && definition.workflow.conditionals.length > 0) {
      content += '### Conditional Paths\n\n';
      definition.workflow.conditionals.forEach(c => {
        content += `- **${c.condition}**: ${c.action}\n`;
      });
      content += '\n';
    }
    
    // Steps with MCP tool mapping (ENHANCED - Anthropic-aligned)
    if (definition.workflow.steps && definition.workflow.steps.length > 0) {
      content += '### Steps\n\n';
      definition.workflow.steps.forEach((step, idx) => {
        content += `#### Step ${idx + 1}: ${step.title}\n\n`;
        
        // MCP Tool mapping (NEW)
        if (step.mcp_tool) {
          content += 'Call MCP tool: `' + step.mcp_tool + '`\n\n';
        } else if (definition.mcp) {
          content += 'Call MCP tool: `' + definition.mcp + '_[action]`\n\n';
        }
        
        content += step.description + '\n\n';
        
        // Parameters
        if (step.parameters) {
          content += '**Parameters:** ' + step.parameters.join(', ') + '\n\n';
        }
        
        // promptsFor (existing field)
        if (step.promptsFor) {
          content += '**Prompts for**: ' + step.promptsFor.map(p => `\`${p}\``).join(', ') + '\n\n';
        }
        
        // offerSuggestion (existing field)
        if (step.offerSuggestion) {
          content += '**Offer suggestion**: Yes - suggest draft for user review\n\n';
        }
        
        // Validation (existing field)
        if (step.validation) {
          content += '**Validation**: ' + step.validation + '\n\n';
        }
      });
    }
    content += '---\n\n';
  }

  // Validation Rules
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

  // Templates
  if (definition.templates && definition.templates.length > 0) {
    content += '## Templates\n\n';
    content += 'Reference these template files:\n\n';
    definition.templates.forEach(t => {
      content += `- \`${t}\`\n`;
    });
    content += '\n---\n\n';
  }

  // Enhanced Examples (Anthropic-aligned: user prompt + actions + result)
  if (definition.examples && definition.examples.length > 0) {
    content += '## Examples\n\n';
    definition.examples.forEach((ex, idx) => {
      content += '### Example ' + (idx + 1) + ': ' + ex.title + '\n\n';
      
      // Anthropic-style: User says -> Actions -> Result
      if (ex.user_says) {
        content += '**User says:** "' + ex.user_says + '"\n\n';
      }
      
      if (ex.actions) {
        content += '**Actions:**\n\n';
        ex.actions.forEach((action, aIdx) => {
          content += (aIdx + 1) + '. ' + action + '\n';
        });
        content += '\n';
      }
      
      if (ex.result) {
        content += '**Result:** ' + ex.result + '\n\n';
      }
      
      // Legacy support: description
      if (ex.description && !ex.user_says) {
        content += ex.description + '\n\n';
      }
      
      // Legacy support: code example
      if (ex.code) {
        content += '```\n' + ex.code + '\n```\n\n';
      }
    });
  }

  // Troubleshooting section (NEW - Anthropic-aligned)
  if (definition.common_errors && definition.common_errors.length > 0) {
    content += '## Troubleshooting\n\n';
    definition.common_errors.forEach(err => {
      content += '### Error: ' + err.error + '\n\n';
      content += '**Cause:** ' + err.cause + '\n\n';
      content += '**Solution:** ' + err.solution + '\n\n';
    });
  } else {
    // Add placeholder for troubleshooting
    content += '## Troubleshooting\n\n';
    content += '### Error: [Common error message]\n\n';
    content += '**Cause:** [Why it happens]\n\n';
    content += '**Solution:** [How to fix]\n\n';
  }

  fs.writeFileSync(outputPath, content);
  console.log('Generated:', outputPath);
}

function generateFrontmatter(definition) {
  const metadata = definition.metadata || {};
  const triggers = definition.triggers || [];
  
  // Build enhanced description with triggers (Anthropic best practice)
  let description = metadata.description || '';
  
  // If triggers exist, append to description for automatic activation
  if (triggers.length > 0 && description) {
    const triggerList = triggers.slice(0, 5).map(t => `"${t}"`).join(', ');
    const moreText = triggers.length > 5 ? ', and more' : '';
    description = description + '. Use when user says ' + triggerList + moreText;
  }
  
  let fm = '---\n';
  fm += 'name: ' + (metadata.name || 'skill-name') + '\n';
  fm += 'description: ' + description + '\n';
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
    fm += '  - ' + (metadata.name || 'skill') + '\n';
  }
  
  // Add metadata block with MCP if provided
  if (definition.mcp) {
    fm += 'metadata:\n';
    fm += '  mcp: ' + definition.mcp + '\n';
  }
  
  fm += '---\n\n';
  return fm;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log('Usage: generate-skill.js <definition.json> [output.md]');
    console.log('');
    console.log('Generates Anthropic-aligned SKILL.md with:');
    console.log('  - Enhanced frontmatter with triggers');
    console.log('  - When to Use section');
    console.log('  - Trigger Phrases section');
    console.log('  - MCP tool mapping in workflow steps');
    console.log('  - Enhanced examples (user says -> actions -> result)');
    console.log('  - Troubleshooting section');
    process.exit(1);
  }
  
  const definitionPath = args[0];
  const outputPath = args[1] || 'SKILL.md';
  
  try {
    const definition = JSON.parse(fs.readFileSync(definitionPath, 'utf8'));
    generateSkill(definition, outputPath);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

module.exports = { generateSkill, generateFrontmatter };
