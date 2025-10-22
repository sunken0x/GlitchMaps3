// Glitch Maps - ANIMATED VERSION for 256 Art
// Includes Math.random fix, BufferAttribute fix, uses .value for traits

class Random {
    // ... (Your full Random class code) ...
    constructor() { let offset = 0; for (let i = 2; i < 66; i += 8) offset += parseInt(inputData.hash.substr(i, 8), 16); offset %= 7; const p = pos => parseInt(inputData.hash.substr((pos + offset), 8), 16); let a = p(2) ^ p(34), b = p(10) ^ p(42), c = p(18) ^ p(50), d = p(26) ^ p(58) ^ p(2 + (8 - offset)); this.r = () => { a |= 0; b |= 0; c |= 0; d |= 0; let t = (((a + b) | 0) + d) | 0; d = (d + 1) | 0; a = b ^ (b >>> 9); b = (c + (c << 3)) | 0; c = (c << 21) | (c >>> 11); c = (c + t) | 0; return (t >>> 0) / 4294967296; }; for (let i = 0; i < 256; i++) this.r(); }
    random_dec = () => this.r();
    random_num = (a, b) => a + (b - a) * this.random_dec();
    random_int = (a, b) => Math.floor(this.random_num(a, b + 1));
    random_bool = (p) => this.random_dec() < p;
    random_choice = (list) => list[this.random_int(0, list.length - 1)];
}
const R = new Random();

const TRAITS = {
    chaosLevel: inputData["Chaos Level"].value,
    colorScheme: inputData["Color Scheme"].value,
    wavePattern: inputData["Wave Pattern"].value,
    gridDensity: inputData["Grid Density"].value,
    speed: inputData["Speed"].value,
    flashingMode: inputData["Flashing Mode"].value,
    flicker: inputData["Flicker"].value
};

const flashSpeed = R.random_num(0.02, 0.06);
const lineOpacity = 1.0;
const gridSpacing = R.random_num(0.26, 0.32);

// Color schemes (Use your full list)
const colorSchemes = { 'Classic Sunken': { bgColor: 0x000a25, color1: 0x2ce1f5, color2: 0xe224e7 }, /* ... */ 'Pink Sunset': { bgColor: 0x000a25, color1: 0xff1493, color2: 0xff69b4 } };
const colorScheme = colorSchemes[TRAITS.colorScheme];

// Chaos parameters (Use your full list)
const chaosParams = { 'Serene': { glitchIntensity: 0, octaves: 1 }, /* ... */ 'Fractal Storm': { glitchIntensity: 5.5, octaves: 4 } };
const chaos = chaosParams[TRAITS.chaosLevel];

const gridDensities = { 'Dense': 55 };
const lineCount = gridDensities[TRAITS.gridDensity];

const speeds = { 'Glacial': 0.0005, /* ... */ 'Hyperactive': 0.008 };
const speedMultiplier = speeds[TRAITS.speed]; // Make sure this is used if needed

