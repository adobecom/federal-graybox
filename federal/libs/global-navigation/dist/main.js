var we=async e=>{let{placeholders:n}=e,{locale:a}=T(),t=`${Y()}${a.prefix}/federal/globalnav/placeholders.json`,[i,o]=await Promise.all([n,fn(t)]);return new Map([...o,...i])},fn=async e=>{try{let n=await fetch(e);if(!n.ok)throw new g(`Federal placeholders not found at ${e}`);let a=un(await n.json());if(a instanceof g)throw a;return new Map(a.data.map(({key:r,value:t})=>[r,t]))}catch(n){if(n instanceof g)console.error(n.message);else{let a=new g(n.message);console.error(a.message)}return S(`Failed to fetch placeholders from ${e}`),new Map([])}},un=e=>{try{let{data:n}=e;if(!n.every(({key:r,value:t})=>typeof r=="string"&&typeof t=="string"))throw new Error("data is not valid");return e}catch(n){return new g(n.message)}};function ke(e,n){let a=/{{(.*?)}}|%7B%7B(.*?)%7D%7D/g;return a.test(e)?e.replace(a,(t,i,o)=>{let s=i??o??"";return n.get(s)??s}):e}var[Ce,j]=(()=>{let e;return[n=>{e||(e=n)},()=>{if(!e)throw new Error("Placeholders not initialized. Call setPlaceholders() first.");return e}]})();var E=window.matchMedia("(min-width: 1024px)"),D={brand:'<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" id="Layer_1" viewBox="0 0 64.57 35"><defs><style>.cls-1{fill: #eb1000;}</style></defs><path class="cls-1" d="M6.27,10.22h4.39l6.2,14.94h-4.64l-3.92-9.92-2.59,6.51h3.08l1.23,3.41H0l6.27-14.94ZM22.03,13.32c.45,0,.94.04,1.43.16v-3.7h3.88v14.72c-.89.4-2.81.89-4.73.89-3.48,0-6.47-1.98-6.47-5.93s2.88-6.13,5.89-6.13ZM22.52,22.19c.36,0,.65-.07.94-.16v-5.42c-.29-.11-.58-.16-.96-.16-1.27,0-2.45.94-2.45,2.92s1.2,2.81,2.47,2.81ZM34.25,13.32c3.23,0,5.98,2.18,5.98,6.02s-2.74,6.02-5.98,6.02-6-2.18-6-6.02,2.72-6.02,6-6.02ZM34.25,22.13c1.11,0,2.14-.89,2.14-2.79s-1.03-2.79-2.14-2.79-2.12.89-2.12,2.79.96,2.79,2.12,2.79ZM41.16,9.78h3.9v3.7c.47-.09.96-.16,1.45-.16,3.03,0,5.84,1.98,5.84,5.86,0,4.1-2.99,6.18-6.53,6.18-1.52,0-3.46-.31-4.66-.87v-14.72ZM45.91,22.17c1.34,0,2.56-.96,2.56-2.94,0-1.85-1.2-2.72-2.5-2.72-.36,0-.65.04-.91.16v5.35c.22.09.51.16.85.16ZM58.97,13.32c2.92,0,5.6,1.87,5.6,5.64,0,.51-.02,1-.09,1.49h-7.27c.4,1.32,1.56,1.94,3.01,1.94,1.18,0,2.27-.29,3.5-.82v2.97c-1.14.58-2.5.82-3.9.82-3.7,0-6.58-2.23-6.58-6.02s2.61-6.02,5.73-6.02ZM60.93,18.02c-.2-1.27-1.05-1.78-1.92-1.78s-1.58.54-1.87,1.78h3.79Z"/></svg>',company:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 22" fill="none"><path d="M14.2353 21.6209L12.4925 16.7699H8.11657L11.7945 7.51237L17.3741 21.6209H24L15.1548 0.379395H8.90929L0 21.6209H14.2353Z" fill="#EB1000"/></svg>',search:'<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false"><path d="M14 2A8 8 0 0 0 7.4 14.5L2.4 19.4a1.5 1.5 0 0 0 2.1 2.1L9.5 16.6A8 8 0 1 0 14 2Zm0 14.1A6.1 6.1 0 1 1 20.1 10 6.1 6.1 0 0 1 14 16.1Z"></path></svg>',home:'<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="25" viewBox="0 0 18 18" width="25"><path fill="#6E6E6E" d="M17.666,10.125,9.375,1.834a.53151.53151,0,0,0-.75,0L.334,10.125a.53051.53051,0,0,0,0,.75l.979.9785A.5.5,0,0,0,1.6665,12H2v4.5a.5.5,0,0,0,.5.5h4a.5.5,0,0,0,.5-.5v-5a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5v5a.5.5,0,0,0,.5.5h4a.5.5,0,0,0,.5-.5V12h.3335a.5.5,0,0,0,.3535-.1465l.979-.9785A.53051.53051,0,0,0,17.666,10.125Z"/></svg>',chevronLeft:'<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" focusable="false"><path d="M12.5 4l-5 6 5 6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',chevronRight:'<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="3" height="6" viewBox="0 0 3 6" focusable="false"><path d="M.5.5 2.5 3 .5 5.5" stroke="currentColor" stroke-width="1" fill="none"/></svg>',chevronDown:'<svg class="chevron-down" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="6" height="3.375" viewBox="0 0 6 3.375" focusable="false"><path d="M.5.5 3 2.875 5.5.5" stroke="currentColor" stroke-width="1" fill="none"/></svg>'},mn=["/tools/ost?","/miniplans"],Le=e=>mn.some(n=>e.includes(n));var Ee=e=>{let n=[],a=e.nextElementSibling??null;for(;a!==null;)n.push(a),a=a.nextElementSibling??null;return n},F=e=>({eval:e,or:n=>F(a=>{try{return e(a)}catch{return n(a)}})}),z=(e,n)=>e.reduce(([a,r],t)=>{try{let[i,o]=n(t);return[[...a,i],[...r,...o]]}catch(i){return i instanceof c?[a,[i,...r]]:[a,r]}},[[],[]]),[Te,vn]=(()=>{let e,n=!1;return[a=>{n||(e=a,n=!0)},()=>{if(!e)throw new Error("PersonalizationConfig not initialized. Call setPersonalizationConfig() first.");return e}]})(),[Se,Me]=(()=>{let e=n=>n;return[n=>{e=n},()=>e]})(),_=e=>{try{return Me()(e)}catch{return e}},q=async e=>{try{if(e===null)return new c("URL is null");let n=`${e.origin}${e.pathname.replace(/(\.html$|$)/,".plain.html")}${e.hash}`,a=Me()(n),r=A(a),t=await fetch(r);if(!t.ok)return S(`Request for ${r} failed`),new c(`Request for ${r} failed`);let i=await t.text(),o=await j(),s=ke(i,o),{body:l}=new DOMParser().parseFromString(s,"text/html");try{let{handleCommands:d,commands:v}=vn();d(v,l)}catch(d){S(`Personalization not applied: ${d?.message}`)}return l}catch(n){return new c(n?.message)}},U,Y=()=>{if(U)return U;let e=["https://www.adobe.com","https://business.adobe.com","https://blog.adobe.com","https://milo.adobe.com","https://news.adobe.com","graybox.adobe.com"];if(U)return U;let n=window.location.origin;U=e.some(t=>{let i=n.replace(".stage","");return t.startsWith("https://")?i===t:i.endsWith(t)})?n:"https://www.adobe.com";let r=window.location.hostname.includes(".aem.")?"aem":"hlx";return(n.includes("localhost")||n.includes(`.${r}.`))&&(U=`https://main--federal--adobecom.aem.${n.endsWith(".live")?"live":"page"}`),U},A=(e="")=>{if(e.includes("stage.adobe.com"))return e.replace("c2-poc--milo--adobecom","main--federal--adobecom");if(e.includes("c2-poc-feds-gnav--milo--adobecom"))return e.replace("c2-poc-feds-gnav--milo--adobecom","main--federal--adobecom");if(e.includes("localhost:3000"))return e.replace("localhost:3000","main--federal--adobecom.aem.page");if(typeof e!="string"||!e.includes("/federal/"))return e;if(e.startsWith("/"))return`${Y()}${e}`;try{let{pathname:n,search:a,hash:r}=new URL(e);return`${Y()}${n}${a}${r}`}catch(n){let a=n instanceof Error?n.message:String(n);console.warn(`getFederatedUrl errored parsing the URL: ${e}: ${a}`)}return e},_e=(e,n)=>{let a=(r,t)=>{let i=`${r}[${t}^="./media_"]`;n.querySelectorAll(i).forEach(s=>{let l=s.getAttribute(t);if(!(l===null||l===""))try{let d=A(new URL(l,new URL(e,window.location.href)).href);s.setAttribute(t,d)}catch(d){console.warn(`[MediaPathError]: Failed to process relative media path (${l}) for ${r}`,d)}})};a("img","src"),a("source","srcset")},Ae=async e=>{let n=async(a,r)=>{if(a instanceof c)return a;try{let i=[...a.querySelectorAll('a[href*="#_inline"]')].map(async o=>{try{if(r.has(o.href))return;let s=A(o.href),l=new URL(s),d=await q(l);if(r.add(o.href),d instanceof c)throw d;await n(d,r),o.replaceWith(...d.children);return}catch{return}},[]);return await Promise.all(i),a}catch(t){return new c(JSON.stringify(t))}};return n(e,new Set)},Pe=(e,n)=>e.map((a,r)=>`<li>${n(a,r)}</li>`).join(""),M=e=>{let n=e.normalize("NFKC").toLocaleLowerCase().trim().replace(/[^\p{L}\p{N}\p{M}]+/gu,"-").replace(/^-+|-+$/g,"");return n===""?"id":/^\p{N}/u.test(n)?`id-${n}`:n},C=(e,n)=>{let a=e!==null&&e!==""?` daa-lh="${e}"`:"",r=n!==null&&n!==""?` daa-ll="${n}"`:"";return`${a}${r}`},X=(e,n)=>{if(!e&&!n)return"";let a=[];return n!=null&&n!==""?a.push(`aria-label="${n}"`):e?.["aria-label"]&&a.push(`aria-label="${e["aria-label"]}"`),e&&Object.entries(e).forEach(([r,t])=>{r!=="aria-label"&&t&&a.push(`${r}="${t}"`)}),a.length>0?` ${a.join(" ")}`:""};function hn(e,{id:n,as:a,callback:r,crossorigin:t,rel:i,fetchpriority:o}={rel:"stylesheet"}){let s=document.head.querySelector(`link[href="${e}"]`);if(s)return r?.("noop"),s;let l=document.createElement("link");return l.setAttribute("rel",i),n!==void 0&&l.setAttribute("id",n),a!==void 0&&l.setAttribute("as",a),t!==void 0&&l.setAttribute("crossorigin",t),o!==void 0&&l.setAttribute("fetchpriority",o),l.setAttribute("href",e),r&&(l.onload=d=>r(d.type),l.onerror=d=>r(typeof d=="string"?"error":d.type)),document.head.appendChild(l),l}function bn(e,n){return hn(e,{rel:"stylesheet",callback:n})}function le(e,n=!1){n&&bn(e)}var de=(e,n,{mode:a,id:r}={})=>new Promise((t,i)=>{let o=document.querySelector(`head > script[src="${e}"]`);if(!o){let{head:d}=document;o=document.createElement("script"),o.setAttribute("src",e),r!=null&&o.setAttribute("id",r),n!=null&&o.setAttribute("type",n),a&&["async","defer"].includes(a)&&o.setAttribute(a,""),d.append(o)}let s=o.dataset.loaded;if(s!=null){t(o);return}let l=d=>{o.removeEventListener("load",l),o.removeEventListener("error",l),d.type==="error"?i(new Error(`error loading script: ${o.src}`)):d.type==="load"&&(o.dataset.loaded="true",t(o))};o.addEventListener("load",l),o.addEventListener("error",l)});function B(e,n=document){let a=e&&e.includes(":")?"property":"name";return n.head.querySelector(`meta[${a}="${e}"]`)?.content??null}var yn=e=>{let n=e,a=i=>i==null||typeof i!="object";if(a(n)||a(n.locale)||typeof n.locale.prefix!="string"||a(n.env)||typeof n.env.name!="string")return!1;if(n.unav!==void 0){if(typeof n.unav!="object"||n.unav===null)return!1;let i=n.unav;if(i.profile!==void 0){if(typeof i.profile!="object"||i.profile===null)return!1;let o=i.profile;if(o.signInCtaStyle!==void 0&&o.signInCtaStyle!=="primary"&&o.signInCtaStyle!=="secondary"||o.messageEventListener!==void 0&&typeof o.messageEventListener!="function")return!1}}return!(n.jarvis!==void 0&&(typeof n.jarvis!="object"||n.jarvis===null||typeof n.jarvis.id!="string"))},[pe,T]=(()=>{let e,n=!1;return[a=>{if(!n){if(!yn(a))throw new Error("MiloConfig validation failed: Invalid structure");e=a,n=!0}},()=>{if(!e)throw new Error("MiloConfig not initialized. Call setMiloConfig() first.");return e}]})(),xn={en:"US","en-gb":"GB","es-mx":"MX","fr-ca":"CA",da:"DK",et:"EE",ar:"DZ",el:"GR",iw:"IL",he:"IL",id:"ID",ms:"MY",nb:"NO",sl:"SI",sv:"SE",cs:"CZ",uk:"UA",hi:"IN","zh-hans":"CN","zh-hant":"TW",ja:"JP",ko:"KR",fil:"PH",th:"TH",vi:"VN"},ze={ar:"AR_es",be_en:"BE_en",be_fr:"BE_fr",be_nl:"BE_nl",br:"BR_pt",ca:"CA_en",ch_de:"CH_de",ch_fr:"CH_fr",ch_it:"CH_it",cl:"CL_es",co:"CO_es",la:"DO_es",mx:"MX_es",pe:"PE_es",africa:"MU_en",dk:"DK_da",de:"DE_de",ee:"EE_et",eg_ar:"EG_ar",eg_en:"EG_en",es:"ES_es",fr:"FR_fr",gr_el:"GR_el",gr_en:"GR_en",ie:"IE_en",il_he:"IL_iw",it:"IT_it",lv:"LV_lv",lt:"LT_lt",lu_de:"LU_de",lu_en:"LU_en",lu_fr:"LU_fr",my_en:"MY_en",my_ms:"MY_ms",hu:"HU_hu",mt:"MT_en",mena_en:"DZ_en",mena_ar:"DZ_ar",nl:"NL_nl",no:"NO_nb",pl:"PL_pl",pt:"PT_pt",ro:"RO_ro",si:"SI_sl",sk:"SK_sk",fi:"FI_fi",se:"SE_sv",tr:"TR_tr",uk:"GB_en",at:"AT_de",cz:"CZ_cs",bg:"BG_bg",ru:"RU_ru",ua:"UA_uk",au:"AU_en",in_en:"IN_en",in_hi:"IN_hi",id_en:"ID_en",id_id:"ID_id",nz:"NZ_en",sa_ar:"SA_ar",sa_en:"SA_en",sg:"SG_en",cn:"CN_zh-Hans",tw:"TW_zh-Hant",hk_zh:"HK_zh-hant",jp:"JP_ja",kr:"KR_ko",za:"ZA_en",ng:"NG_en",cr:"CR_es",ec:"EC_es",pr:"US_es",gt:"GT_es",cis_en:"TM_en",cis_ru:"TM_ru",sea:"SG_en",th_en:"TH_en",th_th:"TH_th"};function wn(e){let n=xn[e];return!n&&ze[e]&&(n=e),!n&&e.includes("-")&&([n]=e.split("-")),n||"US"}var se="langstore/";function Ie(e){let a=(e?.prefix||"US_en").replace("/","")??"",[r="US",t="en"]=(ze[a]??a).split("_",2);if(a.startsWith(se)||window.location.pathname.startsWith(`/${se}`)){let i=a.replace(se,"").toLowerCase();r=wn(i),t=i}return r=r.toUpperCase(),t=t.toLowerCase(),{language:t,country:r,locale:`${t}_${r}`}}var W=e=>{let n=e.querySelector("#feds-menu-wrapper");n?.classList.remove("feds-menu-active"),n?.hidePopover?.(),e.querySelector(".feds-popup:popover-open")?.hidePopover?.()};function $e(){let e=B("gnav-source")?.split("#")[0]?.split("/").pop()?.trim();if(e!==void 0&&e!==""&&e!=="gnav")return e;let n=window.adobeid?.client_id;return typeof n=="string"&&n!==""?n:""}var Re=e=>{let n=()=>{let i=document.querySelector(".adbMsgClientWrapper");return i?(i.getAttribute("popover")!=="manual"&&(i.setAttribute("popover","manual"),i.style.padding="0"),i?.hidePopover(),i?.showPopover(),!0):!1},a=i=>{!i.target.closest('[href*="#open-jarvis-chat"]')&&i.newState!=="open"||n()},r=e.querySelectorAll("[popover]");document.addEventListener("click",a),r.forEach(i=>i.addEventListener("toggle",a));let t=setInterval(()=>{n()&&clearInterval(t)},150)};var J={elementNull:"Error when parsing Link. Element is null",notAnchor:"Cannot parse non-anchor as Link",textContentNotFound:"Error when parsing Link. Element has no textContent",hrefNotFound:"Element has no href"},P=e=>{if(e===null)throw new c(J.elementNull);if(e.tagName!=="A")throw new c(J.notAnchor);let[n,a]=e?.textContent?.split("|").map(i=>i.trim())??["",""];if(n==="")throw new c(J.textContentNotFound);let r=e?.getAttribute("href")??"";if(r==="")throw new c(J.hrefNotFound);let t=e.getAttribute("daa-ll");return[{type:"Link",text:n,href:r,daaLl:t,ariaLabel:a},[]]};var ce=e=>{if(!e)throw new c(I.elementNull);if(!e.classList.contains("product-card"))throw new c(I.notAProductCard);return F(Cn).or(kn).or(Ln).eval(e)},I={elementNull:"Element not found",noTitleAnchor:"Title anchor not found",noHref:"Title Anchor has no href",noTitle:"Title text not found",noSubtitleP:"Subtitle <p> not found",noSubtitle:"Subtitle text not found",notAHeader:"Expected a Header class",notAProductCard:"Expected a product-card class"},kn=e=>{let n=new Set;if(!e)throw new c(I.elementNull);let a=e.querySelector("p a")??e.querySelector("div ~ div > a");if(!a)throw new c(I.noTitleAnchor);let r=a.textContent??"";r===""&&n.add(new g(I.noTitle));let t=a.getAttribute("href")??"";t===""&&n.add(new g(I.noHref));let i=a.getAttribute("daa-ll"),o=a.getAttribute("daa-lh"),s=a?.closest("p")?.nextElementSibling;s||n.add(new g(I.noSubtitleP));let l=s?.textContent??"";l===""&&n.add(new g(I.noSubtitle));let d=e.querySelectorAll(":scope > div:nth-child(2) > :first-child p")??[],v=Array.from(d).map(h=>{let p=h.querySelector("strong")!==null;return{text:h?.textContent?.trim()??"",isFilled:p}}),[y,w=null]=(e.firstElementChild?.firstElementChild?.textContent?.split("|")??[]).map(h=>h.trim());return[{type:"ProductCardLink",iconHref:y,iconAlt:w,title:r,href:t,subtitle:l,badges:v,daaLl:i,daaLh:o},[...n]]},Cn=e=>{if(!e)throw new c(I.elementNull);let n=[...e.classList];if(!n.includes("header"))throw new c(I.notAHeader);let a=e.querySelector("a")?.textContent??"",r=e.querySelector("a")?.getAttribute("daa-ll")??null,t=e.querySelector("a")?.getAttribute("daa-lh")??null;if(a==="")throw new c(I.noTitle);return[{type:"ProductCardHeader",title:a,classes:n,daaLl:r,daaLh:t},[]]},Ln=e=>{if(!e)throw new c(I.elementNull);if(!e.classList.contains("blue"))throw new Error("Not a Blue Product Card");let n=e.querySelector("a"),[a,r]=P(n),t=n?.getAttribute("daa-ll")??null,i=n?.getAttribute("daa-lh")??null;return[{type:"ProductCardBlue",link:a,daaLl:t,daaLh:i},r]};var ge=e=>{switch(e.type){case"ProductCardHeader":return En(e);case"ProductCardLink":return Tn(e);case"ProductCardBlue":return Sn(e);default:return console.error(e),""}},En=({title:e,classes:n,daaLl:a,daaLh:r})=>{let t=n.slice(1).map(o=>`feds-product-card--${o}`).join(" "),i=C(r,a??e);return`
    <div role="heading" class="feds-product-card ${t}"${i}>
      <div class="feds-product-card__content">
        <div class="feds-product-card__title">${e}</div>
      </div>
    </div>
  `},Tn=({iconHref:e,iconAlt:n,title:a,href:r,subtitle:t,badges:i=[],daaLl:o,daaLh:s})=>{let l=e!==null,d=C(s,o??a),v=l?`
      <picture class="feds-product-card__icon">
        <img
          loading="lazy"
          src="${A(e)}"
          class="feds-product-card__icon-img"
        >
      </picture>
    `:"",y=i.length===0?"":`
      <div class="feds-product-card__badges">
        ${i.map(({text:h,isFilled:p})=>`
          <span class="feds-product-card__badge${p?" feds-product-card__badge--filled":""}">
            ${h}
          </span>
        `).join("")}
      </div>
    `,w=t===""?"":`<div class="feds-product-card__subtitle">${t}</div>`;return`
    <a class="feds-product-card" href="${_(r)}"${d}>
      <div class="feds-product-card-header">
        ${v}
        ${y}
      </div>
      <div class="feds-product-card__content">
       
        <div class="feds-product-card__title">${a}</div>
        ${w}
      </div>
    </a>
  `},Sn=({link:e,daaLl:n,daaLh:a})=>{let r=C(a,n??e.text);return`
  <a href="${_(e.href)}" class="feds-product-card feds-product-card--blue"${r}>
    <div class="feds-product-card__content">
        <div class="feds-product-card__title">${e.text}</div>
      </div>
  </a>
`};var G={elementNull:"Error when parsing Brand. Element is null",noLinkSection:"Error when parsing Brand. No link section found",noLink:"Error when parsing Brand. No link found",noImageSection:"Error when parsing Brand. No image section found",missingImageSections:"Error when parsing Brand. Missing mobile or desktop image section",missingThemeImages:"Error when parsing Brand. Missing mobile or desktop image section"},fe=e=>{let n=new Set;if(e===null)throw new c(G.elementNull);let a=!!e.classList.contains("dark-bg"),[r,t]=e.querySelectorAll(":scope > div");if(r===void 0)throw new c(G.noLinkSection);let i=r.querySelector("a");if(i===null)throw new c(G.noLink);let o=i.getAttribute("href")??"",s=i.textContent?.trim()??"";t===void 0&&n.add(new g(G.noImageSection));let[l,d]=t?.querySelectorAll(":scope > div")??[];(l===void 0||d===void 0)&&n.add(new g(G.missingImageSections));let v=l?.querySelectorAll('a[href$=".svg"]'),y=d?.querySelectorAll('a[href$=".svg"]'),w=v?.[0]?.getAttribute("href")??"",h=v?.[0]?.textContent?.split("|")[1]?.trim()??"",p=v?.[1]?.getAttribute("href")??"",m=v?.[1]?.textContent?.split("|")[1]?.trim()??"",u=y?.[0]?.getAttribute("href")??"",f=y?.[0]?.textContent?.split("|")[1]?.trim()??"",b=y?.[1]?.getAttribute("href")??"",x=y?.[1]?.textContent?.split("|")[1]?.trim()??"";return(!w||!u||!p||!b)&&n.add(new g(G.missingThemeImages)),[{type:"Brand",data:{href:o,label:s,isDarkBg:a,imageData:{type:"svg",lightThemeImageSrc:u,lightThemeImageAlt:f,darkThemeImageSrc:b,darkThemeImageAlt:x,mobileLightThemeImageSrc:w,mobileLightThemeImageAlt:h,mobileDarkThemeImageSrc:p,mobileDarkThemeImageAlt:m}}},[...n]]};var Mn=`
<?xml
version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64.57 35" fill="currentColor">
    <path d="M6.27,10.22h4.39l6.2,14.94h-4.64l-3.92-9.92-2.59,6.51h3.08l1.23,3.41H0l6.27-14.94ZM22.03,13.32c.45,0,.94.04,1.43.16v-3.7h3.88v14.72c-.89.4-2.81.89-4.73.89-3.48,0-6.47-1.98-6.47-5.93s2.88-6.13,5.89-6.13ZM22.52,22.19c.36,0,.65-.07.94-.16v-5.42c-.29-.11-.58-.16-.96-.16-1.27,0-2.45.94-2.45,2.92s1.2,2.81,2.47,2.81ZM34.25,13.32c3.23,0,5.98,2.18,5.98,6.02s-2.74,6.02-5.98,6.02-6-2.18-6-6.02,2.72-6.02,6-6.02ZM34.25,22.13c1.11,0,2.14-.89,2.14-2.79s-1.03-2.79-2.14-2.79-2.12.89-2.12,2.79.96,2.79,2.12,2.79ZM41.16,9.78h3.9v3.7c.47-.09.96-.16,1.45-.16,3.03,0,5.84,1.98,5.84,5.86,0,4.1-2.99,6.18-6.53,6.18-1.52,0-3.46-.31-4.66-.87v-14.72ZM45.91,22.17c1.34,0,2.56-.96,2.56-2.94,0-1.85-1.2-2.72-2.5-2.72-.36,0-.65.04-.91.16v5.35c.22.09.51.16.85.16ZM58.97,13.32c2.92,0,5.6,1.87,5.6,5.64,0,.51-.02,1-.09,1.49h-7.27c.4,1.32,1.56,1.94,3.01,1.94,1.18,0,2.27-.29,3.5-.82v2.97c-1.14.58-2.5.82-3.9.82-3.7,0-6.58-2.23-6.58-6.02s2.61-6.02,5.73-6.02ZM60.93,18.02c-.2-1.27-1.05-1.78-1.92-1.78s-1.58.54-1.87,1.78h3.79Z"/>
</svg>
`.trim(),_n=`
<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 18 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path id="Logo" d="M17.5512 15.9999H13.8827C13.7233 16.0027 13.5666 15.9587 13.4326 15.8735C13.2987 15.7882 13.1934 15.6656 13.1303 15.5211L9.1476 6.3291C9.1372 6.29332 9.11539 6.26179 9.08542 6.23919C9.05545 6.2166 9.0189 6.20413 8.98118 6.20365C8.94347 6.20316 8.9066 6.21469 8.87605 6.2365C8.84549 6.25832 8.82286 6.28928 8.81152 6.32478L6.32954 12.161C6.31607 12.1925 6.31072 12.2269 6.31397 12.261C6.31721 12.2951 6.32896 12.3279 6.34815 12.3565C6.36735 12.385 6.39339 12.4084 6.42398 12.4246C6.45456 12.4408 6.48872 12.4493 6.52343 12.4493H9.25162C9.33426 12.4493 9.41508 12.4733 9.48398 12.5183C9.55288 12.5634 9.60681 12.6275 9.63905 12.7026L10.8335 15.3264C10.8652 15.4 10.8778 15.4802 10.8704 15.5599C10.863 15.6395 10.8357 15.7161 10.791 15.7828C10.7463 15.8495 10.6856 15.9042 10.6142 15.9421C10.5429 15.98 10.4631 15.9998 10.3821 15.9999H0.450101C0.375399 15.9994 0.301967 15.9808 0.236351 15.9455C0.170735 15.9103 0.114973 15.8595 0.0740362 15.7979C0.0330997 15.7362 0.00826021 15.6655 0.00173221 15.592C-0.00479579 15.5185 0.00719033 15.4446 0.0366223 15.3769L6.35412 0.526466C6.41869 0.369291 6.52976 0.234984 6.67284 0.141079C6.81593 0.0471732 6.98437 -0.00196688 7.15618 7.38373e-05H10.7999C10.9718 -0.00217252 11.1403 0.0468839 11.2835 0.140814C11.4266 0.234745 11.5377 0.369168 11.6021 0.526466L17.9633 15.3769C17.9927 15.4445 18.0048 15.5183 17.9983 15.5917C17.9919 15.665 17.9672 15.7357 17.9264 15.7973C17.8856 15.859 17.83 15.9097 17.7646 15.9451C17.6991 15.9804 17.6258 15.9992 17.5512 15.9999V15.9999Z" />
</svg>
`.trim(),An=e=>{let{href:n,label:a,isDarkBg:r,imageData:t}=e,i=t.lightThemeImageSrc?.trim()||t.darkThemeImageSrc?.trim()||"",o=t.darkThemeImageSrc?.trim()||t.lightThemeImageSrc?.trim()||"",s=t.mobileLightThemeImageSrc?.trim()||t.mobileDarkThemeImageSrc?.trim()||"",l=t.mobileDarkThemeImageSrc?.trim()||t.mobileLightThemeImageSrc?.trim()||"",d=t.lightThemeImageAlt||t.darkThemeImageAlt||"",v=t.darkThemeImageAlt||t.lightThemeImageAlt||"",y=t.mobileLightThemeImageAlt||t.mobileDarkThemeImageAlt||"",w=t.mobileDarkThemeImageAlt||t.mobileLightThemeImageAlt||"",h=!!i,p=!!o,m=!!s,u=!!l,f=h?`<img src="${A(i)}" alt="${d}" />`:"",b=p?`<img src="${A(o)}" alt="${v}" />`:"",x=m?`<img src="${A(s)}" alt="${y}" />`:"",k=u?`<img src="${A(l)}" alt="${w}" />`:"";return`<div class="feds-brand-container${r?" feds-dark-bg":""}">
    <a href="${n}" class="feds-brand" daa-ll="Brand" aria-label="${a}">
      <span class="feds-brand-image desktop-brand">
        ${f}
        ${b}
        ${h&&p?"":Mn}
      </span>
      <span class="feds-brand-image mobile-brand">
        ${x}
        ${k}
        ${m&&u?"":_n}
      </span>
    </a>
  </div>`.trim()},ue=e=>{let{data:n}=e;return An(n)};var me=["appswitcher","help"],Q={cs:["cz"],da:["dk"],de:["at"],en:["africa","au","ca","ie","in","mt","ng","nz","sg","za"],es:["ar","cl","co","cr","ec","gt","la","mx","pe","pr"],et:["ee"],ja:["jp"],ko:["kr"],nb:["no"],pt:["br"],sl:["si"],sv:["se"],uk:["ua"],zh:["cn","tw"]},[Z,He]=(()=>{let e,n,a,r=new Promise(t=>{n=t,a=setTimeout(()=>{e={},t(e)},5e3)});return[t=>{t&&!e&&(e=t,clearTimeout(a),n?.(e))},()=>r]})();function ee(e,n=!1){let s=(/uc_carts=/.test(document.cookie)?e:e?.filter(d=>d!=="cart"))??[],l=s.length??3;if(n){let d=s.filter(y=>me.includes(y)).length;return`calc(92px + ${d*32}px + ${d*.25}rem)`}return`calc(${l*32}px + ${(l-1)*.25}rem)`}var ne=e=>{if(!e.prefix||e.prefix==="/")return"en_US";let n=e.prefix.replace("/","");if(n.includes("_")){let[r,t]=n.split("_").reverse();return`${r.toLowerCase()}_${t.toUpperCase()}`}if(n==="uk")return"en_GB";let a=Object.keys(Q).find(r=>Q[r].includes(n));return a?`${a.toLowerCase()}_${n.toUpperCase()}`:`${n.toLowerCase()}_${n.toUpperCase()}`},Pn={Mac:"macOS",Win:"windows",Linux:"linux",CrOS:"chromeOS",Android:"android",iPad:"iPadOS",iPhone:"iOS"},ae=()=>{let e=navigator.userAgent;for(let[n,a]of Object.entries(Pn))if(e.includes(n))return a;return"linux"},re=async()=>{let e=window;return e.alloy?await e.alloy("getIdentity").then(n=>n?.identity?.ECID).catch(()=>{}):void 0};var De=()=>{try{return T().signInContext||{}}catch{return{}}},zn=()=>{let e=T();return B("signin-cta-style")==="primary"||e?.unav?.profile?.signInCtaStyle==="primary"?"primary":"secondary"},In=()=>{let n=T()?.unav?.profile?.messageEventListener;return n||(a=>{let{name:r,payload:t,executeDefaultAction:i}=a.detail;if(!(!r||r!=="System"||!t||typeof i!="function"))switch(t.subType){case"AppInitiated":window.adobeProfile?.getUserProfile().then(o=>{Z(o)}).catch(()=>{Z({})});break;case"SignOut":i();break;case"ProfileSwitch":Promise.resolve(i()).then(o=>{o&&window.location.reload()});break;default:break}})};function $n(){let{unav:e}=T();return e?.unavHelpChildren||[{type:"Support"},{type:"Community"}]}var K=()=>{let e=T();return{profile:{name:"profile",attributes:{accountMenuContext:{sharedContextConfig:{enableLocalSection:!0,enableProfileSwitcher:!0,miniAppContext:{logger:{trace:()=>{},debug:()=>{},info:()=>{},warn:()=>{},error:()=>{}}},complexConfig:e?.unav?.profile?.complexConfig||null,...e?.unav?.profile?.config},messageEventListener:In()},signInCtaStyle:zn(),isSignUpRequired:!1,callbacks:{onSignIn:()=>{window.adobeIMS?.signIn(De())},onSignUp:()=>{window.adobeIMS?.signIn(De())}}}},appswitcher:{name:"app-switcher"},notifications:{name:"notifications",attributes:{notificationsConfig:{applicationContext:{appID:e?.unav?.uncAppId||"adobecom",...e?.unav?.uncConfig}}}},help:{name:"help",attributes:{children:$n()}},jarvis:{name:"jarvis",attributes:{appid:e?.jarvis?.id,callbacks:e?.jarvis?.callbacks}},cart:{name:"cart"}}};var Ue=(e,n)=>{e[0]&&"attributes"in e[0]&&e[0].attributes&&typeof e[0].attributes=="object"&&"isSignUpRequired"in e[0].attributes&&(e[0].attributes.isSignUpRequired=n)},te=async(e,n)=>{try{let a=e.querySelector(".feds-utilities");if(!(a instanceof HTMLElement))return new g('missing ".feds-utilities" container');let r=new Set,t=document.head.querySelector('meta[name="universal-nav"]'),i=t instanceof HTMLMetaElement?t.content??"":"";t instanceof HTMLMetaElement||r.add(new g('metadata "universal-nav" is missing'));let o=i.trim();t instanceof HTMLMetaElement&&o.length===0&&r.add(new g('metadata "universal-nav" has no value'));let s=!window.adobeIMS?.isSignedInUser(),l=o.split(",").map(f=>f.trim()).filter(f=>Object.keys(K()).includes(f)||f==="signup");if(s){let f=ee(l,s);a.style.setProperty("min-width",f)}let d;try{d=T()}catch{throw new Error("MiloConfig not available for UNAV initialization")}let v=ne(d.locale),y=d.env.name==="prod"?"prod":"stage",w=await re(),h=new URLSearchParams(window.location.search).get("unavVersion");/^\d+(\.\d+)?$/.test(h??"")||(h="1.5"),await Promise.all([de(`https://${y}.adobeccstatic.com/unav/${h}/UniversalNav.js`),le(`https://${y}.adobeccstatic.com/unav/${h}/UniversalNav.css`,!0)]);let p=()=>{let f=K(),b=[f.profile];return Ue(b,!1),l?.forEach(x=>{if(x==="profile")return;if(x==="signup"){Ue(b,!0);return}let k=f[x];k&&b.push(k)}),b},m=()=>({target:a,env:y,locale:v,countryCode:Ie(d?.locale)?.country||"US",imsClientId:window?.adobeid?.client_id,theme:"light",analyticsContext:{consumer:{name:"adobecom",version:"1.0",platform:"Web",device:ae(),os_version:navigator.platform},event:{visitor_guid:w}},children:p(),isSectionDividerRequired:!!d?.unav?.showSectionDivider,showTrayExperience:!E.matches});await window?.UniversalNav?.(m()),s||a?.style.removeProperty("min-width");let u=f=>{window?.UniversalNav?.reload(m())};return E.addEventListener("change",()=>{u()}),{reloadUnav:u,errors:r}}catch(a){let r=a instanceof Error?a.message:"failed to load universal nav";return new g(r)}};function N(e,n){return[...e.querySelectorAll(n)]}function V(e,n,a){N(e,n).forEach(r=>a?r.removeAttribute("tabindex"):r.setAttribute("tabindex","-1"))}var oe={ArrowLeft:-1,ArrowRight:1,ArrowUp:-1,ArrowDown:1},Ne=new Set(["ArrowLeft","ArrowRight"]),Rn=new Set(["ArrowUp","ArrowDown"]),Hn='.tabs [role="tab"][aria-selected="true"]';function ve(e,n,a){return(e+n+a)%a}function Dn(e,n,a,r){let t=oe[a];if(Ne.has(a)){let h=n+t;return h>=0&&h<e.length?h:null}let i=getComputedStyle(r).gridTemplateColumns.split(" ").length,o=[...r.children],s=h=>{let p=e[h].parentElement;return p?o.indexOf(p):-1},l=s(n)%i,d=Math.floor(s(n)/i)+(a==="ArrowDown"?1:-1),v=Math.floor((o.length-1)/i);if(d<0||d>v)return null;let y=null,w=1/0;for(let h=0;h<e.length;h++){let p=Math.abs(s(h)%i-l);Math.floor(s(h)/i)===d&&p<w&&(w=p,y=h)}return y}function he(e){V(e,'.tab-content [role="tabpanel"] a',!1);let n=[];N(e,".feds-popup[popover]").forEach(p=>{let m=()=>{p.matches(":popover-open")||V(p,'[role="tabpanel"] a',!1)};p.addEventListener("toggle",m),n.push(()=>p.removeEventListener("toggle",m));let u=!1,f=x=>{x.key==="Tab"&&!x.shiftKey&&(u=!0)};p.addEventListener("keydown",f),n.push(()=>p.removeEventListener("keydown",f));let b=x=>{if(u&&!p.contains(x.relatedTarget)){if(p.hidePopover?.(),!E.matches){let k=p.closest(".feds-gnav-items");k?.classList.remove("subscreen-opening"),k?.classList.add("subscreen-closing")}u=!1}};p.addEventListener("focusout",b),n.push(()=>p.removeEventListener("focusout",b))});let a=(p,m)=>{p.focus(),m.preventDefault()},r=()=>e.querySelector(".feds-popup:popover-open"),t=p=>p.querySelector(Hn),i=p=>p.querySelector('[role="tabpanel"]:not([hidden])');function o(p){let m=r(),u=e.querySelector("#feds-menu-wrapper");if(!u)return!1;let f=u.querySelector(".feds-gnav-items"),b=m?m.querySelector(".feds-popup-back-button"):null,x=f?.classList.contains("subscreen-opening")===!0;if(m!==null&&x&&b!==null)return b.click(),p.preventDefault(),!0;let k=m??(u?.matches(":popover-open")?u:null);if(!k)return!1;k.hidePopover?.();let L=m?`[popovertarget="${k.id}"]`:".feds-nav-toggle";return e.querySelector(L)?.focus(),p.preventDefault(),!0}function s(p,m,u){if(!Ne.has(m))return!1;let f=N(e,".feds-gnav-items > li > .feds-link"),b=f.indexOf(p);return b<0?!1:(a(f[ve(b,oe[m],f.length)],u),!0)}function l(p,m,u,f){let b=N(m,'.tabs :is([role="tab"], .product-links a)'),x=b.indexOf(p);if(x<0)return!1;let k=E.matches?{ArrowLeft:0,ArrowRight:0,ArrowUp:-1,ArrowDown:1}:{ArrowLeft:-1,ArrowRight:1,ArrowUp:0,ArrowDown:0};if(k[u]){let L=b[ve(x,k[u],b.length)];return L.matches('[role="tab"]')&&L.click(),a(L,f),!0}if(u in k)return f.preventDefault(),!0;if(u==="Tab"&&!f.shiftKey&&p.matches('[aria-selected="true"]')){let L=i(m);if(!L)return!1;V(L,"a",!0);let ie=L.querySelector("a");return ie&&a(ie,f),!0}return!1}function d(p,m,u,f){let b=i(m);if(!b)return!1;let x=N(b,"a"),k=x.indexOf(p);if(k<0)return!1;if(oe[u]){let L=Dn(x,k,u,b);return L!==null?(a(x[L],f),!0):u==="ArrowUp"?(V(b,"a",!1),a(t(m)??x[0],f),!0):!1}if(u==="Tab"&&!f.shiftKey){if(k+1<x.length)a(x[k+1],f);else return!1;return!0}if(u==="Tab"&&f.shiftKey){if(k>0)a(x[k-1],f);else{V(b,"a",!1);let L=t(m)??N(m,'.tabs :is([role="tab"], .product-links a)')[0];L&&a(L,f)}return!0}return!1}function v(p,m,u,f){if(!Rn.has(u))return!1;let b=N(m,".feds-gnav-cards a"),x=b.indexOf(p);return x<0?!1:(a(b[ve(x,oe[u],b.length)],f),!0)}function y(p){let m=document.activeElement??p.target;if(p.key==="Escape"){o(p);return}let u=r();u&&(u.matches(":has(.product-list)")&&(l(m,u,p.key,p)||d(m,u,p.key,p))||u.matches(":has(.feds-gnav-cards)")&&v(m,u,p.key,p))||s(m,p.key,p)}let w=e.querySelector(".trap-focus-gnav"),h=p=>{e.querySelector(".feds-menu-active")&&(p.preventDefault(),e.querySelector(".feds-nav-toggle")?.focus())};return w?.addEventListener("focus",h),n.push(()=>w?.removeEventListener("focus",h)),e.addEventListener("keydown",y),n.push(()=>e.removeEventListener("keydown",y)),()=>n.forEach(p=>p())}var Un="feds-milo",S=(e,n="default",a="e")=>{let{locale:r}=T(),t=B("gnav-source")??`${r.contentRoot??""}/gnav`;window.lana||console.warn("lana logging unavailable in the gnav"),window?.lana?.log(`${e} | gnav-source: ${t} | href: ${window.location.href}`,{clientId:Un,sampleRate:1,tags:n,errorType:a})};var c=class e extends Error{constructor(n){super(n),Object.setPrototypeOf(this,e.prototype)}},g=class e extends Error{constructor(n,a="Minor"){super(n),Object.setPrototypeOf(this,e.prototype),a==="Critical"&&S(n)}};var je=e=>n=>{if(n===null)throw new Error("");let a=n.querySelector(Nn(e));if(!a)throw new Error("");let r=a.textContent??"",[t="",i=""]=r.split("|").map(y=>y.trim());if(t==="")throw new Error("");let o=a.getAttribute("href")??"";if(o==="")throw new Error("");let s=a.getAttribute("daa-ll"),l=a.getAttribute("aria-label")?.trim()??"",d=l!==""?l:i!==""?i:void 0,v=[];return[{type:e.type,text:t,href:o,ariaLabel:d,daaLl:typeof s=="string"&&s.trim()!==""?s:t},v]},be=je({type:"PrimaryCTA"}),R=je({type:"SecondaryCTA"}),qe=e=>F(be).or(R).eval(e),Nn=({type:e})=>{switch(e){case"PrimaryCTA":return"strong > a";case"SecondaryCTA":return"em > a";default:throw new Error("")}};var ye=({text:e,href:n,daaLl:a,ariaLabel:r,ariaAttrs:t})=>`
<a href="${_(n)}"
  class="feds-primary-cta"${X(t,r)}
  ${C(null,a??e)}
>
  ${e}
</a>
`,H=({text:e,href:n,daaLl:a,ariaLabel:r,ariaAttrs:t})=>`
<a href="${_(n)}" 
  class="feds-secondary-cta"${X(t,r)}
  ${C(null,a??e)}
>
  ${e}
</a>
`,Be=e=>e.type==="PrimaryCTA"?ye(e):H(e);var O=({text:e,href:n,daaLl:a,ariaLabel:r,ariaAttrs:t,svgIcon:i=""})=>`<a class="feds-link" href="${_(n)}"${X(t,r)}${C(null,a??e)}>${e}${i}</a>`;var Ge=e=>{let[n,a]=jn(e);return[{type:"LinksCard",card:n},a]},jn=e=>{let n=e.querySelector("h2, h3, h4")||null;if(!n)throw new c("Expected links card title");let a=e.querySelector("em > a"),r=[...e.querySelectorAll("a")].filter(l=>l!==a);if(r.length===0)throw new c("Expected at least one link");let[t,i]=z(r,P),[o,s]=(()=>{try{return R(e)}catch{return[null,[]]}})();return o&&(o.daaLl=`${n.textContent??""} - ${o?.daaLl}`),[{type:"LinksCardItem",title:n.textContent??"",links:t,footerCTA:o},[...i,...s]]};var Oe=(e,n="",a=new Map)=>{let r=[...e.querySelectorAll("li > div")],t=[...e.querySelectorAll("li > a")],[i,o]=z(r,qn),[s,l]=z(t,P);return[{type:"ProductList",megaMenuTitle:n,categories:i,links:s,placeholders:a},[...o,...l]]},qn=e=>{let n=e.firstElementChild;if(n?.nodeName!=="H2")throw new c("Expected H2");let a=n.textContent??"",r=n.textContent??"",t=Ee(n),[i,o]=z(t,ce);return[{type:"ProductCategory",name:a,daaLl:r,links:i},o]};var Fe=e=>{let[n,a]=Bn(e);return[{type:"FeaturedCard",card:n},a]},Bn=e=>{let n=e.querySelector("h5")||null;if(!n)throw new g("Eye brow element not found");let a=e.querySelector("h4")||null,r=a?.nextElementSibling||null;if(!a)throw new c("Expected title");if(!r)throw new c("Expected subtitle");let t=r.nextElementSibling?.firstElementChild||null;if(!t)throw new c("Expected card link after subtitle");let[i,o]=P(t),[s,l]=R(e);return[{type:"Card",title:a.textContent??"",subtitle:r.textContent??"",bodyLink:i,footerCTA:s,eyeBrow:n.textContent??""},[...l,...o]]};var $={MissingBackgroundImageSection:"Promo card is missing background image section",MissingBackgroundImage:"Promo card is missing background image",MissingBackgroundImageAlt:"Promo card background image is missing alt text",MissingBackgroundImageSrc:"Promo card background image is missing src",MissingContentSection:"Promo card is missing card details section",MissingIcon:"Promo card is missing icon",MissingIconSrc:"Promo card icon is missing src",MissingIconAlt:"Promo card icon is missing alt text",MissingTitleElement:"Promo card is missing title element",MissingTitleText:"Promo card is missing title text",MissingSecondaryCtaAnchor:"Promo card is missing secondary CTA anchor",MissingPriceLink:"Promo card is missing price link"},Xe=e=>{let[n,a]=e.querySelectorAll(":scope > div"),r=new Set;if(n===void 0)throw new c($.MissingBackgroundImageSection);let t=n.querySelector(":scope picture:not(:scope p picture) img")??null;t===null&&r.add(new g($.MissingBackgroundImage));let i=t?.getAttribute("alt")??"";i===""&&r.add(new g($.MissingBackgroundImageAlt));let o=t?.getAttribute("src")??"";if(o===""&&r.add(new g($.MissingBackgroundImageSrc)),a===void 0)throw new c($.MissingContentSection);let s=a.querySelector('a[href$=".svg"]')??null;s===null&&r.add(new g($.MissingIcon));let[l,d]=(s?.textContent?.split("|")??["",""]).map(x=>x.trim());l===""&&r.add(new g($.MissingIconSrc)),d===""&&r.add(new g($.MissingIconAlt));let v=a.querySelector('p > a:not([href$=".svg"])')??null,y=v?.textContent?.trim()??"",w=v?.getAttribute("href")??"",h=w?Le(w):!1;v===null&&r.add(new g($.MissingPriceLink));let p=a.querySelector("p > strong")??null;if(p===null)throw new c($.MissingTitleElement);let m=p?.textContent??"";m===""&&r.add(new g($.MissingTitleText)),a.querySelector("em > a")===null&&r.add(new g($.MissingSecondaryCtaAnchor));let[f,b]=(()=>{try{return R(e)}catch{return[null,[]]}})();return b.forEach(x=>r.add(x)),f&&(f.daaLl=`${m} - ${f?.daaLl}`),[{type:"PromoCard",card:{bgImageAlt:i,bgImageSrc:o,iconAlt:d,iconSrc:l,title:m,cta:f,priceText:y,priceHref:w,isPriceMerchLink:h}},[...r]]};var Ze=e=>{let n=new Set;if(e===null)throw new c(We.elementNull);let a=e.querySelector("h2")?.textContent??"";a===""&&n.add(new g(We.noTitle));let r=(async()=>{try{let t=e.querySelector("a"),i=new URL(t?.href??""),o=await q(i);if(o instanceof c)throw new Error(o.message);let s=await Ae(o);if(s instanceof c)throw new Error(s.message);if(_e(i.href,s),e.classList.contains("product-list")){let l=await j();return Oe(s,a,l)}return Gn(s,a)}catch(t){throw new c(t?.message)}})();if(r instanceof c)throw r;return[{type:"MegaMenu",title:a,content:r},[...n]]},We={elementNull:"Element is null",noTitle:"Large Menu has no Title"},Gn=(e,n)=>{let a=[...e.children];if(a.length===0)throw new c("No mega menu items found (did you forget to add them correctly?)");let[r,t]=z(a,i=>On(i));if(r.length===0)throw new c("Failed to parse gnav cards sections");return[{type:"GnavCards",megaMenuTitle:n,sections:r},t]},On=e=>{let n=[...e.querySelectorAll(".featured-card, .links-card, .promo-card")];if(n.length===0)throw new c("Column contains no cards (did you forget to label them correctly?)");let[a,r]=z(n,t=>Fn(t));if(a.length===0)throw new c("Failed to parse cards in column");return[{type:"GnavColumn",cards:a},r]},Fn=e=>{if(e.classList.contains("featured-card"))return Fe(e);if(e.classList.contains("links-card"))return Ge(e);if(e.classList.contains("promo-card"))return Xe(e);throw new c("Unsupported gnav cards section")};var Ke=({card:e},n)=>Xn(e,n),Xn=({title:e,subtitle:n,eyeBrow:a,footerCTA:r,bodyLink:t},i)=>{let o=`featured-eyebrow-${M(a)}`;return`
  <article class="featured-card" ${C(a,"")}>
    <div>
      <div class="featured-eyebrow" aria-label="${a} ${i}">
        <span id="${o}" aria-hidden="true">${a}</span>
      </div>
      <h2>${e}</h2>
      <div class="featured-subtitle">${n}</div>
      <span>${O({...t,ariaAttrs:{"aria-describedby":o},svgIcon:D.chevronRight})}</span>
    </div>
    <div class="footer-container">
      ${H({...r,ariaAttrs:{"aria-describedby":o}})}
    </div>
  </article>
`.trim()};var Ve=({card:e})=>Wn(e),Wn=({title:e,links:n,footerCTA:a})=>`
  <article class="links-card" ${C(e,"")}>
    <div>
      <h2 id="links-card-${M(e)}" class="links-card-title" role="heading" aria-level="2">${e}</h2>
      <ul class="links-card-links" aria-labelledby="links-card-${M(e)}">
        ${n.map(r=>`<li>${O(r)}</li>`).join("")}
      </ul>
    </div>
    ${a===null?"":`
    <div class="links-card-footer">
      ${H({...a,ariaAttrs:{"aria-describedby":`links-card-${M(e)}`}})}
    </div>`}
  </article>
`.trim();var Ye=({card:e})=>Zn(e),Zn=({bgImageAlt:e,bgImageSrc:n,iconAlt:a,iconSrc:r,title:t,cta:i,priceText:o,priceHref:s,isPriceMerchLink:l})=>`
  <article class="promo-card" daa-lh="promo-card">
    ${n?`<picture class="promo-card__bg">
             <img 
              loading="lazy"
              src="${A(n)}"
              alt="${e}"
              class="promo-card__bg-image"
            >
           </picture>`:""}

    <div class="promo-card__content">
      ${r?`<picture class="promo-card__icon">
               <img
                loading="lazy"
                src="${A(r)}"
                alt="${a}"
                class="promo-card__icon-image"
              >
             </picture>`:""}
      <div class="promo-card__text-content">
        ${s&&l?`<p id="price-${M(t)}" class="promo-card__price">
          <a href="${_(s)}" class="merch">${o}</a>
        </p>`:""}
        <h2 id="title-${M(t)}" class="promo-card__title" role="heading" aria-level="2">
          ${t}
        </h2>
        ${i===null?"":`<div class="promo-card__cta">
                 ${H({...i,ariaAttrs:{"aria-describedby":`title-${M(t)}${l?` price-${M(t)}`:""}`}})}
               </div>`}
      </div>
    </div>
  </article>
`.trim();var Kn=(e,n)=>{switch(e.type){case"FeaturedCard":return Ke(e,n);case"LinksCard":return Ve(e);case"PromoCard":return Ye(e);default:}return""},Je=({sections:e,megaMenuTitle:n})=>`
  <div class="feds-gnav-cards">
    ${e.map(a=>`<li>${a.cards.map(r=>Kn(r,n)).join("")}</li>`).join("")}
  </div>
`;var Qe=({categories:e,links:n,placeholders:a})=>{let r=`
    <ul class="tabs" role="tablist">
      ${e.map(Vn).join("")}
      ${n.length?`<li class="product-links"><a class="feds-link" href="${_(n[n.length-1].href)}"${C(null,n[n.length-1].daaLl??n[n.length-1].text)}>${n[n.length-1].text}${D.chevronRight}</a></li>`:""}
    </ul>
  `.trim(),t=`
    <ul class="tab-content">
      ${e.map(({links:i},o)=>{let s=a.get("product-list-includes")??"includes",l=a.get("product-list-product")??"product",d=a.get("product-list-products")??"products",v=i.length===1?l:d;return`
      <li>
        <span id="product-hint-${o}" class="product-hint">${s} ${i.length} ${v}</span>
        <ul
          id="${o}"
          role="tabpanel"
          ${o===0?"":"hidden"}
        >
          ${i.map(y=>`<li>${ge(y)}</li>`).join("")}
        </ul>
      </li>
      `.trim()}).join("")}
    </ul>
  `.trim();return`
    <div class="product-list">
      ${r}
      <div>${t}</div>
    </div>
  `.trim()},Vn=({name:e,daaLl:n},a)=>`
      <li>
        <button
          role="tab"
          class="tab"
          aria-selected="${(a===0).toString()}"
          aria-controls="${a}"
          aria-describedby="product-hint-${a}"
          ${C("",n)}
          >
            ${e}
          </button>
      </li>
  `.trim();var en=({title:e},n=0)=>`
  <button type="button"
          aria-controls="${M(e)}"
          aria-haspopup="true"
          class="mega-menu feds-link"
          popovertarget="${M(e)}"
          ${C(`${e}-${n+1}`,"header|Open")}
  >
    ${e}${D.chevronDown}
  </button>
  <div id="${M(e)}" popover class="feds-popup">
  </div>
`,nn=(e,n)=>{let{megaMenuTitle:a}=e,r=`
        <button
          type="button"
          class="feds-popup-back-button"
          
          aria-label="Back"
          daa-ll="${a}|Back"
        >
          ${D.chevronLeft}
          <span class="feds-popup-title">${a}</span>
        </button>
  `,t=e.type==="ProductList"&&e.links.length>0?e.links[e.links.length-1]:null,i=`
    <div class="feds-popup-header">
      <div class="feds-popup-header-left">${r}</div>
      ${t?`<div class="product-links"><a class="feds-link" href="${_(t.href)}"${C(null,t.daaLl??t.text)}>${t.text}${D.chevronRight}</a></div>`:""}
    </div>
  `.trim(),o="";switch(e.type){case"ProductList":o=Qe(e);break;case"GnavCards":o=Je(e);break;default:}return`${i}${o}`};var an={elementNull:"Error when parsing text. Element is null",textContentNull:"Error when parsing text. Element has no textContent"},rn=e=>{if(e===null)return[{type:"Text",content:""},[new g(an.elementNull,"Minor")]];let n=e.textContent;return n===null?[{type:"Text",content:""},[new g(an.textContentNull,"Minor")]]:[{type:"Text",content:n},[]]};var tn=({content:e})=>e;var on=e=>{if(e===null)throw new c(Yn.elementNull);let n=e.querySelector(".gnav-brand");if(n!==null)return fe(n);let a=e.querySelector(".large-menu");return a!==null?Ze(a):e.querySelector("strong")!==null?be(e):e.querySelector("em")!==null?R(e):e.querySelector("a")===null?rn(e):P(e.querySelector("a"))},xe=(e,n)=>{switch(e.type){case"Text":return tn(e);case"Link":return O(e);case"SecondaryCTA":return H(e);case"PrimaryCTA":return ye(e);case"Brand":return ue(e);case"MegaMenu":return en(e,n);default:return console.error(`Failed to recognize component: ${e}`),""}},Yn={elementNull:"Element is null"};var sn=(e,n,a=new Map)=>{let[r,t]=z([...document.querySelectorAll(".breadcrumbs ul > li > a")??[]],P),[i,o]=z([...e.children],on),s=e.querySelector(".product-entry-cta"),[l,d]=(()=>{try{return qe(s)}catch{return[null,[]]}})(),v=!1,y=[t,o,d].flat();return{breadcrumbs:r,components:i,productCTA:l,localnav:v,errors:y,unavEnabled:n,placeholders:a}};var ln=e=>{let n=e.querySelector(".feds-skip-link"),a=l=>{let d=document.querySelector("#main-content");d instanceof HTMLElement&&(l.preventDefault(),d.hasAttribute("tabindex")||d.setAttribute("tabindex","-1"),setTimeout(()=>{d.focus(),d.scrollIntoView({behavior:"smooth",block:"start"})},100))};n?.addEventListener("click",a);let r=[...e.querySelectorAll('.tabs button[role="tab"]')],t=[...e.querySelectorAll(".tab-content ul")],i=r.map((l,d)=>()=>{let v=t[d].closest(":popover-open");if(r.forEach(h=>{h.setAttribute("aria-selected","false")}),t.forEach(h=>{h.setAttribute("hidden","true")}),t[d]?.removeAttribute("hidden"),l.setAttribute("aria-selected","true"),!v||!E.matches)return;let y=dn();if(!y)return;let w=v?.clientHeight??0;y.style.height=`${w+72}px`});r.forEach((l,d)=>{l.addEventListener("click",i[d])});let o=e.querySelector('.tabs[role="tablist"]'),s=()=>{o&&(E.matches?o.setAttribute("aria-orientation","vertical"):o.removeAttribute("aria-orientation"))};return s(),E.addEventListener("change",s),Jn(e),()=>{n?.removeEventListener("click",a),r.forEach((l,d)=>{l.removeEventListener("click",i[d])}),E.removeEventListener("change",s)}},dn=()=>[...document.adoptedStyleSheets.flatMap(e=>[...e.cssRules])].find(e=>e?.selectorText==="header.global-navigation nav::after"),Jn=e=>{let n=[...e.querySelectorAll(".feds-gnav-items > li > button")],a=e.querySelector(".feds-gnav-items"),r=dn(),t=new ResizeObserver(i=>{if(i.length<1)return;let o=e.querySelector(".feds-popup:popover-open");if(!o){r.style.height="100%";return}let l=o.clientHeight<1?"100%":`${o.clientHeight+72}px`;r.style.height=l});n.forEach(i=>{if(!r)return;let o=i.nextElementSibling;o&&(t.observe(o),o.addEventListener("toggle",s=>{if(s.newState!=="open"&&!e.querySelector(".feds-popup:popover-open")){if(r.style.height="100%",E.matches)return;a?.classList.remove("subscreen-opening"),a?.classList.add("subscreen-closing")}else r.style.height=`${o.clientHeight+72}px`}))}),n.forEach(i=>{i.addEventListener("click",()=>{if(E.matches||!a)return;let o=i.nextElementSibling;o&&(a.classList.remove("subscreen-closing"),a.classList.add("subscreen-opening"),o.querySelector(".feds-popup-back-button")?.addEventListener("click",()=>{a.classList.remove("subscreen-opening"),a.classList.add("subscreen-closing"),setTimeout(()=>o.hidePopover(),240)}))})}),E.addEventListener("change",()=>{a?.classList.remove("subscreen-opening"),a?.classList.remove("subscreen-closing")}),e.querySelector(".feds-nav-toggle")?.addEventListener("click",()=>{a?.classList.remove("subscreen-opening"),a?.classList.remove("subscreen-closing")})};var pn=async e=>{let n=new Set,a=e.querySelectorAll("a.merch");if(a.length===0)return n;try{let r=T(),{base:t}=r;if(!t)return n.add(new g("base not found in config, cannot initialize merch links")),n;let i=await import(`${t}/blocks/merch/merch.js`),{default:o}=i;if(!o)return n.add(new g("decorateMerchLink not found in merch module")),n;a.forEach(s=>{o(s)})}catch(r){n.add(new g(`Error initializing merch links: ${r}`))}return n};var cn=async({gnavSource:e,asideSource:n})=>{let a=await q(e);if(a instanceof c)return a;let r=await q(n);return{mainNav:a,aside:r}};var gn=new CSSStyleSheet;gn.replaceSync(String.raw`/**
 * Generated by scripts/build-css.js - do not edit.
 * Pruned design tokens (used by gnav) + global navigation CSS.
 */

:root {
  --s2a-color-gray-25: #fff;
  --s2a-color-gray-50: #f8f8f8;
  --s2a-color-gray-75: #f3f3f3;
  --s2a-color-gray-300: #dadada;
  --s2a-color-gray-400: #c6c6c6;
  --s2a-color-gray-700: #505050;
  --s2a-color-gray-800: #292929;
  --s2a-color-gray-900: #131313;
  --s2a-color-gray-1000: #000;
  --s2a-color-blue-100: #f5f9ff;
  --s2a-color-blue-200: #e5f0fe;
  --s2a-color-blue-800: #4b75ff;
  --s2a-color-blue-900: #3b63fb;
  --s2a-color-red-900: #d73220;
  --s2a-color-transparent-black-64: rgb(0 0 0 / 64%);
  --s2a-color-brand-adobe-red: #eb1000;
  --s2a-border-radius-0: 0;
  --s2a-border-radius-2: 2px;
  --s2a-border-radius-4: 4px;
  --s2a-border-radius-8: 8px;
  --s2a-border-radius-12: 12px;
  --s2a-border-radius-16: 16px;
  --s2a-border-radius-24: 24px;
  --s2a-border-radius-32: 32px;
  --s2a-border-radius-999: 999px;
  --s2a-border-width-1: 1px;
  --s2a-border-width-2: 2px;
  --s2a-border-width-4: 4px;
  --s2a-opacity-32: 32px;
  --s2a-opacity-48: 48px;
  --s2a-opacity-64: 64px;
  --s2a-spacing-0: 0;
  --s2a-spacing-2: 2px;
  --s2a-spacing-4: 4px;
  --s2a-spacing-8: 8px;
  --s2a-spacing-12: 12px;
  --s2a-spacing-16: 16px;
  --s2a-spacing-20: 20px;
  --s2a-spacing-24: 24px;
  --s2a-spacing-32: 32px;
  --s2a-spacing-40: 40px;
  --s2a-spacing-48: 48px;
  --s2a-spacing-64: 64px;
  --s2a-spacing-80: 80px;
  --s2a-spacing-96: 96px;
  --s2a-spacing-124: 124px;
  --s2a-spacing-160: 160px;
  --s2a-spacing-240: 240px;
  --s2a-font-family-adobe-clean: "Adobe Clean";
  --s2a-font-family-adobe-clean-display: "Adobe Clean Display";
  --s2a-font-letter-spacing-0: 0;
  --s2a-font-letter-spacing-neg-3_84: -3.84px;
  --s2a-font-letter-spacing-neg-3_2: -3.2px;
  --s2a-font-letter-spacing-neg-2_88: -2.88px;
  --s2a-font-letter-spacing-neg-1_68: -1.68px;
  --s2a-font-letter-spacing-neg-1_44: -1.44px;
  --s2a-font-letter-spacing-neg-1_2: -1.2px;
  --s2a-font-letter-spacing-neg-0_96: -0.96px;
  --s2a-font-letter-spacing-neg-0_48: -0.48px;
  --s2a-font-letter-spacing-neg-0_2: -0.2px;
  --s2a-font-letter-spacing-0_16: 0.16px;
  --s2a-font-letter-spacing-0_24: 0.24px;
  --s2a-font-line-height-16: 1.333;
  --s2a-font-line-height-18: 1.286;
  --s2a-font-line-height-20: 1.25;
  --s2a-font-line-height-24: 1.2;
  --s2a-font-line-height-32: 1.143;
  --s2a-font-line-height-40: 1.111;
  --s2a-font-line-height-48: 1.2;
  --s2a-font-line-height-56: 1.167;
  --s2a-font-line-height-69: 1.232;
  --s2a-font-line-height-76: 1.188;
  --s2a-font-line-height-92: 1.278;
  --s2a-font-size-12: 0.75rem;
  --s2a-font-size-14: 0.875rem;
  --s2a-font-size-16: 1rem;
  --s2a-font-size-18: 1.125rem;
  --s2a-font-size-20: 1.25rem;
  --s2a-font-size-24: 1.5rem;
  --s2a-font-size-32: 2rem;
  --s2a-font-size-40: 2.5rem;
  --s2a-font-size-48: 3rem;
  --s2a-font-size-56: 3.5rem;
  --s2a-font-size-64: 4rem;
  --s2a-font-size-72: 4.5rem;
  --s2a-font-size-80: 5rem;
  --s2a-font-size-96: 6rem;
  --s2a-font-weight-adobe-clean-black: 900;
  --s2a-font-weight-adobe-clean-extrabold: 800;
  --s2a-font-weight-adobe-clean-bold: 700;
  --s2a-font-weight-adobe-clean-regular: 400;
  --s2a-blur-8: 8px;
  --s2a-blur-16: 16px;
  --s2a-blur-32: 32px;
  --s2a-blur-64: 64px;
  --color-transparent-black-12: rgb(0 0 0 / 12%);
  --color-transparent-black-16: rgb(0 0 0 / 16%);
}

:root {
  --s2a-border-radius-sm: var(--s2a-border-radius-8);
  --s2a-border-radius-md: var(--s2a-border-radius-16);
  --s2a-border-radius-round: var(--s2a-border-radius-999);
  --s2a-border-width-sm: var(--s2a-border-width-1);
  --s2a-border-width-md: var(--s2a-border-width-2);
  --s2a-border-width-lg: var(--s2a-border-width-4);
  --s2a-spacing-2xs: var(--s2a-spacing-4);
  --s2a-spacing-xs: var(--s2a-spacing-8);
  --s2a-spacing-sm: var(--s2a-spacing-12);
  --s2a-spacing-md: var(--s2a-spacing-16);
  --s2a-spacing-lg: var(--s2a-spacing-24);
  --s2a-spacing-xl: var(--s2a-spacing-32);
  --s2a-spacing-2xl: var(--s2a-spacing-40);
  --s2a-spacing-3xl: var(--s2a-spacing-48);
  --s2a-spacing-4xl: var(--s2a-spacing-64);
  --s2a-font-family-heading: var(--s2a-font-family-adobe-clean-display);
  --s2a-font-size-xs: var(--s2a-font-size-12);
  --s2a-font-size-sm: var(--s2a-font-size-14);
  --s2a-font-size-md: var(--s2a-font-size-16);
  --s2a-font-size-xl: var(--s2a-font-size-20);
  --s2a-font-size-2xl: var(--s2a-font-size-24);
  --s2a-blur-sm: var(--s2a-blur-16);
}

:root[data-theme="light"] {
  --s2a-color-content-default: var(--s2a-color-gray-800);
  --s2a-color-content-subtle: var(--s2a-color-gray-700);
  --s2a-color-content-body-subtle: var(--s2a-color-transparent-black-64);
}

/* ========== Gnav component styles ========== */

/**
 * Global Navigation Styles
 * Styles for the federal global navigation component
 */

/* =========================================
   Skip to Main Content Link
   ========================================= */

.feds-skip-link {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.trap-focus-gnav {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
  display: none;
}

nav:has(.feds-menu-active) .trap-focus-gnav {
  display: block;
}

.feds-skip-link:focus {
  outline: 2px solid var(--s2a-color-blue-800);
  outline-offset: 1px;
}

/* =========================================
   Header Shell
   ========================================= */
:root {
  --feds-font-family: var(--s2a-font-family-adobe-clean), adobe-clean, "Trebuchet MS", sans-serif;
  --feds-heading-font-family: "Adobe Clean Display Black", var(--s2a-font-family-heading), adobe-clean-display, "Arial Bold Adjusted", sans-serif;
  --s2a-typography-line-height-title-4-temp: 1;
}


header.global-navigation {
  width: 100%;
  background: transparent;
  visibility: visible;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  /* right: 0;
  max-width: var(--grid-max-width-default);
  margin: auto; */
}

header.feds-header-scrolled .feds-link {
  color: var(--s2a-color-gray-1000);
}

header.feds-header-scrolled nav {
  color: var(--s2a-color-gray-1000);
  box-shadow: 0 67px 19px 0 rgba(0, 0, 0, 0.00), 0 43px 17px 0 rgba(0, 0, 0, 0.01), 0 24px 14px 0 rgba(0, 0, 0, 0.04), 0 11px 11px 0 rgba(0, 0, 0, 0.07), 0 3px 6px 0 rgba(0, 0, 0, 0.08);
}

.global-navigation.site-pivot .universal-nav-container .profile-signed-out button {
  color: var(--s2a-color-gray-1000);
  border: 1px solid var(--s2a-color-gray-25);
  background-color: var(--s2a-color-gray-25);
}

.global-navigation.site-pivot:has(.feds-popup:popover-open, .feds-menu-wrapper:popover-open) .universal-nav-container .profile-signed-out button,
.global-navigation.site-pivot .universal-nav-container .profile-signed-out button:hover,
.global-navigation.site-pivot .universal-nav-container .profile-signed-out button:focus-visible {
  color: inherit;
  border-color: var(--s2a-color-gray-1000);
  background-color: transparent;
}

.global-navigation.site-pivot .universal-nav-container #universal-nav {
  justify-content: flex-end;
}

.global-navigation.site-pivot .feds-utilities {
  margin-left: auto;
  padding-right: var(--s2a-spacing-md);
}

::backdrop {
  opacity: 1;
}

.global-navigation.site-pivot .feds-gnav-items > li > .mega-menu.feds-link {
  cursor: pointer;
}

/* =========================================
   Navigation Bar
   ========================================= */

.global-navigation.site-pivot nav {
  display: flex;
  align-items: center;
  height: var(--s2a-spacing-64);
  width: calc(100% - 2 * var(--s2a-spacing-xs));
  justify-content: flex-start;
}

header.global-navigation nav {
  position: fixed;
  inset:
    var(--s2a-spacing-xs)
    var(--s2a-spacing-xs)
    0
    var(--s2a-spacing-xs);
  width: calc(100% - var(--s2a-spacing-xs) * 2);
  max-width: calc(1920px - var(--s2a-spacing-xs) * 2);
  margin: 0 auto;
  border: none;
  padding: 0;
  overflow: visible;
  border-radius: var(--s2a-border-radius-16);

  background-color: transparent;
}

header.global-navigation nav::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  background-color: transparent;
  backdrop-filter: blur(0px);
  border-radius: var(--s2a-border-radius-16);
  z-index: -1;
  transition: all 0.48s cubic-bezier(0.42, 0, 0.2, 1),
              height 0.35s ease;
}

