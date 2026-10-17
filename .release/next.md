<!--
The hand-written part of the next release: what is new, why it matters, and
what an upgrade needs. It is placed above the list of commits in the GitHub
release and in CHANGELOG.md.

Write below this comment. Use "###" for headings -- "##" is the level of the
version itself. A release with nothing written here is refused. A beta from
dev keeps the text; the stable release from main empties this file again.

Nothing inside an HTML comment is published.
-->

### A data view's actions say what they act on

`DataMultiView` now has two places for actions, and where a button stands says
whether it acts on what the list shows or on what is picked.

- **`globalActions`** replaces `extraActions` (and the slot `globalActionsWrapper`
  replaces `extraActionsWrapper`). They sit in the header, as before: creating
  something, or acting on the rows the search and the filters leave.
- **`selectionActions`** now have a bar of their own between the search and the
  rows. The bar is there before the first pick, so a pick no longer pushes the
  rows down, and its actions end at the same right edge as the header's. While
  nothing is picked it can show a hint (`selection.hint`); once something is, it
  counts the picks. The count no longer follows the title, except for a view
  that has `selection.label` but no `selectionActions`.

### Upgrading

Rename `extraActions` to `globalActions` and `extraActionsWrapper` to
`globalActionsWrapper` — TypeScript points at each. Buttons that acted on the
picked rows from the header move into `selectionActions`, and should be disabled
while the set they are called with is empty. The README has a section *Migrating
from 4.x to 5.0*.
