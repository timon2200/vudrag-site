const v="/api";async function I(e,s){const{pageContent:t,works:i=[]}=s,{hero:l={},introduction:a={},labours:n=[],venice:c={}}=t||{};let o=[];try{const r=await fetch(`${v}/collections/public-works`);r.ok&&(o=((await r.json()).works||[]).filter(d=>d.segment==="Hercules Labors"))}catch{console.warn("Could not fetch Hercules Labors data")}const p=i.filter(r=>r.segment==="Closed Lighting");e.innerHTML=h(l,a,i,n,c,p,o),requestAnimationFrame(()=>{x(e),C(e)})}function h(e,s,t,i,l,a,n){return`
        ${m(e)}
        ${b(s)}
        ${$(t)}
        ${f(i,n)}
        ${w(l,n)}
        ${q(a)}
        ${L()}
    `}function m(e){return`
        <section class="pg-hero" id="pg-hero">
            <div class="pg-hero__clouds">
                <div class="pg-hero__cloud pg-hero__cloud--1"></div>
                <div class="pg-hero__cloud pg-hero__cloud--2"></div>
                <div class="pg-hero__cloud pg-hero__cloud--3"></div>
            </div>
            <div class="pg-hero__image-wrap">
                ${e.image?`<img class="pg-hero__image" src="${e.image}" alt="Prometheus" draggable="false" />`:""}
            </div>
            <div class="pg-hero__overlay"></div>
            <div class="pg-hero__content">
                <span class="pg-hero__eyebrow">${e.eyebrow||""}</span>
                <h1 class="pg-hero__title">${e.title||"POLYGONAL"}</h1>
                <p class="pg-hero__subtitle">${e.subtitle||""}</p>
            </div>
            <div class="pg-hero__chain" aria-hidden="true">
                <svg viewBox="0 0 2 200" preserveAspectRatio="none">
                    <line x1="1" y1="0" x2="1" y2="200" stroke="currentColor" stroke-width="0.5" stroke-dasharray="4 6"/>
                </svg>
            </div>
            <div class="pg-hero__scroll-hint">
                <span>Scroll to explore</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
            </div>
        </section>
    `}function b(e){return e.title?`
        <section class="pg-intro" id="pg-intro">
            <div class="pg-intro__watermark" aria-hidden="true">POLYGONAL</div>
            <div class="pg-intro__content" data-reveal>
                <span class="pg-intro__eyebrow">${e.eyebrow||""}</span>
                <h2 class="pg-intro__title">${e.title}</h2>
                <div class="pg-intro__divider"></div>
                <p class="pg-intro__text">${e.text||""}</p>
                ${e.quote?`
                    <blockquote class="pg-intro__quote">
                        <p>"${e.quote}"</p>
                        <cite>— Nikola Vudrag</cite>
                    </blockquote>
                `:""}
            </div>
        </section>
    `:""}function $(e){const s=e.find(t=>t.title&&t.title.includes("Poseidon"));return s?`
        <section class="pg-poseidon" id="pg-poseidon">
            <div class="pg-poseidon__watermark" aria-hidden="true">POSEIDON</div>
            <div class="pg-poseidon__image-area" data-reveal>
                <img class="pg-poseidon__image" src="${s.image}" alt="${s.title}" draggable="false" loading="lazy" />
            </div>
            <div class="pg-poseidon__info" data-reveal>
                <span class="pg-poseidon__eyebrow">The Olympian</span>
                <h2 class="pg-poseidon__title">${s.title}</h2>
                <div class="pg-poseidon__divider"></div>
                <p class="pg-poseidon__description">${s.description}</p>
                <div class="pg-poseidon__stats">
                    <span class="pg-poseidon__stat">${s.dimensions}</span>
                    <span class="pg-poseidon__stat-sep">·</span>
                    <span class="pg-poseidon__stat">${s.year}</span>
                    <span class="pg-poseidon__stat-sep">·</span>
                    <span class="pg-poseidon__stat">CorTen Steel</span>
                    <span class="pg-poseidon__stat-sep">·</span>
                    <span class="pg-poseidon__stat">Island of St. Catherine, Biograd</span>
                </div>
            </div>
        </section>
    `:""}function f(e,s){return e.length?`
        <section class="pg-labours" id="pg-labours">
            <div class="pg-labours__watermark" aria-hidden="true">HERCULES</div>
            <header class="pg-labours__header" data-reveal>
                <span class="pg-labours__label">The Journey</span>
                <h2 class="pg-labours__title">The Labours of Hercules</h2>
                <div class="pg-labours__divider"></div>
                <p class="pg-labours__intro-text">In the story of Hercules, the twelve labours are a journey of character formation. The symbolic nature of the number twelve lies in its representation of a complete cycle encompassing the entirety of the human personality.</p>
            </header>
            <div class="pg-labours__list">
                ${e.filter(i=>!i.isFeature).map((i,l)=>y(i,l,s)).join("")}
            </div>
        </section>
    `:""}function y(e,s,t){const i=s%2===1,l=String(e.number).padStart(2,"0"),a=t.find(r=>r.title===e.work||e.work&&r.title.toLowerCase().includes(e.work.toLowerCase())),n=(a==null?void 0:a.image)||"",c=(a==null?void 0:a.description)||"",o=(a==null?void 0:a.dimensions)||"",p=(a==null?void 0:a.year)||"";return`
        <article class="pg-labour ${i?"pg-labour--reversed":""}" data-reveal data-reveal-delay="${Math.min(s,3)}">
            <div class="pg-labour__image-wrap">
                ${n?`<img class="pg-labour__image" src="${n}" alt="${e.title}" loading="lazy" draggable="false" />`:'<div class="pg-labour__placeholder"></div>'}
            </div>
            <div class="pg-labour__content">
                <span class="pg-labour__number">${l}</span>
                <h3 class="pg-labour__title">${e.title}</h3>
                ${e.credential?`<span class="pg-labour__credential">${e.credential}</span>`:""}
                <div class="pg-labour__meta">
                    ${p?`<span>${p}</span>`:""}
                    ${o?`<span>${o}</span>`:""}
                </div>
                <p class="pg-labour__description">${c}</p>
            </div>
        </article>
    `}function w(e,s){var n,c,o,p,r,_,d,u;if(!e.title)return"";const t=s.find(g=>g.title==="Atlas"),i=s.find(g=>g.title==="Prometheus"),l=((n=e.atlas)==null?void 0:n.image)||(t==null?void 0:t.image)||"",a=((c=e.prometheus)==null?void 0:c.image)||(i==null?void 0:i.image)||"";return`
        <section class="pg-venice" id="pg-venice">
            <div class="pg-venice__watermark" aria-hidden="true">FORGE</div>
            <header class="pg-venice__header" data-reveal>
                <span class="pg-venice__eyebrow">${e.eyebrow}</span>
                <h2 class="pg-venice__title">${e.title}</h2>
                <div class="pg-venice__divider"></div>
                <p class="pg-venice__subtitle">${e.subtitle}</p>
            </header>
            ${e.text?`
                <div class="pg-venice__philosophy" data-reveal>
                    <p class="pg-venice__philosophy-text">${e.text}</p>
                </div>
            `:""}
            <div class="pg-venice__split" data-reveal>
                <div class="pg-venice__panel pg-venice__panel--atlas">
                    ${l?`<img class="pg-venice__image" src="${l}" alt="Bearing Atlas" loading="lazy" draggable="false" />`:""}
                    <div class="pg-venice__panel-content">
                        <span class="pg-venice__panel-label">${((o=e.atlas)==null?void 0:o.label)||"BEARING"}</span>
                        <h3 class="pg-venice__panel-title">${((p=e.atlas)==null?void 0:p.title)||"The Weight of Form"}</h3>
                        <p class="pg-venice__panel-text">${((r=e.atlas)==null?void 0:r.description)||""}</p>
                    </div>
                </div>
                <div class="pg-venice__divider-line">
                    <div class="pg-venice__divider-glow"></div>
                </div>
                <div class="pg-venice__panel pg-venice__panel--prometheus">
                    ${a?`<img class="pg-venice__image" src="${a}" alt="Forging Prometheus" loading="lazy" draggable="false" />`:""}
                    <div class="pg-venice__panel-content">
                        <span class="pg-venice__panel-label">${((_=e.prometheus)==null?void 0:_.label)||"FORGING"}</span>
                        <h3 class="pg-venice__panel-title">${((d=e.prometheus)==null?void 0:d.title)||"Fire as Language"}</h3>
                        <p class="pg-venice__panel-text">${((u=e.prometheus)==null?void 0:u.description)||""}</p>
                    </div>
                </div>
            </div>
        </section>
    `}function q(e){return e.length?`
        <section class="pg-vault" id="pg-vault">
            <div class="pg-vault__watermark" aria-hidden="true">LIGHT</div>
            <header class="pg-vault__header" data-reveal>
                <span class="pg-vault__label">Closed Lighting</span>
                <h2 class="pg-vault__title">The Vault of Light</h2>
                <div class="pg-vault__divider"></div>
            </header>
            <div class="pg-vault__grid">
                ${e.map((s,t)=>`
                    <article class="pg-vault__card" data-reveal data-reveal-delay="${t}">
                        <div class="pg-vault__card-image-wrap">
                            <div class="pg-vault__card-glow"></div>
                            ${s.image?`<img class="pg-vault__card-image" src="${s.image}" alt="${s.title}" loading="lazy" draggable="false" />`:'<div class="pg-vault__card-placeholder"></div>'}
                        </div>
                        <div class="pg-vault__card-content">
                            <div class="pg-vault__card-meta">
                                <span class="pg-vault__card-year">${s.year||""}</span>
                                ${s.dimensions?`<span class="pg-vault__card-dims">${s.dimensions}</span>`:""}
                            </div>
                            <h3 class="pg-vault__card-title">${s.title}</h3>
                            <p class="pg-vault__card-desc">${s.description||""}</p>
                        </div>
                    </article>
                `).join("")}
            </div>
        </section>
    `:""}function L(){return`
        <section class="pg-inquire" id="pg-inquire">
            <div class="pg-inquire__container" data-reveal>
                <div class="pg-inquire__crown">
                    <span class="pg-inquire__line"></span>
                    <span class="pg-inquire__diamond">◈</span>
                    <span class="pg-inquire__line"></span>
                </div>
                <span class="pg-inquire__label">Commissions & Inquiries</span>
                <h3 class="pg-inquire__title">
                    <span>Let's </span>
                    <span class="pg-inquire__title-accent">Connect</span>
                </h3>
                <p class="pg-inquire__text">
                    For monumental sculpture commissions, exhibition inquiries, or to discuss a collaborative project — I welcome your message.
                </p>
                <a href="/contact.html" class="pg-inquire__cta">
                    <span>Get in Touch</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </a>
            </div>
        </section>
    `}function x(e){const s=e.querySelector("#pg-hero");if(!s)return;const t=s.querySelectorAll(".pg-hero__cloud"),i=s.querySelector(".pg-hero__scroll-hint");setTimeout(()=>{i&&i.classList.add("is-visible")},3e3);let l=!1;window.addEventListener("scroll",()=>{l||(l=!0,requestAnimationFrame(()=>{const a=window.scrollY,n=s.offsetHeight;a<n*1.5&&t.forEach((c,o)=>{const p=.3+o*.15;c.style.transform=`translateY(${-a*p}px)`}),l=!1}))},{passive:!0})}function C(e){const s=e.querySelectorAll("[data-reveal]"),t=new IntersectionObserver(i=>{i.forEach(l=>{if(l.isIntersecting){const a=parseInt(l.target.dataset.revealDelay||"0",10);setTimeout(()=>{l.target.classList.add("is-revealed")},a*150),t.unobserve(l.target)}})},{threshold:.12,rootMargin:"0px 0px -40px 0px"});s.forEach(i=>t.observe(i))}export{I as mount};
