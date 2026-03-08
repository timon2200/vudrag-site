/**
 * Plasma Transition Shader for Gaussian Splats
 * 
 * GLSL vertex shader that creates explosion/implosion particle effects.
 * 
 * Uniform: uTransition
 *   0   = normal/visible
 *   0.5 = peak explosion  
 *   1   = fully scattered/invisible
 * 
 * Per-splat color grading uniforms:
 *   uBrightness, uContrast, uSaturation, uExposure, uGamma
 *   uTintR, uTintG, uTintB (tint color)
 *   uHueShift (hue rotation)
 *   uShadows, uHighlights (lift/gain)
 */
export const PLASMA_SHADER_GLSL = `
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
`;
