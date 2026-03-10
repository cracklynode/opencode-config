---
name: sow-quality-reviewer
description: Quality review agent for evaluating Statement of Work (SOW) documents against internal standards. Use when user says "review an SOW", "quality check SOW", "evaluate SOW compliance", "SOW audit", "check SOW standards"
version: 1.0.0
author: Equinox IT
type: skill
category: business
tags:
  - sow
  - quality
  - review
  - document
  - compliance
metadata:
  mcp: word
---


# sow-quality-reviewer

> **Purpose**: Evaluate SOW documents against internal standards checklist and provide concise feedback

---

## When to Use

This skill activates when the user wants to review and evaluate a Statement of Work document for compliance with internal quality standards.

---

## Trigger Phrases

- "review an SOW"
- "quality check SOW"
- "evaluate SOW compliance"
- "SOW audit"
- "check SOW standards"

---

## Tone & Style

Professional, objective, factual. Focus on compliance and quality, not sales language.

---

## Placeholders

| Placeholder | Description | Type | Required |
|-------------|-------------|------|----------|
| `SOW_DOCUMENT` | The uploaded Word document (.docx) to review | file | Yes |
| `CLIENT_LEGAL_NAME` | Full legal client name from companies-register.companiesoffice.govt.nz | string | Yes |
| `CLIENT_ABBREVIATION` | Abbreviation to use in SOW title | string | Yes |
| `SOW_NUMBER` | SOW number (e.g., SOW01) | string | Yes |
| `PROJECT_NAME` | Full project name | string | Yes |
| `BILLING_TYPE` | Billing type: Fixed Cost or Time and Materials | enum | Yes |
| `PRICING_MATCHES_ACCELO` | Confirm pricing milestones match Accelo and invoices | boolean | Yes |
| `TECHNICAL_REVIEW` | Evidence of Technical/Delivery review | boolean | Yes |
| `COMMERCIAL_REVIEW` | Evidence of Commercial review | boolean | Yes |
| `IS_DRAFT` | Is this a draft document (should have watermark)? | boolean | Yes |
| `ACCELO_SALE_CREATED` | Has a Sale in Accelo been created? | boolean | Yes |
| `PIPELINE_UPDATED` | Has pipeline status been updated? | boolean | Yes |

---

## Workflow

### Conditional Paths

- **Billing type is Time and Materials**: Skip Project Coordination and Contingency checks
- **Billing type is Fixed Cost**: Verify Project Coordination (10-20%) and Contingency (10-30%) are included
- **Document is marked as Draft**: Verify draft watermark is present
- **Document is Final**: Verify no draft watermark, check for pre-signature or client e-signature

### Steps

#### Step 1: Request Document Upload

Call MCP tool: `word_open_document`

Prompt user to upload the full Word document (.docx) version of the SOW for review

**Parameters:** SOW_DOCUMENT

**Prompts for**: `SOW_DOCUMENT`

#### Step 2: Review Naming & Structure

Call MCP tool: `word_read_content`

Check SOW naming format: 'Client short-name – SOW# – Project Name / Scope'. Verify client legal name from companies-register.companiesoffice.govt.nz with abbreviation.

**Parameters:** title, first_paragraph

**Prompts for**: `CLIENT_LEGAL_NAME`, `CLIENT_ABBREVIATION`, `SOW_NUMBER`, `PROJECT_NAME`

#### Step 3: Review Content - Scope, Exclusions, Assumptions

Call MCP tool: `word_search_content`

Check that Scope, Exclusions, and Assumptions are clearly defined with focus on risk and change management.

**Parameters:** Scope, Exclusions, Assumptions

**Prompts for**: 

#### Step 4: Review Deliverables

Call MCP tool: `word_search_content`

Verify Deliverables are clearly stated as tangible artifacts left with the client.

**Parameters:** Deliverables

**Prompts for**: 

#### Step 5: Review Pricing

Call MCP tool: `word_read_table`

Ask user to manually check Pricing Milestones match Accelo and invoices. Verify milestones are broad (no lines under 20 hours).

**Parameters:** pricing_table

**Prompts for**: `PRICING_MATCHES_ACCELO`

#### Step 6: Review Project Coordination (Fixed Cost only)

Call MCP tool: `word_search_content`

For Fixed Cost: Verify Project Coordination (10–20%) is included. Skip for T&M.