header.global-navigation.feds-header-scrolled nav::after {
  backdrop-filter: blur(var(--s2a-blur-sm));
}

header.global-navigation nav:has(.feds-popup:popover-open, .feds-menu-wrapper:popover-open)::after {
  width: 100vw;
  border-radius: 0 0 var(--s2a-border-radius-16) var(--s2a-border-radius-16);
  background-color: var(--s2a-color-gray-75);
  left: calc(0px - var(--s2a-spacing-xs));
  top: calc(0px - var(--s2a-spacing-xs) * 2);
  backdrop-filter: blur(0px);
}

@media (max-width: 1023px) {
  header.global-navigation nav:has(.feds-popup:popover-open, .feds-menu-wrapper:popover-open)::after {
    height: calc(100dvh + var(--s2a-spacing-xs));
  }
}

header.global-navigation.feds-header-scrolled nav::after {
  background-color: rgba(255, 255, 255, 0.51);
}

.global-navigation nav > ul {
  display: flex;
  width: 100%;
  max-width: 1200px;
  height: inherit;
  align-items: center;
  padding-left: 0;
}

.global-navigation nav > ul > li {
  display: flex;
  align-items: center;
}

.global-navigation.site-pivot ul {
  list-style: none;
  margin: 0;
}

/* =========================================
   Nav Links
   ========================================= */

