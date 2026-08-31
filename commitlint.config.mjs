export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        // Die Subjects sind deutsch, Substantive werden grossgeschrieben. Die
        // Default-Regel verbietet sentence-case und wuerde damit fast jeden
        // bisherigen Commit ablehnen ("Aktionsspalte fuer Screenreader
        // benennen"). Der Typ ist das, was ein Release ausloest - nicht die
        // Schreibweise dahinter.
        'subject-case': [0],
    },
};
