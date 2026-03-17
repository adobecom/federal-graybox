import { IrrecoverableError } from "./Error/Error";
import { Input, renderGnavString, renderGnav } from "./Main";
import { parseNavigation } from "./Parse/Parse";
import { getInitialHTML } from "./PreRendering/FetchAssets";

document.write('<html><head></head><header></header></html')
const mountpoint = document.querySelector('header');
if (!mountpoint) throw new Error('bad mountpoint');
const input = {
  gnavSource: new URL("https://www.adobe.com/dc-shared/navigation/globalnav/localnav-acrobat-teams"),
  asideSource: null,
  isLocalNav: true,
  mountpoint,
  unavEnabled: false
} as Input

(async (): Promise<void> => {
  const initial = await getInitialHTML(input)
  if (initial instanceof IrrecoverableError)
    throw initial;
  const { mainNav, aside: _aside } = initial;
  if (mainNav instanceof IrrecoverableError)
    throw mainNav;

  const gnavData = parseNavigation(mainNav, input.unavEnabled);
  if (gnavData instanceof IrrecoverableError)
    throw gnavData;
  
  console.log(gnavData)

  renderGnav(gnavData)(mountpoint);
})(); 
