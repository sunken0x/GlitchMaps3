// Glitch Maps - An exploration of the balance between disorder and tranquility
// 256.art Collection by Sunken 0x
// THREE.js is loaded by 256.art from EthFS

// 256.art Random class for deterministic generation
class Random {
    constructor() {
        let offset = 0;
        for (let i = 2; i < 66; i += 8) {
            offset += parseInt(inputData.hash.substr(i, 8), 16);
        }
        offset %= 7;
        
        const p = pos => parseInt(inputData.hash.substr((pos + offset), 8), 16);
        
        let a = p(2) ^ p(34);
        let b = p(10) ^ p(42);
        let c = p(18) ^ p(50);
        let d = p(26) ^ p(58) ^ p(2 + (8 - offset));
        
        this.r = () => {
            a |= 0; b |= 0; c |= 0; d |= 0;
            let t = (((a + b) | 0) + d) | 0;
            d = (d + 1) | 0;
            a = b ^ (b >>> 9);
            b = (c + (c << 3)) | 0;
            c = (c << 21) | (c >>> 11);
            c = (c + t) | 0;
            return (t >>> 0) / 4294967296;
        };
        
        for (let i = 0; i < 256; i++) this.r();
    }
    
    random_dec = () => this.r();
    random_num = (a, b) => a + (b - a) * this.random_dec();
    random_int = (a, b) => Math.floor(this.random_num(a, b + 1));
    random_bool = (p) => this.random_dec() < p;
    random_choice = (list) => list[this.random_int(0, list.length - 1)];
}

const R = new Random();

// BLOCKCHAIN-INFLUENCED CHAOS SYSTEM
const chaosLevels = [
    'Serene', 'Peaceful', 'Gentle', 'Flowing', 'Steady',
    'Turbulent', 'Chaotic', 'Fractal Chaos', 'Fractal Storm'
];
const blockMod = parseInt(inputData.blockNumber) % 9;
const blockInfluencedChaos = chaosLevels[blockMod];

// Continuous traits
const flashSpeed = R.random_num(0.02, 0.06);
const lineOpacity = 1.0;
const gridSpacing = R.random_num(0.26, 0.32);

// Trait generation
const TRAITS = {
    chaosLevel: blockInfluencedChaos,
    colorScheme: R.random_choice([
        'Classic Sunken', 'Classic Sunken', 'Green Haze', 'Green Haze', 'Purple Dream', 'Purple Dream', 'Purple Mist', 'Purple Mist',
        'Monochrome', 'Monochrome', 'Electric Blue', 'Electric Blue', 'Royal Blue Mono', 'Royal Blue Mono',
        'Blood Red', 'Blood Red', 'Silver Mono', 'Silver Mono', 'Bitcoin Orange', 'Bitcoin Orange', 'Red Steel', 'Red Steel', 'Cyan Solo', 'Cyan Solo',
        'Noir Wave', 'Noir Wave', 'Ink Lines', 'Ink Lines', 'Shadow Grey', 'Shadow Grey', 'Emerald Blue', 'Emerald Blue', 'Royal Violet', 'Royal Violet', 'Neon Night', 'Neon Night', 'Pink Sunset', 'Pink Sunset',
        'Golden Glory'
    ]),
    wavePattern: R.random_choice([
        'Circular Ripple', 'Circular Ripple', 'Linear Wave', 'Linear Wave',
        'Diagonal Sweep', 'Diagonal Sweep', 'Radial Burst', 'Radial Burst',
        'Cross Pattern', 'Cross Pattern', 'Square Wave', 'Square Wave',
        'Sawtooth Wave', 'Sawtooth Wave', 'Zigzag Pattern', 'Zigzag Pattern',
        'Concentric Squares', 'Smooth Center'
    ]),
    gridDensity: R.random_choice(['Dense', 'Dense']),
    speed: R.random_choice(['Glacial', 'Slow', 'Medium', 'Fast', 'Hyperactive']),
    flashingMode: R.random_choice([
        'None', 'None', 'None', 'Gentle Pulse', 'Gentle Pulse', 'Gentle Pulse',
        'Rapid Strobe', 'Rapid Strobe', 'Rapid Strobe', 'Random Glitch', 'Random Glitch', 'Random Glitch',
        'Alternating', 'Alternating', 'Alternating', 'Zebra Stripes'
    ]),
    flicker: R.random_choice(['None', 'Subtle', 'Moderate']),
    flashSpeed: flashSpeed.toFixed(3),
    lineOpacity: lineOpacity.toFixed(2),
    gridSpacing: gridSpacing.toFixed(2)
};

