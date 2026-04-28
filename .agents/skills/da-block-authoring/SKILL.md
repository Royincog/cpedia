---
name: da-block-authoring
description: Author AEM Edge Delivery Services block content directly into a DA document when the user provides a document path. Use this skill when the user wants to insert, append, replace, or repair block markup in DA with the `aem-da` MCP, including requests to author a block into an existing document, create a DA document with block content, or automate DA block authoring from a content model.
license: Apache-2.0
metadata:
  version: "1.0.0"
---

# DA Block Authoring

Author EDS block content directly in DA using the `aem-da` MCP.

## When to Use This Skill

Use this skill when:
- The user gives a DA document path and wants block content authored automatically
- The task is to insert, append, replace, or fix block markup in a DA document
- The user wants block authoring automated from a known content model
- The user refers to DA, `da.live`, document source authoring, or `aem-da` MCP

Do not use this skill when:
- The task is to build or modify block code in the repo
- The user needs a new block content model first and no valid structure exists yet
- The task is about Universal Editor JSON config rather than DA document content

## Required Inputs

Collect or infer these inputs before writing:
- `documentPath`: DA path or DA URL for the target document
- `blockName`: The EDS block to author
- `content`: The actual author content for the block
- `placement`: Where the block should go

If `placement` is not specified, default to appending a new section at the end of the document.

## Related Skills

- **content-modeling**: Use when block structure is new or unclear
- **block-collection-and-party**: Use when you need a known block structure or live reference
- **block-inventory**: Use when the user has not chosen a block yet
- **content-driven-development**: Use instead if the task includes repo code changes

## Core Rules

- Prefer the `aem-da` MCP over raw API calls.
- Never guess a block structure. Inspect local block code, an existing content model, or a known reference first.
- Preserve all non-target content in the document.
- Make the smallest valid edit that satisfies the request.
- Keep block structures author-friendly:
  - Maximum 4 cells per row
  - No spreadsheet-style header rows
  - Prefer semantic formatting over config rows
- Use normal EDS section and block markup only. Do not invent wrappers.

## Document Shape

DA-authored EDS HTML should remain in standard source form:

```html
<main>
  <div>
    <div class="block-name">
      <div>
        <div>...</div>
        <div>...</div>
      </div>
    </div>
  </div>
</main>
```

Rules:
- `<main>` is the root content container
- Each section is a direct child `<div>` of `<main>`
- Each block is a `<div class="block-name">`
- Each block row is a direct child `<div>` of the block
- Each row contains 1 to 4 cell `<div>` elements

If the target document does not exist, create it with a minimal `<main>` structure.

## Workflow

### Step 1: Normalize the Target

Normalize the input to a DA document path.

Acceptable inputs:
- `https://da.live/#/org/repo/path/to/page`
- `/org/repo/path/to/page`
- `org/repo/path/to/page`

Preserve the user’s exact target path. Do not silently retarget to another document.

### Step 2: Read the Existing Document with `aem-da`

Use the `aem-da` MCP to:
- Read the source document if it exists
- Confirm whether the target must be created instead of updated

If the MCP is unavailable, stop and report that the task is blocked on `aem-da` access unless the user explicitly allows a non-MCP fallback.

### Step 3: Resolve the Block Structure

You must know the pre-decoration block structure before editing DA content.

Preferred order:
1. Existing local block content model or block code in this repo
2. Previously documented content model
3. **block-collection-and-party** skill for a reference structure
4. **content-modeling** skill if structure still is not clear

Before proceeding, confirm:
- The block variant, if any
- Rows and columns expected by the block
- Which content is optional vs required

### Step 4: Build the Block Markup

Translate the requested content into the exact authored structure the block expects.

Guidelines:
- Use one block row per repeating item for collection-style blocks
- Keep columns consistent across repeating rows
- Put real authored content in each row; do not add label rows
- Use semantic HTML inside cells (`h1`-`h6`, `p`, `ul`, `a`, `picture`, `img`)
- Use section metadata only when the user explicitly requests section-level styling or the content model requires it

If placement is:
- `append`: add a new section at the end of `<main>`
- `prepend`: add a new section at the start of `<main>`
- `replace`: replace only the targeted section or block, not the whole document
- `after` / `before`: insert relative to a clearly identified existing section or block

If the requested location is ambiguous, prefer appending a new section instead of risking destructive edits.

### Step 5: Write Back with `aem-da`

Use the `aem-da` MCP to:
- Create the document if it does not exist
- Otherwise update the existing source document in place

When updating:
- Preserve untouched sections exactly
- Only modify the minimum necessary region
- Keep formatting stable enough for future edits

### Step 6: Preview and Verify

After writing:
- Re-read the DA source if needed to confirm the block is present
- Trigger preview if the available DA workflow supports it
- Verify the path you changed matches the path the user asked for

Report back with:
- Final DA path
- Block authored
- Placement used
- Any assumptions made

## Output Contract

When this skill finishes, return:

```md
DA block authoring complete

- Path: /org/repo/path/to/page
- Block: cards
- Action: appended new section
- Structure source: local block model
- Assumptions: used default append placement
```

## Decision Notes

Use these defaults unless the user says otherwise:
- Missing placement: append a new section
- Missing document: create it
- Missing variant: use the base block name
- Ambiguous structure: stop and resolve the model before writing

## Failure Conditions

Stop and explain the blocker if:
- `aem-da` MCP is unavailable
- The target document path cannot be determined
- The block structure is unknown and cannot be validated
- The requested placement would require guessing which existing content to replace
