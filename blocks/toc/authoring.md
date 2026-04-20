# TOC Block Authoring Guide

The `toc` block creates an in-page table of contents for the current page. It scans the main content for `h2` headings and generates numbered anchor links automatically.

## Content Structure

The authored structure is a single-cell standalone block:

| toc |
| --- |
| Contents |

## How It Works

- The first cell is optional and is used as the TOC heading.
- If the cell is empty, the block defaults to `Contents`.
- The block automatically finds all `h2` elements in the main page content and builds the list of links from those headings.
- If an `h2` does not already have an `id`, the block creates one automatically so the TOC links can target it.

## Authoring Guidance

- Use the block on article-style pages where the body content contains multiple `h2` section headings.
- Keep the authored content simple: a short title such as `Contents` is enough.
- The headings shown in the TOC come from the page content, not from extra rows or list items inside the block.
- For best results, make sure each major section you want listed uses an `h2`.

## Example

| toc |
| --- |
| Contents |

This will render a TOC heading of `Contents` and a numbered list of links such as:

- `1. Early History`
- `2. The Middle Ages`
- `3. Modern Theories`

The exact items depend on the `h2` headings present on the page.
