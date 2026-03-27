async function Z(a,s){const{pageContent:d,works:i=[],segments:o=[]}=s,{hero:r={},introduction:u={},technique:p={}}=d||{};a.innerHTML=j(s,r,u,i,p),requestAnimationFrame(()=>{U(a),J(a),K(a)})}function j(a,s,d,i,o){return`
        ${D(s)}
        ${F(d)}
        ${N(i)}
        ${A(o)}
        ${V()}
    `}function D(a){return a.title?`
        <section class="pt-hero" id="pt-hero">
            <img class="pt-hero__image" src="${a.image}" alt="${a.title}" draggable="false" />
            <div class="pt-hero__overlay"></div>
            <div class="pt-hero__content" data-reveal>
                <span class="pt-hero__eyebrow">${a.eyebrow||""}</span>
                <h1 class="pt-hero__title">${a.title}</h1>
                <p class="pt-hero__subtitle">${a.subtitle||""}</p>
            </div>
            <div class="pt-hero__scroll-hint">
                <span>Scroll to explore</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
            </div>
        </section>
    `:""}function F(a){return a.title?`
        <section class="pt-intro" id="pt-intro">
            <canvas class="pt-intro__canvas" id="pt-plasma-canvas"></canvas>
            <div class="pt-intro__canvas-texture"></div>
            <div class="pt-intro__watermark" aria-hidden="true">PAINTINGS</div>
            <div class="pt-intro__content" data-reveal>
                <span class="pt-intro__eyebrow">${a.eyebrow||""}</span>
                <h2 class="pt-intro__title">${a.title}</h2>
                <div class="pt-intro__divider"></div>
                <p class="pt-intro__text">${a.text||""}</p>
                ${a.quote?`
                    <blockquote class="pt-intro__quote">
                        <p>"${a.quote}"</p>
                        <cite>— Nikola Vudrag</cite>
                    </blockquote>
                `:""}
            </div>
            <p class="pt-intro__canvas-hint" data-reveal>
                <span class="pt-intro__canvas-hint-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4M12 8h.01"/>
                    </svg>
                </span>
                <span class="pt-intro__canvas-hint-desktop">Move your cursor to draw with plasma</span>
                <span class="pt-intro__canvas-hint-mobile">Touch to draw with plasma</span>
            </p>
        </section>
    `:""}function N(a){if(!a.length)return"";const s=a.filter(r=>r.segment==="Plasma Torch"),d=a.filter(r=>r.segment==="Mirror Steel"),i=a.filter(r=>!r.segment);let o=[];return s.length&&(o.push({type:"divider",label:"Plasma Torch",count:s.length}),s.forEach(r=>o.push({type:"work",data:r}))),d.length&&(o.push({type:"divider",label:"Mirror Steel",count:d.length}),d.forEach(r=>o.push({type:"work",data:r}))),i.length&&i.forEach(r=>o.push({type:"work",data:r})),`
        <section class="pt-gallery" id="pt-gallery">
            <header class="pt-gallery__header" data-reveal>
                <span class="pt-gallery__label">The Collection</span>
                <h2 class="pt-gallery__title">Works</h2>
                <div class="pt-gallery__divider"></div>
                <p class="pt-gallery__hint">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                    Scroll horizontally to explore
                </p>
            </header>
            <div class="pt-gallery__track-wrapper">
                <div class="pt-gallery__track" id="pt-gallery-track">
                    ${o.map((r,u)=>{if(r.type==="divider")return`
                                <div class="pt-gallery__segment-divider">
                                    <span class="pt-gallery__segment-watermark">${r.label.toUpperCase()}</span>
                                    <div class="pt-gallery__segment-info">
                                        <span class="pt-gallery__segment-count">${r.count} Work${r.count>1?"s":""}</span>
                                    </div>
                                </div>
                            `;const p=r.data;return`
                            <article class="pt-work-card" data-index="${u}">
                                <div class="pt-work-card__image-wrap">
                                    <img class="pt-work-card__image" src="${p.image}" alt="${p.title}" loading="lazy" />
                                </div>
                                <div class="pt-work-card__overlay"></div>
                                <div class="pt-work-card__content">
                                    <div class="pt-work-card__meta">
                                        <span class="pt-work-card__year">${p.year}</span>
                                        ${p.dimensions?`<span class="pt-work-card__dimensions">${p.dimensions}</span>`:""}
                                    </div>
                                    <h3 class="pt-work-card__title">${p.title}</h3>
                                    <p class="pt-work-card__description">${p.description}</p>
                                </div>
                                <div class="pt-work-card__glow"></div>
                            </article>
                        `}).join("")}
                </div>
                <div class="pt-gallery__progress">
                    <div class="pt-gallery__progress-bar" id="pt-gallery-progress"></div>
                </div>
            </div>
        </section>
    `}function A(a){return a.title?`
        <section class="pt-technique" id="pt-technique">
            <div class="pt-technique__watermark" aria-hidden="true">METHOD</div>
            <div class="pt-technique__content" data-reveal>
                <span class="pt-technique__label">The Process</span>
                <h2 class="pt-technique__title">${a.title}</h2>
                <div class="pt-technique__divider"></div>
                <p class="pt-technique__text">${a.text||""}</p>
            </div>
            ${a.stats?`
                <div class="pt-technique__stats" data-reveal>
                    ${a.stats.map(s=>`
                        <div class="pt-technique__stat">
                            <span class="pt-technique__stat-value">${s.value}</span>
                            <span class="pt-technique__stat-label">${s.label}</span>
                        </div>
                    `).join("")}
                </div>
            `:""}
        </section>
    `:""}function V(){return`
        <section class="pt-inquire" id="pt-inquire">
            <div class="pt-inquire__container" data-reveal>
                <div class="pt-inquire__crown">
                    <span class="pt-inquire__line"></span>
                    <span class="pt-inquire__diamond">◈</span>
                    <span class="pt-inquire__line"></span>
                </div>
                <span class="pt-inquire__label">Commissions & Inquiries</span>
                <h3 class="pt-inquire__title">
                    <span>Let's </span>
                    <span class="pt-inquire__title-accent">Connect</span>
                </h3>
                <p class="pt-inquire__text">
                    For custom plasma-cut wall art, metal painting commissions, or to discuss a collaborative project — I welcome your message.
                </p>
                <a href="/contact.html" class="pt-inquire__cta">
                    <span>Get in Touch</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </a>
            </div>
        </section>
    `}function U(a){const s=a.querySelectorAll("[data-reveal]"),d=new IntersectionObserver(i=>{i.forEach(o=>{if(o.isIntersecting){const r=parseInt(o.target.dataset.revealDelay||"0",10);setTimeout(()=>{o.target.classList.add("is-revealed")},r*150),d.unobserve(o.target)}})},{threshold:.15,rootMargin:"0px 0px -40px 0px"});s.forEach(i=>d.observe(i))}function J(a){const s=a.querySelector("#pt-intro"),d=a.querySelector("#pt-plasma-canvas");if(!d||!s)return;const i=d.getContext("2d");let o=[],r=[],u=!1,p=!1,f=0,_=0,w=null,M=!1;const x="ontouchstart"in window||navigator.maxTouchPoints>0;let b=[],q=0;function $(){const l=s.getBoundingClientRect(),e=Math.min(window.devicePixelRatio||1,2);d.width=l.width*e,d.height=l.height*e,i.setTransform(e,0,0,e,0,0)}$(),window.addEventListener("resize",$);class L{constructor(e,c,t=!1){this.x=e,this.y=c,this.vx=(Math.random()-.5)*(t?1.5:4),this.vy=(Math.random()-.5)*(t?1.5:4)-(t?.5:1.5),this.life=1,this.decay=t?.008+Math.random()*.012:.015+Math.random()*.025,this.size=t?.5+Math.random()*1.5:1+Math.random()*2.5,this.hue=25+Math.random()*25}update(){this.x+=this.vx,this.y+=this.vy,this.vy+=.03,this.life-=this.decay,this.size*=.985}draw(e){if(this.life<=0)return;const c=this.life*.7;e.beginPath(),e.arc(this.x,this.y,this.size*.5,0,Math.PI*2),e.fillStyle=`rgba(255, 255, 240, ${c})`,e.fill(),e.beginPath(),e.arc(this.x,this.y,this.size,0,Math.PI*2),e.fillStyle=`hsla(${this.hue}, 100%, 60%, ${c*.4})`,e.fill()}}class S{constructor(e,c,t=!1){this.x=e,this.y=c,this.life=1,this.decay=t?.005:.004,this.width=t?1+Math.random()*1.5:2+Math.random()*2}update(){this.life-=this.decay}}function k(l){const e=s.getBoundingClientRect();return l.touches?{x:l.touches[0].clientX-e.left,y:l.touches[0].clientY-e.top}:{x:l.clientX-e.left,y:l.clientY-e.top}}function T(l,e,c,t,n=!1){const v=l-c,g=e-t,m=Math.sqrt(v*v+g*g),y=Math.max(1,Math.floor(m/4));for(let h=0;h<y;h++){const P=h/y,E=c+v*P,I=t+g*P;r.push(new S(E,I,n));const W=n?1:Math.min(3,Math.floor(m/8)+1);for(let z=0;z<W;z++)o.push(new L(E,I,n))}}function X(l){const e=k(l);u&&T(e.x,e.y,f,_),u=!0,f=e.x,_=e.y}function B(){u=!1}function R(l){p=!0;const e=k(l);f=e.x,_=e.y}function H(l){if(!p)return;const e=k(l);T(e.x,e.y,f,_),f=e.x,_=e.y}function Y(){p=!1}function G(l,e){if(q++,q%(x?8:20)!==0)return;const c=l*(.2+Math.random()*.6),t=e*(.2+Math.random()*.6),n={x:c,y:t,targetX:c+(Math.random()-.5)*80,targetY:t+(Math.random()-.5)*60,progress:0};b.push(n)}function O(l,e){G(l,e);for(let c=b.length-1;c>=0;c--){const t=b[c];if(t.progress+=.02,t.progress>=1){b.splice(c,1);continue}t.x+(t.targetX-t.x)*Math.max(0,t.progress-.02),t.y+(t.targetY-t.y)*Math.max(0,t.progress-.02);const n=t.x+(t.targetX-t.x)*t.progress,v=t.y+(t.targetY-t.y)*t.progress;r.push(new S(n,v,!0)),Math.random()<.3&&o.push(new L(n,v,!0))}}function C(){const l=s.getBoundingClientRect(),e=l.width,c=l.height;i.fillStyle="rgba(5, 5, 8, 0.06)",i.fillRect(0,0,e,c),!u&&!p&&O(e,c);for(let t=r.length-1;t>=0;t--){const n=r[t];if(n.update(),n.life<=0){r.splice(t,1);continue}let v,g,m,y;if(n.life>.7){const h=(n.life-.7)/.3;v=255,g=Math.floor(200+55*h),m=Math.floor(150+100*h),y=.85}else if(n.life>.4){const h=(n.life-.4)/.3;v=Math.floor(200+55*h),g=Math.floor(100+100*h),m=30,y=.6}else if(n.life>.15){const h=(n.life-.15)/.25;v=Math.floor(80+120*h),g=Math.floor(20+80*h),m=Math.floor(10+20*h),y=.4}else{const h=n.life/.15;v=Math.floor(40+40*h),g=Math.floor(38+10*h),m=Math.floor(42+5*h),y=.25*h}i.beginPath(),i.arc(n.x,n.y,n.width*(.5+n.life*.5),0,Math.PI*2),i.fillStyle=`rgba(${v},${g},${m},${y})`,i.fill(),n.life>.5&&(i.beginPath(),i.arc(n.x,n.y,n.width*3,0,Math.PI*2),i.fillStyle=`rgba(255, 160, 60, ${(n.life-.5)*.1})`,i.fill())}for(let t=o.length-1;t>=0;t--){if(o[t].update(),o[t].life<=0){o.splice(t,1);continue}o[t].draw(i)}if(u){const t=i.createRadialGradient(f,_,0,f,_,40);t.addColorStop(0,"rgba(255, 180, 80, 0.15)"),t.addColorStop(.5,"rgba(255, 130, 40, 0.05)"),t.addColorStop(1,"rgba(255, 100, 20, 0)"),i.fillStyle=t,i.fillRect(f-40,_-40,80,80)}w=requestAnimationFrame(C)}new IntersectionObserver(l=>{l.forEach(e=>{e.isIntersecting&&!M?(M=!0,$(),C()):!e.isIntersecting&&M&&(M=!1,w&&cancelAnimationFrame(w),w=null)})},{threshold:.05}).observe(s),x||(s.addEventListener("mousemove",X),s.addEventListener("mouseleave",B)),s.addEventListener("touchstart",R,{passive:!0}),s.addEventListener("touchmove",H,{passive:!0}),s.addEventListener("touchend",Y,{passive:!0}),console.log(`🔥 Plasma Canvas initialized (${x?"mobile":"desktop"} mode)`)}function K(a){const s=a.querySelector("#pt-gallery-track"),d=a.querySelector("#pt-gallery-progress");if(!s)return;s.addEventListener("scroll",()=>{const u=s.scrollLeft,p=s.scrollWidth-s.clientWidth,f=p>0?u/p*100:0;d&&(d.style.width=`${f}%`)},{passive:!0});let i=!1,o=0,r=0;s.addEventListener("mousedown",u=>{i=!0,s.classList.add("is-dragging"),o=u.pageX-s.offsetLeft,r=s.scrollLeft}),s.addEventListener("mouseleave",()=>{i=!1,s.classList.remove("is-dragging")}),s.addEventListener("mouseup",()=>{i=!1,s.classList.remove("is-dragging")}),s.addEventListener("mousemove",u=>{if(!i)return;u.preventDefault();const f=(u.pageX-s.offsetLeft-o)*1.5;s.scrollLeft=r-f})}export{Z as mount};
