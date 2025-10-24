// Glitch Maps - Fixed Scope for 'speeds'

console.log("Script Start - Fixing 'speeds' scope");

// --- Random Class (Fully Expanded) ---
class Random {
    constructor() {
        // Use window.inputData if available (like in simulator), else default hash
        const hash = (typeof inputData !== 'undefined' && inputData?.hash) ? inputData.hash : '0x0000000000000000000000000000000000000000000000000000000000000000';
        let offset = 0;
        if (hash.length < 66) { console.warn("Hash short:", hash); }
        for (let i = 2; i < 66 && i + 8 <= hash.length; i += 8) { offset += parseInt(hash.substr(i, 8), 16) || 0; }
        offset %= 7;
        const p = (pos) => { const cP = pos + offset; if (cP < 0 || cP + 8 > hash.length) { return 0; } return parseInt(hash.substr(cP, 8), 16) || 0; };
        let a = p(2) ^ p(34); let b = p(10) ^ p(42); let c = p(18) ^ p(50); let d = p(26) ^ p(58) ^ p(2 + (8 - offset));
        this.r = () => { a |= 0; b |= 0; c |= 0; d |= 0; let t = (((a + b) | 0) + d) | 0; d = (d + 1) | 0; a = b ^ (b >>> 9); b = (c + (c << 3)) | 0; c = (c << 21) | (c >>> 11); c = (c + t) | 0; return (t >>> 0) / 4294967296; };
        for (let i = 0; i < 256; i++) { this.r(); }
    }
    random_dec = () => this.r(); random_num = (a, b) => a + (b - a) * this.random_dec(); random_int = (a, b) => Math.floor(this.random_num(a, b + 1)); random_bool = (p) => this.random_dec() < p; random_choice = (list) => list[this.random_int(0, list.length - 1)];
}
let R; try { R = new Random(); } catch(e) { console.error("RNG Init Error:", e); R = { random_dec: Math.random, random_num: (a,b)=>a+(b-a)*Math.random(), random_int:(a,b)=>Math.floor(a+(b-a+1)*Math.random()), random_bool:(p)=>Math.random()<p, random_choice:(l)=>l[Math.floor(Math.random()*l.length)]};} // Fallback R

// --- Read Traits (Using .value) ---
let TRAITS = {};
try {
    if (typeof inputData !== 'undefined' && inputData !== null) {
        TRAITS = { chaosLevel: inputData["Chaos Level"]?.value ?? "Serene", colorScheme: inputData["Color Scheme"]?.value ?? "Classic Sunken", wavePattern: inputData["Wave Pattern"]?.value ?? "Linear Wave", gridDensity: inputData["Grid Density"]?.value ?? "Dense", speed: inputData["Speed"]?.value ?? "Medium", flashingMode: inputData["Flashing Mode"]?.value ?? "None", flicker: inputData["Flicker"]?.value ?? "None" };
         console.log("Traits read/defaulted:", TRAITS);
    } else {
         console.warn("inputData missing, using default traits.");
         TRAITS = { chaosLevel: "Serene", colorScheme: "Classic Sunken", wavePattern: "Linear Wave", gridDensity: "Dense", speed: "Medium", flashingMode: "None", flicker: "None" };
    }
} catch (e) { console.error("Error reading traits:", e); TRAITS = { chaosLevel: "Serene", colorScheme: "Classic Sunken", wavePattern: "Linear Wave", gridDensity: "Dense", speed: "Medium", flashingMode: "None", flicker: "None" }; }

