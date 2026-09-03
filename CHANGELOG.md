# [3.0.0-beta.3](https://github.com/stefgo/react-ui-components/compare/v3.0.0-beta.2...v3.0.0-beta.3) (2026-09-03)


* feat(data)!: Datenschicht-Interna nicht mehr exportieren ([6a2ea8c](https://github.com/stefgo/react-ui-components/commit/6a2ea8cf008ff0f3a2f2677a163e42b95f9ca0e1))


### Bug Fixes

* **a11y:** Prevent focus stealing from closed ActionMenu and Dashboard on mount ([06277e8](https://github.com/stefgo/react-ui-components/commit/06277e80211f14e0a0a033d7c6a0ef9d82e889d4))
* **Button:** Correct focus outline for secondary variant ([7d24627](https://github.com/stefgo/react-ui-components/commit/7d246275ffb01ad6fa5287d055288574c4a6b945))
* **DataMultiView:** Improve focus visibility for toggle button ([213f232](https://github.com/stefgo/react-ui-components/commit/213f232a9b6b6b5eb025faa76760854d9ef7bc16))


### Features

* **a11y:** Fokusring als Konstanten, Button um Outline-Varianten ergänzt ([6b54b1a](https://github.com/stefgo/react-ui-components/commit/6b54b1a75cc09ad9362248290b4149a03e145b14))


### BREAKING CHANGES

* DataViewFrame, SortIcon, useDataView sowie die reinen
Pipeline-, Sortier- und Tree-Funktionen (runDataPipeline, buildComparator,
nextSortColumns, readStoredSort, isSortable, flattenTree,
collectExpandableKeys) sind nicht mehr Teil der öffentlichen API.
Öffentlich bleiben die Views und die Prop-Typen aus data/types sowie
SortOptions, TreeExpansionOptions und TreeKey.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

# [3.0.0-beta.2](https://github.com/stefgo/react-ui-components/compare/v3.0.0-beta.1...v3.0.0-beta.2) (2026-09-01)


* fix(api)!: jede Props-Schnittstelle exportieren ([b2dd537](https://github.com/stefgo/react-ui-components/commit/b2dd537ca500752366f062d94dba31017cc3d178))


### Features

* **card:** Padding-Prop statt eigener DataCard-Komponente ([e2fc57a](https://github.com/stefgo/react-ui-components/commit/e2fc57a0ad57528afa1599494912731638331bab))


### BREAKING CHANGES

* Nur additiv fuer Konsumenten, aber die Typen sind ab jetzt
Teil der oeffentlichen Oberflaeche und koennen nicht mehr unbemerkt geaendert
werden.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

# [3.0.0-beta.1](https://github.com/stefgo/react-ui-components/compare/v2.16.1...v3.0.0-beta.1) (2026-09-01)


* feat(dashboard)!: Routing an den Consumer zurueckgeben ([8a9918f](https://github.com/stefgo/react-ui-components/commit/8a9918f9f5c22a2b74569338b518455d585de685))
* feat(data-views)!: neue Pagination-API, Pipeline in useDataView ([1ecee8e](https://github.com/stefgo/react-ui-components/commit/1ecee8ec25cd16bb75da2144738261dff08aa0d5))
* feat(hooks)!: usePagination liefert nur noch den Seitenzustand ([7a8b9e3](https://github.com/stefgo/react-ui-components/commit/7a8b9e384a3e3626b3977226ffe5c10b5617a7b2))
* feat(pagination)!: hideOnSinglePage, pageSizeOptions, unbekannte Gesamtzahl, a11y ([7e37f45](https://github.com/stefgo/react-ui-components/commit/7e37f45e282df4c29f8f2580baf6dcb8e237293c))
* refactor(api)!: Icons, Groessen und className auf je eine Konvention ([ac2dcf4](https://github.com/stefgo/react-ui-components/commit/ac2dcf450f07399113971f2e49552d53fe4c6ee5))
* refactor(data-views)!: AbstractDataView-Klasse entfernen ([ee5f11a](https://github.com/stefgo/react-ui-components/commit/ee5f11a85d0d0769c5f28fc0ba393e592a2e6e62))
* refactor(multi-view)!: Suchfilter an die View durchreichen ([5d49a5c](https://github.com/stefgo/react-ui-components/commit/5d49a5cfc22aafe692777d8c9ce46de5780c1d43))
* refactor(multi-view)!: totes listDef-Prop entfernen ([d2f231e](https://github.com/stefgo/react-ui-components/commit/d2f231e267ec7063e2b1b3ab04e265d3a75b73df))
* refactor(state)!: eine Konvention fuer kontrollierten und unkontrollierten Zustand ([2460722](https://github.com/stefgo/react-ui-components/commit/2460722ba1c357e136d328c177581f1af635dcbb))
* refactor(tokens)!: ein Token pro Rolle statt zwei, plus Radien- und Motion-Skala ([8f680c8](https://github.com/stefgo/react-ui-components/commit/8f680c8fb9f767b60985d1d63451fa17e720185c)), closes [#f9fafb](https://github.com/stefgo/react-ui-components/issues/f9fafb)


### Bug Fixes

* **build:** main und module auf die tatsaechlich gebauten Dateien zeigen ([7ee38b9](https://github.com/stefgo/react-ui-components/commit/7ee38b9e6158d413649c521f15cb5f01990a4128))
* **data-table:** Aktionsspalte fuer Screenreader benennen ([6b3782a](https://github.com/stefgo/react-ui-components/commit/6b3782ab5f11201f273343dab43490839d89305f))
* **data-views:** Datenansichten per Tastatur bedienbar machen ([5dcaddf](https://github.com/stefgo/react-ui-components/commit/5dcaddf6c7390b5b90393858c0255a2c606ea7ec))
* **file-browser:** Effekt meldet den Pfad ohne veralteten Callback ([84d463e](https://github.com/stefgo/react-ui-components/commit/84d463e08b941a3f48657ce940b4ff35f087341b))
* pin npm version to ensure compatibility between CI workflows ([c7a25ce](https://github.com/stefgo/react-ui-components/commit/c7a25ced8e0a0a2662887b0f23e8cfc937e65bf3))
* **radio:** required-Zustand ARIA-konform auszeichnen ([5a13e99](https://github.com/stefgo/react-ui-components/commit/5a13e99d139213abcf2c879e7203653998ced7d3))
* **tokens:** Farbliterale aus Preset und BottomNav entfernen ([702396e](https://github.com/stefgo/react-ui-components/commit/702396ef03d7098f3f23277fe448085e78cf60cc))
* **tree:** defaultExpanded auch fuer nachgeladene Daten ([7d489fc](https://github.com/stefgo/react-ui-components/commit/7d489fcc4f2ceec3293588aaf66071ce13c4465a))


### Code Refactoring

* **forms:** Label-, Hint- und Fehlerlogik in FormField zusammenfuehren ([91f435d](https://github.com/stefgo/react-ui-components/commit/91f435d551c4f248998b2079d6531f7efb2cc6d2))


### Features

* **a11y:** Tastatur- und Screenreader-Unterstuetzung, Tokens aus einer Quelle ([0a68009](https://github.com/stefgo/react-ui-components/commit/0a6800989819f05944588f469e0a38a48bad92c1))
* **data:** Pipeline fuer Filter, Sortierung und Paging ([80fab1a](https://github.com/stefgo/react-ui-components/commit/80fab1a42571af926ab859638b50ceabc4b8fa74))
* Modal, Toast, Tooltip, Checkbox, Radio, Switch und Textarea ([9dfba0c](https://github.com/stefgo/react-ui-components/commit/9dfba0cb30e02c9640ad5821154c4a58d68a2d58))
* **release:** add workflow for publishing package with checks and builds ([0cdb8b6](https://github.com/stefgo/react-ui-components/commit/0cdb8b651af453120464cfa9e5ce08e24ebd1282))


### BREAKING CHANGES

* ActionMenu nimmt `anchor` (ein Rechteck) statt `position`
({x, y, top}); useActionMenu liefert entsprechend `menuState.anchor`.
ActionButton setzt kein `title` mehr – der sichtbare Hinweis kommt aus
einem echten Tooltip, der zugaengliche Name weiterhin aus aria-label.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
* Collapsible nutzt value/defaultValue/onChange statt
expanded/initiallyExpanded/onExpandedChange. DataMultiView nutzt
search={{...}} und viewMode={{..., storageKey}} statt defaultSearchValue,
onSearchChange und viewModeStorageKey; treeTableDefaultExpanded heisst
treeExpanded={{ all }}. DataTable und DataTreeTable nutzen sort={{
defaultValue, storageKey }} statt defaultSort und sortStorageKey;
DataTreeTable zusaetzlich expanded={{...}} statt defaultExpanded.
useSortColumns und useTreeExpansion nehmen ihre Optionen entsprechend.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
* **forms:** `InputClassNames.inputWrapper` und
`SelectClassNames.selectWrapper` heissen einheitlich `control`.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
* `icon` erwartet die Komponente statt des Elements
(`icon={Save}` statt `icon={<Save size={16} />}`) bei Button, Input,
Sidebar, BottomNav, StatCard, Dashboard.mobileMore und MobileMoreSheet.
`ActionButton.size` ist 'sm' | 'md' | 'lg' statt einer Zahl.
`classNames.root` und `containerClassName` entfallen zugunsten von
`className`. `ActionMenuClassNames` und `DataActionClassNames.menu`
entfallen. `BadgeClassNames` entfaellt, da `root` sein einziger Slot war.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
* Die -dark-Tokens und -Klassen entfallen ersatzlos. Wer
--ruic-bg-card-dark gesetzt hat, setzt jetzt --ruic-bg-card im .dark-Block; wer
bg-card-dark als Klasse nutzt, nutzt bg-card. Das Preset setzt darkMode selbst
auf "class". Badge variant "gray" heisst "neutral". --ruic-info-light entfaellt
zugunsten des Dark-Werts von --ruic-info-hover. Die Radien-Stufen sm bis xl
haben andere Werte als Tailwinds Standard.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
* DashboardPage.content entfaellt - Seiteninhalte gehoeren in
die Routen des Consumers und werden Dashboard als children uebergeben. Die
Legacy-Props mobileMoreMenu und mobileMenuOverlay entfallen ersatzlos; Titel
und Icon des Mobile-Sheets kommen ueber die neue Prop mobileMore, die
Einordnung ueber nav.placement: 'mobile-more'. Passt keine Seite auf den
aktuellen Pfad, wird nichts mehr hervorgehoben statt auf die erste Seite
zurueckzufallen - Consumer brauchen eine eigene Catch-all-Route.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
* DataMultiViewProps.listDef entfaellt. Die Feldkonfiguration
der Listenansicht steht in listColumns; der Typ DataListDef bleibt
unveraendert exportiert.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
* usePagination hat eine neue Signatur und Rueckgabe.
usePagination(items, size) wird zu usePagination({ pageSize: size }) ohne
das Datenargument; currentItems, totalPages, totalItems, goToPage, nextPage
und prevPage entfallen. Die Zeilen kommen nicht mehr aus dem Hook, sondern
bleiben vollstaendig bei der View.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
* Die Props von PaginationControls heissen wie im Rest der
neuen API -- currentPage -> page, itemsPerPage -> pageSize,
onItemsPerPageChange -> onPageSizeChange. Die Komponente blendet sich nicht
mehr automatisch bei bis zu 10 Eintraegen aus; wer das will, setzt
hideOnSinglePage.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
* searchFilter wird nicht mehr auf die Daten angewandt, bevor
sie an die View gehen. Wer sich darauf verlassen hat, dass data bereits
gefiltert ankommt -- etwa in einem eigenen rowClassName oder onRowClick --
bekommt jetzt die ungefilterte Menge zu sehen. Extern gefilterte Aufrufer
(onSearchChange) sind nicht betroffen.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
* Die pagination-Prop hat eine neue Form. currentPage,
totalPages, itemsPerPage, totalItems, onPageChange, onItemsPerPageChange,
sliceInternally und renderControls entfallen ersatzlos. data ist im
Client-Modus immer die Gesamtmenge, nicht mehr die aktuelle Seite. Die
Umstellung ist nicht stillschweigend moeglich: die alte und die neue Form
haben kein gemeinsames Pflichtfeld, TypeScript meldet jede Aufrufstelle.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
* AbstractDataView wird nicht mehr exportiert. Wer davon
abgeleitet hat, baut die View als Funktionskomponente mit useDataView und
DataViewFrame. Die Typen BaseDataViewProps und DataViewClassNames bleiben
unter demselben Namen importierbar.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>

## [2.16.1](https://github.com/stefgo/react-ui-components/compare/v2.16.0...v2.16.1) (2026-08-30)


### Bug Fixes

* **data-views:** vor dem Paginieren sortieren statt danach ([87dbe55](https://github.com/stefgo/react-ui-components/commit/87dbe55c7b1cfe9dd43b4a1149b15b086bb84ac8))

# [2.16.0](https://github.com/stefgo/react-ui-components/compare/v2.15.0...v2.16.0) (2026-04-07)


### Features

* support object label in DataTableActionMenuEntry ([1e88b63](https://github.com/stefgo/react-ui-components/commit/1e88b6319273b59eda186646010fb82334eaea3c))

# [2.15.0](https://github.com/stefgo/react-ui-components/compare/v2.14.0...v2.15.0) (2026-04-05)


### Bug Fixes

* only force list view on mobile when listColumns is defined ([7fcaff4](https://github.com/stefgo/react-ui-components/commit/7fcaff4a960d7604a3eb3e0f1d6943f9a17bebb7))


### Features

* add DashboardNavGroup for explicit sidebar grouping with optional titles ([80c3b73](https://github.com/stefgo/react-ui-components/commit/80c3b7324792063689dbfaa73bc178dfd87ec579))

# [2.14.0](https://github.com/stefgo/react-ui-components/compare/v2.13.1...v2.14.0) (2026-04-03)


### Features

* render PaginationControls in DataMultiView when pagination prop is set ([93667d8](https://github.com/stefgo/react-ui-components/commit/93667d819c9535c371622801384a235d6558f116))

## [2.13.1](https://github.com/stefgo/react-ui-components/compare/v2.13.0...v2.13.1) (2026-04-03)


### Bug Fixes

* normalize red color to ghost style, add error color for permanent red tint ([0bf35e3](https://github.com/stefgo/react-ui-components/commit/0bf35e33a247d6977b2a0be4c45710232ac17709))

# [2.13.0](https://github.com/stefgo/react-ui-components/compare/v2.12.1...v2.13.0) (2026-04-02)


### Features

* add defaultSearchValue prop and clear button to DataMultiView search ([adf73e0](https://github.com/stefgo/react-ui-components/commit/adf73e0ff1965d1559d210ff695ad8dbc33ca2a9))

## [2.12.1](https://github.com/stefgo/react-ui-components/compare/v2.12.0...v2.12.1) (2026-04-02)


### Bug Fixes

* remove whitespace-nowrap from DataTable td to allow text wrapping ([c169aff](https://github.com/stefgo/react-ui-components/commit/c169aff63e99414e44615b318716c0602da55a71))

# [2.12.0](https://github.com/stefgo/react-ui-components/compare/v2.11.2...v2.12.0) (2026-03-31)


### Features

* add usePagination hook ([97e0dcd](https://github.com/stefgo/react-ui-components/commit/97e0dcdb48278aef24f202c7c0978df14e55a0f1))

## [2.11.2](https://github.com/stefgo/react-ui-components/compare/v2.11.1...v2.11.2) (2026-03-30)


### Bug Fixes

* prevent layout shift when scrollbar appears/disappears ([1f2866c](https://github.com/stefgo/react-ui-components/commit/1f2866c8b9d5c450c4a5ce51b713e9e48cfac27c))

## [2.11.1](https://github.com/stefgo/react-ui-components/compare/v2.11.0...v2.11.1) (2026-03-29)


### Bug Fixes

* adjust column layout for responsive design in DataList component ([1712e00](https://github.com/stefgo/react-ui-components/commit/1712e00b803c1e25ebd9257b5195de44f22c1d16))

# [2.11.0](https://github.com/stefgo/react-ui-components/compare/v2.10.0...v2.11.0) (2026-03-29)


### Features

* add grow property to DataListColumnDef for flexible column sizing ([9505965](https://github.com/stefgo/react-ui-components/commit/95059655ee09e355f9bcb2d35bd2d89a6fe01e1a))

# [2.10.0](https://github.com/stefgo/react-ui-components/compare/v2.9.0...v2.10.0) (2026-03-29)


### Features

* add defaultSort prop to DataTreeTable for customizable sorting ([e39d1de](https://github.com/stefgo/react-ui-components/commit/e39d1de478a91219adb2699f5aa866a9a87c160b))

# [2.9.0](https://github.com/stefgo/react-ui-components/compare/v2.8.0...v2.9.0) (2026-03-29)


### Features

* enhance header styling in DataMultiView component for improved search visibility ([be98543](https://github.com/stefgo/react-ui-components/commit/be98543facbf6ffdc8e70489579c148cdd78dbcc))
* improve search bar styling in DataMultiView component ([b170caa](https://github.com/stefgo/react-ui-components/commit/b170caa6ae05139da77bccb1d0a19fa2abf6f4c8))

# [2.8.0](https://github.com/stefgo/react-ui-components/compare/v2.7.2...v2.8.0) (2026-03-29)


### Features

* add defaultSort prop to DataMultiView and DataTable components for enhanced sorting functionality ([86cc664](https://github.com/stefgo/react-ui-components/commit/86cc6648354e93ea8ca96f2ab544ab61f62aaaf4))
* add search functionality to DataMultiView component with customizable filter and placeholder ([8f55307](https://github.com/stefgo/react-ui-components/commit/8f55307f4eee7062d93c0cc04c8da9b203ab01f0))
* add sortStorageKey to DataTable and DataMultiView for persistent sorting state ([3e65b09](https://github.com/stefgo/react-ui-components/commit/3e65b09f5e4e4a77003f1aa71f3d28972d251e89))

## [2.7.2](https://github.com/stefgo/react-ui-components/compare/v2.7.1...v2.7.2) (2026-03-28)


### Bug Fixes

* update layout styles for DashboardLayout and Sidebar components; add custom scrollbar utility ([e80b5f1](https://github.com/stefgo/react-ui-components/commit/e80b5f11629fc2f3d7ec0a01f1cc2195292db6c7))

## [2.7.1](https://github.com/stefgo/react-ui-components/compare/v2.7.0...v2.7.1) (2026-03-28)


### Bug Fixes

* adjust view toggle condition to require more than one visible button ([a0cf924](https://github.com/stefgo/react-ui-components/commit/a0cf9242b310b5df79f150ab3ef7cc9ce1af41cd))

# [2.7.0](https://github.com/stefgo/react-ui-components/compare/v2.6.0...v2.7.0) (2026-03-25)


### Features

* add sorting functionality to DataTreeTable and improve view handling ([c5ff0cb](https://github.com/stefgo/react-ui-components/commit/c5ff0cb5c66afe1ae62e3360d2fc9b31404f1d9c))

# [2.6.0](https://github.com/stefgo/react-ui-components/compare/v2.5.0...v2.6.0) (2026-03-25)


### Features

* update DataMultiView to use tableDef for tree view logic and adjust view toggle buttons ([0c8e369](https://github.com/stefgo/react-ui-components/commit/0c8e369704454f53a70744bcefdc0e9fd89ff74f))

# [2.5.0](https://github.com/stefgo/react-ui-components/compare/v2.4.0...v2.5.0) (2026-03-25)


### Features

* add DataTreeTable component and export it from index ([ac846e4](https://github.com/stefgo/react-ui-components/commit/ac846e4ff780c2fb984a88500c7c18c0ef2dacd2))
* enhance DataMultiView with tree table view support and related props ([309d106](https://github.com/stefgo/react-ui-components/commit/309d1064e68194c7f77fe92e8b15098905f0e1c6))
* remove DataExtendedTable export from index ([4b24e9c](https://github.com/stefgo/react-ui-components/commit/4b24e9cf80edb87f8b812583d96e3d6952289f9e))

# [2.4.0](https://github.com/stefgo/react-ui-components/compare/v2.3.0...v2.4.0) (2026-03-24)


### Features

* add path matching logic and currentPath prop to Dashboard component ([5f56e4b](https://github.com/stefgo/react-ui-components/commit/5f56e4bd55c6f4b6ea7c7fa267fc0187c8fa5d66))
* implement sorting functionality in DataTable component ([9bffe18](https://github.com/stefgo/react-ui-components/commit/9bffe182152b46ca05335a45875eba03542049ac))

# [2.3.0](https://github.com/stefgo/react-ui-components/compare/v2.2.0...v2.3.0) (2026-03-23)


### Bug Fixes

* update disabled state styles for ActionButton component ([c9b3f74](https://github.com/stefgo/react-ui-components/commit/c9b3f74c57ec7496a945cdf0d7cc31773fa55414))


### Features

* implement DataExtendedTable component with expandable rows and custom rendering ([e45de31](https://github.com/stefgo/react-ui-components/commit/e45de31405546605a73bfd7c5fc623cf77ab9bd4))

# [2.2.0](https://github.com/stefgo/react-ui-components/compare/v2.1.1...v2.2.0) (2026-03-20)


### Features

* add LoginPage component and export it from index ([56bf918](https://github.com/stefgo/react-ui-components/commit/56bf9185b733ed83f25efb592f0e55903fa9ceb1))

## [2.1.1](https://github.com/stefgo/react-ui-components/compare/v2.1.0...v2.1.1) (2026-03-20)


### Bug Fixes

* update color definitions in Tailwind preset for improved consistency ([5ae4b82](https://github.com/stefgo/react-ui-components/commit/5ae4b823ce85a1032c2e167bc45c9cffe663b32d))

# [2.1.0](https://github.com/stefgo/react-ui-components/compare/v2.0.0...v2.1.0) (2026-03-18)


### Features

* update styling and theming across components ([41a61a0](https://github.com/stefgo/react-ui-components/commit/41a61a073f0be7ed883bf7c3f6a603e5ca636c75))

# [2.0.0](https://github.com/stefgo/react-ui-components/compare/v1.6.0...v2.0.0) (2026-03-14)


### Features

* trigger major ([833b35d](https://github.com/stefgo/react-ui-components/commit/833b35d8a32e2d5ee6e575094119f5bbc6da2e3d))


### BREAKING CHANGES

* force release

# [1.6.0](https://github.com/stefgo/react-ui-components/compare/v1.5.2...v1.6.0) (2026-03-10)


### Features

* Add custom Tailwind theme colors and shadow, and update input, select, and sidebar components to utilize them. ([2fa59b1](https://github.com/stefgo/react-ui-components/commit/2fa59b18e49d778cc1781c59eecc0a3a70cfd27f))

## [1.5.2](https://github.com/stefgo/react-ui-components/compare/v1.5.1...v1.5.2) (2026-03-10)


### Bug Fixes

* revert pre-built CSS, use content scanning for Tailwind classes ([c5c7355](https://github.com/stefgo/react-ui-components/commit/c5c7355f3172036b01d35763dfef335ecac32f3f))

## [1.5.1](https://github.com/stefgo/react-ui-components/compare/v1.5.0...v1.5.1) (2026-03-10)


### Bug Fixes

* Wrap Tailwind utilities in CSS layer to prevent cascade conflicts ([8a7da83](https://github.com/stefgo/react-ui-components/commit/8a7da8386a1a28f266ec64ff623882c2a83e6ef1))

# [1.5.0](https://github.com/stefgo/react-ui-components/compare/v1.4.1...v1.5.0) (2026-03-09)


### Features

* Pre-build Tailwind CSS into a distributable `styles.css` file and update build process to include PostCSS. ([5d9339a](https://github.com/stefgo/react-ui-components/commit/5d9339adef0eba788bb4225185b867f2367912d8))

## [1.4.1](https://github.com/stefgo/react-ui-components/compare/v1.4.0...v1.4.1) (2026-03-09)


### Bug Fixes

* re-publish package with correct tailwind-preset exports ([5680c28](https://github.com/stefgo/react-ui-components/commit/5680c28c093f3b005278b64c2187471bd6efa89f))

# [1.4.0](https://github.com/stefgo/react-ui-components/compare/v1.3.1...v1.4.0) (2026-03-09)


### Features

* Expose Tailwind CSS preset and add it as a peer dependency. ([221445a](https://github.com/stefgo/react-ui-components/commit/221445a90b8364b17488898c2ff2a07e01adcb6a))

## [1.3.1](https://github.com/stefgo/react-ui-components/compare/v1.3.0...v1.3.1) (2026-03-09)


### Bug Fixes

* export missing tailwind-preset.js file ([7e330f8](https://github.com/stefgo/react-ui-components/commit/7e330f8b835380d260dbe6b1319cdbec24ce4a8f))

# [1.3.0](https://github.com/stefgo/react-ui-components/compare/v1.2.0...v1.3.0) (2026-03-09)


### Features

* include tailwind-plugin.js in published package files ([0404325](https://github.com/stefgo/react-ui-components/commit/0404325a929eededc3eaf4c4f66ba01efed13848))
* provide Tailwind CSS plugin to automatically include library's dist files in content configuration. ([8f0e2c8](https://github.com/stefgo/react-ui-components/commit/8f0e2c82717d744d14ab7f27ddd618bfc7833463))

# [1.4.0](https://github.com/stefgo/react-ui-components/compare/v1.3.0...v1.4.0) (2026-03-09)


### Features

* include tailwind-plugin.js in published package files ([0404325](https://github.com/stefgo/react-ui-components/commit/0404325a929eededc3eaf4c4f66ba01efed13848))

# [1.3.0](https://github.com/stefgo/react-ui-components/compare/v1.2.0...v1.3.0) (2026-03-09)


### Features

* provide Tailwind CSS plugin to automatically include library's dist files in content configuration. ([8f0e2c8](https://github.com/stefgo/react-ui-components/commit/8f0e2c82717d744d14ab7f27ddd618bfc7833463))

# [1.2.0](https://github.com/stefgo/react-ui-components/compare/v1.1.0...v1.2.0) (2026-03-08)


### Features

* Introduce Dashboard components, replace AppHeader with DashboardHeader, and generalize icon prop types in ActionButton and DataAction. ([551748b](https://github.com/stefgo/react-ui-components/commit/551748bf5cde15d2a5058d0844e050f024e0e972))

# [1.1.0](https://github.com/stefgo/react-ui-components/compare/v1.0.1...v1.1.0) (2026-03-08)


### Features

* Add Badge, BottomNav, Collapsible, Sidebar, ThemeToggle, and AppHeader UI components. ([de1a688](https://github.com/stefgo/react-ui-components/commit/de1a6885261d09b9a172c4135d0674ca000f58b4))

## [1.0.1](https://github.com/stefgo/react-ui-components/compare/v1.0.0...v1.0.1) (2026-03-07)


### Bug Fixes

* trigger automated release to bypass 1.0.0 conflict ([f34af63](https://github.com/stefgo/react-ui-components/commit/f34af631567c8eaf76aca59b2c7158948dfe17cc))

# 1.0.0 (2026-03-07)


### Features

* implement semantic-release for automated versioning and publishing ([b73fd0d](https://github.com/stefgo/react-ui-components/commit/b73fd0d6fc2cf5a05c24d1160fa16779308119ca))
