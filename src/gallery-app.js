/**
 * Vudrag Viewing Room - Standalone Application
 * 
 * Logic for the dedicated gallery page (gallery.html).
 * Features:
 * - Orbit-controlled 3D camera (ported from temp_gallery)
 * - Skybox environment with dome projection
 * - Hot plasma reveal animation via GLSL shaders
 * - Carousel navigation of splat sculptures
 */
import * as pc from 'playcanvas';
import { CONFIG } from './config.js';
import { GALLERIES_DATA } from './data/galleries.js';

// CSS Imports
import './styles/variables.css';
import './styles/luxury-typography.css';
import './styles/gallery-overlay.css';

// === Animation Shader (GLSL) ===
const GLSL_ANIMATION_CHUNK = /* glsl */`
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
`;

// === Constants ===
const FADE_IN_DURATION = 2.5;
const FADE_OUT_DURATION = 0.5;

// ============================================================================
// Orbit Camera Controller (ported from temp_gallery)
// ============================================================================
class OrbitCameraController {
    constructor(app, entity, config = {}) {
        this.app = app;
        this.entity = entity;
        this.config = {
            distanceMax: 15,
            distanceMin: 1,
            pitchAngleMax: 85,
            pitchAngleMin: -85,
            inertiaFactor: 0.1,
            frameOnStart: false,
            orbitSensitivity: 0.3,
            distanceSensitivity: 0.15,
            ...config
        };

        // Internal state
        this._yaw = 0;
        this._pitch = 10;
        this._distance = 3;
        this._targetYaw = 0;
        this._targetPitch = 10;
        this._targetDistance = 3;
        this._pivotPoint = new pc.Vec3(0, 0, 0);

        // Mouse input state
        this.lookButtonDown = false;
        this.panButtonDown = false;
        this.lastPoint = new pc.Vec2();

        // Touch input state
        this.lastTouchPoint = new pc.Vec2();
        this.lastPinchMidPoint = new pc.Vec2();
        this.lastPinchDistance = 0;

        this.initialize();
    }

    // Properties with getters/setters
    get distance() { return this._targetDistance; }
    set distance(value) { this._targetDistance = this.clampDistance(value); }

    get pitch() { return this._targetPitch; }
    set pitch(value) { this._targetPitch = this.clampPitchAngle(value); }

    get yaw() { return this._targetYaw; }
    set yaw(value) {
        this._targetYaw = value;
        // Ensure yaw takes shortest route
        const diff = this._targetYaw - this._yaw;
        const remainder = diff % 360;
        if (remainder > 180) {
            this._targetYaw = this._yaw - (360 - remainder);
        } else if (remainder < -180) {
            this._targetYaw = this._yaw + (360 + remainder);
        } else {
            this._targetYaw = this._yaw + remainder;
        }
    }

    get pivotPoint() { return this._pivotPoint; }
    set pivotPoint(value) { this._pivotPoint.copy(value); }

    // Update camera - call every frame
    update(dt) {
        // Apply inertia
        const t = this.config.inertiaFactor === 0 ? 1 : Math.min(dt / this.config.inertiaFactor, 1);
        this._distance = pc.math.lerp(this._distance, this._targetDistance, t);
        this._yaw = pc.math.lerp(this._yaw, this._targetYaw, t);
        this._pitch = pc.math.lerp(this._pitch, this._targetPitch, t);

        this.updatePosition();
    }

    // Private methods
    initialize() {
        // Check aspect ratio on resize
        window.addEventListener('resize', () => this.checkAspectRatio());
        this.checkAspectRatio();

        // Setup input handlers
        this.setupMouseInput();
        this.setupTouchInput();

        // Start update loop
        this.app.on('update', (dt) => this.update(dt));
    }

    setupMouseInput() {
        const mouse = this.app.mouse;
        if (!mouse) return;

        mouse.on(pc.EVENT_MOUSEDOWN, (event) => this.onMouseDown(event));
        mouse.on(pc.EVENT_MOUSEUP, (event) => this.onMouseUp(event));
        mouse.on(pc.EVENT_MOUSEMOVE, (event) => this.onMouseMove(event));
        mouse.on(pc.EVENT_MOUSEWHEEL, (event) => this.onMouseWheel(event));

        window.addEventListener('mouseout', () => this.onMouseOut());

        // Disable context menu
        mouse.disableContextMenu();
    }

    setupTouchInput() {
        const touch = this.app.touch;
        if (!touch) return;

        touch.on(pc.EVENT_TOUCHSTART, (event) => this.onTouchStartEndCancel(event));
        touch.on(pc.EVENT_TOUCHEND, (event) => this.onTouchStartEndCancel(event));
        touch.on(pc.EVENT_TOUCHCANCEL, (event) => this.onTouchStartEndCancel(event));
        touch.on(pc.EVENT_TOUCHMOVE, (event) => this.onTouchMove(event));
    }