// --- Definitions ---
let selectedColorScheme, chaos, lineCount, speedMultiplier, speeds, flashSpeed, lineOpacity, gridSpacing; // Declare speeds here
try {
    const colorSchemes = { 'Classic Sunken': { bgColor: 0x000a25, color1: 0x2ce1f5, color2: 0xe224e7 }, 'Green Haze': { bgColor: 0x000916, color1: 0x1bff7a, color2: 0x7aff1b }, 'Purple Dream': { bgColor: 0x090a0f, color1: 0xc92cff, color2: 0xff2c9e }, 'Purple Mist': { bgColor: 0x000916, color1: 0xc92cff, color2: 0xff2c9e }, 'Monochrome': { bgColor: 0x00070d, color1: 0x888888, color2: 0xcccccc }, 'Electric Blue': { bgColor: 0x000a25, color1: 0x00d4ff, color2: 0x0066ff }, 'Royal Blue Mono': { bgColor: 0x000510, color1: 0x4169e1, color2: 0x6495ed }, 'Blood Red': { bgColor: 0x0a0a0a, color1: 0xff0000, color2: 0xcc0000 }, 'Golden Glory': { bgColor: 0x000000, color1: 0xffd700, color2: 0xffffff }, 'Silver Mono': { bgColor: 0x0a0a0a, color1: 0xc0c0c0, color2: 0xe8e8e8 }, 'Bitcoin Orange': { bgColor: 0x0a0a0a, color1: 0xf7931a, color2: 0x808080 }, 'Red Steel': { bgColor: 0x0a0a0a, color1: 0xff4444, color2: 0x999999 }, 'Cyan Solo': { bgColor: 0x000a25, color1: 0x2ce1f5, color2: 0x2ce1f5 }, 'Noir Wave': { bgColor: 0x000a25, color1: 0x000000, color2: 0xffffff }, 'Ink Lines': { bgColor: 0xcccccc, color1: 0x000000, color2: 0x000000 }, 'Shadow Grey': { bgColor: 0x000000, color1: 0x404040, color2: 0x808080 }, 'Emerald Blue': { bgColor: 0x000a16, color1: 0x00ff88, color2: 0x0088ff }, 'Royal Violet': { bgColor: 0x000510, color1: 0x8b00ff, color2: 0x4169e1 }, 'Neon Night': { bgColor: 0x0a0a0a, color1: 0xff1493, color2: 0x00bfff }, 'Pink Sunset': { bgColor: 0x000a25, color1: 0xff1493, color2: 0xff69b4 } };
    selectedColorScheme = colorSchemes[TRAITS.colorScheme] || colorSchemes['Classic Sunken'];
    const chaosParams = { 'Serene': { glitchIntensity: 0, octaves: 1 }, 'Peaceful': { glitchIntensity: 0.3, octaves: 1 }, 'Gentle': { glitchIntensity: 0.7, octaves: 2 }, 'Flowing': { glitchIntensity: 1.2, octaves: 2 }, 'Steady': { glitchIntensity: 2.0, octaves: 2 }, 'Turbulent': { glitchIntensity: 3.0, octaves: 3 }, 'Chaotic': { glitchIntensity: 4.5, octaves: 3 }, 'Fractal Chaos': { glitchIntensity: 5.0, octaves: 4 }, 'Fractal Storm': { glitchIntensity: 5.5, octaves: 4 } };
    chaos = chaosParams[TRAITS.chaosLevel] || chaosParams['Serene'];
    const gridDensities = { 'Dense': 55 };
    lineCount = gridDensities[TRAITS.gridDensity] || 55;
    // Define speeds object here
    speeds = { 'Glacial': 0.0005, 'Slow': 0.001, 'Medium': 0.002, 'Fast': 0.004, 'Hyperactive': 0.008 };
    speedMultiplier = speeds[TRAITS.speed] || speeds['Medium'];
    flashSpeed = R?.random_num(0.02, 0.06) ?? 0.04;
    lineOpacity = 1.0;
    gridSpacing = R?.random_num(0.26, 0.32) ?? 0.3;
} catch (e) { console.error("Defs Error:", e); /* Set defaults */ selectedColorScheme = {bgColor:0x0, color1:0xfff, color2:0xfff}; chaos={glitchIntensity: 0, octaves: 1}; lineCount=55; speeds={'Medium': 0.002}; speedMultiplier=0.002; flashSpeed=0.04; lineOpacity=1.0; gridSpacing=0.3; }

// --- GlitchWave Class ---
class GlitchWave {
    constructor(canvas, params) {
        this.canvas = canvas;
        this.params = params; // Now includes speeds, speedMultiplier, flashSpeed etc.
        this.timeOffset = (typeof inputData !== 'undefined' && inputData?.hash) ? parseInt(inputData.hash.substr(10, 8), 16) % 100000 : Math.floor(Math.random()*100000);
        this.startTime = Date.now();
        try { this.setup(); } catch(e){ console.error("Setup Error:", e); }
    }

