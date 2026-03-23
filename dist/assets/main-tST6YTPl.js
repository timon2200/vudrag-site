import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css                  *//* empty css                          */import"./config-aNK4Z_No.js";import{s as k}from"./state-DFY6wBk_.js";import{_ as D}from"./playcanvas-SM2qEX5e.js";const G=[{image:"/images/VUDRAG-BOOK-MMXXV_Page_03_Image_0001.webp",youtubeId:"-EINfzSwMeg",youtubeIdMobile:"XH2j7ZigZyE",title:"THE FORGE",subtitle:"Where Steel Becomes Spirit",eyebrow:"Nikola Vudrag",objectPosition:"center 35%",link:"/gallery.html"},{image:"/images/VUDRAG-BOOK-MMXXV_Page_20_Image_0001.webp",youtubeId:"BCEdZVVwBC4",youtubeIdMobile:"AL1UjxlcHo0",title:"NETWORKING",subtitle:"Latticework & Light",eyebrow:"The Net-Work Series",objectPosition:"center 50%",link:"/gallery.html"},{image:"/images/VUDRAG-BOOK-MMXXV_Page_40_Image_0001.webp",youtubeId:"PkF5YGPu_YI",youtubeIdMobile:"8sbb6UZwZC4",startTime:2,title:"ATLAS",subtitle:"The Weight of the World",eyebrow:"The Labours of Hercules",objectPosition:"center 30%",link:"/gallery.html"}];async function Y(){try{const e=await fetch("/api/site-content");if(!e.ok)throw new Error("CMS unavailable");const t=await e.json();if(t.heroSlides&&t.heroSlides.length>0)return t.heroSlides}catch{console.warn("⚠️ Could not fetch hero slides from CMS, using fallback")}return G}function j(e){const o=window.innerWidth<window.innerHeight&&e.youtubeIdMobile?e.youtubeIdMobile:e.youtubeId;if(!o)return"";const s=["autoplay=1","mute=1","loop=1","controls=0","showinfo=0","modestbranding=1","rel=0","disablekb=1","iv_load_policy=3","playsinline=1",`playlist=${o}`,"enablejsapi=1","origin="+encodeURIComponent(window.location.origin),...e.startTime?[`start=${e.startTime}`]:[]].join("&");return`https://www.youtube.com/embed/${o}?${s}`}function X(e,t){const o=j(e);return o?`
            <div class="hero-slide__video-wrap">
                <iframe 
                    class="hero-slide__video"
                    ${t?`src="${o}"`:""}
                    data-src="${o}"
                    frameborder="0"
                    allow="autoplay; encrypted-media"
                    allowfullscreen
                    tabindex="-1"
                ></iframe>
            </div>
            ${e.image?`
                <img 
                    class="hero-slide__image hero-slide__image--poster"
                    src="${e.image}"
                    alt="${e.title}"
                    style="object-position: ${e.objectPosition||"center 50%"}"
                    draggable="false"
                />
            `:""}
        `:`
        <img 
            class="hero-slide__image"
            src="${e.image}"
            alt="${e.title}"
            style="object-position: ${e.objectPosition||"center 50%"}"
            draggable="false"
        />
    `}async function W(){const e=document.getElementById("hero-section");if(!e)return;const t=await Y();e.innerHTML=t.map((o,s)=>`
        <section class="hero-slide ${s===0?"is-active":""}" data-index="${s}">
            ${X(o,s===0)}
            <div class="hero-slide__overlay"></div>
            <div class="hero-slide__content">
                <span class="hero-slide__eyebrow">${o.eyebrow||""}</span>
                <h2 class="hero-slide__title">${o.title}</h2>
                <p class="hero-slide__subtitle">${o.subtitle||""}</p>
                <a href="${o.link||"/gallery.html"}" class="hero-slide__cta">
                    <span>Discover</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </a>
            </div>
        </section>
    `).join("")+`
        <nav class="hero-pagination" aria-label="Slide navigation">
            ${t.map((o,s)=>`
                <button class="hero-pagination__dot ${s===0?"is-active":""}" data-index="${s}" aria-label="Go to slide ${s+1}">
                    <span class="hero-pagination__number">${String(s+1).padStart(2,"0")}</span>
                </button>
            `).join("")}
        </nav>
    `,t.forEach(o=>{if(o.image){const s=new Image;s.src=o.image}}),Z(e),J(e),Q(e),console.log("🎬 Hero slider initialized —",t.length,"slides (lazy video loading)")}function K(e){const t=e.querySelector(".hero-slide__video");!t||!t.dataset.src||t.getAttribute("src")!==t.dataset.src&&(t.src=t.dataset.src)}function U(e){const t=e.querySelector(".hero-slide__video");t&&t.removeAttribute("src")}function Z(e){const t=e.querySelectorAll(".hero-slide"),o=e.querySelectorAll(".hero-pagination__dot");let s=0;const i=new IntersectionObserver(a=>{a.forEach(n=>{var l,r,u;const c=parseInt(n.target.dataset.index,10);if(n.isIntersecting&&n.intersectionRatio>=.5){if(c===s)return;(l=t[s])==null||l.classList.remove("is-active"),(r=o[s])==null||r.classList.remove("is-active"),U(t[s]),s=c,n.target.classList.add("is-active"),(u=o[c])==null||u.classList.add("is-active"),K(n.target)}})},{root:e,threshold:[.1,.5]});t.forEach(a=>i.observe(a))}function J(e){e.querySelectorAll(".hero-pagination__dot").forEach(o=>{o.addEventListener("click",()=>{const s=parseInt(o.dataset.index,10),i=e.querySelectorAll(".hero-slide")[s];i&&i.scrollIntoView({behavior:"smooth",block:"start"})})})}function Q(e){let t=0;const o=120;let s=!1;const i=e.querySelector(".hero-pagination");function a(){e.style.overflowY="hidden",e.style.scrollSnapType="none",i&&(i.style.opacity="0")}function n(){e.style.overflowY="",e.style.scrollSnapType="",i&&(i.style.opacity="")}e.addEventListener("wheel",c=>{if(s)return;if(e.scrollTop+e.clientHeight>=e.scrollHeight-2&&c.deltaY>0){if(t+=c.deltaY,t>=o){s=!0,t=0,a();const r=document.getElementById("content-area");r&&r.scrollIntoView({behavior:"smooth",block:"start"})}return}t=0},{passive:!0}),window.addEventListener("scroll",()=>{s&&window.scrollY<=5&&(s=!1,n())},{passive:!0})}function B(e){console.log(`🧭 Navigating to: ${e}`),e==="hero"?(k.targetScrollProgress=0,k.isScrolling=!0):e==="category-hub"?(k.targetScrollProgress=1.2,k.isScrolling=!0,setTimeout(()=>{const t=document.getElementById("category-hub");t&&t.scrollIntoView({behavior:"smooth"})},100)):e==="artist"?(k.targetScrollProgress=1.4,k.isScrolling=!0,setTimeout(()=>{const t=document.getElementById("artist-section");t&&t.scrollIntoView({behavior:"smooth"})},100)):e==="works"?B("hero"):e==="contact"?window.location.href="/contact.html":console.warn(`Unknown navigation target: ${e}`)}const ee=Object.freeze(Object.defineProperty({__proto__:null,navigateTo:B},Symbol.toStringTag,{value:"Module"}));let v=null,H=!1;function N(){if(document.querySelector(".menu-overlay"))return;v=document.createElement("div"),v.className="menu-overlay",v.innerHTML=`
        <button class="menu-close" aria-label="Close menu">
            <span></span>
            <span></span>
        </button>
        
        <div class="menu-overlay-content">
            <a href="#" class="menu-link" data-target="hero">Gallery</a>
            <a href="#" class="menu-link" data-target="category-hub">Collections</a>
            <a href="#" class="menu-link" data-target="artist">Artist</a>
            <a href="#" class="menu-link" data-target="contact">Inquire</a>
            <a href="/login.html" class="menu-link">Collectors Club</a>
            
            <div class="menu-info">
                Nikola Vudrag<br>
                Sculptures in Light
            </div>
        </div>
    `,document.body.appendChild(v),v.querySelector(".menu-close").addEventListener("click",O),v.querySelectorAll(".menu-link").forEach(o=>{o.addEventListener("click",oe)}),window.addEventListener("toggle-menu",z),console.log("🍔 Menu overlay created")}function te(){v||N(),H=!0,v.classList.add("visible"),document.body.style.overflow="hidden"}function O(){v&&(H=!1,v.classList.remove("visible"),document.body.style.overflow="")}function z(){H?O():te()}function oe(e){const t=e.target.getAttribute("data-target");t&&(e.preventDefault(),O(),B(t))}let y=null,M=null,A=null,x=!1;const se={LOGO_TEXT:"VUDRAG"};function ie(){y=document.createElement("header"),y.className="sticky-header",y.innerHTML=`
        <button class="menu-toggle" aria-label="Open menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
        
        <a href="#" class="logo">${se.LOGO_TEXT}</a>
        
        <a href="#" class="back-link" id="back-to-gallery">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Gallery</span>
        </a>
        
        <div class="scroll-progress" id="scroll-progress-bar"></div>
    `,document.body.appendChild(y),M=document.getElementById("scroll-progress-bar"),A=document.getElementById("back-to-gallery");const e=window.location.pathname==="/"||window.location.pathname.endsWith("/index.html");A&&e&&(A.style.display="none"),ae(),window.addEventListener("scroll",ne,{passive:!0}),console.log("📍 Sticky header created")}function ae(){const e=y.querySelector(".logo");e&&e.addEventListener("click",s=>{s.preventDefault(),window.scrollTo({top:0,behavior:"smooth"})});const t=document.getElementById("back-to-gallery");t&&t.addEventListener("click",s=>{s.preventDefault(),window.scrollTo({top:0,behavior:"smooth"})});const o=y.querySelector(".menu-toggle");o&&o.addEventListener("click",()=>{z()})}function ne(){if(!y||window.location.pathname==="/"||window.location.pathname.endsWith("/index.html"))return;const t=window.scrollY,o=window.innerHeight*.8,s=t>o;if(s&&!x?(x=!0,y.classList.add("visible")):!s&&x&&(x=!1,y.classList.remove("visible")),M){const i=document.documentElement.scrollHeight-window.innerHeight,a=i>0?t/i:0;M.style.width=`${a*100}%`}}const I={ROOT_MARGIN:"-50px",THRESHOLD:.1,STAGGER_DELAY:100};let E=null;function re(){if(!("IntersectionObserver"in window)){console.warn("⚠️ IntersectionObserver not supported, revealing all"),ue();return}const e=document.getElementById("content-area");E=new IntersectionObserver(le,{root:e||null,rootMargin:I.ROOT_MARGIN,threshold:I.THRESHOLD}),de(),console.log("✨ Scroll reveal system initialized")}function le(e){e.forEach(t=>{if(t.isIntersecting){const o=t.target;o.classList.add("is-revealed"),o.classList.contains("reveal-stagger")&&ce(o),E.unobserve(o)}})}function ce(e){const t=e.children;Array.from(t).forEach((o,s)=>{setTimeout(()=>{o.classList.add("is-revealed")},s*I.STAGGER_DELAY)})}function de(){const e=document.querySelectorAll("[data-reveal]"),t=document.querySelectorAll(".reveal-stagger");e.forEach(o=>{E.observe(o)}),t.forEach(o=>{E.observe(o)}),console.log(`📍 Observing ${e.length} reveal elements`)}function _(e){E&&e&&E.observe(e)}function ue(){document.querySelectorAll("[data-reveal]").forEach(t=>{t.classList.add("is-revealed")})}const he="/api",T=[{id:"networking",title:"Network",subtitle:"The Net-Work Technique",description:"Semi-transparent lattices where light and shadow become the true medium",count:17,image:"/images/8.webp"},{id:"coins",title:"Coins",subtitle:"Medals & Numismatics",description:"Microrealism engraved in negative form — miniature universes of precision",count:12,image:"/images/66.webp"},{id:"polygonal",title:"Polygonal",subtitle:"Geometric Forms",description:"Mathematical precision meets mythological weight in polygon-plate sculpture",count:6,image:"/images/93.webp"},{id:"nature",title:"Nature",subtitle:"Flora & Landscape",description:"Organic forms reimagined through industrial precision.",count:7,image:"/images/VUDRAG BOOK 2025_Page_042_Image_0001.webp"},{id:"portraits",title:"Portraits",subtitle:"Bronze Busts",description:"The private pulse behind the public face, forged in bronze",count:7,image:"/images/56.webp"},{id:"public-works",title:"Public Works",subtitle:"Monumental & Interventions",description:"Large-scale commissions transforming the dialogue between art and community",count:19,image:"/images/95.webp"}];let P=[...T];const m={maxRotation:6,perspective:1e3,scale:1.02,transitionSpeed:.5,trackingSpeed:.15};let L=null;async function me(){try{const e=new AbortController,t=setTimeout(()=>e.abort(),2e3),o=await fetch(`${he}/collections`,{signal:e.signal});if(clearTimeout(t),!o.ok)throw new Error("CMS unavailable");const s=await o.json();return s&&s.length>0?s.map(i=>{var a;return{id:i.id,title:i.title,subtitle:i.subtitle||"",description:i.description||"",image:i.image||"",count:((a=i.works)==null?void 0:a.length)||0}}):T}catch{return console.warn("⚠️ CMS unavailable or timed out, using fallback categories"),T}}async function pe(){const e=document.getElementById("content-area");if(!e)return console.warn("⚠️ Content area not found for category hub"),null;P=await me();const t=ge();e.appendChild(t),t.querySelectorAll(".category-card").forEach((i,a)=>{ve(i),i.setAttribute("data-reveal","true"),i.setAttribute("data-reveal-delay",String(a+1)),_(i)});const s=t.querySelector(".category-hub__header");return s&&_(s),console.log("✨ Category hub initialized with 3D cards"),t}function ge(){const e=document.createElement("div");return e.className="category-hub",e.id="category-hub",e.innerHTML=`
        <div class="category-hub__watermark" aria-hidden="true">COLLECTION</div>
        <header class="category-hub__header" data-reveal>
            <span class="category-hub__subtitle">Curated Series</span>
            <h2 class="category-hub__title">The Collection</h2>
            <div class="category-hub__divider"></div>
        </header>
        <div class="category-hub__grid reveal-stagger">
            ${P.map(o=>fe(o)).join("")}
        </div>
    `,e.querySelectorAll(".category-card").forEach(o=>{o.addEventListener("click",()=>{const s=o.dataset.category;_e(s)})}),e}function fe(e){return`
        <article class="category-card" data-category="${e.id}">
            <img 
                class="category-card__image" 
                src="${e.image}" 
                alt="${e.title}"
                loading="lazy"
            />
            <div class="category-card__overlay"></div>
            <div class="category-card__content">
                <span class="category-card__label">${e.subtitle}</span>
                <h3 class="category-card__title">${e.title}</h3>
                <span class="category-card__count">${e.count} works</span>
            </div>
        </article>
    `}function ve(e){const t=l=>{const r=e.getBoundingClientRect(),u=(l.clientX-r.left)/r.width-.5,d=(l.clientY-r.top)/r.height-.5,h=-d*m.maxRotation,p=u*m.maxRotation;e.style.transform=`
            perspective(${m.perspective}px)
            rotateX(${h}deg)
            rotateY(${p}deg)
            scale3d(${m.scale}, ${m.scale}, ${m.scale})
        `,R(e,u,d)},o=()=>{L=e,e.style.transition=`transform ${m.trackingSpeed}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`},s=()=>{L=null,e.style.transition=`transform ${m.transitionSpeed}s ease-out`,e.style.transform="perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";const l=e.querySelector(".category-card__shine");l&&(l.style.opacity="0")},i=l=>{L=e,e.style.transition=`transform ${m.trackingSpeed}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`},a=l=>{if(L!==e)return;const r=l.touches[0],u=e.getBoundingClientRect(),d=(r.clientX-u.left)/u.width-.5,h=(r.clientY-u.top)/u.height-.5,p=Math.max(-.5,Math.min(.5,d)),w=Math.max(-.5,Math.min(.5,h)),S=-w*m.maxRotation,$=p*m.maxRotation;e.style.transform=`
            perspective(${m.perspective}px)
            rotateX(${S}deg)
            rotateY(${$}deg)
            scale3d(${m.scale}, ${m.scale}, ${m.scale})
        `,R(e,p,w)},n=()=>{L=null,e.style.transition=`transform ${m.transitionSpeed}s ease-out`,e.style.transform="perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";const l=e.querySelector(".category-card__shine");l&&(l.style.opacity="0")};e.addEventListener("mousemove",t),e.addEventListener("mouseenter",o),e.addEventListener("mouseleave",s),e.addEventListener("touchstart",i,{passive:!0}),e.addEventListener("touchmove",a,{passive:!0}),e.addEventListener("touchend",n),e.addEventListener("touchcancel",n);const c=document.createElement("div");c.className="category-card__shine",c.style.cssText=`
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(
            circle at 50% 50%,
            rgba(255, 255, 255, 0.15) 0%,
            transparent 60%
        );
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease-out;
    `,e.appendChild(c)}function R(e,t,o){const s=e.querySelector(".category-card__shine");if(!s)return;const i=(t+.5)*100,a=(o+.5)*100;s.style.background=`radial-gradient(
        circle at ${i}% ${a}%,
        rgba(255, 255, 255, 0.2) 0%,
        transparent 50%
    )`,s.style.opacity="1"}function _e(e){if(console.log(`📂 Category selected: ${e}`),!P.find(s=>s.id===e))return;document.querySelectorAll(".category-card").forEach(s=>{s.classList.remove("is-active"),s.dataset.category===e&&s.classList.add("is-active")}),sessionStorage.setItem("vudrag_scroll_position",JSON.stringify({windowScrollY:window.scrollY})),window.location.href=`/gallery.html?category=${e}`}const ye="/api",g={name:"Nikola Vudrag",born:"1989, Croatia",tagline:"Sculptor of Light & Steel",quote:'"Each weld is a meditation—twenty thousand moments of attention fused into form."',portrait:"https://images.unsplash.com/photo-1560421683-6856ea585c78?w=800&q=80",videoUrl:"https://www.youtube.com/embed/FWGdlVFq39g",biography:{intro:"Born into a family with a metalworking legacy, Nikola was raised amidst forges and workshops, developing an early bond with metal that would define his artistic vision.",education:"He studied at the Academy of Applied Arts in Rijeka and the Academy of Fine Arts in Zagreb, specializing in medal-making and art therapy.",philosophy:"His work synthesizes science, mathematics, linguistics, philosophy, and mythology. Vudrag focuses on universal truths, creating art that resonates beyond cultural boundaries."},technique:{title:"The Net-work Method",description:`Vudrag's signature technique involves welding thousands of short steel rods into organic lattices. Up to 20,000 welds are fused in what he describes as a "ritual of attention."`,effect:'The resulting structures oscillate between solidity and void—appearing as dense mass in daylight and "solidified mist" when lit from within.'}};let f={...g};async function we(){var e,t,o,s,i,a;try{const n=new AbortController,c=setTimeout(()=>n.abort(),2e3),l=await fetch(`${ye}/site-content`,{signal:n.signal});if(clearTimeout(c),!l.ok)throw new Error("CMS unavailable");const r=await l.json();return r.artistSection?{name:r.artistSection.name||g.name,born:r.artistSection.born||g.born,tagline:r.artistSection.tagline||g.tagline,quote:r.artistSection.quote||g.quote,portrait:r.artistSection.portrait||g.portrait,videoUrl:r.artistSection.videoUrl||g.videoUrl,biography:{intro:((e=r.artistSection.biography)==null?void 0:e.intro)||g.biography.intro,education:((t=r.artistSection.biography)==null?void 0:t.education)||g.biography.education,philosophy:((o=r.artistSection.biography)==null?void 0:o.philosophy)||g.biography.philosophy},technique:{title:((s=r.artistSection.technique)==null?void 0:s.title)||g.technique.title,description:((i=r.artistSection.technique)==null?void 0:i.description)||g.technique.description,effect:((a=r.artistSection.technique)==null?void 0:a.effect)||g.technique.effect}}:g}catch{return console.warn("⚠️ CMS unavailable or timed out, using fallback artist data"),g}}async function be(){const e=document.getElementById("content-area");if(!e)return console.warn("⚠️ Content area not found for artist section"),null;f=await we();const t=Se();return e.appendChild(t),t.querySelectorAll("[data-reveal]").forEach(s=>_(s)),console.log("✨ Artist section initialized"),t}function Se(){const e=document.createElement("section");return e.className="artist-section",e.id="artist-section",e.innerHTML=`
        <div class="artist-section__watermark" aria-hidden="true">ARTIST</div>
        
        <!-- Hero Quote -->
        <div class="artist-section__quote-block" data-reveal>
            <blockquote class="artist-section__quote">
                ${f.quote}
            </blockquote>
        </div>

        <!-- Main Content Grid -->
        <div class="artist-section__grid">
            <!-- Portrait Column -->
            <div class="artist-section__portrait-col" data-reveal="left">
                <div class="artist-section__portrait-frame">
                    <img 
                        class="artist-section__portrait" 
                        src="${f.portrait}" 
                        alt="${f.name}"
                        loading="lazy"
                    />
                    <div class="artist-section__portrait-overlay"></div>
                </div>
                <div class="artist-section__portrait-caption">
                    <span class="artist-section__name">${f.name}</span>
                    <span class="artist-section__born">${f.born}</span>
                </div>
            </div>

            <!-- Biography Column -->
            <div class="artist-section__bio-col">
                <header class="artist-section__header" data-reveal data-reveal-delay="1">
                    <span class="artist-section__label">The Artist</span>
                    <h2 class="artist-section__title">${f.tagline}</h2>
                    <div class="artist-section__divider"></div>
                </header>

                <div class="artist-section__bio-text" data-reveal data-reveal-delay="2">
                    <p>${f.biography.intro}</p>
                    <p>${f.biography.education}</p>
                    <p>${f.biography.philosophy}</p>
                </div>

                <!-- Technique Highlight -->
                <div class="artist-section__technique" data-reveal data-reveal-delay="3">
                    <h3 class="artist-section__technique-title">${f.technique.title}</h3>
                    <p class="artist-section__technique-desc">${f.technique.description}</p>
                    <p class="artist-section__technique-effect">${f.technique.effect}</p>
                </div>
            </div>
        </div>

    `,e}const F="/api",C=[{id:"iron-maiden",title:"Iron Maiden",series:"Persona",year:"2023",size:"large",image:"https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=800&q=80"},{id:"vitreolum",title:"Vitreolum",series:"Net-work",year:"2023",size:"medium",image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"},{id:"sumerian-moon",title:"Sumerian Moon",series:"Elemental",year:"2025",size:"medium",image:"https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80"},{id:"relic",title:"The Relic",series:"Persona",year:"2022",size:"medium",image:"https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&q=80"},{id:"tomislav",title:"Tomislavus Rex",series:"Monuments",year:"2025",size:"medium",image:"https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&q=80"},{id:"madonna",title:"Madonna & the Veil",series:"Net-work",year:"2025",size:"large",image:"https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&q=80"},{id:"waterdrop",title:"Waterdrop",series:"Elemental",year:"2025",size:"tall",image:"https://images.unsplash.com/photo-1605792657660-596af9009e82?w=600&q=80"},{id:"tolkien",title:"J.R.R. Tolkien",series:"Portraits",year:"2024",size:"wide",image:"https://images.unsplash.com/photo-1560421683-6856ea585c78?w=800&q=80"},{id:"press",title:"Selected Media",series:"Press",year:"Various",size:"wide",image:"/images/luminous-museum-interior-stockcake.webp"}];let q=[...C];const b={maxRotation:8,perspective:1200,scale:1.02,transitionSpeed:.4};async function ke(){try{const[e,t]=await Promise.all([fetch(`${F}/grid-order`).then(o=>o.ok?o.json():[]),fetch(`${F}/sculptures`).then(o=>o.ok?o.json():{})]);return!e||e.length===0?(console.log("📋 No CMS grid order, using fallback"),C):e.map(o=>{const s=t[o.id]||{},i=C.find(a=>a.id===o.id)||{};return{id:o.id,size:o.size,title:s.title||i.title||o.id,series:s.series||i.series||"Unknown",year:s.year||i.year||"",image:s.heroImage||i.image||"https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=800&q=80"}})}catch(e){return console.warn("⚠️ CMS unavailable, using fallback works:",e.message),C}}async function Ee(){const e=document.getElementById("content-area");if(!e)return console.warn("⚠️ Content area not found for works showcase"),null;q=await ke(),console.log(`📋 Loaded ${q.length} works for showcase`);const t=Le();e.appendChild(t),t.querySelectorAll(".works-card").forEach((i,a)=>{Ce(i),i.setAttribute("data-reveal","true"),i.setAttribute("data-reveal-delay",String(a%4+1)),_(i)});const s=t.querySelector(".works-showcase__header");return s&&_(s),console.log("✨ Works showcase initialized with Bento grid"),t}function Le(){const e=document.createElement("section");return e.className="works-showcase",e.id="works-showcase",e.innerHTML=`
        <div class="works-showcase__watermark" aria-hidden="true">WORKS</div>
        
        <header class="works-showcase__header" data-reveal>
            <span class="works-showcase__label">Featured Pieces</span>
            <h2 class="works-showcase__title">The Selection</h2>
            <div class="works-showcase__divider"></div>
        </header>

        <div class="works-showcase__grid">
            ${q.map(t=>xe(t)).join("")}
        </div>

        <div class="works-showcase__cta" data-reveal>
            <a href="/gallery.html" class="works-showcase__link">
                <span>View Full Collection</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </a>
        </div>
    `,e}function xe(e){return`
        <a href="/sculpture.html?id=${e.id}" class="works-card works-card--${e.size}" data-work="${e.id}">
            <div class="works-card__image-wrap">
                <img 
                    class="works-card__image" 
                    src="${e.image}" 
                    alt="${e.title}"
                    loading="lazy"
                />
            </div>
            <div class="works-card__overlay"></div>
            <div class="works-card__content">
                <span class="works-card__series">${e.series}</span>
                <h3 class="works-card__title">${e.title}</h3>
                <span class="works-card__year">${e.year}</span>
            </div>
            <div class="works-card__shine"></div>
        </a>
    `}function Ce(e){const t=i=>{const a=e.getBoundingClientRect(),n=(i.clientX-a.left)/a.width-.5,c=(i.clientY-a.top)/a.height-.5,l=-c*b.maxRotation,r=n*b.maxRotation;e.style.transform=`
            perspective(${b.perspective}px)
            rotateX(${l}deg)
            rotateY(${r}deg)
            scale3d(${b.scale}, ${b.scale}, ${b.scale})
        `;const u=e.querySelector(".works-card__shine");if(u){const d=(n+.5)*100,h=(c+.5)*100;u.style.background=`radial-gradient(
                circle at ${d}% ${h}%,
                rgba(255, 255, 255, 0.15) 0%,
                transparent 50%
            )`,u.style.opacity="1"}},o=()=>{e.style.transition="transform 0.15s ease-out"},s=()=>{e.style.transition=`transform ${b.transitionSpeed}s ease-out`,e.style.transform="perspective(1200px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";const i=e.querySelector(".works-card__shine");i&&(i.style.opacity="0")};e.addEventListener("mousemove",t),e.addEventListener("mouseenter",o),e.addEventListener("mouseleave",s)}const $e="/api";let V=[];const Ae=[{id:"dubai-build-impossible",title:"Dubai — Build The Impossible",category:"Exhibition",youtubeId:"7-uhfMFcx7Y"},{id:"thompson-coin-necklace",title:"Thompson Coin Necklace",category:"Process",youtubeId:"rIlK_HQCXF4"},{id:"vudrag-legacy-trailer",title:"Vudrag Legacy Trailer",category:"Film",youtubeId:"ra1X5YLkFi0"},{id:"dubai-hedonist-gallery",title:"Dubai Hedonist Gallery — Opening Ceremony",category:"Exhibition",youtubeId:"rnDmBogTZy4"},{id:"thompson-coin",title:"Thompson Coin",category:"Process",youtubeId:"sWl-7BQHmC4"},{id:"kovnica-novca",title:"Kovnica Novca",category:"Documentary",youtubeId:"jkFG8-GsZq8"}];async function Me(){try{const e=await fetch(`${$e}/films`);if(!e.ok)throw new Error(`HTTP ${e.status}`);return(await e.json()).map(o=>({...o,thumbnail:o.youtubeId?`https://img.youtube.com/vi/${o.youtubeId}/maxresdefault.jpg`:""}))}catch(e){return console.warn("⚠️ Films API unavailable, using fallback data:",e.message),Ae.map(t=>({...t,thumbnail:`https://img.youtube.com/vi/${t.youtubeId}/maxresdefault.jpg`}))}}async function Ie(){const e=document.getElementById("content-area");if(!e)return console.warn("⚠️ Content area not found for film showcase"),null;const t=await Me();V=t;const o=Te(t);e.appendChild(o),Be(o),He(o);const s=o.querySelector(".film-showcase__header");s&&_(s),o.querySelectorAll(".film-strip").forEach((n,c)=>{n.setAttribute("data-reveal","true"),n.setAttribute("data-reveal-delay",String(c+1)),_(n)}),Oe(o);const a=o.querySelector(".film-showcase__expand");return a&&_(a),console.log("🎬 Film showcase (Cinematic Scroll) initialized"),o}function Te(e){const t=document.createElement("section");t.className="film-showcase",t.id="film-showcase",t.innerHTML=`
        <div class="film-showcase__watermark" aria-hidden="true">FILM</div>
        
        <header class="film-showcase__header" data-reveal>
            <span class="film-showcase__label">Film Projects</span>
            <h2 class="film-showcase__title">Moving Image</h2>
            <p class="film-showcase__subtitle">Where fire meets form — glimpses into the forging process, artist reflections, and the stories steel carries within.</p>
            <div class="film-showcase__divider"></div>
        </header>

        <div class="film-showcase__strips-wrapper film-showcase__strips-wrapper--collapsed">
            <div class="film-showcase__strips">
                ${e.map((s,i)=>qe(s,i)).join("")}
            </div>
            <div class="film-showcase__fade-overlay"></div>
        </div>

        <div class="film-showcase__expand" data-reveal>
            <button class="film-showcase__expand-btn">
                <span class="film-showcase__expand-text">Explore all films</span>
                <svg class="film-showcase__expand-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M6 9l6 6 6-6"/>
                </svg>
            </button>
            <span class="film-showcase__expand-count">${e.length} films</span>
        </div>
    `;const o=document.createElement("div");return o.className="film-lightbox",o.innerHTML=`
        <div class="film-lightbox__backdrop"></div>
        <div class="film-lightbox__content">
            <button class="film-lightbox__close" aria-label="Close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </button>
            <div class="film-lightbox__player"></div>
            <div class="film-lightbox__info">
                <span class="film-lightbox__category"></span>
                <h3 class="film-lightbox__title"></h3>
                <span class="film-lightbox__meta"></span>
            </div>
        </div>
    `,document.body.appendChild(o),t}function qe(e,t){return`
        <article class="film-strip" data-film-id="${e.id}" data-index="${t}">
            <div class="film-strip__frame">
                <div class="film-strip__thumbnail-wrap">
                    <img 
                        class="film-strip__thumbnail" 
                        src="${e.thumbnail}" 
                        alt="${e.title}"
                        loading="lazy"
                    />
                </div>
                <div class="film-strip__overlay"></div>
                
                <div class="film-strip__play">
                    <svg viewBox="0 0 80 80" fill="none">
                        <circle class="film-strip__play-ring" cx="40" cy="40" r="38" />
                        <polygon class="film-strip__play-tri" points="32,24 32,56 58,40" />
                    </svg>
                </div>

                <div class="film-strip__progress">
                    <div class="film-strip__progress-bar"></div>
                </div>
            </div>

            <div class="film-strip__info">
                <div class="film-strip__info-inner">
                    <span class="film-strip__category">${e.category}</span>
                    <h3 class="film-strip__title">${e.title}</h3>
                </div>
                <div class="film-strip__gold-line"></div>
            </div>

            <div class="film-strip__glow"></div>
        </article>
    `}function Be(e){const t=e.querySelectorAll(".film-strip");if(!t.length)return;const o=document.getElementById("content-area")||window;let s=!1;function i(){const n=window.innerHeight/2,c=window.innerHeight*.6;let l=null,r=1/0;const u=[];for(let d=0;d<t.length;d++){const h=t[d],p=h.getBoundingClientRect(),w=p.top+p.height/2,S=Math.abs(w-n),$=Math.max(0,1-S/c);u.push({strip:h,distance:S,proximity:$}),S<r&&(r=S,l=h)}for(let d=0;d<u.length;d++){const{strip:h,proximity:p}=u[d];h.style.setProperty("--proximity",p.toFixed(3)),h===l&&p>.3?h.classList.add("is-active"):h.classList.remove("is-active")}}function a(){s||(s=!0,requestAnimationFrame(()=>{i(),s=!1}))}o!==window&&o&&o.addEventListener("scroll",a,{passive:!0}),window.addEventListener("scroll",a,{passive:!0}),window.addEventListener("resize",a,{passive:!0}),requestAnimationFrame(()=>{i()})}function He(e){const t=document.querySelector(".film-lightbox");if(!t)return;const o=t.querySelector(".film-lightbox__backdrop"),s=t.querySelector(".film-lightbox__close"),i=t.querySelector(".film-lightbox__player"),a=t.querySelector(".film-lightbox__title"),n=t.querySelector(".film-lightbox__category"),c=t.querySelector(".film-lightbox__meta");function l(d){a.textContent=d.title,n.textContent=d.category,c.textContent=d.category,d.youtubeId?i.innerHTML=`
                <iframe 
                    src="https://www.youtube.com/embed/${d.youtubeId}?autoplay=1&rel=0&modestbranding=1"
                    allow="autoplay; encrypted-media"
                    allowfullscreen
                ></iframe>
            `:i.innerHTML=`
                <div class="film-lightbox__placeholder">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <rect x="2" y="2" width="20" height="20" rx="2"/>
                        <path d="M10 8l6 4-6 4V8z"/>
                    </svg>
                    <p>Film coming soon</p>
                </div>
            `,t.classList.add("is-open"),document.body.style.overflow="hidden"}function r(){t.classList.remove("is-open"),document.body.style.overflow="",setTimeout(()=>{i.innerHTML=""},400)}e.querySelectorAll(".film-strip").forEach(d=>{d.addEventListener("click",()=>{const h=d.dataset.filmId,p=V.find(w=>w.id===h);p&&l(p)})}),s.addEventListener("click",r),o.addEventListener("click",r),document.addEventListener("keydown",d=>{d.key==="Escape"&&t.classList.contains("is-open")&&r()})}function Oe(e){const t=e.querySelector(".film-showcase__strips-wrapper"),o=e.querySelector(".film-showcase__expand-btn"),s=e.querySelector(".film-showcase__expand");if(!t||!o)return;let i=!1;o.addEventListener("click",()=>{if(i=!i,i){const n=t.querySelector(".film-showcase__strips").scrollHeight;t.style.maxHeight=n+"px",t.classList.remove("film-showcase__strips-wrapper--collapsed"),t.classList.add("film-showcase__strips-wrapper--expanded"),s.querySelector(".film-showcase__expand-text").textContent="Show less",s.classList.add("film-showcase__expand--flipped")}else t.style.maxHeight="",t.classList.add("film-showcase__strips-wrapper--collapsed"),t.classList.remove("film-showcase__strips-wrapper--expanded"),s.querySelector(".film-showcase__expand-text").textContent="Explore all films",s.classList.remove("film-showcase__expand--flipped"),e.scrollIntoView({behavior:"smooth",block:"start"})})}const Pe=[{name:"Instagram",icon:"instagram",url:"https://www.instagram.com/vudrag_art/"},{name:"Facebook",icon:"facebook",url:"https://web.facebook.com/nikola.vudrag.77"},{name:"Interview",icon:"article",url:"https://www.contemporaryartissue.com/a-conversation-with-nikola-vudrag/"}],Re=[{label:"Collections",href:"#category-hub"},{label:"Artist",href:"#artist-section"},{label:"Inquire",href:"/contact.html"},{label:"Collectors Club",href:"/login.html"}];async function Fe(){const e=document.getElementById("content-area");if(!e||document.getElementById("main-footer"))return;const t=document.createElement("footer");t.id="main-footer",t.className="site-footer",t.innerHTML=`
        <div class="footer__border-accent"></div>
        
        <div class="footer__container">
            <!-- Brand Column -->
            <div class="footer__brand" data-reveal>
                <div class="footer__logo">
                    <span class="footer__logo-text">VUDRAG</span>
                    <span class="footer__logo-dot"></span>
                </div>
                <div class="footer__tagline">Sculpting in Light & Shadow</div>
                <p class="footer__description">
                    Exploring the intersection of classical craftsmanship and modern industrial art. 
                    Each piece tells a story of transformation, resilience, and raw power.
                </p>
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
                    <a href="mailto:studio@vudrag.com" class="footer__email">studio@vudrag.com</a>
                    <div class="footer__location">Varaždin • Zagreb • Dubai</div>
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
    `,e.appendChild(t);const o=t.querySelector(".footer__links");Re.forEach(i=>{const a=document.createElement("a");a.href=i.href,a.className="footer__link",i.href.startsWith("#")&&(a.dataset.target=i.href.substring(1)),a.innerHTML=`
            ${i.label}
            <span class="footer__link-arrow">→</span>
        `,o.appendChild(a)});const s=t.querySelector(".footer__social");Pe.forEach(i=>{const a=document.createElement("a");a.href=i.url,a.className="footer__social-link",a.target="_blank",a.rel="noopener noreferrer",a.ariaLabel=i.name,a.innerHTML=`
            ${Ne(i.icon)}
            <div class="footer__social-glow"></div>
        `,s.appendChild(a)}),ze(t),console.log("✅ Footer initialized")}function Ne(e){return{instagram:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
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
        </svg>`}[e]||""}function ze(e){e.querySelectorAll("[data-reveal]").forEach(a=>_(a));const o=e.querySelector(".footer__border-accent");o&&_(o),e.querySelectorAll(".footer__social-link").forEach(a=>{a.addEventListener("mouseenter",()=>{a.style.transform="translateY(-4px) scale(1.1)"}),a.addEventListener("mouseleave",()=>{a.style.transform=""})}),e.querySelectorAll(".footer__link").forEach(a=>{a.addEventListener("mouseenter",()=>{const n=a.querySelector(".footer__link-arrow");n&&(n.style.transform="translateX(8px)")}),a.addEventListener("mouseleave",()=>{const n=a.querySelector(".footer__link-arrow");n&&(n.style.transform="")}),a.addEventListener("click",n=>{n.preventDefault();const c=a.dataset.target;if(c)D(async()=>{const{navigateTo:l}=await Promise.resolve().then(()=>ee);return{navigateTo:l}},void 0).then(({navigateTo:l})=>{l(c)});else{const l=a.getAttribute("href");l&&(window.location.href=l)}})}),Ve(e)}function Ve(e){const t=e.querySelector(".footer__monogram");if(!t)return;if("ontouchstart"in window||navigator.maxTouchPoints>0)t.classList.add("footer__monogram--pulse");else{let s=null;const i=n=>{s&&cancelAnimationFrame(s),s=requestAnimationFrame(()=>{const c=t.getBoundingClientRect(),l=c.left+c.width/2,r=c.top+c.height/2,u=Math.hypot(n.clientX-l,n.clientY-r),h=Math.max(0,1-u/400),p=20+h*60,w=.3+h*.7;t.style.textShadow=`0 0 ${p}px rgba(201, 167, 122, ${w})`,t.style.opacity=.6+h*.4,t.style.setProperty("--stroke-color",`rgba(201, 167, 122, ${.4+h*.6})`)})};new IntersectionObserver(n=>{n.forEach(c=>{c.isIntersecting?document.addEventListener("mousemove",i):(document.removeEventListener("mousemove",i),t.style.textShadow="",t.style.opacity="")})},{threshold:.1}).observe(e)}}async function De(){console.log("🎨 Initializing Vudrag Gallery Experience..."),W(),ie(),re(),await pe(),await be(),await Ee(),await Ie(),await Fe(),N(),Ge(),console.log("✅ Experience initialized successfully!")}function Ge(){const e=document.getElementById("loading-screen");setTimeout(()=>{e.classList.add("loaded")},600)}window.addEventListener("error",e=>console.error("Error:",e.error));De().catch(console.error);
