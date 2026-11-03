Make sure to run `npm i` in the root of the project to get the pre-commit hook installed.

`npm run build` and `npm run dev` stop with an error if dependencies are
missing or out of date. Use Node 22 and run `npm ci` to update them.

After navigation initialization, `window.feds.nav.getGnavHeight()` returns the
current navigation height, including visible breadcrumbs or the compact local
navigation row. Call it when measuring rather than caching the result.
Federal temporarily exposes this method directly; the host can own the
assignment later.

To disable automatic active-link highlighting in C2 navigation, append
`#_noActiveItem` to the `gnav-source` URL, matching legacy Milo:

```text
/federal/site-redesign/gnav#_noActiveItem
```

This applies to both global navigation and localnav. Without the marker,
URL-based active-link detection is unchanged. The marker does not change
link destinations or localnav click behavior.

Like C1 navigation, top-level primary and secondary CTAs are excluded from
active-link detection, as are pinned and product-entry CTAs in the toolbar.
Inside dropdowns and mega-menus, matching links (including CTAs, promo-card
CTAs, and image-panel buttons) can mark their containing menu active.
Ordinary navigation links remain eligible.
