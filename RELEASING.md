# Automatic npm releases

Merging to `main` triggers `.github/workflows/publish.yml`. No manually edited version or local `npm publish` is needed after the one-time npm trust setup.

## One-time setup

In npm package **merchi_checkout** settings, add a GitHub Actions trusted publisher:

- Owner: `merchisdk`
- Repository: `merchi_checkout`
- Workflow filename: `publish.yml`
- Environment: leave blank (the job has no GitHub environment)
- Allow direct publishing (`npm publish`), not stage-only publishing.

An npm package owner must authorize this once. There is no `NPM_TOKEN` dependency. Trusted Publisher was configured and visibly verified on npm on 2026-09-08 for this repository, publish.yml, no environment, with direct publish permission. Local npm login is not required for this OIDC workflow. GitHub branch rules must allow the workflow bot to write the version commit to `main`; the workflow never disables protection or force-pushes.

Official setup: https://docs.npmjs.com/trusted-publishers/

## Behavior

- Builds latest `main` after acquiring a per-repository concurrency slot. Several rapid merges may be included in one release.
- Uses an explicitly prepared stable version if it is newer than npm latest; otherwise automatically increments the registry's patch version. Major/minor releases remain deliberate changes to package.json.
- Installs dependencies and builds before publishing. npm install also repairs the historical lockfile/manifest mismatch; the resulting lockfile and version are committed together.
- Pushes the version commit with `[skip ci]` using `GITHUB_TOKEN`; it does not trigger another push workflow. A concurrent main update rejects the push and prevents publication of that attempt.
- Publishes through npm OIDC, verifies registry version and git commit, then tags `v<version>`.
- Re-runs of the already published commit do not bump or republish. If publication failed after the version commit, retries reuse the unpublished version only while it remains newer than latest and unoccupied.
- The hourly run recovers interrupted releases and packages whose new dependencies were not published yet. A failed build or missing authorization still reports failure; it cannot be solved by inventing credentials or publishing broken code. A manual Actions rerun is optional.

Merge/release SDK and invoice before cart and checkout for the initial wallet release. Cart/checkout require invoice 1.3.2 or later; if merged sooner they wait through failed install/retry runs until it exists. Consumers such as Dashboard retain their normal lockfile update/review process; this workflow does not merge or deploy consumers.

Validation: local release planner tests and YAML parsing. Package builds and payment regression tests were verified separately. Actual GitHub-to-npm publication remains unverified and requires the workflow to be merged to main.

## Coexistence with manual publishing

Manual npm publishing remains allowed. The planner reads both latest and all occupied versions, skips occupied versions, and recognizes a manually published main commit even when its version differs from package.json. If latest has no gitHead or its commit is not an ancestor of main, automation pauses with a warning; merge the released source into main or investigate the package provenance before continuing. It never assumes unknown manual code is safe to replace.

Immediately before publishing, the workflow rechecks latest and version availability. A changed registry or a concurrent same-version manual publication is deferred with a warning, without replacing that version or its Git tag. Network/auth/build failures remain failures; the next scheduled run retries. A successful publish with a lost response is reconciled against the registry gitHead.

GitHub concurrency serializes Actions only, not developers' npm commands. npm has no cross-publisher lock or atomic compare-and-set for latest: simultaneous different-version manual and automatic publishes can still race on latest. When doing an exceptional manual release, coordinate to avoid an active publish job (or temporarily disable this workflow and wait for any active job to finish). Prefer the automatic workflow for routine releases. No script force-pushes, unpublishes, or rewrites an existing Git tag. Published version immutability prevents overwriting that version, but does not make latest race-free. First hosted OIDC publication still needs verification after merge.
