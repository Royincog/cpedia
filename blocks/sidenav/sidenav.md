# Sidenav Block Authoring Guide

The Sidenav block creates a fixed left-side navigation menu designed to organize content structurally and functionally for the "Archive" aesthetic.

## Content Structure

To use the `sidenav` block, create an authored section containing the block and divide it into three distinct rows.

The structure is:

1.  **Row 1: Title and Subtitle**
    *   Place a `<H2>` (or any heading) for the main title (e.g., "The Archive").
    *   Place a general text paragraph for the subtitle (e.g., "CURATED KNOWLEDGE").

2.  **Row 2: Primary Navigation**
    *   Provide an Unordered List (`<ul>`) of links. This will form the main vertical navigation links in the sidebar.

3.  **Row 3: Secondary Navigation (Bottom Footer)**
    *   Provide an Unordered List (`<ul>`) for sticky bottom links.
    *   If you include AEM icon notations like `:help:` or `:volunteer_activism:` next to the link text, they will be transformed into respective icons alongside your link text.

### Example Authored Output (In Word / HTML translation)

| sidenav |
| :--- |
| **The Archive** <br> CURATED KNOWLEDGE |
| • [Main Page](#) <br> • [Contents](#) <br> • [Featured](#) <br> • [Random Article](#) |
| • :help: [Help](#) <br> • :volunteer_activism: [Donate](#) |

## CSS Appearance

The Sidenav will:
- Be hidden on extremely narrow (mobile) screens natively.
- Be pinned fixed to the left edge of the screen on devices mapping to `md` and above (≥768px).
- Handle hover interactions using primary and secondary design tokens outlined under `.stitch/DESIGN.md`.
