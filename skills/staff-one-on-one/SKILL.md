---
name: staff-one-on-one
description: Converts one-on-one meeting transcripts into a structured summary using the One-on-One Meeting Notes Template. Use when user says "one on one", "1:1 notes", "staff meeting", "1-on-1 summary"
version: 1.0.0
author: Nick Foard
type: skill
category: business
tags:
  - one-on-one
  - meeting
  - notes
  - transcript
  - summary
  - hr
metadata:
  mcp: word
---


# staff-one-on-one

> **Purpose**: Generate structured one-on-one meeting summaries from transcripts, populate the template, convert to PDF for emailing to staff.

---

## When to Use

This skill activates when the user wants to convert a one-on-one meeting transcript into a structured summary document.

---

## Trigger Phrases

- "one on one"
- "1:1 notes"
- "staff meeting"
- "1-on-1 summary"

---

## Tone & Style

Professional, concise, action-oriented. Use bullet points for readability. Capture key insights without including full transcript.

---

## Placeholders

| Placeholder | Description | Type | Required |
|-------------|-------------|------|----------|
| `STAFF_NAME` | Name of the direct report (staff member) | string | Yes |
| `MANAGER_NAME` | Name of the manager conducting the one-on-one | string | Yes |
| `MEETING_DATE` | Date of the one-on-one meeting (dd-mm-yyyy) | date | Yes |
| `TRANSCRIPT` | The meeting transcript - either pasted text or path to Word file | string | Yes |
| `CHECK_IN` | Summary for Section 1: Check-in - How are they doing, anything top of mind? | string | No |
| `REVIEW_LAST_MONTH` | Summary for Section 2: Review of Last Month - wins, challenges, what's working/not | string | No |
| `CURRENT_FOCUS` | Summary for Section 3: Current Focus - priorities, resources needed, escalations | string | No |
| `CAREER_DEVELOPMENT` | Summary for Section 4: Career & Development - skills, under-utilised areas, support needed | string | No |
| `FEEDBACK_EXCHANGE` | Summary for Section 5: Feedback Exchange - manager feedback, staff feedback, start/stop/continue | string | No |
| `LOOKING_AHEAD` | Summary for Section 6: Looking Ahead & Wrap-up - key actions, upcoming changes, final thoughts | string | No |

---

## Workflow

### Conditional Paths

- **User pastes transcript text directly**: Parse the pasted text and extract content for each section
- **User provides path to Word transcript file**: Read the Word document using word_get_document_text, then parse and extract

### Steps

#### Step 1: Initiation & Transcript Collection

Call MCP tool: `word_[action]`

When user invokes skill, ask for the transcript. Acknowledge what you know. Ask: 'Please provide the meeting transcript - either paste the text here, or give me the path to the Word file.'

**Prompts for**: `STAFF_NAME`, `MANAGER_NAME`, `MEETING_DATE`, `TRANSCRIPT`

#### Step 2: Extract & Populate Sections

Call MCP tool: `word_[action]`

Parse the transcript and populate each of the 6 template sections. Use bullet points for readability. Do NOT include full transcript - only summarize key points.

**Prompts for**: `CHECK_IN`, `REVIEW_LAST_MONTH`, `CURRENT_FOCUS`, `CAREER_DEVELOPMENT`, `FEEDBACK_EXCHANGE`, `LOOKING_AHEAD`

**Offer suggestion**: Yes - suggest draft for user review

#### Step 3: Preview (Mandatory)

Call MCP tool: `word_[action]`

Display a draft preview of all 6 sections in the OpenCode terminal. Show the populated fields clearly. Ask user to review and confirm. DO NOT generate PDF until user explicitly confirms with 'yes', 'looks good', or 'generate'.

**Prompts for**: 

#### Step 4: Confirm

Call MCP tool: `word_[action]`

Wait for user confirmation. If user requests changes, go back to Step 2 for that specific section. Only proceed to Step 5 after explicit confirmation.

**Prompts for**: 

#### Step 5: Generate PDF

Call MCP tool: `word_[action]`

After confirmation: (1) Copy template to a new working document, (2) Populate Date/Manager/Staff name fields, (3) Populate each of the 6 section headings with summaries, (4) Use word_convert_to_pdf to create PDF, (5) Save to Downloads folder with filename format: '{StaffName}-{dd-mm-yyyy}-OneOnOneNotes.pdf'

**Prompts for**: 

---

## Validation Rules

### STAFF_NAME

- **Type**: required
- **Error**: Staff member name is required

### MANAGER_NAME

- **Type**: required
- **Error**: Manager name is required

### MEETING_DATE

- **Type**: required
- **Error**: Meeting date is required

---

## Templates

Reference these template files:

- `One-on-One-Meeting-Notes-Template.docx`

---

## Examples

### Example 1: Convert 1:1 Transcript to PDF

**User says:** "Create one on one notes from this transcript for John Smith meeting on 11-03-2026"

**Actions:**

1. Collect: STAFF_NAME='John Smith', MANAGER_NAME, MEETING_DATE='11-03-2026'
2. Request transcript text or file path
3. Parse transcript and populate CHECK_IN, REVIEW_LAST_MONTH, CURRENT_FOCUS, CAREER_DEVELOPMENT, FEEDBACK_EXCHANGE, LOOKING_AHEAD
4. Display preview of all sections
5. Wait for user confirmation
6. Generate PDF: John-Smith-11-03-2026-OneOnOneNotes.pdf

**Result:** PDF saved to Downloads folder

## Troubleshooting

### Error: PDF not generating

**Cause:** Template not found or path incorrect

**Solution:** Ensure template is in templates/ folder relative to skill

### Error: Sections not populated correctly

**Cause:** Transcript not parsed properly

**Solution:** Manually review each section and ensure content is extracted from transcript

### Error: Filename has invalid characters

**Cause:** Staff name contains special characters

**Solution:** Sanitize staff name: replace spaces with hyphens, remove special chars