.feds-link {
  font-weight: var(--s2a-font-weight-adobe-clean-bold);
  font-family: var(--feds-font-family);
  font-size: var(--s2a-typography-font-size-body-sm);
  line-height: var(--s2a-typography-line-height-body-sm);
  letter-spacing: var(--s2a-typography-letter-spacing-body-sm);
  display: flex;
  align-items: center;
  border: 0;
  background-color: transparent;
  padding: var(--s2a-spacing-sm);
  color: var(--s2a-color-gray-25);
  opacity: 1;
  text-decoration: none;
}

.feds-link:hover {
  text-decoration: underline;
}

.global-navigation.site-pivot:has(.feds-popup:popover-open, .feds-menu-wrapper:popover-open) .feds-gnav-items > li > .feds-link {
  color: var(--s2a-color-gray-1000);
  font-size: var(--s2a-typography-font-size-title-2);
  line-height: var(--s2a-typography-line-height-title-2);
  letter-spacing: var(--s2a-typography-letter-spacing-title-2);
  padding: var(--s2a-spacing-xs) 0;
}

.global-navigation .feds-gnav-items > li > .feds-link:hover {
  text-decoration: none;
  opacity: 1;
  color: var(--s2a-color-gray-25);
}

.global-navigation.feds-header-scrolled .feds-gnav-items > li > .feds-link:hover {
  color: var(--s2a-color-gray-1000);
}



