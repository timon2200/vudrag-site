import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css                  *//* empty css                          *//* empty css               *//* empty css                        */import{t as H,c as B}from"./menu-overlay-DLE_g6_o.js";import{o as _,s as P,a as F}from"./footer-lmqUJCMr.js";import"./state-DFY6wBk_.js";import"./config-cbGqdHWG.js";import"./playcanvas-C6g3ijIZ.js";const Y=[{image:"/images/Network.webp",youtubeId:"BCEdZVVwBC4",youtubeIdMobile:"AL1UjxlcHo0",title:"NET-WORK",subtitle:"Latticework & Light",eyebrow:"The Net-Work Series",objectPosition:"center 50%",link:"/collection.html?id=networking"},{image:"/images/Atlas.webp",youtubeId:"PkF5YGPu_YI",youtubeIdMobile:"8sbb6UZwZC4",startTime:2,title:"MONUMENTAL",subtitle:"Where Geometry Bears the Weight of Myth",eyebrow:"Polygonal & Hercules",objectPosition:"center 30%",link:"/collection.html?id=monumental"},{image:"/images/Forge.webp",youtubeId:"QDHLG4YIkno",youtubeIdMobile:"QDHLG4YIkno",title:"THE FORGE",subtitle:"Where Steel Becomes Spirit",eyebrow:"Studio & Rezervart",objectPosition:"center 35%",link:"/forge.html"}];async function R(){try{const e=await fetch("/api/site-content");if(!e.ok)throw new Error("CMS unavailable");const t=await e.json();if(t.heroSlides&&t.heroSlides.length>0)return t.heroSlides}catch{console.warn("⚠️ Could not fetch hero slides from CMS, using fallback")}return Y}function O(e){const i=window.innerWidth<window.innerHeight&&e.youtubeIdMobile?e.youtubeIdMobile:e.youtubeId;if(!i)return"";const s=["autoplay=1","mute=1","loop=1","controls=0","showinfo=0","modestbranding=1","rel=0","disablekb=1","iv_load_policy=3","playsinline=1",`playlist=${i}`,"enablejsapi=1","origin="+encodeURIComponent(window.location.origin),"cc_load_policy=3",...e.startTime?[`start=${e.startTime}`]:[]].join("&");return`https://www.youtube.com/embed/${i}?${s}`}function N(e,t){const i=O(e);return i?`
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
    `}async function j(){const e=document.getElementById("hero-section");if(!e)return;const t=await R();e.innerHTML=t.map((i,s)=>`
        <section class="hero-slide ${s===0?"is-active":""}" data-index="${s}">
            ${N(i,s===0)}
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
    `,t.forEach(i=>{if(i.image){const s=new Image;s.src=i.image}}),D(e),G(e),V(e),console.log("🎬 Hero slider initialized —",t.length,"slides (lazy video loading)")}function z(e){const t=e.querySelector(".hero-slide__video");!t||!t.dataset.src||t.getAttribute("src")!==t.dataset.src&&(t.src=t.dataset.src)}function W(e){const t=e.querySelector(".hero-slide__video");t&&t.removeAttribute("src")}function D(e){const t=e.querySelectorAll(".hero-slide"),i=e.querySelectorAll(".hero-pagination__dot");let s=0;const o=new IntersectionObserver(a=>{a.forEach(l=>{var c,n,u;const p=parseInt(l.target.dataset.index,10);if(l.isIntersecting&&l.intersectionRatio>=.5){if(p===s)return;(c=t[s])==null||c.classList.remove("is-active"),(n=i[s])==null||n.classList.remove("is-active"),W(t[s]),s=p,l.target.classList.add("is-active"),(u=i[p])==null||u.classList.add("is-active"),z(l.target)}})},{root:e,threshold:[.1,.5]});t.forEach(a=>o.observe(a))}function G(e){e.querySelectorAll(".hero-pagination__dot").forEach(i=>{i.addEventListener("click",()=>{const s=parseInt(i.dataset.index,10),o=e.querySelectorAll(".hero-slide")[s];o&&o.scrollIntoView({behavior:"smooth",block:"start"})})})}function V(e){let t=0;const i=80,s=60;let o=!1;const a=e.querySelector(".hero-pagination");function l(){return e.scrollTop+e.clientHeight>=e.scrollHeight-5}function p(){e.style.overflowY="hidden",e.style.scrollSnapType="none",a&&(a.style.opacity="0")}function c(){e.style.overflowY="",e.style.scrollSnapType="",a&&(a.style.opacity="")}function n(){o=!0,t=0,p();const d=document.getElementById("content-area");d&&d.scrollIntoView({behavior:"smooth",block:"start"})}e.addEventListener("wheel",d=>{if(!o){if(l()&&d.deltaY>0){t+=d.deltaY,t>=i&&n();return}t=0}},{passive:!0});let u=0,r=!1;e.addEventListener("touchstart",d=>{o||(u=d.touches[0].clientY,r=!0,t=0)},{passive:!0}),e.addEventListener("touchmove",d=>{if(o||!r)return;const h=d.touches[0].clientY,v=u-h;if(l()&&v>0){t+=v,u=h,t>=s&&(n(),r=!1);return}t=0,u=h},{passive:!0}),e.addEventListener("touchend",()=>{r=!1,t=0},{passive:!0}),window.addEventListener("scroll",()=>{o&&window.scrollY<=5&&(o=!1,c())},{passive:!0})}let y=null,C=null,E=null,S=!1;const X={LOGO_TEXT:"VUDRAG"};function U(){y=document.createElement("header"),y.className="sticky-header",y.innerHTML=`
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
    `,document.body.appendChild(y),C=document.getElementById("scroll-progress-bar"),E=document.getElementById("back-to-gallery");const e=window.location.pathname==="/"||window.location.pathname.endsWith("/index.html");E&&e&&(E.style.display="none"),K(),window.addEventListener("scroll",Z,{passive:!0}),console.log("📍 Sticky header created")}function K(){const e=y.querySelector(".logo");e&&e.addEventListener("click",s=>{s.preventDefault(),window.scrollTo({top:0,behavior:"smooth"})});const t=document.getElementById("back-to-gallery");t&&t.addEventListener("click",s=>{s.preventDefault(),window.scrollTo({top:0,behavior:"smooth"})});const i=y.querySelector(".menu-toggle");i&&i.addEventListener("click",()=>{H()})}function Z(){if(!y||window.location.pathname==="/"||window.location.pathname.endsWith("/index.html"))return;const t=window.scrollY,i=window.innerHeight*.8,s=t>i;if(s&&!S?(S=!0,y.classList.add("visible")):!s&&S&&(S=!1,y.classList.remove("visible")),C){const o=document.documentElement.scrollHeight-window.innerHeight,a=o>0?t/o:0;C.style.width=`${a*100}%`}}const Q="/api",L=[{id:"networking",title:"Net-Work",subtitle:"The Net-Work Technique",description:"Semi-transparent lattices where light and shadow become the true medium",count:17,image:"/images/8.webp",pageType:"network"},{id:"monumental",title:"Monumental",subtitle:"Polygonal & Hercules",description:"Mathematical precision meets mythological weight in polygon-plate sculpture",count:6,image:"/images/works/atlas-gardens.webp",pageType:"polygonal"},{id:"coins",title:"Coins",subtitle:"Medals & Numismatics",description:"Microrealism engraved in negative form — miniature universes of precision",count:12,image:"/images/66.webp",pageType:"coins"},{id:"portraits",title:"Portraits",subtitle:"Bronze Busts",description:"The private pulse behind the public face, forged in bronze",count:7,image:"/images/56.webp"},{id:"paintings",title:"Paintings",subtitle:"Metal Paintings",description:"Plasma-cut reliefs and torch-drawn compositions — where the metal sheet becomes canvas",count:2,image:"/images/works/painting-hand.webp",pageType:"paintings"},{id:"public-works",title:"Public Work",subtitle:"Monumental & Interventions",description:"Large-scale commissions transforming the dialogue between art and community",count:19,image:"/images/95.webp"}];let M=[...L];const m={maxRotation:6,perspective:1e3,scale:1.02,transitionSpeed:.5,trackingSpeed:.15};let k=null;async function J(){try{const e=new AbortController,t=setTimeout(()=>e.abort(),2e3),i=await fetch(`${Q}/collections`,{signal:e.signal});if(clearTimeout(t),!i.ok)throw new Error("CMS unavailable");const s=await i.json();return s&&s.length>0?s.map(o=>{var a;return{id:o.id,title:o.title,subtitle:o.subtitle||"",description:o.description||"",image:o.image||"",count:((a=o.works)==null?void 0:a.length)||0,pageType:o.pageType||"gallery"}}):L}catch{return console.warn("⚠️ CMS unavailable or timed out, using fallback categories"),L}}async function ee(){const e=document.getElementById("content-area");if(!e)return console.warn("⚠️ Content area not found for category hub"),null;M=await J();const t=te();e.appendChild(t),t.querySelectorAll(".category-card").forEach((o,a)=>{se(o),o.setAttribute("data-reveal","true"),o.setAttribute("data-reveal-delay",String(a+1)),_(o)});const s=t.querySelector(".category-hub__header");return s&&_(s),console.log("✨ Category hub initialized with 3D cards"),t}function te(){const e=document.createElement("div");return e.className="category-hub",e.id="category-hub",e.innerHTML=`
        <div class="category-hub__watermark" aria-hidden="true">COLLECTION</div>
        <header class="category-hub__header" data-reveal>
            <span class="category-hub__subtitle">Curated Series</span>
            <h2 class="category-hub__title">The Collection</h2>
            <div class="category-hub__divider"></div>
        </header>
        <div class="category-hub__grid reveal-stagger">
            ${M.map(i=>ie(i)).join("")}
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
    `}function se(e){const t=c=>{const n=e.getBoundingClientRect(),u=(c.clientX-n.left)/n.width-.5,r=(c.clientY-n.top)/n.height-.5,d=-r*m.maxRotation,h=u*m.maxRotation;e.style.transform=`
            perspective(${m.perspective}px)
            rotateX(${d}deg)
            rotateY(${h}deg)
            scale3d(${m.scale}, ${m.scale}, ${m.scale})
        `,A(e,u,r)},i=()=>{k=e,e.style.transition=`transform ${m.trackingSpeed}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`},s=()=>{k=null,e.style.transition=`transform ${m.transitionSpeed}s ease-out`,e.style.transform="perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";const c=e.querySelector(".category-card__shine");c&&(c.style.opacity="0")},o=c=>{k=e,e.style.transition=`transform ${m.trackingSpeed}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`},a=c=>{if(k!==e)return;const n=c.touches[0],u=e.getBoundingClientRect(),r=(n.clientX-u.left)/u.width-.5,d=(n.clientY-u.top)/u.height-.5,h=Math.max(-.5,Math.min(.5,r)),v=Math.max(-.5,Math.min(.5,d)),b=-v*m.maxRotation,$=h*m.maxRotation;e.style.transform=`
            perspective(${m.perspective}px)
            rotateX(${b}deg)
            rotateY(${$}deg)
            scale3d(${m.scale}, ${m.scale}, ${m.scale})
        `,A(e,h,v)},l=()=>{k=null,e.style.transition=`transform ${m.transitionSpeed}s ease-out`,e.style.transform="perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";const c=e.querySelector(".category-card__shine");c&&(c.style.opacity="0")};e.addEventListener("mousemove",t),e.addEventListener("mouseenter",i),e.addEventListener("mouseleave",s),e.addEventListener("touchstart",o,{passive:!0}),e.addEventListener("touchmove",a,{passive:!0}),e.addEventListener("touchend",l),e.addEventListener("touchcancel",l);const p=document.createElement("div");p.className="category-card__shine",p.style.cssText=`
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
    `,e.appendChild(p)}function A(e,t,i){const s=e.querySelector(".category-card__shine");if(!s)return;const o=(t+.5)*100,a=(i+.5)*100;s.style.background=`radial-gradient(
        circle at ${o}% ${a}%,
        rgba(255, 255, 255, 0.2) 0%,
        transparent 50%
    )`,s.style.opacity="1"}function oe(e){console.log(`📂 Category selected: ${e}`);const t=M.find(o=>o.id===e);if(!t)return;document.querySelectorAll(".category-card").forEach(o=>{o.classList.remove("is-active"),o.dataset.category===e&&o.classList.add("is-active")}),sessionStorage.setItem("vudrag_scroll_position",JSON.stringify({windowScrollY:window.scrollY})),(t.pageType||"gallery")==="gallery"?window.location.href=`/gallery.html?category=${e}`:window.location.href=`/collection.html?id=${e}`}const ae="/api",g={name:"Nikola Vudrag",born:"1989, Croatia",tagline:"From Atom to Atlas",quote:'"Each weld is a meditation—twenty thousand moments of attention fused into form."',portrait:"/images/vudrag author.webp",videoUrl:"https://www.youtube.com/embed/FWGdlVFq39g",biography:{intro:"Born into a family with a metalworking legacy, Nikola was raised amidst forges and workshops, developing an early bond with metal that would define his artistic vision.",education:"He studied at the Academy of Applied Arts in Rijeka and the Academy of Fine Arts in Zagreb, specializing in medal-making and art therapy.",philosophy:"His work synthesizes science, mathematics, linguistics, philosophy, and mythology. Vudrag focuses on universal truths, creating art that resonates beyond cultural boundaries."},technique:{title:"The Net-work Method",description:`Vudrag's signature technique involves welding thousands of short steel rods into organic lattices. Up to 20,000 welds are fused in what he describes as a "ritual of attention."`,effect:'The resulting structures oscillate between solidity and void—appearing as dense mass in daylight and "solidified mist" when lit from within.'}};let f={...g};async function ne(){var e,t,i,s,o,a;try{const l=new AbortController,p=setTimeout(()=>l.abort(),2e3),c=await fetch(`${ae}/site-content`,{signal:l.signal});if(clearTimeout(p),!c.ok)throw new Error("CMS unavailable");const n=await c.json();return n.artistSection?{name:n.artistSection.name||g.name,born:n.artistSection.born||g.born,tagline:n.artistSection.tagline||g.tagline,quote:n.artistSection.quote||g.quote,portrait:n.artistSection.portrait||g.portrait,videoUrl:n.artistSection.videoUrl||g.videoUrl,biography:{intro:((e=n.artistSection.biography)==null?void 0:e.intro)||g.biography.intro,education:((t=n.artistSection.biography)==null?void 0:t.education)||g.biography.education,philosophy:((i=n.artistSection.biography)==null?void 0:i.philosophy)||g.biography.philosophy},technique:{title:((s=n.artistSection.technique)==null?void 0:s.title)||g.technique.title,description:((o=n.artistSection.technique)==null?void 0:o.description)||g.technique.description,effect:((a=n.artistSection.technique)==null?void 0:a.effect)||g.technique.effect}}:g}catch{return console.warn("⚠️ CMS unavailable or timed out, using fallback artist data"),g}}async function re(){const e=document.getElementById("content-area");if(!e)return console.warn("⚠️ Content area not found for artist section"),null;f=await ne();const t=le();return e.appendChild(t),t.querySelectorAll("[data-reveal]").forEach(s=>_(s)),console.log("✨ Artist section initialized"),t}function le(){const e=document.createElement("section");return e.className="artist-section",e.id="artist-section",e.innerHTML=`
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

    `,e}const I="/api",x=[{id:"network-featured",title:"The Net-Work",series:"Net-Work",year:"Collection",size:"large",image:"/images/8.webp",href:"/collection.html?id=networking"},{id:"the-forge",title:"The Forge",series:"Studio & Rezervart",year:"Varaždin",size:"large",image:"/images/Forge.webp",href:"/forge.html"},{id:"press",title:"Articles & Press",series:"Press",year:"Selected Media",size:"large",image:"/images/the press.jpeg",href:"/press.html"}];let T=[...x];const w={maxRotation:8,perspective:1200,scale:1.02,transitionSpeed:.4};async function ce(){try{const[e,t]=await Promise.all([fetch(`${I}/grid-order`).then(i=>i.ok?i.json():[]),fetch(`${I}/sculptures`).then(i=>i.ok?i.json():{})]);return!e||e.length===0?(console.log("📋 No CMS grid order, using fallback"),x):e.map(i=>{const s=t[i.id]||{},o=x.find(a=>a.id===i.id)||{};return{id:i.id,size:i.size,title:s.title||o.title||i.id,series:s.series||o.series||"Unknown",year:s.year||o.year||"",image:s.heroImage||o.image||"https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=800&q=80",...o.href?{href:o.href}:{}}})}catch(e){return console.warn("⚠️ CMS unavailable, using fallback works:",e.message),x}}async function de(){const e=document.getElementById("content-area");if(!e)return console.warn("⚠️ Content area not found for works showcase"),null;T=await ce(),console.log(`📋 Loaded ${T.length} works for showcase`);const t=ue();e.appendChild(t),t.querySelectorAll(".works-card").forEach((o,a)=>{he(o),o.setAttribute("data-reveal","true"),o.setAttribute("data-reveal-delay",String(a%4+1)),_(o)});const s=t.querySelector(".works-showcase__header");return s&&_(s),console.log("✨ Works showcase initialized with Bento grid"),t}function ue(){const e=document.createElement("section");return e.className="works-showcase",e.id="works-showcase",e.innerHTML=`
        <div class="works-showcase__watermark" aria-hidden="true">WORKS</div>
        
        <header class="works-showcase__header" data-reveal>
            <span class="works-showcase__label">Featured Pieces</span>
            <h2 class="works-showcase__title">The Selection</h2>
            <div class="works-showcase__divider"></div>
        </header>

        <div class="works-showcase__grid">
            ${T.map(t=>pe(t)).join("")}
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
    `}function he(e){const t=o=>{const a=e.getBoundingClientRect(),l=(o.clientX-a.left)/a.width-.5,p=(o.clientY-a.top)/a.height-.5,c=-p*w.maxRotation,n=l*w.maxRotation;e.style.transform=`
            perspective(${w.perspective}px)
            rotateX(${c}deg)
            rotateY(${n}deg)
            scale3d(${w.scale}, ${w.scale}, ${w.scale})
        `;const u=e.querySelector(".works-card__shine");if(u){const r=(l+.5)*100,d=(p+.5)*100;u.style.background=`radial-gradient(
                circle at ${r}% ${d}%,
                rgba(255, 255, 255, 0.15) 0%,
                transparent 50%
            )`,u.style.opacity="1"}},i=()=>{e.style.transition="transform 0.15s ease-out"},s=()=>{e.style.transition=`transform ${w.transitionSpeed}s ease-out`,e.style.transform="perspective(1200px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";const o=e.querySelector(".works-card__shine");o&&(o.style.opacity="0")};e.addEventListener("mousemove",t),e.addEventListener("mouseenter",i),e.addEventListener("mouseleave",s)}const me="/api";let q=[];const ge=[{id:"dubai-build-impossible",title:"Dubai — Build The Impossible",category:"Exhibition",youtubeId:"7-uhfMFcx7Y"},{id:"thompson-coin-necklace",title:"Thompson Coin Necklace",category:"Process",youtubeId:"rIlK_HQCXF4"},{id:"vudrag-legacy-trailer",title:"Vudrag Legacy Trailer",category:"Film",youtubeId:"ra1X5YLkFi0"},{id:"dubai-hedonist-gallery",title:"Dubai Hedonist Gallery — Opening Ceremony",category:"Exhibition",youtubeId:"rnDmBogTZy4"},{id:"thompson-coin",title:"Thompson Coin",category:"Process",youtubeId:"sWl-7BQHmC4"},{id:"kovnica-novca",title:"Kovnica Novca",category:"Documentary",youtubeId:"jkFG8-GsZq8"}];async function fe(){try{const e=await fetch(`${me}/films`);if(!e.ok)throw new Error(`HTTP ${e.status}`);return(await e.json()).map(i=>({...i,thumbnail:i.youtubeId?`https://img.youtube.com/vi/${i.youtubeId}/maxresdefault.jpg`:""}))}catch(e){return console.warn("⚠️ Films API unavailable, using fallback data:",e.message),ge.map(t=>({...t,thumbnail:`https://img.youtube.com/vi/${t.youtubeId}/maxresdefault.jpg`}))}}async function ve(){const e=document.getElementById("content-area");if(!e)return console.warn("⚠️ Content area not found for film showcase"),null;const t=await fe();q=t;const i=ye(t);e.appendChild(i),we(i),be(i);const s=i.querySelector(".film-showcase__header");s&&_(s),i.querySelectorAll(".film-strip").forEach((l,p)=>{l.setAttribute("data-reveal","true"),l.setAttribute("data-reveal-delay",String(p+1)),_(l)}),ke(i);const a=i.querySelector(".film-showcase__expand");return a&&_(a),console.log("🎬 Film showcase (Cinematic Scroll) initialized"),i}function ye(e){const t=document.createElement("section");t.className="film-showcase",t.id="film-showcase",t.innerHTML=`
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
    `}function we(e){const t=e.querySelectorAll(".film-strip");if(!t.length)return;const i=document.getElementById("content-area")||window;let s=!1;function o(){const l=window.innerHeight/2,p=window.innerHeight*.6;let c=null,n=1/0;const u=[];for(let r=0;r<t.length;r++){const d=t[r],h=d.getBoundingClientRect(),v=h.top+h.height/2,b=Math.abs(v-l),$=Math.max(0,1-b/p);u.push({strip:d,distance:b,proximity:$}),b<n&&(n=b,c=d)}for(let r=0;r<u.length;r++){const{strip:d,proximity:h}=u[r];d.style.setProperty("--proximity",h.toFixed(3)),d===c&&h>.3?d.classList.add("is-active"):d.classList.remove("is-active")}}function a(){s||(s=!0,requestAnimationFrame(()=>{o(),s=!1}))}i!==window&&i&&i.addEventListener("scroll",a,{passive:!0}),window.addEventListener("scroll",a,{passive:!0}),window.addEventListener("resize",a,{passive:!0}),requestAnimationFrame(()=>{o()})}function be(e){const t=document.querySelector(".film-lightbox");if(!t)return;const i=t.querySelector(".film-lightbox__backdrop"),s=t.querySelector(".film-lightbox__close"),o=t.querySelector(".film-lightbox__player"),a=t.querySelector(".film-lightbox__title"),l=t.querySelector(".film-lightbox__category"),p=t.querySelector(".film-lightbox__meta");function c(r){a.textContent=r.title,l.textContent=r.category,p.textContent=r.category,r.youtubeId?o.innerHTML=`
                <iframe 
                    src="https://www.youtube.com/embed/${r.youtubeId}?autoplay=1&rel=0&modestbranding=1&cc_load_policy=3"
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
            `,t.classList.add("is-open"),document.body.style.overflow="hidden"}function n(){t.classList.remove("is-open"),document.body.style.overflow="",setTimeout(()=>{o.innerHTML=""},400)}e.querySelectorAll(".film-strip").forEach(r=>{r.addEventListener("click",()=>{const d=r.dataset.filmId,h=q.find(v=>v.id===d);h&&c(h)})}),s.addEventListener("click",n),i.addEventListener("click",n),document.addEventListener("keydown",r=>{r.key==="Escape"&&t.classList.contains("is-open")&&n()})}function ke(e){const t=e.querySelector(".film-showcase__strips-wrapper"),i=e.querySelector(".film-showcase__expand-btn"),s=e.querySelector(".film-showcase__expand");if(!t||!i)return;let o=!1;i.addEventListener("click",()=>{if(o=!o,o){const l=t.querySelector(".film-showcase__strips").scrollHeight;t.style.maxHeight=l+"px",t.classList.remove("film-showcase__strips-wrapper--collapsed"),t.classList.add("film-showcase__strips-wrapper--expanded"),s.querySelector(".film-showcase__expand-text").textContent="Show less",s.classList.add("film-showcase__expand--flipped")}else t.style.maxHeight="",t.classList.add("film-showcase__strips-wrapper--collapsed"),t.classList.remove("film-showcase__strips-wrapper--expanded"),s.querySelector(".film-showcase__expand-text").textContent="Explore all films",s.classList.remove("film-showcase__expand--flipped"),e.scrollIntoView({behavior:"smooth",block:"start"})})}async function Se(){console.log("🎨 Initializing Vudrag Gallery Experience..."),await j(),$e(),console.log("✅ Hero ready — loading screen dismissed"),(window.requestIdleCallback||(t=>setTimeout(t,1)))(()=>{xe().then(()=>{console.log("✅ All sections loaded")})},{timeout:1e3})}async function xe(){U(),P(),await ee(),await re(),await ve(),await de(),await F(),B()}function $e(){const e=document.getElementById("loading-screen");setTimeout(()=>{e.classList.add("loaded")},600)}window.addEventListener("error",e=>console.error("Error:",e.error));Se().catch(console.error);
