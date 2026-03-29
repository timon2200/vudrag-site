import{_ as ae,A as se,F as ne,R as ie,C as E,E as L,e as le,V as O,a as oe,b as B,x as re,u as x,v as D,y as ce}from"./playcanvas-C6g3ijIZ.js";async function Ee(t,s){const{pageContent:e,works:a=[]}=s,{splatHero:n={},introduction:l={},scale:o={}}=e||{},i=a.filter(c=>c.segment==="Monumental");t.innerHTML=pe(n,l,i,o),requestAnimationFrame(()=>{we(t,n),_e(t),me(t),ye(t),fe(t),be(t)})}function pe(t,s,e,a){return`
        ${de(t)}
        ${he(s)}
        ${ue("I","Monumental",`${e.length} Works`)}
        ${ge(e,"monumental")}
        ${ve(a)}
    `}function de(t){return`
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

            </div>
            <div class="pw-splat-hero__scroll-hint">
                <span>Scroll to explore</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
            </div>
            <div class="pw-splat-hero__scanline" aria-hidden="true"></div>
        </section>
    `}function he(t){return t.title?`
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
    `:""}function ue(t,s,e){return`
        <div class="pw-chapter" data-reveal>
            <div class="pw-chapter__lines">
                <span class="pw-chapter__line"></span>
                <span class="pw-chapter__diamond">◈</span>
                <span class="pw-chapter__line"></span>
            </div>
            <span class="pw-chapter__number">${t}</span>
            <h2 class="pw-chapter__title">${s}</h2>
            <span class="pw-chapter__count">${e}</span>
        </div>
    `}function ge(t,s){return t.length?`
        <section class="pw-panoramic" id="pw-${s}">
            ${t.map((e,a)=>{const n=e.galleryImages&&e.galleryImages.length>1;return`
                    <article class="pw-pano-card" data-reveal>
                        <div class="pw-pano-card__image-wrap" data-parallax="0.06">
                            ${e.image?`<img class="pw-pano-card__image" src="${e.image}" alt="${e.title}" loading="lazy" decoding="async" draggable="false" />`:`<div class="pw-pano-card__placeholder"><span>${e.title.charAt(0)}</span></div>`}
                            <div class="pw-pano-card__gradient"></div>
                            ${e.photoCredit?`<span class="pw-pano-card__photo-credit">${e.photoCredit}</span>`:""}
                            ${n?`
                                <button class="pw-pano-card__gallery-btn" data-gallery='${JSON.stringify(e.galleryImages)}' aria-label="View gallery">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                                        <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                                    </svg>
                                    <span>${e.galleryImages.length} images</span>
                                </button>
                            `:""}
                        </div>
                        <div class="pw-pano-card__torch"></div>
                        <div class="pw-pano-card__info">
                            <div class="pw-pano-card__meta">
                                <span class="pw-pano-card__index">${String(a+1).padStart(2,"0")}</span>
                                ${e.year?`<span class="pw-pano-card__year">${e.year}</span>`:""}
                                ${e.dimensions?`<span class="pw-pano-card__dims">${e.dimensions}</span>`:""}
                            </div>
                            <h3 class="pw-pano-card__title">${e.title}</h3>
                            <p class="pw-pano-card__description">${e.description||""}</p>
                        </div>
                    </article>
                `}).join("")}
        </section>
    `:""}function ve(t){if(!t||!t.works)return"";const s=Math.max(...t.works.map(a=>a.height)),e=1.8;return`
        <section class="pw-scale" id="pw-scale">
            <header class="pw-scale__header" data-reveal>
                <span class="pw-scale__label">In Perspective</span>
                <h2 class="pw-scale__title">${t.title||"The Scale of Ambition"}</h2>
                <div class="pw-scale__divider"></div>
            </header>
            <div class="pw-scale__skyline" data-reveal>
                <div class="pw-scale__ground"></div>
                ${t.works.map((a,n)=>{const l=a.height/s*100;return`
                        <div class="pw-scale__monolith" data-scale-index="${n}" style="--monolith-height: ${l}%;">
                            <div class="pw-scale__monolith-block" data-animated="false">
                                <span class="pw-scale__monolith-height">${a.height}${a.unit}</span>
                            </div>
                            <span class="pw-scale__monolith-label">${a.label}</span>
                        </div>
                    `}).join("")}
                <div class="pw-scale__monolith pw-scale__monolith--human" style="--monolith-height: ${e/s*100}%;">
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
    `}async function we(t,s){const e=t.querySelector("#pw-splat-canvas-wrap");if(!e)return;if(!document.createElement("canvas").getContext("webgl2")){console.warn("WebGL2 not supported, using fallback image");return}let l;try{l=(await ae(()=>import("./playcanvas-C6g3ijIZ.js").then(i=>i.z),[])).CameraFrame}catch{console.warn("CameraFrame not available")}try{const o=document.createElement("canvas");o.className="pw-splat-hero__canvas",e.insertBefore(o,e.firstChild);const i=new se(o,{graphicsDeviceOptions:{antialias:!1,alpha:!0,preserveDrawingBuffer:!1,powerPreference:"high-performance"}});i.setCanvasFillMode(ne),i.setCanvasResolution(ie),i.start();const c=()=>i.resizeCanvas();window.addEventListener("resize",c);const C=new E(.02,.02,.03,1),u=new L("camera");u.addComponent("camera",{fov:50,clearColor:C,nearClip:.1,farClip:100}),u.setPosition(0,.5,3.5),u.lookAt(0,.4,0),i.root.addChild(u);let r=null;if(l)try{r=new l(i,u.camera),r.rendering.toneMapping=0,r.rendering.sharpness=0,r.bloom.intensity=.01,r.bloom.blurLevel=12,r.grading.enabled=!0,r.grading.brightness=1,r.grading.contrast=1.35,r.grading.saturation=1.65,r.grading.tint=new E(1,1,1,1),r.vignette.intensity=1,r.vignette.inner=.4,r.vignette.outer=1.2,r.vignette.curvature=.5,r.vignette.color=new E(0,0,0),r.fringing.intensity=0,r.enabled=!0,r.update(),console.log("🎬 Public Works post-effects enabled (no chromatic aberration)")}catch(h){console.warn("Post-effects setup failed:",h)}const H=s.splatFile||"gs_vudrag_romislav.sog",y=new le("tomislav-splat","gsplat",{url:`/${H}`});i.assets.add(y),i.assets.load(y),y.ready(()=>{const h=new L("tomislav");h.addComponent("gsplat",{asset:y}),h.setPosition(0,.4,0),h.setLocalEulerAngles(-175,30,0),h.setLocalScale(.7,.7,.7),i.root.addChild(h);const v=e.querySelector(".pw-splat-hero__fallback");v&&(v.style.opacity="0",setTimeout(()=>v.style.display="none",1e3));const k=t.querySelector("#pw-interact-hint");k&&setTimeout(()=>k.classList.add("is-visible"),2e3);const M=xe(i);let w=0,f=0,b=0,_=0,m=0;const A=3.5,Y=.5,N=.25,V=.15;let I=0,q=0,S=0,$=0;const z=new O,R=new O,g=t.querySelector("#pw-splat-hero")||e;g.addEventListener("mousemove",p=>{const d=g.getBoundingClientRect();_=((p.clientX-d.left)/d.width-.5)*2,m=((p.clientY-d.top)/d.height-.5)*2}),g.addEventListener("mouseleave",()=>{_=0,m=0}),g.addEventListener("touchmove",p=>{const d=g.getBoundingClientRect();_=((p.touches[0].clientX-d.left)/d.width-.5)*2,m=((p.touches[0].clientY-d.top)/d.height-.5)*2},{passive:!0}),g.addEventListener("touchend",()=>{_=0,m=0}),i.on("update",p=>{w+=p,f+=(_-f)*Math.min(1,p*6),b+=(m-b)*Math.min(1,p*6);const T=Math.sin(w*N)*V+f*.8,W=Math.sin(T)*A*.3,X=Math.cos(T)*A,U=Math.sin(w*.4)*.03,j=Y+U+b*.4,J=u.getPosition();z.set(W,j,X);const K=1-Math.pow(.05,p);if(R.lerp(J,z,K),u.setPosition(R),u.lookAt(0,.35,0),M){I=-(b*25),q=f*25;const Q=Math.sin(w*.35)*45,Z=Math.sin(w*.22)*45,ee=I+Q,te=q+Z,F=Math.min(1,p*1.8);S+=(ee-S)*F,$+=(te-$)*F,M.setEulerAngles(S,$,0)}r&&r.enabled&&r.update()})});const G=new IntersectionObserver(h=>{h.forEach(v=>{v.isIntersecting?i.autoRender=!0:i.autoRender=!1})},{threshold:.05}),P=t.querySelector("#pw-splat-hero");P&&G.observe(P),console.log("✅ Public Works Splat Viewer initialized")}catch(o){console.warn("Splat viewer failed to initialize:",o)}}function _e(t){const s=t.querySelectorAll("[data-reveal]"),e=new IntersectionObserver(a=>{a.forEach(n=>{if(n.isIntersecting){const l=parseInt(n.target.dataset.revealDelay||"0",10);setTimeout(()=>{n.target.classList.add("is-revealed")},l*150),e.unobserve(n.target)}})},{threshold:.08,rootMargin:"0px 0px -30px 0px"});s.forEach(a=>e.observe(a))}function me(t){const s=t.querySelectorAll("[data-parallax]");if(!s.length)return;let e=!1;window.addEventListener("scroll",()=>{e||(e=!0,requestAnimationFrame(()=>{s.forEach(a=>{const n=parseFloat(a.dataset.parallax)||.05,l=a.getBoundingClientRect(),o=l.top+l.height/2,i=window.innerHeight/2,c=(o-i)*n;a.style.transform=`translateY(${c}px) scale(1.08)`}),e=!1}))},{passive:!0})}function ye(t){const s=t.querySelector(".pw-scale__skyline");if(!s)return;const e=new IntersectionObserver(a=>{a.forEach(n=>{n.isIntersecting&&(s.querySelectorAll(".pw-scale__monolith-block").forEach((o,i)=>{setTimeout(()=>{o.dataset.animated="true"},i*150)}),e.unobserve(s))})},{threshold:.25});e.observe(s)}function fe(t){t.querySelectorAll(".pw-pano-card__gallery-btn").forEach(e=>{e.addEventListener("click",a=>{a.stopPropagation();const n=JSON.parse(e.dataset.gallery);Ce(n)})})}function be(t){t.querySelectorAll(".pw-pano-card").forEach(e=>{const a=e.querySelector(".pw-pano-card__torch");a&&e.addEventListener("mousemove",n=>{const l=e.getBoundingClientRect(),o=((n.clientX-l.left)/l.width*100).toFixed(1),i=((n.clientY-l.top)/l.height*100).toFixed(1);a.style.setProperty("--torch-x",`${o}%`),a.style.setProperty("--torch-y",`${i}%`)})})}function xe(t){const e=document.createElement("canvas");e.width=64,e.height=64;const a=e.getContext("2d"),n=a.createRadialGradient(64/2,64/2,0,64/2,64/2,64/2);n.addColorStop(0,"rgba(255, 255, 255, 1)"),n.addColorStop(.2,"rgba(255, 255, 255, 0.9)"),n.addColorStop(.5,"rgba(255, 255, 255, 0.4)"),n.addColorStop(1,"rgba(255, 255, 255, 0)"),a.fillStyle=n,a.fillRect(0,0,64,64);const l=new oe(t.graphicsDevice,{width:64,height:64,format:re,mipmaps:!0,addressU:B,addressV:B});l.setSource(e);const o=new L("HeroParticles");o.setPosition(0,.5,0);const i=new x([0,0,.15,.45,.7,.4,1,0]),c=new x([0,.005,.3,.018,.7,.012,1,.003]),C=new D([[0,.75,.5,.8,1,.7],[0,.75,.5,.8,1,.7],[0,.78,.5,.83,1,.73]]);return o.addComponent("particlesystem",{numParticles:200,lifetime:18,rate:.06,rate2:.14,emitterShape:1,emitterRadius:5,velocityGraph:new D([[0,-.04,1,.04],[0,.03,1,.08],[0,-.04,1,.04]]),scaleGraph:c,alphaGraph:i,colorGraph:C,colorMap:l,blend:ce,depthWrite:!1,lighting:!1,halfLambert:!1,rotationSpeedGraph:new x([0,-45]),rotationSpeedGraph2:new x([0,45]),intensity:1,loop:!0,autoPlay:!0,preWarm:!0,sort:1}),t.root.addChild(o),o.particlesystem.reset(),o.particlesystem.play(),console.log("✨ 3D PlayCanvas ember particles active"),o}function Ce(t){if(document.querySelector(".pw-lightbox"))return;let s=0;const e=document.createElement("div");e.className="pw-lightbox",e.innerHTML=`
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
            <span class="pw-lightbox__counter">${s+1} / ${t.length}</span>
            <button class="pw-lightbox__next" aria-label="Next">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
            </button>
        </div>
    `,document.body.appendChild(e),requestAnimationFrame(()=>e.classList.add("is-open"));const a=e.querySelector(".pw-lightbox__image"),n=e.querySelector(".pw-lightbox__counter");function l(c){s=c,a.src=t[s],n.textContent=`${s+1} / ${t.length}`}e.querySelector(".pw-lightbox__close").addEventListener("click",i),e.querySelector(".pw-lightbox__overlay").addEventListener("click",i),e.querySelector(".pw-lightbox__prev").addEventListener("click",()=>{l((s-1+t.length)%t.length)}),e.querySelector(".pw-lightbox__next").addEventListener("click",()=>{l((s+1)%t.length)});function o(c){c.key==="Escape"&&i(),c.key==="ArrowLeft"&&l((s-1+t.length)%t.length),c.key==="ArrowRight"&&l((s+1)%t.length)}document.addEventListener("keydown",o);function i(){e.classList.remove("is-open"),document.removeEventListener("keydown",o),setTimeout(()=>e.remove(),400)}}export{Ee as mount};
