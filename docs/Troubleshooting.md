## PostHog Initialization

PostHog was initialized without a token. This likely indicates a misconfiguration. Please check the first argument passed to posthog.init()

## Vercel CI: The lockfile would have been modified by this install, which is explicitly forbidden.

Fix the lockfile locally before pushing (Recommended)
In your local dev environment, do:

1. yarn install --immutable
If that fails, it's because your yarn.lock is out of sync — so...

2. Run this locally:
rm -rf .yarn/cache .yarn/install-state.gz yarn.lock
yarn install

3. Commit the updated yarn.lock and .yarn/cache metadata:

git add yarn.lock .yarn
git commit -m "Sync yarn.lock with dependencies"
git push

Now when Vercel builds, your yarn.lock will already match what it expects — no modifications = no error.