    updatePosition() {
        this.entity.setLocalPosition(0, 0, 0);
        this.entity.setLocalEulerAngles(this._pitch, this._yaw, 0);

        const position = this.entity.getPosition();
        position.copy(this.entity.forward);
        position.mulScalar(-this._distance);
        position.add(this.pivotPoint);
        this.entity.setPosition(position);
    }

    checkAspectRatio() {
        const height = this.app.graphicsDevice.height;
        const width = this.app.graphicsDevice.width;

        const camera = this.entity.camera;
        if (camera) {
            camera.horizontalFov = height > width;
        }
    }

    clampDistance(distance) {
        if (this.config.distanceMax > 0) {
            return pc.math.clamp(distance, this.config.distanceMin, this.config.distanceMax);
        }
        return Math.max(distance, this.config.distanceMin);
    }

    clampPitchAngle(pitch) {
        return pc.math.clamp(pitch, this.config.pitchAngleMin, this.config.pitchAngleMax);
    }

    // Mouse Event Handlers
    onMouseDown(event) {
        switch (event.button) {
            case pc.MOUSEBUTTON_LEFT:
                this.lookButtonDown = true;
                break;
            case pc.MOUSEBUTTON_MIDDLE:
            case pc.MOUSEBUTTON_RIGHT:
                this.panButtonDown = true;
                break;
        }
    }

    onMouseUp(event) {
        switch (event.button) {
            case pc.MOUSEBUTTON_LEFT:
                this.lookButtonDown = false;
                break;
            case pc.MOUSEBUTTON_MIDDLE:
            case pc.MOUSEBUTTON_RIGHT:
                this.panButtonDown = false;
                break;
        }
    }

    onMouseMove(event) {
        if (this.lookButtonDown) {
            this.pitch -= event.dy * this.config.orbitSensitivity;
            this.yaw -= event.dx * this.config.orbitSensitivity;
        } else if (this.panButtonDown) {
            this.pan(event);
        }

        this.lastPoint.set(event.x, event.y);
    }

    onMouseWheel(event) {
        this.distance -= event.wheelDelta * this.config.distanceSensitivity * (this._distance * 0.1);
        if (event.event) event.event.preventDefault();
    }

    onMouseOut() {
        this.lookButtonDown = false;
        this.panButtonDown = false;
    }

    pan(screenPoint) {
        const camera = this.entity.camera;
        if (!camera) return;

        const fromWorldPoint = new pc.Vec3();
        const toWorldPoint = new pc.Vec3();
        const worldDiff = new pc.Vec3();
        const distance = this._distance;

        camera.screenToWorld(screenPoint.x, screenPoint.y, distance, fromWorldPoint);
        camera.screenToWorld(this.lastPoint.x, this.lastPoint.y, distance, toWorldPoint);

        worldDiff.sub2(toWorldPoint, fromWorldPoint);
        this._pivotPoint.add(worldDiff);
    }

