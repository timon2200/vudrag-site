async function A(t,e){const{pageContent:s,works:a=[],segments:n=[]}=e,{heroSlides:r=[],introduction:c={},patterns:d=[],technique:o={}}=s||{};t.innerHTML=g(e,r,c,d,a),requestAnimationFrame(()=>{$(t),x(t),q(t),E(t)})}function g(t,e,s,a,n,r){return`
        ${h(e)}
        ${m(s)}
        ${b(n)}
        ${y(a)}
    `}function h(t){return t.length?`
        <section class="nw-hero" id="nw-hero">
            ${t.map((e,s)=>`
                <div class="nw-hero__slide ${s===0?"is-active":""}" data-index="${s}">
                    ${f(e,s===0)}
                    <div class="nw-hero__overlay"></div>
                    <div class="nw-hero__content">
                        <span class="nw-hero__eyebrow">${e.eyebrow||""}</span>
                        <h1 class="nw-hero__title">${e.title}</h1>
                        <p class="nw-hero__subtitle">${e.subtitle||""}</p>
                    </div>
                </div>
            `).join("")}
            <nav class="nw-hero__pagination" aria-label="Slide navigation">
                ${t.map((e,s)=>`
                    <button class="nw-hero__dot ${s===0?"is-active":""}" data-index="${s}" aria-label="Go to slide ${s+1}">
                        <span class="nw-hero__dot-number">${String(s+1).padStart(2,"0")}</span>
                    </button>
                `).join("")}
            </nav>
            <div class="nw-hero__scroll-hint">
                <span>Scroll to explore</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
            </div>
        </section>
    `:""}function f(t,e){if(t.youtubeId){const s=t.youtubeId,a=["autoplay=1","mute=1","loop=1","controls=0","showinfo=0","modestbranding=1","rel=0","disablekb=1","iv_load_policy=3","playsinline=1",`playlist=${s}`,"enablejsapi=1","origin="+encodeURIComponent(window.location.origin)].join("&"),n=`https://www.youtube.com/embed/${s}?${a}`;return`
            <div class="nw-hero__video-wrap">
                <iframe
                    class="nw-hero__video"
                    ${e?`src="${n}"`:""}
                    data-src="${n}"
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
                ${t.map((e,s)=>{const a=e.images||[e.image,e.image],n=e.finishLabels||["Finish A","Finish B"];return`
                    <article class="nw-pattern-card" data-reveal data-reveal-delay="${s+1}">
                        <div class="nw-comparator" data-comparator>
                            <div class="nw-comparator__image-wrap nw-comparator__image-wrap--left">
                                <img class="nw-comparator__image" src="${a[0]}" alt="${e.title} — ${n[0]}" loading="lazy" draggable="false" />
                            </div>
                            <div class="nw-comparator__image-wrap nw-comparator__image-wrap--right">
                                <img class="nw-comparator__image" src="${a[1]}" alt="${e.title} — ${n[1]}" loading="lazy" draggable="false" />
                            </div>
                            <div class="nw-comparator__divider" data-comparator-handle>
                                <div class="nw-comparator__line"></div>
                                <div class="nw-comparator__handle">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                        <path d="M8 5l-5 7 5 7"/><path d="M16 5l5 7-5 7"/>
                                    </svg>
                                </div>
                            </div>
                            <span class="nw-comparator__label nw-comparator__label--left">${n[0]}</span>
                            <span class="nw-comparator__label nw-comparator__label--right">${n[1]}</span>
                        </div>
                        <div class="nw-pattern-card__content">
                            <span class="nw-pattern-card__number">${String(s+1).padStart(2,"0")}</span>
                            <h3 class="nw-pattern-card__title">${e.title}</h3>
                            <span class="nw-pattern-card__subtitle">${e.subtitle}</span>
                            <p class="nw-pattern-card__description">${e.description}</p>
                        </div>
                    </article>
                `}).join("")}
            </div>
        </section>
    `:""}function b(t){if(!t.length)return"";const e=t.filter(r=>r.segment==="Wall"),s=t.filter(r=>r.segment==="Self Standing"||!r.segment);function a(r,c){return`
            <article class="nw-work-card" data-index="${c}">
                <div class="nw-work-card__image-wrap">
                    <img class="nw-work-card__image" src="${r.image}" alt="${r.title}" loading="lazy" />
                </div>
                <div class="nw-work-card__overlay"></div>
                <div class="nw-work-card__content">
                    <div class="nw-work-card__meta">
                        <span class="nw-work-card__year">${r.year}</span>
                        ${r.dimensions?`<span class="nw-work-card__dimensions">${r.dimensions}</span>`:""}
                    </div>
                    <h3 class="nw-work-card__title">${r.title}</h3>
                    <p class="nw-work-card__description">${r.description}</p>
                </div>
                <div class="nw-work-card__glow"></div>
            </article>
        `}function n(r,c,d){return c.length?`
            <div class="nw-gallery__row" id="${d}">
                <span class="nw-gallery__row-label">${r}</span>
                <div class="nw-gallery__row-track" data-loop-track>
                    ${c.map((o,i)=>a(o,i)).join("")}
                </div>
            </div>
        `:""}return`
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
            <div class="nw-gallery__rows">
                ${n("WALL",e,"nw-row-wall")}
                ${n("SELF STANDING",s,"nw-row-pedestal")}
            </div>
            <div class="nw-gallery__progress">
                <div class="nw-gallery__progress-bar" id="nw-gallery-progress"></div>
            </div>
        </section>
    `}function $(t){const e=t.querySelector("#nw-hero");if(!e)return;const s=e.querySelectorAll(".nw-hero__slide"),a=e.querySelectorAll(".nw-hero__dot");let n=0;const r=new IntersectionObserver(l=>{l.forEach(w=>{var _,p,u;const v=parseInt(w.target.dataset.index,10);if(w.isIntersecting&&w.intersectionRatio>=.5){if(v===n)return;(_=s[n])==null||_.classList.remove("is-active"),(p=a[n])==null||p.classList.remove("is-active"),S(s[n]),n=v,w.target.classList.add("is-active"),(u=a[v])==null||u.classList.add("is-active"),L(w.target)}})},{root:e,threshold:[.1,.5]});s.forEach(l=>r.observe(l)),a.forEach(l=>{l.addEventListener("click",()=>{const w=parseInt(l.dataset.index,10),v=s[w];v&&v.scrollIntoView({behavior:"smooth",block:"start"})})});let c=0;const d=120;let o=!1;const i=e.querySelector(".nw-hero__pagination");e.addEventListener("wheel",l=>{if(o)return;if(e.scrollTop+e.clientHeight>=e.scrollHeight-2&&l.deltaY>0){if(c+=l.deltaY,c>=d){o=!0,c=0,e.style.overflowY="hidden",e.style.scrollSnapType="none",i&&(i.style.opacity="0");const v=t.querySelector("#nw-intro");v&&v.scrollIntoView({behavior:"smooth",block:"start"})}return}c=0},{passive:!0}),window.addEventListener("scroll",()=>{o&&window.scrollY<=5&&(o=!1,e.style.overflowY="",e.style.scrollSnapType="",i&&(i.style.opacity=""))},{passive:!0})}function L(t){const e=t==null?void 0:t.querySelector(".nw-hero__video");!e||!e.dataset.src||e.getAttribute("src")!==e.dataset.src&&(e.src=e.dataset.src)}function S(t){const e=t==null?void 0:t.querySelector(".nw-hero__video");e&&e.removeAttribute("src")}function x(t){const e=t.querySelectorAll("[data-reveal]"),s=new IntersectionObserver(a=>{a.forEach(n=>{if(n.isIntersecting){const r=parseInt(n.target.dataset.revealDelay||"0",10);setTimeout(()=>{n.target.classList.add("is-revealed")},r*150),s.unobserve(n.target)}})},{threshold:.15,rootMargin:"0px 0px -40px 0px"});e.forEach(a=>s.observe(a))}function q(t){t.querySelectorAll("[data-comparator]").forEach(s=>{const a=s.querySelector(".nw-comparator__image-wrap--right"),n=s.querySelector("[data-comparator-handle]");if(!a||!n)return;let r=!1,c=50;function d(o){const i=s.getBoundingClientRect(),l=o-i.left;c=Math.max(5,Math.min(95,l/i.width*100)),requestAnimationFrame(()=>{a.style.clipPath=`inset(0 0 0 ${c}%)`,a.style.webkitClipPath=`inset(0 0 0 ${c}%)`,n.style.left=`${c}%`})}s.addEventListener("mousedown",o=>{r=!0,s.classList.add("is-dragging"),d(o.clientX),o.preventDefault()}),window.addEventListener("mousemove",o=>{r&&d(o.clientX)}),window.addEventListener("mouseup",()=>{r&&(r=!1,s.classList.remove("is-dragging"))}),s.addEventListener("touchstart",o=>{r=!0,s.classList.add("is-dragging"),d(o.touches[0].clientX)},{passive:!0}),s.addEventListener("touchmove",o=>{r&&(d(o.touches[0].clientX),o.preventDefault())},{passive:!1}),s.addEventListener("touchend",()=>{r=!1,s.classList.remove("is-dragging")})})}function E(t){const e=t.querySelectorAll("[data-loop-track]"),s=t.querySelector("#nw-gallery-progress");e.length&&e.forEach((a,n)=>{const r=[...a.children];r.length>1&&r.forEach(i=>{const l=i.cloneNode(!0);l.setAttribute("aria-hidden","true"),a.appendChild(l)}),n===0&&s&&a.addEventListener("scroll",()=>{const i=a.scrollLeft,l=a.scrollWidth-a.clientWidth,w=l>0?i/l*100:0;s.style.width=`${w}%`},{passive:!0}),a.addEventListener("scroll",()=>{const i=a.scrollLeft,l=a.scrollWidth/2;i>=l?(a.style.scrollBehavior="auto",a.scrollLeft=i-l,a.style.scrollBehavior=""):i<=0&&(a.style.scrollBehavior="auto",a.scrollLeft=i+l,a.style.scrollBehavior="")},{passive:!0});let c=!1,d=0,o=0;a.addEventListener("mousedown",i=>{c=!0,a.classList.add("is-dragging"),d=i.pageX-a.offsetLeft,o=a.scrollLeft}),a.addEventListener("mouseleave",()=>{c=!1,a.classList.remove("is-dragging")}),a.addEventListener("mouseup",()=>{c=!1,a.classList.remove("is-dragging")}),a.addEventListener("mousemove",i=>{if(!c)return;i.preventDefault();const w=(i.pageX-a.offsetLeft-d)*1.5;a.scrollLeft=o-w})})}export{A as mount};
