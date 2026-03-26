import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css                  *//* empty css                          */import{t as H,o as v,s as B,a as P,c as F}from"./footer-Bz-CGK-k.js";/* empty css                        */import"./state-DFY6wBk_.js";import"./config-CNh1hCsG.js";import"./playcanvas-SM2qEX5e.js";const O=[{image:"/images/Network.webp",youtubeId:"BCEdZVVwBC4",youtubeIdMobile:"AL1UjxlcHo0",title:"NET-WORK",subtitle:"Latticework & Light",eyebrow:"The Net-Work Series",objectPosition:"center 50%",link:"/collection.html?id=networking"},{image:"/images/Atlas.webp",youtubeId:"PkF5YGPu_YI",youtubeIdMobile:"8sbb6UZwZC4",startTime:2,title:"MONUMENTAL",subtitle:"Where Geometry Bears the Weight of Myth",eyebrow:"Polygonal & Hercules",objectPosition:"center 30%",link:"/collection.html?id=monumental"},{image:"/images/Forge.webp",youtubeId:"-EINfzSwMeg",youtubeIdMobile:"XH2j7ZigZyE",title:"THE FORGE",subtitle:"Where Steel Becomes Spirit",eyebrow:"Nikola Vudrag",objectPosition:"center 35%",link:"/gallery.html"}];async function R(){try{const e=await fetch("/api/site-content");if(!e.ok)throw new Error("CMS unavailable");const t=await e.json();if(t.heroSlides&&t.heroSlides.length>0)return t.heroSlides}catch{console.warn("⚠️ Could not fetch hero slides from CMS, using fallback")}return O}function N(e){const i=window.innerWidth<window.innerHeight&&e.youtubeIdMobile?e.youtubeIdMobile:e.youtubeId;if(!i)return"";const s=["autoplay=1","mute=1","loop=1","controls=0","showinfo=0","modestbranding=1","rel=0","disablekb=1","iv_load_policy=3","playsinline=1",`playlist=${i}`,"enablejsapi=1","origin="+encodeURIComponent(window.location.origin),...e.startTime?[`start=${e.startTime}`]:[]].join("&");return`https://www.youtube.com/embed/${i}?${s}`}function j(e,t){const i=N(e);return i?`
            <div class="hero-slide__video-wrap">
                <iframe 
                    class="hero-slide__video"
                    ${t?`src="${i}"`:""}
                    data-src="${i}"
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
    `}async function z(){const e=document.getElementById("hero-section");if(!e)return;const t=await R();e.innerHTML=t.map((i,s)=>`
        <section class="hero-slide ${s===0?"is-active":""}" data-index="${s}">
            ${j(i,s===0)}
            <div class="hero-slide__overlay"></div>
            <div class="hero-slide__content">
                <span class="hero-slide__eyebrow">${i.eyebrow||""}</span>
                <h2 class="hero-slide__title">${i.title}</h2>
                <p class="hero-slide__subtitle">${i.subtitle||""}</p>
                <a href="${i.link||"/gallery.html"}" class="hero-slide__cta">
                    <span>Discover</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </a>
            </div>
        </section>
    `).join("")+`
        <nav class="hero-pagination" aria-label="Slide navigation">
            ${t.map((i,s)=>`
                <button class="hero-pagination__dot ${s===0?"is-active":""}" data-index="${s}" aria-label="Go to slide ${s+1}">
                    <span class="hero-pagination__number">${String(s+1).padStart(2,"0")}</span>
                </button>
            `).join("")}
        </nav>
    `,t.forEach(i=>{if(i.image){const s=new Image;s.src=i.image}}),D(e),V(e),G(e),console.log("🎬 Hero slider initialized —",t.length,"slides (lazy video loading)")}function Y(e){const t=e.querySelector(".hero-slide__video");!t||!t.dataset.src||t.getAttribute("src")!==t.dataset.src&&(t.src=t.dataset.src)}function W(e){const t=e.querySelector(".hero-slide__video");t&&t.removeAttribute("src")}function D(e){const t=e.querySelectorAll(".hero-slide"),i=e.querySelectorAll(".hero-pagination__dot");let s=0;const o=new IntersectionObserver(a=>{a.forEach(r=>{var l,n,u;const d=parseInt(r.target.dataset.index,10);if(r.isIntersecting&&r.intersectionRatio>=.5){if(d===s)return;(l=t[s])==null||l.classList.remove("is-active"),(n=i[s])==null||n.classList.remove("is-active"),W(t[s]),s=d,r.target.classList.add("is-active"),(u=i[d])==null||u.classList.add("is-active"),Y(r.target)}})},{root:e,threshold:[.1,.5]});t.forEach(a=>o.observe(a))}function V(e){e.querySelectorAll(".hero-pagination__dot").forEach(i=>{i.addEventListener("click",()=>{const s=parseInt(i.dataset.index,10),o=e.querySelectorAll(".hero-slide")[s];o&&o.scrollIntoView({behavior:"smooth",block:"start"})})})}function G(e){let t=0;const i=120;let s=!1;const o=e.querySelector(".hero-pagination");function a(){e.style.overflowY="hidden",e.style.scrollSnapType="none",o&&(o.style.opacity="0")}function r(){e.style.overflowY="",e.style.scrollSnapType="",o&&(o.style.opacity="")}e.addEventListener("wheel",d=>{if(s)return;if(e.scrollTop+e.clientHeight>=e.scrollHeight-2&&d.deltaY>0){if(t+=d.deltaY,t>=i){s=!0,t=0,a();const n=document.getElementById("content-area");n&&n.scrollIntoView({behavior:"smooth",block:"start"})}return}t=0},{passive:!0}),window.addEventListener("scroll",()=>{s&&window.scrollY<=5&&(s=!1,r())},{passive:!0})}let y=null,C=null,E=null,S=!1;const X={LOGO_TEXT:"VUDRAG"};function U(){y=document.createElement("header"),y.className="sticky-header",y.innerHTML=`
        <button class="menu-toggle" aria-label="Open menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
        
        <a href="#" class="logo">${X.LOGO_TEXT}</a>
        
        <a href="#" class="back-link" id="back-to-gallery">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>Gallery</span>
        </a>
        
        <div class="scroll-progress" id="scroll-progress-bar"></div>
    `,document.body.appendChild(y),C=document.getElementById("scroll-progress-bar"),E=document.getElementById("back-to-gallery");const e=window.location.pathname==="/"||window.location.pathname.endsWith("/index.html");E&&e&&(E.style.display="none"),K(),window.addEventListener("scroll",Z,{passive:!0}),console.log("📍 Sticky header created")}function K(){const e=y.querySelector(".logo");e&&e.addEventListener("click",s=>{s.preventDefault(),window.scrollTo({top:0,behavior:"smooth"})});const t=document.getElementById("back-to-gallery");t&&t.addEventListener("click",s=>{s.preventDefault(),window.scrollTo({top:0,behavior:"smooth"})});const i=y.querySelector(".menu-toggle");i&&i.addEventListener("click",()=>{H()})}function Z(){if(!y||window.location.pathname==="/"||window.location.pathname.endsWith("/index.html"))return;const t=window.scrollY,i=window.innerHeight*.8,s=t>i;if(s&&!S?(S=!0,y.classList.add("visible")):!s&&S&&(S=!1,y.classList.remove("visible")),C){const o=document.documentElement.scrollHeight-window.innerHeight,a=o>0?t/o:0;C.style.width=`${a*100}%`}}const Q="/api",L=[{id:"networking",title:"Net-Work",subtitle:"The Net-Work Technique",description:"Semi-transparent lattices where light and shadow become the true medium",count:17,image:"/images/8.webp",pageType:"network"},{id:"monumental",title:"Monumental",subtitle:"Polygonal & Hercules",description:"Mathematical precision meets mythological weight in polygon-plate sculpture",count:6,image:"/images/93.webp",pageType:"polygonal"},{id:"coins",title:"Coins",subtitle:"Medals & Numismatics",description:"Microrealism engraved in negative form — miniature universes of precision",count:12,image:"/images/66.webp",pageType:"coins"},{id:"portraits",title:"Portraits",subtitle:"Bronze Busts",description:"The private pulse behind the public face, forged in bronze",count:7,image:"/images/56.webp"},{id:"paintings",title:"Paintings",subtitle:"Metal Paintings",description:"Plasma-cut reliefs and torch-drawn compositions — where the metal sheet becomes canvas",count:7,image:"/images/VUDRAG BOOK 2025_Page_042_Image_0001.webp"},{id:"public-works",title:"Public Work",subtitle:"Monumental & Interventions",description:"Large-scale commissions transforming the dialogue between art and community",count:19,image:"/images/95.webp"}];let T=[...L];const h={maxRotation:6,perspective:1e3,scale:1.02,transitionSpeed:.5,trackingSpeed:.15};let k=null;async function J(){try{const e=new AbortController,t=setTimeout(()=>e.abort(),2e3),i=await fetch(`${Q}/collections`,{signal:e.signal});if(clearTimeout(t),!i.ok)throw new Error("CMS unavailable");const s=await i.json();return s&&s.length>0?s.map(o=>{var a;return{id:o.id,title:o.title,subtitle:o.subtitle||"",description:o.description||"",image:o.image||"",count:((a=o.works)==null?void 0:a.length)||0,pageType:o.pageType||"gallery"}}):L}catch{return console.warn("⚠️ CMS unavailable or timed out, using fallback categories"),L}}async function ee(){const e=document.getElementById("content-area");if(!e)return console.warn("⚠️ Content area not found for category hub"),null;T=await J();const t=te();e.appendChild(t),t.querySelectorAll(".category-card").forEach((o,a)=>{se(o),o.setAttribute("data-reveal","true"),o.setAttribute("data-reveal-delay",String(a+1)),v(o)});const s=t.querySelector(".category-hub__header");return s&&v(s),console.log("✨ Category hub initialized with 3D cards"),t}function te(){const e=document.createElement("div");return e.className="category-hub",e.id="category-hub",e.innerHTML=`
        <div class="category-hub__watermark" aria-hidden="true">COLLECTION</div>
        <header class="category-hub__header" data-reveal>
            <span class="category-hub__subtitle">Curated Series</span>
            <h2 class="category-hub__title">The Collection</h2>
            <div class="category-hub__divider"></div>
        </header>
        <div class="category-hub__grid reveal-stagger">
            ${T.map(i=>ie(i)).join("")}
        </div>
    `,e.querySelectorAll(".category-card").forEach(i=>{i.addEventListener("click",()=>{const s=i.dataset.category;oe(s)})}),e}function ie(e){return`
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
    `}function se(e){const t=l=>{const n=e.getBoundingClientRect(),u=(l.clientX-n.left)/n.width-.5,c=(l.clientY-n.top)/n.height-.5,p=-c*h.maxRotation,g=u*h.maxRotation;e.style.transform=`
            perspective(${h.perspective}px)
            rotateX(${p}deg)
            rotateY(${g}deg)
            scale3d(${h.scale}, ${h.scale}, ${h.scale})
        `,A(e,u,c)},i=()=>{k=e,e.style.transition=`transform ${h.trackingSpeed}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`},s=()=>{k=null,e.style.transition=`transform ${h.transitionSpeed}s ease-out`,e.style.transform="perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";const l=e.querySelector(".category-card__shine");l&&(l.style.opacity="0")},o=l=>{k=e,e.style.transition=`transform ${h.trackingSpeed}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`},a=l=>{if(k!==e)return;const n=l.touches[0],u=e.getBoundingClientRect(),c=(n.clientX-u.left)/u.width-.5,p=(n.clientY-u.top)/u.height-.5,g=Math.max(-.5,Math.min(.5,c)),w=Math.max(-.5,Math.min(.5,p)),b=-w*h.maxRotation,$=g*h.maxRotation;e.style.transform=`
            perspective(${h.perspective}px)
            rotateX(${b}deg)
            rotateY(${$}deg)
            scale3d(${h.scale}, ${h.scale}, ${h.scale})
        `,A(e,g,w)},r=()=>{k=null,e.style.transition=`transform ${h.transitionSpeed}s ease-out`,e.style.transform="perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";const l=e.querySelector(".category-card__shine");l&&(l.style.opacity="0")};e.addEventListener("mousemove",t),e.addEventListener("mouseenter",i),e.addEventListener("mouseleave",s),e.addEventListener("touchstart",o,{passive:!0}),e.addEventListener("touchmove",a,{passive:!0}),e.addEventListener("touchend",r),e.addEventListener("touchcancel",r);const d=document.createElement("div");d.className="category-card__shine",d.style.cssText=`
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
    `,e.appendChild(d)}function A(e,t,i){const s=e.querySelector(".category-card__shine");if(!s)return;const o=(t+.5)*100,a=(i+.5)*100;s.style.background=`radial-gradient(
        circle at ${o}% ${a}%,
        rgba(255, 255, 255, 0.2) 0%,
        transparent 50%
    )`,s.style.opacity="1"}function oe(e){console.log(`📂 Category selected: ${e}`);const t=T.find(o=>o.id===e);if(!t)return;document.querySelectorAll(".category-card").forEach(o=>{o.classList.remove("is-active"),o.dataset.category===e&&o.classList.add("is-active")}),sessionStorage.setItem("vudrag_scroll_position",JSON.stringify({windowScrollY:window.scrollY})),(t.pageType||"gallery")==="gallery"?window.location.href=`/gallery.html?category=${e}`:window.location.href=`/collection.html?id=${e}`}const ae="/api",m={name:"Nikola Vudrag",born:"1989, Croatia",tagline:"From Atom to Atlas",quote:'"Each weld is a meditation—twenty thousand moments of attention fused into form."',portrait:"/images/vudrag author.webp",videoUrl:"https://www.youtube.com/embed/FWGdlVFq39g",biography:{intro:"Born into a family with a metalworking legacy, Nikola was raised amidst forges and workshops, developing an early bond with metal that would define his artistic vision.",education:"He studied at the Academy of Applied Arts in Rijeka and the Academy of Fine Arts in Zagreb, specializing in medal-making and art therapy.",philosophy:"His work synthesizes science, mathematics, linguistics, philosophy, and mythology. Vudrag focuses on universal truths, creating art that resonates beyond cultural boundaries."},technique:{title:"The Net-work Method",description:`Vudrag's signature technique involves welding thousands of short steel rods into organic lattices. Up to 20,000 welds are fused in what he describes as a "ritual of attention."`,effect:'The resulting structures oscillate between solidity and void—appearing as dense mass in daylight and "solidified mist" when lit from within.'}};let f={...m};async function ne(){var e,t,i,s,o,a;try{const r=new AbortController,d=setTimeout(()=>r.abort(),2e3),l=await fetch(`${ae}/site-content`,{signal:r.signal});if(clearTimeout(d),!l.ok)throw new Error("CMS unavailable");const n=await l.json();return n.artistSection?{name:n.artistSection.name||m.name,born:n.artistSection.born||m.born,tagline:n.artistSection.tagline||m.tagline,quote:n.artistSection.quote||m.quote,portrait:n.artistSection.portrait||m.portrait,videoUrl:n.artistSection.videoUrl||m.videoUrl,biography:{intro:((e=n.artistSection.biography)==null?void 0:e.intro)||m.biography.intro,education:((t=n.artistSection.biography)==null?void 0:t.education)||m.biography.education,philosophy:((i=n.artistSection.biography)==null?void 0:i.philosophy)||m.biography.philosophy},technique:{title:((s=n.artistSection.technique)==null?void 0:s.title)||m.technique.title,description:((o=n.artistSection.technique)==null?void 0:o.description)||m.technique.description,effect:((a=n.artistSection.technique)==null?void 0:a.effect)||m.technique.effect}}:m}catch{return console.warn("⚠️ CMS unavailable or timed out, using fallback artist data"),m}}async function re(){const e=document.getElementById("content-area");if(!e)return console.warn("⚠️ Content area not found for artist section"),null;f=await ne();const t=le();return e.appendChild(t),t.querySelectorAll("[data-reveal]").forEach(s=>v(s)),console.log("✨ Artist section initialized"),t}function le(){const e=document.createElement("section");return e.className="artist-section",e.id="artist-section",e.innerHTML=`
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

    `,e}const I="/api",x=[{id:"network-featured",title:"The Net-Work",series:"Net-Work",year:"Collection",size:"large",image:"/images/8.webp",href:"/collection.html?id=networking"},{id:"exhibitions",title:"Exhibitions",series:"Gallery",year:"Worldwide",size:"large",image:"/images/VUDRAG-BOOK-MMXXV_Page_07_Image_0001.webp",href:"/gallery.html"},{id:"press",title:"Articles & Press",series:"Press",year:"Selected Media",size:"large",image:"/images/luminous-museum-interior-stockcake.webp",href:"/press.html"}];let M=[...x];const _={maxRotation:8,perspective:1200,scale:1.02,transitionSpeed:.4};async function ce(){try{const[e,t]=await Promise.all([fetch(`${I}/grid-order`).then(i=>i.ok?i.json():[]),fetch(`${I}/sculptures`).then(i=>i.ok?i.json():{})]);return!e||e.length===0?(console.log("📋 No CMS grid order, using fallback"),x):e.map(i=>{const s=t[i.id]||{},o=x.find(a=>a.id===i.id)||{};return{id:i.id,size:i.size,title:s.title||o.title||i.id,series:s.series||o.series||"Unknown",year:s.year||o.year||"",image:s.heroImage||o.image||"https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=800&q=80"}})}catch(e){return console.warn("⚠️ CMS unavailable, using fallback works:",e.message),x}}async function de(){const e=document.getElementById("content-area");if(!e)return console.warn("⚠️ Content area not found for works showcase"),null;M=await ce(),console.log(`📋 Loaded ${M.length} works for showcase`);const t=ue();e.appendChild(t),t.querySelectorAll(".works-card").forEach((o,a)=>{he(o),o.setAttribute("data-reveal","true"),o.setAttribute("data-reveal-delay",String(a%4+1)),v(o)});const s=t.querySelector(".works-showcase__header");return s&&v(s),console.log("✨ Works showcase initialized with Bento grid"),t}function ue(){const e=document.createElement("section");return e.className="works-showcase",e.id="works-showcase",e.innerHTML=`
        <div class="works-showcase__watermark" aria-hidden="true">WORKS</div>
        
        <header class="works-showcase__header" data-reveal>
            <span class="works-showcase__label">Featured Pieces</span>
            <h2 class="works-showcase__title">The Selection</h2>
            <div class="works-showcase__divider"></div>
        </header>

        <div class="works-showcase__grid">
            ${M.map(t=>pe(t)).join("")}
        </div>

        <div class="works-showcase__cta" data-reveal>
            <a href="/gallery.html" class="works-showcase__link">
                <span>View Full Collection</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </a>
        </div>
    `,e}function pe(e){return`
        <a href="${e.href||`/sculpture.html?id=${e.id}`}" class="works-card works-card--${e.size}" data-work="${e.id}">
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
    `}function he(e){const t=o=>{const a=e.getBoundingClientRect(),r=(o.clientX-a.left)/a.width-.5,d=(o.clientY-a.top)/a.height-.5,l=-d*_.maxRotation,n=r*_.maxRotation;e.style.transform=`
            perspective(${_.perspective}px)
            rotateX(${l}deg)
            rotateY(${n}deg)
            scale3d(${_.scale}, ${_.scale}, ${_.scale})
        `;const u=e.querySelector(".works-card__shine");if(u){const c=(r+.5)*100,p=(d+.5)*100;u.style.background=`radial-gradient(
                circle at ${c}% ${p}%,
                rgba(255, 255, 255, 0.15) 0%,
                transparent 50%
            )`,u.style.opacity="1"}},i=()=>{e.style.transition="transform 0.15s ease-out"},s=()=>{e.style.transition=`transform ${_.transitionSpeed}s ease-out`,e.style.transform="perspective(1200px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";const o=e.querySelector(".works-card__shine");o&&(o.style.opacity="0")};e.addEventListener("mousemove",t),e.addEventListener("mouseenter",i),e.addEventListener("mouseleave",s)}const me="/api";let q=[];const ge=[{id:"dubai-build-impossible",title:"Dubai — Build The Impossible",category:"Exhibition",youtubeId:"7-uhfMFcx7Y"},{id:"thompson-coin-necklace",title:"Thompson Coin Necklace",category:"Process",youtubeId:"rIlK_HQCXF4"},{id:"vudrag-legacy-trailer",title:"Vudrag Legacy Trailer",category:"Film",youtubeId:"ra1X5YLkFi0"},{id:"dubai-hedonist-gallery",title:"Dubai Hedonist Gallery — Opening Ceremony",category:"Exhibition",youtubeId:"rnDmBogTZy4"},{id:"thompson-coin",title:"Thompson Coin",category:"Process",youtubeId:"sWl-7BQHmC4"},{id:"kovnica-novca",title:"Kovnica Novca",category:"Documentary",youtubeId:"jkFG8-GsZq8"}];async function fe(){try{const e=await fetch(`${me}/films`);if(!e.ok)throw new Error(`HTTP ${e.status}`);return(await e.json()).map(i=>({...i,thumbnail:i.youtubeId?`https://img.youtube.com/vi/${i.youtubeId}/maxresdefault.jpg`:""}))}catch(e){return console.warn("⚠️ Films API unavailable, using fallback data:",e.message),ge.map(t=>({...t,thumbnail:`https://img.youtube.com/vi/${t.youtubeId}/maxresdefault.jpg`}))}}async function ye(){const e=document.getElementById("content-area");if(!e)return console.warn("⚠️ Content area not found for film showcase"),null;const t=await fe();q=t;const i=ve(t);e.appendChild(i),we(i),be(i);const s=i.querySelector(".film-showcase__header");s&&v(s),i.querySelectorAll(".film-strip").forEach((r,d)=>{r.setAttribute("data-reveal","true"),r.setAttribute("data-reveal-delay",String(d+1)),v(r)}),ke(i);const a=i.querySelector(".film-showcase__expand");return a&&v(a),console.log("🎬 Film showcase (Cinematic Scroll) initialized"),i}function ve(e){const t=document.createElement("section");t.className="film-showcase",t.id="film-showcase",t.innerHTML=`
        <div class="film-showcase__watermark" aria-hidden="true">FILM</div>
        
        <header class="film-showcase__header" data-reveal>
            <span class="film-showcase__label">Film Projects</span>
            <h2 class="film-showcase__title">Moving Image</h2>
            <p class="film-showcase__subtitle">Where fire meets form — glimpses into the forging process, artist reflections, and the stories steel carries within.</p>
            <div class="film-showcase__divider"></div>
        </header>

        <div class="film-showcase__strips-wrapper film-showcase__strips-wrapper--collapsed">
            <div class="film-showcase__strips">
                ${e.map((s,o)=>_e(s,o)).join("")}
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
    `;const i=document.createElement("div");return i.className="film-lightbox",i.innerHTML=`
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
    `,document.body.appendChild(i),t}function _e(e,t){return`
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
    `}function we(e){const t=e.querySelectorAll(".film-strip");if(!t.length)return;const i=document.getElementById("content-area")||window;let s=!1;function o(){const r=window.innerHeight/2,d=window.innerHeight*.6;let l=null,n=1/0;const u=[];for(let c=0;c<t.length;c++){const p=t[c],g=p.getBoundingClientRect(),w=g.top+g.height/2,b=Math.abs(w-r),$=Math.max(0,1-b/d);u.push({strip:p,distance:b,proximity:$}),b<n&&(n=b,l=p)}for(let c=0;c<u.length;c++){const{strip:p,proximity:g}=u[c];p.style.setProperty("--proximity",g.toFixed(3)),p===l&&g>.3?p.classList.add("is-active"):p.classList.remove("is-active")}}function a(){s||(s=!0,requestAnimationFrame(()=>{o(),s=!1}))}i!==window&&i&&i.addEventListener("scroll",a,{passive:!0}),window.addEventListener("scroll",a,{passive:!0}),window.addEventListener("resize",a,{passive:!0}),requestAnimationFrame(()=>{o()})}function be(e){const t=document.querySelector(".film-lightbox");if(!t)return;const i=t.querySelector(".film-lightbox__backdrop"),s=t.querySelector(".film-lightbox__close"),o=t.querySelector(".film-lightbox__player"),a=t.querySelector(".film-lightbox__title"),r=t.querySelector(".film-lightbox__category"),d=t.querySelector(".film-lightbox__meta");function l(c){a.textContent=c.title,r.textContent=c.category,d.textContent=c.category,c.youtubeId?o.innerHTML=`
                <iframe 
                    src="https://www.youtube.com/embed/${c.youtubeId}?autoplay=1&rel=0&modestbranding=1"
                    allow="autoplay; encrypted-media"
                    allowfullscreen
                ></iframe>
            `:o.innerHTML=`
                <div class="film-lightbox__placeholder">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                        <rect x="2" y="2" width="20" height="20" rx="2"/>
                        <path d="M10 8l6 4-6 4V8z"/>
                    </svg>
                    <p>Film coming soon</p>
                </div>
            `,t.classList.add("is-open"),document.body.style.overflow="hidden"}function n(){t.classList.remove("is-open"),document.body.style.overflow="",setTimeout(()=>{o.innerHTML=""},400)}e.querySelectorAll(".film-strip").forEach(c=>{c.addEventListener("click",()=>{const p=c.dataset.filmId,g=q.find(w=>w.id===p);g&&l(g)})}),s.addEventListener("click",n),i.addEventListener("click",n),document.addEventListener("keydown",c=>{c.key==="Escape"&&t.classList.contains("is-open")&&n()})}function ke(e){const t=e.querySelector(".film-showcase__strips-wrapper"),i=e.querySelector(".film-showcase__expand-btn"),s=e.querySelector(".film-showcase__expand");if(!t||!i)return;let o=!1;i.addEventListener("click",()=>{if(o=!o,o){const r=t.querySelector(".film-showcase__strips").scrollHeight;t.style.maxHeight=r+"px",t.classList.remove("film-showcase__strips-wrapper--collapsed"),t.classList.add("film-showcase__strips-wrapper--expanded"),s.querySelector(".film-showcase__expand-text").textContent="Show less",s.classList.add("film-showcase__expand--flipped")}else t.style.maxHeight="",t.classList.add("film-showcase__strips-wrapper--collapsed"),t.classList.remove("film-showcase__strips-wrapper--expanded"),s.querySelector(".film-showcase__expand-text").textContent="Explore all films",s.classList.remove("film-showcase__expand--flipped"),e.scrollIntoView({behavior:"smooth",block:"start"})})}async function Se(){console.log("🎨 Initializing Vudrag Gallery Experience..."),z(),U(),B(),await ee(),await re(),await ye(),await de(),await P(),F(),xe(),console.log("✅ Experience initialized successfully!")}function xe(){const e=document.getElementById("loading-screen");setTimeout(()=>{e.classList.add("loaded")},600)}window.addEventListener("error",e=>console.error("Error:",e.error));Se().catch(console.error);