/* =========================================
   Nav Toggle (Hamburger)
   ========================================= */

.global-navigation nav .feds-nav-toggle {
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  box-shadow: none;
  color: var(--s2a-color-gray-25);
  cursor: pointer;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--s2a-font-size-xl);
  /* No token: font-weight 300 */
  font-weight: 300;
}

.global-navigation nav .feds-nav-toggle svg {
  width: 14px;
  height: 7px;
  flex-shrink: 0;
  color: var(--s2a-color-gray-25);
}

.global-navigation.feds-header-scrolled nav .feds-nav-toggle svg {
  color: var(--s2a-color-gray-1000);
}

/* =========================================
   Utilities (App Switcher, Profile)
   ========================================= */

.global-navigation .unav-comp-app-switcher.unav-comp-icon svg,
.global-navigation .unav-comp-external-notifications svg path,
.global-navigation .unav-comp-cart svg {
  fill: var(--s2a-color-gray-25);
}

.global-navigation:has(.feds-popup:popover-open, .feds-menu-wrapper:popover-open) .unav-comp-app-switcher.unav-comp-icon svg,
.global-navigation .unav-comp-app-switcher.unav-comp-icon.unav-comp-app-switcher-open svg,
.global-navigation:has(.feds-popup:popover-open, .feds-menu-wrapper:popover-open) .unav-comp-cart svg {
  fill: var(--s2a-color-gray-1000);
}