    // Touch Event Handlers
    getPinchDistance(pointA, pointB) {
        const dx = pointA.x - pointB.x;
        const dy = pointA.y - pointB.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    calcMidPoint(pointA, pointB, result) {
        result.set(pointB.x - pointA.x, pointB.y - pointA.y);
        result.mulScalar(0.5);
        result.x += pointA.x;
        result.y += pointA.y;
    }

    onTouchStartEndCancel(event) {
        const touches = event.touches;
        if (touches.length === 1) {
            this.lastTouchPoint.set(touches[0].x, touches[0].y);
        } else if (touches.length === 2) {
            this.lastPinchDistance = this.getPinchDistance(touches[0], touches[1]);
            this.calcMidPoint(touches[0], touches[1], this.lastPinchMidPoint);
        }
    }

    onTouchMove(event) {
        const touches = event.touches;

        if (touches.length === 1) {
            const touch = touches[0];

            // Hide drag hint when user starts orbiting
            if (window.hideDragHint) window.hideDragHint();

            this.pitch -= (touch.y - this.lastTouchPoint.y) * this.config.orbitSensitivity;
            this.yaw -= (touch.x - this.lastTouchPoint.x) * this.config.orbitSensitivity;

            this.lastTouchPoint.set(touch.x, touch.y);
        } else if (touches.length === 2) {
            // Pinch zoom
            const currentPinchDistance = this.getPinchDistance(touches[0], touches[1]);
            const diffInPinchDistance = currentPinchDistance - this.lastPinchDistance;
            this.lastPinchDistance = currentPinchDistance;

            this.distance -= (diffInPinchDistance * this.config.distanceSensitivity * 0.1) * (this._distance * 0.1);

            // Pan
            const pinchMidPoint = new pc.Vec2();
            this.calcMidPoint(touches[0], touches[1], pinchMidPoint);
            this.touchPan(pinchMidPoint);
            this.lastPinchMidPoint.copy(pinchMidPoint);
        }
    }

    touchPan(midPoint) {
        const camera = this.entity.camera;
        if (!camera) return;

        const fromWorldPoint = new pc.Vec3();
        const toWorldPoint = new pc.Vec3();
        const worldDiff = new pc.Vec3();
        const distance = this._distance;

        camera.screenToWorld(midPoint.x, midPoint.y, distance, fromWorldPoint);
        camera.screenToWorld(this.lastPinchMidPoint.x, this.lastPinchMidPoint.y, distance, toWorldPoint);

        worldDiff.sub2(toWorldPoint, fromWorldPoint);
        this._pivotPoint.add(worldDiff);
    }
}

// ============================================================================
// Auto-Rotate Animation
// ============================================================================
const smoothStep = (x) => (x <= 0) ? 0 : (x >= 1) ? 1 : Math.sin((x - 0.5) * Math.PI) * 0.5 + 0.5;

class AutoRotator {
    constructor(orbitCamera, config = {}) {
        this.orbitCamera = orbitCamera;
        this.config = {
            speed: 4,
            pitchSpeed: 0.25,
            pitchAmount: 1,
            startDelay: 4,
            startFadeInTime: 5,
            ...config
        };

        this.pitch = orbitCamera.pitch;
        this.yaw = orbitCamera.yaw;
        this.timer = 0;
        this.enabled = true;
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        if (!enabled) {
            this.timer = 0;
        }
    }

    resetTimer() {
        this.timer = 0;
        this.pitch = this.orbitCamera.pitch;
        this.yaw = this.orbitCamera.yaw;
    }

    update(dt) {
        if (!this.enabled) return;

        const camera = this.orbitCamera;

        // Check if camera was moved by user
        if (this.pitch !== camera.pitch || this.yaw !== camera.yaw) {
            this.pitch = camera.pitch;
            this.yaw = camera.yaw;
            this.timer = 0;
            this._autoRotateStarted = false; // Reset flag
        } else {
            this.timer += dt;
        }

        // Animate when idle
        if (this.timer > this.config.startDelay) {
            const time = this.timer - this.config.startDelay;
            const fadeIn = smoothStep(time / this.config.startFadeInTime);

            // Show drag hint when auto-rotation starts
            if (!this._autoRotateStarted && fadeIn > 0.1) {
                this._autoRotateStarted = true;
                if (window.showDragHint) window.showDragHint();
            }

            this.yaw += dt * fadeIn * this.config.speed;
            this.pitch += Math.sin(time * this.config.pitchSpeed) * dt * fadeIn * this.config.pitchAmount;

            camera.yaw = this.yaw;
            camera.pitch = this.pitch;
        }
    }
}

// === State ===
const galleryState = {
    app: null,
    camera: null,
    orbitController: null,
    autoRotator: null,
    entities: [],
    currentIndex: 0,
    activeGallery: null,
    isTransitioning: false
};

// Animation state
const animationState = {
    time: 0,
    mode: 0, // 0 = fade in, 1 = fade out
    isAnimating: false,
    startTime: 0
};

// Shader uniforms
let timeUniform = null;
let modeUniform = null;
let revealOffsetUniform = null;

/**
 * Initialize Gallery App
 */
async function init() {
    console.log('🏛️ Initializing Viewing Room...');

    // 1. Setup PlayCanvas
    const canvas = document.getElementById('application-canvas');
    const app = new pc.Application(canvas, {
        mouse: new pc.Mouse(canvas),
        touch: pc.platform.touch ? new pc.TouchDevice(canvas) : undefined,
        graphicsDeviceOptions: {
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance'
        }
    });

    galleryState.app = app;
    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);
    app.start();

    window.addEventListener('resize', () => app.resizeCanvas());

    // 2. Initialize animation system (resolve uniforms)
    initAnimationSystem(app);

    // 3. Setup Camera with Orbit Controller
    setupCamera(app);

    // 4. Load Content
    const urlParams = new URLSearchParams(window.location.search);
    const galleryId = urlParams.get('gallery') || 'showcase';

    let galleryData = GALLERIES_DATA.galleries.find(g => g.id === galleryId);
    if (!galleryData && GALLERIES_DATA.galleries.length > 0) {
        galleryData = GALLERIES_DATA.galleries[0];
    }