    setup() {
        let dp = window.devicePixelRatio || 1; const cw = window.innerWidth; const ch = window.innerHeight;
        this.canvas.width = cw * dp; this.canvas.height = ch * dp; this.w = this.canvas.width; this.h = this.canvas.height;
        this.scene = new THREE.Scene(); this.camera = new THREE.PerspectiveCamera(75, this.w / this.h, 0.1, 2000); this.camera.position.set(0, 0, 17.7); this.camera.lookAt(0, 0, 0);
        try {
            this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, preserveDrawingBuffer: true, alpha: false });
            this.renderer.setSize(cw, ch); this.renderer.setPixelRatio(dp);
            this.renderer.setClearColor(this.params.colorScheme.bgColor); // Use passed colorScheme
            this.renderer.autoClear = true; this.renderer.localClippingEnabled = false;
        } catch (e) { console.error("Renderer Error:", e); return; }
        try { this.createBackgroundPlane(); } catch (e) { console.error("BG Error:", e); }
        try { this.createGrid(); } catch (e) { console.error("Grid Error:", e); }
        try { this.animate(); } catch (e) { console.error("Anim Start Error:", e); }
        window.addEventListener('resize', () => this.handleResize(), false);
    }

    createBackgroundPlane() { const d=Math.abs(this.camera.position.z-(-10)); const vF=(75*Math.PI)/180; const vH=2*Math.tan(vF/2)*d; const cA=this.w/this.h; const vW=vH*cA; const g=new THREE.PlaneGeometry(vW*1.5,vH*1.5); const m=new THREE.MeshBasicMaterial({color:this.params.colorScheme.bgColor}); this.bgPlane=new THREE.Mesh(g,m); this.bgPlane.position.z=-10; this.scene.add(this.bgPlane); }

    createGrid() {
        const pPL = this.params.lineCount; // Use lineCount from params
        const bS = this.params.gridSpacing; // Use gridSpacing from params
        const vS = Math.min(window.innerWidth, window.innerHeight) / 2000; const sp = bS * vS * 1;
        this.lines = []; this.linesGroup = new THREE.Group(); this.scene.add(this.linesGroup);
        for (let lY = 0; lY < pPL; lY++) { const lP=[]; const lC=[]; const oP=[]; const yP=(lY-pPL/2)*sp; for (let pX = 0; pX < pPL; pX++) { const xP=(pX-pPL/2)*sp; lP.push(new THREE.Vector3(xP,yP,0)); oP.push({x:xP,y:yP}); const c=new THREE.Color(this.params.colorScheme.color1); lC.push(c.r,c.g,c.b); } try { const geo=new THREE.BufferGeometry().setFromPoints(lP); geo.setAttribute('color',new THREE.BufferAttribute(new Float32Array(lC),3)); const mat=new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:this.params.lineOpacity,linewidth:2.5}); const ln=new THREE.Line(geo,mat); this.linesGroup.add(ln); this.lines.push({mesh:ln,originalPositions:oP}); } catch (e) { console.error(`Line ${lY} Error:`, e); } }
    }

    // Access speeds and speedMultiplier via this.params
    fractalNoise(x, y, time) {
        // Ensure speeds['Medium'] exists, provide a fallback if needed
        const mediumSpeed = (this.params.speeds && this.params.speeds['Medium']) ? this.params.speeds['Medium'] : 0.002;
        const timeFactor = time * (this.params.speedMultiplier || mediumSpeed) / mediumSpeed; // Use this.params
        const octave1 = Math.sin(x * 0.5 + timeFactor * 0.003) * Math.cos(y * 0.3 + timeFactor * 0.004);
        let result = octave1;
        // Use this.params.chaos here
        if (this.params.chaos?.octaves >= 2) { result += Math.sin(x * 1.2 + timeFactor * 0.007) * Math.cos(y * 0.8 + timeFactor * 0.005) * 0.5; }
        if (this.params.chaos?.octaves >= 3) { result += Math.sin(x * 2.1 + timeFactor * 0.012) * Math.cos(y * 1.5 + timeFactor * 0.009) * 0.25 + Math.sin((x + y) * 0.2 + timeFactor * 0.002) * Math.cos((x - y) * 0.15 + timeFactor * 0.003) * 0.3; }
        if (this.params.chaos?.octaves >= 4) { result += Math.sin(x * 3.5 + timeFactor * 0.018) * Math.cos(y * 2.8 + timeFactor * 0.014) * 0.125; }
        return result;
     }

    // Access traits via TRAITS (global), access params via this.params
    updateLines(time) {
        if (!this.lines?.length) { return; } try {
            let fO=1.0;
            // Use global TRAITS for flicker check
            if(TRAITS.flicker==='Subtle'&&R)fO=0.95+R.random_dec()*0.05;
            else if(TRAITS.flicker==='Moderate'&&R)fO=0.85+R.random_dec()*0.15;

            let gCP;
            // Use global TRAITS for flashing check
            if(TRAITS.flashingMode==='Random Glitch'&&R){
                 gCP=()=>{ const u2=R.random_dec()>0.5; const cl=u2?new THREE.Color(this.params.colorScheme.color2):new THREE.Color(this.params.colorScheme.color1); if(R.random_dec()>0.7)fO=0.5; return cl; };
            } else {
                 // Use flashSpeed, speedMultiplier, speeds from this.params
                 const mediumSpeed = (this.params.speeds && this.params.speeds['Medium']) ? this.params.speeds['Medium'] : 0.002;
                 const effectiveFlashSpeed=(this.params.flashSpeed||0.04)*(this.params.speedMultiplier||mediumSpeed)/mediumSpeed;
                 const globalFlash = Math.sin(time * effectiveFlashSpeed) > 0;
                 const globalColor = globalFlash ? new THREE.Color(this.params.colorScheme.color2) : new THREE.Color(this.params.colorScheme.color1);
                 gCP=()=>globalColor;
            }

            this.lines.forEach((lD)=>{
                 if(!lD?.mesh?.geometry?.attributes?.position||!lD?.originalPositions){return;}
                 const posArr=lD.mesh.geometry.attributes.position.array;
                 const oP=lD.originalPositions;
                 if(posArr.length!==oP.length*3){console.warn("Pos array length mismatch"); return;}
                 lD.mesh.material.opacity = fO;

                 for(let i=0; i<oP.length; i++){
                     const p=oP[i];
                     if(!p||typeof p.x!=='number'||typeof p.y!=='number')continue;
                     let w=0;
                     const tF=time; // Use time directly for wave patterns, noise applies multiplier
                     // Full wave pattern logic using global TRAITS.wavePattern
                     if(TRAITS.wavePattern==='Circular Ripple'){const d=Math.sqrt(p.x*p.x+p.y*p.y); w=Math.sin(tF*0.001-d*0.6)*2;}
                     else if(TRAITS.wavePattern==='Linear Wave'){w=Math.sin(tF*0.001+p.x*2)*2;}
                     else if(TRAITS.wavePattern==='Diagonal Sweep'){w=Math.sin(tF*0.001+(p.x+p.y)*1.5)*2;}
                     else if(TRAITS.wavePattern==='Radial Burst'){const a=Math.atan2(p.y,p.x); w=Math.sin(tF*0.002+a*3)*2;}
                     else if(TRAITS.wavePattern==='Cross Pattern'){w=Math.sin(tF*0.001+p.x*2)*Math.cos(tF*0.001+p.y*2)*2;}
                     else if(TRAITS.wavePattern==='Square Wave'){w=Math.sin(tF*0.001+p.x*1.5)*2.2;}
                     else if(TRAITS.wavePattern==='Sawtooth Wave'){const ph=(tF*0.001+p.x*2)%(Math.PI*2); w=((ph/Math.PI)-1)*2;}
                     else if(TRAITS.wavePattern==='Zigzag Pattern'){const d1=Math.sin(tF*0.001+(p.x+p.y)*1.5); const d2=Math.sin(tF*0.001+(p.x-p.y)*1.5); w=(d1+d2)*1.2;}
                     else if(TRAITS.wavePattern==='Concentric Squares'){const dx=Math.abs(p.x); const dy=Math.abs(p.y); const mD=Math.max(dx,dy); w=Math.sin(tF*0.001-mD*0.8)*2;}
                     else if(TRAITS.wavePattern==='Smooth Center'){const d=Math.sqrt(p.x*p.x+p.y*p.y); w=Math.sin(tF*0.0016-d*2.0)*2.5;}

                     // Use chaos from this.params
                     const gO=this.fractalNoise(p.x,p.y,time)*(this.params.chaos.glitchIntensity||0);
                     const fW=w+gO;
                     const clr=gCP();

                     posArr[i*3]=p.x; posArr[i*3+1]=p.y; posArr[i*3+2]=fW;
                 }
                 lD.mesh.geometry.attributes.position.needsUpdate=true;
             });
        } catch(e){console.error("UpdateLines Error:",e);}
    }

    animate() {
        try {
            requestAnimationFrame(()=>this.animate());
            if(!this.renderer||!this.scene||!this.camera){return;}
            const elapsed = Date.now()-this.startTime;
            const deterministicTime = this.timeOffset + elapsed;
            this.updateLines(deterministicTime);
            this.renderer.render(this.scene,this.camera);
        } catch(e){ console.error("Anim Loop Error:",e); }
    }

    handleResize() {
        try {
            let dp=window.devicePixelRatio||1; const nW=window.innerWidth; const nH=window.innerHeight;
            this.canvas.width=nW*dp; this.canvas.height=nH*dp; this.w=this.canvas.width; this.h=this.canvas.height;
            if(this.renderer){this.renderer.setSize(nW,nH);}
            if(this.camera){this.camera.aspect=nW/nH; this.camera.updateProjectionMatrix();}
            if(this.bgPlane){const d=Math.abs(this.camera.position.z-(-10)); const vF=(75*Math.PI)/180; const vH=2*Math.tan(vF/2)*d; const vW=vH*this.camera.aspect; this.bgPlane.geometry.dispose(); this.bgPlane.geometry=new THREE.PlaneGeometry(vW*1.5,vH*1.5);}
            // console.log("Resized");
        } catch(e){ console.error("Resize Error:",e); }
     }
} // End GlitchWave Class

