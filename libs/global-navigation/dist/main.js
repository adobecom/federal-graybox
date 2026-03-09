var wn=async n=>{let{placeholders:e}=n,{locale:r}=E(),a=`${Z()}${r.prefix}/federal/globalnav/placeholders.json`,[o,i]=await Promise.all([e,le(a)]);return new Map([...i,...o])},le=async n=>{try{let e=await fetch(n);if(!e.ok)throw new f(`Federal placeholders not found at ${n}`);let r=de(await e.json());if(r instanceof f)throw r;return new Map(r.data.map(({key:t,value:a})=>[t,a]))}catch(e){if(e instanceof f)console.error(e.message);else{let r=new f(e.message);console.error(r.message)}return L(`Failed to fetch placeholders from ${n}`),new Map([])}},de=n=>{try{let{data:e}=n;if(!e.every(({key:t,value:a})=>typeof t=="string"&&typeof a=="string"))throw new Error("data is not valid");return n}catch(e){return new f(e.message)}};function kn(n,e){let r=/{{(.*?)}}|%7B%7B(.*?)%7D%7D/g;return r.test(n)?n.replace(r,(a,o,i)=>{let s=o??i??"";return e.get(s)??s}):n}var[Cn,Ln]=(()=>{let n;return[e=>{n||(n=e)},()=>{if(!n)throw new Error("Placeholders not initialized. Call setPlaceholders() first.");return n}]})();var N=window.matchMedia("(min-width: 767px)"),T={brand:'<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" id="Layer_1" viewBox="0 0 64.57 35"><defs><style>.cls-1{fill: #eb1000;}</style></defs><path class="cls-1" d="M6.27,10.22h4.39l6.2,14.94h-4.64l-3.92-9.92-2.59,6.51h3.08l1.23,3.41H0l6.27-14.94ZM22.03,13.32c.45,0,.94.04,1.43.16v-3.7h3.88v14.72c-.89.4-2.81.89-4.73.89-3.48,0-6.47-1.98-6.47-5.93s2.88-6.13,5.89-6.13ZM22.52,22.19c.36,0,.65-.07.94-.16v-5.42c-.29-.11-.58-.16-.96-.16-1.27,0-2.45.94-2.45,2.92s1.2,2.81,2.47,2.81ZM34.25,13.32c3.23,0,5.98,2.18,5.98,6.02s-2.74,6.02-5.98,6.02-6-2.18-6-6.02,2.72-6.02,6-6.02ZM34.25,22.13c1.11,0,2.14-.89,2.14-2.79s-1.03-2.79-2.14-2.79-2.12.89-2.12,2.79.96,2.79,2.12,2.79ZM41.16,9.78h3.9v3.7c.47-.09.96-.16,1.45-.16,3.03,0,5.84,1.98,5.84,5.86,0,4.1-2.99,6.18-6.53,6.18-1.52,0-3.46-.31-4.66-.87v-14.72ZM45.91,22.17c1.34,0,2.56-.96,2.56-2.94,0-1.85-1.2-2.72-2.5-2.72-.36,0-.65.04-.91.16v5.35c.22.09.51.16.85.16ZM58.97,13.32c2.92,0,5.6,1.87,5.6,5.64,0,.51-.02,1-.09,1.49h-7.27c.4,1.32,1.56,1.94,3.01,1.94,1.18,0,2.27-.29,3.5-.82v2.97c-1.14.58-2.5.82-3.9.82-3.7,0-6.58-2.23-6.58-6.02s2.61-6.02,5.73-6.02ZM60.93,18.02c-.2-1.27-1.05-1.78-1.92-1.78s-1.58.54-1.87,1.78h3.79Z"/></svg>',company:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="22" viewBox="0 0 24 22" fill="none"><path d="M14.2353 21.6209L12.4925 16.7699H8.11657L11.7945 7.51237L17.3741 21.6209H24L15.1548 0.379395H8.90929L0 21.6209H14.2353Z" fill="#EB1000"/></svg>',search:'<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" focusable="false"><path d="M14 2A8 8 0 0 0 7.4 14.5L2.4 19.4a1.5 1.5 0 0 0 2.1 2.1L9.5 16.6A8 8 0 1 0 14 2Zm0 14.1A6.1 6.1 0 1 1 20.1 10 6.1 6.1 0 0 1 14 16.1Z"></path></svg>',home:'<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" height="25" viewBox="0 0 18 18" width="25"><path fill="#6E6E6E" d="M17.666,10.125,9.375,1.834a.53151.53151,0,0,0-.75,0L.334,10.125a.53051.53051,0,0,0,0,.75l.979.9785A.5.5,0,0,0,1.6665,12H2v4.5a.5.5,0,0,0,.5.5h4a.5.5,0,0,0,.5-.5v-5a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5v5a.5.5,0,0,0,.5.5h4a.5.5,0,0,0,.5-.5V12h.3335a.5.5,0,0,0,.3535-.1465l.979-.9785A.53051.53051,0,0,0,17.666,10.125Z"/></svg>',chevronLeft:'<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" focusable="false"><path d="M12.5 4l-5 6 5 6" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',chevronRight:'<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="3" height="6" viewBox="0 0 3 6" focusable="false"><path d="M.5.5 2.5 3 .5 5.5" stroke="currentColor" stroke-width="1" fill="none"/></svg>',chevronDown:'<svg class="chevron-down" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="6" height="3.375" viewBox="0 0 6 3.375" focusable="false"><path d="M.5.5 3 2.875 5.5.5" stroke="currentColor" stroke-width="1" fill="none"/></svg>'};var En=n=>{let e=[],r=n.nextElementSibling??null;for(;r!==null;)e.push(r),r=r.nextElementSibling??null;return e},D=n=>({eval:n,or:e=>D(r=>{try{return n(r)}catch{return e(r)}})}),M=(n,e)=>n.reduce(([r,t],a)=>{try{let[o,i]=e(a);return[[...r,o],[...t,...i]]}catch(o){return o instanceof l?[r,[o,...t]]:[r,t]}},[[],[]]),[Mn,ce]=(()=>{let n,e=!1;return[r=>{e||(n=r,e=!0)},()=>{if(!n)throw new Error("PersonalizationConfig not initialized. Call setPersonalizationConfig() first.");return n}]})(),H=async n=>{try{if(n===null)return new l("URL is null");let e=on(`${n.origin}${n.pathname.replace(/(\.html$|$)/,".plain.html")}${n.hash}`),r=await fetch(e);if(!r.ok)return L(`Request for ${e} failed`),new l(`Request for ${e} failed`);let t=await r.text(),a=await Ln(),o=kn(t,a),{body:i}=new DOMParser().parseFromString(o,"text/html");try{let{handleCommands:s,commands:d}=ce();s(d,i)}catch(s){L(`Personalization not applied: ${s?.message}`)}return i}catch(e){return new l(e?.message)}},R,Z=()=>{if(R)return R;let n=["https://www.adobe.com","https://business.adobe.com","https://blog.adobe.com","https://milo.adobe.com","https://news.adobe.com","graybox.adobe.com"];if(R)return R;let e=window.location.origin;R=n.some(a=>{let o=e.replace(".stage","");return a.startsWith("https://")?o===a:o.endsWith(a)})?e:"https://www.adobe.com";let t=window.location.hostname.includes(".aem.")?"aem":"hlx";return(e.includes("localhost")||e.includes(`.${t}.`))&&(R=`https://main--federal--adobecom.aem.${e.endsWith(".live")?"live":"page"}`),R},on=(n="")=>{if(n.includes("c2-poc--milo--adobecom"))return n.replace("c2-poc--milo--adobecom","main--federal--adobecom");if(n.includes("c2-poc-feds-gnav--milo--adobecom"))return n.replace("c2-poc-feds-gnav--milo--adobecom","main--federal--adobecom");if(n.includes("localhost:3000"))return n.replace("localhost:3000","main--federal--adobecom.aem.page");if(typeof n!="string"||!n.includes("/federal/"))return n;if(n.startsWith("/"))return`${Z()}${n}`;try{let{pathname:e,search:r,hash:t}=new URL(n);return`${Z()}${e}${r}${t}`}catch(e){let r=e instanceof Error?e.message:String(e);console.warn(`getFederatedUrl errored parsing the URL: ${n}: ${r}`)}return n},Tn=(n,e)=>{let r=(t,a)=>{let o=`${t}[${a}^="./media_"]`;e.querySelectorAll(o).forEach(s=>{let d=s.getAttribute(a);if(d)try{let c=on(new URL(d,new URL(n,window.location.href)).href);s.setAttribute(a,c)}catch(c){console.warn(`[MediaPathError]: Failed to process relative media path (${d}) for ${t}`,c)}})};r("img","src"),r("source","srcset")},_n=async n=>{let e=async(r,t)=>{if(r instanceof l)return r;try{let o=[...r.querySelectorAll('a[href*="#_inline"]')].map(async i=>{try{if(t.has(i.href))return;let s=on(i.href),d=new URL(s),c=await H(d);if(t.add(i.href),c instanceof l)throw c;await e(c,t),i.replaceWith(...c.children);return}catch{return}},[]);return await Promise.all(o),r}catch(a){return new l(JSON.stringify(a))}};return e(n,new Set)},Sn=(n,e)=>n.map(r=>`<li>${e(r)}</li>`).join(""),B=n=>n.toLowerCase().trim().replace(/[^a-z0-9]/g,"-").replace(/-+/g,"-").replace(/^-+|-+$/g,"").replace(/^(\d)/,"id-$1"),k=(n,e)=>{let r=n!==null&&n!==""?` daa-lh="${n}"`:"",t=e!==null&&e!==""?` daa-ll="${e}"`:"";return`${r}${t}`},Pn=()=>!0;function pe(n,{id:e,as:r,callback:t,crossorigin:a,rel:o,fetchpriority:i}={rel:"stylesheet"}){let s=document.head.querySelector(`link[href="${n}"]`);if(s)return t?.("noop"),s;let d=document.createElement("link");return d.setAttribute("rel",o),e!==void 0&&d.setAttribute("id",e),r!==void 0&&d.setAttribute("as",r),a!==void 0&&d.setAttribute("crossorigin",a),i!==void 0&&d.setAttribute("fetchpriority",i),d.setAttribute("href",n),t&&(d.onload=c=>t(c.type),d.onerror=c=>t(typeof c=="string"?"error":c.type)),document.head.appendChild(d),d}function ge(n,e){return pe(n,{rel:"stylesheet",callback:e})}function sn(n,e=!1){e&&ge(n)}var ln=(n,e,{mode:r,id:t}={})=>new Promise((a,o)=>{let i=document.querySelector(`head > script[src="${n}"]`);if(!i){let{head:c}=document;i=document.createElement("script"),i.setAttribute("src",n),t!=null&&i.setAttribute("id",t),e!=null&&i.setAttribute("type",e),r&&["async","defer"].includes(r)&&i.setAttribute(r,""),c.append(i)}let s=i.dataset.loaded;if(s!=null){a(i);return}let d=c=>{i.removeEventListener("load",d),i.removeEventListener("error",d),c.type==="error"?o(new Error(`error loading script: ${i.src}`)):c.type==="load"&&(i.dataset.loaded="true",a(i))};i.addEventListener("load",d),i.addEventListener("error",d)});function O(n,e=document){let r=n&&n.includes(":")?"property":"name";return e.head.querySelector(`meta[${r}="${n}"]`)?.content??null}var ue=n=>{let e=n,r=o=>o==null||typeof o!="object";if(r(e)||r(e.locale)||typeof e.locale.prefix!="string"||r(e.env)||typeof e.env.name!="string")return!1;if(e.unav!==void 0){if(typeof e.unav!="object"||e.unav===null)return!1;let o=e.unav;if(o.profile!==void 0){if(typeof o.profile!="object"||o.profile===null)return!1;let i=o.profile;if(i.signInCtaStyle!==void 0&&i.signInCtaStyle!=="primary"&&i.signInCtaStyle!=="secondary"||i.messageEventListener!==void 0&&typeof i.messageEventListener!="function")return!1}}return!(e.jarvis!==void 0&&(typeof e.jarvis!="object"||e.jarvis===null||typeof e.jarvis.id!="string"))},[dn,E]=(()=>{let n,e=!1;return[r=>{if(!e){if(!ue(r))throw new Error("MiloConfig validation failed: Invalid structure");n=r,e=!0}},()=>{if(!n)throw new Error("MiloConfig not initialized. Call setMiloConfig() first.");return n}]})(),fe={en:"US","en-gb":"GB","es-mx":"MX","fr-ca":"CA",da:"DK",et:"EE",ar:"DZ",el:"GR",iw:"IL",he:"IL",id:"ID",ms:"MY",nb:"NO",sl:"SI",sv:"SE",cs:"CZ",uk:"UA",hi:"IN","zh-hans":"CN","zh-hant":"TW",ja:"JP",ko:"KR",fil:"PH",th:"TH",vi:"VN"},An={ar:"AR_es",be_en:"BE_en",be_fr:"BE_fr",be_nl:"BE_nl",br:"BR_pt",ca:"CA_en",ch_de:"CH_de",ch_fr:"CH_fr",ch_it:"CH_it",cl:"CL_es",co:"CO_es",la:"DO_es",mx:"MX_es",pe:"PE_es",africa:"MU_en",dk:"DK_da",de:"DE_de",ee:"EE_et",eg_ar:"EG_ar",eg_en:"EG_en",es:"ES_es",fr:"FR_fr",gr_el:"GR_el",gr_en:"GR_en",ie:"IE_en",il_he:"IL_iw",it:"IT_it",lv:"LV_lv",lt:"LT_lt",lu_de:"LU_de",lu_en:"LU_en",lu_fr:"LU_fr",my_en:"MY_en",my_ms:"MY_ms",hu:"HU_hu",mt:"MT_en",mena_en:"DZ_en",mena_ar:"DZ_ar",nl:"NL_nl",no:"NO_nb",pl:"PL_pl",pt:"PT_pt",ro:"RO_ro",si:"SI_sl",sk:"SK_sk",fi:"FI_fi",se:"SE_sv",tr:"TR_tr",uk:"GB_en",at:"AT_de",cz:"CZ_cs",bg:"BG_bg",ru:"RU_ru",ua:"UA_uk",au:"AU_en",in_en:"IN_en",in_hi:"IN_hi",id_en:"ID_en",id_id:"ID_id",nz:"NZ_en",sa_ar:"SA_ar",sa_en:"SA_en",sg:"SG_en",cn:"CN_zh-Hans",tw:"TW_zh-Hant",hk_zh:"HK_zh-hant",jp:"JP_ja",kr:"KR_ko",za:"ZA_en",ng:"NG_en",cr:"CR_es",ec:"EC_es",pr:"US_es",gt:"GT_es",cis_en:"TM_en",cis_ru:"TM_ru",sea:"SG_en",th_en:"TH_en",th_th:"TH_th"};function me(n){let e=fe[n];return!e&&An[n]&&(e=n),!e&&n.includes("-")&&([e]=n.split("-")),e||"US"}var an="langstore/";function $n(n){let r=(n?.prefix||"US_en").replace("/","")??"",[t="US",a="en"]=(An[r]??r).split("_",2);if(r.startsWith(an)||window.location.pathname.startsWith(`/${an}`)){let o=r.replace(an,"").toLowerCase();t=me(o),a=o}return t=t.toUpperCase(),a=a.toLowerCase(),{language:a,country:t,locale:`${a}_${t}`}}var K={elementNull:"Error when parsing Link. Element is null",notAnchor:"Cannot parse non-anchor as Link",textContentNotFound:"Error when parsing Link. Element has no textContent",hrefNotFound:"Element has no href"},C=n=>{if(n===null)throw new l(K.elementNull);if(n.tagName!=="A")throw new l(K.notAnchor);let[e,r]=n?.textContent?.split("|").map(o=>o.trim())??["",""];if(e==="")throw new l(K.textContentNotFound);let t=n?.getAttribute("href")??"";if(t==="")throw new l(K.hrefNotFound);let a=n.getAttribute("daa-ll");return[{type:"Link",text:e,href:t,daaLl:a,ariaLabel:r},[]]};var cn=n=>D(he).or(ve).or(be).eval(n),S={elementNull:"Element not found",noTitleAnchor:"Title anchor not found",noHref:"Title Anchor has no href",noTitle:"Title text not found",noSubtitleP:"Subtitle <p> not found",noSubtitle:"Subtitle text not found",notAHeader:"Expected a Header class"},ve=n=>{let e=new Set;if(!n)throw new l(S.elementNull);let r=n.querySelector("p a")??n.querySelector("div ~ div > a");if(!r)throw new l(S.noTitleAnchor);let t=r.textContent??"";t===""&&e.add(new f(S.noTitle));let a=r.getAttribute("href")??"";a===""&&e.add(new f(S.noHref));let o=r.getAttribute("daa-ll"),i=r.getAttribute("daa-lh"),s=r?.closest("p")?.nextElementSibling;s||e.add(new f(S.noSubtitleP));let d=s?.textContent??"";d===""&&e.add(new f(S.noSubtitle));let c=[],y=null,x=null;n.classList.contains("new")&&c.push("New"),n.classList.contains("show-offer")&&(c.push("Save 20%"),y="$29.99",x="$19.99");let[g,p=null]=(n.firstElementChild?.firstElementChild?.textContent?.split("|")??[]).map(u=>u.trim());return[{type:"LinkGroupLink",iconHref:g,iconAlt:p,title:t,href:a,subtitle:d,badges:c,oldPrice:y,newPrice:x,daaLl:o,daaLh:i},[...e]]},he=n=>{if(!n)throw new l(S.elementNull);let e=[...n.classList];if(!e.includes("header"))throw new l(S.notAHeader);let r=n.querySelector("a")?.textContent??"",t=n.querySelector("a")?.getAttribute("daa-ll")??null,a=n.querySelector("a")?.getAttribute("daa-lh")??null;if(r==="")throw new l(S.noTitle);return[{type:"LinkGroupHeader",title:r,classes:e,daaLl:t,daaLh:a},[]]},be=n=>{if(!n)throw new l(S.elementNull);if(!n.classList.contains("blue"))throw new Error("Not a Blue Link Group");let e=n.querySelector("a"),[r,t]=C(e),a=e?.getAttribute("daa-ll")??null,o=e?.getAttribute("daa-lh")??null;return[{type:"LinkGroupBlue",link:r,daaLl:a,daaLh:o},t]};var pn=n=>{switch(n.type){case"LinkGroupHeader":return ye(n);case"LinkGroupLink":return xe(n);case"LinkGroupBlue":return we(n);default:return console.error(n),""}},ye=({title:n,classes:e,daaLl:r,daaLh:t})=>{let a=e.slice(1).map(i=>`feds-link-group--${i}`).join(" "),o=k(t,r??n);return`
    <div role="heading" class="feds-link-group ${a}"${o}>
      <div class="feds-link-group__content">
        <div class="feds-link-group__title">${n}</div>
      </div>
    </div>
  `},xe=({iconHref:n,iconAlt:e,title:r,href:t,subtitle:a,badges:o=[],oldPrice:i=null,newPrice:s=null,daaLl:d,daaLh:c})=>{let y=e!==null&&n!==null,x=k(c,d??r),g=y?`
      <picture class="feds-link-group__icon">
        <img
          loading="lazy"
          src="${n}"
          alt="${e}"
          class="feds-link-group__icon-img"
        >
      </picture>
    `:"",p=o.length===0?"":`
      <div class="feds-link-group__badges">
        ${o.map((b,m)=>`
          <span class="feds-link-group__badge${m>0?" feds-link-group__badge--filled":""}">
            ${b}
          </span>
        `).join("")}
      </div>
    `,u=a===""?"":`<div class="feds-link-group__subtitle">${a}</div>`,v=i===null&&s===null?"":`
      <div class="feds-link-group__price">
        ${i===null?"":`<span class="feds-link-group__old-price">${i}</span>`}
        ${s===null?"":`<span class="feds-link-group__new-price">${s}</span>`}
      </div>
    `;return`
    <a class="feds-link-group" href="${t}"${x}>
      <div class="feds-link-header">
        ${g}
        ${p}
      </div>
      <div class="feds-link-group__content">
       
        <div class="feds-link-group__title">${r}</div>
        ${u}
        ${v}
      </div>
    </a>
  `},we=({link:n,daaLl:e,daaLh:r})=>{let t=k(r,e??n.text);return`
  <a href="${n.href}" class="feds-link-group feds-link-group--blue"${t}>
    <div class="feds-link-group__content">
        <div class="feds-link-group__title">${n.text}</div>
      </div>
  </a>
`};var V={elementNull:"Error when parsing Brand. Element is null",noLinks:"Error when parsing Brand. No links found",noPrimaryLink:"Error when parsing Brand. No primary link found"},z=/(\.png|\.jpg|\.jpeg|\.svg)/i,ke=n=>{let e=n.querySelector("picture img")?.getAttribute("src")??null;if(e!==null&&e!=="")return e;let r=n.textContent?.trim();if(r!==void 0&&r!==""&&z.test(r)){let a=r.split("|")[0]?.trim();if(a!==void 0&&a!=="")return a}let t=n.getAttribute("href");return t!==null&&t!==""&&z.test(t)?t:null},Ce=n=>{let e=n.textContent?.trim();if(e?.includes("|")===!0){let t=e.split("|")[1]?.trim();if(t)return t}return n.querySelector("img")?.getAttribute("alt")??""},gn=n=>{if(n===null)throw new l(V.elementNull);let e=n.querySelector(".gnav-brand");if(e===null)throw new l(V.elementNull);let r=[...e.querySelectorAll("a")];if(r.length===0)throw new l(V.noLinks);let t=r.find(m=>{let h=m.textContent??"";return!z.test(m.href)&&!z.test(h)});if(!t)throw new l(V.noPrimaryLink);let a=e.matches(".brand-image-only"),o=e.matches(".no-logo"),i=e.matches(".image-only"),s=!o,d=!a&&!i,c=r.filter(m=>{let h=m.textContent??"";return z.test(m.href)||z.test(h)}),[y,x,g]=(()=>{let m=a?T.brand:T.company,[h=null,w=null]=[...e.querySelectorAll('picture img[src$=".svg"]')].map(tn=>tn?.src).filter(tn=>tn?.length>0),[I=null,W=null]=c.map(ke),se=c[0]instanceof Element?Ce(c[0]):t.textContent?.trim()??"";return[I??h??m,W??w,se]})(),p=t.textContent?.trim()??"",u=t.href;if(!s&&!d)return[{type:"Brand",data:{type:"NoRender"}},[]];let v=(m,h)=>{let w=h!=null&&h!=="";return Pn()&&w?h:m},b=y.startsWith("<svg")?{type:"inline-svg",svgContent:v(y,x),alt:g}:{type:"image",src:v(y,x),alt:g};return s&&d?[{type:"Brand",data:{type:"LabelledBrand",href:u,label:p,image:b}},[]]:s&&a?[{type:"Brand",data:{type:"BrandImageOnly",href:u,image:b,alt:g}},[]]:s&&i?[{type:"Brand",data:{type:"ImageOnlyBrand",href:u,image:b,alt:g}},[]]:[{type:"Brand",data:{type:"BrandLabelOnly",href:u,label:p}},[]]};var un=(n,e)=>{let r=`feds-brand-image${e?" brand-image-only":""}`;if(n.type==="inline-svg")return`<span class="${r}">${n.svgContent}</span>`;let t=n.alt?` alt="${n.alt}"`:"";return`<span class="${r}"><img src="${n.src}"${t} /></span>`},Le=`
<?xml
version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64.57 35" fill="currentColor">
    <path d="M6.27,10.22h4.39l6.2,14.94h-4.64l-3.92-9.92-2.59,6.51h3.08l1.23,3.41H0l6.27-14.94ZM22.03,13.32c.45,0,.94.04,1.43.16v-3.7h3.88v14.72c-.89.4-2.81.89-4.73.89-3.48,0-6.47-1.98-6.47-5.93s2.88-6.13,5.89-6.13ZM22.52,22.19c.36,0,.65-.07.94-.16v-5.42c-.29-.11-.58-.16-.96-.16-1.27,0-2.45.94-2.45,2.92s1.2,2.81,2.47,2.81ZM34.25,13.32c3.23,0,5.98,2.18,5.98,6.02s-2.74,6.02-5.98,6.02-6-2.18-6-6.02,2.72-6.02,6-6.02ZM34.25,22.13c1.11,0,2.14-.89,2.14-2.79s-1.03-2.79-2.14-2.79-2.12.89-2.12,2.79.96,2.79,2.12,2.79ZM41.16,9.78h3.9v3.7c.47-.09.96-.16,1.45-.16,3.03,0,5.84,1.98,5.84,5.86,0,4.1-2.99,6.18-6.53,6.18-1.52,0-3.46-.31-4.66-.87v-14.72ZM45.91,22.17c1.34,0,2.56-.96,2.56-2.94,0-1.85-1.2-2.72-2.5-2.72-.36,0-.65.04-.91.16v5.35c.22.09.51.16.85.16ZM58.97,13.32c2.92,0,5.6,1.87,5.6,5.64,0,.51-.02,1-.09,1.49h-7.27c.4,1.32,1.56,1.94,3.01,1.94,1.18,0,2.27-.29,3.5-.82v2.97c-1.14.58-2.5.82-3.9.82-3.7,0-6.58-2.23-6.58-6.02s2.61-6.02,5.73-6.02ZM60.93,18.02c-.2-1.27-1.05-1.78-1.92-1.78s-1.58.54-1.87,1.78h3.79Z"/>
</svg>
`.trim(),Ee=`
<svg preserveAspectRatio="none" width="100%" height="100%" overflow="visible" style="display: block;" viewBox="0 0 18 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path id="Logo" d="M17.5512 15.9999H13.8827C13.7233 16.0027 13.5666 15.9587 13.4326 15.8735C13.2987 15.7882 13.1934 15.6656 13.1303 15.5211L9.1476 6.3291C9.1372 6.29332 9.11539 6.26179 9.08542 6.23919C9.05545 6.2166 9.0189 6.20413 8.98118 6.20365C8.94347 6.20316 8.9066 6.21469 8.87605 6.2365C8.84549 6.25832 8.82286 6.28928 8.81152 6.32478L6.32954 12.161C6.31607 12.1925 6.31072 12.2269 6.31397 12.261C6.31721 12.2951 6.32896 12.3279 6.34815 12.3565C6.36735 12.385 6.39339 12.4084 6.42398 12.4246C6.45456 12.4408 6.48872 12.4493 6.52343 12.4493H9.25162C9.33426 12.4493 9.41508 12.4733 9.48398 12.5183C9.55288 12.5634 9.60681 12.6275 9.63905 12.7026L10.8335 15.3264C10.8652 15.4 10.8778 15.4802 10.8704 15.5599C10.863 15.6395 10.8357 15.7161 10.791 15.7828C10.7463 15.8495 10.6856 15.9042 10.6142 15.9421C10.5429 15.98 10.4631 15.9998 10.3821 15.9999H0.450101C0.375399 15.9994 0.301967 15.9808 0.236351 15.9455C0.170735 15.9103 0.114973 15.8595 0.0740362 15.7979C0.0330997 15.7362 0.00826021 15.6655 0.00173221 15.592C-0.00479579 15.5185 0.00719033 15.4446 0.0366223 15.3769L6.35412 0.526466C6.41869 0.369291 6.52976 0.234984 6.67284 0.141079C6.81593 0.0471732 6.98437 -0.00196688 7.15618 7.38373e-05H10.7999C10.9718 -0.00217252 11.1403 0.0468839 11.2835 0.140814C11.4266 0.234745 11.5377 0.369168 11.6021 0.526466L17.9633 15.3769C17.9927 15.4445 18.0048 15.5183 17.9983 15.5917C17.9919 15.665 17.9672 15.7357 17.9264 15.7973C17.8856 15.859 17.83 15.9097 17.7646 15.9451C17.6991 15.9804 17.6258 15.9992 17.5512 15.9999V15.9999Z" />
</svg>
`.trim(),X=(n,e,r="")=>`<div class="feds-brand-container">
    <a href="${n}" class="feds-brand" daa-ll="Brand"${r}>
      <span class="feds-brand-image brand-image-only desktop-brand">
        ${Le}
      </span>
      <span class="feds-brand-image brand-image-only mobile-brand">
        ${Ee}
      </span>
    </a>
  </div>`.trim(),fn=n=>{let{data:e}=n;switch(e.type){case"LabelledBrand":return X(e.href,un(e.image,!1)+`<span class="feds-brand-label">${e.label}</span>`);case"BrandImageOnly":{let r=e.alt?` aria-label="${e.alt}"`:"";return X(e.href,un(e.image,!0),r)}case"ImageOnlyBrand":{let r=e.alt?` aria-label="${e.alt}"`:"";return X(e.href,un(e.image,!1),r)}case"BrandLabelOnly":return X(e.href,`<span class="feds-brand-label">${e.label}</span>`);case"NoRender":return"";default:return""}};var mn=["appswitcher","help"],J={cs:["cz"],da:["dk"],de:["at"],en:["africa","au","ca","ie","in","mt","ng","nz","sg","za"],es:["ar","cl","co","cr","ec","gt","la","mx","pe","pr"],et:["ee"],ja:["jp"],ko:["kr"],nb:["no"],pt:["br"],sl:["si"],sv:["se"],uk:["ua"],zh:["cn","tw"]},[j,Rn]=(()=>{let n,e,r,t=new Promise(a=>{e=a,r=setTimeout(()=>{n={},a(n)},5e3)});return[a=>{a&&!n&&(n=a,clearTimeout(r),e?.(n))},()=>t]})();function Y(n,e=!1){let s=(/uc_carts=/.test(document.cookie)?n:n?.filter(c=>c!=="cart"))??[],d=s.length??3;if(e){let c=s.filter(x=>mn.includes(x)).length;return`calc(92px + ${c*32}px + ${c*.25}rem)`}return`calc(${d*32}px + ${(d-1)*.25}rem)`}var Q=n=>{if(!n.prefix||n.prefix==="/")return"en_US";let e=n.prefix.replace("/","");if(e.includes("_")){let[t,a]=e.split("_").reverse();return`${t.toLowerCase()}_${a.toUpperCase()}`}if(e==="uk")return"en_GB";let r=Object.keys(J).find(t=>J[t].includes(e));return r?`${r.toLowerCase()}_${e.toUpperCase()}`:`${e.toLowerCase()}_${e.toUpperCase()}`},Me={Mac:"macOS",Win:"windows",Linux:"linux",CrOS:"chromeOS",Android:"android",iPad:"iPadOS",iPhone:"iOS"},nn=()=>{let n=navigator.userAgent;for(let[e,r]of Object.entries(Me))if(n.includes(e))return r;return"linux"},en=async()=>{let n=window;return n.alloy?await n.alloy("getIdentity").then(e=>e?.identity?.ECID).catch(()=>{}):void 0};var In=()=>{try{return E().signInContext||{}}catch{return{}}},Te=()=>{let n=E();return O("signin-cta-style")==="primary"||n?.unav?.profile?.signInCtaStyle==="primary"?"primary":"secondary"},_e=()=>{let e=E()?.unav?.profile?.messageEventListener;return e||(r=>{let{name:t,payload:a,executeDefaultAction:o}=r.detail;if(!(!t||t!=="System"||!a||typeof o!="function"))switch(a.subType){case"AppInitiated":window.adobeProfile?.getUserProfile().then(i=>{j(i)}).catch(()=>{j({})});break;case"SignOut":o();break;case"ProfileSwitch":Promise.resolve(o()).then(i=>{i&&window.location.reload()});break;default:break}})};function Se(){let{unav:n}=E();return n?.unavHelpChildren||[{type:"Support"},{type:"Community"}]}var q=()=>{let n=E();return{profile:{name:"profile",attributes:{accountMenuContext:{sharedContextConfig:{enableLocalSection:!0,enableProfileSwitcher:!0,miniAppContext:{logger:{trace:()=>{},debug:()=>{},info:()=>{},warn:()=>{},error:()=>{}}},complexConfig:n?.unav?.profile?.complexConfig||null,...n?.unav?.profile?.config},messageEventListener:_e()},signInCtaStyle:Te(),isSignUpRequired:!1,callbacks:{onSignIn:()=>{window.adobeIMS?.signIn(In())},onSignUp:()=>{window.adobeIMS?.signIn(In())}}}},appswitcher:{name:"app-switcher"},notifications:{name:"notifications",attributes:{notificationsConfig:{applicationContext:{appID:n?.unav?.uncAppId||"adobecom",...n?.unav?.uncConfig}}}},help:{name:"help",attributes:{children:Se()}},jarvis:{name:"jarvis",attributes:{appid:n?.jarvis?.id,callbacks:n?.jarvis?.callbacks}},cart:{name:"cart"}}};var Hn=(n,e)=>{n[0]&&"attributes"in n[0]&&n[0].attributes&&typeof n[0].attributes=="object"&&"isSignUpRequired"in n[0].attributes&&(n[0].attributes.isSignUpRequired=e)},rn=async(n,e)=>{try{let r=n.querySelector(".feds-utilities");if(!(r instanceof HTMLElement))return new f('missing ".feds-utilities" container');let t=new Set,a=document.head.querySelector('meta[name="universal-nav"]'),o=a instanceof HTMLMetaElement?a.content??"":"";a instanceof HTMLMetaElement||t.add(new f('metadata "universal-nav" is missing'));let i=o.trim();a instanceof HTMLMetaElement&&i.length===0&&t.add(new f('metadata "universal-nav" has no value'));let s=!window.adobeIMS?.isSignedInUser(),d=i.split(",").map(m=>m.trim()).filter(m=>Object.keys(q()).includes(m)||m==="signup");if(s){let m=Y(d,s);r.style.setProperty("min-width",m)}let c;try{c=E()}catch{throw new Error("MiloConfig not available for UNAV initialization")}let y=Q(c.locale),x=c.env.name==="prod"?"prod":"stage",g=await en(),p=new URLSearchParams(window.location.search).get("unavVersion");/^\d+(\.\d+)?$/.test(p??"")||(p="1.5"),await Promise.all([ln(`https://${x}.adobeccstatic.com/unav/${p}/UniversalNav.js`),sn(`https://${x}.adobeccstatic.com/unav/${p}/UniversalNav.css`,!0)]);let u=()=>{let m=q(),h=[m.profile];return Hn(h,!1),d?.forEach(w=>{if(w==="profile")return;if(w==="signup"){Hn(h,!0);return}let I=m[w];I&&h.push(I)}),h},v=()=>({target:r,env:x,locale:y,countryCode:$n(c?.locale)?.country||"US",imsClientId:window?.adobeid?.client_id,theme:"light",analyticsContext:{consumer:{name:"adobecom",version:"1.0",platform:"Web",device:nn(),os_version:navigator.platform},event:{visitor_guid:g}},children:u(),isSectionDividerRequired:!!c?.unav?.showSectionDivider,showTrayExperience:!N.matches});await window?.UniversalNav?.(v()),s||r?.style.removeProperty("min-width");let b=m=>{window?.UniversalNav?.reload(v())};return N.addEventListener("change",()=>{b()}),{reloadUnav:b,errors:t}}catch(r){let t=r instanceof Error?r.message:"failed to load universal nav";return new f(t)}};function $(n,e){return[...n.querySelectorAll(e)]}function F(n,e,r){$(n,e).forEach(t=>r?t.removeAttribute("tabindex"):t.setAttribute("tabindex","-1"))}var U={ArrowLeft:-1,ArrowRight:1,ArrowUp:-1,ArrowDown:1},zn=new Set(["ArrowLeft","ArrowRight"]),Pe=new Set(["ArrowUp","ArrowDown"]),Ae='.tabs [role="tab"][aria-selected="true"]';function vn(n,e,r){return(n+e+r)%r}function $e(n,e,r,t){let a=U[r];if(zn.has(r)){let p=e+a;return p>=0&&p<n.length?p:null}let o=getComputedStyle(t).gridTemplateColumns.split(" ").length,i=[...t.children],s=p=>{let u=n[p].parentElement;return u?i.indexOf(u):-1},d=s(e)%o,c=Math.floor(s(e)/o)+(r==="ArrowDown"?1:-1),y=Math.floor((i.length-1)/o);if(c<0||c>y)return null;let x=null,g=1/0;for(let p=0;p<n.length;p++){let u=Math.abs(s(p)%o-d);Math.floor(s(p)/o)===c&&u<g&&(g=u,x=p)}return x}function hn(n){F(n,'.tab-content [role="tabpanel"] a',!1);let e=[];$(n,".feds-popup[popover]").forEach(g=>{let p=()=>{g.matches(":popover-open")||F(g,'[role="tabpanel"] a',!1)};g.addEventListener("toggle",p),e.push(()=>g.removeEventListener("toggle",p))});let r=(g,p)=>{g.focus(),p.preventDefault()},t=()=>n.querySelector(".feds-popup:popover-open"),a=g=>g.querySelector(Ae),o=g=>g.querySelector('[role="tabpanel"]:not([hidden])');function i(g){let p=t(),u=n.querySelector("#feds-menu-wrapper");if(!u)return!1;let v=p??(u?.matches(":popover-open")?u:null);if(!v)return!1;v.hidePopover?.();let b=p?`[popovertarget="${v.id}"]`:".feds-nav-toggle";return n.querySelector(b)?.focus(),g.preventDefault(),!0}function s(g,p,u){if(!zn.has(p))return!1;let v=$(n,".feds-gnav-items > li > .feds-link"),b=v.indexOf(g);return b<0?!1:(r(v[vn(b,U[p],v.length)],u),!0)}function d(g,p,u,v){let b=$(p,'.tabs :is([role="tab"], .product-links a)'),m=b.indexOf(g);if(m<0)return!1;if(U[u]){let h=b[vn(m,U[u],b.length)];return h.matches('[role="tab"]')&&h.click(),r(h,v),!0}if(u==="Tab"&&!v.shiftKey&&g.matches('[aria-selected="true"]')){let h=o(p);if(!h)return!1;F(h,"a",!0);let w=h.querySelector("a");return w&&r(w,v),!0}return!1}function c(g,p,u,v){let b=o(p);if(!b)return!1;let m=$(b,"a"),h=m.indexOf(g);if(h<0)return!1;if(U[u]){let w=$e(m,h,u,b);return w!==null?(r(m[w],v),!0):u==="ArrowUp"?(F(b,"a",!1),r(a(p)??m[0],v),!0):!1}if(u==="Tab"&&!v.shiftKey){if(h+1<m.length)r(m[h+1],v);else{let w=$(p,'.tabs [role="tab"]'),I=a(p),W=w[w.indexOf(I)+1]??p.querySelector(".product-links a");if(W)r(W,v);else return!1}return!0}if(u==="Tab"&&v.shiftKey){if(h>0)r(m[h-1],v);else{F(b,"a",!1);let w=a(p)??$(p,'.tabs :is([role="tab"], .product-links a)')[0];w&&r(w,v)}return!0}return!1}function y(g,p,u,v){if(!Pe.has(u))return!1;let b=$(p,".feds-gnav-cards a"),m=b.indexOf(g);return m<0?!1:(r(b[vn(m,U[u],b.length)],v),!0)}function x(g){let p=document.activeElement??g.target;if(g.key==="Escape"){i(g);return}let u=t();u&&(u.matches(":has(.product-list)")&&(d(p,u,g.key,g)||c(p,u,g.key,g))||u.matches(":has(.feds-gnav-cards)")&&y(p,u,g.key,g))||s(p,g.key,g)}return n.addEventListener("keydown",x),e.push(()=>n.removeEventListener("keydown",x)),()=>e.forEach(g=>g())}var Re="feds-milo",L=(n,e="default",r="e")=>{let{locale:t}=E(),a=O("gnav-source")??`${t.contentRoot??""}/gnav`;window.lana||console.warn("lana logging unavailable in the gnav"),window?.lana?.log(`${n} | gnav-source: ${a} | href: ${window.location.href}`,{clientId:Re,sampleRate:1,tags:e,errorType:r})};var l=class n extends Error{constructor(e){super(e),Object.setPrototypeOf(this,n.prototype)}},f=class n extends Error{constructor(e,r="Minor"){super(e),Object.setPrototypeOf(this,n.prototype),r==="Critical"&&L(e)}};var Un=n=>e=>{if(e===null)throw new Error("");let r=e.querySelector(Ie(n));if(!r)throw new Error("");let[{text:t,href:a,daaLl:o,ariaLabel:i},s]=C(r);return[{type:n.type,text:t,href:a,daaLl:o,ariaLabel:i},s]},bn=Un({type:"PrimaryCTA"}),P=Un({type:"SecondaryCTA"}),Gn=n=>D(bn).or(P).eval(n),Ie=({type:n})=>{switch(n){case"PrimaryCTA":return"strong > a";case"SecondaryCTA":return"em > a";default:throw new Error("")}};var yn=({text:n,href:e,daaLl:r,ariaLabel:t})=>`
<a href="${e}"
  class="feds-primary-cta"
  ${t?`aria-label="${t}"`:""}
  ${k(null,r??n)}
>
  ${n}
</a>
`,A=({text:n,href:e,daaLl:r,ariaLabel:t})=>`
<a href="${e}" 
  class="feds-secondary-cta" 
  ${t?`aria-label="${t}"`:""}
  ${k(null,r??n)}
>
  ${n}
</a>
`,Nn=n=>n.type==="PrimaryCTA"?yn(n):A(n);var G=({text:n,href:e,daaLl:r})=>`<a class="feds-link" href="${e}"${k(null,r??n)}>${n}</a>`;var Dn=n=>{let[e,r]=He(n);return[{type:"LinksCard",card:e},r]},He=n=>{let e=n.querySelector("h2, h3, h4")||null;if(!e)throw new l("Expected links card title");let r=n.querySelector("em > a"),t=[...n.querySelectorAll("a")].filter(d=>d!==r);if(t.length===0)throw new l("Expected at least one link");let[a,o]=M(t,C),[i,s]=(()=>{try{return P(n)}catch{return[null,[]]}})();return[{type:"LinksCardItem",title:e.textContent??"",links:a,footerCTA:i},[...o,...s]]};var Bn=n=>{let e=[...n.querySelectorAll("li > div")],r=[...n.querySelectorAll("li > a")],[t,a]=M(e,ze),[o,i]=M(r,C);return[{type:"ProductList",categories:t,links:o},[...a,...i]]},ze=n=>{let e=n.firstElementChild;if(e?.nodeName!=="H2")throw new l("Expected H2");let r=e.textContent??"",t=e.textContent??"",a=En(e),[o,i]=M(a,cn);return[{type:"ProductCategory",name:r,daaLh:t,links:o},i]};var On=n=>{let[e,r]=Ue(n);return[{type:"FeaturedCard",card:e},r]},Ue=n=>{let e=n.querySelector("h5")||null;if(!e)throw new f("Eye brow element not found");let r=n.querySelector("h4")||null,t=r?.nextElementSibling||null;if(!r)throw new l("Expected title");if(!t)throw new l("Expected subtitle");let a=t.nextElementSibling?.firstElementChild||null;if(!a)throw new l("Expected card link after subtitle");let[o,i]=C(a),[s,d]=P(n);return[{type:"Card",title:r.textContent??"",subtitle:t.textContent??"",bodyLink:o,footerCTA:s,eyeBrow:e.textContent??""},[...d,...i]]};var _={MissingBackgroundImageSection:"Promo card is missing background image section",MissingBackgroundImage:"Promo card is missing background image",MissingBackgroundImageAlt:"Promo card background image is missing alt text",MissingBackgroundImageSrc:"Promo card background image is missing src",MissingContentSection:"Promo card is missing card details section",MissingIcon:"Promo card is missing icon",MissingIconSrc:"Promo card icon is missing src",MissingIconAlt:"Promo card icon is missing alt text",MissingTitleElement:"Promo card is missing title element",MissingTitleText:"Promo card is missing title text",MissingSecondaryCtaAnchor:"Promo card is missing secondary CTA anchor"},jn=n=>{let[e,r]=n.querySelectorAll(":scope > div"),t=new Set;if(e===void 0)throw new l(_.MissingBackgroundImageSection);let a=e.querySelector(":scope picture:not(:scope p picture) img")??null;a===null&&t.add(new f(_.MissingBackgroundImage));let o=a?.getAttribute("alt")??"";o===""&&t.add(new f(_.MissingBackgroundImageAlt));let i=a?.getAttribute("src")??"";if(i===""&&t.add(new f(_.MissingBackgroundImageSrc)),r===void 0)throw new l(_.MissingContentSection);let s=r.querySelector('a[href$=".svg"]')??null;s===null&&t.add(new f(_.MissingIcon));let[d,c]=(s?.textContent?.split("|")??["",""]).map(v=>v.trim());d===""&&t.add(new f(_.MissingIconSrc)),c===""&&t.add(new f(_.MissingIconAlt));let y=r.querySelector("p > strong")??null;if(y===null)throw new l(_.MissingTitleElement);let x=y?.textContent??"";x===""&&t.add(new f(_.MissingTitleText)),r.querySelector("em > a")===null&&t.add(new f(_.MissingSecondaryCtaAnchor));let[p,u]=(()=>{try{return P(n)}catch{return[null,[]]}})();return u.forEach(v=>t.add(v)),[{type:"PromoCard",card:{bgImageAlt:o,bgImageSrc:i,iconAlt:c,iconSrc:d,title:x,cta:p}},[...t]]};var Fn=n=>{let e=new Set;if(n===null)throw new l(qn.elementNull);let r=n.querySelector("h2")?.textContent??"";r===""&&e.add(new f(qn.noTitle));let t=(async()=>{try{let a=n.querySelector("a"),o=new URL(a?.href??""),i=await H(o);if(i instanceof l)throw new Error(i.message);let s=await _n(i);if(s instanceof l)throw new Error(s.message);return Tn(o.href,s),n.classList.contains("product-list")?Bn(s):Ge(s)}catch(a){throw new l(a?.message)}})();if(t instanceof l)throw t;return[{type:"MegaMenu",title:r,content:t},[...e]]},qn={elementNull:"Element is null",noTitle:"Large Menu has no Title"},Ge=n=>{let e=[...n.children];if(e.length===0)throw new l("No mega menu items found (did you forget to add them correctly?)");let[r,t]=M(e,a=>Ne(a));if(r.length===0)throw new l("Failed to parse gnav cards sections");return[{type:"GnavCards",sections:r},t]},Ne=n=>{let e=[...n.querySelectorAll(".featured-card, .links-card, .promo-card")];if(e.length===0)throw new l("Column contains no cards (did you forget to label them correctly?)");let[r,t]=M(e,a=>De(a));if(r.length===0)throw new l("Failed to parse cards in column");return[{type:"GnavColumn",cards:r},t]},De=n=>{if(n.classList.contains("featured-card"))return On(n);if(n.classList.contains("links-card"))return Dn(n);if(n.classList.contains("promo-card"))return jn(n);throw new l("Unsupported gnav cards section")};var Wn=({card:n})=>Be(n),Be=({title:n,subtitle:e,eyeBrow:r,footerCTA:t,bodyLink:a})=>`
  <article class="featured-card">
    <div>
      <div class="featured-eyebrow">${r}</div>
      <h4>${n}</h4>
      <div class="featured-subtitle">${e}</div>
      <span>${G(a)}${T.chevronRight}</span>
    </div>
    <div class="footer-container">
      ${A(t)}
    </div>
  </article>
`.trim();var Zn=({card:n})=>Oe(n),Oe=({title:n,links:e,footerCTA:r})=>`
  <article class="links-card">
    <div>
      <h4 class="links-card-title">${n}</h4>
      <ul class="links-card-links">
        ${e.map(t=>`<li>${G(t)}</li>`).join("")}
      </ul>
    </div>
    ${r===null?"":`
    <div class="links-card-footer">
      ${A(r)}
    </div>`}
  </article>
`.trim();var Kn=({card:n})=>je(n),je=({bgImageAlt:n,bgImageSrc:e,iconAlt:r,iconSrc:t,title:a,cta:o})=>`
  <article class="promo-card" daa-lh="promo-card">
    ${e?`<picture class="promo-card__bg">
             <img src="${e}" alt="${n}" class="promo-card__bg-image">
           </picture>`:""}

    <div class="promo-card__content">
      ${t?`<picture class="promo-card__icon">
               <img src="${t}" alt="${r}" class="promo-card__icon-image">
             </picture>`:""}
      <div class="promo-card__text-content">
        <!-- Placeholder price, replace with actual price data when available -->
        <p class="promo-card__price">US$29.99/mo</p>
        <p class="promo-card__title" role="heading" aria-level="2">
          ${a}
        </p>
        ${o===null?"":`<div class="promo-card__cta">
                 ${A(o)}
               </div>`}
      </div>
    </div>
  </article>
`.trim();var qe=n=>{switch(n.type){case"FeaturedCard":return Wn(n);case"LinksCard":return Zn(n);case"PromoCard":return Kn(n);default:}return""},Vn=({sections:n})=>`
  <ul class="feds-gnav-cards">
    ${n.map(e=>`<li>${e.cards.map(r=>qe(r)).join("")}</li>`).join("")}
  </ul>
`;var Xn=({categories:n,links:e})=>{let r=`
    <ul class="tabs" role="tablist">
      ${n.map(Fe).join("")}
      ${e.length?`<li class="product-links"><a class="feds-link" href="${e[e.length-1].href}"${k(null,e[e.length-1].daaLl??e[e.length-1].text)}>${e[e.length-1].text}${T.chevronRight}</a></li>`:""}
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
          ${a.map(i=>`<li>${pn(i)}</li>`).join("")}
        </ul>
      </li>
      `.trim()).join("")}
    </ul>
  `.trim();return`
    <div class="product-list">
      ${r}
      ${t}
    </div>
  `.trim()},Fe=({name:n,daaLh:e},r)=>`
      <li>
        <button
          role="tab"
          class="tab"
          aria-selected="${(r===0).toString()}"
          aria-controls="${r}"
          ${k(e,"")}
          >
            ${n}
          </button>
      </li>
  `.trim();var Jn=({title:n})=>`
  <button type="button"
          aria-controls="${B(n)}"
          aria-haspopup="true"
          class="mega-menu feds-link"
          popovertarget="${B(n)}"
          ${k(null,n)}
  >
    ${n}${T.chevronDown}
  </button>
  <div id="${B(n)}" popover class="feds-popup">
  </div>
`,Yn=(n,e,r)=>{let t=`
        <button
          type="button"
          class="feds-popup-back-button"
          popovertarget="${B(e)}"
          popovertargetaction="hide"
          aria-label="Back"
        >
          ${T.chevronLeft}
        </button>
        <span class="feds-popup-title">${r}</span>
  `,a=n.type==="ProductList"&&n.links.length>0?n.links[n.links.length-1]:null,o=`
    <div class="feds-popup-header">
      <div class="feds-popup-header-left">${t}</div>
      ${a?`<div class="product-links"><a class="feds-link" href="${a.href}"${k(null,a.daaLl??a.text)}>${a.text}${T.chevronRight}</a></div>`:""}
    </div>
  `.trim(),i="";switch(n.type){case"ProductList":i=Xn(n);break;case"GnavCards":i=Vn(n);break;default:}return`${o}${i}`};var Qn={elementNull:"Error when parsing text. Element is null",textContentNull:"Error when parsing text. Element has no textContent"},ne=n=>{if(n===null)return[{type:"Text",content:""},[new f(Qn.elementNull,"Minor")]];let e=n.textContent;return e===null?[{type:"Text",content:""},[new f(Qn.textContentNull,"Minor")]]:[{type:"Text",content:e},[]]};var ee=({content:n})=>n;var re=n=>{if(n===null)throw new l(We.elementNull);if(n.querySelector(".gnav-brand")!==null)return gn(n);let r=n.querySelector(".large-menu");return r!==null?Fn(r):n.querySelector("strong")!==null?bn(n):n.querySelector("em")!==null?P(n):n.querySelector("a")===null?ne(n):C(n.querySelector("a"))},xn=n=>{switch(n.type){case"Text":return ee(n);case"Link":return G(n);case"SecondaryCTA":return A(n);case"PrimaryCTA":return yn(n);case"Brand":return fn(n);case"MegaMenu":return Jn(n);default:return console.error(`Failed to recognize component: ${n}`),""}},We={elementNull:"Element is null"};var te=(n,e)=>{let[r,t]=M([...document.querySelectorAll(".breadcrumbs ul > li > a")??[]],C),[a,o]=M([...n.children],re),i=n.querySelector(".product-entry-cta"),[s,d]=(()=>{try{return Gn(i)}catch{return[null,[]]}})(),c=!1,y=[t,o,d].flat();return{breadcrumbs:r,components:a,productCTA:s,localnav:c,errors:y,unavEnabled:e}};var ae=n=>{let e=[...n.querySelectorAll('.tabs button[role="tab"]')],r=[...n.querySelectorAll(".tab-content ul")],t=e.map((a,o)=>()=>{e.forEach(i=>{i.setAttribute("aria-selected","false")}),r.forEach(i=>{i.setAttribute("hidden","true")}),r[o]?.removeAttribute("hidden"),a.setAttribute("aria-selected","true")});return e.forEach((a,o)=>{a.addEventListener("click",t[o])}),()=>{e.forEach((a,o)=>{a.removeEventListener("click",t[o])})}};var oe=async({gnavSource:n,asideSource:e})=>{let r=await H(n);if(r instanceof l)return r;let t=await H(e);return{mainNav:r,aside:t}};var Ze=`/**
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
  --s2a-color-transparent-black-04: rgb(0 0 0 / 4%);
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
  --s2a-font-size-lg: var(--s2a-font-size-18);
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
}

header.feds-header-scrolled .feds-link {
  color: var(--s2a-color-gray-1000);
}

header.global-navigation:has(.feds-popup:popover-open) {
  background-color: var(--s2a-color-gray-75);
}

.global-navigation.site-pivot {
  visibility: visible;
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
}

.global-navigation.site-pivot:has(:popover-open) {
  background: var(--s2a-color-gray-25);
  opacity: 1;
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

.global-navigation.site-pivot:has(.feds-menu-wrapper:popover-open) .feds-brand-container {
  display: none;
}

::backdrop {
  opacity: 1;
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
  background: inherit;
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
  font-size: var(--s2a-font-size-sm);
  font-weight: var(--s2a-font-weight-adobe-clean-bold);
  font-family: var(--s2a-font-family);
  display: flex;
  align-items: center;
  border: 0;
  background-color: transparent;
  padding: var(--s2a-spacing-sm);
  color: var(--s2a-color-gray-25);
  opacity: 100%;
  text-decoration: none;
}

.feds-link:hover {
  text-decoration: underline;
}

.global-navigation.site-pivot:has(:popover-open) .feds-gnav-items > li > .feds-link {
  color: var(--s2a-color-gray-1000);
  font-family: var(--s2a-font-family-heading);
  font-size: var(--s2a-font-size-3xl);
  font-weight: var(--s2a-font-weight-adobe-clean-black);
}

.global-navigation:not(.feds-header-scrolled):not(:has(:popover-open)) .feds-gnav-items > li > .feds-link:hover {
  color: var(--s2a-color-gray-25);
}

.global-navigation.site-pivot:has(:popover-open) .feds-gnav-items > li > .feds-link:has(~ :popover-open) {
  opacity: 100%;
}

/* =========================================
   Menu Wrapper (Mobile Slide-out)
   ========================================= */

.global-navigation nav > ul > li.feds-menu-wrapper {
  position: fixed;
  top: var(--s2a-spacing-64);
  left: 0;
  right: var(--s2a-spacing-20);
  flex-direction: column;
  height: calc(100dvh - var(--s2a-spacing-64));
  border: 0;
  width: 100%;
  translate: -200vw 0;
  opacity: 0;
  display: flex;
  visibility: hidden;
  color: var(--s2a-color-gray-1000);
}

.global-navigation nav > ul > li.feds-menu-wrapper.feds-menu-active {
  transition: translate 0.4s ease-out, opacity 0.4s ease, visibility 0s linear 0.5s;
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
}

.global-navigation nav > ul > li.feds-menu-wrapper:popover-open .feds-gnav-items {
  align-items: flex-start;
  padding: var(--s2a-spacing-sm) var(--s2a-spacing-lg);
  width: calc(100% - var(--s2a-spacing-3xl));
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

.global-navigation.site-pivot:has(.feds-menu-wrapper:popover-open) .feds-nav-toggle svg {
  display: none;
}

.global-navigation.site-pivot:has(.feds-menu-wrapper:popover-open) .feds-nav-toggle::before {
  content: "\\2715";
  color: var(--s2a-color-gray-1000);
  font-size: var(--s2a-font-size-xl);
  /* No token: font-weight 300 */
  font-weight: 300;
}

/* =========================================
   Utilities (App Switcher, Profile)
   ========================================= */

.global-navigation .unav-comp-app-switcher.unav-comp-icon svg {
  fill: var(--s2a-color-gray-25);
}

.global-navigation.feds-header-scrolled .unav-comp-app-switcher.unav-comp-icon svg {
  fill: var(--s2a-color-gray-1000);
}

.global-navigation .unav-comp-app-switcher.unav-comp-icon:hover svg {
  fill: var(--s2a-colo-gray-1000);
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

body:has(:popover-open) {
  overflow: hidden;
}

.feds-popup {
  position: fixed;
  inset: var(--s2a-spacing-64) 0 auto 0;
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
  width: 20px;
  height: 20px;
  color: var(--s2a-color-content-default);
  cursor: pointer;
}

.feds-popup .feds-popup-back-button svg {
  width: 100%;
  height: 100%;
}

.feds-popup .feds-popup-title {
  font-size: var(--s2a-font-size-3xl);
  font-weight: var(--s2a-font-weight-adobe-clean-black);
  font-family: var(--s2a-font-family-heading);
  color: var(--s2a-color-content-default);
}

/* =========================================
   Link Groups
   ========================================= */

.feds-popup .feds-link-group {
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

@media(max-width: 767px) {

  .feds-popup .feds-link-group {
    border-radius: var(--s2a-border-radius-24);
  }
}

.feds-popup .feds-link-group:hover .feds-link-group__title,
.feds-popup .feds-link-group:hover .feds-link-group__subtitle {
  color: var(--s2a-color-gray-25);
}

.feds-popup .feds-link-group__icon {
  display: block;
  width: var(--s2a-spacing-lg);
  height: var(--s2a-spacing-lg);
  margin-top: var(--s2a-spacing-2xs);
}

.feds-popup .feds-link-group__icon-img {
  display: block;
  width: 100%;
  height: 100%;
}

.feds-popup .feds-link-group__title {
  font-size: var(--s2a-font-size-sm);
  font-weight: var(--s2a-font-weight-adobe-clean-bold);
  line-height: var(--s2a-font-line-height-20);
}

.feds-popup .feds-link-group__badges {
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 6px;
  margin-bottom: var(--s2a-spacing-xs);
}

.feds-popup .feds-link-group__badge {
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

.feds-popup .feds-link-group__badge--filled {
  border-color: var(--s2a-color-gray-1000);
  background: var(--s2a-color-gray-1000);
  color: var(--s2a-color-gray-25);
}

.feds-popup .feds-link-group__subtitle {
  margin-top: var(--s2a-spacing-2xs);
  font-size: var(--s2a-font-size-xs);
  font-weight: var(--s2a-font-weight-adobe-clean-regular);
  line-height: 1.35;
  /* No token: design uses custom gray; using content-subtle */
  color: var(--s2a-color-content-subtle);
}

.feds-popup .feds-link-group__price {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: var(--s2a-spacing-sm);
}

.feds-popup .feds-link-group__old-price {
  font-size: var(--s2a-font-size-xs);
  font-weight: var(--s2a-font-weight-adobe-clean-bold);
  line-height: 1;
  text-decoration: line-through;
  /* No token: design uses custom gray */
  color: var(--s2a-color-content-subtle);
}

.feds-popup .feds-link-group__new-price {
  font-size: var(--s2a-font-size-xs);
  font-weight: var(--s2a-font-weight-adobe-clean-bold);
  line-height: 1;
  color: var(--s2a-color-gray-1000);
}

.feds-popup .feds-link-group--blue {
  background: var(--s2a-color-blue-100);
}

.feds-popup .feds-link-group--blue:hover {
  background: var(--s2a-color-blue-200);
}

.feds-popup .feds-link-group:hover .feds-link-group__old-price,
.feds-popup .feds-link-group:hover .feds-link-group__new-price,
.feds-popup .feds-link-group:hover .feds-link-group__badge {
  color: var(--s2a-color-gray-25);
  border-color: var(--s2a-color-gray-25);
}

.feds-popup .feds-link-group:hover .feds-link-group__badge--filled {
  background: var(--s2a-color-gray-25);
  color: var(--s2a-color-gray-1000);
}

.feds-link-group .feds-link-header {
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
  min-height: 34px;
  padding: 0 14px;
  border: var(--s2a-border-width-sm) solid var(--s2a-color-content-default);
  border-radius: var(--s2a-border-radius-round);
  font-size: var(--s2a-font-size-sm);
  font-weight: var(--s2a-font-weight-adobe-clean-bold);
  line-height: 1;
  color: var(--s2a-color-content-default);
  text-decoration: none;
}

.feds-popup .feds-secondary-cta:hover {
  /* No token: design #f5f5f5; using gray-75 */
  background: var(--s2a-color-gray-75);
  text-decoration: underline;
}

/* =========================================
   Responsive: Desktop (min-width: 767px)
   ========================================= */

@media (min-width: 767px) {
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
    padding-left: var(--s2a-spacing-lg);
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
   Responsive: Mobile (max-width: 1023px)
   ========================================= */

@media (max-width: 767px) {
  .global-navigation.site-pivot .feds-gnav-items > li > .mega-menu.feds-link {
    width: 100%;
    justify-content: space-between;
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
    inset: var(--s2a-spacing-64) 0 0 0;
  }

}

/* =========================================
   Scroll Animations
   ========================================= */

@supports ((animation-timeline: scroll()) and (animation-range: 0% 100%)) {
  @keyframes scroll-transition-main-nav {
    from {
      background-color: transparent;
      width: 100%;
      border-radius: 0px;
      border: solid 0px rgba(0, 0, 0, 0);
      transform: translate(0, 0);
      backdrop-filter: blur(0px);
    }
    to {
      /* No token: 51% white */
      background-color: rgba(255, 255, 255, 0.51);
      width: calc(100% - var(--s2a-spacing-xs));
      /* No token: 6px radius */
      border-radius: 6px;
      border: solid var(--s2a-border-width-sm) var(--s2a-color-transparent-black-04);
      transform: translate(var(--s2a-spacing-2xs), var(--s2a-spacing-2xs));
      /* Token 16px; design 16.5px */
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

  header.global-navigation:not(:has(:popover-open)) {
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

  @media (max-width: 766px) {
    header.global-navigation:has(.unav-comp-app-switcher-open) {
      animation: none;
    }

    header.global-navigation.feds-header-scrolled:has(.unav-comp-app-switcher-open) {
      animation: none;
      background-color: var(--s2a-color-gray-25);
      border-radius: 6px;
      width: calc(100% - var(--s2a-spacing-xs));
      margin: var(--s2a-spacing-2xs) var(--s2a-spacing-2xs) 0;
      border: solid var(--s2a-border-width-sm) var(--s2a-color-transparent-black-04);
    }

    header.global-navigation.feds-header-scrolled:has(.unav-comp-app-switcher-open) .feds-brand-image svg,
    header.global-navigation.feds-header-scrolled:has(.unav-comp-app-switcher-open) .feds-nav-toggle svg {
      animation: none;
      color: var(--s2a-color-gray-1000);
    }
  }

}

@supports (not ((animation-timeline: scroll()) and (animation-range: 0% 100%))) {
  header.global-navigation.feds-header-scrolled:not(:has(:popover-open)) {
    /* No token: 51% white */
    background-color: rgba(255, 255, 255, 0.51);
    /* No token: 6px radius */
    border-radius: 6px;
    width: calc(100% - var(--s2a-spacing-xs));
    margin: var(--s2a-spacing-2xs) var(--s2a-spacing-2xs) 0;
    border: solid var(--s2a-border-width-sm) var(--s2a-color-transparent-black-04);
    /* Token 16px; design 16.5px */
    backdrop-filter: blur(var(--s2a-blur-sm));
  }

  header.global-navigation.feds-header-scrolled:not(:has(:popover-open)) .feds-brand-image svg,
  header.global-navigation.feds-header-scrolled:not(:has(:popover-open)) .feds-nav-toggle svg {
    color: var(--s2a-color-gray-1000);
  }
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
  flex-direction: row-reverse;
  justify-content: flex-start;
  padding-left: var(--s2a-spacing-20);
}

/* =========================================
   Brand / Logo
   ========================================= */

.feds-brand,
.feds-logo {
  align-items: center;
  outline-offset: var(--s2a-spacing-2xs);
  padding: 0 var(--s2a-spacing-xs);
  column-gap: 10px;
}


.feds-brand-image picture,
.feds-brand-image img,
.feds-brand-image svg,
.feds-logo-image picture,
.feds-logo-image img,
.feds-logo-image svg {
  width: 100%;
  display: block;
}

.feds-brand-label,
.feds-logo-label {
  flex-shrink: 0;
  font-weight: var(--s2a-font-weight-adobe-clean-bold);
  font-size: var(--s2a-font-size-lg);
  color: var(--s2a-color-brand-adobe-red);
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

.feds-brand-image.brand-image-only.mobile-brand svg {
  height: var(--s2a-spacing-md);
}

.feds-brand-image.brand-image-only.desktop-brand svg {
  width: 67px;
}

/* =========================================
   Responsive: Desktop (min-width: 767px)
   ========================================= */

@media (min-width: 767px) {
  li.feds-brand-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    padding-left: 0;
  }

  .feds-brand-image + .feds-brand-label {
    display: flex;
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
   Responsive: Desktop (min-width: 767px)
   ========================================= */

@media (min-width: 767px) {
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
   Responsive: Desktop (min-width: 767px)
   ========================================= */

@media (min-width: 767px) {
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
  font-weight: var(--s2a-font-weight-adobe-clean-bold);
  font-size: var(--s2a-font-size-sm);
  line-height: 130%;
  letter-spacing: 0;
  border: none;
  background: var(--s2a-color-gray-25);
  color: var(--s2a-color-gray-1000);
  padding: 3px var(--s2a-spacing-lg);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.feds-gnav-cards .promo-card__cta .feds-secondary-cta:hover,
.feds-gnav-cards .promo-card__cta .feds-secondary-cta:focus {
  background: var(--s2a-color-gray-1000);
  color: var(--s2a-color-gray-25);
}

/* =========================================
   Responsive: Desktop (min-width: 767px)
   ========================================= */

@media (min-width: 767px) {
  .feds-gnav-cards .promo-card {
    height: 100%;
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
  .feds-gnav-cards .promo-card__bg-image {
    border-radius: var(--s2a-border-radius-12);
  }

  .feds-gnav-cards .promo-card__text-content {
    width: 100%;
    box-sizing: border-box;
  }

  .feds-gnav-cards .promo-card__cta {
    position: absolute;
    bottom: var(--s2a-spacing-md);
    right: var(--s2a-spacing-md);
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
  padding: var(--s2a-spacing-lg);
}

.feds-popup .links-card .links-card-title {
  margin: 0 0 var(--s2a-spacing-md);
  font-family: var(--s2a-font-family-heading);
  font-size: var(--s2a-font-size-2xl);
  line-height: 42px;
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
  display: grid;
  gap: var(--s2a-spacing-md);
  line-height: 120%;
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
  margin-top: var(--s2a-spacing-20);
}

.feds-popup .links-card .links-card-footer .feds-secondary-cta {
  width: 100%;
  box-sizing: border-box;
  justify-content: center;
  border: var(--s2a-border-width-sm) solid var(--s2a-color-gray-300);
}

/* =========================================
   Responsive: Desktop (min-width: 767px)
   ========================================= */

@media (min-width: 767px) {
  .feds-popup .links-card {
    border-radius: var(--s2a-border-radius-16); /* Don't have a token */
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

.product-list .tab-content [role="tabpanel"] .feds-link-group {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 120px;
  height: auto;
  background-color: var(--s2a-color-gray-25);
}

.feds-popup .product-list .tab-content [role="tabpanel"] .feds-link-group:hover {
  background: var(--s2a-color-gray-1000);
}

.feds-popup .product-list .tab-content [role="tabpanel"] .feds-link-group:hover .feds-link-group__title {
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
   Responsive: Desktop (min-width: 767px)
   ========================================= */

@media (min-width: 767px) {
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
    white-space: normal;
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

@media (max-width: 767px) {
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
  padding: var(--s2a-spacing-md) var(--s2a-spacing-lg);
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
   Responsive: Desktop (min-width: 767px)
   ========================================= */

@media (min-width: 767px) {
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

@media (min-width: 767px) and (hover: hover) {
  .featured-card,
  .featured-card .featured-eyebrow,
  .featured-card h4,
  .featured-card .featured-subtitle,
  .featured-card .feds-link,
  .featured-card a.feds-secondary-cta {
    transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }

  .featured-card:hover {
    background: var(--s2a-color-gray-1000);
  }

  .featured-card:hover .featured-eyebrow {
    /* No token: design uses transparent-white/700 */
    color: rgba(255, 255, 255, 0.66);
  }

  .featured-card:hover h4,
  .featured-card:hover .featured-subtitle,
  .featured-card:hover .feds-link {
    color: var(--s2a-color-gray-25);
  }

  .featured-card:hover a.feds-secondary-cta {
    background: var(--s2a-color-gray-25);
    color: var(--s2a-color-gray-1000);
    border-color: var(--s2a-color-gray-25);
  }
  .featured-card .footer-container a.feds-secondary-cta:hover {
    background: var(--s2a-color-gray-25);
  }
  .featured-card:hover span svg {
    color: var(--s2a-color-gray-25);
  }
}
`,ie=document.createElement("style");ie.textContent=Ze;document.head.appendChild(ie);var oo=async n=>{let{gnavSource:e,mountpoint:r,unavEnabled:t,miloConfig:a,personalization:o}=n;if(!(e instanceof URL))throw L(`gnavSource is invalid: ${e}`),new l("gnavSource needs to be a URL object");try{dn(a)}catch(y){throw L(`Failed to initialize MiloConfig: ${y}`),new l(`Failed to initialize MiloConfig: ${y}`)}Mn(o),Cn(wn(n));let i=await oe(n);if(i instanceof l)throw L(i.message),i;let{mainNav:s,aside:d}=i;if(s instanceof l)throw L(s.message),s;let c=te(s,t);if(c instanceof l)throw L(c.message),c;return await Ke(c)(r),Xe(n)},Ke=n=>async e=>{let r=Ve(n);e.innerHTML=r,e.classList.add("site-pivot");let t=[...e.querySelectorAll(".mega-menu ~ .feds-popup")];t.forEach(s=>{s.innerHTML=""});let a=n.components.filter(s=>s.type==="MegaMenu"),o=a.map(s=>s.content),i=await Promise.all(o.map(async(s,d)=>{let[c,y]=await s,x=a[d].title;return t[d].innerHTML=Yn(c,t[d].id,x),y}).flat());return e},Ve=({components:n,productCTA:e,unavEnabled:r})=>`
<nav>
  <ul>
    ${(()=>{let t=n.find(d=>d.type==="Brand")??null,a=n.filter(d=>d.type!=="Brand"),o=`
        <button
          class="feds-nav-toggle"
          type="button"
          aria-label="Navigation menu"
          aria-expanded="false"
          aria-controls="feds-menu-wrapper"
          popovertarget="feds-menu-wrapper"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 7" fill="currentColor" aria-hidden="true">
            <path d="M13.25 5.5H0.75C0.33594 5.5 0 5.83594 0 6.25C0 6.66406 0.33594 7 0.75 7H13.25C13.6641 7 14 6.66406 14 6.25C14 5.83594 13.6641 5.5 13.25 5.5Z"/>
            <path d="M0.75 1.5H13.25C13.6641 1.5 14 1.16406 14 0.75C14 0.33594 13.6641 0 13.25 0H0.75C0.33594 0 0 0.33594 0 0.75C0 1.16406 0.33594 1.5 0.75 1.5Z"/>
          </svg>
        </button>
      `.trim(),i=t?xn(t):"",s=Sn(a,xn);return`
        <li class="feds-brand-wrapper">
          ${o}
          ${i}
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
  ${e===null?"":Nn(e)}
  ${r?'<div class="feds-utilities"></div>':""}
