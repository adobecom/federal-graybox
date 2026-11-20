Make sure to run `npm i` in the root of the project to get the pre-commit hook installed.

Component click handlers live in `src/PostRendering/ClickListeners/`, split into
skip-link, tabs, popup animations, and links-card modules.
`src/PostRendering/ClickListeners.ts` remains the initialization entry point and
combines the skip-link and tab cleanup callbacks.

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

At compact and mobile widths, all top-level primary and secondary CTAs stay
in the toolbar alongside the pinned telephone while space permits. CTA order
matches the authored navigation. The CTA group (including its internal gaps)
is measured as a whole; when the toolbar no longer fits, the pinned controls
are hidden and their original menu entries remain available.

Open C2 navigation menus close when the page scrolls, including when already
past the header's scroll threshold. Scrolling inside a dropdown or compact
navigation drawer does not dismiss it.
The expanded localnav bar also closes on page scroll. It does not lock page
scrolling unless a submenu is open; full navigation drawers and submenus
retain their scroll lock.

Like C1, the minimized promo bar is shown only once its commerce (M@S/OST)
content has resolved, with no other delay. It appears complete at its final
height, so raw authored links never flash and the page shifts only once. After
5 seconds it is shown anyway, and any commerce links still unresolved are
removed. Maximized variants keep their 1-second delayed reveal.

Hosts can pass `shouldBlockLink(element)` to `main` to omit navigation links,
such as Milo's KR free-trial restriction. Matching C1, top-level dropdowns
(checked by title), links, CTAs and the product entry CTA are omitted before
rendering, so menus, the pinned CTA and localnav only see allowed items. Links
inside menus and promo CTAs are checked when rendered, before modal and
commerce decoration; wrappers left empty are removed up to their list item.
Brand, breadcrumb and promo copy links are not checked. If the policy throws,
the element is kept.
