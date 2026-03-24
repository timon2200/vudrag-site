async function C(s,i){const{pageContent:e,works:t=[]}=i,{video:n={},introduction:o={},vaultTitle:a="Coins & Medals"}=e||{};s.innerHTML=h(i,n,o,a,t),requestAnimationFrame(()=>{x(s),L(s),q(s),$(s),M(s)})}function h(s,i,e,t,n){return`
        ${f(i)}
        ${m(t,e)}
        ${g(e)}
        ${y(n)}
        ${w()}
    `}function f(s){const i=s.src&&s.type,e=s.poster||"";let t="";if(i&&s.type==="youtube"){const n=["autoplay=1","mute=1","loop=1","controls=0","showinfo=0","modestbranding=1","rel=0","disablekb=1","iv_load_policy=3","playsinline=1",`playlist=${s.src}`,"enablejsapi=1","origin="+encodeURIComponent(window.location.origin)].join("&");t=`
            <iframe
                class="coins-hero__video coins-hero__video--youtube"
                src="https://www.youtube.com/embed/${s.src}?${n}"
                allow="autoplay; encrypted-media"
                allowfullscreen
                tabindex="-1"
            ></iframe>
        `}else i&&(s.type==="mp4"||s.type==="video")&&(t=`
            <video
                class="coins-hero__video"
                src="${s.src}"
                autoplay muted loop playsinline
                preload="auto"
            ></video>
        `);return`
        <section class="coins-hero" id="coins-hero">
            <div class="coins-hero__video-wrap">
                ${t}
            </div>
            ${e?`<img class="coins-hero__poster " src="${e}" alt="Coins Collection" draggable="false" />`:""}
            <div class="coins-hero__overlay"></div>
            
            <button class="coins-hero__unmute" id="coins-unmute" aria-label="Enable sound">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                    <line x1="23" y1="9" x2="17" y2="15"/>
                    <line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
                <span>Enable Sound</span>
            </button>

            <div class="coins-hero__progress">
                <div class="coins-hero__progress-bar" id="coins-progress"></div>
            </div>

            <div class="coins-hero__scroll-hint" id="coins-scroll-hint">
                <span>Scroll to explore</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
            </div>

            <a href="/" class="coins-hero__back">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                <span>Back</span>
            </a>
        </section>
    `}function m(s,i){return`
        <section class="coins-vault" id="coins-vault">
            <div class="coins-vault__watermark" aria-hidden="true">NUMISMATICA</div>
            <div class="coins-vault__door">
                <div class="coins-vault__panel coins-vault__panel--left"></div>
                <div class="coins-vault__panel coins-vault__panel--right"></div>
            </div>
            <div class="coins-vault__content">
                <span class="coins-vault__eyebrow">The Collection</span>
                <h1 class="coins-vault__title">${s}</h1>
                <div class="coins-vault__divider"></div>
                ${i.credential?`
                    <div class="coins-vault__credential">${i.credential}</div>
                `:""}
            </div>
        </section>
    `}function g(s){return s.title?`
        <section class="coins-intro" id="coins-intro">
            <div class="coins-intro__content" data-reveal>
                <span class="coins-intro__eyebrow">${s.eyebrow||""}</span>
                <h2 class="coins-intro__title">${s.title}</h2>
                <div class="coins-intro__divider"></div>
                <p class="coins-intro__text">${s.text||""}</p>
            </div>
        </section>
    `:""}function y(s){return s.length?`
        <section class="coins-vitrine" id="coins-vitrine">
            <header class="coins-vitrine__header" data-reveal>
                <span class="coins-vitrine__label">The Works</span>
                <h2 class="coins-vitrine__heading">Collector's Vitrine</h2>
                <div class="coins-vitrine__divider"></div>
            </header>
            <div class="coins-vitrine__grid">
                ${s.map((i,e)=>b(i,e)).join("")}
            </div>
        </section>
    `:""}function b(s,i){const e=s.image&&s.image.length>0;return`
        <article class="coins-card" data-reveal data-reveal-delay="${Math.min(i,5)}" data-index="${i}">
            <button class="coins-card__close" aria-label="Close details">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
            </button>
            <div class="coins-card__image-wrap">
                <div class="coins-card__spotlight"></div>
                ${e?`<img class="coins-card__image" src="${s.image}" alt="${s.title}" loading="lazy" draggable="false" />`:`<div class="coins-card__placeholder">
                         <svg class="coins-card__placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5">
                             <circle cx="12" cy="12" r="10"/>
                             <circle cx="12" cy="12" r="6"/>
                             <circle cx="12" cy="12" r="2"/>
                         </svg>
                       </div>`}
            </div>
            <div class="coins-card__content">
                <div class="coins-card__meta">
                    <span class="coins-card__year">${s.year||""}</span>
                    <span class="coins-card__denomination">${s.dimensions||""}</span>
                </div>
                <h3 class="coins-card__title">${s.title}</h3>
                <div class="coins-card__underline"></div>
            </div>
            <div class="coins-card__drawer">
                <p class="coins-card__description">${s.description||""}</p>
            </div>
        </article>
    `}function w(){return`
        <section class="coins-inquire" id="coins-inquire">
            <div class="coins-inquire__container" data-reveal>
                <div class="coins-inquire__crown">
                    <span class="coins-inquire__line"></span>
                    <span class="coins-inquire__diamond">◈</span>
                    <span class="coins-inquire__line"></span>
                </div>
                <span class="coins-inquire__label">Commissions & Inquiries</span>
                <h3 class="coins-inquire__title">
                    <span>Let's </span>
                    <span class="coins-inquire__title-accent">Connect</span>
                </h3>
                <p class="coins-inquire__text">
                    For commemorative coin commissions, medal design, or to learn more about the numismatic craft — I welcome your inquiry.
                </p>
                <a href="/contact.html" class="coins-inquire__cta">
                    <span>Get in Touch</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </a>
            </div>
        </section>
    `}function x(s,i){const e=s.querySelector("#coins-hero");if(!e)return;const t=e.querySelector("video.coins-hero__video"),n=e.querySelector("iframe.coins-hero__video--youtube"),o=e.querySelector("#coins-unmute"),a=e.querySelector("#coins-progress"),r=e.querySelector("#coins-scroll-hint"),u=e.querySelector(".coins-hero__poster");let d=!0;if(setTimeout(()=>{r&&r.classList.add("is-visible")},5e3),!t&&!n){r&&r.classList.add("is-visible"),o&&o.classList.add("is-hidden");return}t&&u&&t.addEventListener("playing",()=>{u.classList.add("is-hidden")},{once:!0}),t&&(t.addEventListener("timeupdate",()=>{if(t.duration&&a){const c=t.currentTime/t.duration*100;a.style.width=`${c}%`}}),t.addEventListener("ended",()=>{r&&r.classList.add("is-visible")})),o&&o.addEventListener("click",()=>{d=!d,t&&(t.muted=d);const c=o.querySelector("span"),l=o.querySelector("svg");d?(c&&(c.textContent="Enable Sound"),l&&(l.innerHTML=`
                    <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                    <line x1="23" y1="9" x2="17" y2="15"/>
                    <line x1="17" y1="9" x2="23" y2="15"/>
                `)):(c&&(c.textContent="Mute"),l&&(l.innerHTML=`
                    <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                    <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
                `))});let v=0;const p=100;let _=!1;e.addEventListener("wheel",c=>{if(!_)if(c.deltaY>0){if(v+=c.deltaY,v>=p){_=!0,v=0;const l=s.querySelector("#coins-vault");l&&l.scrollIntoView({behavior:"smooth",block:"start"})}}else v=0},{passive:!0}),window.addEventListener("scroll",()=>{_&&window.scrollY<=5&&(_=!1)},{passive:!0})}function L(s){const i=s.querySelector("#coins-vault");if(!i)return;const e=new IntersectionObserver(t=>{t.forEach(n=>{n.isIntersecting&&n.intersectionRatio>=.3&&(i.classList.add("is-revealed"),e.unobserve(i))})},{threshold:[.1,.3,.5]});e.observe(i)}function q(s){const i=s.querySelectorAll("[data-reveal]"),e=new IntersectionObserver(t=>{t.forEach(n=>{if(n.isIntersecting){const o=parseInt(n.target.dataset.revealDelay||"0",10);setTimeout(()=>{n.target.classList.add("is-revealed")},o*120),e.unobserve(n.target)}})},{threshold:.15,rootMargin:"0px 0px -40px 0px"});i.forEach(t=>e.observe(t))}function $(s){const i=s.querySelectorAll(".coins-card");i.forEach(e=>{window.matchMedia("(hover: hover)").matches&&(e.querySelector(".coins-card__image-wrap"),e.addEventListener("mousemove",n=>{if(e.classList.contains("is-expanded"))return;const o=e.getBoundingClientRect(),a=(n.clientX-o.left)/o.width,r=(n.clientY-o.top)/o.height,u=(a-.5)*6,d=(.5-r)*4;e.style.transform=`translateY(-4px) perspective(800px) rotateX(${d}deg) rotateY(${u}deg)`}),e.addEventListener("mouseleave",()=>{e.classList.contains("is-expanded")||(e.style.transform="")})),e.addEventListener("click",n=>{if(n.target.closest(".coins-card__close")){e.classList.remove("is-expanded"),e.style.transform="";return}const o=e.classList.contains("is-expanded");i.forEach(a=>{a!==e&&a.classList.remove("is-expanded")}),o?(e.classList.remove("is-expanded"),e.style.transform=""):(e.classList.add("is-expanded"),e.style.transform="translateY(-4px)",setTimeout(()=>{e.scrollIntoView({behavior:"smooth",block:"nearest"})},100))});const t=e.querySelector(".coins-card__close");t&&t.addEventListener("click",n=>{n.stopPropagation(),e.classList.remove("is-expanded"),e.style.transform=""})})}function M(s){const i=s.querySelector(".coins-hero__back");i&&i.addEventListener("click",e=>{e.preventDefault(),window.location.href="/"})}export{C as mount};
