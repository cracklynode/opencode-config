---
name: simple-sow-creator
description: Statement of Work (SOW) generator for Equinox IT - creates consistent, professional SOWs using the SOW_Simple_Service_Template_Latest.docx template. Use when user says "create a SOW", "generate a statement of work"
version: 1.0.0
author: Equinox IT
type: skill
category: business
tags:
  - sow
  - document
  - generator
  - consulting
  - equinox
metadata:
  mcp: word
---


# simple-sow-creator

> **Purpose**: Generate consistent, high-quality Statements of Work using the SOW_Simple_Service_Template_Latest.docx template. Always write in a professional, client-facing consulting tone.

---

## When to Use

This skill activates when the user wants to create a Statement of Work document for a consulting engagement with Equinox IT.

---

## Trigger Phrases

- "create a SOW"
- "generate a statement of work"

---

## Tone & Style

Professional, client-facing consulting tone. No fluff; concise, confident, but friendly. Content should be consistent even if user notes are scrappy. Use dot bullets (•) for all lists. Do not use numbered lists.

---

## Placeholders

| Placeholder | Description | Type | Required |
|-------------|-------------|------|----------|
| `SOW_NUMBER_AND_TITLE` | SOW number and title. Format: 'Company Name - SOW## - Work Name' | string | Yes |
| `SOW_CONSULTANT` | Name(s) of the Equinox consultant(s) engaged in the work. If multiple consultants, list one per line. | string | Yes |
| `SOW_CONSULTANT_ROLE` | Role title(s) of the Equinox consultant(s). If multiple consultants, list one per line matching SOW_CONSULTANT order. | string | Yes |
| `SOW_CLIENT_NAME` | The full legal name of the client company. Confirm with user by checking Companies Office website. | string | Yes |
| `SOW_SERVICE_DESCRIPTION` | High-level service description. Usually a block of text followed by bullets listing key services. Keep it high-level - don't duplicate what goes in Approach, Assumptions, or Exclusions. | string | Yes |
| `SOW_APPROACH` | Approach bullet points describing how the work will be conducted. | string | Yes |
| `SOW_ASSUMPTIONS` | Delivery assumptions needed for successful delivery. Brief statement followed by bullet points. | string | Yes |
| `SOW_EXCLUSIONS` | Things excluded from the engagement. Brief statement followed by bullet points. Don't duplicate with Service Description, Approach, or Assumptions. | string | Yes |
| `SOW_FORMAL_DELIVERABLES` | What will be produced and delivered by Equinox IT (scripts, documents, terraform, applications, etc.). Brief statement followed by bullet points. | string | Yes |
| `SOW_CLIENT_BILLING_CONTACT` | Name of the billing contact person | string | Yes |
| `SOW_BILLING_CONTACT_COMPANY_NAME` | Billing contact's company name | string | Yes |
| `SOW_BILLING_CONTACT_EMAIL` | Email address for the billing contact | email | Yes |
| `SOW_REPORTING` | Reporting requirements during the engagement. Default: 'Given the short nature of this assignment, no formal project reporting will be produced' | string | No |
| `SOW_BILLING_BASIS` | Billing basis for the engagement | enum | Yes |
| `SOW_COST_HOURS` | Total hours committed for the assignment. Must be numeric. | number | Yes |
| `SOW_CONSULTANT_RATE` | Hourly rate in NZ Dollars | number | Yes |
| `SOW_COST_AMOUNT` | Total cost calculated as SOW_COST_HOURS × SOW_CONSULTANT_RATE | number | Yes |
| `SOW_TASK_DESCRIPTION` | Task list as bullet points showing the plan of action. Insert newline-delimited values. | string | Yes |
| `SOW_TASK_HOURS` | Hours for each task in SOW_TASK_DESCRIPTION. Insert newline-delimited values matching task order. | string | Yes |
| `SOW_ESTIMATED_COST` | Cost per task (hours × rate). Insert newline-delimited values matching task order. | string | Yes |

---

## Workflow

### Conditional Paths

- **User chooses 'step-by-step' or 'walk through'**: Walk through each placeholder sequentially, prompting for each field in order
- **User chooses 'autocomplete' or 'paste' or 'upload' or 'rough notes'**: Prompt user to paste/upload all notes at once, parse and auto-fill sections, ask for clarification only on missing or conflicting data

### Steps

#### Step 1: Step 1: Initiation & Context Check

Call MCP tool: `word_[action]`

When user says 'create a SOW', scan conversation for any info already provided. Acknowledge what you know. Ask user: 'Would you like to complete the rest step-by-step, or autocomplete by pasting/uploading your rough notes?'

**Prompts for**: 

#### Step 2: Step 2: Data Capture - SOW Basics

Call MCP tool: `word_[action]`

Collect SOW number/title, consultant details, and client name. Confirm legal client name with user (check Companies Office website).

**Prompts for**: `SOW_NUMBER_AND_TITLE`, `SOW_CONSULTANT`, `SOW_CONSULTANT_ROLE`, `SOW_CLIENT_NAME`

**Offer suggestion**: Yes - suggest draft for user review

**Validation**: pattern

#### Step 3: Step 2: Data Capture - Service Details

Call MCP tool: `word_[action]`

Collect service description, approach, assumptions, exclusions, and deliverables. Ensure no duplication across these sections.

**Prompts for**: `SOW_SERVICE_DESCRIPTION`, `SOW_APPROACH`, `SOW_ASSUMPTIONS`, `SOW_EXCLUSIONS`, `SOW_FORMAL_DELIVERABLES`

**Offer suggestion**: Yes - suggest draft for user review

#### Step 4: Step 2: Data Capture - Billing & Reporting

