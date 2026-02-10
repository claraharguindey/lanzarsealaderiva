const mapScreen = document.getElementById('map-screen');
const content = document.getElementById('content');
const backNav = document.querySelector('.back-nav');
const dots = document.querySelectorAll('.dot');
const sections = document.querySelectorAll('section');
const linesSvg = document.getElementById('lines-svg');

let navigationPath = [];
let currentSection = null;

dots.forEach(dot => {
    dot.addEventListener('click', function() {
        const sectionId = this.getAttribute('data-section');
        
        if (currentSection && currentSection !== sectionId) {
            drawLineBetweenDots(currentSection, sectionId);
        }
        
        navigationPath.push(sectionId);
        currentSection = sectionId;
        
        document.querySelectorAll('.dot').forEach(d => d.classList.remove('current'));
        this.classList.add('visited', 'current');
        
        showSection(sectionId);
    });
});

backNav.addEventListener('click', function() {
    hideContent();
});

function drawLineBetweenDots(fromSection, toSection) {
    const fromDot = document.getElementById(`dot-${fromSection}`);
    const toDot = document.getElementById(`dot-${toSection}`);
    
    if (!fromDot || !toDot) return;
    
    const mapContainer = document.querySelector('.map-container');
    const mapRect = mapContainer.getBoundingClientRect();
    
    const fromRect = fromDot.getBoundingClientRect();
    const toRect = toDot.getBoundingClientRect();
    
    const x1 = fromRect.left - mapRect.left + fromRect.width / 2;
    const y1 = fromRect.top - mapRect.top + fromRect.height / 2;
    const x2 = toRect.left - mapRect.left + toRect.width / 2;
    const y2 = toRect.top - mapRect.top + toRect.height / 2;
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#3d5a80');
    line.setAttribute('stroke-width', '2');
    line.style.opacity = '0';
    
    linesSvg.appendChild(line);
    
    setTimeout(() => {
        line.style.transition = 'opacity 0.5s';
        line.style.opacity = '1';
    }, 50);
}

function showSection(sectionId) {
    mapScreen.classList.add('hidden');
    content.classList.add('active');
    backNav.style.display = 'block';
    
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    document.getElementById(sectionId).classList.add('active');
    window.scrollTo(0, 0);
}

function hideContent() {
    mapScreen.classList.remove('hidden');
    content.classList.remove('active');
    backNav.style.display = 'none';
    
    document.querySelectorAll('.dot').forEach(d => d.classList.remove('current'));
    if (currentSection) {
        document.getElementById(`dot-${currentSection}`).classList.add('current');
    }
}

const miradas = [
    'quien cuida de los jardines',
    'quien ha perdido algo',
    'quien busca sombra',
    'quien cuenta historias a las piedras',
    'quien lee las grietas',
    'quien pinta las calles',
    'quien camina hacia atrás',
    'quien dibuja mapas',
    'quien mira solo hacia arriba',
    'quien camina sin destino',
    'quien cotillea',
    'la inventora de atajos',
];

const generarBtn = document.getElementById('generar-mirada');
const miradaOutput = document.getElementById('mirada-output');

if (generarBtn && miradaOutput) {
    generarBtn.addEventListener('click', function() {
        const randomMirada = miradas[Math.floor(Math.random() * miradas.length)];
        miradaOutput.style.opacity = '0';
        miradaOutput.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            miradaOutput.textContent = randomMirada;
            miradaOutput.style.transition = 'opacity 0.3s, transform 0.3s';
            miradaOutput.style.opacity = '1';
            miradaOutput.style.transform = 'translateY(0)';
        }, 150);
    });
}

const drawCanvas = document.createElement('canvas');
drawCanvas.id = 'draw-canvas';
drawCanvas.style.position = 'fixed';
drawCanvas.style.top = '0';
drawCanvas.style.left = '0';
drawCanvas.style.width = '100vw';
drawCanvas.style.height = '100vh';
drawCanvas.style.pointerEvents = 'none';
drawCanvas.style.zIndex = '5';
drawCanvas.style.opacity = '0.25';
document.body.appendChild(drawCanvas);

const ctx = drawCanvas.getContext('2d');
drawCanvas.width = window.innerWidth;
drawCanvas.height = window.innerHeight;

