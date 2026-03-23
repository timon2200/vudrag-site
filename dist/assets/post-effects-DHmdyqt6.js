import{s as i}from"./state-DFY6wBk_.js";import{C as w,E as P,V as x,u as b,v as y,B as R,a as E,b as T,P as G,e as L,f as B,w as z}from"./playcanvas-SM2qEX5e.js";const g={splats:[{name:"Maska",file:"gs_Maska_Vudrag.sog",position:[0,.25,0],rotation:[-5,-45,185],scale:.8,title:"MASKA",subtitle:"The face beneath the surface",number:"01",grading:{brightness:1,contrast:1,saturation:1,exposure:0,gamma:1,tintR:1,tintG:1,tintB:1,hueShift:0,shadows:0,highlights:1}},{name:"Kapljica",file:"gs_Vudrag_galerija_kapljica.sog",position:[0,.3,0],rotation:[5,25,185],scale:.85,title:"KAPLJICA",subtitle:"A droplet frozen in time",number:"02",grading:{brightness:1,contrast:1,saturation:1,exposure:0,gamma:1,tintR:1,tintG:1,tintB:1,hueShift:0,shadows:0,highlights:1}},{name:"Romislav",file:"gs_vudrag_romislav.sog",position:[0,.4,0],rotation:[-175,30,0],scale:.7,title:"ROMISLAV",subtitle:"Echoes of ancient form",number:"03",grading:{brightness:1,contrast:1,saturation:1,exposure:0,gamma:1,tintR:1,tintG:1,tintB:1,hueShift:0,shadows:0,highlights:1}}],camera:{baseDistance:3.5,verticalOffset:.4,fov:50},colors:{background:new w(.015,.015,.025,1)}},H={SNAP_THRESHOLD:.4,IDLE_TIMEOUT:150},M={swayAmplitude:.55,swaySpeed:.31};function F(){const n=i.app,{baseDistance:e,verticalOffset:a,fov:t}=g.camera,o=new P("Camera");o.setPosition(0,a,e),o.addComponent("camera",{clearColor:g.colors.background,fov:t,nearClip:.1,farClip:100}),n.root.addChild(o),i.camera=o,console.log("📷 Camera configured")}function Y(n){if(!i.camera)return;const{baseDistance:e,verticalOffset:a}=g.camera,t=i.scrollProgress,o=Math.sin(i.time*M.swaySpeed)*M.swayAmplitude,r=Math.sin(t*Math.PI*2)*.1,u=o+r,l=V(),p=e+l*.4,c=Math.sin(u)*p*.3,v=Math.cos(u)*p,S=Math.sin(i.time*.4)*.03,m=a+S,C=i.camera.getPosition(),f=new x(c,m,v),h=1-Math.pow(.05,n),d=new x().lerp(C,f,h);i.camera.setPosition(d),i.camera.lookAt(0,.25,0)}function V(){const n=g.splats.length,a=i.scrollProgress*(n-1)%1;return a<.5?a*2:(1-a)*2}function I(n){const a=document.createElement("canvas");a.width=64,a.height=64;const t=a.getContext("2d"),o=t.createRadialGradient(64/2,64/2,0,64/2,64/2,64/2);o.addColorStop(0,"rgba(255, 255, 255, 1)"),o.addColorStop(.3,"rgba(255, 255, 255, 0.8)"),o.addColorStop(.6,"rgba(255, 255, 255, 0.3)"),o.addColorStop(1,"rgba(255, 255, 255, 0)"),t.fillStyle=o,t.fillRect(0,0,64,64);const r=new E(n,{width:64,height:64,format:G,mipmaps:!0,addressU:T,addressV:T});return r.setSource(a),r}function j(){const n=i.app,e=I(n.graphicsDevice),a=new P("AmbientParticles");a.setPosition(0,.5,0);const t=new b([0,0,.2,.4,.8,.4,1,0]),o=new b([0,.004,.5,.01,1,.003]),r=new y([[0,.7,.5,.8,1,.6],[0,.7,.5,.8,1,.6],[0,.75,.5,.85,1,.65]]);a.addComponent("particlesystem",{numParticles:250,lifetime:30,rate:.08,rate2:.16,emitterShape:1,emitterRadius:8,velocityGraph:new y([[0,-.03,1,.03],[0,.02,1,.06],[0,-.03,1,.03]]),scaleGraph:o,alphaGraph:t,colorGraph:r,colorMap:e,blend:R,depthWrite:!1,lighting:!1,halfLambert:!1,rotationSpeedGraph:new b([0,5]),rotationSpeedGraph2:new b([0,-5]),intensity:1.5,loop:!0,autoPlay:!0,preWarm:!0,sort:1}),n.root.addChild(a),i.particles=a,a.particlesystem.reset(),a.particlesystem.play(),console.log("✨ Ambient particles added")}function N(n){if(!i.particles)return;const e=8,a=-(i.mouse.y*e),t=i.mouse.x*e,o=i.particles.getEulerAngles(),r=1,u=o.x+(a-o.x)*Math.min(1,n*r),l=o.y+(t-o.y)*Math.min(1,n*r);i.particles.setEulerAngles(u,l,0)}const _=`
uniform float uTime;
uniform float uTransition;  // 0 = normal, 0.5 = peak explosion, 1 = invisible

// Per-splat color grading
uniform float uBrightness;
uniform float uContrast;
uniform float uSaturation;
uniform float uExposure;
uniform float uGamma;
uniform float uTintR;
uniform float uTintG;
uniform float uTintB;
uniform float uHueShift;
uniform float uShadows;
uniform float uHighlights;

// Simple noise function
float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    return mix(
        mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
            mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
            mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
        f.z
    );
}

// Hue shift helper
vec3 hueShift(vec3 color, float shift) {
    float angle = shift * 6.28318;  // Convert 0-1 to radians
    float s = sin(angle);
    float c = cos(angle);
    vec3 weights = vec3(0.57735, 0.57735, 0.57735);
    return color * c + cross(weights, color) * s + weights * dot(weights, color) * (1.0 - c);
}

void modifySplatCenter(inout vec3 center) {
    // Explosion peaks at uTransition = 0.5
    float explosionAmount = 1.0 - abs(uTransition * 2.0 - 1.0);
    explosionAmount = pow(explosionAmount, 0.7);
    
    if (explosionAmount > 0.01) {
        float noiseVal = noise(center * 8.0 + uTime * 0.5);
        vec3 direction = normalize(center + vec3(0.001));
        float explosionForce = explosionAmount * explosionAmount * 2.5;
        
        center += direction * explosionForce * (0.5 + noiseVal * 0.5);
        center.y += explosionAmount * noiseVal * 0.6;
        
        float angle = explosionAmount * 3.14159 * 2.0 + noiseVal * 2.0;
        float dist = length(center.xz);
        center.x += sin(angle) * dist * explosionAmount * 0.4;
        center.z += cos(angle) * dist * explosionAmount * 0.4;
    }
}

void modifySplatRotationScale(vec3 originalCenter, vec3 modifiedCenter, inout vec4 rotation, inout vec3 scale) {
    float explosionAmount = 1.0 - abs(uTransition * 2.0 - 1.0);
    explosionAmount = pow(explosionAmount, 0.7);
    
    if (explosionAmount > 0.01) {
        float shrink = 1.0 - explosionAmount * explosionAmount * 0.6;
        scale *= shrink;
    }
}

void modifySplatColor(vec3 center, inout vec4 color) {
    float explosionAmount = 1.0 - abs(uTransition * 2.0 - 1.0);
    explosionAmount = pow(explosionAmount, 0.7);
    
    // Plasma effect during transition
    if (explosionAmount > 0.01) {
        vec3 hotColor = vec3(1.0, 0.5, 0.1);
        vec3 whiteHot = vec3(1.0, 0.95, 0.9);
        
        float noiseVal = noise(center * 10.0 + uTime);
        float heatBlend = smoothstep(0.1, 0.6, explosionAmount + noiseVal * 0.2);
        
        color.rgb = mix(color.rgb, hotColor, heatBlend * 0.7);
        color.rgb = mix(color.rgb, whiteHot, smoothstep(0.5, 1.0, explosionAmount) * 0.4);
    }
    
    // ========== PER-SPLAT COLOR GRADING ==========
    
    // 1. Exposure (applied first, like a camera)
    color.rgb *= pow(2.0, uExposure);
    
    // 2. Shadows/Highlights (lift dark areas, compress bright areas)
    float lum = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    float shadowMask = 1.0 - smoothstep(0.0, 0.5, lum);
    float highlightMask = smoothstep(0.5, 1.0, lum);
    color.rgb += shadowMask * uShadows * 0.3;
    color.rgb *= 1.0 + highlightMask * (uHighlights - 1.0) * 0.5;
    
    // 3. Saturation
    float luminance = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    color.rgb = mix(vec3(luminance), color.rgb, uSaturation);
    
    // 4. Contrast
    color.rgb = (color.rgb - 0.5) * uContrast + 0.5;
    
    // 5. Brightness
    color.rgb *= uBrightness;
    
    // 6. Hue shift
    if (abs(uHueShift) > 0.001) {
        color.rgb = hueShift(color.rgb, uHueShift);
    }
    
    // 7. Tint (color multiply)
    color.rgb *= vec3(uTintR, uTintG, uTintB);
    
    // 8. Gamma correction
    color.rgb = pow(max(color.rgb, vec3(0.0)), vec3(1.0 / uGamma));
    
    // ========== OPACITY/VISIBILITY ==========
    float opacity = 1.0 - smoothstep(0.2, 0.6, uTransition);
    if (uTransition > 0.8) opacity = 0.0;
    if (uTransition < 0.15) opacity = 1.0;
    
    color.a *= opacity;
}
`;async function $(){const n=i.app;console.log("📦 Loading splat assets...");const e=[];g.splats.forEach(t=>{const o=new L(t.name,"gsplat",{url:`./${t.file}`});i.splatAssets.push(o),e.push(o)});const a=new B(e,n.assets);await new Promise((t,o)=>{a.load(r=>{r?(console.error("Asset load error:",r),o(r)):(console.log("✅ All splat assets loaded!"),t())})}),i.isLoaded=!0}function K(){const n=i.app;g.splats.forEach((e,a)=>{const t=new P(e.name);t.setPosition(...e.position),t.setEulerAngles(...e.rotation),t.setLocalScale(e.scale,e.scale,e.scale),t.initialRotation=new x(...e.rotation),t.addComponent("gsplat",{asset:i.splatAssets[a]}),t.enabled=a===0,t.transitionValue=a===0?0:1,n.root.addChild(t),i.splatEntities.push(t),console.log(`🎭 Splat "${e.name}" added`)})}function U(){const a=i.app.graphicsDevice.isWebGPU?"wgsl":"glsl";i.splatEntities.forEach((t,o)=>{if(!t.gsplat||!t.gsplat.instance){console.warn(`Splat ${o} not ready for shader`);return}const r=g.splats[o];try{const l=t.gsplat.instance.material;if(l&&a==="glsl"){l.getShaderChunks(a).set("gsplatModifyVS",_),l.update();const p=o===0?0:1;l.setParameter("uTransition",p);const c=r.grading||{};l.setParameter("uBrightness",c.brightness??1),l.setParameter("uContrast",c.contrast??1),l.setParameter("uSaturation",c.saturation??1),l.setParameter("uExposure",c.exposure??0),l.setParameter("uGamma",c.gamma??1),l.setParameter("uTintR",c.tintR??1),l.setParameter("uTintG",c.tintG??1),l.setParameter("uTintB",c.tintB??1),l.setParameter("uHueShift",c.hueShift??0),l.setParameter("uShadows",c.shadows??0),l.setParameter("uHighlights",c.highlights??1),t.splatConfig=r,console.log(`🎨 Applied full shader to ${t.name}`)}}catch(u){console.warn(`Could not apply shader to ${t.name}:`,u)}})}function W(n,e,a){i.splatEntities.forEach((t,o)=>{let r;o<n?r=1:o===n?r=e:o===n+1?r=1-e:r=1;const u=8;if(t.transitionValue+=(r-t.transitionValue)*Math.min(1,a*u),t.gsplat&&t.gsplat.instance){const p=t.gsplat.instance.material;p&&p.setParameter("uTransition",t.transitionValue)}const l=t.transitionValue<.85;t.enabled=l})}function X(n){i.splatEntities.forEach((e,a)=>{if(!e.enabled||!e.initialRotation||a===2)return;const t=Math.max(-.8,Math.min(.8,i.mouse.x)),o=Math.max(-.8,Math.min(.8,i.mouse.y)),r=8,u=10,l=e.initialRotation.x-o*r,p=e.initialRotation.y+t*u,c=15,v=Math.max(e.initialRotation.x-c,Math.min(e.initialRotation.x+c,l)),S=Math.max(e.initialRotation.y-c,Math.min(e.initialRotation.y+c,p)),m=e.getEulerAngles(),f=Math.min(1,n*2),h=m.x+(v-m.x)*f,d=m.y+(S-m.y)*f;(Math.abs(h-m.x)>.01||Math.abs(d-m.y)>.01)&&e.setEulerAngles(h,d,e.initialRotation.z)})}const A={rendering:{toneMapping:0,sharpness:0,renderTargetScale:1},bloom:{intensity:.01,blurLevel:12},grading:{enabled:!0,brightness:1,contrast:1.35,saturation:1.65,tint:new w(1,1,1,1)},vignette:{intensity:1,inner:.4,outer:1.2,curvature:.5,color:new w(0,0,0)},fringing:{intensity:36},taa:{enabled:!1,jitter:1},dof:{enabled:!1,focusDistance:100,focusRange:10,blurRadius:3,nearBlur:!1}};let s=null;function J(){const n=i.app,e=i.camera;if(!e||!e.camera){console.warn("Camera not ready for post-effects");return}try{s=new z(n,e.camera),D(),s.enabled=!0,s.update(),i.cameraFrame=s,console.log("🎬 Post-processing effects enabled (full API)")}catch(a){console.warn("Could not setup post-effects:",a)}}function D(){if(!s)return;const{rendering:n,bloom:e,grading:a,vignette:t,fringing:o,taa:r,dof:u}=A;s.rendering.toneMapping=n.toneMapping,s.rendering.sharpness=n.sharpness,s.rendering.renderTargetScale=n.renderTargetScale,s.bloom.intensity=e.intensity,s.bloom.blurLevel=e.blurLevel,s.grading.enabled=a.enabled,s.grading.brightness=a.brightness,s.grading.contrast=a.contrast,s.grading.saturation=a.saturation,s.grading.tint=a.tint,s.vignette.intensity=t.intensity,s.vignette.inner=t.inner,s.vignette.outer=t.outer,s.vignette.curvature=t.curvature,s.vignette.color=t.color,s.fringing.intensity=o.intensity,s.taa.enabled=r.enabled,s.taa.jitter=r.jitter,s.dof.enabled=u.enabled,s.dof.focusDistance=u.focusDistance,s.dof.focusRange=u.focusRange,s.dof.blurRadius=u.blurRadius,s.dof.nearBlur=u.nearBlur}function q(){s&&s.enabled&&s.update()}function Q(n){if(!s)return;const e=A.bloom.intensity;s.bloom.intensity=e+n*.04;const a=A.fringing.intensity;s.fringing.intensity=a+n*10}export{g as C,H as S,K as a,j as b,U as c,J as d,X as e,N as f,Y as g,Q as h,q as i,V as j,$ as l,F as s,W as u};