    galleryState.activeGallery = galleryData;

    // Generate info carousel cards early (for both mobile and desktop)
    generateCarouselCards(galleryData);

    try {
        // Load environment/skybox
        await loadEnvironment(app, galleryData.environment || 'environments');

        await loadAssets(app, galleryData);
        await spawnSculptures(app, galleryData);

        document.getElementById('loading-screen').classList.add('loaded');
        updateUI();

        // Start update loop for animation
        app.on('update', updateAnimation);

        // Start auto-rotator update
        app.on('update', (dt) => {
            if (galleryState.autoRotator) {
                galleryState.autoRotator.update(dt);
            }
        });

        // Start fade-in for first sculpture
        startFadeIn();

        console.log('✅ Viewing Room Ready');
    } catch (e) {
        console.error('Failed to load gallery:', e);
    }
}

/**
 * Initialize animation system - resolve shader uniforms
 */
function initAnimationSystem(app) {
    const scope = app.graphicsDevice.scope;

    timeUniform = scope.resolve('uTime');
    modeUniform = scope.resolve('uMode');
    revealOffsetUniform = scope.resolve('uRevealOffset');

    // Set initial values
    timeUniform.setValue(0);
    modeUniform.setValue(0);
    revealOffsetUniform.setValue(0.0);

    console.log('Animation system initialized');
}

/**
 * Apply animation shader to a gsplat component
 */
function applyAnimationShader(gsplatComponent, app) {
    const tryApply = () => {
        const material = gsplatComponent.material;
        if (!material) {
            setTimeout(tryApply, 50);
            return;
        }

        try {
            const isWebGPU = app.graphicsDevice.isWebGPU;
            const shaderLanguage = isWebGPU ? 'wgsl' : 'glsl';

            // Only GLSL supported for now
            if (!isWebGPU) {
                material.getShaderChunks(shaderLanguage).set('gsplatModifyVS', GLSL_ANIMATION_CHUNK);
                material.update();
                console.log('Applied animation shader (GLSL)');
            }
        } catch (e) {
            console.warn('Could not apply animation shader:', e);
        }
    };

    tryApply();
}

/**
 * Load environment cubemap and set as skybox with dome projection
 */
async function loadEnvironment(app, envPath) {
    const FACE_NAMES = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];

    try {
        // Load all 6 face textures as ImageBitmaps
        const faceImages = await Promise.all(
            FACE_NAMES.map(async (face) => {
                const response = await fetch(`/${envPath}/${face}.webp`);
                if (!response.ok) throw new Error(`Failed to load ${face}.webp`);
                const blob = await response.blob();
                return createImageBitmap(blob);
            })
        );

        // Create cubemap texture from loaded images
        const cubemap = new pc.Texture(app.graphicsDevice, {
            cubemap: true,
            width: faceImages[0].width,
            height: faceImages[0].height,
            format: pc.PIXELFORMAT_RGBA8,
            mipmaps: true,
            minFilter: pc.FILTER_LINEAR_MIPMAP_LINEAR,
            magFilter: pc.FILTER_LINEAR,
            addressU: pc.ADDRESS_CLAMP_TO_EDGE,
            addressV: pc.ADDRESS_CLAMP_TO_EDGE
        });

        // Set cubemap sources
        cubemap.setSource(faceImages);

        // Apply to scene skybox
        app.scene.skybox = cubemap;
        app.scene.skyboxIntensity = 1.0;
        app.scene.skyboxMip = 0;
        app.scene.skyboxRotation = new pc.Quat().setFromEulerAngles(0, 30, 0);

        // Configure sky dome settings
        app.scene.sky.type = pc.SKYTYPE_DOME;
        app.scene.sky.center = new pc.Vec3(0, 0.137, 0);

        // Set sky node transform
        if (app.scene.sky.node) {
            app.scene.sky.node.setLocalPosition(0, -1, 0);
            app.scene.sky.node.setLocalScale(20, 20, 20);
            app.scene.sky.node.setLocalEulerAngles(0, 0, 0);
        }

        console.log('✅ Environment cubemap loaded with dome projection');
    } catch (e) {
        console.warn('Could not load environment:', e);
    }
}

/**
 * Setup Camera with Orbit Controller
 */
