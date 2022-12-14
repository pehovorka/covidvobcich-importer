# Changelog

<a name="1.2.2"></a>

## 1.2.2 (2022-12-14)

### Fixed

- 🚑 Fix too large Firebase transactions [[f595c4d](https://github.com/pehovorka/covidvobcich-importer/commit/f595c4d762f74c16b3c118c2db905f5389852579)]

<a name="1.2.1"></a>

## 1.2.1 (2022-07-29)

### Fixed

- 🚑 Fix too large transaction for vaccinations [[999522a](https://github.com/pehovorka/covidvobcich-importer/commit/999522a288a13ad76e469effb99b5df98ccbc123)]

## Older versions

### Added

- ✨ Add municipality cases overview transformer [[8cbef98](https://github.com/pehovorka/covidvobcich-importer/commit/8cbef988091dad8783be08e91e0b862be8f3dd9d)]
- ➕ Add gitmoji-changelog [[f74220e](https://github.com/pehovorka/covidvobcich-importer/commit/f74220e073bb2116eee733cc89a86404dfd66f4e)]
- ✨ Add ORP vaccinations transformer [[4bee17a](https://github.com/pehovorka/covidvobcich-importer/commit/4bee17a4f3cf73120485f84c032a5044065ed153)]
- ✨ Add ORP vaccinations SQLite importer [[2690a18](https://github.com/pehovorka/covidvobcich-importer/commit/2690a1871ae680de52c34e56ea1519f45af4fab2)]
- ✨ Store importer version to DB [[b9c0343](https://github.com/pehovorka/covidvobcich-importer/commit/b9c034346db56a264f2b5bf8f23a718901822861)]
- ✨ Add municipality population resolver [[6daf391](https://github.com/pehovorka/covidvobcich-importer/commit/6daf39199325c484383adf4d16de73fe41d73dcc)]
- ✨ Add SQLite to Firestore transformation [[e66a29c](https://github.com/pehovorka/covidvobcich-importer/commit/e66a29c22ae75c114b22f562e9a5cffbbf803872)]
- ✨ Add CSV to SQLite importer [[4bb3017](https://github.com/pehovorka/covidvobcich-importer/commit/4bb30172492736617ee6424184882172db4956eb)]
- ✨ Add execution time check [[b0c7ebd](https://github.com/pehovorka/covidvobcich-importer/commit/b0c7ebd3304f1a852e296aaa3383d191da2477fc)]
- ✨ Add collection locking functionality [[12a5ee7](https://github.com/pehovorka/covidvobcich-importer/commit/12a5ee7e145d986925cdc4ab2edc0bc2ec678249)]
- ✨ Add downloader return value [[84bf766](https://github.com/pehovorka/covidvobcich-importer/commit/84bf766304d04393b6bedee45737897b8bfdf2f1)]
- ✨ Add download functionality [[b80e950](https://github.com/pehovorka/covidvobcich-importer/commit/b80e9509b54bc18be4cc3c64db768659b051949f)]
- ✨ Add download fetcher [[a539acf](https://github.com/pehovorka/covidvobcich-importer/commit/a539acfa3292e280524f8bd562542b8001d07002)]
- 🎉 Initial commit [[f61c76f](https://github.com/pehovorka/covidvobcich-importer/commit/f61c76fcd3507159eedb3d14a9a7c23c3e91f3fb)]

### Changed

- ♻️ Add default sort for dose order and vaccines [[357fd50](https://github.com/pehovorka/covidvobcich-importer/commit/357fd50c1e2a83ff0fd067a059445cda65320cfe)]
- 🎨 Add export of storeImporterVersion to index [[b703d73](https://github.com/pehovorka/covidvobcich-importer/commit/b703d730edbf24f55e40310e5c8750092169a0a9)]
- 🚨 Fix linter error [[8a025ae](https://github.com/pehovorka/covidvobcich-importer/commit/8a025ae6b451f6b197ae1ba18c8a5bc26295d156)]
- 🚨 Fix linter errors&quot; [[8439409](https://github.com/pehovorka/covidvobcich-importer/commit/8439409fa3551b8d36f3914dc3f768210a42ced2)]
- 🚨 Fix linter errors [[10d9588](https://github.com/pehovorka/covidvobcich-importer/commit/10d9588b073632718d45ac00560d4cfa4bf8510d)]
- 🎨 Add index file for utils [[0548b76](https://github.com/pehovorka/covidvobcich-importer/commit/0548b761e43b4d397c256df3c9012c20f8f95244)]
- ⚡ disable background activity [[d4fe6c9](https://github.com/pehovorka/covidvobcich-importer/commit/d4fe6c98a9abc2ae75e9d2c98d5a6b84ae08a503)]
- 🎨 Remove file type from general file name [[d1c056c](https://github.com/pehovorka/covidvobcich-importer/commit/d1c056c8bcc8041840f7495a529eec18bcfce630)]

### Fixed

- 🐛 Filter empty municipality id values [[79deda5](https://github.com/pehovorka/covidvobcich-importer/commit/79deda58b8252bacc8d3170dfb2fc412f6b579fb)]
- 🚑 Fix too big Firebase transaction [[2a6ad76](https://github.com/pehovorka/covidvobcich-importer/commit/2a6ad7690af8d8d7279ea9d83f59c54052711dfc)]
- 🐛 Fix missing dates when no administered doses [[622c264](https://github.com/pehovorka/covidvobcich-importer/commit/622c264b64387193bea36b459d0239be5b0dc616)]
- 🐛 Fix false return of collection locked state [[7bfcb62](https://github.com/pehovorka/covidvobcich-importer/commit/7bfcb621ffae03cc476d71838f9ec95569017fd1)]
- 🐛 fix missing municipalities [[834c742](https://github.com/pehovorka/covidvobcich-importer/commit/834c742555f162afd8e7028b95f08a91bde7eec7)]
- 🐛 catch errors while downloading [[b2ec8e7](https://github.com/pehovorka/covidvobcich-importer/commit/b2ec8e79af68bf4460a598c3db44470a0c74a273)]
- 🐛 fix missing column name error [[8162b59](https://github.com/pehovorka/covidvobcich-importer/commit/8162b595c862568d3c86867228c0054045b93950)]

### Miscellaneous

- Merge pull request [#7](https://github.com/pehovorka/covidvobcich-importer/issues/7) from pehovorka/feat/active-cases-overview [[e396e9f](https://github.com/pehovorka/covidvobcich-importer/commit/e396e9fab2791dacbcf98badd57e9e6cda49e0eb)]
- Merge pull request [#4](https://github.com/pehovorka/covidvobcich-importer/issues/4) from pehovorka/feat/orp-vaccinations [[50bfef1](https://github.com/pehovorka/covidvobcich-importer/commit/50bfef1c2b8330c7b83fd15285d697547af231a7)]
- 📝 Add available commands to README [[a4fa0ad](https://github.com/pehovorka/covidvobcich-importer/commit/a4fa0ad110f2889479751ffb11a7f19df9b9cc58)]
- 👔 Move set sourceUpdatedAt after transformer [[ca42689](https://github.com/pehovorka/covidvobcich-importer/commit/ca42689ee4188121dfd21a302363fa9d79fd1f76)]
- 👷 remove unauthenticated permission [[20d9633](https://github.com/pehovorka/covidvobcich-importer/commit/20d96332d421f997daf6aa160d6288a56667843b)]
- 👷 prepare repo for CI/CD [[ce378e7](https://github.com/pehovorka/covidvobcich-importer/commit/ce378e73a81c3d82aacfb08dea9fa12697c18e82)]
- 💡 Remove unnecessary comment [[2fcf5ca](https://github.com/pehovorka/covidvobcich-importer/commit/2fcf5cabf3b0ca4d3b7e776c1765085a31b22b60)]
