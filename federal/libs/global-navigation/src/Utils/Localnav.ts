import { Component } from "../Components/Component";

// Mirror Milo: the localnav bar shows the item's title, so its mobile
// dropdown entry falls back to "Overview" unless a Link is authored as
// `Title::Label`.
export const withLocalnavOverviewLabel = (
  c: Component,
  placeholders: Map<string, string>,
): Component => {
  const overview = placeholders.get('overview') ?? 'Overview';
  if (c.type === 'Link' && c.mobileText === undefined)
    return { ...c, mobileText: overview };
  if (c.type === 'MegaMenu' || c.type === 'SmallMenu')
    return { ...c, mobileTitle: overview };
  return c;
};