ctx.strokeStyle = '#98c1d9';
ctx.lineWidth = 1.5;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

let isDrawing = false;
let lastX = 0;
let lastY = 0;

document.addEventListener('mousemove', (e) => {
    if (!isDrawing) {
        lastX = e.clientX;
        lastY = e.clientY;
        isDrawing = true;
    }
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    
    lastX = e.clientX;
    lastY = e.clientY;
});

window.addEventListener('resize', () => {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = drawCanvas.width;
    tempCanvas.height = drawCanvas.height;
    tempCtx.drawImage(drawCanvas, 0, 0);
    
    drawCanvas.width = window.innerWidth;
    drawCanvas.height = window.innerHeight;
    ctx.drawImage(tempCanvas, 0, 0);
    
    ctx.strokeStyle = '#98c1d9';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
});

console.log('Iniciando creación de puntos de imagen...');

const imagePointsData = [
    { x: 25, y: 40, imageNumber: 1 },
    { x: 60, y: 25, imageNumber: 2 },
    { x: 45, y: 60, imageNumber: 3 },
    { x: 80, y: 50, imageNumber: 4 },
    { x: 15, y: 75, imageNumber: 5 },
    { x: 35, y: 30, imageNumber: 6 },
    { x: 70, y: 70, imageNumber: 7 },
    { x: 50, y: 45, imageNumber: 8 },
];

function createImagePoints() {
    const container = document.getElementById('image-points-container');
    
    if (!container) {
        console.error('❌ No se encontró el contenedor image-points-container');
        return;
    }
    
    console.log('✅ Contenedor encontrado, creando', imagePointsData.length, 'puntos...');
    
    imagePointsData.forEach((point, index) => {
        const pointEl = document.createElement('div');
        pointEl.className = 'image-point';
        pointEl.style.left = point.x + '%';
        pointEl.style.top = point.y + '%';
        pointEl.innerHTML = '✷';
        
        const popup = document.createElement('div');
        popup.className = 'image-point-popup';
        
        const img = document.createElement('img');
        const imagePath = `./images/lanzarsealaderiva_0${point.imageNumber}.jpg`;
        img.src = imagePath;
        img.alt = `Imagen ${point.imageNumber}`;
        img.loading = 'lazy';
        
        img.onerror = function() {
            console.error(`❌ Error cargando: ${imagePath}`);
        };
        
        img.onload = function() {
            console.log(`✅ Imagen cargada: ${imagePath}`);
        };
        
        popup.appendChild(img);
        pointEl.appendChild(popup);
        
        pointEl.addEventListener('mouseenter', function() {
            const rect = pointEl.getBoundingClientRect();
            const popupWidth = 300;
            const popupHeight = 400;
            
            popup.style.left = '25px';
            popup.style.top = '0';
            
            if (rect.right + popupWidth > window.innerWidth) {
                popup.style.left = 'auto';
                popup.style.right = '25px';
            }
            
            if (rect.bottom + popupHeight > window.innerHeight) {
                popup.style.top = 'auto';
                popup.style.bottom = '0';
            }
        });
        
        container.appendChild(pointEl);
        console.log(`✅ Punto ${index + 1} añadido`);
    });
}

console.log('Ejecutando createImagePoints...');
createImagePoints();
function rotateText(selector, maxRotation = 3) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
        const text = element.textContent;
        const letters = text.split('');
        
        element.innerHTML = letters.map(letter => {
            if (letter === ' ') return ' ';
            const rotation = (Math.random() - 0.5) * maxRotation * 2;
            return `<span style="display: inline-block; transform: rotate(${rotation}deg);">${letter}</span>`;
        }).join('');
    });
}

rotateText('p', 7);        
rotateText('h2', 10);      
rotateText('h3', 8);       
rotateText('.subtitle', 5); 
rotateText('li', 5);       
rotateText('.label', 4);  

function toggleImagePoints() {
    const imagePointsContainer = document.getElementById('image-points-container');
    const contentActive = content.classList.contains('active');
    
    if (contentActive) {
        imagePointsContainer.style.opacity = '0';
        imagePointsContainer.style.pointerEvents = 'none';
    } else {
        imagePointsContainer.style.opacity = '1';
        imagePointsContainer.style.pointerEvents = 'none'; 
    }
}