.global-navigation.feds-header-scrolled .unav-comp-app-switcher.unav-comp-icon svg,
.global-navigation.feds-header-scrolled .unav-comp-external-notifications svg path,
.global-navigation.feds-header-scrolled .unav-comp-cart svg {
  fill: var(--s2a-color-gray-1000);
}

.global-navigation .unav-comp-app-switcher.unav-comp-icon:hover svg,
.global-navigation .unav-comp-app-switcher.unav-comp-icon:focus-visible svg,
.global-navigation .unav-comp-external-notifications:hover svg path,
.global-navigation .unav-comp-cart:hover svg {
  fill: var(--s2a-color-gray-1000);
}

.global-navigation.feds-header-scrolled .universal-nav-container .profile-signed-out button {
  color: var(--s2a-color-gray-1000);
  border: var(--s2a-border-width-sm) solid var(--s2a-color-gray-1000);
  background-color: transparent;
}

header.global-navigation:has(.feds-popup:popover-open) .unav-comp-app-switcher.unav-comp-icon svg,
header.global-navigation:has(.feds-popup:popover-open) .unav-comp-external-notifications svg path,
header.global-navigation:has(.feds-popup:popover-open) .unav-comp-cart svg {
  fill: inherit;
}

header.global-navigation:has(.feds-popup:popover-open) .unav-comp-tooltip {
  display:none !important;
}

/* =========================================
   Popup (Mega Menu Container)
   ========================================= */

.feds-popup {
  position: fixed;
  inset: calc(var(--s2a-spacing-64) + var(--s2a-spacing-8) - 1px) 0 auto 0;
  width: 100%;
  max-width: none;
  max-height: calc(100dvh - var(--s2a-spacing-64));
  margin: 0;
  border: 0;
  padding: 0;
  overflow: auto;
  overscroll-behavior: contain;
  background-color:transparent;
}

.feds-popup:popover-open {
  display: block;
  /* No token for 18px */
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
}

.feds-popup > * {
  width: min(1200px, 100%);
  box-sizing: border-box;
}

.feds-popup .feds-popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--s2a-spacing-xs) var(--s2a-spacing-lg);
}

.feds-popup .feds-popup-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.feds-popup .feds-popup-back-button {
  border: 0;
  background: transparent;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--s2a-color-content-default);
  cursor: pointer;
}

.feds-popup .feds-popup-back-button svg {
  width: var(--s2a-spacing-20);
  height: var(--s2a-spacing-20);
}

.feds-popup .feds-popup-back-button .feds-popup-title {
  font-size: var(--s2a-typography-font-size-title-2);
  line-height: var(--s2a-typography-line-height-title-2);
  letter-spacing: var(--s2a-typography-letter-spacing-title-2);
  font-weight: var(--s2a-font-weight-adobe-clean-black);
  font-family: var(--feds-heading-font-family);
  color: var(--s2a-color-content-default);
  margin-left: 10px; /* replace with token if we find one later */
}

/* =========================================
   Link Groups
   ========================================= */

.feds-popup .feds-product-card {
  display: grid;
  grid-template-columns: var(--s2a-spacing-xl) minmax(0, 1fr);
  gap: var(--s2a-spacing-lg);
  min-height: 52px;
  align-items: start;
  border-radius: var(--s2a-border-radius-md);
  padding: var(--s2a-spacing-lg);
  text-decoration: none;
  color: var(--s2a-color-content-default);
}

.feds-popup .feds-product-card:hover .feds-product-card__title,
.feds-popup .feds-product-card:hover .feds-product-card__subtitle {
  color: var(--s2a-color-gray-25);
}

.feds-popup .feds-product-card__icon {
  display: block;
  width: var(--s2a-spacing-lg);
  height: var(--s2a-spacing-lg);
  margin-top: var(--s2a-spacing-2xs);
}

.feds-popup .feds-product-card__icon-img {
  display: block;
  width: 100%;
  height: 100%;
}

.feds-popup .feds-product-card__title {
  font-weight: var(--s2a-font-weight-adobe-clean-black);
  font-size: var(--s2a-typography-font-size-title-4);
  line-height: var(--s2a-typography-line-height-title-4-temp);
  letter-spacing: var(--s2a-typography-letter-spacing-title-4);
  font-family: var(--feds-heading-font-family);
}

.feds-popup .feds-product-card__badges {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px;
  margin-bottom: var(--s2a-spacing-xs);
}

.feds-popup .feds-product-card__badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border: var(--s2a-border-width-sm) solid var(--s2a-color-gray-1000);
  border-radius: var(--s2a-border-radius-sm);
  font-size: var(--s2a-font-size-xs);
  font-weight: var(--s2a-font-weight-adobe-clean-bold);
  line-height: var(--s2a-typography-line-height-caption);
  color: var(--s2a-color-gray-1000);
  letter-spacing: var(--s2a-typography-letter-spacing-caption);
}

.feds-popup .feds-product-card__badge--filled {
  border-color: var(--s2a-color-gray-1000);
  background: var(--s2a-color-gray-1000);
  color: var(--s2a-color-gray-25);
}

.feds-popup .feds-product-card__subtitle {
  margin-top: var(--s2a-spacing-2xs);
  font-size: var(--s2a-typography-font-size-body-sm);
  font-weight: var(--s2a-font-weight-adobe-clean-regular);
  line-height: var(--s2a-typography-line-height-body-sm);
  letter-spacing: var(--s2a-typography-letter-spacing-body-sm);
  color: var(--s2a-color-content-body-subtle);
}

.feds-popup .feds-product-card__price {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: var(--s2a-spacing-sm);
}

.feds-popup .feds-product-card__old-price {
  font-size: var(--s2a-font-size-xs);
  font-weight: var(--s2a-font-weight-adobe-clean-bold);
  line-height: 1;
  text-decoration: line-through;
  /* No token: design uses custom gray */
  color: var(--s2a-color-content-subtle);
}

.feds-popup .feds-product-card__new-price {
  font-size: var(--s2a-font-size-xs);
  font-weight: var(--s2a-font-weight-adobe-clean-bold);
  line-height: 1;
  color: var(--s2a-color-gray-1000);
}

.feds-popup .feds-product-card--blue {
  background: var(--s2a-color-blue-100);
}

.feds-popup .feds-product-card--blue:hover {
  background: var(--s2a-color-blue-200);
}

.feds-popup .feds-product-card:hover .feds-product-card__old-price,
.feds-popup .feds-product-card:hover .feds-product-card__new-price,
.feds-popup .feds-product-card:hover .feds-product-card__badge {
  color: var(--s2a-color-gray-25);
  border-color: var(--s2a-color-gray-25);
}

.feds-popup .feds-product-card:hover .feds-product-card__badge--filled {
  background: var(--s2a-color-gray-25);
  color: var(--s2a-color-gray-1000);
}

.feds-product-card .feds-product-card-header {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

/* =========================================
   Secondary CTAs
   ========================================= */

.feds-popup .feds-secondary-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 11px 14px 10px;
  border: var(--s2a-border-width-sm) solid var(--s2a-color-gray-1000);
  border-radius: var(--s2a-border-radius-round);
  font-weight: var(--s2a-font-weight-adobe-clean-bold);
  font-size: var(--s2a-typography-font-size-body-sm);
  line-height: var(--s2a-typography-line-height-body-sm);
  letter-spacing: var(--s2a-typography-letter-spacing-body-sm);
  color: var(--s2a-color-content-default);
  text-decoration: none;
}

.feds-popup .feds-secondary-cta:hover {
  background: var(--s2a-color-gray-75);
}

/* =========================================
   Responsive: Desktop (min-width: 1024px)
   ========================================= */

