Make sure to run `npm i` in the root of the project to get the pre-commit hook installed.

`npm run build` and `npm run dev` stop with an error if dependencies are
missing or out of date. Use Node 22 and run `npm ci` to update them.

After navigation initialization, `window.feds.nav.getGnavHeight()` returns the
current navigation height, including visible breadcrumbs or the compact local
navigation row. Call it when measuring rather than caching the result.
Federal temporarily exposes this method directly; the host can own the
assignment later.