function setupCamera(app) {
    const worldLayer = app.scene.layers.getLayerByName('World');
    const skyboxLayer = app.scene.layers.getLayerByName('Skybox');
    const layerIds = [worldLayer?.id, skyboxLayer?.id].filter(id => id !== undefined);

    const camera = new pc.Entity('Camera');
    camera.addComponent('camera', {
        clearColor: new pc.Color(0.04, 0.04, 0.045, 1),
        fov: 45,
        nearClip: 0.1,
        farClip: 1000,
        layers: layerIds.length > 0 ? layerIds : undefined
    });

    camera.setPosition(0, 0, 3);
    camera.lookAt(0, 0, 0);
    app.root.addChild(camera);

    galleryState.camera = camera;

    // Create orbit controller
    galleryState.orbitController = new OrbitCameraController(app, camera, {
        distanceMin: 1,
        distanceMax: 15,
        pitchAngleMax: 85,
        pitchAngleMin: -85,
        inertiaFactor: 0.1,
        frameOnStart: false
    });

    // Create auto-rotator
    galleryState.autoRotator = new AutoRotator(galleryState.orbitController, {
        speed: 4,
        pitchSpeed: 0.25,
        pitchAmount: 1,
        startDelay: 4,
        startFadeInTime: 5
    });

    console.log('Camera with orbit controls initialized');
}

/**
 * Load Assets
 */
