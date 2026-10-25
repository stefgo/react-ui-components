<!--
The hand-written part of the next release: what is new, why it matters, and
what an upgrade needs. It is placed above the list of commits in the GitHub
release and in CHANGELOG.md.

Write below this comment. Use "###" for headings -- "##" is the level of the
version itself. A release with nothing written here is refused. A beta from
dev keeps the text; the stable release from main empties this file again.

Nothing inside an HTML comment is published.
-->

### StatCardGrid: a row of stat cards that fits its space

`StatCardGrid` lays out a row of `StatCard`s in as many columns as the row has room for,
measured on its own width rather than the window's -- so an open sidebar is taken into
account. Five cards beside an open sidebar in a 1280px window used to be too narrow for a
value like "Degraded", which pushed the icon out of the card; they now go 3 + 2, and
five across once there is room. A card never stands alone on the last row.

To use it, replace the `<div className="grid grid-cols-… gap-4">` around a row of cards
with `<StatCardGrid>`. The widths come from the Tailwind preset, so the preset has to be
in use, as it is for every other component.
