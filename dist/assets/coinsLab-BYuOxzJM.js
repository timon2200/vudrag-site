import"./modulepreload-polyfill-B5Qt9EMX.js";const y="/images/coins/transparent",b=[{id:"tesla-gold",file:"tesla gold",title:"Nikola Tesla",subtitle:"20 Euro Cent · 2023",description:"Official Croatian 20 euro cent for eurozone circulation. Tesla's portrait emerges from electromagnetic waves across the national checkerboard — identity and invention fused in 40mm of engraved steel."},{id:"tesla-silver",file:"tesla sliver",title:"Nikola Tesla",subtitle:"50 Euro Cent · 2023",description:"The fifty-cent variant renders the same sculptural portrait in silver-toned alloy. Identical composition, distinct material — each denomination reads the die differently."},{id:"dalmatiner",file:"dalmatiner",title:"Dalmatian",subtitle:"1 Euro · Croatia 2023",description:"Croatia's one-euro coin presents the Dalmatian — a breed born on the Adriatic coast. High-relief engraving captures the muscular stance against the national checkerboard."},{id:"tomislav-2eur",file:"kralj tomislav 2 eur",title:"King Tomislav",subtitle:"2 Euro · Croatia 2023",description:"The two-euro denomination bears King Tomislav, first Croatian sovereign (925 AD). His regalia is rendered in exacting relief, twelve European stars forming the outer ring."},{id:"cent",file:"cent",title:"Euro Cent",subtitle:"1 Cent · Hrvatska 2023",description:"The national monogram HR rises from the Croatian checkerboard, encircled by European stars. Precision at the smallest scale — even the one-cent die demands perfection."},{id:"tomislav",file:"kralj tomislav",title:"King Tomislav",subtitle:"Commemorative Medal",description:"A commemorative portrait medal of Croatia's founding king. Deeper relief than circulation coinage allows — the engraver's art freed from mechanical constraints."},{id:"kravata",file:"kravata",title:"The Cravat",subtitle:"Cultural Heritage Medal",description:"Celebrating Croatia's gift to world fashion — the necktie. Hand-engraved detailing renders the textile knot in metal, a paradox of softness in steel."},{id:"kuna",file:"kuna",title:"Kuna",subtitle:"Croatian Currency · Pre-Euro",description:"The pine marten (kuna), namesake of Croatia's pre-Euro currency. This die captures the animal mid-stride — each strand of fur individually engraved."},{id:"hrvatska",file:"hrvatska",title:"Republika Hrvatska",subtitle:"Kuna Series · Reverse",description:"The reverse face of the Croatian kuna series, displaying the national coat of arms with the five historical shields of the Croatian lands."},{id:"petrovic",file:"drazen petrovic",title:"Dražen Petrović",subtitle:"Memorial Medal",description:"A memorial medal honoring Croatia's greatest basketball player. The portrait captures Petrović's fierce determination — intensity translated from hardwood to hardened steel."},{id:"fasizam",file:"fasizam",title:"Anti-Fascism",subtitle:"Commemorative Medal",description:"A commemorative medal marking Croatia's anti-fascist resistance. The composition balances historical gravity with sculptural restraint."},{id:"fakultet",file:"fakultet",title:"Faculty Medal",subtitle:"Academic Distinction",description:"An academic medal commissioned for institutional merit. Classical allegorical composition rendered through contemporary engraving technique."},{id:"30-hkn",file:"30 obljetnca",title:"30th Anniversary",subtitle:"Croatian National Bank",description:"Marking three decades of the Croatian National Bank. The commemorative medal traces the institution's journey from independence to eurozone membership."},{id:"guster",file:"guster 2",title:"Gušterica",subtitle:"Commemorative Coin",description:"The Adriatic wall lizard — a symbol of Mediterranean Croatia — captured in mid-motion. Microscopic scale detail reveals each ridge along the reptile's spine."},{id:"visnjan",file:"visnjan",title:"Višnjan Observatory",subtitle:"Science & Discovery",description:"Commemorating the Višnjan Science and Education Centre, known for asteroid discoveries. Celestial motifs orbit the observatory's dome in intricate low-relief."},{id:"visnjanj",file:"visnjanj",title:"Višnjan Observatory",subtitle:"Reverse · Asteroid Map",description:"The reverse face maps the asteroid trajectories discovered from Višnjan. Scientific precision meets the engraver's hand — data rendered as art."}];function k(){return`
        <main class="coins-lab">
            ${w()}
            ${x()}
            ${M()}
        </main>
    `}function w(){return`
        <section class="coins-lab__hero">
            <div class="coins-lab__watermark" aria-hidden="true">NUMISMATICA</div>
            <span class="coins-lab__eyebrow" data-reveal>The Collection</span>
            <h1 class="coins-lab__title" data-reveal>Coins & Medals</h1>
            <div class="coins-lab__divider" data-reveal></div>
            <p class="coins-lab__intro" data-reveal>Hand-engraved dies for the Croatian National Bank, European Central Bank, and commemorative commissions. Each coin carries the sculptor's fingerprint — precision at 40 mm.</p>
        </section>
    `}function x(){return`
        <section class="coins-lab__grid-section">
            <header class="coins-lab__grid-header" data-reveal>
                <span class="coins-lab__grid-label">The Works</span>
                <h2 class="coins-lab__grid-heading">Collector's Vitrine</h2>
                <div class="coins-lab__grid-divider"></div>
            </header>
            <div class="coins-lab__grid">
                ${b.map((e,t)=>E(e,t)).join("")}
            </div>
        </section>
    `}function E(e,t){const i=`${y}/${e.file}.png`;return`
        <article class="coin-card" data-index="${t}" data-reveal data-reveal-delay="${Math.min(t,7)}">
            <div class="coin-card__vitrine">
                <img class="coin-card__coin"
                    src="${i}"
                    alt="${e.title}"
                    loading="lazy"
                    draggable="false" />
                <div class="coin-card__shine"></div>
                <div class="coin-card__specular"></div>
            </div>
            <div class="coin-card__info">
                <span class="coin-card__subtitle">${e.subtitle}</span>
                <h3 class="coin-card__title">${e.title}</h3>
            </div>
        </article>
    `}function M(){return`
        <div class="coin-panel" id="coin-panel">
            <div class="coin-panel__backdrop"></div>
            <aside class="coin-panel__sheet">
                <button class="coin-panel__close" aria-label="Close panel">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="1.5">
                        <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                </button>
                <div class="coin-panel__vitrine" id="panel-vitrine">
                    <img class="coin-panel__coin" id="panel-coin-img" src="" alt="" draggable="false" />
                    <div class="coin-panel__shine"></div>
                    <div class="coin-panel__specular"></div>
                </div>
                <div class="coin-panel__hint">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="1.5" opacity="0.5">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4M12 8h.01"/>
                    </svg>
                    Move cursor to shift light
                </div>
                <div class="coin-panel__body">
                    <span class="coin-panel__eyebrow" id="panel-eyebrow"></span>
                    <h3 class="coin-panel__title" id="panel-title"></h3>
                    <div class="coin-panel__panel-divider"></div>
                    <p class="coin-panel__description" id="panel-description"></p>
                </div>
            </aside>
        </div>
    `}let p=null;function S(e){T(e),$(e),q(e),P(e)}function T(e){if(!window.matchMedia("(hover: hover)").matches)return;e.querySelectorAll(".coin-card").forEach(i=>{const n=i.querySelector(".coin-card__vitrine"),a=i.querySelector(".coin-card__coin");i.addEventListener("mousemove",s=>{const r=i.getBoundingClientRect(),o=(s.clientX-r.left)/r.width,l=(s.clientY-r.top)/r.height,c=(o-.5)*6,u=(.5-l)*4;if(i.style.transform=`perspective(800px) rotateX(${u}deg) rotateY(${c}deg) translateY(-6px)`,a){const h=(o-.5)*22,f=(.5-l)*18;a.style.transform=`perspective(400px) rotateX(${f}deg) rotateY(${h}deg) scale(1.06)`}const d=n.getBoundingClientRect(),v=(s.clientX-d.left)/d.width*100,m=(s.clientY-d.top)/d.height*100;n.style.setProperty("--shine-x",`${v}%`),n.style.setProperty("--shine-y",`${m}%`)}),i.addEventListener("mouseleave",()=>{i.style.transform="",a&&(a.style.transform=""),n.style.removeProperty("--shine-x"),n.style.removeProperty("--shine-y")})})}function $(e){e.querySelectorAll(".coin-card").forEach(i=>{i.addEventListener("click",()=>{const n=parseInt(i.dataset.index,10);A(e,b[n],i)})})}function q(e){const t=e.querySelector("#coin-panel");if(!t)return;const i=t.querySelector(".coin-panel__backdrop"),n=t.querySelector(".coin-panel__close"),a=t.querySelector("#panel-vitrine"),s=t.querySelector("#panel-coin-img"),r=t.querySelector(".coin-panel__sheet");a&&s&&window.matchMedia("(hover: hover)").matches&&(r.addEventListener("mousemove",l=>{const c=a.getBoundingClientRect(),u=(l.clientX-c.left)/c.width,d=(l.clientY-c.top)/c.height,v=Math.max(-.5,Math.min(1.5,u)),m=Math.max(-.5,Math.min(1.5,d)),h=(v-.5)*22,f=(.5-m)*18;s.style.transform=`perspective(400px) rotateX(${f}deg) rotateY(${h}deg) scale(1.06)`;const _=v*100,C=m*100;a.style.setProperty("--shine-x",`${_}%`),a.style.setProperty("--shine-y",`${C}%`)}),r.addEventListener("mouseleave",()=>{s.style.transform="",a.style.removeProperty("--shine-x"),a.style.removeProperty("--shine-y")}));const o=()=>L(e);n&&n.addEventListener("click",o),i&&i.addEventListener("click",o),document.addEventListener("keydown",l=>{l.key==="Escape"&&t.classList.contains("is-open")&&o()})}async function A(e,t,i){const n=e.querySelector("#coin-panel"),a=e.querySelector("#panel-eyebrow"),s=e.querySelector("#panel-title"),r=e.querySelector("#panel-description"),o=e.querySelector("#panel-coin-img");a&&(a.textContent=t.subtitle),s&&(s.textContent=t.title),r&&(r.textContent=t.description),o&&(o.src=`${y}/${t.file}.png`,o.alt=t.title),p&&p.classList.remove("is-active"),i.classList.add("is-active"),p=i,n.classList.add("is-open"),document.body.style.overflow="hidden"}function L(e){e.querySelector("#coin-panel").classList.remove("is-open"),document.body.style.overflow="",p&&(p.classList.remove("is-active"),p=null)}function P(e){const t=e.querySelectorAll("[data-reveal]"),i=new IntersectionObserver(n=>{n.forEach(a=>{if(a.isIntersecting){const s=parseInt(a.target.dataset.revealDelay||"0",10);setTimeout(()=>{a.target.classList.add("is-revealed")},s*100),i.unobserve(a.target)}})},{threshold:.12,rootMargin:"0px 0px -30px 0px"});t.forEach(n=>i.observe(n))}function g(){const e=document.getElementById("coins-lab-root");e&&(e.innerHTML=k(),requestAnimationFrame(()=>{S(e)}))}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",g):g();