@media (min-width: 1024px) {
  .global-navigation nav .feds-nav-toggle {
    display: none;
  }

  .global-navigation nav > ul > li.feds-menu-wrapper {
    position: static;
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    width: auto;
    height: unset;
    border: 0;
    outline: 0;
    box-shadow: none;
    justify-content: space-between;
    background-color: transparent;
    opacity: 1;
    visibility: visible;
    translate: unset;
    transition: unset;
  }

  .global-navigation.site-pivot nav {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .global-navigation nav .feds-gnav-items {
    align-items: center;
    padding-left: 0;
    margin: 0;
    display: flex;
  }

  .global-navigation.site-pivot .feds-gnav-items > li > .feds-link {
    letter-spacing: var(--s2a-typography-letter-spacing-label);
  }
  .global-navigation.site-pivot:has(.feds-popup:popover-open, .feds-menu-wrapper:popover-open) .feds-gnav-items > li > .feds-link {
    opacity: 60%;
    font-weight: var(--s2a-font-weight-adobe-clean-bold);
    font-size: var(--s2a-typography-font-size-label);
    line-height: var(--s2a-typography-line-height-label);
    letter-spacing: var(--s2a-typography-letter-spacing-label);
    padding: var(--s2a-spacing-sm);
  }

  .global-navigation.site-pivot:not(:has(.feds-popup:popover-open, .feds-menu-wrapper:popover-open)) .feds-gnav-items:has(.feds-link:hover) > li > .feds-link:not(:hover) {
    opacity: 0.65;
  }


  .global-navigation.site-pivot:has(.feds-popup:popover-open, .feds-menu-wrapper:popover-open) .feds-gnav-items > li > .feds-link[aria-expanded="true"],
  .global-navigation.site-pivot:has(.feds-popup:popover-open, .feds-menu-wrapper:popover-open) .feds-gnav-items > li > .feds-link:hover {
    opacity: 1;
  }

  .global-navigation.site-pivot .feds-gnav-items > li > .mega-menu.feds-link {
    position: relative;
  }

  .global-navigation.site-pivot .feds-gnav-items > li > .mega-menu.feds-link .chevron-down {
    margin-top: 3px;
    margin-left: 6px;
    flex-shrink: 0;
    transition: transform 0.15s ease;
  }

  .global-navigation.site-pivot .feds-gnav-items > li > .mega-menu.feds-link:has(~ .feds-popup:popover-open) .chevron-down {
    transform: rotate(180deg);
  }

  .feds-popup .feds-popup-header {
    display: none;
  }

  .feds-popup > div {
    max-width: 1920px;
  }
  .feds-popup .feds-product-card__title {
    font-weight: var(--s2a-font-weight-adobe-clean-bold);
    font-size: var(--s2a-typography-font-size-eyebrow);
    line-height: var(--s2a-typography-line-height-eyebrow);
    letter-spacing: var(--s2a-typography-letter-spacing-eyebrow);
    font-family: var(--feds-font-family);
  }
}

/* =========================================
   Responsive: Mobile (max-width: 1023px)
   ========================================= */

@media (max-width: 1023px) {
  .global-navigation.site-pivot .feds-gnav-items > li > .mega-menu.feds-link {
    width: 100%;
    justify-content: space-between;
    text-align: left;
  }

  .global-navigation.site-pivot .feds-gnav-items > li > .feds-link {
    font-family: var(--feds-heading-font-family);
    font-weight: var(--s2a-font-weight-adobe-clean-black);
  }

  .global-navigation.site-pivot .feds-gnav-items > li > .mega-menu.feds-link .chevron-down {
    order: 2;
    margin-left: var(--s2a-spacing-xs);
    flex-shrink: 0;
    transform: rotate(-90deg) scale(2.5);
  }

  .global-navigation.site-pivot .feds-gnav-items > li > .mega-menu.feds-link .chevron-down path {
    stroke-width: 0.5;
  }

  .feds-popup {
    inset: calc(var(--s2a-spacing-64) + var(--s2a-spacing-8) - 1px) 0 0 0;
  }

  .feds-popup .feds-product-card {
    gap: var(--s2a-spacing-2xl);     
    border-radius: var(--s2a-border-radius-24);
  }

  body:has(.feds-popup:popover-open, .feds-menu-wrapper:popover-open) {
    overflow: hidden;
    scrollbar-gutter: stable;
  }

  header.global-navigation nav:has(.feds-popup:popover-open, .feds-menu-wrapper:popover-open)::after {
    border-radius: 0;
  }

  .feds-popup .feds-product-card__subtitle {
    margin-top: var(--s2a-spacing-xs);
  }
}

/* =========================================
   Scroll Animations
   ========================================= */

@media (min-width: 1920px) {
  header.global-navigation nav:has(.feds-popup:popover-open, .feds-menu-wrapper:popover-open)::after {
    left: calc(0px - var(--s2a-spacing-xs) - (100vw - 1920px) / 2);
  }

  header.global-navigation nav .feds-popup > div {
    margin: 0 auto;
  }
}

/* =========================================
   Popover Animations
   ========================================= */


@media (min-width: 1024px) {
  .feds-popup {
    border-bottom-left-radius: 18px;
    border-bottom-right-radius: 18px;
    background-color: transparent;
    opacity: 0;
    overflow: hidden;
    max-height: calc(100dvh - var(--s2a-spacing-64));
    clip-path: polygon(0 0, 100% 0, 100% 0%, 0 0%);
    transition:
      display 0.48s allow-discrete,
      overlay 0.48s allow-discrete,
      opacity 0.48s cubic-bezier(0.4, 0, 0.2, 1);
    transition-delay: 0s;
  }

  .feds-popup:popover-open {
    background-color: transparent;
    opacity: 1;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    transition-delay: 0.15s;
  }

  .feds-popup:popover-open > :not(.feds-popup-header) {
    overflow-y: auto;
    max-height: calc(100dvh - var(--s2a-spacing-64));
  }

  @starting-style {
    .feds-popup:popover-open {
      background-color: rgba(255,255,255,0.51);
      opacity: 0;
      clip-path: polygon(0 0, 100% 0, 100% 0%, 0 0%);
    }
  }

  nav::backdrop {
    background-color: rgba(0, 0, 0, 0);
    backdrop-filter: blur(0px);
    inset: 0 0 0 0;
    transition:
      opacity 0.3s ease,
      background-color 0.3s ease,
      backdrop-filter 0.3s ease;
  }

  nav:has(.feds-popup:popover-open)::backdrop {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.60);
    backdrop-filter: blur(32px);
  }

  @starting-style {
    nav::backdrop {
      opacity: 0;
      background-color: rgba(0, 0, 0, 0);
      backdrop-filter: blur(0px);
    }
  }
}

/* =========================================
   Content Entrance Animations (Desktop Only)
   ========================================= */

@keyframes feds-slide-up {
  from {
    transform: translateY(6px);
  }
  to {
    transform: translateY(0);
  }
}
.feds-popup:popover-open {
  /* Animation Variables */
  --feds-anim-duration: 0.35s;
  --feds-anim-panel-delay: 0.18s;
  --feds-anim-stagger-interval: 25ms;
  --feds-anim-stagger-start: 0.20s;
}
.feds-popup:popover-open .product-list ul[role="tabpanel"] > li {
  transform: translateY(6px);
  animation: feds-slide-up var(--feds-anim-duration) ease-out forwards;
}
.feds-popup:popover-open .product-list ul[role="tabpanel"] > li {
  transform: translateY(6px);
  animation: feds-slide-up var(--feds-anim-duration) ease-out forwards;
}

@media (min-width: 1024px) {

  /* 1. Pane Content (Base Slide & Fade) */
  .feds-popup:popover-open > div {
    transform: translateY(6px);
    animation: feds-slide-up var(--feds-anim-duration) ease-out forwards;
    animation-delay: var(--feds-anim-panel-delay);
  }

  /* 2. Filters and Cards (Staggered) */
  .feds-popup:popover-open .feds-gnav-cards > li,
  .feds-popup:popover-open .product-list ul.tabs > li {
    transform: translateY(6px);
    animation: feds-slide-up var(--feds-anim-duration) ease-out forwards;
  }

  .product-list .tab-content [role="tabpanel"] {
    opacity: 0;
    transition:
      display 0.48s allow-discrete,
      opacity 0.48s cubic-bezier(0.4, 0, 0.2, 1);
    transition-delay: 0.2s;
    &[hidden] {
      transition: unset;
    }
  }

  .product-list .tab-content [role="tabpanel"]:not([hidden]) {
    opacity: 1;
  }

  @starting-style {
    .product-list .tab-content [role="tabpanel"]:not([hidden]) {
      opacity: 0;
    }
  }
}
/* =========================================
   Unav App Switcher Fix
   ========================================= */

header.global-navigation:has(.unav-comp-app-switcher-open) nav {
  backdrop-filter: none;
  transform: none;
  transition: none;
  background: transparent;
}

header.global-navigation .universal-nav-container .universal-nav-tray .unav-comp-overlay {
  height: 100vh;
  width: 100vw;
}

/* =========================================
   Menu Wrapper (Mobile Fade In)
   ========================================= */

@keyframes mobile-main-menu-slide-in {
  from {
    opacity: 0;
    transform: translateX(18px);
  } to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes main-menu-items-exit {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-40px);
  }
}

