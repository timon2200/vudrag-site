async function C(t,e){const{pageContent:a,works:r=[],segments:s=[]}=e,{heroSlides:n=[],introduction:o={},patterns:l=[],technique:i={}}=a||{};t.innerHTML=g(e,n,o,l,r),requestAnimationFrame(()=>{k(t),q(t),x(t),E(t),I(t)})}function g(t,e,a,r,s,n){return`
        ${h(e)}
        ${m(a)}
        ${b(s)}
        ${y(r)}
        ${$()}
    `}function h(t){return t.length?`
        <section class="nw-hero" id="nw-hero">
            ${t.map((e,a)=>`
                <div class="nw-hero__slide ${a===0?"is-active":""}" data-index="${a}">
                    ${f(e,a===0)}
                    <div class="nw-hero__overlay"></div>
                    <div class="nw-hero__content">
                        <span class="nw-hero__eyebrow">${e.eyebrow||""}</span>
                        <h1 class="nw-hero__title">${e.title}</h1>
                        <p class="nw-hero__subtitle">${e.subtitle||""}</p>
                    </div>
                </div>
            `).join("")}
            <nav class="nw-hero__pagination" aria-label="Slide navigation">
                ${t.map((e,a)=>`
                    <button class="nw-hero__dot ${a===0?"is-active":""}" data-index="${a}" aria-label="Go to slide ${a+1}">
                        <span class="nw-hero__dot-number">${String(a+1).padStart(2,"0")}</span>
                    </button>
                `).join("")}
            </nav>
            <div class="nw-hero__scroll-hint">
                <span>Scroll to explore</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
            </div>
            <a href="/" class="nw-hero__back">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                <span>Back</span>
            </a>
        </section>
    `:""}function f(t,e){if(t.youtubeId){const a=t.youtubeId,r=["autoplay=1","mute=1","loop=1","controls=0","showinfo=0","modestbranding=1","rel=0","disablekb=1","iv_load_policy=3","playsinline=1",`playlist=${a}`,"enablejsapi=1","origin="+encodeURIComponent(window.location.origin)].join("&"),s=`https://www.youtube.com/embed/${a}?${r}`;return`
            <div class="nw-hero__video-wrap">
                <iframe
                    class="nw-hero__video"
                    ${e?`src="${s}"`:""}
                    data-src="${s}"
                    frameborder="0"
                    allow="autoplay; encrypted-media"
                    allowfullscreen
                    tabindex="-1"
                ></iframe>
            </div>
            ${t.image?`<img class="nw-hero__image nw-hero__image--poster" src="${t.image}" alt="${t.title}" draggable="false" />`:""}
        `}return`<img class="nw-hero__image" src="${t.image}" alt="${t.title}" draggable="false" />`}function m(t){return t.title?`
        <section class="nw-intro" id="nw-intro">
            <div class="nw-intro__watermark" aria-hidden="true">NET-WORK</div>
            <div class="nw-intro__content" data-reveal>
                <span class="nw-intro__eyebrow">${t.eyebrow||""}</span>
                <h2 class="nw-intro__title">${t.title}</h2>
                <div class="nw-intro__divider"></div>
                <p class="nw-intro__text">${t.text||""}</p>
                ${t.quote?`
                    <blockquote class="nw-intro__quote">
                        <p>"${t.quote}"</p>
                        <cite>— Nikola Vudrag</cite>
                    </blockquote>
                `:""}
            </div>
        </section>
    `:""}function y(t){return t.length?`
        <section class="nw-patterns" id="nw-patterns">
            <div class="nw-patterns__watermark" aria-hidden="true">PATTERNS</div>
            <header class="nw-patterns__header" data-reveal>
                <span class="nw-patterns__label">Four Disciplines</span>
                <h2 class="nw-patterns__title">The Welding Patterns</h2>
                <div class="nw-patterns__divider"></div>
            </header>
            <div class="nw-patterns__grid">
                ${t.map((e,a)=>{const r=e.images||[e.image,e.image],s=e.finishLabels||["Finish A","Finish B"];return`
                    <article class="nw-pattern-card" data-reveal data-reveal-delay="${a+1}">
                        <div class="nw-comparator" data-comparator>
                            <div class="nw-comparator__image-wrap nw-comparator__image-wrap--left">
                                <img class="nw-comparator__image" src="${r[0]}" alt="${e.title} — ${s[0]}" loading="lazy" draggable="false" />
                            </div>
                            <div class="nw-comparator__image-wrap nw-comparator__image-wrap--right">
                                <img class="nw-comparator__image" src="${r[1]}" alt="${e.title} — ${s[1]}" loading="lazy" draggable="false" />
                            </div>
                            <div class="nw-comparator__divider" data-comparator-handle>
                                <div class="nw-comparator__line"></div>
                                <div class="nw-comparator__handle">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                        <path d="M8 5l-5 7 5 7"/><path d="M16 5l5 7-5 7"/>
                                    </svg>
                                </div>
                            </div>
                            <span class="nw-comparator__label nw-comparator__label--left">${s[0]}</span>
                            <span class="nw-comparator__label nw-comparator__label--right">${s[1]}</span>
                        </div>
                        <div class="nw-pattern-card__content">
                            <span class="nw-pattern-card__number">${String(a+1).padStart(2,"0")}</span>
                            <h3 class="nw-pattern-card__title">${e.title}</h3>
                            <span class="nw-pattern-card__subtitle">${e.subtitle}</span>
                            <p class="nw-pattern-card__description">${e.description}</p>
                        </div>
                    </article>
                `}).join("")}
            </div>
        </section>
    `:""}function b(t){if(!t.length)return"";const e=t.filter(n=>n.segment==="Self Standing"),a=t.filter(n=>n.segment==="Wall"),r=t.filter(n=>!n.segment);let s=[];return e.length&&(s.push({type:"divider",label:"Self Standing",count:e.length}),e.forEach(n=>s.push({type:"work",data:n}))),a.length&&(s.push({type:"divider",label:"Wall",count:a.length}),a.forEach(n=>s.push({type:"work",data:n}))),r.length&&r.forEach(n=>s.push({type:"work",data:n})),`
        <section class="nw-gallery" id="nw-gallery">
            <header class="nw-gallery__header" data-reveal>
                <span class="nw-gallery__label">The Collection</span>
                <h2 class="nw-gallery__title">Works</h2>
                <div class="nw-gallery__divider"></div>
                <p class="nw-gallery__hint">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                    Scroll horizontally to explore
                </p>
            </header>
            <div class="nw-gallery__track-wrapper">
                <div class="nw-gallery__track" id="nw-gallery-track">
                    ${s.map((n,o)=>{if(n.type==="divider")return`
                                <div class="nw-gallery__segment-divider">
                                    <span class="nw-gallery__segment-watermark">${n.label.toUpperCase()}</span>
                                    <div class="nw-gallery__segment-info">
                                        <span class="nw-gallery__segment-count">${n.count} Works</span>
                                    </div>
                                </div>
                            `;const l=n.data;return`
                            <article class="nw-work-card" data-index="${o}">
                                <div class="nw-work-card__image-wrap">
                                    <img class="nw-work-card__image" src="${l.image}" alt="${l.title}" loading="lazy" />
                                </div>
                                <div class="nw-work-card__overlay"></div>
                                <div class="nw-work-card__content">
                                    <div class="nw-work-card__meta">
                                        <span class="nw-work-card__year">${l.year}</span>
                                        ${l.dimensions?`<span class="nw-work-card__dimensions">${l.dimensions}</span>`:""}
                                    </div>
                                    <h3 class="nw-work-card__title">${l.title}</h3>
                                    <p class="nw-work-card__description">${l.description}</p>
                                </div>
                                <div class="nw-work-card__glow"></div>
                            </article>
                        `}).join("")}
                </div>
                <div class="nw-gallery__progress">
                    <div class="nw-gallery__progress-bar" id="nw-gallery-progress"></div>
                </div>
            </div>
        </section>
    `}function $(){return`
        <section class="nw-inquire" id="nw-inquire">
            <div class="nw-inquire__container" data-reveal>
                <div class="nw-inquire__crown">
                    <span class="nw-inquire__line"></span>
                    <span class="nw-inquire__diamond">◈</span>
                    <span class="nw-inquire__line"></span>
                </div>
                <span class="nw-inquire__label">Commissions & Inquiries</span>
                <h3 class="nw-inquire__title">
                    <span>Let's </span>
                    <span class="nw-inquire__title-accent">Connect</span>
                </h3>
                <p class="nw-inquire__text">
                    For custom welded sculpture commissions, exhibition inquiries, or to discuss a collaborative project — I welcome your message.
                </p>
                <a href="/contact.html" class="nw-inquire__cta">
                    <span>Get in Touch</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </a>
            </div>
        </section>
    `}function k(t){const e=t.querySelector("#nw-hero");if(!e)return;const a=e.querySelectorAll(".nw-hero__slide"),r=e.querySelectorAll(".nw-hero__dot");let s=0;const n=new IntersectionObserver(c=>{c.forEach(w=>{var _,u,v;const d=parseInt(w.target.dataset.index,10);if(w.isIntersecting&&w.intersectionRatio>=.5){if(d===s)return;(_=a[s])==null||_.classList.remove("is-active"),(u=r[s])==null||u.classList.remove("is-active"),L(a[s]),s=d,w.target.classList.add("is-active"),(v=r[d])==null||v.classList.add("is-active"),S(w.target)}})},{root:e,threshold:[.1,.5]});a.forEach(c=>n.observe(c)),r.forEach(c=>{c.addEventListener("click",()=>{const w=parseInt(c.dataset.index,10),d=a[w];d&&d.scrollIntoView({behavior:"smooth",block:"start"})})});let o=0;const l=120;let i=!1;const p=e.querySelector(".nw-hero__pagination");e.addEventListener("wheel",c=>{if(i)return;if(e.scrollTop+e.clientHeight>=e.scrollHeight-2&&c.deltaY>0){if(o+=c.deltaY,o>=l){i=!0,o=0,e.style.overflowY="hidden",e.style.scrollSnapType="none",p&&(p.style.opacity="0");const d=t.querySelector("#nw-intro");d&&d.scrollIntoView({behavior:"smooth",block:"start"})}return}o=0},{passive:!0}),window.addEventListener("scroll",()=>{i&&window.scrollY<=5&&(i=!1,e.style.overflowY="",e.style.scrollSnapType="",p&&(p.style.opacity=""))},{passive:!0})}function S(t){const e=t==null?void 0:t.querySelector(".nw-hero__video");!e||!e.dataset.src||e.getAttribute("src")!==e.dataset.src&&(e.src=e.dataset.src)}function L(t){const e=t==null?void 0:t.querySelector(".nw-hero__video");e&&e.removeAttribute("src")}function q(t){const e=t.querySelectorAll("[data-reveal]"),a=new IntersectionObserver(r=>{r.forEach(s=>{if(s.isIntersecting){const n=parseInt(s.target.dataset.revealDelay||"0",10);setTimeout(()=>{s.target.classList.add("is-revealed")},n*150),a.unobserve(s.target)}})},{threshold:.15,rootMargin:"0px 0px -40px 0px"});e.forEach(r=>a.observe(r))}function x(t){t.querySelectorAll("[data-comparator]").forEach(a=>{const r=a.querySelector(".nw-comparator__image-wrap--right"),s=a.querySelector("[data-comparator-handle]");if(!r||!s)return;let n=!1,o=50;function l(i){const p=a.getBoundingClientRect(),c=i-p.left;o=Math.max(5,Math.min(95,c/p.width*100)),requestAnimationFrame(()=>{r.style.clipPath=`inset(0 0 0 ${o}%)`,r.style.webkitClipPath=`inset(0 0 0 ${o}%)`,s.style.left=`${o}%`})}a.addEventListener("mousedown",i=>{n=!0,a.classList.add("is-dragging"),l(i.clientX),i.preventDefault()}),window.addEventListener("mousemove",i=>{n&&l(i.clientX)}),window.addEventListener("mouseup",()=>{n&&(n=!1,a.classList.remove("is-dragging"))}),a.addEventListener("touchstart",i=>{n=!0,a.classList.add("is-dragging"),l(i.touches[0].clientX)},{passive:!0}),a.addEventListener("touchmove",i=>{n&&(l(i.touches[0].clientX),i.preventDefault())},{passive:!1}),a.addEventListener("touchend",()=>{n=!1,a.classList.remove("is-dragging")})})}function E(t){const e=t.querySelector("#nw-gallery-track"),a=t.querySelector("#nw-gallery-progress");if(!e)return;e.addEventListener("scroll",()=>{const o=e.scrollLeft,l=e.scrollWidth-e.clientWidth,i=l>0?o/l*100:0;a&&(a.style.width=`${i}%`)},{passive:!0});let r=!1,s=0,n=0;e.addEventListener("mousedown",o=>{r=!0,e.classList.add("is-dragging"),s=o.pageX-e.offsetLeft,n=e.scrollLeft}),e.addEventListener("mouseleave",()=>{r=!1,e.classList.remove("is-dragging")}),e.addEventListener("mouseup",()=>{r=!1,e.classList.remove("is-dragging")}),e.addEventListener("mousemove",o=>{if(!r)return;o.preventDefault();const i=(o.pageX-e.offsetLeft-s)*1.5;e.scrollLeft=n-i})}function I(t){const e=t.querySelector(".nw-hero__back");e&&e.addEventListener("click",a=>{a.preventDefault(),sessionStorage.getItem("vudrag_scroll_position"),window.location.href="/"})}export{C as mount};
