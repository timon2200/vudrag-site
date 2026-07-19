async function H(e,n){const{pageContent:t,works:s=[]}=n,{video:i={},introduction:c={},vaultTitle:a="Coins & Medals"}=t||{};e.innerHTML=S(n,i,c,a,s),requestAnimationFrame(()=>{P(e,i),Y(e),I(e),R(e)})}function S(e,n,t,s,i){return`
        ${M(n)}
        ${q(s,t)}
        ${C(t)}
        ${E(i,e)}
        ${T()}
    `}function M(e){const n=e.src&&e.type,t=e.poster||"";let s="";if(n&&e.type==="youtube"){const i=["autoplay=1","mute=1","loop=1","controls=0","showinfo=0","modestbranding=1","rel=0","disablekb=1","iv_load_policy=3","playsinline=1",`playlist=${e.src}`,"enablejsapi=1","origin="+encodeURIComponent(window.location.origin),"cc_load_policy=3"].join("&");s=`
            <iframe
                class="coins-hero__video coins-hero__video--youtube"
                src="https://www.youtube.com/embed/${e.src}?${i}"
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
            ${t?`<img class="coins-hero__poster " src="${t}" alt="Coins Collection" draggable="false" />`:""}
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
    `}function q(e,n){return`
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
    `}function C(e){return e.title?`
        <section class="coins-intro" id="coins-intro">
            <div class="coins-intro__content" data-reveal>
                <span class="coins-intro__eyebrow">${e.eyebrow||""}</span>
                <h2 class="coins-intro__title">${e.title}</h2>
                <div class="coins-intro__divider"></div>
                <p class="coins-intro__text">${e.text||""}</p>
            </div>
        </section>
    `:""}function E(e,n){if(!e.length)return"";const t=n.segments||[];let s="";return t.length>0?s=t.map(i=>{const c=e.filter(a=>a.segment===i);return c.length?`
                <div class="coins-vitrine__segment" data-reveal>
                    <h3 class="coins-vitrine__segment-label">${i}</h3>
                    <div class="coins-vitrine__grid">
                        ${c.map(a=>{const r=e.indexOf(a);return b(a,r)}).join("")}
                    </div>
                </div>
            `:""}).join(""):s=`
            <div class="coins-vitrine__grid">
                ${e.map((i,c)=>b(i,c)).join("")}
            </div>
        `,`
        <section class="coins-vitrine" id="coins-vitrine">
            <header class="coins-vitrine__header" data-reveal>
                <span class="coins-vitrine__label">The Works</span>
                <h2 class="coins-vitrine__heading">Collector's Vitrine</h2>
                <div class="coins-vitrine__divider"></div>
            </header>
            ${s}
        </section>
    `}function b(e,n){const t=e.image&&e.image.length>0,s=(e.description||"").replace(/"/g,"&quot;").replace(/'/g,"&#39;");return`
        <article class="coins-card" data-reveal data-reveal-delay="${Math.min(n,5)}" data-index="${n}" data-description="${s}">
            <div class="coins-card__image-wrap">
                <div class="coins-card__spotlight"></div>
                <div class="coins-card__specular"></div>
                ${t?`<img class="coins-card__image" src="${e.image}" alt="${e.title}" loading="lazy" draggable="false" />`:`<div class="coins-card__placeholder">
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
    `}function T(){return`
        <div class="coins-panel" id="coins-panel">
            <div class="coins-panel__backdrop"></div>
            <aside class="coins-panel__sheet">
                <button class="coins-panel__close" aria-label="Close panel">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
                <div class="coins-panel__image-wrap" id="panel-image-wrap">
                    <img class="coins-panel__image" id="panel-image" src="" alt="" draggable="false" />
                    <div class="coins-panel__spotlight"></div>
                    <div class="coins-panel__specular"></div>
                </div>
                <div class="coins-panel__body">
                    <span class="coins-panel__eyebrow"></span>
                    <h3 class="coins-panel__title"></h3>
                    <div class="coins-panel__divider"></div>
                    <p class="coins-panel__description"></p>
                </div>
            </aside>
        </div>
    `}function P(e,n){const t=e.querySelector("#coins-hero");if(!t)return;const s=t.querySelector("video.coins-hero__video"),i=t.querySelector("iframe.coins-hero__video--youtube"),c=t.querySelector("#coins-unmute"),a=t.querySelector("#coins-progress"),r=t.querySelector("#coins-scroll-hint"),p=t.querySelector(".coins-hero__poster"),y=t.querySelector(".coins-hero__overlay");let _=!0,o=null;if(setTimeout(()=>{r&&r.classList.add("is-visible")},5e3),!s&&!i){r&&r.classList.add("is-visible"),c&&c.classList.add("is-hidden");return}if(i&&n.type==="youtube"){if(!window.YT||!window.YT.Player){const u=document.createElement("script");u.src="https://www.youtube.com/iframe_api",document.head.appendChild(u)}const l=()=>{o=new window.YT.Player(i,{events:{onReady:()=>{try{typeof o.unloadModule=="function"&&(o.unloadModule("captions"),o.unloadModule("cc"))}catch(u){console.warn("Could not unload captions module:",u)}p&&setTimeout(()=>p.classList.add("is-hidden"),4500)},onStateChange:()=>{try{typeof o.unloadModule=="function"&&(o.unloadModule("captions"),o.unloadModule("cc"))}catch{}}}})};window.YT&&window.YT.Player?l():window.onYouTubeIframeAPIReady=l}s&&p&&s.addEventListener("playing",()=>{p.classList.add("is-hidden")},{once:!0}),s&&(s.addEventListener("timeupdate",()=>{if(s.duration&&a){const l=s.currentTime/s.duration*100;a.style.width=`${l}%`}}),s.addEventListener("ended",()=>{r&&r.classList.add("is-visible")}));function f(){if(_=!_,o&&o.isMuted&&(_?o.mute():o.unMute()),s&&(s.muted=_),c){const l=c.querySelector("span"),u=c.querySelector("svg");_?(l&&(l.textContent="Enable Sound"),u&&(u.innerHTML=`
                    <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                    <line x1="23" y1="9" x2="17" y2="15"/>
                    <line x1="17" y1="9" x2="23" y2="15"/>
                `)):(l&&(l.textContent="Mute"),u&&(u.innerHTML=`
                    <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                    <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
                `))}}y&&(y.style.cursor="pointer",y.addEventListener("click",l=>{l.stopPropagation(),f()})),c&&c.addEventListener("click",l=>{l.stopPropagation(),f()});let h=0;const d=100;let v=!1;t.addEventListener("wheel",l=>{if(!v)if(l.deltaY>0){if(h+=l.deltaY,h>=d){v=!0,h=0;const u=e.querySelector("#coins-vault");u&&u.scrollIntoView({behavior:"smooth",block:"start"})}}else h=0},{passive:!0}),window.addEventListener("scroll",()=>{v&&window.scrollY<=5&&(v=!1)},{passive:!0})}function Y(e){const n=e.querySelector("#coins-vault");if(!n)return;const t=new IntersectionObserver(s=>{s.forEach(i=>{i.isIntersecting&&i.intersectionRatio>=.3&&(n.classList.add("is-revealed"),t.unobserve(n))})},{threshold:[.1,.3,.5]});t.observe(n)}function I(e){const n=e.querySelectorAll("[data-reveal]"),t=new IntersectionObserver(s=>{s.forEach(i=>{if(i.isIntersecting){const c=parseInt(i.target.dataset.revealDelay||"0",10);setTimeout(()=>{i.target.classList.add("is-revealed")},c*120),t.unobserve(i.target)}})},{threshold:.15,rootMargin:"0px 0px -40px 0px"});n.forEach(s=>t.observe(s))}function R(e){const n=e.querySelectorAll(".coins-card");window.matchMedia("(hover: hover)").matches&&n.forEach(t=>{const s=t.querySelector(".coins-card__image-wrap"),i=t.querySelector(".coins-card__image");t.addEventListener("mousemove",c=>{const a=t.getBoundingClientRect(),r=(c.clientX-a.left)/a.width,p=(c.clientY-a.top)/a.height,y=(r-.5)*6,_=(.5-p)*4;if(t.style.transform=`perspective(800px) rotateX(${_}deg) rotateY(${y}deg) translateY(-6px)`,i){const o=(r-.5)*22,f=(.5-p)*18;i.style.transform=`perspective(400px) rotateX(${f}deg) rotateY(${o}deg) scale(1.06)`}if(s){const o=s.getBoundingClientRect(),f=(c.clientX-o.left)/o.width*100,h=(c.clientY-o.top)/o.height*100;s.style.setProperty("--shine-x",`${f}%`),s.style.setProperty("--shine-y",`${h}%`)}}),t.addEventListener("mouseleave",()=>{t.style.transform="",i&&(i.style.transform=""),s&&(s.style.removeProperty("--shine-x"),s.style.removeProperty("--shine-y"))})}),k(e,n)}function k(e,n){const t=e.querySelector("#coins-panel");if(!t)return;const s=t.querySelector(".coins-panel__backdrop"),i=t.querySelector(".coins-panel__sheet"),c=t.querySelector(".coins-panel__close"),a=t.querySelector("#panel-image-wrap"),r=t.querySelector("#panel-image"),p=t.querySelector(".coins-panel__eyebrow"),y=t.querySelector(".coins-panel__title"),_=t.querySelector(".coins-panel__description");let o=null;window.matchMedia("(hover: hover)").matches&&a&&r&&(i.addEventListener("mousemove",d=>{const v=a.getBoundingClientRect(),l=(d.clientX-v.left)/v.width,u=(d.clientY-v.top)/v.height,m=Math.max(-.5,Math.min(1.5,l)),g=Math.max(-.5,Math.min(1.5,u)),w=(m-.5)*22,x=(.5-g)*18;r.style.transform=`perspective(400px) rotateX(${x}deg) rotateY(${w}deg) scale(1.06)`;const $=m*100,L=g*100;a.style.setProperty("--shine-x",`${$}%`),a.style.setProperty("--shine-y",`${L}%`)}),i.addEventListener("mouseleave",()=>{r.style.transform="",a.style.removeProperty("--shine-x"),a.style.removeProperty("--shine-y")}));function f(d){parseInt(d.dataset.index,10);const v=d.querySelector(".coins-card__image"),l=d.querySelector(".coins-card__title"),u=d.querySelector(".coins-card__year"),m=d.querySelector(".coins-card__denomination");r&&(r.src=v?v.src:"",r.alt=v?v.alt:"",r.style.display=v?"":"none"),y&&(y.textContent=l?l.textContent:""),p&&(p.textContent=[u==null?void 0:u.textContent,m==null?void 0:m.textContent].filter(Boolean).join(" · ")),d.closest(".coins-vitrine"),_&&(_.textContent=d.dataset.description||""),o&&o.classList.remove("is-active"),d.classList.add("is-active"),o=d,t.classList.add("is-open"),document.body.style.overflow="hidden"}function h(){t.classList.remove("is-open"),document.body.style.overflow="",o&&(o.classList.remove("is-active"),o=null)}n.forEach(d=>{d.addEventListener("click",()=>f(d))}),c&&c.addEventListener("click",h),s&&s.addEventListener("click",h),document.addEventListener("keydown",d=>{d.key==="Escape"&&t.classList.contains("is-open")&&h()})}export{H as mount};
