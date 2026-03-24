import{s as n}from"./state-DFY6wBk_.js";import{C as x,E as C,V as P,u as w,v as y,B,a as L,b as T,P as k,e as M,f as E,w as z}from"./playcanvas-SM2qEX5e.js";const d={splats:[{name:"Maska",file:"gs_Maska_Vudrag.sog",position:[0,.25,0],rotation:[-5,-45,185],scale:.8,title:"MASKA",subtitle:"The face beneath the surface",number:"01",grading:{brightness:1,contrast:1,saturation:1,exposure:0,gamma:1,tintR:1,tintG:1,tintB:1,hueShift:0,shadows:0,highlights:1}},{name:"Kapljica",file:"gs_Vudrag_galerija_kapljica.sog",position:[0,.3,0],rotation:[5,25,185],scale:.85,title:"KAPLJICA",subtitle:"A droplet frozen in time",number:"02",grading:{brightness:1,contrast:1,saturation:1,exposure:0,gamma:1,tintR:1,tintG:1,tintB:1,hueShift:0,shadows:0,highlights:1}},{name:"Romislav",file:"gs_vudrag_romislav.sog",position:[0,.4,0],rotation:[-175,30,0],scale:.7,title:"ROMISLAV",subtitle:"Echoes of ancient form",number:"03",grading:{brightness:1,contrast:1,saturation:1,exposure:0,gamma:1,tintR:1,tintG:1,tintB:1,hueShift:0,shadows:0,highlights:1}}],camera:{baseDistance:3.5,verticalOffset:.4,fov:50},colors:{background:new x(.015,.015,.025,1)}},F={SNAP_THRESHOLD:.4,IDLE_TIMEOUT:150},R={swayAmplitude:.55,swaySpeed:.31};function O(){const s=n.app,{baseDistance:e,verticalOffset:a,fov:t}=d.camera,o=new C("Camera");o.setPosition(0,a,e),o.addComponent("camera",{clearColor:d.colors.background,fov:t,nearClip:.1,farClip:100}),s.root.addChild(o),n.camera=o,console.log("📷 Camera configured")}function $(s){if(!n.camera)return;const{baseDistance:e,verticalOffset:a}=d.camera,t=n.scrollProgress,o=Math.sin(n.time*R.swaySpeed)*R.swayAmplitude,r=Math.sin(t*Math.PI*2)*.1,c=o+r,l=V(),f=e+l*.4,u=Math.sin(c)*f*.3,m=Math.cos(c)*f,p=Math.sin(n.time*.4)*.03,h=a+p,g=n.camera.getPosition(),b=new P(u,h,m),S=1-Math.pow(.05,s),v=new P().lerp(g,b,S);n.camera.setPosition(v),n.camera.lookAt(0,.25,0)}function V(){const s=d.splats.length,a=n.scrollProgress*(s-1)%1;return a<.5?a*2:(1-a)*2}function D(s){const a=document.createElement("canvas");a.width=64,a.height=64;const t=a.getContext("2d"),o=t.createRadialGradient(64/2,64/2,0,64/2,64/2,64/2);o.addColorStop(0,"rgba(255, 255, 255, 1)"),o.addColorStop(.3,"rgba(255, 255, 255, 0.8)"),o.addColorStop(.6,"rgba(255, 255, 255, 0.3)"),o.addColorStop(1,"rgba(255, 255, 255, 0)"),t.fillStyle=o,t.fillRect(0,0,64,64);const r=new L(s,{width:64,height:64,format:k,mipmaps:!0,addressU:T,addressV:T});return r.setSource(a),r}function j(){const s=n.app,e=D(s.graphicsDevice),a=new C("AmbientParticles");a.setPosition(0,.5,0);const t=new w([0,0,.2,.4,.8,.4,1,0]),o=new w([0,.004,.5,.01,1,.003]),r=new y([[0,.7,.5,.8,1,.6],[0,.7,.5,.8,1,.6],[0,.75,.5,.85,1,.65]]);a.addComponent("particlesystem",{numParticles:250,lifetime:30,rate:.08,rate2:.16,emitterShape:1,emitterRadius:8,velocityGraph:new y([[0,-.03,1,.03],[0,.02,1,.06],[0,-.03,1,.03]]),scaleGraph:o,alphaGraph:t,colorGraph:r,colorMap:e,blend:B,depthWrite:!1,lighting:!1,halfLambert:!1,rotationSpeedGraph:new w([0,5]),rotationSpeedGraph2:new w([0,-5]),intensity:1.5,loop:!0,autoPlay:!0,preWarm:!0,sort:1}),s.root.addChild(a),n.particles=a,a.particlesystem.reset(),a.particlesystem.play(),console.log("✨ Ambient particles added")}function Y(s){if(!n.particles)return;const e=8,a=-(n.mouse.y*e),t=n.mouse.x*e,o=n.particles.getEulerAngles(),r=1,c=o.x+(a-o.x)*Math.min(1,s*r),l=o.y+(t-o.y)*Math.min(1,s*r);n.particles.setEulerAngles(c,l,0)}const G=`
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
`;async function N(){const s=n.app;console.log("📦 Loading first splat asset..."),n.splatAssets=new Array(d.splats.length).fill(null);const e=d.splats[0],a=new M(e.name,"gsplat",{url:`./${e.file}`});n.splatAssets[0]=a;const t=new E([a],s.assets);await new Promise((o,r)=>{t.load(c=>{c?(console.error("Asset load error:",c),r(c)):(console.log("✅ First splat asset loaded!"),o())})}),n.isLoaded=!0}async function U(){const s=n.app,a=s.graphicsDevice.isWebGPU?"wgsl":"glsl";for(let t=1;t<d.splats.length;t++){const o=d.splats[t];console.log(`📦 Background loading splat: ${o.name}...`);const r=new M(o.name,"gsplat",{url:`./${o.file}`}),c=new E([r],s.assets);await new Promise((l,f)=>{c.load(u=>{if(u)console.warn(`Failed to background-load ${o.name}:`,u),l();else{n.splatAssets[t]=r;const m=n.splatEntities[t];if(m&&!m.gsplat&&(m.addComponent("gsplat",{asset:r}),m.gsplat&&m.gsplat.instance&&a==="glsl"))try{const p=m.gsplat.instance.material;p.getShaderChunks(a).set("gsplatModifyVS",G),p.update(),p.setParameter("uTransition",1);const g=o.grading||{};p.setParameter("uBrightness",g.brightness??1),p.setParameter("uContrast",g.contrast??1),p.setParameter("uSaturation",g.saturation??1),p.setParameter("uExposure",g.exposure??0),p.setParameter("uGamma",g.gamma??1),p.setParameter("uTintR",g.tintR??1),p.setParameter("uTintG",g.tintG??1),p.setParameter("uTintB",g.tintB??1),p.setParameter("uHueShift",g.hueShift??0),p.setParameter("uShadows",g.shadows??0),p.setParameter("uHighlights",g.highlights??1),m.splatConfig=o,console.log(`🎨 Applied shader to background-loaded ${o.name}`)}catch(p){console.warn(`Could not apply shader to ${o.name}:`,p)}console.log(`✅ Background loaded: ${o.name}`),l()}})})}console.log("✅ All remaining splat assets loaded in background!")}function W(){const s=n.app;d.splats.forEach((e,a)=>{const t=new C(e.name);t.setPosition(...e.position),t.setEulerAngles(...e.rotation),t.setLocalScale(e.scale,e.scale,e.scale),t.initialRotation=new P(...e.rotation);const o=n.splatAssets[a];o&&t.addComponent("gsplat",{asset:o}),t.enabled=a===0,t.transitionValue=a===0?0:1,s.root.addChild(t),n.splatEntities.push(t),console.log(`🎭 Splat "${e.name}" added${o?"":" (asset pending)"}`)})}function K(){const a=n.app.graphicsDevice.isWebGPU?"wgsl":"glsl";n.splatEntities.forEach((t,o)=>{if(!t.gsplat||!t.gsplat.instance){console.warn(`Splat ${o} not ready for shader`);return}const r=d.splats[o];try{const l=t.gsplat.instance.material;if(l&&a==="glsl"){l.getShaderChunks(a).set("gsplatModifyVS",G),l.update();const f=o===0?0:1;l.setParameter("uTransition",f);const u=r.grading||{};l.setParameter("uBrightness",u.brightness??1),l.setParameter("uContrast",u.contrast??1),l.setParameter("uSaturation",u.saturation??1),l.setParameter("uExposure",u.exposure??0),l.setParameter("uGamma",u.gamma??1),l.setParameter("uTintR",u.tintR??1),l.setParameter("uTintG",u.tintG??1),l.setParameter("uTintB",u.tintB??1),l.setParameter("uHueShift",u.hueShift??0),l.setParameter("uShadows",u.shadows??0),l.setParameter("uHighlights",u.highlights??1),t.splatConfig=r,console.log(`🎨 Applied full shader to ${t.name}`)}}catch(c){console.warn(`Could not apply shader to ${t.name}:`,c)}})}function X(s,e,a){n.splatEntities.forEach((t,o)=>{let r;o<s?r=1:o===s?r=e:o===s+1?r=1-e:r=1;const c=8;if(t.transitionValue+=(r-t.transitionValue)*Math.min(1,a*c),t.gsplat&&t.gsplat.instance){const f=t.gsplat.instance.material;f&&f.setParameter("uTransition",t.transitionValue)}const l=t.transitionValue<.85;t.enabled=l})}function J(s){n.splatEntities.forEach((e,a)=>{if(!e.enabled||!e.initialRotation||a===2)return;const t=Math.max(-.8,Math.min(.8,n.mouse.x)),o=Math.max(-.8,Math.min(.8,n.mouse.y)),r=8,c=10,l=e.initialRotation.x-o*r,f=e.initialRotation.y+t*c,u=15,m=Math.max(e.initialRotation.x-u,Math.min(e.initialRotation.x+u,l)),p=Math.max(e.initialRotation.y-u,Math.min(e.initialRotation.y+u,f)),h=e.getEulerAngles(),b=Math.min(1,s*2),S=h.x+(m-h.x)*b,v=h.y+(p-h.y)*b;(Math.abs(S-h.x)>.01||Math.abs(v-h.y)>.01)&&e.setEulerAngles(S,v,e.initialRotation.z)})}const A={rendering:{toneMapping:0,sharpness:0,renderTargetScale:1},bloom:{intensity:.01,blurLevel:12},grading:{enabled:!0,brightness:1,contrast:1.35,saturation:1.65,tint:new x(1,1,1,1)},vignette:{intensity:1,inner:.4,outer:1.2,curvature:.5,color:new x(0,0,0)},fringing:{intensity:36},taa:{enabled:!1,jitter:1},dof:{enabled:!1,focusDistance:100,focusRange:10,blurRadius:3,nearBlur:!1}};let i=null;function q(){const s=n.app,e=n.camera;if(!e||!e.camera){console.warn("Camera not ready for post-effects");return}try{i=new z(s,e.camera),I(),i.enabled=!0,i.update(),n.cameraFrame=i,console.log("🎬 Post-processing effects enabled (full API)")}catch(a){console.warn("Could not setup post-effects:",a)}}function I(){if(!i)return;const{rendering:s,bloom:e,grading:a,vignette:t,fringing:o,taa:r,dof:c}=A;i.rendering.toneMapping=s.toneMapping,i.rendering.sharpness=s.sharpness,i.rendering.renderTargetScale=s.renderTargetScale,i.bloom.intensity=e.intensity,i.bloom.blurLevel=e.blurLevel,i.grading.enabled=a.enabled,i.grading.brightness=a.brightness,i.grading.contrast=a.contrast,i.grading.saturation=a.saturation,i.grading.tint=a.tint,i.vignette.intensity=t.intensity,i.vignette.inner=t.inner,i.vignette.outer=t.outer,i.vignette.curvature=t.curvature,i.vignette.color=t.color,i.fringing.intensity=o.intensity,i.taa.enabled=r.enabled,i.taa.jitter=r.jitter,i.dof.enabled=c.enabled,i.dof.focusDistance=c.focusDistance,i.dof.focusRange=c.focusRange,i.dof.blurRadius=c.blurRadius,i.dof.nearBlur=c.nearBlur}function Q(){i&&i.enabled&&i.update()}function Z(s){if(!i)return;const e=A.bloom.intensity;i.bloom.intensity=e+s*.04;const a=A.fringing.intensity;i.fringing.intensity=a+s*10}export{d as C,F as S,W as a,j as b,K as c,q as d,U as e,J as f,Y as g,$ as h,Z as i,Q as j,V as k,N as l,O as s,X as u};