const originalShowSection = showSection;
showSection = function(sectionId) {
    originalShowSection(sectionId);
    toggleImagePoints();
};

const originalHideContent = hideContent;
hideContent = function() {
    originalHideContent();
    toggleImagePoints();
};

// ========== FASE DE DERIVA INICIAL - VERSIÓN AJUSTADA ==========
const driftFragments = [
    "mirar la ciudad es siempre un ejercicio político",
    "cada cuerpo porta sus propios deseos",
    "el juego constreñido a los límites del parque",
    "la ciudad diseñada para otros cuerpos",
    "fuentes clausuradas en el barrio de las aguas",
    "el barrio se infla de gente rica",
    "se desinfla de vecinas de siempre",
    "busca calles pequeñas y pintorescas",
    "la ciudad se torna imagen",
    "ausencia de lugares de descanso",
    "calles amables, cuerpos cansados",
    "caminar desautomatiza la percepción",
    "geografías afectivas borradas",
    "el espacio no es un contenedor vacío",
    "un campo de fuerzas y conflictos"
];

const driftScreen = document.getElementById('drift-screen');
const driftContainer = document.getElementById('drift-container');
const revealedCountDisplay = document.getElementById('revealed-count');

let revealedCount = 0;
let distanceTraveled = 0;
let lastMouseX = 0;
let lastMouseY = 0;

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
const REQUIRED_FRAGMENTS = 15;
const REVEAL_DISTANCE = 200;

let lastAcceleration = { x: 0, y: 0, z: 0 };
let stepDetected = false;
const STEP_THRESHOLD = 12;
const STEP_COOLDOWN = 350; 
const STEPS_PER_FRAGMENT = 1; // 1 fragmento por paso
let stepCounter = 0;

if (isMobile) {
    initMobileDrift();
} else {
    initDesktopDrift();
}

function initDesktopDrift() {
    showInstruction('mueve el ratón para revelar los fragmentos');
    document.addEventListener('mousemove', handleMouseDrift);
}

function handleMouseDrift(e) {
    if (revealedCount >= REQUIRED_FRAGMENTS) return;
    
    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    distanceTraveled += distance;
    
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    
    if (distanceTraveled > REVEAL_DISTANCE) {
        revealFragmentRandom();
        distanceTraveled = 0;
    }
}

function initMobileDrift() {
    console.log('📱 Modo móvil iniciado');
    
    const needsPermission = typeof DeviceMotionEvent !== 'undefined' && 
                           typeof DeviceMotionEvent.requestPermission === 'function';
    
    if (needsPermission) {
        showPermissionButton();
    } else if (window.DeviceMotionEvent) {
        startPedometer();
    } else {
        useTapFallback();
    }
}