@keyframes sub-menu-items-enter {
  from {
    opacity: 0;
    transform: translateX(18px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes sub-menu-items-exit {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(18px);
  }
}

@keyframes main-menu-items-re-enter {
  from {
    opacity: 0;
    transform: translateX(-18px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-in {
  from { opacity: 0; display: none; }
  to   { opacity: 1; display: block; }
}

@keyframes fade-out {
  from { opacity: 1; display: block; }
  to   { opacity: 0; display: none; }
}

@media (max-width: 1023px) {
  .global-navigation nav > ul > li.feds-menu-wrapper {
    position: fixed;
    top: var(--s2a-spacing-64);
    left: 0;
    right: var(--s2a-spacing-20);
    flex-direction: column;
    height: calc(100dvh - var(--s2a-spacing-64));
    border: 0;
    width: 100%;
    opacity: 0;
    display: flex;
    visibility: hidden;
    color: var(--s2a-color-gray-1000);
    background-color: transparent;
    padding: 0;
  }
  
  .global-navigation nav > ul > li.feds-menu-wrapper.feds-menu-active {
    transition: opacity 0.2s ease, visibility 0s linear 0.2s;
  }
  
  .global-navigation nav > ul > li.feds-menu-wrapper:popover-open {
    display: flex;
    translate: 0;
    opacity: 1;
    z-index: 2;
    transition: translate 0.4s ease-out, opacity 0.4s ease, visibility 0s linear 0s;
    visibility: visible;
    align-items: flex-start;
    padding: 0;
    margin-top: 0;
  }
  
  .global-navigation nav > ul > li.feds-menu-wrapper:popover-open .feds-gnav-items {
    align-items: flex-start;
    padding: var(--s2a-spacing-xs) var(--s2a-spacing-lg) var(--s2a-spacing-sm);
    width: calc(100% - var(--s2a-spacing-3xl));
  }

  .global-navigation nav > ul > li.feds-menu-wrapper:popover-open {
    & .feds-gnav-items > li {
      opacity: 0;
      transform: translateX(18px);
      animation: mobile-main-menu-slide-in 0.35s cubic-bezier(0.42, 0, 0, 1) forwards;
    }
  
    & .feds-gnav-items > li:nth-child(1) { animation-delay: 0.18s; }
    & .feds-gnav-items > li:nth-child(2) { animation-delay: 0.24s; }
    & .feds-gnav-items > li:nth-child(3) { animation-delay: 0.30s; }
    & .feds-gnav-items > li:nth-child(4) { animation-delay: 0.36s; }
    & .feds-gnav-items > li:nth-child(5) { animation-delay: 0.42s; }
    & .feds-gnav-items > li:nth-child(6) { animation-delay: 0.48s; }
    & .feds-gnav-items > li:nth-child(7) { animation-delay: 0.54s; }
    & .feds-gnav-items > li:nth-child(8) { animation-delay: 0.60s; }
    & .feds-gnav-items > li:nth-child(9) { animation-delay: 0.66s; }
    & .feds-gnav-items > li:nth-child(10) { animation-delay: 0.72s; }
  }

  .feds-nav-toggle path {
    transform-origin: 7px 3.5px;
    transition: transform 0.35s cubic-bezier(.4,0,.2,1);
  }
  
  .global-navigation:has(.feds-menu-wrapper:popover-open, .feds-popup:popover-open) .feds-nav-toggle svg {
    height: 11px;
  }
  
  .global-navigation:has(.feds-menu-wrapper:popover-open, .feds-popup:popover-open) .feds-nav-toggle path:first-child {
    transform: translateY(-2.75px) rotate(-45deg) scaleX(1.25);
  }
  .global-navigation:has(.feds-menu-wrapper:popover-open, .feds-popup:popover-open) .feds-nav-toggle path:last-child {
    transform: translateY(2.75px) rotate(45deg) scaleX(1.25);
  }
  
  header.global-navigation > nav > ul > li.feds-menu-wrapper > ul.feds-gnav-items {
    /* open subscreen */
    &.subscreen-opening {
      & > li {
        opacity: 1;
        transform: translateX(0);
        animation: main-menu-items-exit 0.5s cubic-bezier(0.42, 0, 0, 1) forwards;
      }
      & > li:nth-child(1) { animation-delay: 0s; }
      & > li:nth-child(2) { animation-delay: 0.025s; }
      & > li:nth-child(3) { animation-delay: 0.05s; }
      & > li:nth-child(4) { animation-delay: 0.075s; }
      & > li:nth-child(5) { animation-delay: 0.1s; }
  
      /* target the popover descendant when it is open */
      & .feds-popup:popover-open {
        opacity: 0;
        animation: fade-in 0s linear 0.3s forwards; /* zero-duration instant jump after delay */
  
        & .feds-popup-header {
          opacity: 0;
          transform: translateX(18px);
          animation: sub-menu-items-enter 0.5s forwards cubic-bezier(0.42, 0, 0, 1) 0.3s;
        }
  
        & .tabs {
          opacity: 0;
          transform: translateX(18px);
          animation: sub-menu-items-enter 0.5s forwards cubic-bezier(0.42, 0, 0, 1);
          animation-delay: 0.36s;
        }
  
        & .feds-gnav-cards > li {
          opacity: 0;
          transform: translateX(18px);
          animation: sub-menu-items-enter 0.5s forwards cubic-bezier(0.42, 0, 0, 1);
        }
        & .feds-gnav-cards > li:nth-child(1) { animation-delay: 0.36s; }
        & .feds-gnav-cards > li:nth-child(2) { animation-delay: 0.42s; }
      }
    }
    /* close subscreen */
    &.subscreen-closing {
      & > li {
        opacity: 0;
        transform: translateX(-18px);
        animation: main-menu-items-re-enter 0.26s ease forwards 0.24s;
      }
      & > li:nth-child(1) { animation-delay: 0.24s; }
      & > li:nth-child(2) { animation-delay: 0.27s; }
      & > li:nth-child(3) { animation-delay: 0.30s; }
      & > li:nth-child(4) { animation-delay: 0.33s; }
      & > li:nth-child(5) { animation-delay: 0.36s; }
  
      /* target the popover descendant when it is open */
      & .feds-popup:popover-open {
        & .feds-popup-header {
          opacity: 1;
          transform: translateX(0px);
          animation: sub-menu-items-exit 0.2s forwards ease;
        }
  
        & .tabs {
          opacity: 1;
          transform: translateX(0px);
          animation: sub-menu-items-exit 0.2s forwards ease;
        }
  
        & .feds-gnav-cards > li {
          opacity: 1;
          transform: translateX(0px);
          animation: sub-menu-items-exit 0.2s forwards ease;
        }
        & .feds-gnav-cards > li:nth-child(1) { animation-delay: 0.04s; }
        & .feds-gnav-cards > li:nth-child(2) { animation-delay: 0.08s; }
      }
    }
  }

  header.global-navigation.feds-header-scrolled:has(.unav-comp-app-switcher-open) .feds-brand-image svg,
  header.global-navigation.feds-header-scrolled:has(.unav-comp-app-switcher-open) .feds-nav-toggle svg {
    animation: none;
    color: var(--s2a-color-gray-1000);
  }
}

ul.feds-gnav-cards,
ul[role="tabpanel"],
.product-list ul.tabs {
  & > li:nth-child(1) { animation-delay: 0.025s; }
  & > li:nth-child(2) { animation-delay: 0.05s; }
  & > li:nth-child(3) { animation-delay: 0.075s; }
  & > li:nth-child(4) { animation-delay: 0.1s; }
  & > li:nth-child(5) { animation-delay: 0.125s; }
  & > li:nth-child(6) { animation-delay: 0.15s; }
  & > li:nth-child(7) { animation-delay: 0.175s; }
  & > li:nth-child(8) { animation-delay: 0.2s; }
  & > li:nth-child(9) { animation-delay: 0.225s; }
  & > li:nth-child(10) { animation-delay: 0.25s; }
}

/* =========================================
   Brand Container
   ========================================= */

.feds-brand-container {
  display: flex;
  flex-shrink: 0;
}

li.feds-brand-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

header.global-navigation:has(.feds-popup:popover-open, .feds-menu-wrapper:popover-open) nav .feds-brand-image svg,
header.global-navigation:has(.feds-popup:popover-open, .feds-menu-wrapper:popover-open) nav .feds-nav-toggle svg,
header.global-navigation.feds-header-scrolled nav .feds-brand-image svg {
  color: var(--s2a-color-gray-1000);
}

/* =========================================
   Brand
   ========================================= */

.feds-brand {
  align-items: center;
  outline-offset: var(--s2a-spacing-2xs);
  padding: 0 var(--s2a-spacing-sm) 0 var(--s2a-spacing-md);
  column-gap: 10px;
}

.feds-brand-image svg {
  width: 100%;
  display: block;
}

/* =========================================
   Brand Image (Mobile / Desktop variants)
   ========================================= */

.feds-brand-image svg {
  color: var(--s2a-color-gray-25);
}

.feds-brand-image.desktop-brand {
  display: none;
}

.feds-brand-image.mobile-brand {
  display: inherit;
}

.feds-brand-image.mobile-brand svg {
  height: var(--s2a-spacing-md);
  width: 18px; /* no token for 18px */
}

.feds-brand-image.desktop-brand svg {
  width: 67px;
}

/* For light background */
.feds-brand-image {
  & img:nth-child(1) { display: inherit; }
  & img:nth-child(2) { display: none; }
}

/* For dark background */
.feds-dark-bg {
  & .feds-brand-image {
    & img:nth-child(1) { display: none; }
    & img:nth-child(2) { display: inherit; }
  }
}

/* same behavior for both "scrolled" and "popup open" states (considering for transparent-white/light background only)*/
:is(.feds-header-scrolled, .global-navigation:has(.feds-popup:popover-open)) {
  & .feds-brand-wrapper .feds-brand-image {
    & img:nth-child(1) { display: inherit; }
    & img:nth-child(2) { display: none; }
  }
}

/* =========================================
   Animations
   ========================================= */

@media (max-width: 1023px) {
  @keyframes brand-fade {
    from {
      opacity: 1;
      visibility: visible;
    }
    to {
      opacity: 0;
      visibility: hidden;
    }
  }
  header.global-navigation:has(.feds-popup:popover-open, .feds-menu-wrapper:popover-open) .feds-brand,
  header.global-navigation:has(.feds-menu-active) .feds-brand {
    animation: brand-fade 0.3s;
    opacity: 0;
    pointer-events: none;
    visibility: hidden;
  }
  header.global-navigation .feds-nav-toggle {
    transform: translateX(0);
    transition: transform 0.3s ease;
  }
  header.global-navigation:has(.feds-popup:popover-open, .feds-menu-wrapper:popover-open) .feds-nav-toggle {
    transform: translateX(-30px);
  }
}

/* =========================================
   Responsive: Desktop (min-width: 1024px)
   ========================================= */

@media (min-width: 1024px) {
  li.feds-brand-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    padding-left: 0;
  }

  .feds-brand-image.desktop-brand {
    display: inherit;
  }

  header:has(.feds-popup:popover-open, .feds-menu-wrapper:popover-open) .feds-brand-image svg {
    color: var(--s2a-color-gray-1000);
  }

  .feds-brand-image.mobile-brand {
    display: none;
  }
}

/* Mega Menu grid structure for links-card and promo-card */

/* =========================================
   Gnav Cards Grid (base)
   ========================================= */

.feds-gnav-cards > li:has(> :nth-child(2)) {
  display: flex;
  flex-direction: column;
  gap: var(--s2a-spacing-2xs);
}

/* =========================================
   Product Link in mobile on product list
   ========================================= */

.feds-popup-header .product-links .feds-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--s2a-color-content-default);
  text-decoration: none;
  font-size: var(--s2a-font-size-sm);
  font-weight: var(--s2a-font-weight-adobe-clean-bold);
  line-height: 18px;
  white-space: nowrap;
  padding: 0;
  font-family: var(--feds-font-family);
}

.feds-popup-header .product-links .feds-link svg {
  width: 5px;
  height: 8px;
  flex-shrink: 0;
}

ul.tabs .product-links {
  display: none;
}

/* =========================================
   Responsive: Desktop (min-width: 1024px)
   ========================================= */

@media (min-width: 1024px) {
  /* Responsive: fit all columns within width (no promo-card) */
  .feds-gnav-cards:not(:has(.promo-card)) > li:has(> :nth-child(2)) {
    gap: var(--s2a-spacing-xs);
    flex: 2 1 0;
    flex-direction: row;
  }

  .feds-gnav-cards:not(:has(.promo-card)) > li:has(> :nth-child(2)) article {
    flex: 1 1 0;
    min-width: 0;
  }

  /* Legacy: fixed widths when promo-card is present */
  .feds-gnav-cards:has(.promo-card) > li:has(> :nth-child(2)) {
    gap: var(--s2a-spacing-xs);
  }

  .feds-gnav-cards:has(.promo-card) > li:has(.promo-card, .links-card) {
    width: calc(33.33% - 5.33px);
  }

  .feds-popup .feds-gnav-cards:has(.promo-card, .links-card) {
    align-items: stretch;
  }

  .feds-popup .feds-gnav-cards:has(.promo-card, .links-card) article {
    height: 100%;
  }

  .feds-popup-header .product-links {
    display: none;
  }

  ul.tabs .product-links {
    display: block;
  }

  ul.tabs .product-links .feds-link {
    font-family: var(--feds-font-family);
    padding: var(--s2a-spacing-md) var(--s2a-spacing-lg);
  }
}

/* =========================================
   Large Desktop (min-width: 1280px) — promo-card layout only
   ========================================= */

@media (min-width: 1280px) {
  .feds-gnav-cards:has(.promo-card) > li:has(.promo-card, .links-card) {
    width: calc(25% - 6px);
  }

  .feds-gnav-cards:has(.promo-card) > li:has(.promo-card) {
    width: calc(50% - 4px);
  }

  .feds-gnav-cards:has(.promo-card) > li:has(> :nth-child(2)) {
    width: calc(50% - 4px);
    flex-direction: row;
  }

  .feds-gnav-cards:has(.promo-card) > li:has(> :nth-child(2)) article {
    width: calc(50% - 4px);
  }
}

/* =========================================
   Gnav Cards Container
   ========================================= */

.feds-popup .feds-gnav-cards {
  list-style: none;
  margin: 0;
  padding: var(--s2a-spacing-lg);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--s2a-spacing-2xs);
  align-items: stretch;
}

.feds-popup .feds-gnav-cards > li {
  min-width: 0;
}

/* =========================================
   Responsive: Desktop (min-width: 1024px)
   ========================================= */

@media (min-width: 1024px) {
  .feds-popup .feds-gnav-cards {
    display: flex;
    flex-wrap: nowrap;
    gap: var(--s2a-spacing-xs);
    overflow-x: auto;
    width: 100%;
    padding-top: 0;
  }

  .feds-popup .feds-gnav-cards > li {
    flex: 1 1 0;
    min-width: 0;
  }

  .feds-popup .feds-gnav-cards:has(.promo-card) > li {
    flex: 0 0 auto;
  }
}

/* =========================================
   Promo Card
   ========================================= */

.feds-gnav-cards .promo-card {
  position: relative;
  height: 199px;
}

.feds-gnav-cards .promo-card__bg {
  height: 100%;
  width: 100%;
  display: block;
  position: absolute;
}

.feds-gnav-cards .promo-card__bg-image {
  border-radius: var(--s2a-border-radius-24);
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.feds-gnav-cards .promo-card__content {
  position: absolute;
  top: 0;
  left: 0;
  background: transparent;
  width: 100%;
  height: 100%;
}

.feds-gnav-cards .promo-card__icon {
  position: absolute;
  top: var(--s2a-spacing-md);
  left: var(--s2a-spacing-md);
  width: var(--s2a-spacing-lg);
  height: var(--s2a-spacing-lg);
}

.feds-gnav-cards .promo-card__text-content {
  position: absolute;
  bottom: 0;
  left: 0;
  display: block;
  padding: var(--s2a-spacing-md);
}

.feds-gnav-cards .promo-card__price,
.feds-gnav-cards .promo-card__title {
  margin: 0;
  color: var(--s2a-color-gray-25);
}

.feds-gnav-cards .promo-card__price {
  font-weight: var(--s2a-font-weight-adobe-clean-bold);
  font-size: var(--s2a-font-size-md);
  line-height: var(--s2a-font-line-height-24);
  /* No token for percentage */
  letter-spacing: -1%;
}

.feds-gnav-cards .promo-card__title {
  font-weight: var(--s2a-font-weight-adobe-clean-black);
  font-size: var(--s2a-typography-font-size-title-4);
  line-height: var(--s2a-typography-line-height-title-4-temp);
  letter-spacing: var(--s2a-typography-letter-spacing-title-4);
  font-family: var(--feds-heading-font-family);
}

/* =========================================
   Promo Card CTA
   ========================================= */

.feds-gnav-cards .promo-card__cta {
  display: block;
  margin-top: var(--s2a-spacing-lg);
}

.feds-gnav-cards .promo-card__cta .feds-secondary-cta {
  letter-spacing: 0;
  border: none;
  background: var(--s2a-color-gray-25);
  color: var(--s2a-color-gray-1000);
  padding: 11px var(--s2a-spacing-lg) var(--s2a-spacing-sm);
  font-weight: var(--s2a-font-weight-adobe-clean-bold);
  font-size: var(--s2a-typography-font-size-label);
  line-height: var(--s2a-typography-line-height-label);
  letter-spacing: var(--s2a-typography-letter-spacing-label);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.feds-gnav-cards .promo-card__cta .feds-secondary-cta:hover,
.feds-gnav-cards .promo-card__cta .feds-secondary-cta:focus {
  background: var(--s2a-color-gray-1000);
  color: var(--s2a-color-gray-25);
}

/* =========================================
   Responsive: Desktop (min-width: 1024px)
   ========================================= */

@media (min-width: 1024px) {
  .feds-gnav-cards .promo-card {
    height: 100%;
    min-height: 420px;
  }

  .feds-gnav-cards .promo-card__bg-image {
    border-radius: var(--s2a-border-radius-md);
  }

  .feds-gnav-cards .promo-card__cta {
    margin-top: var(--s2a-spacing-md);
  }
}

/* =========================================
   Responsive: Large Desktop (min-width: 1280px)
   ========================================= */

@media (min-width: 1280px) {
  .feds-gnav-cards .promo-card {
    min-height: auto;
  }

  .feds-gnav-cards .promo-card__bg-image {
    border-radius: var(--s2a-border-radius-12);
  }

  .feds-gnav-cards .promo-card__icon {
    position: absolute;
    top: var(--s2a-spacing-lg);
    left: var(--s2a-spacing-lg);
  }

  .feds-gnav-cards .promo-card__text-content {
    width: 100%;
    box-sizing: border-box;
    padding: var(--s2a-spacing-lg);
  }

  .feds-gnav-cards .promo-card__cta {
    position: absolute;
    bottom: var(--s2a-spacing-lg);
    right: var(--s2a-spacing-lg);
    margin-top: 0;
  }
}

/* =========================================
   Links Card
   ========================================= */

.feds-popup .links-card {
  border-radius: var(--s2a-border-radius-24); /* Don't have a token */
  background: var(--s2a-color-gray-25);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--s2a-spacing-xl) var(--s2a-spacing-lg);
}

.feds-popup .links-card .links-card-title {
  margin: 0 0 var(--s2a-spacing-sm);
  font-size: var(--s2a-typography-font-size-title-4);
  line-height: var(--s2a-typography-line-height-title-4-temp);
  letter-spacing: var(--s2a-typography-letter-spacing-title-4);
  font-weight: var(--s2a-font-weight-adobe-clean-black);
  color: var(--s2a-color-gray-1000);
  font-family: var(--feds-heading-font-family);
}



/* =========================================
   Links Card List
   ========================================= */

.feds-popup .links-card .links-card-links {
  list-style: none;
  margin: 0;
  padding: 0;
  line-height: 120%;
}

.feds-popup .links-card .links-card-links li {
  display: flex;
  padding: var(--s2a-spacing-xs) 0;
}

.feds-popup .links-card .links-card-links .feds-link {
  padding: 0;
  color: var(--s2a-color-gray-1000);
  font-size: var(--s2a-font-size-sm);
  font-weight: var(--s2a-font-weight-adobe-clean-regular);
  display: inline-flex;
}

/* =========================================
   Links Card Footer
   ========================================= */

.feds-popup .links-card .links-card-footer {
  width: 100%;
  margin-top: var(--s2a-spacing-lg);
}

.feds-popup .links-card .links-card-footer .feds-secondary-cta {
  width: 100%;
  box-sizing: border-box;
  justify-content: center;
  background-color: transparent;
}

/* =========================================
   Responsive: Desktop (min-width: 1024px)
   ========================================= */

@media (min-width: 1024px) {
  .feds-popup .links-card {
    border-radius: var(--s2a-border-radius-16); /* Don't have a token */
    padding: var(--s2a-spacing-lg) var(--s2a-spacing-lg) var(--s2a-spacing-md);
  }

  .feds-popup .links-card .links-card-footer .feds-secondary-cta {
    color: var(--s2a-color-gray-1000);
    background-color: transparent;
  }
  .feds-popup .links-card .links-card-footer .feds-secondary-cta:hover {
    color: var(--s2a-color-gray-25);
    background-color:var(--s2a-color-gray-1000);
  }
}

/* =========================================
   Responsive: Large Desktop (min-width: 1280px)
   ========================================= */

@media (min-width: 1280px) {
  .feds-popup .links-card {
    padding-bottom: var(--s2a-spacing-lg);
  }
} 

/* =========================================
   Product List Container
   ========================================= */

.feds-popup .product-list {
  display: grid;
  grid-template-columns: 1fr;
  align-items: start;
  gap: var(--s2a-spacing-lg);
  padding: var(--s2a-spacing-lg);
  border-radius: var(--s2a-border-radius-md);
  width: 100%;
}

.product-list .tabs,
.product-list .tab-content,
.product-list .product-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* =========================================
   Tabs
   ========================================= */

.product-list .tabs {
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  background-color: transparent;
}

.feds-popup .product-list .tabs {
  margin-left: calc(0px - var(--s2a-spacing-lg));
  margin-right: calc(0px - var(--s2a-spacing-lg));
  padding: 0 var(--s2a-spacing-lg);
}

.product-list .tabs::-webkit-scrollbar {
  display: none;
}

.product-list .tabs li {
  list-style: none;
  flex: 0 0 auto;
}

.product-list .tabs button.tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: max-content;
  white-space: nowrap;
  min-height: 40px;
  border: 0;
  /* No token: 75px radius */
  border-radius: 75px;
  padding: var(--s2a-spacing-md) var(--s2a-spacing-lg);
  text-align: center;
  font-family: var(--feds-font-family);
  font-size: var(--s2a-font-size-sm);
  font-weight: var(--s2a-font-weight-adobe-clean-bold);
  line-height: 8px;
  color: var(--s2a-color-content-default);
  background: rgb(0 0 0 / 4%);
  cursor: pointer;
}

.product-list .tabs button.tab[aria-selected="true"] {
  background: var(--s2a-color-gray-1000);
  color: var(--s2a-color-gray-25);
}

.product-list .tabs button.tab:hover:not([aria-selected="true"]) {
  color: var(--s2a-color-gray-25);
  background-color: var(--s2a-color-content-subtle);
}

/* =========================================
   Tab Content / Tabpanels
   ========================================= */

.product-list .tab-content > li {
  list-style: none;
}

.product-list .tab-content [role="tabpanel"][hidden] {
  display: none;
}

.product-list .tab-content [role="tabpanel"] {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--s2a-spacing-2xs);
  padding: 0;
  margin: 0;
  list-style: none;
}

.product-list .tab-content [role="tabpanel"] li {
  display: flex;
}

.product-list .tab-content [role="tabpanel"] .feds-product-card {
  display: flex;
  flex-direction: column;
  min-height: 120px;
  flex: 1;
  background-color: var(--s2a-color-gray-25);
  justify-content: space-between;
  outline-offset: -1px;
}

.feds-popup .product-list .tab-content [role="tabpanel"] .feds-product-card:hover {
  background: var(--s2a-color-gray-1000);
}

.feds-popup .product-list .tab-content [role="tabpanel"] .feds-product-card:hover .feds-product-card__title {
  color: var(--s2a-color-gray-25);
}

/* =========================================
   Product Links
   ========================================= */

.product-list .product-links a {
  color: var(--s2a-color-content-default);
}

.product-list .product-links .feds-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.product-list .product-links .feds-link svg {
  width: 3px;
  height: 6px;
  flex-shrink: 0;
}

/* =========================================
   Responsive: Desktop (min-width: 1024px)
   ========================================= */

@media (min-width: 1024px) {
  .feds-popup .product-list {
    grid-template-columns: 1fr minmax(0, 3fr);
    gap: var(--s2a-spacing-xs);
    padding: 0 var(--s2a-spacing-lg) var(--s2a-spacing-lg);
  }

  .product-list .tabs {
    display: block;
    overflow: visible;
  }

  .feds-popup .product-list .tabs {
    margin: 0;
    padding: 0;
  }

  .product-list .tabs li {
    flex: unset;
  }

  .product-list .tabs button.tab {
    width: auto;
    min-height: 44px;
    margin-bottom: var(--s2a-spacing-2xs);
  }

  .product-list .tab-content [role="tabpanel"] {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--s2a-spacing-xs);
  }
}

/* =========================================
   Responsive: Very Large Desktop (min-width: 1920px)
   ========================================= */

@media (min-width: 1920px) {
  .feds-popup .product-list {
    grid-template-columns: auto minmax(0,3fr);
  }
  .feds-popup .product-list .tab-content [role="tabpanel"] {
    grid-template-columns: repeat(5, 1fr);
  }
  .feds-popup .product-list .tabs {
    margin-right: var(--s2a-spacing-4xl);
  }
}

