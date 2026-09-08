# Automatic npm releases

Merging to `main` triggers `.github/workflows/publish.yml`. No manually edited version or local `npm publish` is needed after the one-time npm trust setup.

## One-time setup

In npm package **merchi_checkout** settings, add a GitHub Actions trusted publisher:

- Owner: `merchisdk`
- Repository: `merchi_checkout`
- Workflow filename: `publish.yml`
- Environment: leave blank (the job has no GitHub environment)
- Allow direct publishing (`npm publish`), not stage-only publishing.

An npm package owner must authorize this once. There is no `NPM_TOKEN` dependency. Current local npm credentials returned 401, so this trust setup has not been verified or completed by Codex. GitHub branch rules must allow the workflow bot to write the version commit to `main`; the workflow never disables protection or force-pushes.

Official setup: https://docs.npmjs.com/trusted-publishers/

## Behavior

- Builds latest `main` after acquiring a per-repository concurrency slot. Several rapid merges may be included in one release.
- Uses an explicitly prepared stable version if it is newer than npm latest; otherwise automatically increments the registry's patch version. Major/minor releases remain deliberate changes to package.json.
- Installs dependencies and builds before publishing. npm install also repairs the historical lockfile/manifest mismatch; the resulting lockfile and version are committed together.
- Pushes the version commit with `[skip ci]` using `GITHUB_TOKEN`; it does not trigger another push workflow. A concurrent main update rejects the push and prevents publication of that attempt.
- Publishes through npm OIDC, verifies registry version and git commit, then tags `v<version>`.
- Re-runs of the already published commit do not bump or republish. If publication failed after the version commit, retries reuse the unpublished version.
- The hourly run recovers interrupted releases and packages whose new dependencies were not published yet. A failed build or missing authorization still reports failure; it cannot be solved by inventing credentials or publishing broken code. A manual Actions rerun is optional.

Merge/release SDK and invoice before cart and checkout for the initial wallet release. Cart/checkout require invoice 1.3.2 or later; if merged sooner they wait through failed install/retry runs until it exists. Consumers such as Dashboard retain their normal lockfile update/review process; this workflow does not merge or deploy consumers.

Validation: local release planner tests and YAML parsing. Package builds and payment regression tests were verified separately. Actual GitHub-to-npm publishing still requires the one-time trusted publisher setup and a merged workflow.