// --- Initialization ---
let c = document.createElement("canvas");
c.style.display='block'; c.style.width='100%'; c.style.height='100%';
document.body.appendChild(c);
let bodyBgColor = '#000000'; // Default black
try { if (selectedColorScheme?.bgColor != null) { bodyBgColor = '#' + selectedColorScheme.bgColor.toString(16).padStart(6, '0'); } else { console.warn("Using default BG color."); } } catch (e) { console.error("BG Color Error:", e); }
document.body.style.margin = '0'; document.body.style.padding = '0'; document.body.style.overflow = 'hidden'; document.body.style.backgroundColor = bodyBgColor;

let glitchWaveInstance; // Store instance
try {
    // Pass ALL necessary variables/objects into the class instance via params
    const glitchParams = {
        flashSpeed: flashSpeed ?? 0.04,
        lineOpacity: lineOpacity ?? 1.0,
        gridSpacing: gridSpacing ?? 0.3,
        colorScheme: selectedColorScheme ?? { bgColor: 0x0, color1: 0xfff, color2: 0xfff },
        chaos: chaos ?? { glitchIntensity: 0, octaves: 1 }, // Pass chaos object
        lineCount: lineCount ?? 55,                     // Pass lineCount
        speeds: speeds ?? {'Medium': 0.002},             // Pass speeds object
        speedMultiplier: speedMultiplier ?? 0.002       // Pass calculated speedMultiplier
    };
    glitchWaveInstance = new GlitchWave(c, glitchParams);

    // --- Use the original setTimeout for platform ---
    // (Keep this the same as before, no changes needed here)
    setTimeout(() => {
        try {
             if (glitchWaveInstance?.renderer?.domElement) {
                 window.rendered = glitchWaveInstance.renderer.domElement;
                 console.log('✅ Full GM Code (Fixed Scope) ready for preview capture');
             } else { console.error("CRITICAL: Cannot find canvas in setTimeout."); window.rendered = c; } // Fallback
         } catch (e) { console.error("Timeout Error:", e); window.rendered = c; } // Fallback
    }, 1000); // Original 1-second delay

} catch (e) { console.error("CRITICAL Init Error:", e); window.rendered = c; } // Fallback
