async function H(e,n){const{pageContent:t,works:s=[]}=n,{video:i={},introduction:c={},vaultTitle:l="Coins & Medals"}=t||{};e.innerHTML=L(n,i,c,l,s),requestAnimationFrame(()=>{I(e,i),P(e),R(e),Y(e)})}function L(e,n,t,s,i){return`
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
    `:""}function E(e,n){if(!e.length)return"";const t=n.segments||[];let s="";return t.length>0?s=t.map(i=>{const c=e.filter(l=>l.segment===i);return c.length?`
                <div class="coins-vitrine__segment" data-reveal>
                    <h3 class="coins-vitrine__segment-label">${i}</h3>
                    <div class="coins-vitrine__grid">
                        ${c.map(l=>{const r=e.indexOf(l);return b(l,r)}).join("")}
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
    `}function I(e,n){const t=e.querySelector("#coins-hero");if(!t)return;const s=t.querySelector("video.coins-hero__video"),i=t.querySelector("iframe.coins-hero__video--youtube"),c=t.querySelector("#coins-unmute"),l=t.querySelector("#coins-progress"),r=t.querySelector("#coins-scroll-hint"),v=t.querySelector(".coins-hero__poster"),h=t.querySelector(".coins-hero__overlay");let p=!0;if(setTimeout(()=>{r&&r.classList.add("is-visible")},5e3),!s&&!i){r&&r.classList.add("is-visible"),c&&c.classList.add("is-hidden");return}if(i&&n.type==="youtube"){v&&setTimeout(()=>v.classList.add("is-hidden"),1800);const o=()=>{try{i.contentWindow.postMessage(JSON.stringify({event:"command",func:"unloadModule",args:["captions"]}),"*"),i.contentWindow.postMessage(JSON.stringify({event:"command",func:"unloadModule",args:["cc"]}),"*")}catch{}};setTimeout(o,500),setTimeout(o,1e3),setTimeout(o,2e3),setTimeout(o,3e3)}s&&v&&s.addEventListener("playing",()=>{v.classList.add("is-hidden")},{once:!0}),s&&(s.addEventListener("timeupdate",()=>{if(s.duration&&l){const o=s.currentTime/s.duration*100;l.style.width=`${o}%`}}),s.addEventListener("ended",()=>{r&&r.classList.add("is-visible")}));function d(){if(p=!p,i&&n.type==="youtube")try{i.contentWindow.postMessage(JSON.stringify({event:"command",func:p?"mute":"unMute",args:[]}),"*")}catch(o){console.warn("Could not toggle mute via postMessage:",o)}if(s&&(s.muted=p),c){const o=c.querySelector("span"),u=c.querySelector("svg");p?(o&&(o.textContent="Enable Sound"),u&&(u.innerHTML=`
                    <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                    <line x1="23" y1="9" x2="17" y2="15"/>
                    <line x1="17" y1="9" x2="23" y2="15"/>
                `)):(o&&(o.textContent="Mute"),u&&(u.innerHTML=`
                    <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                    <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
                `))}}h&&(h.style.cursor="pointer",h.addEventListener("click",o=>{o.stopPropagation(),d()})),c&&c.addEventListener("click",o=>{o.stopPropagation(),d()});let _=0;const y=100;let a=!1;t.addEventListener("wheel",o=>{if(!a)if(o.deltaY>0){if(_+=o.deltaY,_>=y){a=!0,_=0;const u=e.querySelector("#coins-vault");u&&u.scrollIntoView({behavior:"smooth",block:"start"})}}else _=0},{passive:!0}),window.addEventListener("scroll",()=>{a&&window.scrollY<=5&&(a=!1)},{passive:!0})}function P(e){const n=e.querySelector("#coins-vault");if(!n)return;const t=new IntersectionObserver(s=>{s.forEach(i=>{i.isIntersecting&&i.intersectionRatio>=.3&&(n.classList.add("is-revealed"),t.unobserve(n))})},{threshold:[.1,.3,.5]});t.observe(n)}function R(e){const n=e.querySelectorAll("[data-reveal]"),t=new IntersectionObserver(s=>{s.forEach(i=>{if(i.isIntersecting){const c=parseInt(i.target.dataset.revealDelay||"0",10);setTimeout(()=>{i.target.classList.add("is-revealed")},c*120),t.unobserve(i.target)}})},{threshold:.15,rootMargin:"0px 0px -40px 0px"});n.forEach(s=>t.observe(s))}function Y(e){const n=e.querySelectorAll(".coins-card");window.matchMedia("(hover: hover)").matches&&n.forEach(t=>{const s=t.querySelector(".coins-card__image-wrap"),i=t.querySelector(".coins-card__image");t.addEventListener("mousemove",c=>{const l=t.getBoundingClientRect(),r=(c.clientX-l.left)/l.width,v=(c.clientY-l.top)/l.height,h=(r-.5)*6,p=(.5-v)*4;if(t.style.transform=`perspective(800px) rotateX(${p}deg) rotateY(${h}deg) translateY(-6px)`,i){const d=(r-.5)*22,_=(.5-v)*18;i.style.transform=`perspective(400px) rotateX(${_}deg) rotateY(${d}deg) scale(1.06)`}if(s){const d=s.getBoundingClientRect(),_=(c.clientX-d.left)/d.width*100,y=(c.clientY-d.top)/d.height*100;s.style.setProperty("--shine-x",`${_}%`),s.style.setProperty("--shine-y",`${y}%`)}}),t.addEventListener("mouseleave",()=>{t.style.transform="",i&&(i.style.transform=""),s&&(s.style.removeProperty("--shine-x"),s.style.removeProperty("--shine-y"))})}),k(e,n)}function k(e,n){const t=e.querySelector("#coins-panel");if(!t)return;const s=t.querySelector(".coins-panel__backdrop"),i=t.querySelector(".coins-panel__sheet"),c=t.querySelector(".coins-panel__close"),l=t.querySelector("#panel-image-wrap"),r=t.querySelector("#panel-image"),v=t.querySelector(".coins-panel__eyebrow"),h=t.querySelector(".coins-panel__title"),p=t.querySelector(".coins-panel__description");let d=null;window.matchMedia("(hover: hover)").matches&&l&&r&&(i.addEventListener("mousemove",a=>{const o=l.getBoundingClientRect(),u=(a.clientX-o.left)/o.width,g=(a.clientY-o.top)/o.height,m=Math.max(-.5,Math.min(1.5,u)),f=Math.max(-.5,Math.min(1.5,g)),x=(m-.5)*22,w=(.5-f)*18;r.style.transform=`perspective(400px) rotateX(${w}deg) rotateY(${x}deg) scale(1.06)`;const $=m*100,S=f*100;l.style.setProperty("--shine-x",`${$}%`),l.style.setProperty("--shine-y",`${S}%`)}),i.addEventListener("mouseleave",()=>{r.style.transform="",l.style.removeProperty("--shine-x"),l.style.removeProperty("--shine-y")}));function _(a){parseInt(a.dataset.index,10);const o=a.querySelector(".coins-card__image"),u=a.querySelector(".coins-card__title"),g=a.querySelector(".coins-card__year"),m=a.querySelector(".coins-card__denomination");r&&(r.src=o?o.src:"",r.alt=o?o.alt:"",r.style.display=o?"":"none"),h&&(h.textContent=u?u.textContent:""),v&&(v.textContent=[g==null?void 0:g.textContent,m==null?void 0:m.textContent].filter(Boolean).join(" · ")),a.closest(".coins-vitrine"),p&&(p.textContent=a.dataset.description||""),d&&d.classList.remove("is-active"),a.classList.add("is-active"),d=a,t.classList.add("is-open"),document.body.style.overflow="hidden"}function y(){t.classList.remove("is-open"),document.body.style.overflow="",d&&(d.classList.remove("is-active"),d=null)}n.forEach(a=>{a.addEventListener("click",()=>_(a))}),c&&c.addEventListener("click",y),s&&s.addEventListener("click",y),document.addEventListener("keydown",a=>{a.key==="Escape"&&t.classList.contains("is-open")&&y()})}export{H as mount};
