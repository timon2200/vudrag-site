async function T(e,a){const{pageContent:i,works:l=[]}=a,{hero:t={},introduction:s={},labours:n=[],venice:r={}}=i||{},o=(i==null?void 0:i.herculesWorks)||[],d=l.filter(c=>c.segment==="Closed Lighting");e.innerHTML=g(t,s,l,n,r,d,o),requestAnimationFrame(()=>{$(e),w(e)})}function g(e,a,i,l,t,s,n){return`
        ${_(e)}
        ${u(a)}
        ${h(i)}
        ${v(l,n)}
        ${b(l)}
        ${f(t,n)}
        ${y(s)}
    `}function _(e){return`
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
    `}function u(e){return e.title?`
        <section class="pg-intro" id="pg-intro">
            <div class="pg-intro__bg"></div>
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
    `:""}function h(e){const a=e.find(i=>i.title&&i.title.includes("Poseidon"));return a?`
        <section class="pg-poseidon" id="pg-poseidon">
            <div class="pg-poseidon__watermark" aria-hidden="true">POSEIDON</div>
            <div class="pg-poseidon__image-area" data-reveal>
                <img class="pg-poseidon__image" src="${a.image}" alt="${a.title}" draggable="false" loading="lazy" />
            </div>
            <div class="pg-poseidon__info" data-reveal>
                <span class="pg-poseidon__eyebrow">The Olympian</span>
                <h2 class="pg-poseidon__title">${a.title}</h2>
                <div class="pg-poseidon__divider"></div>
                <p class="pg-poseidon__description">${a.description}</p>
                <div class="pg-poseidon__stats">
                    <span class="pg-poseidon__stat">${a.dimensions}</span>
                    <span class="pg-poseidon__stat-sep">·</span>
                    <span class="pg-poseidon__stat">${a.year}</span>
                    <span class="pg-poseidon__stat-sep">·</span>
                    <span class="pg-poseidon__stat">CorTen Steel</span>
                    <span class="pg-poseidon__stat-sep">·</span>
                    <span class="pg-poseidon__stat">Island of St. Catherine, Biograd</span>
                </div>
            </div>
        </section>
    `:""}function v(e,a){return e.length?`
        <section class="pg-labours" id="pg-labours">
            <div class="pg-labours__watermark" aria-hidden="true">HERCULES</div>
            <header class="pg-labours__header" data-reveal>
                <span class="pg-labours__label">The Journey</span>
                <h2 class="pg-labours__title">The Labours of Hercules</h2>
                <div class="pg-labours__divider"></div>
                <p class="pg-labours__intro-text">In the story of Hercules, the twelve labours are a journey of character formation. The symbolic nature of the number twelve lies in its representation of a complete cycle encompassing the entirety of the human personality.</p>
            </header>
            <div class="pg-labours__list">
                ${e.filter(l=>!l.isFeature).map((l,t)=>m(l,t,a)).join("")}
            </div>
        </section>
    `:""}function m(e,a,i){const l=a%2===1,t=String(e.number).padStart(2,"0"),s=i.find(p=>p.title===e.work||e.work&&p.title.toLowerCase().includes(e.work.toLowerCase())),n=(s==null?void 0:s.image)||"",r=(s==null?void 0:s.description)||"",o=(s==null?void 0:s.dimensions)||"",d=(s==null?void 0:s.year)||"",c=(s==null?void 0:s.photoCredit)||"";return`
        <article class="pg-labour ${l?"pg-labour--reversed":""}" data-reveal data-reveal-delay="${Math.min(a,3)}">
            <div class="pg-labour__image-wrap">
                ${n?`<img class="pg-labour__image" src="${n}" alt="${e.title}" loading="lazy" draggable="false" />`:'<div class="pg-labour__placeholder"></div>'}
                ${c?`<span class="pg-labour__photo-credit">${c}</span>`:""}
            </div>
            <div class="pg-labour__content">
                <span class="pg-labour__number">${t}</span>
                <h3 class="pg-labour__title">${e.title}</h3>
                ${e.credential?`<span class="pg-labour__credential">${e.credential}</span>`:""}
                <div class="pg-labour__meta">
                    ${d?`<span>${d}</span>`:""}
                    ${o?`<span>${o}</span>`:""}
                </div>
                <p class="pg-labour__description">${r}</p>
            </div>
        </article>
    `}function b(e){const a=[{number:1,title:"The Cretan Bull",myth:"Father of the Minotaur, subdued by bare hands alone."},{number:2,title:"The Erymanthian Boar",myth:"A beast of the wild mountains, brought back alive through snow and silence."},{number:3,title:"The Ceryneian Hind",myth:"Sacred to Artemis, captured through patience — not force."},{number:4,title:"The Augean Stables",myth:"Thirty years of filth, cleansed by rerouting two rivers in a single day."},{number:5,title:"The Stymphalian Birds",myth:"Man-eating birds with bronze beaks, driven from the marshes by sound."},{number:6,title:"The Lernaean Hydra",myth:"The serpent of many heads — cut one, two more arise from the wound."},{number:7,title:"The Mares of Diomedes",myth:"Flesh-eating horses, tamed by turning predator into prey."},{number:8,title:"The Gardens of the Hesperides",myth:"Golden fruit guarded at the edge of the world, beyond the sunset."},{number:9,title:"The Nemean Lion",myth:"The invulnerable beast whose hide no weapon could pierce."},{number:10,title:"The Cattle of Geryon",myth:"A thousand-mile journey to claim the red cattle of the three-bodied giant."},{number:11,title:"The Girdle of Hippolyta",myth:"The Amazon queen's belt — a prize requiring diplomacy before force."},{number:12,title:"Cerberus",myth:"The three-headed guardian of the underworld, dragged into daylight."}],i=new Set(e.map(t=>t.number)),l=a.filter(t=>!i.has(t.number));return l.length?`
        <section class="pg-unfinished" id="pg-unfinished">
            <div class="pg-unfinished__watermark" aria-hidden="true">XII</div>
            <header class="pg-unfinished__header" data-reveal>
                <span class="pg-unfinished__label">The Labours Yet to Come</span>
                <h2 class="pg-unfinished__title">In the Studio</h2>
                <div class="pg-unfinished__divider"></div>
                <p class="pg-unfinished__intro">The cycle continues. Each remaining labour awaits its translation from myth into steel — from the architect's table to the plasma torch.</p>
            </header>
            <div class="pg-unfinished__grid">
                ${l.map((t,s)=>`
                    <div class="pg-unfinished__card" data-reveal data-reveal-delay="${Math.min(s,4)}">
                        <div class="pg-unfinished__card-lock">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                                <rect x="3" y="11" width="18" height="11" rx="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                        </div>
                        <span class="pg-unfinished__card-number">${String(t.number).padStart(2,"0")}</span>
                        <h3 class="pg-unfinished__card-title">${t.title}</h3>
                        <p class="pg-unfinished__card-myth">${t.myth}</p>
                    </div>
                `).join("")}
            </div>
        </section>
    `:""}function f(e,a){var t,s,n,r;if(!e.title)return"";const i=a.find(o=>o.title==="Atlas"),l=((t=e.atlas)==null?void 0:t.image)||(i==null?void 0:i.image)||"";return`
        <section class="pg-venice" id="pg-venice">
            <div class="pg-venice__watermark" aria-hidden="true">ATLAS</div>
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
            <div class="pg-venice__atlas-feature" data-reveal>
                <div class="pg-venice__atlas-image-wrap">
                    ${l?`<img class="pg-venice__image" src="${l}" alt="Atlas — The Weight of Form" loading="lazy" draggable="false" />`:""}
                    <div class="pg-venice__atlas-overlay"></div>
                </div>
                <div class="pg-venice__atlas-content">
                    <span class="pg-venice__panel-label">${((s=e.atlas)==null?void 0:s.label)||"BEARING"}</span>
                    <h3 class="pg-venice__panel-title">${((n=e.atlas)==null?void 0:n.title)||"The Weight of Form"}</h3>
                    <p class="pg-venice__panel-text">${((r=e.atlas)==null?void 0:r.description)||""}</p>
                </div>
            </div>
        </section>
    `}function y(e){return e.length?`
        <section class="pg-vault" id="pg-vault">
            <div class="pg-vault__watermark" aria-hidden="true">LIGHT</div>
            <header class="pg-vault__header" data-reveal>
                <span class="pg-vault__label">Closed Lighting</span>
                <h2 class="pg-vault__title">The Vault of Light</h2>
                <div class="pg-vault__divider"></div>
            </header>
            <div class="pg-vault__grid">
                ${e.map((a,i)=>`
                    <article class="pg-vault__card" data-reveal data-reveal-delay="${i}">
                        <div class="pg-vault__card-image-wrap">
                            <div class="pg-vault__card-glow"></div>
                            ${a.image?`<img class="pg-vault__card-image" src="${a.image}" alt="${a.title}" loading="lazy" draggable="false" />`:'<div class="pg-vault__card-placeholder"></div>'}
                        </div>
                        <div class="pg-vault__card-content">
                            <div class="pg-vault__card-meta">
                                <span class="pg-vault__card-year">${a.year||""}</span>
                                ${a.dimensions?`<span class="pg-vault__card-dims">${a.dimensions}</span>`:""}
                            </div>
                            <h3 class="pg-vault__card-title">${a.title}</h3>
                            <p class="pg-vault__card-desc">${a.description||""}</p>
                        </div>
                    </article>
                `).join("")}
            </div>
        </section>
    `:""}function $(e){const a=e.querySelector("#pg-hero");if(!a)return;const i=a.querySelectorAll(".pg-hero__cloud"),l=a.querySelector(".pg-hero__scroll-hint");setTimeout(()=>{l&&l.classList.add("is-visible")},3e3);let t=!1;window.addEventListener("scroll",()=>{t||(t=!0,requestAnimationFrame(()=>{const s=window.scrollY,n=a.offsetHeight;s<n*1.5&&i.forEach((r,o)=>{const d=.3+o*.15;r.style.transform=`translateY(${-s*d}px)`}),t=!1}))},{passive:!0})}function w(e){const a=e.querySelectorAll("[data-reveal]"),i=new IntersectionObserver(l=>{l.forEach(t=>{if(t.isIntersecting){const s=parseInt(t.target.dataset.revealDelay||"0",10);setTimeout(()=>{t.target.classList.add("is-revealed")},s*150),i.unobserve(t.target)}})},{threshold:.12,rootMargin:"0px 0px -40px 0px"});a.forEach(l=>i.observe(l))}export{T as mount};
