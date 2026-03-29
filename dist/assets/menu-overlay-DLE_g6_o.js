import{s as r}from"./state-DFY6wBk_.js";import"./config-cbGqdHWG.js";function u(e){console.log(`🧭 Navigating to: ${e}`),e==="hero"?(r.targetScrollProgress=0,r.isScrolling=!0):e==="category-hub"?(r.targetScrollProgress=1.2,r.isScrolling=!0,setTimeout(()=>{const t=document.getElementById("category-hub");t&&t.scrollIntoView({behavior:"smooth"})},100)):e==="artist"?(r.targetScrollProgress=1.4,r.isScrolling=!0,setTimeout(()=>{const t=document.getElementById("artist-section");t&&t.scrollIntoView({behavior:"smooth"})},100)):e==="works"?u("hero"):e==="contact"?window.location.href="/contact.html":console.warn(`Unknown navigation target: ${e}`)}const w=Object.freeze(Object.defineProperty({__proto__:null,navigateTo:u},Symbol.toStringTag,{value:"Module"})),b="/api";let n=null,f=!1;const s={links:[{label:"Gallery",target:"hero"},{label:"Collections",target:"category-hub"},{label:"The Forge",href:"/forge.html"},{label:"Inquire",target:"contact"},{label:"Collectors Club",href:"/login.html"}],brand:"Nikola Vudrag",tagline:"From Atom to Atlas"};async function v(){try{const e=new AbortController,t=setTimeout(()=>e.abort(),2e3),c=await fetch(`${b}/site-content`,{signal:e.signal});if(clearTimeout(t),!c.ok)throw new Error("CMS unavailable");const l=await c.json();return l.footer?{links:l.footer.navLinks&&l.footer.navLinks.length>0?l.footer.navLinks.map(a=>a.href.startsWith("#")?{label:a.label,target:a.href.substring(1)}:{label:a.label,href:a.href}):s.links,brand:l.footer.brand||s.brand,tagline:l.footer.tagline||s.tagline}:s}catch{return console.warn("⚠️ CMS unavailable, using fallback menu content"),s}}async function g(){if(document.querySelector(".menu-overlay"))return;const e=await v();n=document.createElement("div"),n.className="menu-overlay";const t=e.links.map(o=>o.target?`<a href="#" class="menu-link" data-target="${o.target}">${o.label}</a>`:`<a href="${o.href}" class="menu-link">${o.label}</a>`).join(`
            `);n.innerHTML=`
        <button class="menu-close" aria-label="Close menu">
            <span></span>
            <span></span>
        </button>
        
        <div class="menu-overlay-content">
            ${t}
            
            <div class="menu-info">
                ${e.brand}<br>
                ${e.tagline}
            </div>
        </div>
    `,document.body.appendChild(n),n.querySelector(".menu-close").addEventListener("click",i),n.querySelectorAll(".menu-link").forEach(o=>{o.addEventListener("click",h)}),window.addEventListener("toggle-menu",m),console.log("🍔 Menu overlay created (CMS-driven)")}function d(){n||g(),f=!0,n.classList.add("visible"),document.body.style.overflow="hidden"}function i(){n&&(f=!1,n.classList.remove("visible"),document.body.style.overflow="")}function m(){f?i():d()}function h(e){const t=e.target.getAttribute("data-target");t&&(e.preventDefault(),i(),u(t))}const S=Object.freeze(Object.defineProperty({__proto__:null,closeMenu:i,createMenuOverlay:g,openMenu:d,toggleMenu:m},Symbol.toStringTag,{value:"Module"}));export{g as c,S as m,w as n,m as t};