function loadAssets(app, gallery) {
    const assets = [];

    gallery.sculptures.forEach(item => {
        const asset = new pc.Asset(item.id, 'gsplat', {
            url: `./${item.file}`
        });
        assets.push(asset);
        item.asset = asset;
    });

    const loader = new pc.AssetListLoader(assets, app.assets);

    return new Promise((resolve, reject) => {
        loader.load((err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

/**
 * Spawn Entities and apply animation shaders
 */
async function spawnSculptures(app, gallery) {
    for (let index = 0; index < gallery.sculptures.length; index++) {
        const item = gallery.sculptures[index];
        const entity = new pc.Entity(item.title);

        const pos = item.position || [0, 0, 0];
        const rot = item.rotation || [0, 0, 0];
        const scale = item.scale || [1, 1, 1];

        entity.setPosition(...pos);
        entity.setEulerAngles(...rot);
        entity.setLocalScale(...scale);

        entity.addComponent('gsplat', {
            asset: item.asset
        });

        entity.enabled = (index === 0);
        app.root.addChild(entity);
        galleryState.entities.push(entity);

        // Apply animation shader to the gsplat component
        if (entity.gsplat) {
            applyAnimationShader(entity.gsplat, app);
        }
    }
}

// === Animation System ===

function startFadeIn() {
    animationState.time = 0;
    animationState.mode = 0;
    animationState.isAnimating = true;
    animationState.startTime = performance.now() / 1000;

    if (timeUniform && modeUniform) {
        timeUniform.setValue(0);
        modeUniform.setValue(0);
    }
}

function startFadeOut() {
    return new Promise((resolve) => {
        animationState.time = 0;
        animationState.mode = 1;
        animationState.isAnimating = true;
        animationState.startTime = performance.now() / 1000;

        if (modeUniform) modeUniform.setValue(1);
        if (timeUniform) timeUniform.setValue(0);

        const checkComplete = () => {
            if (!animationState.isAnimating) {
                resolve();
            } else {
                requestAnimationFrame(checkComplete);
            }
        };
        requestAnimationFrame(checkComplete);
    });
}

function updateAnimation() {
    if (!timeUniform || !modeUniform) return;

    const now = performance.now() / 1000;
    const elapsed = now - animationState.startTime;
    const duration = animationState.mode === 0 ? FADE_IN_DURATION : FADE_OUT_DURATION;

    if (animationState.isAnimating) {
        animationState.time = Math.min(elapsed, duration);

        if (elapsed >= duration) {
            animationState.isAnimating = false;
            animationState.time = duration;
        }
    }

    timeUniform.setValue(animationState.time);
    modeUniform.setValue(animationState.mode);
}

// === Navigation Logic ===

async function nextItem() {
    if (galleryState.isTransitioning) return;
    const count = galleryState.activeGallery.sculptures.length;
    await switchItem((galleryState.currentIndex + 1) % count);
}

async function prevItem() {
    if (galleryState.isTransitioning) return;
    const count = galleryState.activeGallery.sculptures.length;
    const next = (galleryState.currentIndex - 1 + count) % count;
    await switchItem(next);
}

async function switchItem(index) {
    if (galleryState.isTransitioning) return;
    galleryState.isTransitioning = true;

    try {
        // Fade out current
        await startFadeOut();

        // Hide old, show new
        galleryState.entities.forEach((ent, i) => {
            ent.enabled = (i === index);
        });

        galleryState.currentIndex = index;
        updateUI();

        // Apply animation shader to new entity (in case not applied yet)
        const newEntity = galleryState.entities[index];
        if (newEntity.gsplat) {
            applyAnimationShader(newEntity.gsplat, galleryState.app);
        }

        // Fade in new
        startFadeIn();
    } finally {
        galleryState.isTransitioning = false;
    }
}

// === UI Logic ===

function updateUI() {
    // Carousel cards are pre-generated, just scroll to current position
    scrollCarouselTo(galleryState.currentIndex, true);
}

// Event Listeners
document.getElementById('gallery-next').addEventListener('click', nextItem);
document.getElementById('gallery-prev').addEventListener('click', prevItem);

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextItem();
    if (e.key === 'ArrowLeft') prevItem();
    if (e.key === 'Escape') window.location.href = '/';
});

// ============================================================================
// Info Carousel with True Scroll (Mobile)
// Features: Vertical hide/show, Horizontal carousel scroll, Magnetic springs
// ============================================================================

// Generate carousel cards for all sculptures
function generateCarouselCards(gallery) {
    const track = document.getElementById('info-carousel-track');
    if (!track) return;

    track.innerHTML = '';

    gallery.sculptures.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'info-card';
        card.dataset.index = index;

        card.innerHTML = `
            <div class="gallery-info-header">
                <h1 class="roboto-slab-light">${item.title}</h1>
                <h2 class="roboto-light">${item.artist}</h2>
            </div>
            <div class="gallery-info-body">
                <p class="roboto-light">${item.description || ''}</p>
                <div class="gallery-meta">
                    <div class="meta-item">
                        <span class="label">Material</span>
                        <span class="value">${item.material || 'Bronze'}</span>
                    </div>
                    <div class="meta-item">
                        <span class="label">Origin</span>
                        <span class="value">${item.origin || 'Studio'}</span>
                    </div>
                </div>
            </div>
        `;

        track.appendChild(card);
    });
}

// Scroll carousel to specific index
function scrollCarouselTo(index, animated = true) {
    const track = document.getElementById('info-carousel-track');
    if (!track) return;

    const cardWidth = track.querySelector('.info-card')?.offsetWidth || 0;
    const offset = -index * cardWidth;

    if (animated) {
        track.classList.remove('dragging');
    } else {
        track.classList.add('dragging');
    }

    track.style.transform = `translateX(${offset}px)`;
}

function initDraggablePanel() {
    const panel = document.getElementById('gallery-info-panel');
    const handle = document.getElementById('panel-drag-handle');
    const track = document.getElementById('info-carousel-track');
    if (!panel || !handle) return;

    // Only enable on mobile
    if (window.innerWidth > 768) return;

    // State
    let dragDirection = null;
    let startX = 0;
    let startY = 0;
    let currentTranslateY = 0;
    let carouselStartX = 0;
    let carouselCurrentX = 0;
    let velocityX = 0;
    let velocityY = 0;
    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;
    let isCollapsed = false;
    let animationFrameId = null;

    // Physics constants
    const SPRING_STIFFNESS = 0.15;
    const SPRING_DAMPING = 0.75;
    const VELOCITY_THRESHOLD = 0.3;
    const DIRECTION_LOCK_THRESHOLD = 10;

    const panelHeight = () => panel.offsetHeight;
    const collapsedOffset = () => panelHeight() - 50;
    const cardWidth = () => track?.querySelector('.info-card')?.offsetWidth || 0;
    const totalCards = () => galleryState.activeGallery?.sculptures?.length || 1;

    // Get current carousel X offset from transform
    function getCarouselX() {
        if (!track) return 0;
        const transform = window.getComputedStyle(track).transform;
        if (transform === 'none') return 0;
        const matrix = new DOMMatrix(transform);
        return matrix.m41;
    }

    // ========== Magnetic Spring Animation ==========
    function magneticSpring(current, target, velocity, stiffness = SPRING_STIFFNESS, damping = SPRING_DAMPING) {
        const force = (target - current) * stiffness;
        velocity = (velocity + force) * damping;
        const newPosition = current + velocity;
        return { position: newPosition, velocity };
    }

    // ========== Vertical Panel Animation ==========
    function setTranslateY(y) {
        currentTranslateY = Math.max(0, Math.min(y, collapsedOffset()));
        panel.style.transform = `translateY(${currentTranslateY}px)`;
    }

    function animateToVerticalPosition(target) {
        let velY = velocityY;
        const animate = () => {
            const result = magneticSpring(currentTranslateY, target, velY);
            currentTranslateY = result.position;
            velY = result.velocity;

            panel.style.transform = `translateY(${currentTranslateY}px)`;

            if (Math.abs(target - currentTranslateY) > 0.5 || Math.abs(velY) > 0.1) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                currentTranslateY = target;
                panel.style.transform = target === 0 ? '' : `translateY(${target}px)`;

                if (target > 0) {
                    isCollapsed = true;
                    panel.classList.add('collapsed');
                } else {
                    isCollapsed = false;
                    panel.classList.remove('collapsed');
                }
            }
        };

        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        panel.classList.remove('collapsed');
        animate();
    }

    // ========== Horizontal Carousel Scroll ==========
    function setCarouselX(x) {
        if (!track) return;
        // Limit scroll range with rubber band at edges
        const maxOffset = 0;
        const minOffset = -(totalCards() - 1) * cardWidth();

        if (x > maxOffset) {
            x = maxOffset + (x - maxOffset) * 0.3; // Rubber band
        } else if (x < minOffset) {
            x = minOffset + (x - minOffset) * 0.3; // Rubber band
        }

        carouselCurrentX = x;
        track.style.transform = `translateX(${x}px)`;
    }

    function snapToNearestCard() {
        if (!track) return;

        const width = cardWidth();
        if (width === 0) return;

        // Calculate which card to snap to based on position and velocity
        let targetIndex = Math.round(-carouselCurrentX / width);

        // Factor in velocity for momentum-based snap
        if (Math.abs(velocityX) > VELOCITY_THRESHOLD) {
            if (velocityX < 0) {
                targetIndex = Math.ceil(-carouselCurrentX / width);
            } else {
                targetIndex = Math.floor(-carouselCurrentX / width);
            }
        }

        // Clamp to valid range
        targetIndex = Math.max(0, Math.min(targetIndex, totalCards() - 1));

        const targetX = -targetIndex * width;

        // Animate to target with spring
        let velX = velocityX;
        const animate = () => {
            const result = magneticSpring(carouselCurrentX, targetX, velX, 0.18, 0.65);
            carouselCurrentX = result.position;
            velX = result.velocity;

            track.style.transform = `translateX(${carouselCurrentX}px)`;

            if (Math.abs(targetX - carouselCurrentX) > 0.5 || Math.abs(velX) > 0.1) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                carouselCurrentX = targetX;
                track.style.transform = `translateX(${targetX}px)`;
                track.classList.remove('dragging');

                // Update sculpture if changed
                if (targetIndex !== galleryState.currentIndex) {
                    switchToSculpture(targetIndex);
                }
            }
        };

        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animate();
    }

    // Switch sculpture without re-scrolling carousel
    async function switchToSculpture(index) {
        if (galleryState.isTransitioning) return;
        galleryState.isTransitioning = true;

        try {
            // Fade out current 3D model
            await startFadeOut();

            // Show new model
            galleryState.entities.forEach((ent, i) => {
                ent.enabled = (i === index);
            });

            galleryState.currentIndex = index;

            // Apply shader
            const newEntity = galleryState.entities[index];
            if (newEntity.gsplat) {
                applyAnimationShader(newEntity.gsplat, galleryState.app);
            }

            startFadeIn();
        } finally {
            galleryState.isTransitioning = false;
        }
    }

    // ========== Touch Event Handlers ==========
    function onTouchStart(e) {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);

        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        lastX = startX;
        lastY = startY;
        lastTime = performance.now();
        dragDirection = null;
        velocityX = 0;
        velocityY = 0;

        // Get current carousel position
        carouselStartX = getCarouselX();
        carouselCurrentX = carouselStartX;

        panel.classList.add('dragging');
        if (track) track.classList.add('dragging');
    }

    function onTouchMove(e) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        const now = performance.now();
        const dt = Math.max(1, now - lastTime);

        // Calculate velocities
        velocityX = (touch.clientX - lastX) / dt * 16;
        velocityY = (touch.clientY - lastY) / dt * 16;
        lastX = touch.clientX;
        lastY = touch.clientY;
        lastTime = now;

        // Lock direction once threshold exceeded
        if (!dragDirection) {
            if (Math.abs(deltaY) > DIRECTION_LOCK_THRESHOLD) {
                dragDirection = 'vertical';
                // Hide the collapse hint when user starts dragging
                if (window.hideCollapseHint) window.hideCollapseHint();
            } else if (Math.abs(deltaX) > DIRECTION_LOCK_THRESHOLD && !isCollapsed) {
                dragDirection = 'horizontal';
            }
        }

        if (dragDirection === 'vertical') {
            const startTranslateY = isCollapsed ? collapsedOffset() : 0;
            setTranslateY(startTranslateY + deltaY);
        } else if (dragDirection === 'horizontal') {
            // True scroll - move the carousel track
            setCarouselX(carouselStartX + deltaX);
        }
    }

    function onTouchEnd() {
        panel.classList.remove('dragging');

        if (dragDirection === 'vertical') {
            const threshold = collapsedOffset() * 0.3;
            const shouldCollapse = currentTranslateY > threshold || velocityY > VELOCITY_THRESHOLD;
            const target = shouldCollapse ? collapsedOffset() : 0;
            animateToVerticalPosition(target);
        } else if (dragDirection === 'horizontal') {
            snapToNearestCard();
        } else {
            if (track) track.classList.remove('dragging');
        }

        dragDirection = null;
    }

    // ========== Event Listeners ==========
    panel.addEventListener('touchstart', onTouchStart, { passive: true });
    panel.addEventListener('touchmove', onTouchMove, { passive: true });
    panel.addEventListener('touchend', onTouchEnd);

    // Tap on handle to expand when collapsed
    handle.addEventListener('click', () => {
        if (isCollapsed) {
            animateToVerticalPosition(0);
        }
    });

    // Re-initialize on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            panel.classList.remove('collapsed', 'dragging');
            panel.style.transform = '';
            if (track) {
                track.classList.remove('dragging');
                track.style.transform = '';
            }
            isCollapsed = false;
        } else {
            // Recalculate carousel position
            scrollCarouselTo(galleryState.currentIndex, false);
        }
    });

    console.log('Info carousel with true scroll initialized');
}

