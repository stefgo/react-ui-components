<!--
The hand-written part of the next release: what is new, why it matters, and
what an upgrade needs. It is placed above the list of commits in the GitHub
release and in CHANGELOG.md.

Write below this comment. Use "###" for headings -- "##" is the level of the
version itself. A release with nothing written here is refused. A beta from
dev keeps the text; the stable release from main empties this file again.

Nothing inside an HTML comment is published.
-->

### Wrapped text in a table sits 20px apart

A cell of `DataTable` and `DataTreeTable` now has the small text size (`text-sm`) as its
own. Text that wraps inside a cell used to take the cell's inherited line height of 24px,
even where the column set `text-sm` on an inline element; two lines now sit 20px apart,
the line height of `text-sm`.

Two things change with it:

- A row whose cells hold inline text is 4px lower than before: the cell's own line height
  set its height, not the text's.
- Text in a cell that sets no size of its own is 14px instead of 16px. A column that wants
  another size keeps setting it through `cellClassName`; it replaces the cell's.

An upgrade needs nothing. A `text-sm` passed to a column's `cellClassName` only to get this
size can stay; it changes nothing.
