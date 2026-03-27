import{_ as V,A as Y,F as G,R as U,C as x,E,e as X,V as M}from"./playcanvas-D5Kv4vzz.js";async function oe(t,a){const{pageContent:e,works:s=[]}=a,{splatHero:i={},introduction:o={},scale:r={}}=e||{},n=s.filter(_=>_.segment==="Monumental"),c=s.filter(_=>_.segment==="Hercules Labors");t.innerHTML=j(i,o,n,c,r),requestAnimationFrame(()=>{ee(t,i),te(t),ae(t),se(t),ne(t)})}function j(t,a,e,s,i){return`
        ${J(t)}
        ${K(a)}
        ${I("I","Monumental",`${e.length} Works`)}
        ${A(e,"monumental")}
        ${Q(i)}
        ${I("II","The Labors of Hercules",`${s.length} Works`)}
        ${A(s,"hercules")}
        ${Z()}
    `}function J(t){return`
        <section class="pw-splat-hero" id="pw-splat-hero">
            <div class="pw-splat-hero__canvas-wrap" id="pw-splat-canvas-wrap">
                <img class="pw-splat-hero__fallback" 
                     src="${t.fallbackImage||"/images/95.webp"}" 
                     alt="Tomislavus Rex Croatorum"
                     draggable="false" />
            </div>
            <div class="pw-splat-hero__overlay"></div>
            <div class="pw-splat-hero__vignette"></div>
            <div class="pw-splat-hero__content">
                <span class="pw-splat-hero__eyebrow">${t.eyebrow||""}</span>
                <h1 class="pw-splat-hero__title">${t.title||"PUBLIC WORKS"}</h1>
                <p class="pw-splat-hero__subtitle">${t.subtitle||""}</p>
                <div class="pw-splat-hero__interact-hint" id="pw-interact-hint">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                        <path d="M12 18a6 6 0 100-12 6 6 0 000 12z" opacity="0.4"/>
                    </svg>
                    <span>Interact with the sculpture</span>
                </div>
            </div>
            <div class="pw-splat-hero__scroll-hint">
                <span>Scroll to explore</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
            </div>
            <div class="pw-splat-hero__scanline" aria-hidden="true"></div>
        </section>
    `}function K(t){return t.title?`
        <section class="pw-intro" id="pw-intro">
            <div class="pw-intro__bg">
                <img class="pw-intro__bg-image" src="/images/works/dijmanti-rusted-varazdin-stari-grad.webp" alt="" loading="lazy" draggable="false" aria-hidden="true" />
            </div>
            <div class="pw-intro__watermark" aria-hidden="true">OPUS</div>
            <div class="pw-intro__content" data-reveal>
                <span class="pw-intro__eyebrow">${t.eyebrow||""}</span>
                <h2 class="pw-intro__title">${t.title}</h2>
                <div class="pw-intro__divider"></div>
                <p class="pw-intro__text">${t.text||""}</p>
                ${t.quote?`
                    <blockquote class="pw-intro__quote">
                        <p>"${t.quote}"</p>
                        <cite>— Nikola Vudrag</cite>
                    </blockquote>
                `:""}
            </div>
        </section>
    `:""}function I(t,a,e){return`
        <div class="pw-chapter" data-reveal>
            <div class="pw-chapter__lines">
                <span class="pw-chapter__line"></span>
                <span class="pw-chapter__diamond">◈</span>
                <span class="pw-chapter__line"></span>
            </div>
            <span class="pw-chapter__number">${t}</span>
            <h2 class="pw-chapter__title">${a}</h2>
            <span class="pw-chapter__count">${e}</span>
        </div>
    `}function A(t,a){return t.length?`
        <section class="pw-panoramic" id="pw-${a}">
            ${t.map((e,s)=>{const i=e.galleryImages&&e.galleryImages.length>1;return`
                    <article class="pw-pano-card" data-reveal>
                        <div class="pw-pano-card__image-wrap" data-parallax="0.06">
                            ${e.image?`<img class="pw-pano-card__image" src="${e.image}" alt="${e.title}" loading="lazy" decoding="async" draggable="false" />`:`<div class="pw-pano-card__placeholder"><span>${e.title.charAt(0)}</span></div>`}
                            <div class="pw-pano-card__gradient"></div>
                            ${i?`
                                <button class="pw-pano-card__gallery-btn" data-gallery='${JSON.stringify(e.galleryImages)}' aria-label="View gallery">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                                        <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                                    </svg>
                                    <span>${e.galleryImages.length} images</span>
                                </button>
                            `:""}
                        </div>
                        <div class="pw-pano-card__info">
                            <div class="pw-pano-card__meta">
                                <span class="pw-pano-card__index">${String(s+1).padStart(2,"0")}</span>
                                ${e.year?`<span class="pw-pano-card__year">${e.year}</span>`:""}
                                ${e.dimensions?`<span class="pw-pano-card__dims">${e.dimensions}</span>`:""}
                            </div>
                            <h3 class="pw-pano-card__title">${e.title}</h3>
                            <p class="pw-pano-card__description">${e.description||""}</p>
                        </div>
                    </article>
                `}).join("")}
        </section>
    `:""}function Q(t){if(!t||!t.works)return"";const a=Math.max(...t.works.map(s=>s.height)),e=1.8;return`
        <section class="pw-scale" id="pw-scale">
            <header class="pw-scale__header" data-reveal>
                <span class="pw-scale__label">In Perspective</span>
                <h2 class="pw-scale__title">${t.title||"The Scale of Ambition"}</h2>
                <div class="pw-scale__divider"></div>
            </header>
            <div class="pw-scale__skyline" data-reveal>
                <div class="pw-scale__ground"></div>
                ${t.works.map((s,i)=>{const o=s.height/a*100;return`
                        <div class="pw-scale__monolith" data-scale-index="${i}" style="--monolith-height: ${o}%;">
                            <div class="pw-scale__monolith-block" data-animated="false">
                                <span class="pw-scale__monolith-height">${s.height}${s.unit}</span>
                            </div>
                            <span class="pw-scale__monolith-label">${s.label}</span>
                        </div>
                    `}).join("")}
                <div class="pw-scale__monolith pw-scale__monolith--human" style="--monolith-height: ${e/a*100}%;">
                    <div class="pw-scale__monolith-block pw-scale__monolith-block--human" data-animated="false">
                        <svg class="pw-scale__human-svg" viewBox="0 0 24 60" fill="none" stroke="currentColor" stroke-width="1.2">
                            <circle cx="12" cy="5" r="4"/>
                            <line x1="12" y1="9" x2="12" y2="35"/>
                            <line x1="12" y1="15" x2="4" y2="25"/>
                            <line x1="12" y1="15" x2="20" y2="25"/>
                            <line x1="12" y1="35" x2="6" y2="55"/>
                            <line x1="12" y1="35" x2="18" y2="55"/>
                        </svg>
                        <span class="pw-scale__monolith-height">${e}m</span>
                    </div>
                    <span class="pw-scale__monolith-label">Human</span>
                </div>
            </div>
        </section>
    `}function Z(){return`
        <section class="pw-inquire" id="pw-inquire">
            <div class="pw-inquire__container" data-reveal>
                <div class="pw-inquire__crown">
                    <span class="pw-inquire__line"></span>
                    <span class="pw-inquire__diamond">◈</span>
                    <span class="pw-inquire__line"></span>
                </div>
                <span class="pw-inquire__label">Commissions & Inquiries</span>
                <h3 class="pw-inquire__title">
                    <span>Let's </span>
                    <span class="pw-inquire__title-accent">Connect</span>
                </h3>
                <p class="pw-inquire__text">
                    For monumental sculpture commissions, public art proposals, or site-specific installation inquiries — I welcome your message.
                </p>
                <a href="/contact.html" class="pw-inquire__cta">
                    <span>Get in Touch</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </a>
            </div>
        </section>
    `}async function ee(t,a){const e=t.querySelector("#pw-splat-canvas-wrap");if(!e)return;if(!document.createElement("canvas").getContext("webgl2")){console.warn("WebGL2 not supported, using fallback image");return}let o;try{o=(await V(()=>import("./playcanvas-D5Kv4vzz.js").then(n=>n.x),[])).CameraFrame}catch{console.warn("CameraFrame not available")}try{const r=document.createElement("canvas");r.className="pw-splat-hero__canvas",e.insertBefore(r,e.firstChild);const n=new Y(r,{graphicsDeviceOptions:{antialias:!1,alpha:!0,preserveDrawingBuffer:!1,powerPreference:"high-performance"}});n.setCanvasFillMode(G),n.setCanvasResolution(U),n.start();const c=()=>n.resizeCanvas();window.addEventListener("resize",c);const _=new x(.02,.02,.03,1),u=new E("camera");u.addComponent("camera",{fov:50,clearColor:_,nearClip:.1,farClip:100}),u.setPosition(0,.5,3.5),u.lookAt(0,.4,0),n.root.addChild(u);let l=null;if(o)try{l=new o(n,u.camera),l.rendering.toneMapping=0,l.rendering.sharpness=0,l.bloom.intensity=.01,l.bloom.blurLevel=12,l.grading.enabled=!0,l.grading.brightness=1,l.grading.contrast=1.35,l.grading.saturation=1.65,l.grading.tint=new x(1,1,1,1),l.vignette.intensity=1,l.vignette.inner=.4,l.vignette.outer=1.2,l.vignette.curvature=.5,l.vignette.color=new x(0,0,0),l.fringing.intensity=0,l.enabled=!0,l.update(),console.log("🎬 Public Works post-effects enabled (no chromatic aberration)")}catch(h){console.warn("Post-effects setup failed:",h)}const P=a.splatFile||"gs_vudrag_romislav.sog",m=new X("tomislav-splat","gsplat",{url:`/${P}`});n.assets.add(m),n.assets.load(m),m.ready(()=>{const h=new E("tomislav");h.addComponent("gsplat",{asset:m}),h.setPosition(0,.4,0),h.setLocalEulerAngles(-175,30,0),h.setLocalScale(.7,.7,.7),n.root.addChild(h);const g=e.querySelector(".pw-splat-hero__fallback");g&&(g.style.opacity="0",setTimeout(()=>g.style.display="none",1e3));const k=t.querySelector("#pw-interact-hint");k&&setTimeout(()=>k.classList.add("is-visible"),2e3);let b=0,f=0,y=0,w=0,v=0;const C=3.5,F=.5,O=.25,T=.15,S=new M,q=new M;e.addEventListener("mousemove",p=>{const d=e.getBoundingClientRect();w=((p.clientX-d.left)/d.width-.5)*2,v=((p.clientY-d.top)/d.height-.5)*2}),e.addEventListener("mouseleave",()=>{w=0,v=0}),e.addEventListener("touchmove",p=>{const d=e.getBoundingClientRect();w=((p.touches[0].clientX-d.left)/d.width-.5)*2,v=((p.touches[0].clientY-d.top)/d.height-.5)*2},{passive:!0}),e.addEventListener("touchend",()=>{w=0,v=0}),n.on("update",p=>{b+=p,f+=(w-f)*Math.min(1,p*4),y+=(v-y)*Math.min(1,p*4);const L=Math.sin(b*O)*T+f*.3,H=Math.sin(L)*C*.3,R=Math.cos(L)*C,z=Math.sin(b*.4)*.03,D=F+z+y*.15,N=u.getPosition();S.set(H,D,R);const W=1-Math.pow(.05,p);q.lerp(N,S,W),u.setPosition(q),u.lookAt(0,.35,0),l&&l.enabled&&l.update()})});const B=new IntersectionObserver(h=>{h.forEach(g=>{g.isIntersecting?n.autoRender=!0:n.autoRender=!1})},{threshold:.05}),$=t.querySelector("#pw-splat-hero");$&&B.observe($),console.log("✅ Public Works Splat Viewer initialized")}catch(r){console.warn("Splat viewer failed to initialize:",r)}}function te(t){const a=t.querySelectorAll("[data-reveal]"),e=new IntersectionObserver(s=>{s.forEach(i=>{if(i.isIntersecting){const o=parseInt(i.target.dataset.revealDelay||"0",10);setTimeout(()=>{i.target.classList.add("is-revealed")},o*150),e.unobserve(i.target)}})},{threshold:.08,rootMargin:"0px 0px -30px 0px"});a.forEach(s=>e.observe(s))}function ae(t){const a=t.querySelectorAll("[data-parallax]");if(!a.length)return;let e=!1;window.addEventListener("scroll",()=>{e||(e=!0,requestAnimationFrame(()=>{a.forEach(s=>{const i=parseFloat(s.dataset.parallax)||.05,o=s.getBoundingClientRect(),r=o.top+o.height/2,n=window.innerHeight/2,c=(r-n)*i;s.style.transform=`translateY(${c}px) scale(1.08)`}),e=!1}))},{passive:!0})}function se(t){const a=t.querySelector(".pw-scale__skyline");if(!a)return;const e=new IntersectionObserver(s=>{s.forEach(i=>{i.isIntersecting&&(a.querySelectorAll(".pw-scale__monolith-block").forEach((r,n)=>{setTimeout(()=>{r.dataset.animated="true"},n*150)}),e.unobserve(a))})},{threshold:.25});e.observe(a)}function ne(t){t.querySelectorAll(".pw-pano-card__gallery-btn").forEach(e=>{e.addEventListener("click",s=>{s.stopPropagation();const i=JSON.parse(e.dataset.gallery);ie(i)})})}function ie(t){if(document.querySelector(".pw-lightbox"))return;let a=0;const e=document.createElement("div");e.className="pw-lightbox",e.innerHTML=`
        <div class="pw-lightbox__overlay"></div>
        <button class="pw-lightbox__close" aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
        </button>
        <div class="pw-lightbox__content">
            <img class="pw-lightbox__image" src="${t[0]}" alt="" />
        </div>
        <div class="pw-lightbox__nav">
            <button class="pw-lightbox__prev" aria-label="Previous">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
            </button>
            <span class="pw-lightbox__counter">${a+1} / ${t.length}</span>
            <button class="pw-lightbox__next" aria-label="Next">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </button>
        </div>
    `,document.body.appendChild(e),requestAnimationFrame(()=>e.classList.add("is-open"));const s=e.querySelector(".pw-lightbox__image"),i=e.querySelector(".pw-lightbox__counter");function o(c){a=c,s.src=t[a],i.textContent=`${a+1} / ${t.length}`}e.querySelector(".pw-lightbox__close").addEventListener("click",n),e.querySelector(".pw-lightbox__overlay").addEventListener("click",n),e.querySelector(".pw-lightbox__prev").addEventListener("click",()=>{o((a-1+t.length)%t.length)}),e.querySelector(".pw-lightbox__next").addEventListener("click",()=>{o((a+1)%t.length)});function r(c){c.key==="Escape"&&n(),c.key==="ArrowLeft"&&o((a-1+t.length)%t.length),c.key==="ArrowRight"&&o((a+1)%t.length)}document.addEventListener("keydown",r);function n(){e.classList.remove("is-open"),document.removeEventListener("keydown",r),setTimeout(()=>e.remove(),400)}}export{oe as mount};
