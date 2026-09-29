export const getIntrinsicItemsWidth = (list: HTMLElement | null): number => {
  if (list === null) return 0;

  const items = [...list.children].filter(
    (child): child is HTMLElement =>
      child instanceof HTMLLIElement
      && getComputedStyle(child).display !== 'none'
      && Math.max(child.offsetWidth, child.scrollWidth) > 0,
  );
  const width = items.reduce((total, item) => {
    const style = getComputedStyle(item);
    const marginLeft = Number.parseFloat(style.marginLeft) || 0;
    const marginRight = Number.parseFloat(style.marginRight) || 0;
    return total + Math.max(item.offsetWidth, item.scrollWidth)
      + marginLeft + marginRight;
  }, 0);
  const gap = Number.parseFloat(getComputedStyle(list).columnGap) || 0;

  return width + Math.max(items.length - 1, 0) * gap;
};