class GlitchWave {
    constructor(canvas, params) {
        this.canvas = canvas; this.flashSpeed = params.flashSpeed; this.lineOpacity = params.lineOpacity; this.gridSpacing = params.gridSpacing; this.colorScheme = params.colorScheme;
        this.timeOffset = parseInt(inputData.hash.substr(10, 8), 16) % 100000; this.startTime = Date.now();
        this.setup();
    }
    setup() {
        let dp = window.devicePixelRatio || 1; let width = window.innerWidth; let height = window.innerHeight;
        this.canvas.width = width * dp; this.canvas.height = height * dp;
        this.w = this.canvas.width; this.h = this.canvas.height;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
        this.camera.position.set(0, 0, 17.7); this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, preserveDrawingBuffer: true, alpha: false });
        this.renderer.setPixelRatio(dp); this.renderer.setSize(width, height, false);
        this.renderer.setClearColor(this.colorScheme.bgColor);
        this.renderer.autoClear = true; this.renderer.localClippingEnabled = false;

        this.createBackgroundPlane(); this.createGrid(); this.animate();
        // No resize listener needed on platform
    }
    createBackgroundPlane() {
        const distance = Math.abs(this.camera.position.z - (-10)); const vFOV = (this.camera.fov * Math.PI) / 180;
        const visibleHeight = 2 * Math.tan(vFOV / 2) * distance; const visibleWidth = visibleHeight * this.camera.aspect;
        const bgGeometry = new THREE.PlaneGeometry(visibleWidth * 1.5, visibleHeight * 1.5);
        const bgMaterial = new THREE.MeshBasicMaterial({ color: this.colorScheme.bgColor });
        this.bgPlane = new THREE.Mesh(bgGeometry, bgMaterial); this.bgPlane.position.z = -10; this.scene.add(this.bgPlane);
    }
    createGrid() {
        const pointsPerLine = lineCount; const baseSpacing = this.gridSpacing;
        const viewportScale = Math.min(this.w / (window.devicePixelRatio || 1), this.h / (window.devicePixelRatio || 1)) / 2000; // Use CSS pixels for scale
        const spacing = baseSpacing * viewportScale * 1;
        this.lines = []; this.linesGroup = new THREE.Group(); this.scene.add(this.linesGroup);

        for (let lineY = 0; lineY < lineCount; lineY++) {
            const linePoints = []; const lineColors = []; const originalPositions = [];
            const yPos = (lineY - lineCount / 2) * spacing;
            for (let pointX = 0; pointX < pointsPerLine; pointX++) {
                const xPos = (pointX - pointsPerLine / 2) * spacing;
                linePoints.push(new THREE.Vector3(xPos, yPos, 0)); originalPositions.push({ x: xPos, y: yPos });
                const color = new THREE.Color(this.colorScheme.color1); lineColors.push(color.r, color.g, color.b);
            }
            const geometry = new THREE.BufferGeometry().setFromPoints(linePoints);
            geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(lineColors), 3)); // FIXED
            const material = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: this.lineOpacity, linewidth: 2.5 });
            const line = new THREE.Line(geometry, material); this.linesGroup.add(line);
            this.lines.push({ mesh: line, originalPositions: originalPositions });
        }
    }
    fractalNoise(x, y, time) {
        // ... (Your full fractal noise code) ...
        let result = Math.sin(x * 0.5 + time * 0.003) * Math.cos(y * 0.3 + time * 0.004); if (chaos.octaves >= 2) result += Math.sin(x * 1.2 + time * 0.007) * Math.cos(y * 0.8 + time * 0.005) * 0.5; if (chaos.octaves >= 3) result += Math.sin(x * 2.1 + time * 0.012) * Math.cos(y * 1.5 + time * 0.009) * 0.25 + Math.sin((x + y) * 0.2 + time * 0.002) * Math.cos((x - y) * 0.15 + time * 0.003) * 0.3; if (chaos.octaves >= 4) result += Math.sin(x * 3.5 + time * 0.018) * Math.cos(y * 2.8 + time * 0.014) * 0.125; return result;
    }
    updateLines(time) {
        // ... (Your full updateLines code using R.random_dec() for randomness) ...
        let flickerOpacity = 1.0; if (TRAITS.flicker === 'Subtle') flickerOpacity = 0.95 + R.random_dec() * 0.05; else if (TRAITS.flicker === 'Moderate') flickerOpacity = 0.85 + R.random_dec() * 0.15;
        let getColorForPoint; if (TRAITS.flashingMode === 'Random Glitch') { getColorForPoint = () => { const useColor2 = R.random_dec() > 0.5; const color = useColor2 ? new THREE.Color(this.colorScheme.color2) : new THREE.Color(this.colorScheme.color1); if (R.random_dec() > 0.7) flickerOpacity = 0.5; return color; }; } else { const globalFlash = Math.sin(time * this.flashSpeed) > 0; const globalColor = globalFlash ? new THREE.Color(this.colorScheme.color2) : new THREE.Color(this.colorScheme.color1); getColorForPoint = () => globalColor; }
        this.lines.forEach((lineData) => { const { mesh, originalPositions } = lineData; const newPoints = []; const newColors = []; mesh.material.opacity = flickerOpacity; for (let i = 0; i < originalPositions.length; i++) { const pos = originalPositions[i]; let wave = 0; /* ... Your full wave pattern logic ... */ if (TRAITS.wavePattern === 'Circular Ripple') wave = Math.sin(time * 0.001 - Math.sqrt(pos.x * pos.x + pos.y * pos.y) * 0.6) * 2; else if (TRAITS.wavePattern === 'Linear Wave') wave = Math.sin(time * 0.001 + pos.x * 2) * 2; /* ... etc ... */ else if (TRAITS.wavePattern === 'Smooth Center') wave = Math.sin(time * 0.0016 - Math.sqrt(pos.x * pos.x + pos.y * pos.y) * 2.0) * 2.5; const glitchOffset = this.fractalNoise(pos.x, pos.y, time) * chaos.glitchIntensity; const finalWave = wave + glitchOffset; const color = getColorForPoint(i); newPoints.push(pos.x, pos.y, finalWave); newColors.push(color.r, color.g, color.b); } mesh.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(newPoints), 3)); mesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(newColors), 3)); mesh.geometry.attributes.position.needsUpdate = true; mesh.geometry.attributes.color.needsUpdate = true; });
    }
    animate(time = 0) {
        requestAnimationFrame((t) => this.animate(t)); // Keep the loop
        const elapsed = Date.now() - this.startTime; const deterministicTime = this.timeOffset + elapsed;
        this.updateLines(deterministicTime); this.renderer.render(this.scene, this.camera);
    }
    // No handleResize needed for platform
}

let c = document.createElement("canvas"); c.style.display = 'block'; c.style.width = '100%'; c.style.height = '100%'; document.body.appendChild(c);
const bodyBgColor = '#' + colorScheme.bgColor.toString(16).padStart(6, '0'); document.body.style.margin = '0'; document.body.style.padding = '0'; document.body.style.overflow = 'hidden'; document.body.style.backgroundColor = bodyBgColor;

const glitchWave = new GlitchWave(c, { flashSpeed, lineOpacity, gridSpacing, colorScheme });

// Use the original setTimeout
setTimeout(() => { window.rendered = c; console.log('✅ Glitch Maps ready for 256.art'); }, 1000);