// Color schemes
const colorSchemes = {
    'Classic Sunken': { bgColor: 0x000a25, color1: 0x2ce1f5, color2: 0xe224e7 },
    'Green Haze': { bgColor: 0x000916, color1: 0x1bff7a, color2: 0x7aff1b },
    'Purple Dream': { bgColor: 0x090a0f, color1: 0xc92cff, color2: 0xff2c9e },
    'Purple Mist': { bgColor: 0x000916, color1: 0xc92cff, color2: 0xff2c9e },
    'Monochrome': { bgColor: 0x00070d, color1: 0x888888, color2: 0xcccccc },
    'Electric Blue': { bgColor: 0x000a25, color1: 0x00d4ff, color2: 0x0066ff },
    'Royal Blue Mono': { bgColor: 0x000510, color1: 0x4169e1, color2: 0x6495ed },
    'Blood Red': { bgColor: 0x0a0a0a, color1: 0xff0000, color2: 0xcc0000 },
    'Golden Glory': { bgColor: 0x000000, color1: 0xffd700, color2: 0xffffff },
    'Silver Mono': { bgColor: 0x0a0a0a, color1: 0xc0c0c0, color2: 0xe8e8e8 },
    'Bitcoin Orange': { bgColor: 0x0a0a0a, color1: 0xf7931a, color2: 0x808080 },
    'Red Steel': { bgColor: 0x0a0a0a, color1: 0xff4444, color2: 0x999999 },
    'Cyan Solo': { bgColor: 0x000a25, color1: 0x2ce1f5, color2: 0x2ce1f5 },
    'Noir Wave': { bgColor: 0x000a25, color1: 0x000000, color2: 0xffffff },
    'Ink Lines': { bgColor: 0xcccccc, color1: 0x000000, color2: 0x000000 },
    'Shadow Grey': { bgColor: 0x000000, color1: 0x404040, color2: 0x808080 },
    'Emerald Blue': { bgColor: 0x000a16, color1: 0x00ff88, color2: 0x0088ff },
    'Royal Violet': { bgColor: 0x000510, color1: 0x8b00ff, color2: 0x4169e1 },
    'Neon Night': { bgColor: 0x0a0a0a, color1: 0xff1493, color2: 0x00bfff },
    'Pink Sunset': { bgColor: 0x000a25, color1: 0xff1493, color2: 0xff69b4 }
};

const colorScheme = colorSchemes[TRAITS.colorScheme];

// Chaos parameters
const chaosParams = {
    'Serene': { glitchIntensity: 0, octaves: 1 },
    'Peaceful': { glitchIntensity: 0.3, octaves: 1 },
    'Gentle': { glitchIntensity: 0.7, octaves: 2 },
    'Flowing': { glitchIntensity: 1.2, octaves: 2 },
    'Steady': { glitchIntensity: 2.0, octaves: 2 },
    'Turbulent': { glitchIntensity: 3.0, octaves: 3 },
    'Chaotic': { glitchIntensity: 4.5, octaves: 3 },
    'Fractal Chaos': { glitchIntensity: 5.5, octaves: 4 },
    'Fractal Storm': { glitchIntensity: 6.5, octaves: 4 }
};

const gridDensities = { 'Dense': 55 };
const speeds = {
    'Glacial': 0.0005,
    'Slow': 0.001,
    'Medium': 0.002,
    'Fast': 0.004,
    'Hyperactive': 0.008
};

const chaos = chaosParams[TRAITS.chaosLevel];
const lineCount = gridDensities[TRAITS.gridDensity];
const speedMultiplier = speeds[TRAITS.speed];

// Glitch Wave Class
class GlitchWave {
    constructor(canvas, params) {
        this.canvas = canvas;
        this.flashSpeed = params.flashSpeed;
        this.lineOpacity = params.lineOpacity;
        this.gridSpacing = params.gridSpacing;
        this.colorScheme = params.colorScheme;
        
        this.timeOffset = parseInt(inputData.hash.substr(10, 8), 16) % 100000;
        this.startTime = Date.now();
        
        this.setup();
    }

