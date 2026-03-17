var yn=async n=>{let{placeholders:e}=n,{locale:r}=C(),a=`${Z()}${r.prefix}/federal/globalnav/placeholders.json`,[o,i]=await Promise.all([e,de(a)]);return new Map([...i,...o])},de=async n=>{try{let e=await fetch(n);if(!e.ok)throw new f(`Federal placeholders not found at ${n}`);let r=ce(await e.json());if(r instanceof f)throw r;return new Map(r.data.map(({key:t,value:a})=>[t,a]))}catch(e){if(e instanceof f)console.error(e.message);else{let r=new f(e.message);console.error(r.message)}return L(`Failed to fetch placeholders from ${n}`),new Map([])}},ce=n=>{try{let{data:e}=n;if(!e.every(({key:t,value:a})=>typeof t=="string"&&typeof a=="string"))throw new Error("data is not valid");return n}catch(e){return new f(e.message)}};function xn(n,e){let r=/{{(.*?)}}|%7B%7B(.*?)%7D%7D/g;return r.test(n)?n.replace(r,(a,o,i)=>{let s=o??i??"";return e.get(s)??s}):n}var[wn,kn]=(()=>{let n;return[e=>{n||(n=e)},()=>{if(!n)throw new Error("Placeholders not initialized. Call setPlaceholders() first.");return n}]})();var A=window.matchMedia("(min-width: 1024px)"),$={brand:'<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" id="Layer_1" viewBox="0 0 64.57 35"><defs><style>.cls-1{fill: #eb1000;}</style></defs><path class="cls-1" d="M6.27,10.22h4.39l6.2,14.94h-4.64l-3.92-9.92-2.59,6.51h3.08l1.23,3.41H0l6.27-14.94ZM22.03,13.32c.45,0,.94.04,1.43.16v-3.7h3.88v14.72c-.89.4-2.81.89-4.73.89-3.48,0-6.47-1.98-6.47-5.93s2.88-6.13,5.89-6.13ZM22.52,22.19c.36,0,.65-.07.94-.16v-5.42c-.29-.11-.58-.16-.96-.16-1.27,0-2.45.94-2.45,2.92s1.2,2.81,2.47,2.81ZM34.25,13.32c3.23,0,5.98,2.18,5.98,6.02s-2.74,6.02-5.98,6.02-6-2.18-6-6.02,2.72-6.02,6-6.02ZM34.25,22.13c1.11,0,2.14-.89,2.14-2.79s-1.03-2.79-2.14-2.79-2.12.89-2.12,2.79.96,2.79,2.12,2.79ZM41.16,9.78h3.9v3.7c.47-.09.96-.16,1.45-.16,3.03,0,5.84,1.98,5.84,5.86,0,4.1-2.99,6.18-6.53,6.18-1.52,0-3.46-.31-4.66-.87v-14.72ZM45.91,22.17c1.34,0,2.56-.96,2.56-2.94,0-1.85-1.2-2.72-2.5-2.72-.36,0-.65.04-.91.16v5.35c.22.09.51.16.85.16ZM58.97,13.32c2.92,0,5.6,1.87,5.6,5.64,0,.51-.02,1-.09,1.49h-7.27c.4,1.32,1.56,1.94,3.01,1.94,1.18,0,2.27-.29,3.5-.82v2.97c-1.14.58-2.5.82-3.9.82-3.7,0-6.58-2.23-6.58-6.02s2.61-6.02,5.73-6.02ZM60.93,18.02c-.2-1.27-1.05-1.78-1.92-1.78s-1.58.54-1.87,1.78h3.79Z"/></svg>',company:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 22" fill="none"><path d="M14.2353 21.6209L12.4925 16.7699H8.11657L11.7945 7.51237L17.3741 21.6209H24L15.1548 0.379395H8.90929L0 21.6209H14.2353Z" fill="#EB1000"/></svg>',search:'<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false"><path d="M14 2A8 8 0 0 0 7.4 14.5L2.4 19.4a1.5 1.5 0 0 0 2.1 2.1L9.5 16.6A8 8 0 1 0 14 2Zm0 14.1A6.1 6.1 0 1 1 20.1 10 6.1 6.1 0 0 1 14 16.1Z"></path></svg>',home:'<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="25" viewBox="0 0 18 18" width="25"><path fill="#6E6E6E" d="M17.666,10.125,9.375,1.834a.53151.53151,0,0,0-.75,0L.334,10.125a.53051.53051,0,0,0,0,.75l.979.9785A.5.5,0,0,0,1.6665,12H2v4.5a.5.5,0,0,0,.5.5h4a.5.5,0,0,0,.5-.5v-5a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5v5a.5.5,0,0,0,.5.5h4a.5.5,0,0,0,.5-.5V12h.3335a.5.5,0,0,0,.3535-.1465l.979-.9785A.53051.53051,0,0,0,17.666,10.125Z"/></svg>',chevronLeft:'<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" focusable="false"><path d="M12.5 4l-5 6 5 6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',chevronRight:'<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="3" height="6" viewBox="0 0 3 6" focusable="false"><path d="M.5.5 2.5 3 .5 5.5" stroke="currentColor" stroke-width="1" fill="none"/></svg>',chevronDown:'<svg class="chevron-down" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="6" height="3.375" viewBox="0 0 6 3.375" focusable="false"><path d="M.5.5 3 2.875 5.5.5" stroke="currentColor" stroke-width="1" fill="none"/></svg>'},pe=["/tools/ost?","/miniplans"],Cn=n=>pe.some(e=>n.includes(e));var Ln=n=>{let e=[],r=n.nextElementSibling??null;for(;r!==null;)e.push(r),r=r.nextElementSibling??null;return e},G=n=>({eval:n,or:e=>G(r=>{try{return n(r)}catch{return e(r)}})}),M=(n,e)=>n.reduce(([r,t],a)=>{try{let[o,i]=e(a);return[[...r,o],[...t,...i]]}catch(o){return o instanceof c?[r,[o,...t]]:[r,t]}},[[],[]]),[En,ge]=(()=>{let n,e=!1;return[r=>{e||(n=r,e=!0)},()=>{if(!n)throw new Error("PersonalizationConfig not initialized. Call setPersonalizationConfig() first.");return n}]})(),[Tn,Mn]=(()=>{let n=e=>e;return[e=>{n=e},()=>n]})(),E=n=>{try{return Mn()(n)}catch{return n}},D=async n=>{try{if(n===null)return new c("URL is null");let e=`${n.origin}${n.pathname.replace(/(\.html$|$)/,".plain.html")}${n.hash}`,r=Mn()(e),t=H(r),a=await fetch(t);if(!a.ok)return L(`Request for ${t} failed`),new c(`Request for ${t} failed`);let o=await a.text(),i=await kn(),s=xn(o,i),{body:l}=new DOMParser().parseFromString(s,"text/html");try{let{handleCommands:d,commands:m}=ge();d(m,l)}catch(d){L(`Personalization not applied: ${d?.message}`)}return l}catch(e){return new c(e?.message)}},z,Z=()=>{if(z)return z;let n=["https://www.adobe.com","https://business.adobe.com","https://blog.adobe.com","https://milo.adobe.com","https://news.adobe.com","graybox.adobe.com"];if(z)return z;let e=window.location.origin;z=n.some(a=>{let o=e.replace(".stage","");return a.startsWith("https://")?o===a:o.endsWith(a)})?e:"https://www.adobe.com";let t=window.location.hostname.includes(".aem.")?"aem":"hlx";return(e.includes("localhost")||e.includes(`.${t}.`))&&(z=`https://main--federal--adobecom.aem.${e.endsWith(".live")?"live":"page"}`),z},H=(n="")=>{if(n.includes("c2-poc--milo--adobecom"))return n.replace("c2-poc--milo--adobecom","main--federal--adobecom");if(n.includes("c2-poc-feds-gnav--milo--adobecom"))return n.replace("c2-poc-feds-gnav--milo--adobecom","main--federal--adobecom");if(n.includes("localhost:3000"))return n.replace("localhost:3000","main--federal--adobecom.aem.page");if(typeof n!="string"||!n.includes("/federal/"))return n;if(n.startsWith("/"))return`${Z()}${n}`;try{let{pathname:e,search:r,hash:t}=new URL(n);return`${Z()}${e}${r}${t}`}catch(e){let r=e instanceof Error?e.message:String(e);console.warn(`getFederatedUrl errored parsing the URL: ${n}: ${r}`)}return n},Sn=(n,e)=>{let r=(t,a)=>{let o=`${t}[${a}^="./media_"]`;e.querySelectorAll(o).forEach(s=>{let l=s.getAttribute(a);if(!(l===null||l===""))try{let d=H(new URL(l,new URL(n,window.location.href)).href);s.setAttribute(a,d)}catch(d){console.warn(`[MediaPathError]: Failed to process relative media path (${l}) for ${t}`,d)}})};r("img","src"),r("source","srcset")},Pn=async n=>{let e=async(r,t)=>{if(r instanceof c)return r;try{let o=[...r.querySelectorAll('a[href*="#_inline"]')].map(async i=>{try{if(t.has(i.href))return;let s=H(i.href),l=new URL(s),d=await D(l);if(t.add(i.href),d instanceof c)throw d;await e(d,t),i.replaceWith(...d.children);return}catch{return}},[]);return await Promise.all(o),r}catch(a){return new c(JSON.stringify(a))}};return e(n,new Set)},An=(n,e)=>n.map((r,t)=>`<li>${e(r,t)}</li>`).join(""),X=n=>{let e=n.normalize("NFKC").toLocaleLowerCase().trim().replace(/[^\p{L}\p{N}\p{M}]+/gu,"-").replace(/^-+|-+$/g,"");return e===""?"id":/^\p{N}/u.test(e)?`id-${e}`:e},k=(n,e)=>{let r=n!==null&&n!==""?` daa-lh="${n}"`:"",t=e!==null&&e!==""?` daa-ll="${e}"`:"";return`${r}${t}`};function fe(n,{id:e,as:r,callback:t,crossorigin:a,rel:o,fetchpriority:i}={rel:"stylesheet"}){let s=document.head.querySelector(`link[href="${n}"]`);if(s)return t?.("noop"),s;let l=document.createElement("link");return l.setAttribute("rel",o),e!==void 0&&l.setAttribute("id",e),r!==void 0&&l.setAttribute("as",r),a!==void 0&&l.setAttribute("crossorigin",a),i!==void 0&&l.setAttribute("fetchpriority",i),l.setAttribute("href",n),t&&(l.onload=d=>t(d.type),l.onerror=d=>t(typeof d=="string"?"error":d.type)),document.head.appendChild(l),l}function ue(n,e){return fe(n,{rel:"stylesheet",callback:e})}function on(n,e=!1){e&&ue(n)}var sn=(n,e,{mode:r,id:t}={})=>new Promise((a,o)=>{let i=document.querySelector(`head > script[src="${n}"]`);if(!i){let{head:d}=document;i=document.createElement("script"),i.setAttribute("src",n),t!=null&&i.setAttribute("id",t),e!=null&&i.setAttribute("type",e),r&&["async","defer"].includes(r)&&i.setAttribute(r,""),d.append(i)}let s=i.dataset.loaded;if(s!=null){a(i);return}let l=d=>{i.removeEventListener("load",l),i.removeEventListener("error",l),d.type==="error"?o(new Error(`error loading script: ${i.src}`)):d.type==="load"&&(i.dataset.loaded="true",a(i))};i.addEventListener("load",l),i.addEventListener("error",l)});function N(n,e=document){let r=n&&n.includes(":")?"property":"name";return e.head.querySelector(`meta[${r}="${n}"]`)?.content??null}var me=n=>{let e=n,r=o=>o==null||typeof o!="object";if(r(e)||r(e.locale)||typeof e.locale.prefix!="string"||r(e.env)||typeof e.env.name!="string")return!1;if(e.unav!==void 0){if(typeof e.unav!="object"||e.unav===null)return!1;let o=e.unav;if(o.profile!==void 0){if(typeof o.profile!="object"||o.profile===null)return!1;let i=o.profile;if(i.signInCtaStyle!==void 0&&i.signInCtaStyle!=="primary"&&i.signInCtaStyle!=="secondary"||i.messageEventListener!==void 0&&typeof i.messageEventListener!="function")return!1}}return!(e.jarvis!==void 0&&(typeof e.jarvis!="object"||e.jarvis===null||typeof e.jarvis.id!="string"))},[ln,C]=(()=>{let n,e=!1;return[r=>{if(!e){if(!me(r))throw new Error("MiloConfig validation failed: Invalid structure");n=r,e=!0}},()=>{if(!n)throw new Error("MiloConfig not initialized. Call setMiloConfig() first.");return n}]})(),ve={en:"US","en-gb":"GB","es-mx":"MX","fr-ca":"CA",da:"DK",et:"EE",ar:"DZ",el:"GR",iw:"IL",he:"IL",id:"ID",ms:"MY",nb:"NO",sl:"SI",sv:"SE",cs:"CZ",uk:"UA",hi:"IN","zh-hans":"CN","zh-hant":"TW",ja:"JP",ko:"KR",fil:"PH",th:"TH",vi:"VN"},_n={ar:"AR_es",be_en:"BE_en",be_fr:"BE_fr",be_nl:"BE_nl",br:"BR_pt",ca:"CA_en",ch_de:"CH_de",ch_fr:"CH_fr",ch_it:"CH_it",cl:"CL_es",co:"CO_es",la:"DO_es",mx:"MX_es",pe:"PE_es",africa:"MU_en",dk:"DK_da",de:"DE_de",ee:"EE_et",eg_ar:"EG_ar",eg_en:"EG_en",es:"ES_es",fr:"FR_fr",gr_el:"GR_el",gr_en:"GR_en",ie:"IE_en",il_he:"IL_iw",it:"IT_it",lv:"LV_lv",lt:"LT_lt",lu_de:"LU_de",lu_en:"LU_en",lu_fr:"LU_fr",my_en:"MY_en",my_ms:"MY_ms",hu:"HU_hu",mt:"MT_en",mena_en:"DZ_en",mena_ar:"DZ_ar",nl:"NL_nl",no:"NO_nb",pl:"PL_pl",pt:"PT_pt",ro:"RO_ro",si:"SI_sl",sk:"SK_sk",fi:"FI_fi",se:"SE_sv",tr:"TR_tr",uk:"GB_en",at:"AT_de",cz:"CZ_cs",bg:"BG_bg",ru:"RU_ru",ua:"UA_uk",au:"AU_en",in_en:"IN_en",in_hi:"IN_hi",id_en:"ID_en",id_id:"ID_id",nz:"NZ_en",sa_ar:"SA_ar",sa_en:"SA_en",sg:"SG_en",cn:"CN_zh-Hans",tw:"TW_zh-Hant",hk_zh:"HK_zh-hant",jp:"JP_ja",kr:"KR_ko",za:"ZA_en",ng:"NG_en",cr:"CR_es",ec:"EC_es",pr:"US_es",gt:"GT_es",cis_en:"TM_en",cis_ru:"TM_ru",sea:"SG_en",th_en:"TH_en",th_th:"TH_th"};function he(n){let e=ve[n];return!e&&_n[n]&&(e=n),!e&&n.includes("-")&&([e]=n.split("-")),e||"US"}var an="langstore/";function In(n){let r=(n?.prefix||"US_en").replace("/","")??"",[t="US",a="en"]=(_n[r]??r).split("_",2);if(r.startsWith(an)||window.location.pathname.startsWith(`/${an}`)){let o=r.replace(an,"").toLowerCase();t=he(o),a=o}return t=t.toUpperCase(),a=a.toLowerCase(),{language:a,country:t,locale:`${a}_${t}`}}var K=n=>{let e=n.querySelector("#feds-menu-wrapper");e?.classList.remove("feds-menu-active"),e?.hidePopover?.(),n.querySelector(".feds-popup:popover-open")?.hidePopover?.()};function $n(){let n=N("gnav-source")?.split("#")[0]?.split("/").pop()?.trim();if(n!==void 0&&n!==""&&n!=="gnav")return n;let e=window.adobeid?.client_id;return typeof e=="string"&&e!==""?e:""}var V={elementNull:"Error when parsing Link. Element is null",notAnchor:"Cannot parse non-anchor as Link",textContentNotFound:"Error when parsing Link. Element has no textContent",hrefNotFound:"Element has no href"},T=n=>{if(n===null)throw new c(V.elementNull);if(n.tagName!=="A")throw new c(V.notAnchor);let[e,r]=n?.textContent?.split("|").map(o=>o.trim())??["",""];if(e==="")throw new c(V.textContentNotFound);let t=n?.getAttribute("href")??"";if(t==="")throw new c(V.hrefNotFound);let a=n.getAttribute("daa-ll");return[{type:"Link",text:e,href:t,daaLl:a,ariaLabel:r},[]]};var dn=n=>{if(!n)throw new c(S.elementNull);if(!n.classList.contains("product-card"))throw new c(S.notAProductCard);return G(ye).or(be).or(xe).eval(n)},S={elementNull:"Element not found",noTitleAnchor:"Title anchor not found",noHref:"Title Anchor has no href",noTitle:"Title text not found",noSubtitleP:"Subtitle <p> not found",noSubtitle:"Subtitle text not found",notAHeader:"Expected a Header class",notAProductCard:"Expected a product-card class"},be=n=>{let e=new Set;if(!n)throw new c(S.elementNull);let r=n.querySelector("p a")??n.querySelector("div ~ div > a");if(!r)throw new c(S.noTitleAnchor);let t=r.textContent??"";t===""&&e.add(new f(S.noTitle));let a=r.getAttribute("href")??"";a===""&&e.add(new f(S.noHref));let o=r.getAttribute("daa-ll"),i=r.getAttribute("daa-lh"),s=r?.closest("p")?.nextElementSibling;s||e.add(new f(S.noSubtitleP));let l=s?.textContent??"";l===""&&e.add(new f(S.noSubtitle));let d=n.querySelectorAll(":scope > div:nth-child(2) > :first-child p")??[],m=Array.from(d).map(p=>{let u=p.querySelector("strong")!==null;return{text:p?.textContent?.trim()??"",isFilled:u}}),[b,g=null]=(n.firstElementChild?.firstElementChild?.textContent?.split("|")??[]).map(p=>p.trim());return[{type:"ProductCardLink",iconHref:b,iconAlt:g,title:t,href:a,subtitle:l,badges:m,daaLl:o,daaLh:i},[...e]]},ye=n=>{if(!n)throw new c(S.elementNull);let e=[...n.classList];if(!e.includes("header"))throw new c(S.notAHeader);let r=n.querySelector("a")?.textContent??"",t=n.querySelector("a")?.getAttribute("daa-ll")??null,a=n.querySelector("a")?.getAttribute("daa-lh")??null;if(r==="")throw new c(S.noTitle);return[{type:"ProductCardHeader",title:r,classes:e,daaLl:t,daaLh:a},[]]},xe=n=>{if(!n)throw new c(S.elementNull);if(!n.classList.contains("blue"))throw new Error("Not a Blue Product Card");let e=n.querySelector("a"),[r,t]=T(e),a=e?.getAttribute("daa-ll")??null,o=e?.getAttribute("daa-lh")??null;return[{type:"ProductCardBlue",link:r,daaLl:a,daaLh:o},t]};var cn=n=>{switch(n.type){case"ProductCardHeader":return we(n);case"ProductCardLink":return ke(n);case"ProductCardBlue":return Ce(n);default:return console.error(n),""}},we=({title:n,classes:e,daaLl:r,daaLh:t})=>{let a=e.slice(1).map(i=>`feds-product-card--${i}`).join(" "),o=k(t,r??n);return`
    <div role="heading" class="feds-product-card ${a}"${o}>
      <div class="feds-product-card__content">
        <div class="feds-product-card__title">${n}</div>
      </div>
    </div>
  `},ke=({iconHref:n,iconAlt:e,title:r,href:t,subtitle:a,badges:o=[],daaLl:i,daaLh:s})=>{let l=e!==null&&n!==null,d=k(s,i??r),m=l?`
      <picture class="feds-product-card__icon">
        <img
          loading="lazy"
          src="${n}"
          alt="${e}"
          class="feds-product-card__icon-img"
        >
      </picture>
    `:"",b=o.length===0?"":`
      <div class="feds-product-card__badges">
        ${o.map(({text:p,isFilled:u})=>`
          <span class="feds-product-card__badge${u?" feds-product-card__badge--filled":""}">
            ${p}
          </span>
        `).join("")}
      </div>
    `,g=a===""?"":`<div class="feds-product-card__subtitle">${a}</div>`;return`
    <a class="feds-product-card" href="${E(t)}"${d}>
      <div class="feds-product-card-header">
        ${m}
        ${b}
      </div>
      <div class="feds-product-card__content">
       
        <div class="feds-product-card__title">${r}</div>
        ${g}
      </div>
    </a>
  `},Ce=({link:n,daaLl:e,daaLh:r})=>{let t=k(r,e??n.text);return`
  <a href="${E(n.href)}" class="feds-product-card feds-product-card--blue"${t}>
    <div class="feds-product-card__content">
        <div class="feds-product-card__title">${n.text}</div>
      </div>
  </a>
`};var B={elementNull:"Error when parsing Brand. Element is null",noLinkSection:"Error when parsing Brand. No link section found",noLink:"Error when parsing Brand. No link found",noImageSection:"Error when parsing Brand. No image section found",missingImageSections:"Error when parsing Brand. Missing mobile or desktop image section",missingThemeImages:"Error when parsing Brand. Missing mobile or desktop image section"},pn=n=>{let e=new Set;if(n===null)throw new c(B.elementNull);let r=!!n.classList.contains("dark-bg"),[t,a]=n.querySelectorAll(":scope > div");if(t===void 0)throw new c(B.noLinkSection);let o=t.querySelector("a");if(o===null)throw new c(B.noLink);let i=o.getAttribute("href")??"",s=o.textContent?.trim()??"";a===void 0&&e.add(new f(B.noImageSection));let[l,d]=a?.querySelectorAll(":scope > div")??[];(l===void 0||d===void 0)&&e.add(new f(B.missingImageSections));let m=l?.querySelectorAll('a[href$=".svg"]'),b=d?.querySelectorAll('a[href$=".svg"]'),g=m?.[0]?.getAttribute("href")??"",p=m?.[0]?.textContent?.split("|")[1]?.trim()??"",u=m?.[1]?.getAttribute("href")??"",v=m?.[1]?.textContent?.split("|")[1]?.trim()??"",y=b?.[0]?.getAttribute("href")??"",h=b?.[0]?.textContent?.split("|")[1]?.trim()??"",x=b?.[1]?.getAttribute("href")??"",w=b?.[1]?.textContent?.split("|")[1]?.trim()??"";return(!g||!y||!u||!x)&&e.add(new f(B.missingThemeImages)),[{type:"Brand",data:{href:i,label:s,isDarkBg:r,imageData:{type:"svg",lightThemeImageSrc:y,lightThemeImageAlt:h,darkThemeImageSrc:x,darkThemeImageAlt:w,mobileLightThemeImageSrc:g,mobileLightThemeImageAlt:p,mobileDarkThemeImageSrc:u,mobileDarkThemeImageAlt:v}}},[...e]]};var Le=`
<?xml
version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64.57 35" fill="currentColor">
    <path d="M6.27,10.22h4.39l6.2,14.94h-4.64l-3.92-9.92-2.59,6.51h3.08l1.23,3.41H0l6.27-14.94ZM22.03,13.32c.45,0,.94.04,1.43.16v-3.7h3.88v14.72c-.89.4-2.81.89-4.73.89-3.48,0-6.47-1.98-6.47-5.93s2.88-6.13,5.89-6.13ZM22.52,22.19c.36,0,.65-.07.94-.16v-5.42c-.29-.11-.58-.16-.96-.16-1.27,0-2.45.94-2.45,2.92s1.2,2.81,2.47,2.81ZM34.25,13.32c3.23,0,5.98,2.18,5.98,6.02s-2.74,6.02-5.98,6.02-6-2.18-6-6.02,2.72-6.02,6-6.02ZM34.25,22.13c1.11,0,2.14-.89,2.14-2.79s-1.03-2.79-2.14-2.79-2.12.89-2.12,2.79.96,2.79,2.12,2.79ZM41.16,9.78h3.9v3.7c.47-.09.96-.16,1.45-.16,3.03,0,5.84,1.98,5.84,5.86,0,4.1-2.99,6.18-6.53,6.18-1.52,0-3.46-.31-4.66-.87v-14.72ZM45.91,22.17c1.34,0,2.56-.96,2.56-2.94,0-1.85-1.2-2.72-2.5-2.72-.36,0-.65.04-.91.16v5.35c.22.09.51.16.85.16ZM58.97,13.32c2.92,0,5.6,1.87,5.6,5.64,0,.51-.02,1-.09,1.49h-7.27c.4,1.32,1.56,1.94,3.01,1.94,1.18,0,2.27-.29,3.5-.82v2.97c-1.14.58-2.5.82-3.9.82-3.7,0-6.58-2.23-6.58-6.02s2.61-6.02,5.73-6.02ZM60.93,18.02c-.2-1.27-1.05-1.78-1.92-1.78s-1.58.54-1.87,1.78h3.79Z"/>
</svg>
`.trim(),Ee=`
<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 18 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path id="Logo" d="M17.5512 15.9999H13.8827C13.7233 16.0027 13.5666 15.9587 13.4326 15.8735C13.2987 15.7882 13.1934 15.6656 13.1303 15.5211L9.1476 6.3291C9.1372 6.29332 9.11539 6.26179 9.08542 6.23919C9.05545 6.2166 9.0189 6.20413 8.98118 6.20365C8.94347 6.20316 8.9066 6.21469 8.87605 6.2365C8.84549 6.25832 8.82286 6.28928 8.81152 6.32478L6.32954 12.161C6.31607 12.1925 6.31072 12.2269 6.31397 12.261C6.31721 12.2951 6.32896 12.3279 6.34815 12.3565C6.36735 12.385 6.39339 12.4084 6.42398 12.4246C6.45456 12.4408 6.48872 12.4493 6.52343 12.4493H9.25162C9.33426 12.4493 9.41508 12.4733 9.48398 12.5183C9.55288 12.5634 9.60681 12.6275 9.63905 12.7026L10.8335 15.3264C10.8652 15.4 10.8778 15.4802 10.8704 15.5599C10.863 15.6395 10.8357 15.7161 10.791 15.7828C10.7463 15.8495 10.6856 15.9042 10.6142 15.9421C10.5429 15.98 10.4631 15.9998 10.3821 15.9999H0.450101C0.375399 15.9994 0.301967 15.9808 0.236351 15.9455C0.170735 15.9103 0.114973 15.8595 0.0740362 15.7979C0.0330997 15.7362 0.00826021 15.6655 0.00173221 15.592C-0.00479579 15.5185 0.00719033 15.4446 0.0366223 15.3769L6.35412 0.526466C6.41869 0.369291 6.52976 0.234984 6.67284 0.141079C6.81593 0.0471732 6.98437 -0.00196688 7.15618 7.38373e-05H10.7999C10.9718 -0.00217252 11.1403 0.0468839 11.2835 0.140814C11.4266 0.234745 11.5377 0.369168 11.6021 0.526466L17.9633 15.3769C17.9927 15.4445 18.0048 15.5183 17.9983 15.5917C17.9919 15.665 17.9672 15.7357 17.9264 15.7973C17.8856 15.859 17.83 15.9097 17.7646 15.9451C17.6991 15.9804 17.6258 15.9992 17.5512 15.9999V15.9999Z" />
</svg>
`.trim(),Te=n=>{let{href:e,label:r,isDarkBg:t,imageData:a}=n,o=a.lightThemeImageSrc?.trim()||a.darkThemeImageSrc?.trim()||"",i=a.darkThemeImageSrc?.trim()||a.lightThemeImageSrc?.trim()||"",s=a.mobileLightThemeImageSrc?.trim()||a.mobileDarkThemeImageSrc?.trim()||"",l=a.mobileDarkThemeImageSrc?.trim()||a.mobileLightThemeImageSrc?.trim()||"",d=a.lightThemeImageAlt||a.darkThemeImageAlt||"",m=a.darkThemeImageAlt||a.lightThemeImageAlt||"",b=a.mobileLightThemeImageAlt||a.mobileDarkThemeImageAlt||"",g=a.mobileDarkThemeImageAlt||a.mobileLightThemeImageAlt||"",p=!!o,u=!!i,v=!!s,y=!!l,h=p?`<img src="${H(o)}" alt="${d}" />`:"",x=u?`<img src="${H(i)}" alt="${m}" />`:"",w=v?`<img src="${H(s)}" alt="${b}" />`:"",U=y?`<img src="${H(l)}" alt="${g}" />`:"";return`<div class="feds-brand-container${t?" feds-dark-bg":""}">
    <a href="${e}" class="feds-brand" daa-ll="Brand" aria-label="${r}">
      <span class="feds-brand-image desktop-brand">
        ${h}
        ${x}
        ${p&&u?"":Le}
      </span>
      <span class="feds-brand-image mobile-brand">
        ${w}
        ${U}
        ${v&&y?"":Ee}
      </span>
    </a>
  </div>`.trim()},gn=n=>{let{data:e}=n;return Te(e)};var fn=["appswitcher","help"],Y={cs:["cz"],da:["dk"],de:["at"],en:["africa","au","ca","ie","in","mt","ng","nz","sg","za"],es:["ar","cl","co","cr","ec","gt","la","mx","pe","pr"],et:["ee"],ja:["jp"],ko:["kr"],nb:["no"],pt:["br"],sl:["si"],sv:["se"],uk:["ua"],zh:["cn","tw"]},[O,Hn]=(()=>{let n,e,r,t=new Promise(a=>{e=a,r=setTimeout(()=>{n={},a(n)},5e3)});return[a=>{a&&!n&&(n=a,clearTimeout(r),e?.(n))},()=>t]})();function J(n,e=!1){let s=(/uc_carts=/.test(document.cookie)?n:n?.filter(d=>d!=="cart"))??[],l=s.length??3;if(e){let d=s.filter(b=>fn.includes(b)).length;return`calc(92px + ${d*32}px + ${d*.25}rem)`}return`calc(${l*32}px + ${(l-1)*.25}rem)`}var Q=n=>{if(!n.prefix||n.prefix==="/")return"en_US";let e=n.prefix.replace("/","");if(e.includes("_")){let[t,a]=e.split("_").reverse();return`${t.toLowerCase()}_${a.toUpperCase()}`}if(e==="uk")return"en_GB";let r=Object.keys(Y).find(t=>Y[t].includes(e));return r?`${r.toLowerCase()}_${e.toUpperCase()}`:`${e.toLowerCase()}_${e.toUpperCase()}`},Me={Mac:"macOS",Win:"windows",Linux:"linux",CrOS:"chromeOS",Android:"android",iPad:"iPadOS",iPhone:"iOS"},nn=()=>{let n=navigator.userAgent;for(let[e,r]of Object.entries(Me))if(n.includes(e))return r;return"linux"},en=async()=>{let n=window;return n.alloy?await n.alloy("getIdentity").then(e=>e?.identity?.ECID).catch(()=>{}):void 0};var Rn=()=>{try{return C().signInContext||{}}catch{return{}}},Se=()=>{let n=C();return N("signin-cta-style")==="primary"||n?.unav?.profile?.signInCtaStyle==="primary"?"primary":"secondary"},Pe=()=>{let e=C()?.unav?.profile?.messageEventListener;return e||(r=>{let{name:t,payload:a,executeDefaultAction:o}=r.detail;if(!(!t||t!=="System"||!a||typeof o!="function"))switch(a.subType){case"AppInitiated":window.adobeProfile?.getUserProfile().then(i=>{O(i)}).catch(()=>{O({})});break;case"SignOut":o();break;case"ProfileSwitch":Promise.resolve(o()).then(i=>{i&&window.location.reload()});break;default:break}})};function Ae(){let{unav:n}=C();return n?.unavHelpChildren||[{type:"Support"},{type:"Community"}]}var F=()=>{let n=C();return{profile:{name:"profile",attributes:{accountMenuContext:{sharedContextConfig:{enableLocalSection:!0,enableProfileSwitcher:!0,miniAppContext:{logger:{trace:()=>{},debug:()=>{},info:()=>{},warn:()=>{},error:()=>{}}},complexConfig:n?.unav?.profile?.complexConfig||null,...n?.unav?.profile?.config},messageEventListener:Pe()},signInCtaStyle:Se(),isSignUpRequired:!1,callbacks:{onSignIn:()=>{window.adobeIMS?.signIn(Rn())},onSignUp:()=>{window.adobeIMS?.signIn(Rn())}}}},appswitcher:{name:"app-switcher"},notifications:{name:"notifications",attributes:{notificationsConfig:{applicationContext:{appID:n?.unav?.uncAppId||"adobecom",...n?.unav?.uncConfig}}}},help:{name:"help",attributes:{children:Ae()}},jarvis:{name:"jarvis",attributes:{appid:n?.jarvis?.id,callbacks:n?.jarvis?.callbacks}},cart:{name:"cart"}}};var zn=(n,e)=>{n[0]&&"attributes"in n[0]&&n[0].attributes&&typeof n[0].attributes=="object"&&"isSignUpRequired"in n[0].attributes&&(n[0].attributes.isSignUpRequired=e)},rn=async(n,e)=>{try{let r=n.querySelector(".feds-utilities");if(!(r instanceof HTMLElement))return new f('missing ".feds-utilities" container');let t=new Set,a=document.head.querySelector('meta[name="universal-nav"]'),o=a instanceof HTMLMetaElement?a.content??"":"";a instanceof HTMLMetaElement||t.add(new f('metadata "universal-nav" is missing'));let i=o.trim();a instanceof HTMLMetaElement&&i.length===0&&t.add(new f('metadata "universal-nav" has no value'));let s=!window.adobeIMS?.isSignedInUser(),l=i.split(",").map(h=>h.trim()).filter(h=>Object.keys(F()).includes(h)||h==="signup");if(s){let h=J(l,s);r.style.setProperty("min-width",h)}let d;try{d=C()}catch{throw new Error("MiloConfig not available for UNAV initialization")}let m=Q(d.locale),b=d.env.name==="prod"?"prod":"stage",g=await en(),p=new URLSearchParams(window.location.search).get("unavVersion");/^\d+(\.\d+)?$/.test(p??"")||(p="1.5"),await Promise.all([sn(`https://${b}.adobeccstatic.com/unav/${p}/UniversalNav.js`),on(`https://${b}.adobeccstatic.com/unav/${p}/UniversalNav.css`,!0)]);let u=()=>{let h=F(),x=[h.profile];return zn(x,!1),l?.forEach(w=>{if(w==="profile")return;if(w==="signup"){zn(x,!0);return}let U=h[w];U&&x.push(U)}),x},v=()=>({target:r,env:b,locale:m,countryCode:In(d?.locale)?.country||"US",imsClientId:window?.adobeid?.client_id,theme:"light",analyticsContext:{consumer:{name:"adobecom",version:"1.0",platform:"Web",device:nn(),os_version:navigator.platform},event:{visitor_guid:g}},children:u(),isSectionDividerRequired:!!d?.unav?.showSectionDivider,showTrayExperience:!A.matches});await window?.UniversalNav?.(v()),s||r?.style.removeProperty("min-width");let y=h=>{window?.UniversalNav?.reload(v())};return A.addEventListener("change",()=>{y()}),{reloadUnav:y,errors:t}}catch(r){let t=r instanceof Error?r.message:"failed to load universal nav";return new f(t)}};function R(n,e){return[...n.querySelectorAll(e)]}function W(n,e,r){R(n,e).forEach(t=>r?t.removeAttribute("tabindex"):t.setAttribute("tabindex","-1"))}var q={ArrowLeft:-1,ArrowRight:1,ArrowUp:-1,ArrowDown:1},Un=new Set(["ArrowLeft","ArrowRight"]),_e=new Set(["ArrowUp","ArrowDown"]),Ie='.tabs [role="tab"][aria-selected="true"]';function un(n,e,r){return(n+e+r)%r}function $e(n,e,r,t){let a=q[r];if(Un.has(r)){let p=e+a;return p>=0&&p<n.length?p:null}let o=getComputedStyle(t).gridTemplateColumns.split(" ").length,i=[...t.children],s=p=>{let u=n[p].parentElement;return u?i.indexOf(u):-1},l=s(e)%o,d=Math.floor(s(e)/o)+(r==="ArrowDown"?1:-1),m=Math.floor((i.length-1)/o);if(d<0||d>m)return null;let b=null,g=1/0;for(let p=0;p<n.length;p++){let u=Math.abs(s(p)%o-l);Math.floor(s(p)/o)===d&&u<g&&(g=u,b=p)}return b}function mn(n){W(n,'.tab-content [role="tabpanel"] a',!1);let e=[];R(n,".feds-popup[popover]").forEach(g=>{let p=()=>{g.matches(":popover-open")||W(g,'[role="tabpanel"] a',!1)};g.addEventListener("toggle",p),e.push(()=>g.removeEventListener("toggle",p))});let r=(g,p)=>{g.focus(),p.preventDefault()},t=()=>n.querySelector(".feds-popup:popover-open"),a=g=>g.querySelector(Ie),o=g=>g.querySelector('[role="tabpanel"]:not([hidden])');function i(g){let p=t(),u=n.querySelector("#feds-menu-wrapper");if(!u)return!1;let v=p??(u?.matches(":popover-open")?u:null);if(!v)return!1;v.hidePopover?.();let y=p?`[popovertarget="${v.id}"]`:".feds-nav-toggle";return n.querySelector(y)?.focus(),g.preventDefault(),!0}function s(g,p,u){if(!Un.has(p))return!1;let v=R(n,".feds-gnav-items > li > .feds-link"),y=v.indexOf(g);return y<0?!1:(r(v[un(y,q[p],v.length)],u),!0)}function l(g,p,u,v){let y=R(p,'.tabs :is([role="tab"], .product-links a)'),h=y.indexOf(g);if(h<0)return!1;if(q[u]){let x=y[un(h,q[u],y.length)];return x.matches('[role="tab"]')&&x.click(),r(x,v),!0}if(u==="Tab"&&!v.shiftKey&&g.matches('[aria-selected="true"]')){let x=o(p);if(!x)return!1;W(x,"a",!0);let w=x.querySelector("a");return w&&r(w,v),!0}return!1}function d(g,p,u,v){let y=o(p);if(!y)return!1;let h=R(y,"a"),x=h.indexOf(g);if(x<0)return!1;if(q[u]){let w=$e(h,x,u,y);return w!==null?(r(h[w],v),!0):u==="ArrowUp"?(W(y,"a",!1),r(a(p)??h[0],v),!0):!1}if(u==="Tab"&&!v.shiftKey){if(x+1<h.length)r(h[x+1],v);else{let w=R(p,'.tabs [role="tab"]'),U=a(p),tn=w[w.indexOf(U)+1]??p.querySelector(".product-links a");if(tn)r(tn,v);else return!1}return!0}if(u==="Tab"&&v.shiftKey){if(x>0)r(h[x-1],v);else{W(y,"a",!1);let w=a(p)??R(p,'.tabs :is([role="tab"], .product-links a)')[0];w&&r(w,v)}return!0}return!1}function m(g,p,u,v){if(!_e.has(u))return!1;let y=R(p,".feds-gnav-cards a"),h=y.indexOf(g);return h<0?!1:(r(y[un(h,q[u],y.length)],v),!0)}function b(g){let p=document.activeElement??g.target;if(g.key==="Escape"){i(g);return}let u=t();u&&(u.matches(":has(.product-list)")&&(l(p,u,g.key,g)||d(p,u,g.key,g))||u.matches(":has(.feds-gnav-cards)")&&m(p,u,g.key,g))||s(p,g.key,g)}return n.addEventListener("keydown",b),e.push(()=>n.removeEventListener("keydown",b)),()=>e.forEach(g=>g())}var He="feds-milo",L=(n,e="default",r="e")=>{let{locale:t}=C(),a=N("gnav-source")??`${t.contentRoot??""}/gnav`;window.lana||console.warn("lana logging unavailable in the gnav"),window?.lana?.log(`${n} | gnav-source: ${a} | href: ${window.location.href}`,{clientId:He,sampleRate:1,tags:e,errorType:r})};var c=class n extends Error{constructor(e){super(e),Object.setPrototypeOf(this,n.prototype)}},f=class n extends Error{constructor(e,r="Minor"){super(e),Object.setPrototypeOf(this,n.prototype),r==="Critical"&&L(e)}};var Dn=n=>e=>{if(e===null)throw new Error("");let r=e.querySelector(Re(n));if(!r)throw new Error("");let t=r.textContent??"",[a="",o=""]=t.split("|").map(b=>b.trim());if(a==="")throw new Error("");let i=r.getAttribute("href")??"";if(i==="")throw new Error("");let s=r.getAttribute("daa-ll"),l=r.getAttribute("aria-label")?.trim()??"",d=l!==""?l:o!==""?o:void 0,m=[];return[{type:n.type,text:a,href:i,ariaLabel:d,daaLl:typeof s=="string"&&s.trim()!==""?s:a},m]},vn=Dn({type:"PrimaryCTA"}),_=Dn({type:"SecondaryCTA"}),Nn=n=>G(vn).or(_).eval(n),Re=({type:n})=>{switch(n){case"PrimaryCTA":return"strong > a";case"SecondaryCTA":return"em > a";default:throw new Error("")}};var hn=({text:n,href:e,daaLl:r,ariaLabel:t})=>`
<a href="${E(e)}"
  class="feds-primary-cta"
  ${t!==null&&t!==""?`aria-label="${t}"`:""}
  ${k(null,r??n)}
>
  ${n}
</a>
`,I=({text:n,href:e,daaLl:r,ariaLabel:t})=>`
<a href="${E(e)}" 
  class="feds-secondary-cta" 
  ${t!==null&&t!==""?`aria-label="${t}"`:""}
  ${k(null,r??n)}
>
  ${n}
</a>
`,Bn=n=>n.type==="PrimaryCTA"?hn(n):I(n);var j=({text:n,href:e,daaLl:r})=>`<a class="feds-link" href="${E(e)}"${k(null,r??n)}>${n}</a>`;var qn=n=>{let[e,r]=ze(n);return[{type:"LinksCard",card:e},r]},ze=n=>{let e=n.querySelector("h2, h3, h4")||null;if(!e)throw new c("Expected links card title");let r=n.querySelector("em > a"),t=[...n.querySelectorAll("a")].filter(l=>l!==r);if(t.length===0)throw new c("Expected at least one link");let[a,o]=M(t,T),[i,s]=(()=>{try{return _(n)}catch{return[null,[]]}})();return i&&(i.daaLl=`${e.textContent??""} - ${i?.daaLl}`),[{type:"LinksCardItem",title:e.textContent??"",links:a,footerCTA:i},[...o,...s]]};var jn=n=>{let e=[...n.querySelectorAll("li > div")],r=[...n.querySelectorAll("li > a")],[t,a]=M(e,Ue),[o,i]=M(r,T);return[{type:"ProductList",categories:t,links:o},[...a,...i]]},Ue=n=>{let e=n.firstElementChild;if(e?.nodeName!=="H2")throw new c("Expected H2");let r=e.textContent??"",t=e.textContent??"",a=Ln(e),[o,i]=M(a,dn);return[{type:"ProductCategory",name:r,daaLl:t,links:o},i]};var Gn=n=>{let[e,r]=De(n);return[{type:"FeaturedCard",card:e},r]},De=n=>{let e=n.querySelector("h5")||null;if(!e)throw new f("Eye brow element not found");let r=n.querySelector("h4")||null,t=r?.nextElementSibling||null;if(!r)throw new c("Expected title");if(!t)throw new c("Expected subtitle");let a=t.nextElementSibling?.firstElementChild||null;if(!a)throw new c("Expected card link after subtitle");let[o,i]=T(a),[s,l]=_(n);return[{type:"Card",title:r.textContent??"",subtitle:t.textContent??"",bodyLink:o,footerCTA:s,eyeBrow:e.textContent??""},[...l,...i]]};var P={MissingBackgroundImageSection:"Promo card is missing background image section",MissingBackgroundImage:"Promo card is missing background image",MissingBackgroundImageAlt:"Promo card background image is missing alt text",MissingBackgroundImageSrc:"Promo card background image is missing src",MissingContentSection:"Promo card is missing card details section",MissingIcon:"Promo card is missing icon",MissingIconSrc:"Promo card icon is missing src",MissingIconAlt:"Promo card icon is missing alt text",MissingTitleElement:"Promo card is missing title element",MissingTitleText:"Promo card is missing title text",MissingSecondaryCtaAnchor:"Promo card is missing secondary CTA anchor",MissingPriceLink:"Promo card is missing price link"},On=n=>{let[e,r]=n.querySelectorAll(":scope > div"),t=new Set;if(e===void 0)throw new c(P.MissingBackgroundImageSection);let a=e.querySelector(":scope picture:not(:scope p picture) img")??null;a===null&&t.add(new f(P.MissingBackgroundImage));let o=a?.getAttribute("alt")??"";o===""&&t.add(new f(P.MissingBackgroundImageAlt));let i=a?.getAttribute("src")??"";if(i===""&&t.add(new f(P.MissingBackgroundImageSrc)),r===void 0)throw new c(P.MissingContentSection);let s=r.querySelector('a[href$=".svg"]')??null;s===null&&t.add(new f(P.MissingIcon));let[l,d]=(s?.textContent?.split("|")??["",""]).map(w=>w.trim());l===""&&t.add(new f(P.MissingIconSrc)),d===""&&t.add(new f(P.MissingIconAlt));let m=r.querySelector('p > a:not([href$=".svg"])')??null,b=m?.textContent?.trim()??"",g=m?.getAttribute("href")??"",p=g?Cn(g):!1;m===null&&t.add(new f(P.MissingPriceLink));let u=r.querySelector("p > strong")??null;if(u===null)throw new c(P.MissingTitleElement);let v=u?.textContent??"";v===""&&t.add(new f(P.MissingTitleText)),r.querySelector("em > a")===null&&t.add(new f(P.MissingSecondaryCtaAnchor));let[h,x]=(()=>{try{return _(n)}catch{return[null,[]]}})();return x.forEach(w=>t.add(w)),h&&(h.daaLl=`${v} - ${h?.daaLl}`),[{type:"PromoCard",card:{bgImageAlt:o,bgImageSrc:i,iconAlt:d,iconSrc:l,title:v,cta:h,priceText:b,priceHref:g,isPriceMerchLink:p}},[...t]]};var Wn=n=>{let e=new Set;if(n===null)throw new c(Fn.elementNull);let r=n.querySelector("h2")?.textContent??"";r===""&&e.add(new f(Fn.noTitle));let t=(async()=>{try{let a=n.querySelector("a"),o=new URL(a?.href??""),i=await D(o);if(i instanceof c)throw new Error(i.message);let s=await Pn(i);if(s instanceof c)throw new Error(s.message);return Sn(o.href,s),n.classList.contains("product-list")?jn(s):Ne(s)}catch(a){throw new c(a?.message)}})();if(t instanceof c)throw t;return[{type:"MegaMenu",title:r,content:t},[...e]]},Fn={elementNull:"Element is null",noTitle:"Large Menu has no Title"},Ne=n=>{let e=[...n.children];if(e.length===0)throw new c("No mega menu items found (did you forget to add them correctly?)");let[r,t]=M(e,a=>Be(a));if(r.length===0)throw new c("Failed to parse gnav cards sections");return[{type:"GnavCards",sections:r},t]},Be=n=>{let e=[...n.querySelectorAll(".featured-card, .links-card, .promo-card")];if(e.length===0)throw new c("Column contains no cards (did you forget to label them correctly?)");let[r,t]=M(e,a=>qe(a));if(r.length===0)throw new c("Failed to parse cards in column");return[{type:"GnavColumn",cards:r},t]},qe=n=>{if(n.classList.contains("featured-card"))return Gn(n);if(n.classList.contains("links-card"))return qn(n);if(n.classList.contains("promo-card"))return On(n);throw new c("Unsupported gnav cards section")};var Zn=({card:n})=>je(n),je=({title:n,subtitle:e,eyeBrow:r,footerCTA:t,bodyLink:a})=>`
  <article class="featured-card" ${k(r,"")}>
    <div>
      <div class="featured-eyebrow">${r}</div>
      <h4>${n}</h4>
      <div class="featured-subtitle">${e}</div>
      <span>${j(a)}${$.chevronRight}</span>
    </div>
    <div class="footer-container">
      ${I(t)}
    </div>
  </article>
`.trim();var Xn=({card:n})=>Ge(n),Ge=({title:n,links:e,footerCTA:r})=>`
  <article class="links-card" ${k(n,"")}>
    <div>
      <p class="links-card-title" role="heading" aria-level="2">${n}</p>
      <ul class="links-card-links">
        ${e.map(t=>`<li>${j(t)}</li>`).join("")}
      </ul>
    </div>
    ${r===null?"":`
    <div class="links-card-footer">
      ${I(r)}
    </div>`}
  </article>
`.trim();var Kn=({card:n})=>Oe(n),Oe=({bgImageAlt:n,bgImageSrc:e,iconAlt:r,iconSrc:t,title:a,cta:o,priceText:i,priceHref:s,isPriceMerchLink:l})=>`
  <article class="promo-card" daa-lh="promo-card">
    ${e?`<picture class="promo-card__bg">
             <img src="${e}" alt="${n}" class="promo-card__bg-image">
           </picture>`:""}

    <div class="promo-card__content">
      ${t?`<picture class="promo-card__icon">
               <img src="${t}" alt="${r}" class="promo-card__icon-image">
             </picture>`:""}
      <div class="promo-card__text-content">
        ${s&&l?`<p class="promo-card__price">
          <a href="${E(s)}" class="merch">${i}</a>
        </p>`:""}
        <p class="promo-card__title" role="heading" aria-level="2">
          ${a}
        </p>
        ${o===null?"":`<div class="promo-card__cta">
                 ${I(o)}
               </div>`}
      </div>
    </div>
  </article>
`.trim();var Fe=n=>{switch(n.type){case"FeaturedCard":return Zn(n);case"LinksCard":return Xn(n);case"PromoCard":return Kn(n);default:}return""},Vn=({sections:n})=>`
  <ul class="feds-gnav-cards">
    ${n.map(e=>`<li>${e.cards.map(r=>Fe(r)).join("")}</li>`).join("")}
  </ul>
`;var Yn=({categories:n,links:e})=>{let r=`
    <ul class="tabs" role="tablist">
      ${n.map(We).join("")}
      ${e.length?`<li class="product-links"><a class="feds-link" href="${E(e[e.length-1].href)}"${k(null,e[e.length-1].daaLl??e[e.length-1].text)}>${e[e.length-1].text}${$.chevronRight}</a></li>`:""}
    </ul>
  `.trim(),t=`
    <ul class="tab-content">
      ${n.map(({links:a},o)=>`
      <li>
        <ul
          id="${o}"
          role="tabpanel"
          ${o===0?"":"hidden"}
        >
          ${a.map(i=>`<li>${cn(i)}</li>`).join("")}
        </ul>
      </li>
      `.trim()).join("")}
    </ul>
  `.trim();return`
    <div class="product-list">
      ${r}
      ${t}
    </div>
  `.trim()},We=({name:n,daaLl:e},r)=>`
      <li>
        <button
          role="tab"
          class="tab"
          aria-selected="${(r===0).toString()}"
          aria-controls="${r}"
          ${k("",e)}
          >
            ${n}
          </button>
      </li>
  `.trim();var Jn=({title:n},e=0)=>`
  <button type="button"
          aria-controls="${X(n)}"
          aria-haspopup="true"
          class="mega-menu feds-link"
          popovertarget="${X(n)}"
          ${k(`${n}-${e+1}`,"header|Open")}
  >
    ${n}${$.chevronDown}
  </button>
  <div id="${X(n)}" popover class="feds-popup">
  </div>
`,Qn=(n,e,r)=>{let t=`
        <button
          type="button"
          class="feds-popup-back-button"
          
          aria-label="Back"
          daa-ll="${r}|Back"
        >
          ${$.chevronLeft}
          <span class="feds-popup-title">${r}</span>
        </button>
  `,a=n.type==="ProductList"&&n.links.length>0?n.links[n.links.length-1]:null,o=`
    <div class="feds-popup-header">
      <div class="feds-popup-header-left">${t}</div>
      ${a?`<div class="product-links"><a class="feds-link" href="${E(a.href)}"${k(null,a.daaLl??a.text)}>${a.text}${$.chevronRight}</a></div>`:""}
    </div>
  `.trim(),i="";switch(n.type){case"ProductList":i=Yn(n);break;case"GnavCards":i=Vn(n);break;default:}return`${o}${i}`};var ne={elementNull:"Error when parsing text. Element is null",textContentNull:"Error when parsing text. Element has no textContent"},ee=n=>{if(n===null)return[{type:"Text",content:""},[new f(ne.elementNull,"Minor")]];let e=n.textContent;return e===null?[{type:"Text",content:""},[new f(ne.textContentNull,"Minor")]]:[{type:"Text",content:e},[]]};var re=({content:n})=>n;var te=n=>{if(n===null)throw new c(Ze.elementNull);let e=n.querySelector(".gnav-brand");if(e!==null)return pn(e);let r=n.querySelector(".large-menu");return r!==null?Wn(r):n.querySelector("strong")!==null?vn(n):n.querySelector("em")!==null?_(n):n.querySelector("a")===null?ee(n):T(n.querySelector("a"))},bn=(n,e)=>{switch(n.type){case"Text":return re(n);case"Link":return j(n);case"SecondaryCTA":return I(n);case"PrimaryCTA":return hn(n);case"Brand":return gn(n);case"MegaMenu":return Jn(n,e);default:return console.error(`Failed to recognize component: ${n}`),""}},Ze={elementNull:"Element is null"};var ae=(n,e)=>{let[r,t]=M([...document.querySelectorAll(".breadcrumbs ul > li > a")??[]],T),[a,o]=M([...n.children],te),i=n.querySelector(".product-entry-cta"),[s,l]=(()=>{try{return Nn(i)}catch{return[null,[]]}})(),d=!1,m=[t,o,l].flat();return{breadcrumbs:r,components:a,productCTA:s,localnav:d,errors:m,unavEnabled:e}};var oe=n=>{let e=[...n.querySelectorAll('.tabs button[role="tab"]')],r=[...n.querySelectorAll(".tab-content ul")],t=e.map((a,o)=>()=>{let i=r[o].closest(":popover-open"),s=i?.clientHeight??0;if(e.forEach(d=>{d.setAttribute("aria-selected","false")}),r.forEach(d=>{d.setAttribute("hidden","true")}),r[o]?.removeAttribute("hidden"),a.setAttribute("aria-selected","true"),!A.matches)return;let l=i?.clientHeight??0;i?.animate([{height:`${s}px`},{height:`${l}px`}],{duration:350,iterations:1,easing:"cubic-bezier(0.4, 0, 0.2, 1)"})});return e.forEach((a,o)=>{a.addEventListener("click",t[o])}),Xe(n),()=>{e.forEach((a,o)=>{a.removeEventListener("click",t[o])})}},Xe=n=>{let e=[...n.querySelectorAll(".feds-gnav-items > li > button")],r=n.querySelector(".feds-gnav-items");e.forEach(t=>{t.addEventListener("click",()=>{if(A.matches||!r)return;let a=t.nextElementSibling;a&&(r.classList.remove("subscreen-closing"),r.classList.add("subscreen-opening"),a.querySelector(".feds-popup-back-button")?.addEventListener("click",()=>{r.classList.remove("subscreen-opening"),r.classList.add("subscreen-closing"),setTimeout(()=>a.hidePopover(),240)}))})}),A.addEventListener("change",()=>{r?.classList.remove("subscreen-opening"),r?.classList.remove("subscreen-closing")}),n.querySelector(".feds-nav-toggle")?.addEventListener("click",()=>{r?.classList.remove("subscreen-opening"),r?.classList.remove("subscreen-closing")})};var ie=async n=>{let e=new Set,r=n.querySelectorAll("a.merch");if(r.length===0)return e;try{let t=C(),{base:a}=t;if(!a)return e.add(new f("base not found in config, cannot initialize merch links")),e;let o=await import(`${a}/blocks/merch/merch.js`),{default:i}=o;if(!i)return e.add(new f("decorateMerchLink not found in merch module")),e;r.forEach(s=>{i(s)})}catch(t){e.add(new f(`Error initializing merch links: ${t}`))}return e};var se=async({gnavSource:n,asideSource:e})=>{let r=await D(n);if(r instanceof c)return r;let t=await D(e);return{mainNav:r,aside:t}};var Ke=`/**
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
  --s2a-color-blue-900: #3b63fb;
  --s2a-color-red-900: #d73220;
  --s2a-color-transparent-black-64: rgb(0 0 0 / 64%);
  --s2a-color-transparent-black-08: rgb(0 0 0 / 8%);
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
  --s2a-spacing-3xl: var(--s2a-spacing-48);
  --s2a-font-family-heading: var(--s2a-font-family-adobe-clean-display);
  --s2a-font-size-xs: var(--s2a-font-size-12);
  --s2a-font-size-sm: var(--s2a-font-size-14);
  --s2a-font-size-md: var(--s2a-font-size-16);
  --s2a-font-size-xl: var(--s2a-font-size-20);
  --s2a-font-size-2xl: var(--s2a-font-size-24);
  --s2a-font-size-3xl: var(--s2a-font-size-32);
  --s2a-blur-sm: var(--s2a-blur-16);
}

:root[data-theme="light"] {
  --s2a-color-content-default: var(--s2a-color-gray-800);
  --s2a-color-content-subtle: var(--s2a-color-gray-700);
}

/* ========== Gnav component styles ========== */

/**
 * Global Navigation Styles
 * Styles for the federal global navigation component
 */

/* =========================================
   Header Shell
   ========================================= */

header.global-navigation {
  width: 100%;
  background: transparent;
  visibility: visible;
  display: block;
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

.global-navigation.site-pivot .universal-nav-container .profile-signed-out button {
  color: var(--s2a-color-gray-25);
}

.global-navigation.site-pivot:has(:popover-open) .universal-nav-container .profile-signed-out button,
.global-navigation.site-pivot .universal-nav-container .profile-signed-out button:hover {
  color: inherit;
}

.global-navigation.site-pivot .feds-utilities {
  margin-left: auto;
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
  justify-content: flex-start;
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
  font-family: var(--s2a-font-family);
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

.global-navigation.site-pivot:has(:popover-open) .feds-gnav-items > li > .feds-link {
  color: var(--s2a-color-gray-1000);
  font-size: var(--s2a-font-size-3xl);
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
  margin-left: var(--s2a-spacing-2xs);
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

.global-navigation .unav-comp-app-switcher.unav-comp-icon svg {
  fill: var(--s2a-color-gray-25);
}

.global-navigation .unav-comp-app-switcher.unav-comp-icon.unav-comp-app-switcher-open svg {
  fill: var(--s2a-color-gray-1000);
}

.global-navigation.feds-header-scrolled .unav-comp-app-switcher.unav-comp-icon svg {
  fill: var(--s2a-color-gray-1000);
}

.global-navigation .unav-comp-app-switcher.unav-comp-icon:hover svg {
  fill: var(--s2a-color-gray-1000);
}

.global-navigation.feds-header-scrolled .universal-nav-container .profile-signed-out button {
  color: var(--s2a-color-gray-1000);
  border: var(--s2a-border-width-sm) solid var(--s2a-color-gray-1000);
}

header.global-navigation:has(:popover-open) .unav-comp-app-switcher.unav-comp-icon svg {
  fill: inherit;
}

header.global-navigation:has(:popover-open) .unav-comp-tooltip {
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
  background: var(--s2a-color-gray-25);
}

.feds-popup:popover-open {
  display: block;
  background: var(--s2a-color-gray-75);
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
  padding: 10px var(--s2a-spacing-lg);
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
  font-size: var(--s2a-font-size-3xl);
  font-weight: var(--s2a-font-weight-adobe-clean-black);
  font-family: var(--s2a-font-family-heading);
  color: var(--s2a-color-content-default);
  margin-left: 10px; /* replace with token if we find one later */
}

/* =========================================
   Link Groups
   ========================================= */

.feds-popup .feds-product-card {
  display: grid;
  grid-template-columns: var(--s2a-spacing-xl) minmax(0, 1fr);
  gap: var(--s2a-spacing-sm);
  min-height: 52px;
  align-items: start;
  border-radius: var(--s2a-border-radius-md);
  padding: var(--s2a-spacing-md);
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
  font-size: var(--s2a-font-size-sm);
  font-weight: var(--s2a-font-weight-adobe-clean-bold);
  line-height: var(--s2a-font-line-height-20);
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
  min-height: 28px;
  padding: 0 14px;
  border: var(--s2a-border-width-sm) solid var(--s2a-color-content-default);
  border-radius: var(--s2a-border-radius-sm);
  font-size: var(--s2a-font-size-xs);
  font-weight: var(--s2a-font-weight-adobe-clean-bold);
  line-height: 1;
  color: var(--s2a-color-content-default);
}

.feds-popup .feds-product-card__badge--filled {
  border-color: var(--s2a-color-gray-1000);
  background: var(--s2a-color-gray-1000);
  color: var(--s2a-color-gray-25);
}

.feds-popup .feds-product-card__subtitle {
  margin-top: var(--s2a-spacing-2xs);
  font-size: var(--s2a-font-size-xs);
  font-weight: var(--s2a-font-weight-adobe-clean-regular);
  line-height: 1.35;
  /* No token: design uses custom gray; using content-subtle */
  color: var(--s2a-color-content-subtle);
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
  border: var(--s2a-border-width-sm) solid var(--s2a-color-content-default);
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

  .global-navigation.site-pivot:has(:popover-open) .feds-gnav-items > li > .feds-link {
    opacity: 60%;
    font-size: var(--s2a-font-size-sm);
  }

  .global-navigation.site-pivot:not(:has(:popover-open)) .feds-gnav-items:has(.feds-link:hover) > li > .feds-link:not(:hover) {
    opacity: 0.65;
  }


  .global-navigation.site-pivot:has(:popover-open) .feds-gnav-items > li > .feds-link[aria-expanded="true"],
  .global-navigation.site-pivot:has(:popover-open) .feds-gnav-items > li > .feds-link:hover {
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
}

/* =========================================
   Responsive: Mobile (max-width: 766px)
   ========================================= */

@media (max-width: 1023px) {
  .global-navigation.site-pivot .feds-gnav-items > li > .mega-menu.feds-link {
    width: 100%;
    justify-content: space-between;
    text-align: left;
  }

  .global-navigation.site-pivot .feds-gnav-items > li > .feds-link {
    font-family: var(--s2a-font-family-adobe-clean-display);
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
    border-radius: var(--s2a-border-radius-24);
  }

  body:has(:popover-open) {
    overflow: hidden;
  }
}

/* =========================================
   Scroll Animations
   ========================================= */

header.global-navigation nav {
  padding: 0 0 0 var(--s2a-spacing-md);
  margin: var(--s2a-spacing-xs) var(--s2a-spacing-xs) 0 var(--s2a-spacing-xs);
  border-radius: var(--s2a-border-radius-16);
  transition: all 0.48s cubic-bezier(0.4, 0, 0.2, 1);
}

header.global-navigation:has(:popover-open) nav {
  border-radius: 0;
  margin: 0;
  padding: var(--s2a-spacing-xs) var(--s2a-spacing-xs) 0 calc(var(--s2a-spacing-md) + var(--s2a-spacing-xs));
  backdrop-filter: blur(0);
  background-color: var(--s2a-color-gray-75);
}

@supports ((animation-timeline: scroll()) and (animation-range: 0% 100%)) {
  @keyframes scroll-transition-main-nav {
    from {
      background-color: rgba(255,255,255, 0);
      backdrop-filter: blur(0px);
    }
    to {
      /* No token: 51% white */
      background-color: rgba(255, 255, 255, 0.51);
      backdrop-filter: blur(var(--s2a-blur-sm));
    }
  }

  @keyframes color-transition {
    from {
      color: var(--s2a-color-gray-25);
    }
    to {
      color: var(--s2a-color-gray-1000);
    }
  }

  header.global-navigation:not(:has(:popover-open)) nav {
    animation: scroll-transition-main-nav linear forwards;
    animation-timeline: scroll();
    animation-range: 0px 100px;
  }

  header.global-navigation.feds-header-scrolled:not(:has(:popover-open)) .feds-brand-image svg,
  header.global-navigation.feds-header-scrolled:not(:has(:popover-open)) .feds-nav-toggle svg {
    animation: color-transition linear forwards;
    animation-timeline: scroll();
    animation-range: 0px 100px;
  }

  @media (max-width: 1023px) {
    header.global-navigation:has(.unav-comp-app-switcher-open) nav {
      animation: none;
    }

    header.global-navigation.feds-header-scrolled:has(.unav-comp-app-switcher-open) .feds-brand-image svg,
    header.global-navigation.feds-header-scrolled:has(.unav-comp-app-switcher-open) .feds-nav-toggle svg {
      animation: none;
      color: var(--s2a-color-gray-1000);
    }
  }

}

@supports (not ((animation-timeline: scroll()) and (animation-range: 0% 100%))) {
  header.global-navigation:not(:has(:popover-open)) nav {
    /* No token: 51% white */
    background-color: rgba(255, 255, 255, 0.51);
    backdrop-filter: blur(var(--s2a-blur-sm));
  }

  header.global-navigation.feds-header-scrolled:not(:has(:popover-open)) .feds-brand-image svg,
  header.global-navigation.feds-header-scrolled:not(:has(:popover-open)) .feds-nav-toggle svg {
    color: var(--s2a-color-gray-1000);
  }
}

/* =========================================
   Popover Animations
   ========================================= */

/* Browsers must support @starting-style */

@media (min-width:1024px) {
  .feds-popup {
    border-bottom-left-radius: 18px;
    border-bottom-right-radius: 18px;
    background-color: rgba(255,255,255,0.51);
    opacity: 0;
    max-height: 0;
    overflow: hidden;
    clip-path: polygon(8px 0, calc(100% - 8px) 0, calc(100% - 8px) 100%, 8px 100%);
    transition: 
      display 0.48s allow-discrete,
      overlay 0.48s allow-discrete,
      opacity 0.48s cubic-bezier(0.4, 0, 0.2, 1),
      max-height 0.48s cubic-bezier(0.4, 0, 0.2, 1),
      clip-path 0.48s cubic-bezier(0.4, 0, 0.2, 1),
      background-color 0.22s ease 0.18s;
  }
  
  .feds-popup:popover-open {
    background-color: var(--s2a-color-gray-75);
    opacity: 1;
    max-height: calc(100dvh - var(--s2a-spacing-64));
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    transition-delay: 0s;
  }
  
  @starting-style {
    .feds-popup:popover-open {
      background-color: rgba(255,255,255,0.51);
      opacity: 0;
      max-height: 0;
      clip-path: polygon(8px 0, calc(100% - 8px) 0, calc(100% - 8px) 100%, 8px 100%);
  
    }
  }
  
  /* Dim overlay (must come AFTER .feds-popup rules) */
  .feds-popup::backdrop {
    background-color: rgba(0, 0, 0, 0);
    backdrop-filter: blur(0px);
    inset: calc(var(--s2a-spacing-64) + var(--s2a-spacing-8)) 0 0 0;
    transition: 
      opacity 0.3s ease,
      background-color 0.3s ease,
      backdrop-filter 0.3s ease;
  }
  
  .feds-popup:popover-open::backdrop {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.60);
    backdrop-filter: blur(32px);
  }
  
  @starting-style {
    .feds-popup::backdrop {
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

header.global-navigation.feds-header-scrolled:has(.unav-comp-app-switcher-open) nav {
  background: var(--s2a-color-gray-75);
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
    background-color: var(--s2a-color-gray-75);
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
    padding: var(--s2a-spacing-sm) var(--s2a-spacing-lg);
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
  
  .global-navigation:has(:popover-open) .feds-nav-toggle svg {
    height: 11px;
  }
  
  .global-navigation:has(:popover-open) .feds-nav-toggle path:first-child {
    transform: translateY(-2.75px) rotate(-45deg) scaleX(1.25);
  }
  .global-navigation:has(:popover-open) .feds-nav-toggle path:last-child {
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

header.global-navigation:has(:popover-open) nav .feds-brand-image svg,
header.global-navigation:has(:popover-open) nav .feds-nav-toggle svg {
  color: var(--s2a-color-gray-1000);
}

/* =========================================
   Brand
   ========================================= */

.feds-brand {
  align-items: center;
  outline-offset: var(--s2a-spacing-2xs);
  padding: 0 var(--s2a-spacing-lg) 0 0;
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
      opacity: 1
    }
    to {
      opacity: 0;
    }
  }
  header.global-navigation:has(:popover-open) .feds-brand {
    animation: brand-fade 0.3s;
    opacity: 0;
    pointer-events: none;
  }
  header.global-navigation .feds-nav-toggle {
    transform: translateX(0);
    transition: transform 0.3s ease;
  }
  header.global-navigation:has(:popover-open) .feds-nav-toggle {
    transform: translateX(-47px);
  }
}

/* =========================================
   Responsive: Desktop (min-width: 1024px)
   ========================================= */

@media (min-width: 1024px) {
  .feds-brand,
  .feds-logo {
    padding: 0 var(--s2a-spacing-xs);
  }
  li.feds-brand-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    padding-left: 0;
  }

  .feds-brand-image.desktop-brand {
    display: inherit;
  }

  header:has(:popover-open) .feds-brand-image svg {
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
  margin-top: var(--s2a-spacing-lg);
  margin-bottom: var(--s2a-spacing-lg);
  padding: 0;
  font-family: var(--s2a-font-family-adobe-clean);
}

.feds-popup-header .product-links .feds-link svg {
  width: 3px;
  height: 6px;
  flex-shrink: 0;
}

ul.tabs .product-links {
  display: none;
}

/* =========================================
   Responsive: Desktop (min-width: 1024px)
   ========================================= */

@media (min-width: 1024px) {
  .feds-gnav-cards > li:has(> :nth-child(2)) {
    gap: var(--s2a-spacing-xs);
  }

  .feds-popup .feds-gnav-cards:has(.promo-card, .links-card) {
    align-items: stretch;
  }

  .feds-popup .feds-gnav-cards:has(.promo-card, .links-card) article {
    height: 100%;
  }

  .feds-gnav-cards > li:has(.promo-card, .links-card) {
    width: calc(33.33% - 5.33px);
  }
  .feds-popup-header .product-links {
    display: none;
  }
  ul.tabs .product-links {
    display: block;
  }
  ul.tabs .product-links .feds-link{
    font-family: var(--s2a-font-family-adobe-clean);
    padding: var(--s2a-spacing-md) var(--s2a-spacing-lg);
  }
}

/* =========================================
   Responsive: Large Desktop (min-width: 1280px)
   ========================================= */

@media (min-width: 1280px) {
  .feds-gnav-cards > li:has(.promo-card, .links-card) {
    width: calc(25% - 6px);
  }

  .feds-gnav-cards > li:has(.promo-card) {
    width: calc(50% - 4px);
  }

  .feds-gnav-cards > li:has(> :nth-child(2)) {
    width: calc(50% - 4px);
    flex-direction: row;
  }

  .feds-gnav-cards > li:has(> :nth-child(2)) article {
    width: calc(50% - 4px);
  }
}

/* =========================================
   Gnav Cards Container
   ========================================= */

.feds-popup .feds-gnav-cards {
  list-style: none;
  margin: 0;
  padding: var(--s2a-spacing-sm) var(--s2a-spacing-lg) var(--s2a-spacing-lg);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--s2a-spacing-2xs);
  align-items: start;
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
  }

  .feds-popup .feds-gnav-cards > li {
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
  font-size: var(--s2a-font-size-xl);
  line-height: 100%;
  /* No token for percentage */
  letter-spacing: -1%;
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
  padding: 11px var(--s2a-spacing-lg);
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
  line-height: var(--s2a-typography-line-height-title-4);
  letter-spacing: var(--s2a-typography-letter-spacing-title-4);
  font-weight: var(--s2a-font-weight-adobe-clean-black);
  color: var(--s2a-color-gray-1000);
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
}

/* =========================================
   Responsive: Desktop (min-width: 1024px)
   ========================================= */

@media (min-width: 1024px) {
  .feds-popup .links-card {
    border-radius: var(--s2a-border-radius-16); /* Don't have a token */
    padding: var(--s2a-spacing-lg) var(--s2a-spacing-lg) var(--s2a-spacing-md);
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
  gap: 14px;
  padding: 22px var(--s2a-spacing-md) 28px;
  /* No token: design #f6f6f6; using gray-75 */
  background-color: var(--s2a-color-gray-75);
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
  font-family: var(--body-font-family);
  font-size: var(--s2a-font-size-sm);
  font-weight: var(--s2a-font-weight-adobe-clean-bold);
  line-height: 8px;
  color: var(--s2a-color-content-default);
  background: var(--s2a-color-transparent-black-08);
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
  gap: var(--s2a-spacing-xs);
  padding: 0;
  margin: 0;
  list-style: none;
}

.product-list .tab-content [role="tabpanel"] .feds-product-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 120px;
  height: auto;
  background-color: var(--s2a-color-gray-25);
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
    padding: var(--s2a-spacing-lg);
  }

  .product-list .tabs {
    display: block;
    overflow: visible;
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
  }
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
  font-family: var(--s2a-font-family-heading);
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
  font-family: var(--s2a-font-family-heading);
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
}

.feds-popup .featured-card .featured-eyebrow {
  /* No token: design uses custom gray; using content-subtle */
  color: var(--s2a-color-content-subtle);
  font-family: var(--body-font-family);
  font-size: var(--s2a-font-size-sm);
  font-weight: var(--s2a-font-weight-adobe-clean-bold);
}

.feds-popup .featured-card h4 {
  margin: 0;
  font-family: var(--s2a-font-family-heading);
  font-size: var(--s2a-font-size-2xl);
  line-height: 24px;
  color: var(--s2a-color-gray-1000);
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
    /* No token: 12px radius on desktop */
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
`,le=document.createElement("style");le.textContent=Ke;document.head.appendChild(le);var yo=async n=>{let{gnavSource:e,mountpoint:r,unavEnabled:t,miloConfig:a,personalization:o}=n;if(!(e instanceof URL))throw L(`gnavSource is invalid: ${e}`),new c("gnavSource needs to be a URL object");try{ln(a)}catch(m){throw L(`Failed to initialize MiloConfig: ${m}`),new c(`Failed to initialize MiloConfig: ${m}`)}En(o),Tn(n.localizeLink??(m=>m)),wn(yn(n));let i=await se(n);if(i instanceof c)throw L(i.message),i;let{mainNav:s,aside:l}=i;if(s instanceof c)throw L(s.message),s;let d=ae(s,t);if(d instanceof c)throw L(d.message),d;return await Ve(d)(r),Je(n)},Ve=n=>async e=>{let r=Ye(n);e.innerHTML=r,e.classList.add("site-pivot");let t=[...e.querySelectorAll(".mega-menu ~ .feds-popup")];t.forEach(s=>{s.innerHTML=""});let a=n.components.filter(s=>s.type==="MegaMenu"),o=a.map(s=>s.content),i=await Promise.all(o.map(async(s,l)=>{let[d,m]=await s,b=a[l].title;return t[l].innerHTML=Qn(d,t[l].id,b),m}).flat());return e},Ye=({components:n,productCTA:e,unavEnabled:r})=>`
<nav>
  <ul>
    ${(()=>{let t=n.find(l=>l.type==="Brand")??null,a=n.filter(l=>l.type!=="Brand"),o=`
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
      `.trim(),i=t?bn(t):"",s=An(a,bn);return`
        <li class="feds-brand-wrapper">
          ${i}
          ${o}
        </li>
        <li
          id="feds-menu-wrapper"
          popover
          class="feds-menu-wrapper"
          aria-hidden="true"
        >
          <ul class="feds-gnav-items">
            ${s}
          </ul>
        </li>
      `.trim()})()}
  </ul>
  ${e===null?"":Bn(e)}
  ${r?'<div class="feds-utilities"></div>':""}
</nav>
`,Je=async n=>{let e=new Set,r=await rn(n.mountpoint);r instanceof f?(e.add(r),L(r.message)):r.errors.forEach(o=>e.add(o)),oe(n.mountpoint),mn(n.mountpoint),Qe(n.mountpoint),nr(n.mountpoint),er(n.mountpoint),tr(n.mountpoint),ar(n.mountpoint,n.mepMartech??""),(await ie(n.mountpoint)).forEach(o=>{e.add(o),L(o.message)});let a=r instanceof f?()=>{}:r.reloadUnav;return{closeEverything:rr,reloadUnav:a,errors:e,setGnavTopPosition:o=>{},getGnavTopPosition:()=>0}},Qe=n=>{let e=n.querySelector("#feds-menu-wrapper"),r=n.querySelector(".feds-nav-toggle");e?.addEventListener("toggle",()=>{let a=e.matches(":popover-open");r?.setAttribute("aria-expanded",String(a)),r?.setAttribute("daa-ll",a?"hamburgermenu|close":"hamburgermenu|open"),e.setAttribute("aria-hidden",String(!a)),a&&e.classList.add("feds-menu-active")}),e?.addEventListener("transitionend",()=>{e.matches(":popover-open")||e.classList.remove("feds-menu-active")}),n.querySelectorAll(".feds-popup[popover]").forEach(a=>{a.addEventListener("toggle",()=>{let o=n.querySelector(`[popovertarget="${a.id}"]`),i=a.matches(":popover-open");o?.setAttribute("aria-expanded",String(i)),o?.setAttribute("daa-ll",i?"header|Close":"header|Open")})})},nr=n=>{A.addEventListener("change",()=>{K(n)})},er=n=>{[...n.querySelector(".feds-utilities #universal-nav")?.children??[]].forEach(e=>{e.addEventListener("click",()=>K(n)),e.addEventListener("keydown",r=>{r.key==="Enter"&&K(n)})})};var rr=()=>{},tr=n=>{let e=n.closest("header");if(!e)return;let r=n.querySelector("#feds-menu-wrapper"),t=()=>r?.matches(":popover-open")??!1,a=()=>window.scrollY>100,o=()=>{if(t()){e.classList.remove("feds-header-scrolled");return}if(a()){e.classList.add("feds-header-scrolled");return}e.classList.remove("feds-header-scrolled")};o(),window.addEventListener("scroll",o,{passive:!0}),r?.addEventListener("toggle",o)},ar=(n,e)=>{let r=n.closest("header");r!==null&&r.setAttribute("daa-lh",`gnav|${$n()}${e}`)};export{yo as main,Je as postRenderingTasks,Ve as renderGnav,Ye as renderGnavString};
//# sourceMappingURL=main.js.map