Call MCP tool: `word_[action]`

Collect billing contact details, reporting requirements, and billing basis.

**Prompts for**: `SOW_CLIENT_BILLING_CONTACT`, `SOW_BILLING_CONTACT_COMPANY_NAME`, `SOW_BILLING_CONTACT_EMAIL`, `SOW_REPORTING`, `SOW_BILLING_BASIS`

**Offer suggestion**: Yes - suggest draft for user review

**Validation**: email

#### Step 5: Step 2: Data Capture - Tasks & Costs

Call MCP tool: `word_[action]`

Collect task descriptions, hours per task, and calculate costs. Automatically calculate SOW_COST_AMOUNT = SOW_COST_HOURS × SOW_CONSULTANT_RATE. For task hours and estimated costs, insert newline-delimited values inside single cells.

**Prompts for**: `SOW_TASK_DESCRIPTION`, `SOW_TASK_HOURS`, `SOW_CONSULTANT_RATE`

**Offer suggestion**: Yes - suggest draft for user review

**Validation**: numeric

#### Step 6: Step 3: Validation

Call MCP tool: `word_[action]`

Validate all numeric fields (SOW_COST_HOURS, SOW_CONSULTANT_RATE, SOW_COST_AMOUNT). Validate email contains '@'. Validate SOW_BILLING_BASIS is 'Fixed Cost' or 'Time and Materials'. If any field is missing or invalid, prompt for correction.

**Prompts for**: 

**Validation**: numeric,email,enum

#### Step 7: Step 4: Preview (Mandatory)

Call MCP tool: `word_[action]`

Display a draft preview of the SOW. Show all populated fields. Ask the user to review and confirm or request specific changes. DO NOT generate the DOCX until user explicitly confirms.

**Prompts for**: 

#### Step 8: Step 5: Final Output

Call MCP tool: `word_[action]`

Only after explicit user confirmation, populate the template SOW_Simple_Service_Template_Latest.docx with all placeholder values. Ensure all placeholders are replaced with confirmed data or marked as 'TBD'. Save the document with a sanitized filename (remove /, \, :, *, ?, ", <, >, |).

**Prompts for**: 

---

## Validation Rules

### SOW_NUMBER_AND_TITLE

- **Type**: pattern
- **Pattern**: `^[A-Z][A-Za-z0-9 ]+ - SOW\d+ - .+`
- **Error**: Title must be in format: 'Company Name - SOW## - Work Name'

### SOW_COST_HOURS

- **Type**: numeric
- **Error**: Hours must be a number (e.g., 40, not 'forty')

### SOW_CONSULTANT_RATE

- **Type**: numeric
- **Error**: Rate must be a number in NZD (e.g., 150, not 'one hundred fifty')

### SOW_COST_AMOUNT

- **Type**: numeric
- **Error**: Total cost must be a number

### SOW_BILLING_CONTACT_EMAIL

- **Type**: email
- **Error**: Email must contain @ (e.g., name@company.com)

### SOW_BILLING_BASIS

- **Type**: enum
- **Error**: Must be 'Fixed Cost' or 'Time and Materials'

---

## Templates

Reference these template files:

- `SOW_Simple_Service_Template_Latest.docx`

---

## Examples

### Example 1: Create SOW for Cloud Migration

**User says:** "Create a SOW for Acme Corp cloud migration project"

**Actions:**

1. Acknowledge: 'I see this is for ACME Corp. Would you like to complete the rest step-by-step, or autocomplete by pasting/uploading your rough notes?'
2. Collect SOW number/title (e.g., 'ACME Corp - SOW01 - Cloud Migration Assessment')
3. Collect consultant name and role
4. Confirm legal client name (check Companies Office)
5. Collect service description, approach, assumptions, exclusions, deliverables
6. Collect billing contact details
7. Collect task breakdown with hours
8. Calculate total cost (hours × rate)
9. Show preview for review
10. Generate Word document after confirmation

**Result:** Complete SOW document saved as 'ACME-Corp-SOW01-Cloud-Migration-Assessment.docx'

### Example 2: Autocomplete with Rough Notes

**User says:** "Create a SOW - here's my rough notes: Acme Corp, Sarah as consultant, SharePoint setup, 40 hours at $150/hr, fixed price, deliverables include migration plan and training docs"

**Actions:**

1. Parse rough notes and auto-fill: SOW_NUMBER_AND_TITLE, SOW_CONSULTANT, SOW_SERVICE_DESCRIPTION
2. Ask for clarification on missing fields (e.g., SOW number format, approach, assumptions)
3. Calculate SOW_COST_AMOUNT = 40 × 150 = $6,000
4. Show preview for user to review
5. Generate document after confirmation

**Result:** SOW document with auto-filled fields from rough notes

## Troubleshooting

### Error: Placeholder not replaced in output

**Cause:** Field was left empty or marked as TBD

**Solution:** Ensure all required fields are populated before generating DOCX

### Error: Document not saving

**Cause:** Invalid characters in filename (/, \, :, *, ?, ", <, >, |)

**Solution:** Remove special characters from filename. Use hyphens or underscores instead.

### Error: Email validation fails

**Cause:** Email address missing @ symbol

**Solution:** Ensure email contains @ and valid domain (e.g., name@company.com)

### Error: Total cost calculation wrong

**Cause:** Hours or rate entered as text instead of numbers

**Solution:** Enter numeric values only (e.g., 80 hours, not 'eighty hours')

### Error: Duplication across sections

**Cause:** Same content in Service Description, Approach, Assumptions, or Exclusions

**Solution:** Keep Service Description high-level. Each section should have distinct content.

