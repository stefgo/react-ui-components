export default {
    extends: ['@commitlint/config-conventional'],
    plugins: [
        {
            rules: {
                // Conventional Commits knows two spellings for a breaking
                // change: `feat!:` and the `BREAKING CHANGE:` footer. Only the
                // second one works here.
                //
                // semantic-release reads the commits with the Angular preset,
                // whose headerPattern is /^(\w*)(?:\((.*)\))?: (.*)$/ -- without
                // `!`. A `feat(tree)!: ...` therefore falls through the pattern
                // and is read as *typeless*. commitlint would wave it through,
                // because the exclamation mark is valid by default.
                //
                // The history shows both consequences. A `!` *without* a footer
                // triggers no release at all -- as happened with `feat(tree)!:
                // DataTreeTable paginiert auf Wurzelebene` and two other
                // commits. A `!` *with* a footer does produce the major, but
                // lands in the changelog without a section: the twelve breaking
                // changes of 3.0.0 sit there as bare bullets, because their type
                // was lost.
                'no-breaking-bang': ({ header }) => [
                    !/^[a-z]+(\([^)]*\))?!:/.test(header ?? ''),
                    'The "!" is not recognised by the Angular preset and the type is lost with it. ' +
                        'Use a "BREAKING CHANGE:" footer instead.',
                ],
            },
        },
    ],
    rules: {
        // Commit messages are written in English (see CLAUDE.md) -- they become
        // CHANGELOG.md and the release notes, read by the same audience as the
        // README. The default rule forbids sentence-case, which is the natural
        // form for an English subject ("fix: Correct the focus outline on the
        // secondary variant"). It would also reject the German commits up to
        // 3.0.0, which are not being rewritten ("Aktionsspalte fuer Screenreader
        // benennen"). The type is what triggers a release, not the spelling
        // behind it.
        'subject-case': [0],

        'no-breaking-bang': [2, 'always'],
    },
};