function showPermissionButton() {
    const permButton = document.createElement('button');
    permButton.textContent = 'activar';
    permButton.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 0;
        background: transparent;
        color: #3d5a80;
        border: none;
        font-family: inherit;
        font-size: 18px;
        cursor: pointer;
        z-index: 10000;
        -webkit-tap-highlight-color: transparent;
    `;
    
    permButton.onclick = function() {
        console.log('🖱️ Solicitando permisos...');
        
        DeviceMotionEvent.requestPermission()
            .then(response => {
                console.log('📋 Respuesta:', response);
                
                if (response === 'granted') {
                    permButton.remove();
                    startPedometer();
                } else {
                    permButton.remove();
                    showPermissionDenied();
                }
            })
            .catch(error => {
                console.error('💥 Error:', error);
                permButton.remove();
                useTapFallback();
            });
    };
    
    driftScreen.appendChild(permButton);
}

function showPermissionDenied() {
    showInstruction('toca la pantalla para revelar');
    setTimeout(() => {
        useTapFallback();
    }, 2000);
}

function startPedometer() {
    console.log('🚶 Podómetro activado');
    
    window.addEventListener('devicemotion', handleMotion);
    showInstruction('camina para revelar los fragmentos');
    
    showStepCounter();
}

function showStepCounter() {
    const counter = document.createElement('div');
    counter.id = 'step-counter';
    counter.textContent = '0';
    counter.style.cssText = `
        position: fixed;
        top: 30px;
        right: 30px;
        background: #98c1d9;
        color: #293241;
        padding: 8px 16px;
        border: none;
        border-radius: 20px;
        font-size: 13px;
        font-family: inherit;
        z-index: 999;
    `;
    
    driftScreen.appendChild(counter);
}

function updateStepCounter() {
    const counter = document.getElementById('step-counter');
    if (counter) {
        counter.textContent = `${stepCounter}`;
    }
}

function handleMotion(event) {
    if (revealedCount >= REQUIRED_FRAGMENTS) return;
    
    const acc = event.accelerationIncludingGravity;
    
    if (!acc || acc.x === null) return;
    
    const deltaX = Math.abs(acc.x - lastAcceleration.x);
    const deltaY = Math.abs(acc.y - lastAcceleration.y);
    const deltaZ = Math.abs(acc.z - lastAcceleration.z);
    const totalDelta = deltaX + deltaY + deltaZ;
    
    if (totalDelta > STEP_THRESHOLD && !stepDetected) {
        stepDetected = true;
        stepCounter++;
        
        updateStepCounter();
        console.log(`👟 Paso ${stepCounter} (Δ=${totalDelta.toFixed(1)})`);
        
        // Revelar fragmento en CADA paso
        if (stepCounter % STEPS_PER_FRAGMENT === 0) {
            revealFragmentRandom();
            vibrate();
            console.log(`✨ Fragmento revelado! (${revealedCount}/${REQUIRED_FRAGMENTS})`);
        }
        
        setTimeout(() => {
            stepDetected = false;
        }, STEP_COOLDOWN);
    }
    
    lastAcceleration = { x: acc.x, y: acc.y, z: acc.z };
}

function useTapFallback() {
    console.log('👆 Modo táctil');
    
    let tapCount = 0;
    
    driftScreen.addEventListener('touchstart', (e) => {
        if (revealedCount >= REQUIRED_FRAGMENTS) return;
        
        tapCount++;
        
        if (tapCount % 2 === 0) {
            const touch = e.touches[0];
            revealFragment(touch.clientX, touch.clientY);
            vibrate();
        }
    });
}

function showInstruction(text) {
    const instruction = document.createElement('div');
    instruction.textContent = text;
    instruction.style.cssText = `
        position: fixed;
        bottom: 120px;
        left: 50%;
        transform: translateX(-50%);
        background: #3d5a80;
        color: #f1faee;
        padding: 12px 25px;
        border: none;
        border-radius: 25px;
        font-size: 14px;
        font-family: inherit;
        z-index: 999;
        text-align: center;
        max-width: 80%;
    `;
    
    driftScreen.appendChild(instruction);
    setTimeout(() => {
        instruction.style.transition = 'opacity 0.5s';
        instruction.style.opacity = '0';
        setTimeout(() => instruction.remove(), 500);
    }, 4000);
}

function vibrate() {
    if ('vibrate' in navigator) {
        navigator.vibrate(50);
    }
}

function revealFragment(x, y) {
    if (revealedCount >= REQUIRED_FRAGMENTS) return;
    
    const fragment = document.createElement('div');
    fragment.className = 'drift-fragment';
    fragment.textContent = driftFragments[revealedCount];
    
    const safeX = Math.max(20, Math.min(x, window.innerWidth - 320));
    const safeY = Math.max(20, Math.min(y, window.innerHeight - 100));
    
    fragment.style.left = safeX + 'px';
    fragment.style.top = safeY + 'px';
    
    driftContainer.appendChild(fragment);
    
    setTimeout(() => fragment.classList.add('visible'), 10);
    
    revealedCount++;
    revealedCountDisplay.textContent = revealedCount;
    
    if (revealedCount >= REQUIRED_FRAGMENTS) {
        completeDrift();
    }
}

function revealFragmentRandom() {
    const x = Math.random() * (window.innerWidth - 320) + 20;
    const y = Math.random() * (window.innerHeight - 100) + 20;
    revealFragment(x, y);
}

function completeDrift() {
    console.log('🎉 Deriva completada');
    
    const counter = document.getElementById('step-counter');
    if (counter) counter.remove();
    
    setTimeout(() => {
        driftScreen.classList.add('completed');
        window.removeEventListener('devicemotion', handleMotion);
        document.removeEventListener('mousemove', handleMouseDrift);
        
        setTimeout(() => {
            driftScreen.style.display = 'none';
        }, 800);
    }, 1000);
}