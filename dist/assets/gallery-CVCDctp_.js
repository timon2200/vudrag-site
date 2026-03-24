import"./modulepreload-polyfill-B5Qt9EMX.js";import"./config-CNh1hCsG.js";/* empty css                  *//* empty css                          *//* empty css                        */import{A as yt,T as wt,M as vt,p as bt,F as Et,R as Tt,E as D,C as R,a as xt,b as j,c as Pt,d as Lt,P as Mt,Q as It,S as St,V as E,e as Ct,f as _t,g as A,m as C,h as At,i as Dt,j as Ot,k as $t,l as kt,n as Ht,o as Ft,q as Rt,r as q,s as K,t as Q}from"./playcanvas-SM2qEX5e.js";const F={galleries:[{id:"showcase",name:"Featured Sculptures",environment:"environments/rotunda",sculptures:[{id:"aniche",file:"splats/gs_aniche.sog",title:"Aniche",artist:"Nikola Vudrag",year:"2024",position:[-.01,-.3,.02],scale:[.38,.38,.38],rotation:[180,45,0],description:"A delicate exploration of form and void, capturing the ethereal nature of memory.",material:"Bronze & Steel",origin:"Zagreb Studio"},{id:"apheodita",file:"splats/gs_apheodita.sog",title:"Apheodita",artist:"Nikola Vudrag",year:"2024",position:[0,-.31,-.1],scale:[.36,.36,.36],rotation:[180,269,0],description:"Mythological reimagining through industrial mediums, blending classical beauty with raw materiality.",material:"Polished Bronze",origin:"Varaždin Workshop"},{id:"franjo",file:"splats/gs_franjo.sog",title:"Franjo",artist:"Nikola Vudrag",year:"2024",position:[0,-.3,-.02],scale:[.4,.4,.4],rotation:[180,271,0],description:"A powerful bust capturing the stoic resilience of the human spirit.",material:"Iron & Patina",origin:"Private Collection"},{id:"ivo",file:"splats/gs_ivo.sog",title:"Ivo",artist:"Nikola Vudrag",year:"2024",position:[0,-.3,0],scale:[.32,.32,.32],rotation:[180,90,0],description:"Modernist interpretation of identity, fragmented yet cohesive.",material:"Welded Steel",origin:"Artist Archive"}]}]};let g=null,_=null;const v={posX:0,posY:-1,posZ:0,rotX:0,rotY:0,rotZ:0,scale:1.84};function Vt(i){if(!i){console.warn("No pedestal entity provided to transform panel");return}_=i,g=document.createElement("div"),g.id="pedestal-transform-panel",g.style.cssText=`
        position: fixed;
        top: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.92);
        border: 1px solid rgba(201, 167, 122, 0.4);
        border-radius: 8px;
        padding: 16px;
        z-index: 1000;
        font-family: 'Inter', -apple-system, sans-serif;
        font-size: 11px;
        color: #f0ebe3;
        min-width: 260px;
        max-height: 85vh;
        overflow-y: auto;
        overscroll-behavior: contain;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        display: none;
    `;function e(o,u,d,y,w,I){return`
            <div style="margin-bottom: 8px;">
                <label style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                    <span>${o}</span>
                    <span id="pt-${u}-val">${I.toFixed(2)}</span>
                </label>
                <input type="range" id="pt-${u}" min="${d}" max="${y}" step="${w}" value="${I}" style="width: 100%;">
            </div>
        `}g.innerHTML=`
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(201, 167, 122, 0.3); padding-bottom: 8px;">
            <span style="font-weight: 600; color: #c9a77a; letter-spacing: 0.1em;">PEDESTAL</span>
            <span style="color: #6b6b7a; font-size: 10px;">Press P to toggle</span>
        </div>

        <!-- POSITION -->
        <div style="margin-bottom: 8px; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 4px;">
            <div style="color: #c9a77a; font-size: 10px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.1em;">Position</div>
            ${e("X","posX",-5,5,.01,v.posX)}
            ${e("Y","posY",-5,5,.01,v.posY)}
            ${e("Z","posZ",-5,5,.01,v.posZ)}
        </div>

        <!-- ROTATION -->
        <div style="margin-bottom: 8px; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 4px;">
            <div style="color: #c9a77a; font-size: 10px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.1em;">Rotation</div>
            ${e("X","rotX",-180,180,1,v.rotX)}
            ${e("Y","rotY",-180,180,1,v.rotY)}
            ${e("Z","rotZ",-180,180,1,v.rotZ)}
        </div>

        <!-- SCALE -->
        <div style="margin-bottom: 8px; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 4px;">
            <div style="color: #c9a77a; font-size: 10px; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.1em;">Scale</div>
            ${e("Uniform","scale",.01,10,.01,v.scale)}
        </div>

        <!-- BUTTONS -->
        <div style="display: flex; gap: 8px; margin-top: 12px;">
            <button id="pt-reset" style="flex: 1; padding: 8px; background: rgba(100, 100, 100, 0.2); border: 1px solid rgba(100, 100, 100, 0.4); border-radius: 4px; color: #888; cursor: pointer; font-size: 11px;">
                Reset
            </button>
            <button id="pt-log-values" style="flex: 1; padding: 8px; background: rgba(201, 167, 122, 0.2); border: 1px solid rgba(201, 167, 122, 0.4); border-radius: 4px; color: #c9a77a; cursor: pointer; font-size: 11px;">
                Log Values
            </button>
        </div>
    `,document.body.appendChild(g);const t={...v},n=["posX","posY","posZ","rotX","rotY","rotZ","scale"];function s(){_&&(_.setPosition(t.posX,t.posY,t.posZ),_.setEulerAngles(t.rotX,t.rotY,t.rotZ),_.setLocalScale(t.scale,t.scale,t.scale))}function r(){n.forEach(o=>{const u=document.getElementById(`pt-${o}`),d=document.getElementById(`pt-${o}-val`);u&&(u.value=t[o],d&&(d.textContent=Number(t[o]).toFixed(2)))})}n.forEach(o=>{const u=document.getElementById(`pt-${o}`),d=document.getElementById(`pt-${o}-val`);u&&u.addEventListener("input",y=>{const w=parseFloat(y.target.value);t[o]=w,d&&(d.textContent=w.toFixed(2)),s()})}),document.getElementById("pt-reset").addEventListener("click",()=>{Object.assign(t,v),r(),s()}),document.getElementById("pt-log-values").addEventListener("click",()=>{const o=`[${t.posX}, ${t.posY}, ${t.posZ}]`,u=`[${t.rotX}, ${t.rotY}, ${t.rotZ}]`,d=t.scale;console.log(`
🗿 Pedestal Transform:`),console.log(`  position: ${o}`),console.log(`  rotation: ${u}`),console.log(`  scale: ${d}`),console.log(`
// Copy-paste ready:`),console.log(`pedestalEntity.setPosition(${t.posX}, ${t.posY}, ${t.posZ});`),console.log(`pedestalEntity.setEulerAngles(${t.rotX}, ${t.rotY}, ${t.rotZ});`),console.log(`pedestalEntity.setLocalScale(${d}, ${d}, ${d});`)}),window.addEventListener("keydown",o=>{(o.key==="p"||o.key==="P")&&(g.style.display=g.style.display==="none"?"block":"none")}),g.addEventListener("wheel",o=>{o.stopPropagation()},{passive:!0}),g.addEventListener("mousedown",o=>{o.stopPropagation()}),g.addEventListener("mousemove",o=>{o.stopPropagation()}),s(),console.log("🗿 Pedestal transform panel ready (Press P to toggle)")}const Nt=`
uniform float uTime;
uniform float uMode;
uniform float uRevealOffset;

// Ease-in-out function: slow start, fast middle, slow end
float easeInOut(float t) {
    return t < 0.5 
        ? 4.0 * t * t * t 
        : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}

void modifySplatCenter(inout vec3 center) {
    if (uMode < 0.5) {
        // Apply ease-in-out to time for smooth acceleration
        float easedTime = easeInOut(clamp(uTime / 2.5, 0.0, 1.0)) * 2.5;
        
        // Fade in: Reveal from bottom (low Y) to top (high Y)
        float reveal = smoothstep(0.0, 1.0, (easedTime * 2.5) + center.y + uRevealOffset);
        
        // Very subtle position jitter during reveal
        float jitter = (1.0 - reveal) * 0.05;
        float hash = fract(sin(center.x * 12.9898 + center.y * 78.233 + center.z * 45.164) * 43758.5453);
        center += vec3(hash - 0.5, hash * 0.5 - 0.25, fract(hash * 2.0) - 0.5) * jitter;
    }
}

void modifySplatRotationScale(vec3 originalCenter, vec3 modifiedCenter, inout vec4 rotation, inout vec3 scale) {
    if (uMode < 0.5) {
        // Apply ease-in-out to time
        float easedTime = easeInOut(clamp(uTime / 2.5, 0.0, 1.0)) * 2.5;
        
        // Fade in: Scale from bottom to top
        float reveal = smoothstep(0.0, 1.0, (easedTime * 2.5) + originalCenter.y + uRevealOffset);
        scale *= reveal;
    } else {
        // Fade out: shrink from top to bottom
        float fade = smoothstep(0.0, 1.0, abs(originalCenter.y) - (2.0 - uTime * 5.0));
        scale *= (1.0 - fade);
    }
}

void modifySplatColor(vec3 center, inout vec4 color) {
    if (uMode < 0.5) {
        // Apply ease-in-out to time
        float easedTime = easeInOut(clamp(uTime / 2.5, 0.0, 1.0)) * 2.5;
        
        // Fade in: Warm glow during reveal
        float reveal = smoothstep(0.0, 1.0, (easedTime * 2.5) + center.y + uRevealOffset);
        float warmth = 1.0 - reveal;
        
        // Warm glow colors (hot plasma orange-white)
        vec3 warmGlow = vec3(2.5, 1.8, 1.0);
        color.rgb = mix(color.rgb, warmGlow, warmth * warmth * 0.4);
        color.a = mix(color.a, 1.0, warmth * 0.3);
    } else {
        // Fade out with heat effect
        float fade = smoothstep(0.0, 1.0, abs(center.y) - (2.0 - uTime * 5.0));
        float heat = fade;
        vec3 fadeGlow = vec3(8.0, 3.0, 1.0) * heat;
        color.rgb = mix(color.rgb, fadeGlow, heat * 0.5);
        color.a *= (1.0 - fade);
    }
}
`,Yt=2.5,Bt=.5;class zt{constructor(e,t,n={}){this.app=e,this.entity=t,this.config={distanceMax:15,distanceMin:1,pitchAngleMax:85,pitchAngleMin:-85,inertiaFactor:.1,frameOnStart:!1,orbitSensitivity:.3,distanceSensitivity:.15,...n},this._yaw=0,this._pitch=10,this._distance=3,this._targetYaw=0,this._targetPitch=10,this._targetDistance=3,this._pivotPoint=new E(0,0,0),this.lookButtonDown=!1,this.panButtonDown=!1,this.lastPoint=new A,this.lastTouchPoint=new A,this.lastPinchMidPoint=new A,this.lastPinchDistance=0,this.initialize()}get distance(){return this._targetDistance}set distance(e){this._targetDistance=this.clampDistance(e)}get pitch(){return this._targetPitch}set pitch(e){this._targetPitch=this.clampPitchAngle(e)}get yaw(){return this._targetYaw}set yaw(e){this._targetYaw=e;const n=(this._targetYaw-this._yaw)%360;n>180?this._targetYaw=this._yaw-(360-n):n<-180?this._targetYaw=this._yaw+(360+n):this._targetYaw=this._yaw+n}get pivotPoint(){return this._pivotPoint}set pivotPoint(e){this._pivotPoint.copy(e)}update(e){const t=this.config.inertiaFactor===0?1:Math.min(e/this.config.inertiaFactor,1);this._distance=C.lerp(this._distance,this._targetDistance,t),this._yaw=C.lerp(this._yaw,this._targetYaw,t),this._pitch=C.lerp(this._pitch,this._targetPitch,t),this.updatePosition()}initialize(){window.addEventListener("resize",()=>this.checkAspectRatio()),this.checkAspectRatio(),this.setupMouseInput(),this.setupTouchInput(),this.app.on("update",e=>this.update(e))}setupMouseInput(){const e=this.app.mouse;e&&(e.on(At,t=>this.onMouseDown(t)),e.on(Dt,t=>this.onMouseUp(t)),e.on(Ot,t=>this.onMouseMove(t)),e.on($t,t=>this.onMouseWheel(t)),window.addEventListener("mouseout",()=>this.onMouseOut()),e.disableContextMenu())}setupTouchInput(){const e=this.app.touch;e&&(e.on(kt,t=>this.onTouchStartEndCancel(t)),e.on(Ht,t=>this.onTouchStartEndCancel(t)),e.on(Ft,t=>this.onTouchStartEndCancel(t)),e.on(Rt,t=>this.onTouchMove(t)))}updatePosition(){this.entity.setLocalPosition(0,0,0),this.entity.setLocalEulerAngles(this._pitch,this._yaw,0);const e=this.entity.getPosition();e.copy(this.entity.forward),e.mulScalar(-this._distance),e.add(this.pivotPoint),this.entity.setPosition(e)}checkAspectRatio(){const e=this.app.graphicsDevice.height,t=this.app.graphicsDevice.width,n=this.entity.camera;n&&(n.horizontalFov=e>t)}clampDistance(e){return this.config.distanceMax>0?C.clamp(e,this.config.distanceMin,this.config.distanceMax):Math.max(e,this.config.distanceMin)}clampPitchAngle(e){return C.clamp(e,this.config.pitchAngleMin,this.config.pitchAngleMax)}onMouseDown(e){switch(e.button){case Q:this.lookButtonDown=!0;break;case K:case q:this.panButtonDown=!0;break}}onMouseUp(e){switch(e.button){case Q:this.lookButtonDown=!1;break;case K:case q:this.panButtonDown=!1;break}}onMouseMove(e){this.lookButtonDown?(this.pitch-=e.dy*this.config.orbitSensitivity,this.yaw-=e.dx*this.config.orbitSensitivity):this.panButtonDown&&this.pan(e),this.lastPoint.set(e.x,e.y)}onMouseWheel(e){this.distance-=e.wheelDelta*this.config.distanceSensitivity*(this._distance*.1),e.event&&e.event.preventDefault()}onMouseOut(){this.lookButtonDown=!1,this.panButtonDown=!1}pan(e){const t=this.entity.camera;if(!t)return;const n=new E,s=new E,r=new E,o=this._distance;t.screenToWorld(e.x,e.y,o,n),t.screenToWorld(this.lastPoint.x,this.lastPoint.y,o,s),r.sub2(s,n),this._pivotPoint.add(r)}getPinchDistance(e,t){const n=e.x-t.x,s=e.y-t.y;return Math.sqrt(n*n+s*s)}calcMidPoint(e,t,n){n.set(t.x-e.x,t.y-e.y),n.mulScalar(.5),n.x+=e.x,n.y+=e.y}onTouchStartEndCancel(e){const t=e.touches;t.length===1?this.lastTouchPoint.set(t[0].x,t[0].y):t.length===2&&(this.lastPinchDistance=this.getPinchDistance(t[0],t[1]),this.calcMidPoint(t[0],t[1],this.lastPinchMidPoint))}onTouchMove(e){const t=e.touches;if(t.length===1){const n=t[0];window.hideDragHint&&window.hideDragHint(),this.pitch-=(n.y-this.lastTouchPoint.y)*this.config.orbitSensitivity,this.yaw-=(n.x-this.lastTouchPoint.x)*this.config.orbitSensitivity,this.lastTouchPoint.set(n.x,n.y)}else if(t.length===2){window.hideZoomHint&&window.hideZoomHint();const n=this.getPinchDistance(t[0],t[1]),s=n-this.lastPinchDistance;this.lastPinchDistance=n,this.distance-=s*this.config.distanceSensitivity*.1*(this._distance*.1);const r=new A;this.calcMidPoint(t[0],t[1],r),this.touchPan(r),this.lastPinchMidPoint.copy(r)}}touchPan(e){const t=this.entity.camera;if(!t)return;const n=new E,s=new E,r=new E,o=this._distance;t.screenToWorld(e.x,e.y,o,n),t.screenToWorld(this.lastPinchMidPoint.x,this.lastPinchMidPoint.y,o,s),r.sub2(s,n),this._pivotPoint.add(r)}}const Ut=i=>i<=0?0:i>=1?1:Math.sin((i-.5)*Math.PI)*.5+.5;class Xt{constructor(e,t={}){this.orbitCamera=e,this.config={speed:4,pitchSpeed:.25,pitchAmount:1,startDelay:4,startFadeInTime:5,...t},this.pitch=e.pitch,this.yaw=e.yaw,this.timer=0,this.enabled=!0}setEnabled(e){this.enabled=e,e||(this.timer=0)}resetTimer(){this.timer=0,this.pitch=this.orbitCamera.pitch,this.yaw=this.orbitCamera.yaw}update(e){if(!this.enabled)return;const t=this.orbitCamera;if(this.pitch!==t.pitch||this.yaw!==t.yaw?(this.pitch=t.pitch,this.yaw=t.yaw,this.timer=0,this._autoRotateStarted=!1):this.timer+=e,this.timer>this.config.startDelay){const n=this.timer-this.config.startDelay,s=Ut(n/this.config.startFadeInTime);!this._autoRotateStarted&&s>.1&&(this._autoRotateStarted=!0,window.showDragHint&&window.showDragHint()),this.yaw+=e*s*this.config.speed,this.pitch+=Math.sin(n*this.config.pitchSpeed)*e*s*this.config.pitchAmount,t.yaw=this.yaw,t.pitch=this.pitch}}}const l={app:null,camera:null,orbitController:null,autoRotator:null,entities:[],currentIndex:0,activeGallery:null,isTransitioning:!1,pedestalEntity:null},p={time:0,mode:0,isAnimating:!1,startTime:0};let T=null,x=null,J=null;async function Wt(){console.log("🏛️ Initializing Viewing Room...");const i=document.getElementById("application-canvas"),e=new yt(i,{mouse:new vt(i),touch:bt.touch?new wt(i):void 0,graphicsDeviceOptions:{antialias:!0,alpha:!1,powerPreference:"high-performance"}});l.app=e,e.setCanvasFillMode(Et),e.setCanvasResolution(Tt),e.start(),window.addEventListener("resize",()=>e.resizeCanvas()),Zt(e),qt(e);const n=new URLSearchParams(window.location.search).get("gallery")||"showcase";let s=F.galleries.find(r=>r.id===n);!s&&F.galleries.length>0&&(s=F.galleries[0]),l.activeGallery=s,nt(s);try{await jt(e,s.environment||"environments"),await Kt(e,s),await Qt(e,s),await Gt(e),document.getElementById("loading-screen").classList.add("loaded"),it(),e.on("update",Jt),e.on("update",r=>{l.autoRotator&&l.autoRotator.update(r)}),N(),console.log("✅ Viewing Room Ready")}catch(r){console.error("Failed to load gallery:",r)}}function Zt(i){const e=i.graphicsDevice.scope;T=e.resolve("uTime"),x=e.resolve("uMode"),J=e.resolve("uRevealOffset"),T.setValue(0),x.setValue(0),J.setValue(0),console.log("Animation system initialized")}function V(i,e){const t=()=>{const n=i.material;if(!n){setTimeout(t,50);return}try{const s=e.graphicsDevice.isWebGPU,r=s?"wgsl":"glsl";s||(n.getShaderChunks(r).set("gsplatModifyVS",Nt),n.update(),console.log("Applied animation shader (GLSL)"))}catch(s){console.warn("Could not apply animation shader:",s)}};t()}function Gt(i){return new Promise(e=>{i.assets.loadFromUrl("/models/pedestal.glb","container",(t,n)=>{if(t){console.warn("Could not load pedestal model:",t),e();return}const s=n.resource.instantiateRenderEntity();s.name="Pedestal",s.setPosition(0,-1,0),s.setLocalScale(1.84,1.84,1.84),i.root.addChild(s),l.pedestalEntity=s;const r=new D("PedestalLight");r.addComponent("light",{type:"directional",color:new R(1,.95,.9),intensity:1.2,castShadows:!1}),r.setEulerAngles(45,30,0),i.root.addChild(r);const o=new D("PedestalFillLight");o.addComponent("light",{type:"directional",color:new R(.8,.85,1),intensity:.4,castShadows:!1}),o.setEulerAngles(-30,-150,0),i.root.addChild(o),Vt(s),console.log("🗿 Pedestal model loaded and added to scene"),e()})})}async function jt(i,e){const t=["px","nx","py","ny","pz","nz"];try{const n=await Promise.all(t.map(async r=>{const o=await fetch(`/${e}/${r}.webp`);if(!o.ok)throw new Error(`Failed to load ${r}.webp`);const u=await o.blob();return createImageBitmap(u)})),s=new xt(i.graphicsDevice,{cubemap:!0,width:n[0].width,height:n[0].height,format:Mt,mipmaps:!0,minFilter:Lt,magFilter:Pt,addressU:j,addressV:j});s.setSource(n),i.scene.skybox=s,i.scene.skyboxIntensity=1,i.scene.skyboxMip=0,i.scene.skyboxRotation=new It().setFromEulerAngles(0,30,0),i.scene.sky.type=St,i.scene.sky.center=new E(0,.137,0),i.scene.sky.node&&(i.scene.sky.node.setLocalPosition(0,-1,0),i.scene.sky.node.setLocalScale(20,20,20),i.scene.sky.node.setLocalEulerAngles(0,0,0)),console.log("✅ Environment cubemap loaded with dome projection")}catch(n){console.warn("Could not load environment:",n)}}function qt(i){const e=i.scene.layers.getLayerByName("World"),t=i.scene.layers.getLayerByName("Skybox"),n=[e==null?void 0:e.id,t==null?void 0:t.id].filter(r=>r!==void 0),s=new D("Camera");s.addComponent("camera",{clearColor:new R(.04,.04,.045,1),fov:45,nearClip:.1,farClip:1e3,layers:n.length>0?n:void 0}),s.setPosition(0,0,3),s.lookAt(0,0,0),i.root.addChild(s),l.camera=s,l.orbitController=new zt(i,s,{distanceMin:1,distanceMax:15,pitchAngleMax:85,pitchAngleMin:-85,inertiaFactor:.1,frameOnStart:!1}),l.autoRotator=new Xt(l.orbitController,{speed:4,pitchSpeed:.25,pitchAmount:1,startDelay:4,startFadeInTime:5}),console.log("Camera with orbit controls initialized")}function Kt(i,e){const t=[];e.sculptures.forEach(s=>{const r=new Ct(s.id,"gsplat",{url:`./${s.file}`});t.push(r),s.asset=r});const n=new _t(t,i.assets);return new Promise((s,r)=>{n.load(o=>{o?r(o):s()})})}async function Qt(i,e){for(let t=0;t<e.sculptures.length;t++){const n=e.sculptures[t],s=new D(n.title),r=n.position||[0,0,0],o=n.rotation||[0,0,0],u=n.scale||[1,1,1];s.setPosition(...r),s.setEulerAngles(...o),s.setLocalScale(...u),s.addComponent("gsplat",{asset:n.asset}),s.enabled=t===0,i.root.addChild(s),l.entities.push(s),s.gsplat&&V(s.gsplat,i)}}function N(){p.time=0,p.mode=0,p.isAnimating=!0,p.startTime=performance.now()/1e3,T&&x&&(T.setValue(0),x.setValue(0))}function tt(){return new Promise(i=>{p.time=0,p.mode=1,p.isAnimating=!0,p.startTime=performance.now()/1e3,x&&x.setValue(1),T&&T.setValue(0);const e=()=>{p.isAnimating?requestAnimationFrame(e):i()};requestAnimationFrame(e)})}function Jt(){if(!T||!x)return;const e=performance.now()/1e3-p.startTime,t=p.mode===0?Yt:Bt;p.isAnimating&&(p.time=Math.min(e,t),e>=t&&(p.isAnimating=!1,p.time=t)),T.setValue(p.time),x.setValue(p.mode)}async function O(){if(l.isTransitioning)return;const i=l.activeGallery.sculptures.length;await et((l.currentIndex+1)%i)}async function $(){if(l.isTransitioning)return;const i=l.activeGallery.sculptures.length,e=(l.currentIndex-1+i)%i;await et(e)}async function et(i){if(!l.isTransitioning){l.isTransitioning=!0;try{await tt(),l.entities.forEach((t,n)=>{t.enabled=n===i}),l.currentIndex=i,it();const e=l.entities[i];e.gsplat&&V(e.gsplat,l.app),N()}finally{l.isTransitioning=!1}}}function it(){Y(l.currentIndex,!0)}document.getElementById("gallery-next").addEventListener("click",O);document.getElementById("gallery-prev").addEventListener("click",$);window.addEventListener("keydown",i=>{i.key==="ArrowRight"&&O(),i.key==="ArrowLeft"&&$(),i.key==="Escape"&&(window.location.href="/")});function nt(i){const e=document.getElementById("info-carousel-track");e&&(e.innerHTML="",i.sculptures.forEach((t,n)=>{const s=document.createElement("div");s.className="info-card",s.dataset.index=n,s.innerHTML=`
            <div class="gallery-info-header">
                <h1 class="roboto-slab-light">${t.title}</h1>
                <h2 class="roboto-light">${t.artist}</h2>
            </div>
            <div class="gallery-info-body">
                <p class="roboto-light">${t.description||""}</p>
                <div class="gallery-meta">
                    <div class="meta-item">
                        <span class="label">Material</span>
                        <span class="value">${t.material||"Bronze"}</span>
                    </div>
                    <div class="meta-item">
                        <span class="label">Origin</span>
                        <span class="value">${t.origin||"Studio"}</span>
                    </div>
                </div>
            </div>
        `,e.appendChild(s)}))}function Y(i,e=!0){var r;const t=document.getElementById("info-carousel-track");if(!t)return;const n=((r=t.querySelector(".info-card"))==null?void 0:r.offsetWidth)||0,s=-i*n;e?t.classList.remove("dragging"):t.classList.add("dragging"),t.style.transform=`translateX(${s}px)`}function te(){const i=document.getElementById("gallery-info-panel"),e=document.getElementById("panel-drag-handle"),t=document.getElementById("info-carousel-track");if(!i||!e||window.innerWidth>768)return;let n=null,s=0,r=0,o=0,u=0,d=0,y=0,w=0,I=0,k=0,H=0,P=!1,b=null;const at=.15,rt=.75,B=.3,z=10,lt=()=>i.offsetHeight,S=()=>lt()-80,U=()=>{var a;return((a=t==null?void 0:t.querySelector(".info-card"))==null?void 0:a.offsetWidth)||0},X=()=>{var a,c;return((c=(a=l.activeGallery)==null?void 0:a.sculptures)==null?void 0:c.length)||1};setTimeout(()=>{const a=S();a>0&&(o=a,i.style.transform=`translateY(${a}px)`,i.classList.add("collapsed"),P=!0)},100);function ct(){if(!t)return 0;const a=window.getComputedStyle(t).transform;return a==="none"?0:new DOMMatrix(a).m41}function W(a,c,h,f=at,L=rt){const M=(c-a)*f;return h=(h+M)*L,{position:a+h,velocity:h}}function dt(a){o=Math.max(0,Math.min(a,S())),i.style.transform=`translateY(${o}px)`}function Z(a){let c=w;const h=()=>{const f=W(o,a,c);o=f.position,c=f.velocity,i.style.transform=`translateY(${o}px)`,Math.abs(a-o)>.5||Math.abs(c)>.1?b=requestAnimationFrame(h):(o=a,i.style.transform=a===0?"":`translateY(${a}px)`,a>0?(P=!0,i.classList.add("collapsed")):(P=!1,i.classList.remove("collapsed")))};b&&cancelAnimationFrame(b),i.classList.remove("collapsed"),h()}function ht(a){if(!t)return;const c=0,h=-(X()-1)*U();a>c?a=c+(a-c)*.3:a<h&&(a=h+(a-h)*.3),d=a,t.style.transform=`translateX(${a}px)`}function ut(){if(!t)return;const a=U();if(a===0)return;let c=Math.round(-d/a);Math.abs(y)>B&&(y<0?c=Math.ceil(-d/a):c=Math.floor(-d/a)),c=Math.max(0,Math.min(c,X()-1));const h=-c*a;let f=y;const L=()=>{const M=W(d,h,f,.18,.65);d=M.position,f=M.velocity,t.style.transform=`translateX(${d}px)`,Math.abs(h-d)>.5||Math.abs(f)>.1?b=requestAnimationFrame(L):(d=h,t.style.transform=`translateX(${h}px)`,t.classList.remove("dragging"),c!==l.currentIndex&&pt(c))};b&&cancelAnimationFrame(b),L()}async function pt(a){if(!l.isTransitioning){l.isTransitioning=!0;try{await tt(),l.entities.forEach((h,f)=>{h.enabled=f===a}),l.currentIndex=a;const c=l.entities[a];c.gsplat&&V(c.gsplat,l.app),N()}finally{l.isTransitioning=!1}}}function mt(a){b&&cancelAnimationFrame(b);const c=a.touches[0];s=c.clientX,r=c.clientY,I=s,k=r,H=performance.now(),n=null,y=0,w=0,u=ct(),d=u,i.classList.add("dragging"),t&&t.classList.add("dragging")}function ft(a){const c=a.touches[0],h=c.clientX-s,f=c.clientY-r,L=performance.now(),M=Math.max(1,L-H);if(y=(c.clientX-I)/M*16,w=(c.clientY-k)/M*16,I=c.clientX,k=c.clientY,H=L,n||(Math.abs(f)>z?(n="vertical",window.hideCollapseHint&&window.hideCollapseHint()):Math.abs(h)>z&&!P&&(n="horizontal")),n==="vertical"){const G=P?S():0;dt(G+f)}else n==="horizontal"&&ht(u+h)}function gt(){if(i.classList.remove("dragging"),n==="vertical"){const a=S()*.3,h=o>a||w>B?S():0;Z(h)}else n==="horizontal"?ut():t&&t.classList.remove("dragging");n=null}i.addEventListener("touchstart",mt,{passive:!0}),i.addEventListener("touchmove",ft,{passive:!0}),i.addEventListener("touchend",gt),e.addEventListener("click",()=>{P&&Z(0)}),window.addEventListener("resize",()=>{window.innerWidth>768?(i.classList.remove("collapsed","dragging"),i.style.transform="",t&&(t.classList.remove("dragging"),t.style.transform=""),P=!1):Y(l.currentIndex,!1)}),console.log("Info carousel with true scroll initialized")}function st(){Y(l.currentIndex,!0)}const ee=O,ie=$;O=async function(){await ee(),st()};$=async function(){await ie(),st()};document.addEventListener("DOMContentLoaded",()=>{const i=setInterval(()=>{l.activeGallery&&(clearInterval(i),nt(l.activeGallery),te())},100);ne()});const m={dragHintVisible:!1,collapseHintVisible:!1};function ne(){const i=document.getElementById("hint-drag"),e=document.getElementById("hint-collapse");if(!i||!e)return;if(window.innerWidth>768){i.classList.add("hidden"),e.classList.add("hidden");return}const t=()=>{const n=document.getElementById("loading-screen");n&&n.classList.contains("loaded")?setTimeout(()=>{i.classList.remove("hidden"),i.classList.add("visible"),m.dragHintVisible=!0,e.classList.remove("hidden"),e.classList.add("visible"),m.collapseHintVisible=!0},800):setTimeout(t,100)};t()}function se(){if(!m.dragHintVisible)return;const i=document.getElementById("hint-drag");i&&(i.classList.remove("visible"),m.dragHintVisible=!1,setTimeout(()=>{i.classList.add("hidden"),ae()},400))}function oe(){if(m.dragHintVisible||window.innerWidth>768)return;const i=document.getElementById("hint-drag");i&&(i.classList.remove("hidden"),setTimeout(()=>{i.classList.add("visible"),m.dragHintVisible=!0},100))}function ae(){if(m.zoomHintShown||m.zoomHintVisible||window.innerWidth>768)return;const i=document.getElementById("hint-zoom");i&&(i.classList.remove("hidden"),setTimeout(()=>{i.classList.add("visible"),m.zoomHintVisible=!0,m.zoomHintShown=!0,setTimeout(ot,4e3)},100))}function ot(){if(!m.zoomHintVisible)return;const i=document.getElementById("hint-zoom");i&&(i.classList.remove("visible"),m.zoomHintVisible=!1,setTimeout(()=>{i.classList.add("hidden")},2e3))}function re(){if(!m.collapseHintVisible)return;const i=document.getElementById("hint-collapse");i&&(i.classList.remove("visible"),m.collapseHintVisible=!1,setTimeout(()=>{i.classList.add("hidden")},400))}window.hideDragHint=se;window.showDragHint=oe;window.hideZoomHint=ot;window.hideCollapseHint=re;Wt().catch(console.error);
