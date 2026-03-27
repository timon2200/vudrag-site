async function I(e,n){const{pageContent:i,works:s=[]}=n,{video:t={},introduction:a={},vaultTitle:v="Coins & Medals"}=i||{};e.innerHTML=m(n,t,a,v,s),requestAnimationFrame(()=>{$(e,t),C(e),E(e),M(e)})}function m(e,n,i,s,t){return`
        ${g(n)}
        ${b(s,i)}
        ${w(i)}
        ${q(t)}
        ${S()}
        ${L()}
    `}function g(e){const n=e.src&&e.type,i=e.poster||"";let s="";if(n&&e.type==="youtube"){const t=["autoplay=1","mute=1","loop=1","controls=0","showinfo=0","modestbranding=1","rel=0","disablekb=1","iv_load_policy=3","playsinline=1",`playlist=${e.src}`,"enablejsapi=1","origin="+encodeURIComponent(window.location.origin)].join("&");s=`
            <iframe
                class="coins-hero__video coins-hero__video--youtube"
                src="https://www.youtube.com/embed/${e.src}?${t}"
                allow="autoplay; encrypted-media"
                allowfullscreen
                tabindex="-1"
            ></iframe>
        `}else n&&(e.type==="mp4"||e.type==="video")&&(s=`
            <video
                class="coins-hero__video"
                src="${e.src}"
                autoplay muted loop playsinline
                preload="auto"
            ></video>
        `);return`
        <section class="coins-hero" id="coins-hero">
            <div class="coins-hero__video-wrap">
                ${s}
            </div>
            ${i?`<img class="coins-hero__poster " src="${i}" alt="Coins Collection" draggable="false" />`:""}
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

        </section>
    `}function b(e,n){return`
        <section class="coins-vault" id="coins-vault">
            <div class="coins-vault__watermark" aria-hidden="true">NUMISMATICA</div>
            <div class="coins-vault__door">
                <div class="coins-vault__panel coins-vault__panel--left"></div>
                <div class="coins-vault__panel coins-vault__panel--right"></div>
            </div>
            <div class="coins-vault__content">
                <span class="coins-vault__eyebrow">The Collection</span>
                <h1 class="coins-vault__title">${e}</h1>
                <div class="coins-vault__divider"></div>
                ${n.credential?`
                    <div class="coins-vault__credential">${n.credential}</div>
                `:""}
            </div>
        </section>
    `}function w(e){return e.title?`
        <section class="coins-intro" id="coins-intro">
            <div class="coins-intro__content" data-reveal>
                <span class="coins-intro__eyebrow">${e.eyebrow||""}</span>
                <h2 class="coins-intro__title">${e.title}</h2>
                <div class="coins-intro__divider"></div>
                <p class="coins-intro__text">${e.text||""}</p>
            </div>
        </section>
    `:""}function q(e){return e.length?`
        <section class="coins-vitrine" id="coins-vitrine">
            <header class="coins-vitrine__header" data-reveal>
                <span class="coins-vitrine__label">The Works</span>
                <h2 class="coins-vitrine__heading">Collector's Vitrine</h2>
                <div class="coins-vitrine__divider"></div>
            </header>
            <div class="coins-vitrine__grid">
                ${e.map((n,i)=>x(n,i)).join("")}
            </div>
        </section>
    `:""}function x(e,n){const i=e.image&&e.image.length>0,s=(e.description||"").replace(/"/g,"&quot;").replace(/'/g,"&#39;");return`
        <article class="coins-card" data-reveal data-reveal-delay="${Math.min(n,5)}" data-index="${n}" data-description="${s}">
            <div class="coins-card__image-wrap">
                <div class="coins-card__spotlight"></div>
                ${i?`<img class="coins-card__image" src="${e.image}" alt="${e.title}" loading="lazy" draggable="false" />`:`<div class="coins-card__placeholder">
                         <svg class="coins-card__placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5">
                             <circle cx="12" cy="12" r="10"/>
                             <circle cx="12" cy="12" r="6"/>
                             <circle cx="12" cy="12" r="2"/>
                         </svg>
                       </div>`}
            </div>
            <div class="coins-card__content">
                <div class="coins-card__meta">
                    <span class="coins-card__year">${e.year||""}</span>
                    <span class="coins-card__denomination">${e.dimensions||""}</span>
                </div>
                <h3 class="coins-card__title">${e.title}</h3>
            </div>
        </article>
    `}function L(){return`
        <div class="coins-panel" id="coins-panel">
            <div class="coins-panel__backdrop"></div>
            <aside class="coins-panel__sheet">
                <button class="coins-panel__close" aria-label="Close panel">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
                <div class="coins-panel__image-wrap">
                    <img class="coins-panel__image" src="" alt="" draggable="false" />
                </div>
                <div class="coins-panel__body">
                    <span class="coins-panel__eyebrow"></span>
                    <h3 class="coins-panel__title"></h3>
                    <div class="coins-panel__divider"></div>
                    <p class="coins-panel__description"></p>
                </div>
            </aside>
        </div>
    `}function S(){return`
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
    `}function $(e,n){const i=e.querySelector("#coins-hero");if(!i)return;const s=i.querySelector("video.coins-hero__video"),t=i.querySelector("iframe.coins-hero__video--youtube"),a=i.querySelector("#coins-unmute"),v=i.querySelector("#coins-progress"),l=i.querySelector("#coins-scroll-hint"),p=i.querySelector(".coins-hero__poster"),r=i.querySelector(".coins-hero__overlay");let f=!0,_=null;if(setTimeout(()=>{l&&l.classList.add("is-visible")},5e3),!s&&!t){l&&l.classList.add("is-visible"),a&&a.classList.add("is-hidden");return}if(t&&n.type==="youtube"){if(!window.YT||!window.YT.Player){const u=document.createElement("script");u.src="https://www.youtube.com/iframe_api",document.head.appendChild(u)}const o=()=>{_=new window.YT.Player(t,{events:{onReady:()=>{p&&setTimeout(()=>p.classList.add("is-hidden"),1500)}}})};window.YT&&window.YT.Player?o():window.onYouTubeIframeAPIReady=o}s&&p&&s.addEventListener("playing",()=>{p.classList.add("is-hidden")},{once:!0}),s&&(s.addEventListener("timeupdate",()=>{if(s.duration&&v){const o=s.currentTime/s.duration*100;v.style.width=`${o}%`}}),s.addEventListener("ended",()=>{l&&l.classList.add("is-visible")}));function c(){if(f=!f,_&&_.isMuted&&(f?_.mute():_.unMute()),s&&(s.muted=f),a){const o=a.querySelector("span"),u=a.querySelector("svg");f?(o&&(o.textContent="Enable Sound"),u&&(u.innerHTML=`
                    <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                    <line x1="23" y1="9" x2="17" y2="15"/>
                    <line x1="17" y1="9" x2="23" y2="15"/>
                `)):(o&&(o.textContent="Mute"),u&&(u.innerHTML=`
                    <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                    <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
                `))}}r&&(r.style.cursor="pointer",r.addEventListener("click",o=>{o.stopPropagation(),c()})),a&&a.addEventListener("click",o=>{o.stopPropagation(),c()});let d=0;const y=100;let h=!1;i.addEventListener("wheel",o=>{if(!h)if(o.deltaY>0){if(d+=o.deltaY,d>=y){h=!0,d=0;const u=e.querySelector("#coins-vault");u&&u.scrollIntoView({behavior:"smooth",block:"start"})}}else d=0},{passive:!0}),window.addEventListener("scroll",()=>{h&&window.scrollY<=5&&(h=!1)},{passive:!0})}function C(e){const n=e.querySelector("#coins-vault");if(!n)return;const i=new IntersectionObserver(s=>{s.forEach(t=>{t.isIntersecting&&t.intersectionRatio>=.3&&(n.classList.add("is-revealed"),i.unobserve(n))})},{threshold:[.1,.3,.5]});i.observe(n)}function E(e){const n=e.querySelectorAll("[data-reveal]"),i=new IntersectionObserver(s=>{s.forEach(t=>{if(t.isIntersecting){const a=parseInt(t.target.dataset.revealDelay||"0",10);setTimeout(()=>{t.target.classList.add("is-revealed")},a*120),i.unobserve(t.target)}})},{threshold:.15,rootMargin:"0px 0px -40px 0px"});n.forEach(s=>i.observe(s))}function M(e){const n=e.querySelectorAll(".coins-card");window.matchMedia("(hover: hover)").matches&&n.forEach(i=>{i.addEventListener("mousemove",s=>{const t=i.getBoundingClientRect(),a=(s.clientX-t.left)/t.width,v=(s.clientY-t.top)/t.height,l=(a-.5)*6,p=(.5-v)*4;i.style.transform=`translateY(-4px) perspective(800px) rotateX(${p}deg) rotateY(${l}deg)`}),i.addEventListener("mouseleave",()=>{i.style.transform=""})}),T(e,n)}function T(e,n){const i=e.querySelector("#coins-panel");if(!i)return;const s=i.querySelector(".coins-panel__backdrop");i.querySelector(".coins-panel__sheet");const t=i.querySelector(".coins-panel__close"),a=i.querySelector(".coins-panel__image"),v=i.querySelector(".coins-panel__eyebrow"),l=i.querySelector(".coins-panel__title"),p=i.querySelector(".coins-panel__description");let r=null;function f(c){parseInt(c.dataset.index,10);const d=c.querySelector(".coins-card__image"),y=c.querySelector(".coins-card__title"),h=c.querySelector(".coins-card__year"),o=c.querySelector(".coins-card__denomination");a&&(a.src=d?d.src:"",a.alt=d?d.alt:"",a.style.display=d?"":"none"),l&&(l.textContent=y?y.textContent:""),v&&(v.textContent=[h==null?void 0:h.textContent,o==null?void 0:o.textContent].filter(Boolean).join(" · ")),c.closest(".coins-vitrine"),p&&(p.textContent=c.dataset.description||""),r&&r.classList.remove("is-active"),c.classList.add("is-active"),r=c,i.classList.add("is-open"),document.body.style.overflow="hidden"}function _(){i.classList.remove("is-open"),document.body.style.overflow="",r&&(r.classList.remove("is-active"),r=null)}n.forEach(c=>{c.addEventListener("click",()=>f(c))}),t&&t.addEventListener("click",_),s&&s.addEventListener("click",_),document.addEventListener("keydown",c=>{c.key==="Escape"&&i.classList.contains("is-open")&&_()})}export{I as mount};