// Update carousel when switching via buttons/keyboard (not carousel drag)
function updateCarouselPosition() {
    scrollCarouselTo(galleryState.currentIndex, true);
}

// Override nextItem/prevItem to also update carousel
const originalNextItem = nextItem;
const originalPrevItem = prevItem;

nextItem = async function () {
    await originalNextItem();
    updateCarouselPosition();
};

prevItem = async function () {
    await originalPrevItem();
    updateCarouselPosition();
};

// Initialize after DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Generate cards after gallery data loads
    const checkGallery = setInterval(() => {
        if (galleryState.activeGallery) {
            clearInterval(checkGallery);
            generateCarouselCards(galleryState.activeGallery);
            initDraggablePanel();
        }
    }, 100);

    // Initialize inline hints
    initInlineHints();
});

// ============================================================================
// Inline Contextual Hints (Mobile)
// Show every session, hide on interaction, reappear for auto-orbit
// ============================================================================
const hintState = {
    dragHintVisible: false,
    collapseHintVisible: false
};

function initInlineHints() {
    const hintDrag = document.getElementById('hint-drag');
    const hintCollapse = document.getElementById('hint-collapse');

    if (!hintDrag || !hintCollapse) return;

    // Only show on mobile
    if (window.innerWidth > 768) {
        hintDrag.classList.add('hidden');
        hintCollapse.classList.add('hidden');
        return;
    }

    // Show hints after loading completes (every session)
    const showHints = () => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen && loadingScreen.classList.contains('loaded')) {
            setTimeout(() => {
                hintDrag.classList.remove('hidden');
                hintDrag.classList.add('visible');
                hintState.dragHintVisible = true;

                hintCollapse.classList.remove('hidden');
                hintCollapse.classList.add('visible');
                hintState.collapseHintVisible = true;
            }, 800);
        } else {
            setTimeout(showHints, 100);
        }
    };
    showHints();
}