**Parameters:** Project Coordination

**Prompts for**: `BILLING_TYPE`

**Offer suggestion**: Yes - suggest draft for user review

#### Step 7: Review Contingency (Fixed Cost only)

Call MCP tool: `word_search_content`

For Fixed Cost: Verify Contingency (10–30%) is included. Skip for T&M.

**Parameters:** Contingency

**Prompts for**: `BILLING_TYPE`

**Offer suggestion**: Yes - suggest draft for user review

#### Step 8: Review Evidence of Reviews

Call MCP tool: `word_search_content`

Check for evidence of both Technical/Delivery and Commercial reviews.

**Parameters:** review, approved

**Prompts for**: `TECHNICAL_REVIEW`, `COMMERCIAL_REVIEW`

#### Step 9: Check Draft Watermark

Call MCP tool: `word_check_watermark`

Verify draft watermark is used appropriately if document is not final.

**Parameters:** 

**Prompts for**: `IS_DRAFT`

#### Step 10: Review Key Principles

Call MCP tool: `word_read_content`

Check language is factual/concise (not sales-oriented), avoid content duplication, verify milestones broad (no lines under 20 hours), Approach has headlines and bullet points.

**Parameters:** Approach, Scope, Costs

**Prompts for**: 

#### Step 11: Review Formatting

Call MCP tool: `word_check_formatting`

Check: bullet points used (not numbered lists), table rows don't break across pages, footer consistent with SOW name, signature section not orphaned.

**Parameters:** 

**Prompts for**: 

#### Step 12: Check Final Steps

Call MCP tool: `word_search_content`

Verify SOW is pre-signed or ready for client e-signature. Check Sale created in Accelo and pipeline status updated.

**Parameters:** signature, signed

**Prompts for**: `ACCELO_SALE_CREATED`, `PIPELINE_UPDATED`

#### Step 13: Generate Review Report

Call MCP tool: `word_create_document`

Compile feedback using categories: Compliant, Needs Attention (with suggestion), Missing (with explanation). Ignore other reviewers' comments.

**Parameters:** review_report

**Prompts for**: 

---

## Validation Rules

### SOW_DOCUMENT

- **Type**: enum
- **Error**: Must be a Word document (.docx)

### BILLING_TYPE

- **Type**: enum
- **Error**: Must be 'Fixed Cost' or 'Time and Materials'

---

## Examples

### Example 1: Full SOW Quality Review

**User says:** "Please review this SOW for quality compliance"

**Actions:**

1. Request user to upload the SOW Word document
2. Review naming format against client details
3. Check Scope, Exclusions, Assumptions sections
4. Verify Deliverables are tangible artifacts
5. Check pricing milestones (ask user to verify Accelo match)
6. For Fixed Cost: verify Project Coordination and Contingency
7. Check for Technical and Commercial review evidence
8. Verify draft watermark if not final
9. Review key principles (language, duplication, milestones)
10. Check formatting (bullets, tables, footer, signature)
11. Check final steps (signature, Accelo, pipeline)
12. Generate review report

**Result:** Complete quality review report with Compliant/Needs Attention/Missing status for each item

### Example 2: Fixed Cost SOW Review

**User says:** "Review this Fixed Cost SOW"

**Actions:**

1. Upload document
2. Verify Project Coordination (10-20%) included
3. Verify Contingency (10-30%) included
4. Complete standard checklist

**Result:** Review includes Project Coordination and Contingency checks

### Example 3: T&M SOW Review

**User says:** "Review this Time and Materials SOW"

**Actions:**

1. Upload document
2. Skip Project Coordination check
3. Skip Contingency check
4. Complete standard checklist

**Result:** Review excludes Project Coordination and Contingency (not applicable for T&M)

## Troubleshooting

### Error: Cannot open document

**Cause:** File is not .docx or is corrupted

**Solution:** Ensure the uploaded file is a valid Word document (.docx)

### Error: Missing client legal name check

**Cause:** User didn't verify against companies-register.companiesoffice.govt.nz

**Solution:** Ask user to manually check the full legal client name

### Error: Pricing milestones too detailed

**Cause:** Individual line items under 20 hours

**Solution:** Consolidate into broader milestone categories

### Error: Content duplication

**Cause:** Same content repeated in Scope, Approach, and Costs sections

**Solution:** Remove duplication - each section should be unique

