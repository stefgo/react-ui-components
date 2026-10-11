<!--
The hand-written part of the next release: what is new, why it matters, and
what an upgrade needs. It is placed above the list of commits in the GitHub
release and in CHANGELOG.md.

Write below this comment. Use "###" for headings -- "##" is the level of the
version itself. A release with nothing written here is refused. A beta from
dev keeps the text; the stable release from main empties this file again.

Nothing inside an HTML comment is published.
-->

### Stat cards line up across a row

In a row of `StatCard`s the label, the value and the line below it now sit at the same
height in every card. A label that wraps moves the values of the whole row down instead of
only its own, and a card without a `sub` keeps the line free. Nothing has a fixed height:
each line is as tall as the tallest one in the row.

This works when the cards are direct children of a grid, which is how they are normally
laid out, and needs no change there. Two things to check on an upgrade:

- A card now takes three rows of that grid. Anything that is not a `StatCard` in the same
  grid needs `row-span-3` to stay as tall as the cards.
- `classNames.labelWrapper` is gone, together with the element it styled. Remove it where
  it is passed.

A row in which no card has a `sub` is a little lower than before: most of the space that
was kept below the value for a line that was not there is no longer kept.

### Filters in the search bar match the search

A `Select` passed to `DataMultiView` as `searchActions` now has the shape of the search
next to it: the same height, rounding, border and background. Until now it arrived as a
form field, and each list restyled it by hand or left the two looking unrelated.

The page size below a list has the same shape, so the controls above and below the rows
read as one set. It also has the library's own arrow now instead of the browser's.

The same look is available anywhere as `<Select variant="pill">`, for a row of filters
outside a list. In the search bar, `variant="field"` gives the form field back.

An upgrade needs nothing. Classes that were passed to a select in the search bar to make
it a pill can be removed; left in place they change nothing.

### A card's actions stay at the top of its header

The action of a `Card` -- and with it the view toggle and the `extraActions` of a
`DataMultiView` -- is now aligned with the top of the header. Next to a title of several
lines it used to sit at the title's middle. A title of one line still sits level with a
button beside it, so the usual header looks as it did.

A long title no longer pushes the action out of the card: it takes the room that is left,
with a gap to the action, and can be cut short with `truncate`.

An upgrade needs nothing. Classes that were passed as `classNames.header` to get this
(`items-start`, a gap, `min-w-0` on the title) can be removed.

### Releases

Releases are now produced by the release workflow all stefgo projects share. A version can
be tried as a beta before it is released, and every release is described here by hand, above
the list of commits.
