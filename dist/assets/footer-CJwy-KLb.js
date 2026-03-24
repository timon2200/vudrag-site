import{s as f}from"./state-DFY6wBk_.js";import"./config-CNh1hCsG.js";import{_ as E}from"./playcanvas-SM2qEX5e.js";function h(e){console.log(`🧭 Navigating to: ${e}`),e==="hero"?(f.targetScrollProgress=0,f.isScrolling=!0):e==="category-hub"?(f.targetScrollProgress=1.2,f.isScrolling=!0,setTimeout(()=>{const t=document.getElementById("category-hub");t&&t.scrollIntoView({behavior:"smooth"})},100)):e==="artist"?(f.targetScrollProgress=1.4,f.isScrolling=!0,setTimeout(()=>{const t=document.getElementById("artist-section");t&&t.scrollIntoView({behavior:"smooth"})},100)):e==="works"?h("hero"):e==="contact"?window.location.href="/contact.html":console.warn(`Unknown navigation target: ${e}`)}const S=Object.freeze(Object.defineProperty({__proto__:null,navigateTo:h},Symbol.toStringTag,{value:"Module"})),C="/api";let i=null,_=!1;const v={links:[{label:"Gallery",target:"hero"},{label:"Collections",target:"category-hub"},{label:"Artist",target:"artist"},{label:"Inquire",target:"contact"},{label:"Collectors Club",href:"/login.html"}],brand:"Nikola Vudrag",tagline:"Sculptures in Light"};async function A(){try{const e=new AbortController,t=setTimeout(()=>e.abort(),2e3),n=await fetch(`${C}/site-content`,{signal:e.signal});if(clearTimeout(t),!n.ok)throw new Error("CMS unavailable");const r=await n.json();return r.footer?{links:r.footer.navLinks&&r.footer.navLinks.length>0?r.footer.navLinks.map(o=>o.href.startsWith("#")?{label:o.label,target:o.href.substring(1)}:{label:o.label,href:o.href}):v.links,brand:r.footer.brand||v.brand,tagline:r.footer.tagline||v.tagline}:v}catch{return console.warn("⚠️ CMS unavailable, using fallback menu content"),v}}async function M(){if(document.querySelector(".menu-overlay"))return;const e=await A();i=document.createElement("div"),i.className="menu-overlay";const t=e.links.map(s=>s.target?`<a href="#" class="menu-link" data-target="${s.target}">${s.label}</a>`:`<a href="${s.href}" class="menu-link">${s.label}</a>`).join(`
            `);i.innerHTML=`
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
    `,document.body.appendChild(i),i.querySelector(".menu-close").addEventListener("click",b),i.querySelectorAll(".menu-link").forEach(s=>{s.addEventListener("click",x)}),window.addEventListener("toggle-menu",T),console.log("🍔 Menu overlay created (CMS-driven)")}function I(){i||M(),_=!0,i.classList.add("visible"),document.body.style.overflow="hidden"}function b(){i&&(_=!1,i.classList.remove("visible"),document.body.style.overflow="")}function T(){_?b():I()}function x(e){const t=e.target.getAttribute("data-target");t&&(e.preventDefault(),b(),h(t))}const m={ROOT_MARGIN:"-50px",THRESHOLD:.1,STAGGER_DELAY:100};let u=null;function j(){if(!("IntersectionObserver"in window)){console.warn("⚠️ IntersectionObserver not supported, revealing all"),B();return}const e=document.getElementById("content-area");u=new IntersectionObserver($,{root:e||null,rootMargin:m.ROOT_MARGIN,threshold:m.THRESHOLD}),q(),console.log("✨ Scroll reveal system initialized")}function $(e){e.forEach(t=>{if(t.isIntersecting){const n=t.target;n.classList.add("is-revealed"),n.classList.contains("reveal-stagger")&&O(n),u.unobserve(n)}})}function O(e){const t=e.children;Array.from(t).forEach((n,r)=>{setTimeout(()=>{n.classList.add("is-revealed")},r*m.STAGGER_DELAY)})}function q(){const e=document.querySelectorAll("[data-reveal]"),t=document.querySelectorAll(".reveal-stagger");e.forEach(n=>{u.observe(n)}),t.forEach(n=>{u.observe(n)}),console.log(`📍 Observing ${e.length} reveal elements`)}function p(e){u&&e&&u.observe(e)}function B(){document.querySelectorAll("[data-reveal]").forEach(t=>{t.classList.add("is-revealed")})}const R="/api",c={brand:"VUDRAG",tagline:"Sculpting in Light & Shadow",description:"Exploring the intersection of classical craftsmanship and modern industrial art. Each piece tells a story of transformation, resilience, and raw power.",email:"studio@vudrag.com",location:"Varaždin • Zagreb • Dubai",navLinks:[{label:"Collections",href:"#category-hub"},{label:"Artist",href:"#artist-section"},{label:"Inquire",href:"/contact.html"},{label:"Collectors Club",href:"/login.html"}],socialLinks:[{name:"Instagram",icon:"instagram",url:"https://www.instagram.com/vudrag_art/"},{name:"Facebook",icon:"facebook",url:"https://web.facebook.com/nikola.vudrag.77"},{name:"Interview",icon:"article",url:"https://www.contemporaryartissue.com/a-conversation-with-nikola-vudrag/"}]};async function D(){try{const e=new AbortController,t=setTimeout(()=>e.abort(),2e3),n=await fetch(`${R}/site-content`,{signal:e.signal});if(clearTimeout(t),!n.ok)throw new Error("CMS unavailable");const r=await n.json();return r.footer?{brand:r.footer.brand||c.brand,tagline:r.footer.tagline||c.tagline,description:r.footer.description||c.description,email:r.footer.email||c.email,location:r.footer.location||c.location,navLinks:r.footer.navLinks&&r.footer.navLinks.length>0?r.footer.navLinks:c.navLinks,socialLinks:r.footer.socialLinks&&r.footer.socialLinks.length>0?r.footer.socialLinks:c.socialLinks}:c}catch{return console.warn("⚠️ CMS unavailable or timed out, using fallback footer content"),c}}async function Y(){const e=document.getElementById("content-area");if(!e||document.getElementById("main-footer"))return;const t=await D(),n=document.createElement("footer");n.id="main-footer",n.className="site-footer",n.innerHTML=`
        <div class="footer__border-accent"></div>
        
        <div class="footer__container">
            <!-- Brand Column -->
            <div class="footer__brand" data-reveal>
                <div class="footer__logo">
                    <span class="footer__logo-text">${t.brand}</span>
                    <span class="footer__logo-dot"></span>
                </div>
                <div class="footer__tagline">${t.tagline}</div>
                <p class="footer__description">${t.description}</p>
            </div>

            <!-- Navigation Column -->
            <div class="footer__navigation" data-reveal data-reveal-delay="1">
                <h4 class="footer__heading">Explore</h4>
                <div class="footer__links">
                    <!-- Links injected via JS -->
                </div>
            </div>

            <!-- Contact Column -->
            <div class="footer__contact" data-reveal data-reveal-delay="2">
                <h4 class="footer__heading">Connect</h4>
                <div class="footer__contact-info">
                    <a href="mailto:${t.email}" class="footer__email">${t.email}</a>
                    <div class="footer__location">${t.location}</div>
                </div>
                <div class="footer__social">
                    <!-- Social icons injected via JS -->
                </div>
            </div>
        </div>

        <!-- Signature Section -->
        <div class="footer__signature" data-reveal>
            <div class="footer__signature-line"></div>
            <div class="footer__monogram">NV</div>
            <div class="footer__signature-line"></div>
        </div>
        
        <!-- Bottom Bar -->
        <div class="footer__bottom">
            <div class="footer__copyright">
                &copy; ${new Date().getFullYear()} Nikola Vudrag. All Rights Reserved.
            </div>
            <div class="footer__crafted">
                Crafted with <span class="footer__crafted-icon">✦</span> by varazdin.studio
            </div>
        </div>

        <!-- Ambient Glows -->
        <div class="footer__glow footer__glow--left"></div>
        <div class="footer__glow footer__glow--right"></div>
    `,e.appendChild(n);const r=n.querySelector(".footer__links");t.navLinks.forEach(o=>{const a=document.createElement("a");a.href=o.href,a.className="footer__link",o.href.startsWith("#")&&(a.dataset.target=o.href.substring(1)),a.innerHTML=`
            ${o.label}
            <span class="footer__link-arrow">→</span>
        `,r.appendChild(a)});const s=n.querySelector(".footer__social");t.socialLinks.forEach(o=>{const a=document.createElement("a");a.href=o.url,a.className="footer__social-link",a.target="_blank",a.rel="noopener noreferrer",a.ariaLabel=o.name,a.innerHTML=`
            ${F(o.icon)}
            <div class="footer__social-glow"></div>
        `,s.appendChild(a)}),H(n),console.log("✅ Footer initialized (CMS-driven)")}function F(e){return{instagram:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="2" width="20" height="20" rx="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="18" cy="6" r="1" fill="currentColor"/>
        </svg>`,linkedin:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="2" width="20" height="20" rx="2"/>
            <path d="M8 11v5M8 8v.01M12 16v-5c0-1 1-2 2-2s2 1 2 2v5"/>
        </svg>`,artsy:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
        </svg>`,facebook:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>`,article:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>`}[e]||""}function H(e){e.querySelectorAll("[data-reveal]").forEach(o=>p(o));const n=e.querySelector(".footer__border-accent");n&&p(n),e.querySelectorAll(".footer__social-link").forEach(o=>{o.addEventListener("mouseenter",()=>{o.style.transform="translateY(-4px) scale(1.1)"}),o.addEventListener("mouseleave",()=>{o.style.transform=""})}),e.querySelectorAll(".footer__link").forEach(o=>{o.addEventListener("mouseenter",()=>{const a=o.querySelector(".footer__link-arrow");a&&(a.style.transform="translateX(8px)")}),o.addEventListener("mouseleave",()=>{const a=o.querySelector(".footer__link-arrow");a&&(a.style.transform="")}),o.addEventListener("click",a=>{a.preventDefault();const l=o.dataset.target;if(l)E(async()=>{const{navigateTo:d}=await Promise.resolve().then(()=>S);return{navigateTo:d}},void 0).then(({navigateTo:d})=>{d(l)});else{const d=o.getAttribute("href");d&&(window.location.href=d)}})}),N(e)}function N(e){const t=e.querySelector(".footer__monogram");if(!t)return;if("ontouchstart"in window||navigator.maxTouchPoints>0)t.classList.add("footer__monogram--pulse");else{let r=null;const s=a=>{r&&cancelAnimationFrame(r),r=requestAnimationFrame(()=>{const l=t.getBoundingClientRect(),d=l.left+l.width/2,w=l.top+l.height/2,y=Math.hypot(a.clientX-d,a.clientY-w),g=Math.max(0,1-y/400),L=20+g*60,k=.3+g*.7;t.style.textShadow=`0 0 ${L}px rgba(201, 167, 122, ${k})`,t.style.opacity=.6+g*.4,t.style.setProperty("--stroke-color",`rgba(201, 167, 122, ${.4+g*.6})`)})};new IntersectionObserver(a=>{a.forEach(l=>{l.isIntersecting?document.addEventListener("mousemove",s):(document.removeEventListener("mousemove",s),t.style.textShadow="",t.style.opacity="")})},{threshold:.1}).observe(e)}}export{Y as a,M as c,p as o,j as s,T as t};
