Make sure to run `npm i` in the root of the project to get the pre-commit hook installed.

After navigation initialization, `window.feds.nav.getGnavHeight()` returns the
current navigation height, including visible breadcrumbs or the compact local
navigation row. Call it when measuring rather than caching the result.
Federal temporarily exposes this method directly; the host can own the
assignment later.