.product-hint {
  display: none;
}

/* =========================================
   Panels Container
   ========================================= */

.global-navigation .panels {
  list-style: none;
  margin: 0 auto;
  padding: 36px clamp(var(--s2a-spacing-lg), 4vw, 56px) var(--s2a-spacing-40);
  gap: var(--s2a-spacing-xl);
  width: min(1200px, 100%);
  box-sizing: border-box;
  color: var(--s2a-color-gray-1000);
  width: 100%;
}

.panels > li {
  min-width: 0;
  /* No token: design #f6f6f6; using gray-75 */
  background-color: var(--s2a-color-gray-75);
  border-radius: var(--s2a-border-radius-md);
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.feds-popup .panels .feds-secondary-cta {
  margin-top: auto;
  margin-bottom: var(--s2a-spacing-sm);
  align-self: center;
  width: 75%;
}

.panels h4 {
  font-family: var(--feds-heading-font-family);
  font-size: var(--s2a-font-size-2xl);
  line-height: var(--s2a-font-line-height-20);
  margin-left: var(--s2a-spacing-lg);
}

/* =========================================
   Link Panel
   ========================================= */

.global-navigation.site-pivot .panels .link-panel {
  list-style: none;
  margin: 0 0 0 var(--s2a-spacing-lg);
  padding: 0;
}

.global-navigation.site-pivot .panels .link-panel + .feds-link {
  color: var(--s2a-color-gray-1000);
  margin-left: var(--s2a-spacing-lg);
  padding-left: 0;
  margin-top: auto;
}

.global-navigation.site-pivot .panels .link-panel + .feds-link::after {
  content: "";
  width: var(--s2a-spacing-2xs);
  height: var(--s2a-spacing-2xs);
  border-right: var(--s2a-border-width-md) solid var(--s2a-color-gray-1000);
  border-top: var(--s2a-border-width-md) solid var(--s2a-color-gray-1000);
  transform: translateY(8%) translateX(var(--s2a-spacing-xs)) rotate(45deg);
}

.panels .link-panel .feds-link,
.panels .panel-footer-link .feds-link {
  display: inline-flex;
  align-items: center;
  margin: 0;
  padding: var(--s2a-spacing-sm) 0;
  text-decoration: none;
  font-size: var(--s2a-font-size-sm);
  font-weight: var(--s2a-font-weight-adobe-clean-bold);
  line-height: 1.35;
  color: var(--s2a-color-gray-1000);
}

.panels .link-panel-container > .feds-secondary-cta,
.panels > li > .feds-secondary-cta {
  margin-top: var(--s2a-spacing-sm);
}

/* =========================================
   List Image Panel
   ========================================= */

.panels > li:has(> .list-image-panel) {
  background-color: var(--s2a-color-gray-1000);
  border: var(--s2a-border-width-lg) var(--s2a-color-gray-1000) solid;
}

.list-image-panel {
  display: flex;
  background-color: transparent;
  color: var(--s2a-color-gray-25);
  height: 100%;
  align-items: stretch;
  gap: var(--s2a-spacing-sm);
}

.list-image-panel .link-panel-container {
  display: flex;
  flex-direction: column;
  min-width: 250px;
}

.panels .list-image-panel .feds-link {
  color: var(--s2a-color-gray-25);
}

.panels .list-image-panel .feds-secondary-cta {
  color: var(--s2a-color-gray-25);
  margin: auto 0 var(--s2a-spacing-sm) 0;
  width: calc(100% - var(--s2a-spacing-lg));
}

.panels .list-image-panel .feds-secondary-cta:hover {
  color: var(--s2a-color-gray-1000);
}

.panels .list-image-panel li {
  border-radius: var(--s2a-border-radius-sm);
  padding: var(--s2a-spacing-sm);
}

.panels .list-image-panel li a.feds-link {
  padding: 0;
}

.panels .list-image-panel li:hover {
  background-color: var(--s2a-color-gray-25);
  position: relative;
}

.panels .list-image-panel li:hover .feds-link {
  color: var(--s2a-color-gray-1000);
}

.panels .list-image-panel li:hover .feds-link::after {
  content: "";
  position: absolute;
  right: var(--s2a-spacing-sm);
  width: var(--s2a-spacing-2xs);
  height: var(--s2a-spacing-2xs);
  border-right: var(--s2a-border-width-md) solid var(--s2a-color-gray-1000);
  border-top: var(--s2a-border-width-md) solid var(--s2a-color-gray-1000);
  transform: translateY(8%) translateX(100%) rotate(45deg);
}

.list-image-panel picture {
  display: block;
}

.list-image-panel picture img {
  display: block;
  height: 100%;
  max-height: 100%;
  width: auto;
  /* No token: 14px radius */
  border-radius: 14px;
  object-fit: cover;
}

/* =========================================
   Image Panel
   ========================================= */

.image-panel {
  position: relative;
  border-radius: var(--s2a-border-radius-md);
  overflow: hidden;
  min-height: 320px;
  isolation: isolate;
  display: grid;
}

.image-panel > picture {
  display: block;
  height: 100%;
  grid-area: 1 / 1;
}

.image-panel > picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.image-panel .overlay {
  grid-area: 1 / 1;
  display: grid;
  gap: var(--s2a-spacing-sm);
  padding: 18px 18px 20px;
  color: var(--s2a-color-gray-25);
  /* Unsure: 80% vs 64% token */
  background: linear-gradient(
    180deg,
    rgb(0 0 0 / 0%) 0%,
    var(--s2a-color-transparent-black-64) 70%
  );
  grid-template-columns: 300px auto auto;
  grid-template-rows: var(--s2a-spacing-3xl) auto 50px;
}

.image-panel .icon {
  width: 34px;
  height: 34px;
  grid: 1 / 1 / 1 / 1;
}

.image-panel .icon img {
  display: block;
  width: 100%;
  height: 100%;
}

.image-panel .text {
  display: grid;
  gap: 3px;
  grid-area: 3 / 1 / 3 / 1;
}

.image-panel .text span:first-child {
  font-size: var(--s2a-font-size-sm);
  font-weight: var(--s2a-font-weight-adobe-clean-bold);
  line-height: 1.2;
}

.image-panel .text span:last-child {
  font-family: var(--feds-heading-font-family);
  font-size: 21px;
  font-weight: var(--s2a-font-weight-adobe-clean-extrabold);
  line-height: 1.2;
}

.image-panel-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-height: 34px;
  padding: 0 14px;
  border-radius: var(--s2a-border-radius-round);
  color: var(--s2a-color-gray-1000);
  text-decoration: none;
  font-size: var(--s2a-font-size-sm);
  font-weight: var(--s2a-font-weight-adobe-clean-bold);
  background-color: var(--s2a-color-gray-25);
  backdrop-filter: blur(1px);
  grid-area: 3 / 3 / 3 / 3;
  justify-self: end;
}

/* =========================================
   Responsive: Mobile (max-width: 1023px)
   ========================================= */

@media (max-width: 1023px) {
  .panels {
    display: block !important;
    grid-template-columns: none !important;
    grid-template-rows: none !important;
    padding: 22px var(--s2a-spacing-md) 28px;
  }

  .panels > li + li {
    margin-top: 22px;
  }

  .list-image-panel {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "image"
      "list";
    row-gap: 14px;
  }
}

/* =========================================
   Featured Card
   ========================================= */

.feds-popup .featured-card {
  border-radius: 24px;
  background: var(--s2a-color-gray-25);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: var(--s2a-spacing-lg);
  justify-content: space-between;
  align-items: flex-start;
  overflow: hidden;
  height: 100%;
}

.feds-popup .featured-card .featured-eyebrow {
  /* No token: design uses custom gray; using content-subtle */
  color: var(--s2a-color-content-body-subtle);
  font-family: var(--body-font-family);
  font-size: var(--s2a-typography-font-size-label);
  font-weight: var(--s2a-font-weight-adobe-clean-bold);
  letter-spacing: var(--s2a-typography-letter-spacing-label);
  line-height: var(--s2a-typography-line-height-label);
}

.feds-popup .featured-card h2 {
  margin: 0;
  font-family: var(--feds-heading-font-family);
  font-size: var(--s2a-typography-font-size-title-4);
  line-height: var(--s2a-typography-line-height-title-4-temp);
  letter-spacing: var(--s2a-typography-letter-spacing-title-4);
  color: var(--s2a-color-content-default);
  padding: var(--s2a-spacing-md) 0 var(--s2a-spacing-xs) 0;
  font-weight: var(--s2a-font-weight-adobe-clean-black);
}

.featured-card .featured-subtitle {
  font-size: var(--s2a-font-size-sm);
  line-height: 120%;
  color: var(--s2a-color-content-subtle);
}

.featured-card .feds-link {
  padding: var(--s2a-spacing-md) 0;
  color: var(--s2a-color-gray-1000);
  display: inline-flex;
  gap: 6px;
}

.featured-card span {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
}

.featured-card span svg {
  margin-top: 2px;
  color: var(--s2a-color-gray-1000);
  width: 3px;
  height: 8px;
}

.featured-card a.feds-secondary-cta {
  background: var(--s2a-color-gray-1000);
  color: var(--s2a-color-gray-25);
}

/* =========================================
   Featured Card Footer
   ========================================= */

.featured-card .footer-container {
  width: 100%;
}

.featured-card .footer-container a {
  width: 100%;
  box-sizing: border-box;
}

.featured-card .footer-container a.feds-secondary-cta:hover {
  background: var(--s2a-color-gray-1000);
}

/* =========================================
   Responsive: Desktop (min-width: 1024px)
   ========================================= */

@media (min-width: 1024px) {
  .feds-popup .featured-card {
    border-radius: 12px;
  }

  .featured-card a.feds-secondary-cta {
    background: transparent;
    color: var(--s2a-color-gray-1000);
    border: var(--s2a-border-width-sm) solid var(--s2a-color-gray-1000);
  }

  .feds-popup .feds-gnav-cards:has(.featured-card) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    flex-wrap: unset;
    overflow-x: unset;
  }
}

/* =========================================
   Responsive: Large Desktop (min-width: 1280px)
   ========================================= */

@media (min-width: 1280px) {
  .feds-popup .feds-gnav-cards:has(.featured-card) {
    grid-template-columns: repeat(5, 1fr);
  }

  .feds-popup .featured-card {
    min-height: 307px;
  }
}

/* =========================================
   Hover: Desktop with pointer device only
   ========================================= */

@media (min-width: 1024px) and (hover: hover) {
  .featured-card a.feds-secondary-cta {
    transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }

  .featured-card a.feds-secondary-cta:hover {
    background: var(--s2a-color-gray-1000);
    color: var(--s2a-color-gray-25);
    border-color: var(--s2a-color-gray-25);
  }
}
`);document.adoptedStyleSheets=[...document.adoptedStyleSheets,gn];var Co=async e=>{let{gnavSource:n,mountpoint:a,unavEnabled:r,miloConfig:t,personalization:i}=e;if(!(n instanceof URL))throw S(`gnavSource is invalid: ${n}`),new c("gnavSource needs to be a URL object");try{pe(t)}catch(v){throw S(`Failed to initialize MiloConfig: ${v}`),new c(`Failed to initialize MiloConfig: ${v}`)}Te(i),Se(e.localizeLink??(v=>v)),Ce(we(e));let o=await cn(e);if(o instanceof c)throw S(o.message),o;let{mainNav:s,aside:l}=o;if(s instanceof c)throw S(s.message),s;let d=sn(s,r,await j());if(d instanceof c)throw S(d.message),d;return await Qn(d)(a),na(e)},Qn=e=>async n=>{let a=ea(e);document.querySelector("main")?.setAttribute("id","main-content"),n.innerHTML=a,n.classList.add("site-pivot"),n.querySelector("nav")?.showPopover();let r=[...n.querySelectorAll(".mega-menu ~ .feds-popup")];r.forEach(s=>{s.innerHTML=""});let i=e.components.filter(s=>s.type==="MegaMenu").map(s=>s.content),o=await Promise.all(i.map(async(s,l)=>{try{let[d,v]=await s;return r[l].innerHTML=nn(d,r[l].id),v}catch(d){return[d]}}).flat());return n},ea=({components:e,productCTA:n,unavEnabled:a,placeholders:r})=>`
<nav popover="manual" data-lenis-prevent>
  <a href="#main-content" class="feds-skip-link">${r.get("skip-to-main")??"Skip to main content"}</a>
  <ul role="presentation">
    ${(()=>{let t=e.find(d=>d.type==="Brand")??null,i=e.filter(d=>d.type!=="Brand"),o=`
        <button
          class="feds-nav-toggle"
          type="button"
          aria-label="Navigation menu"
          daa-ll="hamburgermenu|open"
          aria-expanded="false"
          aria-controls="feds-menu-wrapper"
          popovertarget="feds-menu-wrapper"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 7" fill="currentColor" aria-hidden="true">
            <path d="M13.25 5.5H0.75C0.33594 5.5 0 5.83594 0 6.25C0 6.66406 0.33594 7 0.75 7H13.25C13.6641 7 14 6.66406 14 6.25C14 5.83594 13.6641 5.5 13.25 5.5Z"/>
            <path d="M0.75 1.5H13.25C13.6641 1.5 14 1.16406 14 0.75C14 0.33594 13.6641 0 13.25 0H0.75C0.33594 0 0 0.33594 0 0.75C0 1.16406 0.33594 1.5 0.75 1.5Z"/>
          </svg>
        </button>
      `.trim(),s=t?xe(t):"",l=Pe(i,xe);return`
        <li class="feds-brand-wrapper">
          ${s}
          ${o}
        </li>
        <li
          id="feds-menu-wrapper"
          popover
          class="feds-menu-wrapper"
        >
          <ul class="feds-gnav-items">
            ${l}
          </ul>
        </li>
      `.trim()})()}
  </ul>
  ${n===null?"":Be(n)}
  ${a?'<div class="feds-utilities"></div>':""}
  <a href="#" class="trap-focus-gnav">.</a>
</nav>
`,na=async e=>{let n=new Set,a=await te(e.mountpoint);a instanceof g?(n.add(a),S(a.message)):a.errors.forEach(o=>n.add(o)),ln(e.mountpoint),he(e.mountpoint),aa(e.mountpoint),ra(e.mountpoint),ta(e.mountpoint),ia(e.mountpoint),sa(e.mountpoint,e.mepMartech??"");let r=()=>{document.querySelector("nav[popover]")?.removeAttribute("popover"),W(e.mountpoint)};document.querySelector(".dialog-modal")&&r(),document.addEventListener("click",o=>{o.target instanceof Element&&o.target.closest('a[href*="#openPrivacy"]')&&r()}),Re(e.mountpoint),window.addEventListener("milo:modal:loaded",r),window.addEventListener("milo:modal:closed",()=>{let o=document.querySelector("nav");o?.setAttribute("popover","manual"),o?.showPopover?.()}),(await pn(e.mountpoint)).forEach(o=>{n.add(o),S(o.message)});let i=a instanceof g?()=>{}:a.reloadUnav;return{closeEverything:oa,reloadUnav:i,errors:n,setGnavTopPosition:o=>{},getGnavTopPosition:()=>0}},aa=e=>{let n=e.querySelector("#feds-menu-wrapper"),a=e.querySelector(".feds-nav-toggle");n?.addEventListener("toggle",()=>{let t=n.matches(":popover-open");a?.setAttribute("aria-expanded",String(t)),a?.setAttribute("daa-ll",t?"hamburgermenu|close":"hamburgermenu|open"),t&&n.classList.add("feds-menu-active")}),n?.addEventListener("transitionend",()=>{n.matches(":popover-open")||n.classList.remove("feds-menu-active")}),e.querySelectorAll(".feds-popup[popover]").forEach(t=>{t.addEventListener("toggle",()=>{let i=e.querySelector(`[popovertarget="${t.id}"]`),o=t.matches(":popover-open");i?.setAttribute("aria-expanded",String(o)),i?.setAttribute("daa-ll",o?"header|Close":"header|Open")})})},ra=e=>{E.addEventListener("change",()=>{W(e)})},ta=e=>{[...e.querySelector(".feds-utilities #universal-nav")?.children??[]].forEach(n=>{n.addEventListener("click",()=>W(e)),n.addEventListener("keydown",a=>{a.key==="Enter"&&W(e)})})};var oa=()=>{},ia=e=>{let n=e.closest("header");if(!n)return;let a=e.querySelector("#feds-menu-wrapper"),r=()=>a?.matches(":popover-open")??!1,t=()=>window.scrollY>20,i=()=>{if(r()){n.classList.remove("feds-header-scrolled");return}if(t()){n.classList.add("feds-header-scrolled");return}n.classList.remove("feds-header-scrolled")};i(),window.addEventListener("scroll",i,{passive:!0}),a?.addEventListener("toggle",i)},sa=(e,n)=>{let a=e.closest("header");a!==null&&a.setAttribute("daa-lh",`gnav|${$e()}${n}`)};export{Co as main,na as postRenderingTasks,Qn as renderGnav,ea as renderGnavString};
//# sourceMappingURL=main.js.map