// Hide drag hint when user interacts
function hideDragHint() {
    if (!hintState.dragHintVisible) return;

    const hintDrag = document.getElementById('hint-drag');
    if (hintDrag) {
        hintDrag.classList.remove('visible');
        hintState.dragHintVisible = false;

        setTimeout(() => {
            hintDrag.classList.add('hidden');
        }, 400);
    }
}

// Show drag hint again (for auto-orbit animation)
function showDragHint() {
    if (hintState.dragHintVisible) return;
    if (window.innerWidth > 768) return; // Mobile only

    const hintDrag = document.getElementById('hint-drag');
    if (hintDrag) {
        hintDrag.classList.remove('hidden');

        // Small delay before showing
        setTimeout(() => {
            hintDrag.classList.add('visible');
            hintState.dragHintVisible = true;
        }, 100);
    }
}

// Hide collapse hint when user interacts
function hideCollapseHint() {
    if (!hintState.collapseHintVisible) return;

    const hintCollapse = document.getElementById('hint-collapse');
    if (hintCollapse) {
        hintCollapse.classList.remove('visible');
        hintState.collapseHintVisible = false;

        setTimeout(() => {
            hintCollapse.classList.add('hidden');
        }, 400);
    }
}

// Expose globally for camera controller and auto-orbit to use
window.hideDragHint = hideDragHint;
window.showDragHint = showDragHint;
window.hideCollapseHint = hideCollapseHint;

// Start
init().catch(console.error);
