const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/menu-overlay-DLE_g6_o.js","assets/state-DFY6wBk_.js","assets/config-cbGqdHWG.js","assets/playcanvas-C6g3ijIZ.js"])))=>i.map(i=>d[i]);
import{_ as p}from"./playcanvas-C6g3ijIZ.js";const m={ROOT_MARGIN:"-50px",THRESHOLD:.1,STAGGER_DELAY:100};let c=null;function T(){if(!("IntersectionObserver"in window)){console.warn("⚠️ IntersectionObserver not supported, revealing all"),L();return}const e=document.getElementById("content-area");c=new IntersectionObserver(w,{root:e||null,rootMargin:m.ROOT_MARGIN,threshold:m.THRESHOLD}),y(),console.log("✨ Scroll reveal system initialized")}function w(e){e.forEach(t=>{if(t.isIntersecting){const r=t.target;r.classList.add("is-revealed"),r.classList.contains("reveal-stagger")&&b(r),c.unobserve(r)}})}function b(e){const t=e.children;Array.from(t).forEach((r,a)=>{setTimeout(()=>{r.classList.add("is-revealed")},a*m.STAGGER_DELAY)})}function y(){const e=document.querySelectorAll("[data-reveal]"),t=document.querySelectorAll(".reveal-stagger");e.forEach(r=>{c.observe(r)}),t.forEach(r=>{c.observe(r)}),console.log(`📍 Observing ${e.length} reveal elements`)}function u(e){c&&e&&c.observe(e)}function L(){document.querySelectorAll("[data-reveal]").forEach(t=>{t.classList.add("is-revealed")})}const E="/api",i={brand:"VUDRAG",tagline:"From Atom to Atlas",description:"The same fire that engraves a coin's 1.2mm relief forges a 12-meter monument. At every scale, entropy yields to intent — chaos transformed into form.",email:"office@vudrag.com",location:"Varaždin • Zagreb • Dubai",navLinks:[{label:"Collections",href:"#category-hub"},{label:"Artist",href:"#artist-section"},{label:"Inquire",href:"/contact.html"},{label:"Collectors Club",href:"/login.html"}],socialLinks:[{name:"Instagram",icon:"instagram",url:"https://www.instagram.com/vudrag_art/"},{name:"Facebook",icon:"facebook",url:"https://web.facebook.com/nikola.vudrag.77"},{name:"Interview",icon:"article",url:"https://www.contemporaryartissue.com/a-conversation-with-nikola-vudrag/"}]};async function k(){try{const e=new AbortController,t=setTimeout(()=>e.abort(),2e3),r=await fetch(`${E}/site-content`,{signal:e.signal});if(clearTimeout(t),!r.ok)throw new Error("CMS unavailable");const a=await r.json();return a.footer?{brand:a.footer.brand||i.brand,tagline:a.footer.tagline||i.tagline,description:a.footer.description||i.description,email:a.footer.email||i.email,location:a.footer.location||i.location,navLinks:a.footer.navLinks&&a.footer.navLinks.length>0?a.footer.navLinks:i.navLinks,socialLinks:a.footer.socialLinks&&a.footer.socialLinks.length>0?a.footer.socialLinks:i.socialLinks}:i}catch{return console.warn("⚠️ CMS unavailable or timed out, using fallback footer content"),i}}async function A(){const e=document.getElementById("content-area")||document.querySelector("main")||document.body;if(!e||document.getElementById("main-footer"))return;const t=await k(),r=document.createElement("footer");r.id="main-footer",r.className="site-footer",r.innerHTML=`
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
    `,e.appendChild(r);const a=r.querySelector(".footer__links");t.navLinks.forEach(n=>{const o=document.createElement("a");o.href=n.href,o.className="footer__link",n.href.startsWith("#")&&(o.dataset.target=n.href.substring(1)),o.innerHTML=`
            ${n.label}
            <span class="footer__link-arrow">→</span>
        `,a.appendChild(o)});const d=r.querySelector(".footer__social");t.socialLinks.forEach(n=>{const o=document.createElement("a");o.href=n.url,o.className="footer__social-link",o.target="_blank",o.rel="noopener noreferrer",o.ariaLabel=n.name,o.innerHTML=`
            ${S(n.icon)}
            <div class="footer__social-glow"></div>
        `,d.appendChild(o)}),C(r),console.log("✅ Footer initialized (CMS-driven)")}function S(e){return{instagram:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
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
        </svg>`}[e]||""}function C(e){e.querySelectorAll("[data-reveal]").forEach(n=>u(n));const r=e.querySelector(".footer__border-accent");r&&u(r),e.querySelectorAll(".footer__social-link").forEach(n=>{n.addEventListener("mouseenter",()=>{n.style.transform="translateY(-4px) scale(1.1)"}),n.addEventListener("mouseleave",()=>{n.style.transform=""})}),e.querySelectorAll(".footer__link").forEach(n=>{n.addEventListener("mouseenter",()=>{const o=n.querySelector(".footer__link-arrow");o&&(o.style.transform="translateX(8px)")}),n.addEventListener("mouseleave",()=>{const o=n.querySelector(".footer__link-arrow");o&&(o.style.transform="")}),n.addEventListener("click",o=>{o.preventDefault();const s=n.dataset.target;if(s)p(async()=>{const{navigateTo:l}=await import("./menu-overlay-DLE_g6_o.js").then(f=>f.n);return{navigateTo:l}},__vite__mapDeps([0,1,2,3])).then(({navigateTo:l})=>{l(s)});else{const l=n.getAttribute("href");l&&(window.location.href=l)}})}),x(e)}function x(e){const t=e.querySelector(".footer__monogram");if(!t)return;if("ontouchstart"in window||navigator.maxTouchPoints>0)t.classList.add("footer__monogram--pulse");else{let a=null;const d=o=>{a&&cancelAnimationFrame(a),a=requestAnimationFrame(()=>{const s=t.getBoundingClientRect(),l=s.left+s.width/2,f=s.top+s.height/2,_=Math.hypot(o.clientX-l,o.clientY-f),v=Math.max(0,1-_/400),g=20+v*60,h=.3+v*.7;t.style.textShadow=`0 0 ${g}px rgba(201, 167, 122, ${h})`,t.style.opacity=.6+v*.4,t.style.setProperty("--stroke-color",`rgba(201, 167, 122, ${.4+v*.6})`)})};new IntersectionObserver(o=>{o.forEach(s=>{s.isIntersecting?document.addEventListener("mousemove",d):(document.removeEventListener("mousemove",d),t.style.textShadow="",t.style.opacity="")})},{threshold:.1}).observe(e)}}const O=Object.freeze(Object.defineProperty({__proto__:null,setupFooter:A},Symbol.toStringTag,{value:"Module"}));export{A as a,O as f,u as o,T as s};