    setup() {
        // Canvas fills entire window (not square!)
        let dp = window.devicePixelRatio;
        this.canvas.width = window.innerWidth * dp;
        this.canvas.height = window.innerHeight * dp;
        
        this.w = this.canvas.width;
        this.h = this.canvas.height;
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.w / this.h, 0.1, 1000);
        this.camera.position.set(0, 0, 17.7);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            antialias: true, 
            preserveDrawingBuffer: true 
        });
        this.renderer.setSize(this.w / dp, this.h / dp);
        this.renderer.setPixelRatio(dp);
        this.renderer.setClearColor(this.colorScheme.bgColor);

        this.createBackgroundPlane();
        this.createGrid();
        this.animate();

        window.addEventListener('resize', () => this.handleResize(), false);
    }

    createBackgroundPlane() {
        // Calculate visible area at background plane's z position
        const distance = Math.abs(this.camera.position.z - (-10));
        const vFOV = (75 * Math.PI) / 180;
        const visibleHeight = 2 * Math.tan(vFOV / 2) * distance;
        const visibleWidth = visibleHeight * this.camera.aspect;
        
        // Make background 50% larger to ensure full coverage
        const bgGeometry = new THREE.PlaneGeometry(visibleWidth * 1.5, visibleHeight * 1.5);
        const bgMaterial = new THREE.MeshBasicMaterial({ color: this.colorScheme.bgColor });
        this.bgPlane = new THREE.Mesh(bgGeometry, bgMaterial);
        this.bgPlane.position.z = -10;
        this.scene.add(this.bgPlane);
    }

    createGrid() {
        const pointsPerLine = lineCount;
        const spacing = this.gridSpacing;
        this.lines = [];
        
        this.linesGroup = new THREE.Group();
        this.scene.add(this.linesGroup);

        for (let lineY = 0; lineY < lineCount; lineY++) {
            const linePoints = [];
            const lineColors = [];
            const originalPositions = [];
            
            const yPos = (lineY - lineCount/2) * spacing;
            
            for (let pointX = 0; pointX < pointsPerLine; pointX++) {
                const xPos = (pointX - pointsPerLine/2) * spacing;
                
                linePoints.push(new THREE.Vector3(xPos, yPos, 0));
                originalPositions.push({ x: xPos, y: yPos });
                
                const color = new THREE.Color(this.colorScheme.color1);
                lineColors.push(color.r, color.g, color.b);
            }
            
            const geometry = new THREE.BufferGeometry().setFromPoints(linePoints);
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));
            
            const material = new THREE.LineBasicMaterial({ 
                vertexColors: true,
                transparent: true,
                opacity: this.lineOpacity,
                linewidth: 2
            });
            
            const line = new THREE.Line(geometry, material);
            this.linesGroup.add(line);
            
            this.lines.push({
                mesh: line,
                originalPositions: originalPositions
            });
        }
    }

    fractalNoise(x, y, time) {
        const octave1 = Math.sin(x * 0.5 + time * 0.003) * Math.cos(y * 0.3 + time * 0.004);
        
        let result = octave1;
        
        if (chaos.octaves >= 2) {
            const octave2 = Math.sin(x * 1.2 + time * 0.007) * Math.cos(y * 0.8 + time * 0.005) * 0.5;
            result += octave2;
        }
        
        if (chaos.octaves >= 3) {
            const octave3 = Math.sin(x * 2.1 + time * 0.012) * Math.cos(y * 1.5 + time * 0.009) * 0.25;
            const chaosExtra = Math.sin((x + y) * 0.2 + time * 0.002) * Math.cos((x - y) * 0.15 + time * 0.003);
            result += octave3 + chaosExtra * 0.3;
        }
        
        if (chaos.octaves >= 4) {
            const octave4 = Math.sin(x * 3.5 + time * 0.018) * Math.cos(y * 2.8 + time * 0.014) * 0.125;
            result += octave4;
        }
        
        return result;
    }

    updateLines(time) {
        let flickerOpacity = 1.0;
        if (TRAITS.flicker === 'Subtle') {
            flickerOpacity = 0.95 + Math.random() * 0.05;
        } else if (TRAITS.flicker === 'Moderate') {
            flickerOpacity = 0.85 + Math.random() * 0.15;
        }
        
        let getColorForPoint;
        
        if (TRAITS.flashingMode === 'Alternating') {
            getColorForPoint = (lineIndex, pointIndex) => {
                return (lineIndex + pointIndex) % 2 === 0 
                    ? new THREE.Color(this.colorScheme.color1) 
                    : new THREE.Color(this.colorScheme.color2);
            };
        } else if (TRAITS.flashingMode === 'Zebra Stripes') {
            getColorForPoint = (lineIndex) => {
                return lineIndex % 2 === 0 
                    ? new THREE.Color(this.colorScheme.color1) 
                    : new THREE.Color(this.colorScheme.color2);
            };
        } else if (TRAITS.flashingMode === 'Random Glitch') {
            getColorForPoint = (lineIndex) => {
                const useColor2 = Math.random() > 0.5;
                const color = useColor2 ? new THREE.Color(this.colorScheme.color2) : new THREE.Color(this.colorScheme.color1);
                if (Math.random() > 0.7) {
                    flickerOpacity = 0.5;
                }
                return color;
            };
        } else {
            const globalFlash = Math.sin(time * this.flashSpeed) > 0;
            const globalColor = globalFlash ? new THREE.Color(this.colorScheme.color2) : new THREE.Color(this.colorScheme.color1);
            getColorForPoint = () => globalColor;
        }
        
        this.lines.forEach((lineData, lineIndex) => {
            const { mesh, originalPositions } = lineData;
            const newPoints = [];
            const newColors = [];
            
            mesh.material.opacity = flickerOpacity;
            
            for (let i = 0; i < originalPositions.length; i++) {
                const pos = originalPositions[i];
                let wave = 0;
                
                if (TRAITS.wavePattern === 'Circular Ripple') {
                    const distanceFromCenter = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
                    wave = Math.sin(time * 0.001 - distanceFromCenter * 0.6) * 2;
                } else if (TRAITS.wavePattern === 'Linear Wave') {
                    wave = Math.sin(time * 0.001 + pos.x * 2) * 2;
                } else if (TRAITS.wavePattern === 'Diagonal Sweep') {
                    wave = Math.sin(time * 0.001 + (pos.x + pos.y) * 1.5) * 2;
                } else if (TRAITS.wavePattern === 'Radial Burst') {
                    const angle = Math.atan2(pos.y, pos.x);
                    wave = Math.sin(time * 0.002 + angle * 3) * 2;
                } else if (TRAITS.wavePattern === 'Cross Pattern') {
                    wave = Math.sin(time * 0.001 + pos.x * 2) * Math.cos(time * 0.001 + pos.y * 2) * 2;
                } else if (TRAITS.wavePattern === 'Square Wave') {
                    wave = Math.sin(time * 0.001 + pos.x * 1.5) * 2.2;
                } else if (TRAITS.wavePattern === 'Sawtooth Wave') {
                    const phase = (time * 0.001 + pos.x * 2) % (Math.PI * 2);
                    wave = ((phase / Math.PI) - 1) * 2;
                } else if (TRAITS.wavePattern === 'Zigzag Pattern') {
                    const diag1 = Math.sin(time * 0.001 + (pos.x + pos.y) * 1.5);
                    const diag2 = Math.sin(time * 0.001 + (pos.x - pos.y) * 1.5);
                    wave = (diag1 + diag2) * 1.2;
                } else if (TRAITS.wavePattern === 'Concentric Squares') {
                    const distX = Math.abs(pos.x);
                    const distY = Math.abs(pos.y);
                    const maxDist = Math.max(distX, distY);
                    wave = Math.sin(time * 0.001 - maxDist * 0.8) * 2;
                } else if (TRAITS.wavePattern === 'Smooth Center') {
                    const distanceFromCenter = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
                    wave = Math.sin(time * 0.0016 - distanceFromCenter * 2.0) * 2.5;
                }
                
                const glitchOffset = this.fractalNoise(pos.x, pos.y, time) * chaos.glitchIntensity;
                const finalWave = wave + glitchOffset;
                
                const color = getColorForPoint(lineIndex, i);
                newPoints.push(pos.x, pos.y, finalWave);
                newColors.push(color.r, color.g, color.b);
            }
            
            mesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(newPoints, 3));
            mesh.geometry.setAttribute('color', new THREE.Float32BufferAttribute(newColors, 3));
            mesh.geometry.attributes.position.needsUpdate = true;
            mesh.geometry.attributes.color.needsUpdate = true;
        });
    }

    animate(time = 0) {
        requestAnimationFrame((t) => this.animate(t));
        
        const elapsed = Date.now() - this.startTime;
        const deterministicTime = this.timeOffset + elapsed;
        
        this.updateLines(deterministicTime);
        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        let dp = window.devicePixelRatio;
        this.canvas.width = window.innerWidth * dp;
        this.canvas.height = window.innerHeight * dp;
        
        this.w = this.canvas.width;
        this.h = this.canvas.height;
        
        this.camera.aspect = this.w / this.h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.w / dp, this.h / dp);
        
        // Update background plane to fill entire canvas
        if (this.bgPlane) {
            const distance = Math.abs(this.camera.position.z - (-10));
            const vFOV = (75 * Math.PI) / 180;
            const visibleHeight = 2 * Math.tan(vFOV / 2) * distance;
            const visibleWidth = visibleHeight * this.camera.aspect;
            
            this.bgPlane.geometry.dispose();
            this.bgPlane.geometry = new THREE.PlaneGeometry(visibleWidth * 1.5, visibleHeight * 1.5);
        }
    }
}

// Create canvas like 256.art pattern
let c = document.createElement("canvas");
c.style.display = 'block';
c.style.width = '100%';
c.style.height = '100%';
document.body.appendChild(c);

// Set body background to match color scheme
const bodyBgColor = '#' + colorScheme.bgColor.toString(16).padStart(6, '0');
document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.overflow = 'hidden';
document.body.style.backgroundColor = bodyBgColor;

// Initialize
const glitchWave = new GlitchWave(c, {
    flashSpeed: flashSpeed,
    lineOpacity: lineOpacity,
    gridSpacing: gridSpacing,
    colorScheme: colorScheme
});

// Set window.rendered for 256.art
setTimeout(() => {
    window.rendered = c;
    console.log('✅ Glitch Maps ready for 256.art');
}, 1000);
