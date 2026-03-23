import"./modulepreload-polyfill-B5Qt9EMX.js";import{C as I,l as V,s as X,a as B,b as W,c as q,d as j,u as J,e as K,f as Q,g as Z,h as tt,i as et,S as Y,j as st}from"./post-effects-DHmdyqt6.js";import{s as l}from"./state-DFY6wBk_.js";import{A as at,F as nt,R as ot}from"./playcanvas-SM2qEX5e.js";function rt(){const t=document.createElement("div");t.id="text-overlay",t.style.cssText=`
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 50;
    `,document.body.appendChild(t);const r=document.createElement("div");r.id="splat-progress-track",r.style.cssText=`
        position: fixed;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        width: 300px;
        height: 1px;
        background: rgba(201, 167, 122, 0.2);
        z-index: 50;
        display: flex;
        align-items: center;
    `;const c=document.createElement("div");c.id="splat-progress-fill",c.style.cssText=`
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        background: #c9a77a;
        width: 0%;
        box-shadow: 0 0 10px rgba(201, 167, 122, 0.5);
    `;const s=document.createElement("div");s.id="splat-progress-text",s.style.cssText=`
        position: absolute;
        right: -50px;
        font-family: 'Inter', -apple-system, sans-serif;
        font-size: 0.65rem;
        letter-spacing: 0.2em;
        color: rgba(201, 167, 122, 0.8);
    `,s.textContent=`01 / 0${I.splats.length}`,r.appendChild(c),r.appendChild(s),document.body.appendChild(r),I.splats.forEach((i,o)=>{const a=document.createElement("div");a.className="artwork-info",a.dataset.index=o,a.style.cssText=`
    position: absolute;
    left: 8vw;
    top: 50%;
    transform: translateY(-50%) translateX(-30px);
    opacity: 0;
    transition: opacity 0.4s ease, transform 0.4s ease;
    `,a.innerHTML=`
        <span style="
    display: block;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(0.875rem, 1.5vw, 1rem);
    font-weight: 300;
    color: #c9a77a;
    letter-spacing: 0.3em;
    margin-bottom: 1rem;
    text-transform: uppercase;
    ">${i.number}</span>
        <h2 style="
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(3rem, 8vw, 6rem);
    font-weight: 300;
    color: #f0ebe3;
    letter-spacing: 0.02em;
    line-height: 1.1;
    margin: 0 0 0.5rem 0;
    text-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
    ">${i.title}</h2>
        <p style="
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: clamp(0.875rem, 1.5vw, 1.125rem);
    font-weight: 300;
    color: #6b6b7a;
    letter-spacing: 0.1em;
    margin: 0;
    ">${i.subtitle}</p>
        `,t.appendChild(a)});const e=document.createElement("link");e.href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Inter:wght@300&display=swap",e.rel="stylesheet",document.head.appendChild(e),setTimeout(()=>{const i=t.querySelector('[data-index="0"]');if(i){i.style.opacity="1",i.style.transform="translateY(-50%) translateX(0)";const o=i.querySelector("h2");o&&(o.style.transition="text-shadow 0.8s ease-out, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)",o.style.textShadow="0 0 40px rgba(201, 167, 122, 0.8), 0 4px 30px rgba(0, 0, 0, 0.5)",o.style.transform="scale(1.02)",setTimeout(()=>{o.style.textShadow="0 4px 30px rgba(0, 0, 0, 0.5)",o.style.transform="scale(1)"},800))}},1e3),l.textOverlay=t}function it(t,r){if(!l.textOverlay)return;const c=l.textOverlay.querySelectorAll(".artwork-info"),s=document.getElementById("splat-progress-fill"),e=document.getElementById("splat-progress-text"),i=I.splats.length;if(s&&e){const o=(t+r)/(i-1);s.style.width=`${Math.max(0,Math.min(100,o*100))}%`;const a=r>.5?t+1:t;e.textContent=`0${a+1} / 0${i}`}c.forEach((o,a)=>{let p=0,g=-30;const h=o.querySelector("h2");a===t?r<.4?(p=1,g=0):(p=1-(r-.4)/.6,g=-(r-.4)*50):a===t+1?r>.5?(p=(r-.5)/.5,g=(1-p)*-30,r>.95&&r<.98&&h&&!o.dataset.pulsed&&(o.dataset.pulsed="true",h.style.transition="text-shadow 0.6s ease-out, transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)",h.style.textShadow="0 0 40px rgba(201, 167, 122, 0.8), 0 4px 30px rgba(0, 0, 0, 0.5)",h.style.transform="scale(1.02)",setTimeout(()=>{h.style.textShadow="0 4px 30px rgba(0, 0, 0, 0.5)",h.style.transform="scale(1)"},600))):o.dataset.pulsed="":(o.dataset.pulsed="",h&&(h.style.textShadow="0 4px 30px rgba(0, 0, 0, 0.5)",h.style.transform="scale(1)",h.style.transition="none")),o.style.opacity=Math.max(0,Math.min(1,p)),o.style.transform=`translateY(-50%) translateX(${g}px)`})}let f=null,n=null;const E={TENSION:.15,DAMPING:.85,POINTS_PER_SEGMENT:8},m={LINE_WIDTH:2,NODE_RADIUS:4,ACTIVE_RADIUS:8,COLOR_LINE:"rgba(201, 167, 122, 0.4)",COLOR_ACTIVE:"rgba(201, 167, 122, 1.0)",COLOR_GLOW:"rgba(201, 167, 122, 0.15)",MARGIN_RIGHT:60,MARGIN_VERTICAL:.25,TITLE_OFFSET:25};let S=[],v=[],x={y:0,vy:0},C=[];const lt=30;let T={x:-1e3,y:-1e3};const ct=60;function dt(){f=document.createElement("canvas"),f.id="fluid-nav-canvas";const t=l.scrollProgress>1.3?0:1;f.style.cssText=`
        position: fixed;
        top: 0;
        right: 0;
        width: 200px;
        height: 100%;
        pointer-events: ${t>0?"auto":"none"};
        cursor: pointer;
        z-index: 100;
        opacity: ${t};
        transition: opacity 0.4s ease-out;
    `,document.body.appendChild(f),n=f.getContext("2d"),f.addEventListener("click",pt),f.addEventListener("mousemove",gt),z(),window.addEventListener("resize",z),$(),console.log("🌊 Fluid navigation initialized")}function z(){const t=window.devicePixelRatio||1;f.width=200*t,f.height=window.innerHeight*t,n.scale(t,t),f.style.width="200px",f.style.height="100%",$()}function $(){var o;const t=I.splats.length,r=window.innerHeight,c=r*m.MARGIN_VERTICAL,s=r*m.MARGIN_VERTICAL,e=r-c-s,i=200-m.MARGIN_RIGHT;S=[],v=[];for(let a=0;a<t;a++){const p=t>1?a/(t-1):.5,g=c+p*e;v.push({x:i,y:g,baseX:i,baseY:g,splat:I.splats[a],hoverIntensity:0})}for(let a=0;a<t-1;a++){const p=v[a],g=v[a+1];for(let h=0;h<=E.POINTS_PER_SEGMENT;h++){const y=h/E.POINTS_PER_SEGMENT,u=p.baseY+y*(g.baseY-p.baseY);S.push({x:i,y:u,vx:0,vy:0,baseX:i,baseY:u,segment:a,t:y})}}x.y=((o=v[0])==null?void 0:o.y)||c,x.vy=0}function pt(t){var i,o;const r=f.getBoundingClientRect(),c=t.clientX-r.left,s=t.clientY-r.top,e=20;for(let a=0;a<v.length;a++){const p=v[a],g=c-p.x,h=s-p.y;if(Math.sqrt(g*g+h*h)<e){const u=I.splats.length,d=u>1?a/(u-1):0;l.targetScrollProgress=d,l.isScrolling=!0,l.lastScrollTime=Date.now(),F(a,2,1),console.log(`🎯 Navigating to: ${((i=p.splat)==null?void 0:i.title)||((o=p.splat)==null?void 0:o.name)}`);break}}}function gt(t){const r=f.getBoundingClientRect();T.x=t.clientX-r.left,T.y=t.clientY-r.top;const c=20;let s=!1;for(let e=0;e<v.length;e++){const i=v[e],o=T.x-i.x,a=T.y-i.y;if(Math.sqrt(o*o+a*a)<c){s=!0;break}}f.style.cursor=s?"pointer":"default"}function F(t,r=1,c=1){const s=v[t];if(!s)return;const e=Math.floor(6*r);for(let i=0;i<e&&C.length<lt;i++){const o=c*(1.5+Math.random()*1.5);C.push({x:s.x+(Math.random()-.5)*15,y:s.y+c*5,vx:(Math.random()-.5)*2.5-.5,vy:o,life:1,decay:.015+Math.random()*.015,size:1.5+Math.random()*2})}}function ht(t){if(!n||!f)return;const r=l.scrollProgress,c=l.targetScrollProgress,s=l.isScrolling;let e=1;if(r>1.3?e=0:r>1&&(e=1-(r-1)/.15,e=Math.max(0,Math.min(1,e))),f.style.opacity=e,f.style.pointerEvents=e>.1?"auto":"none",e<=.01)return;const i=window.innerHeight,o=i*m.MARGIN_VERTICAL,a=i-2*o,p=o+r*a,g=s?.12:.08,h=.8;x.vy+=(p-x.y)*g,x.vy*=h,x.y+=x.vy,v.forEach((d,O)=>{const P=Math.abs(x.y-d.y),D=d._wasTouching||!1,A=P<12;if(A&&!D){const G=x.vy>0?1:-1;F(O,1.5,G)}d._wasTouching=A;const R=T.x-d.x,L=T.y-d.y,N=Math.sqrt(R*R+L*L),k=10,H=ct;let _=0;if(N<H){const G=N/H;_=1-Math.log(1+G*k)/Math.log(1+k),_=Math.max(0,_)}const U=.15;d.hoverIntensity+=(_-d.hoverIntensity)*U});const y=c-r,u=y*30;if(S.forEach((d,O)=>{let P=d.baseX,D=d.baseY;const A=Math.abs(d.baseY-x.y),R=Math.exp(-A*.01);P+=u*R;const L=(d.baseY-x.y)*.05+l.time*3,N=Math.sin(L)*3*R*Math.abs(y)*10;P+=N,d.vx+=(P-d.x)*E.TENSION,d.vy+=(D-d.y)*E.TENSION,d.vx*=E.DAMPING,d.vy*=E.DAMPING,d.x+=d.vx,d.y+=d.vy}),C=C.filter(d=>(d.x+=d.vx,d.y+=d.vy,d.vy-=.02,d.life-=d.decay,d.life>0)),Math.random()<.05){const d=S[Math.floor(Math.random()*S.length)];d&&C.push({x:d.x+(Math.random()-.5)*10,y:d.y,vx:(Math.random()-.5)*.5,vy:-.5-Math.random()*.5,life:.5+Math.random()*.5,decay:.015,size:1+Math.random()})}mt(r,s,e)}function mt(t,r,c){if(n.clearRect(0,0,200,window.innerHeight),c<=.01)return;n.save(),n.globalAlpha=c;const s=I.splats.length;if(ft(),n.beginPath(),n.strokeStyle=m.COLOR_LINE,n.lineWidth=m.LINE_WIDTH,n.lineCap="round",n.lineJoin="round",S.length>0){n.moveTo(S[0].x,S[0].y);for(let e=0;e<S.length-1;e++){const i=S[Math.max(e-1,0)],o=S[e],a=S[e+1],p=S[Math.min(e+2,S.length-1)],g=o.x+(a.x-i.x)/6,h=o.y+(a.y-i.y)/6,y=a.x-(p.x-o.x)/6,u=a.y-(p.y-o.y)/6;n.bezierCurveTo(g,h,y,u,a.x,a.y)}}n.stroke(),v.forEach((e,i)=>{const o=Math.abs(i-t*(s-1))<.5,a=e.hoverIntensity;if(a>.01&&!o){const y=m.NODE_RADIUS*(3+a*2),u=n.createRadialGradient(e.x,e.y,0,e.x,e.y,y);u.addColorStop(0,`rgba(201, 167, 122, ${.35*a})`),u.addColorStop(.5,`rgba(201, 167, 122, ${.12*a})`),u.addColorStop(1,"rgba(201, 167, 122, 0)"),n.fillStyle=u,n.beginPath(),n.arc(e.x,e.y,y,0,Math.PI*2),n.fill()}const p=a*2,g=o?m.NODE_RADIUS+2:m.NODE_RADIUS+p;if(n.beginPath(),n.arc(e.x,e.y,g,0,Math.PI*2),o)n.fillStyle=m.COLOR_ACTIVE;else{const y=Math.round(201*(.6+.4*a)),u=Math.round(167*(.6+.4*a)),d=Math.round(122*(.6+.4*a)),O=.6+.4*a;n.fillStyle=`rgba(${y}, ${u}, ${d}, ${O})`}if(n.fill(),(o||a>.2)&&e.splat){const y=o?1-Math.abs(i-t*(s-1))*2:a*.9;n.save(),n.font="11px Inter, system-ui, sans-serif",n.fillStyle=`rgba(201, 167, 122, ${Math.max(0,y)})`,n.textAlign="right",n.textBaseline="middle",n.fillText(e.splat.title||e.splat.name,e.x-m.TITLE_OFFSET,e.y),n.restore()}}),ut(),yt(),n.restore()}function ft(){const t=n.createRadialGradient(200-m.MARGIN_RIGHT,x.y,0,200-m.MARGIN_RIGHT,x.y,60);t.addColorStop(0,m.COLOR_GLOW),t.addColorStop(1,"rgba(201, 167, 122, 0)"),n.fillStyle=t,n.fillRect(0,0,200,window.innerHeight)}function ut(t,r){const c=200-m.MARGIN_RIGHT,s=x.y,e=Math.abs(x.vy)*.3,i=m.ACTIVE_RADIUS+e*.5,o=m.ACTIVE_RADIUS+e,p=1+(Math.sin(l.time*3)*.5+.5)*.15;n.save(),n.translate(c,s);const g=n.createRadialGradient(0,0,0,0,0,m.ACTIVE_RADIUS*2.5);g.addColorStop(0,"rgba(201, 167, 122, 0.4)"),g.addColorStop(.5,"rgba(201, 167, 122, 0.1)"),g.addColorStop(1,"rgba(201, 167, 122, 0)"),n.fillStyle=g,n.beginPath(),n.ellipse(0,0,m.ACTIVE_RADIUS*2.5,m.ACTIVE_RADIUS*3,0,0,Math.PI*2),n.fill(),n.beginPath(),n.ellipse(0,0,i*p,o*p,0,0,Math.PI*2),n.fillStyle=m.COLOR_ACTIVE,n.fill(),n.beginPath(),n.ellipse(-i*.2,-o*.3,i*.4,o*.3,0,0,Math.PI*2),n.fillStyle="rgba(255, 255, 255, 0.3)",n.fill(),n.restore()}function yt(){C.forEach(t=>{n.beginPath(),n.arc(t.x,t.y,t.size,0,Math.PI*2),n.fillStyle=`rgba(201, 167, 122, ${t.life*.8})`,n.fill()})}let b=null,w=null,M=null;function xt(){b=document.createElement("div"),b.id="interaction-hint",b.style.cssText=`
        position: fixed;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        pointer-events: none;
        z-index: 50;
        opacity: 0;
        transition: opacity 0.5s ease;
    `,M=document.createElement("span"),M.textContent="THE COLLECTION",M.style.cssText=`
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
        font-weight: 500;
        letter-spacing: 0.3em;
        color: #c9a77a;
        text-transform: uppercase;
        text-shadow: 0 0 20px rgba(201, 167, 122, 0.6),
                     0 0 40px rgba(201, 167, 122, 0.4);
        transform: translateY(0);
        transition: transform 0.1s linear;
    `,w=document.createElement("div"),w.style.cssText=`
        width: 1px;
        height: 60px;
        background: linear-gradient(to bottom, rgba(201, 167, 122, 0) 0%, rgba(201, 167, 122, 0.8) 50%, rgba(201, 167, 122, 0) 100%);
        transform-origin: top;
        transition: height 0.1s ease-out, opacity 0.1s linear;
    `,b.appendChild(M),b.appendChild(w),document.body.appendChild(b),console.log("✨ Interaction hint initialized")}function St(t){if(!b)return;const r=.85,c=1.15;let s=0;if(t<r?s=0:t<=1?s=(t-r)/(1-r):t<1.1?s=1:s=1-(t-1.1)/(c-1.1),s=Math.max(0,Math.min(1,s)),b.style.opacity=s,t>1){const e=t-1,i=e*400;w.style.height=`${60+i}px`,M.style.transform=`translateY(${e*50}px)`,w.style.background=`linear-gradient(to bottom, 
            rgba(201, 167, 122, 0) 0%, 
            rgba(201, 167, 122, ${.8+e*2}) 50%, 
            rgba(201, 167, 122, 0) 100%)`}else w.style.height="60px",M.style.transform="translateY(0)",w.style.background="linear-gradient(to bottom, rgba(201, 167, 122, 0) 0%, rgba(201, 167, 122, 0.8) 50%, rgba(201, 167, 122, 0) 100%)"}async function vt(){console.log("🎨 Initializing Splat Hero Experience...");const t=document.getElementById("canvas-container"),r=document.createElement("canvas");t.appendChild(r),l.app=new at(r,{graphicsDeviceOptions:{antialias:!1,alpha:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"}});const c=l.app;c.setCanvasFillMode(nt),c.setCanvasResolution(ot),c.start(),window.addEventListener("resize",()=>c.resizeCanvas()),window.addEventListener("mousemove",s=>{l.mouse.x=s.clientX/window.innerWidth*2-1,l.mouse.y=s.clientY/window.innerHeight*2-1}),await V(),X(),B(),W(),rt(),dt(),xt(),It(),wt(),setTimeout(()=>{q(),j()},500),setTimeout(()=>{document.getElementById("loading-screen").classList.add("loaded")},800),console.log("✅ Splat Hero Experience initialized!")}function It(){const t=document.getElementById("scroll-hint"),r=I.splats.length;window.addEventListener("wheel",s=>{s.preventDefault(),l.lastScrollTime=performance.now(),l.isScrolling=!0,l.targetScrollProgress=Math.max(0,Math.min(1,l.targetScrollProgress+s.deltaY*8e-4)),l.targetScrollProgress>.05?t==null||t.classList.add("hidden"):t==null||t.classList.remove("hidden")},{passive:!1});let c=0;window.addEventListener("touchstart",s=>{c=s.touches[0].clientY,l.lastScrollTime=performance.now(),l.isScrolling=!0},{passive:!0}),window.addEventListener("touchmove",s=>{const e=(c-s.touches[0].clientY)*.003;c=s.touches[0].clientY,l.targetScrollProgress=Math.max(0,Math.min(1,l.targetScrollProgress+e)),l.lastScrollTime=performance.now()},{passive:!0}),window.addEventListener("keydown",s=>{if(s.key==="ArrowDown"||s.key===" "){const e=Math.min(l.currentSplatIndex+1,r-1);l.targetScrollProgress=e/(r-1),s.preventDefault()}else if(s.key==="ArrowUp"){const e=Math.max(l.currentSplatIndex-1,0);l.targetScrollProgress=e/(r-1),s.preventDefault()}})}function bt(){if(performance.now()-l.lastScrollTime<Y.IDLE_TIMEOUT){l.isScrolling=!0;return}l.isScrolling=!1;const c=I.splats.length,s=l.targetScrollProgress*(c-1),e=Math.floor(s),i=s-e;let o;i<Y.SNAP_THRESHOLD?o=e:i>1-Y.SNAP_THRESHOLD?o=Math.min(e+1,c-1):o=i<.5?e:Math.min(e+1,c-1);const a=o/(c-1);l.targetScrollProgress+=(a-l.targetScrollProgress)*.05}function wt(){const t=l.app,c=t.graphicsDevice.scope.resolve("uTime");t.on("update",s=>{l.time+=s,c.setValue(l.time),bt();const e=l.isScrolling?12:6;l.scrollProgress+=(l.targetScrollProgress-l.scrollProgress)*Math.min(1,s*e);const i=I.splats.length,a=Math.min(1,l.scrollProgress)*(i-1),p=Math.floor(Math.min(a,i-1.001)),g=a-p;J(p,g,s),K(s),Q(s),Z(s);const h=st();tt(h),et(),it(p,g),ht(),St(l.scrollProgress),l.currentSplatIndex=p})}window.addEventListener("error",t=>console.error("Error:",t.error));vt().catch(console.error);
