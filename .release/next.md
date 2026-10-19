<!--
The hand-written part of the next release: what is new, why it matters, and
what an upgrade needs. It is placed above the list of commits in the GitHub
release and in CHANGELOG.md.

Write below this comment. Use "###" for headings -- "##" is the level of the
version itself. A release with nothing written here is refused. A beta from
dev keeps the text; the stable release from main empties this file again.

Nothing inside an HTML comment is published.
-->

### A toast can report on a job while it runs

`useToast` has an `update(id, options)` that changes a toast in place, and a
toast can carry `progress: { value, max }`, drawn as a bar under its text. A
job that reaches many items can now report through one toast: raise it with
`duration: 0`, move it on as items finish, and turn it into the outcome at the
end. Giving it a duration then starts a full countdown. `update` answers
`false` once the toast is gone -- dismissed, or pushed out by `limit` -- so the
outcome can still be raised as a new toast.

A screen reader hears the job start and end; the count is not read out at
every step, but the bar can be asked for it.

### A data view's actions follow the selection

`DataMultiView` has one place for actions again: the card's header. The bar
between the search and the rows that 4.10.0 introduced for `selectionActions` is
gone. Instead, `extraActions` can be a function that is handed the picked keys
-- the empty set while nothing is picked -- so that one button acts on all rows
without a pick and on the picked rows with one, and says which in its label. A
button that only makes sense for picked rows stays in the header, disabled until
something is picked.

The pick is counted in brackets behind the title again, now for every view with
a `selection`: `selection.label`, or "3 selected".

With every button in the header, they may not fit beside the title on a narrow
screen. They now move below it, at the right edge, and wrap there; before, they
kept to one line and ran out of the card.

### Upgrading

- Move what `selectionActions` rendered into `extraActions`, written as
  `(selected) => …`. A pair of buttons that did the same for the shown and for
  the picked rows can become one.
- `selection.hint` and the slots `selectionBar` and `selectionActionsWrapper`
  are removed; there is no bar left for them.
- `extraActions` given as a node keeps working unchanged.