</nav>
`,Xe=async n=>{let e=new Set,r=await rn(n.mountpoint);r instanceof f?(e.add(r),L(r.message)):r.errors.forEach(a=>e.add(a)),ae(n.mountpoint),hn(n.mountpoint),Je(n.mountpoint),Ye(n.mountpoint),nr(n.mountpoint);let t=r instanceof f?()=>{}:r.reloadUnav;return{closeEverything:Qe,reloadUnav:t,errors:e,setGnavTopPosition:a=>{},getGnavTopPosition:()=>0}},Je=n=>{let e=n.querySelector("#feds-menu-wrapper"),r=n.querySelector(".feds-nav-toggle");e?.addEventListener("toggle",()=>{let a=e.matches(":popover-open");r?.setAttribute("aria-expanded",String(a)),e.setAttribute("aria-hidden",String(!a)),a&&e.classList.add("feds-menu-active")}),e?.addEventListener("transitionend",()=>{e.matches(":popover-open")||e.classList.remove("feds-menu-active")}),n.querySelectorAll(".feds-popup[popover]").forEach(a=>{a.addEventListener("toggle",()=>{n.querySelector(`[popovertarget="${a.id}"]`)?.setAttribute("aria-expanded",String(a.matches(":popover-open")))})})},Ye=n=>{N.addEventListener("change",()=>{let e=n.querySelector("#feds-menu-wrapper");e?.classList.remove("feds-menu-active"),e?.hidePopover?.(),n.querySelector(".feds-popup:popover-open")?.hidePopover?.()})},Qe=()=>{},nr=n=>{let e=n.closest("header");if(!e)return;let r=n.querySelector("#feds-menu-wrapper"),t=()=>r?.matches(":popover-open")??!1,a=()=>window.scrollY>100,o=()=>{if(t()){e.classList.remove("feds-header-scrolled");return}if(a()){e.classList.add("feds-header-scrolled");return}e.classList.remove("feds-header-scrolled")};o(),window.addEventListener("scroll",o,{passive:!0}),r?.addEventListener("toggle",o)};export{oo as main,Xe as postRenderingTasks,Ke as renderGnav,Ve as renderGnavString};
//# sourceMappingURL=main.js.map
