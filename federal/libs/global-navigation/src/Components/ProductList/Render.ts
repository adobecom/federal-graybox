import { productCard } from "../ProductCard/Render";
import { getAnalyticsAttrs, icons, localizeHref } from "../../Utils/Utils";
import { ProductCategory, ProductList } from "./Parse";

export const productlist = (
  { categories, links, placeholders }: ProductList
): HTML => {
  const tabs = `
    <ul class="tabs" role="tablist">
      ${categories.map(renderTab).join('')}
      ${links.length ? `<li class="product-links"><a class="feds-link" href="${localizeHref(links[links.length - 1].href)}"${getAnalyticsAttrs(null, links[links.length - 1].daaLl ?? links[links.length - 1].text)}>${links[links.length - 1].text}${icons.chevronRight}</a></li>` : ''}
    </ul>
  `.trim();
  const tabcontent = `
    <ul class="tab-content">
      ${categories.map(({ links }: ProductCategory, i: number) => {
        const includesText = placeholders.get('product-list-includes') ?? 'includes';
        const productText = placeholders.get('product-list-product') ?? 'product';
        const productsText = placeholders.get('product-list-products') ?? 'products';
        const productWord = links.length === 1 ? productText : productsText;
        return `
      <li>
        <span id="product-hint-${i}" class="product-hint">${includesText} ${links.length} ${productWord}</span>
        <ul
          id="${i}"
          role="tabpanel"
          ${i === 0 ? '' : 'hidden'}
        >
          ${links.map(link => `<li>${productCard(link)}</li>`).join('')}
        </ul>
      </li>
      `.trim();
      }).join('')}
    </ul>
  `.trim();

  return `
    <div class="product-list">
      ${tabs}
      <div>${tabcontent}</div>
    </div>
  `.trim();
};

const renderTab = (
  {
    name,
    daaLl,
  }: ProductCategory,
  i: number
): string => `
      <li>
        <button
          role="tab"
          class="tab"
          aria-selected="${(i === 0).toString()}"
          aria-controls="${i}"
          aria-describedby="product-hint-${i}"
          ${getAnalyticsAttrs('', daaLl)}
          >
            ${name}
          </button>
      </li>
  `.trim();

