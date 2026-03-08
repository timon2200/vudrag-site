/**
 * Golden Particle Wave Shader
 * 
 * Custom GLSL shaders for GPU-accelerated particle rendering.
 * Uses point sprites with radial glow for soft, luminous particles.
 */

export const PARTICLE_WAVE_VS = `
attribute vec3 aPosition;
attribute vec4 aColor;  // RGB + size in alpha

uniform mat4 matrix_viewProjection;
uniform mat4 matrix_model;
uniform float uTime;
uniform vec3 uCameraPos;

varying vec4 vColor;
varying float vSize;

// Simplex noise for organic motion
float hash(float n) { return fract(sin(n) * 43758.5453123); }

float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    float n = p.x + p.y * 57.0 + 113.0 * p.z;
    return mix(
        mix(mix(hash(n), hash(n + 1.0), f.x),
            mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
        mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
            mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y),
        f.z
    );
}

void main() {
    // Extract size from alpha channel
    vSize = aColor.a;
    vColor = vec4(aColor.rgb, 1.0);
    
    // Apply wave modulation to position
    vec3 pos = aPosition;
    float noiseOffset = noise(pos * 2.0 + uTime * 0.3) * 0.05;
    pos.y += noiseOffset;
    
    // Transform to clip space
    vec4 worldPos = matrix_model * vec4(pos, 1.0);
    gl_Position = matrix_viewProjection * worldPos;
    
    // Calculate point size with distance attenuation
    float dist = length(uCameraPos - worldPos.xyz);
    float baseSize = vSize * 800.0;  // Scale factor for visibility
    gl_PointSize = baseSize / max(dist, 0.5);
    
    // Clamp point size
    gl_PointSize = clamp(gl_PointSize, 2.0, 64.0);
}
`;

export const PARTICLE_WAVE_FS = `
precision highp float;

varying vec4 vColor;
varying float vSize;

void main() {
    // Create circular point with soft glow
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord) * 2.0;
    
    // Soft radial falloff for glow effect
    float alpha = 1.0 - smoothstep(0.0, 1.0, dist);
    alpha = pow(alpha, 1.5);  // Sharper center, softer edges
    
    // Boost brightness at center
    float coreBrightness = 1.0 + (1.0 - dist) * 0.5;
    
    // Final color with glow
    vec3 color = vColor.rgb * coreBrightness;
    
    // Discard fully transparent pixels
    if (alpha < 0.01) discard;
    
    gl_FragColor = vec4(color, alpha * 0.85);
}
`;
