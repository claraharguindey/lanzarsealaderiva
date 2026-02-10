// Navegación por puntos
const mapScreen = document.getElementById('map-screen');
const content = document.getElementById('content');
const backNav = document.querySelector('.back-nav');
const dots = document.querySelectorAll('.dot');
const sections = document.querySelectorAll('section');
const linesSvg = document.getElementById('lines-svg');

// Array para trackear navegación
let navigationPath = [];
let currentSection = null;

dots.forEach(dot => {
    dot.addEventListener('click', function() {
        const sectionId = this.getAttribute('data-section');
        
        // Si hay una sección previa, dibujar línea
        if (currentSection && currentSection !== sectionId) {
            drawLineBetweenDots(currentSection, sectionId);
        }
        
        // Actualizar estado
        navigationPath.push(sectionId);
        currentSection = sectionId;
        
        // Marcar dot como visitado
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
    
    // Obtener posiciones
    const mapContainer = document.querySelector('.map-container');
    const mapRect = mapContainer.getBoundingClientRect();
    
    const fromRect = fromDot.getBoundingClientRect();
    const toRect = toDot.getBoundingClientRect();
    
    // Calcular posiciones relativas al contenedor
    const x1 = fromRect.left - mapRect.left + fromRect.width / 2;
    const y1 = fromRect.top - mapRect.top + fromRect.height / 2;
    const x2 = toRect.left - mapRect.left + toRect.width / 2;
    const y2 = toRect.top - mapRect.top + toRect.height / 2;
    
    // Crear línea SVG con color azul SIN opacidad
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#3d5a80');
    line.setAttribute('stroke-width', '2');
    line.style.opacity = '0';
    
    linesSvg.appendChild(line);
    
    // Animar la línea
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
    
    // Mantener el estado de navegación visible
    document.querySelectorAll('.dot').forEach(d => d.classList.remove('current'));
    if (currentSection) {
        document.getElementById(`dot-${currentSection}`).classList.add('current');
    }
}

// GENERADOR DE MIRADAS
const miradas = [
    'la jardinera clandestina',
    'quien ha perdido algo',
    'la geóloga amateur',
    'el recolector de sonidos',
    'la arquitecta invisible',
    'quien busca sombra',
    'el cartógrafo de olores',
    'la arqueóloga del asfalto',
    'quien cuenta historias a las piedras',
    'el observador de esquinas',
    'la coleccionista de silencios',
    'quien lee las grietas',
    'el traductor de grafitis',
    'la cronista de balcones',
    'quien camina hacia atrás',
    'el botánico de lo residual',
    'la rastreadora de reflejos',
    'quien dibuja mapas con los pies',
    'el guardián de umbrales',
    'la intérprete de fachadas',
    'quien escucha al pavimento',
    'el cazador de detalles',
    'la narradora de esquinas',
    'quien mira solo hacia arriba',
    'el coleccionista de texturas',
    'la detective de lo cotidiano',
    'quien camina sin destino',
    'el lector de ventanas',
    'la exploradora de intersticios',
    'quien busca lo que falta',
    'el cronista de lo efímero',
    'la observadora de ritmos',
    'quien encuentra patrones',
    'el seguidor de sombras',
    'la inventora de atajos',
    'quien pregunta a los muros',
    'el fotógrafo sin cámara',
    'la médium urbana',
    'quien camina en espiral',
    'el arqueólogo del presente'
];

const generarBtn = document.getElementById('generar-mirada');
const miradaOutput = document.getElementById('mirada-output');

if (generarBtn && miradaOutput) {
    generarBtn.addEventListener('click', function() {
        const randomMirada = miradas[Math.floor(Math.random() * miradas.length)];
        
        // Animación de cambio
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

// Canvas para dibujar el garabato
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

// Configuración del pincel
ctx.strokeStyle = '#98c1d9';
ctx.lineWidth = 1.5;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

let isDrawing = false;
let lastX = 0;
let lastY = 0;

document.addEventListener('mousemove', (e) => {
    // Dibujar línea continua
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

// Ajustar canvas al redimensionar
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

// PUNTOS DE IMAGEN CON HOVER - VERSION DEBUG
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
        // Crear elemento punto
        const pointEl = document.createElement('div');
        pointEl.className = 'image-point';
        pointEl.style.left = point.x + '%';
        pointEl.style.top = point.y + '%';
        pointEl.innerHTML = '✷';
        
        // Crear popup con imagen
        const popup = document.createElement('div');
        popup.className = 'image-point-popup';
        
        const img = document.createElement('img');
        const imagePath = `./images/lanzarsealaderiva_0${point.imageNumber}.jpg`;
        img.src = imagePath;
        img.alt = `Imagen ${point.imageNumber}`;
        img.loading = 'lazy';
        
        // Debug de carga de imágenes
        img.onerror = function() {
            console.error(`❌ Error cargando: ${imagePath}`);
        };
        
        img.onload = function() {
            console.log(`✅ Imagen cargada: ${imagePath}`);
        };
        
        popup.appendChild(img);
        pointEl.appendChild(popup);
        
        // Posicionar popup dinámicamente
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

// Inicializar puntos al cargar
console.log('Ejecutando createImagePoints...');
createImagePoints();
// ROTAR TEXTO - VERSIÓN AJUSTADA
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

// Aplicar rotaciones
rotateText('p', 7);        // Párrafos - rotación moderada
rotateText('h2', 10);      // H2 - más exagerado
rotateText('h3', 8);       // H3 - algo exagerado
rotateText('.subtitle', 5); // Subtítulo - sutil
rotateText('li', 5);       // Items de listas - sutil
rotateText('.label', 4);   // Labels - muy sutil

// Ocultar/mostrar estrellas según el contenido
function toggleImagePoints() {
    const imagePointsContainer = document.getElementById('image-points-container');
    const contentActive = content.classList.contains('active');
    
    if (contentActive) {
        imagePointsContainer.style.opacity = '0';
        imagePointsContainer.style.pointerEvents = 'none';
    } else {
        imagePointsContainer.style.opacity = '1';
        imagePointsContainer.style.pointerEvents = 'none'; // Mantener none para que no bloqueen clicks
    }
}

// Actualizar las funciones existentes
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

// ========== FASE DE DERIVA INICIAL ==========
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
const REQUIRED_FRAGMENTS = 15;
const REVEAL_DISTANCE = 150; // píxeles de movimiento necesarios

// Iniciar según dispositivo
if (isMobile) {
    initMobileDrift();
} else {
    initDesktopDrift();
}

// DESKTOP: Revelar con movimiento del mouse
function initDesktopDrift() {
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
        revealFragment(e.clientX, e.clientY);
        distanceTraveled = 0;
    }
}

// MÓVIL: Revelar con podómetro/touch
function initMobileDrift() {
    // Intentar usar acelerómetro
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        // iOS 13+ requiere permiso
        DeviceMotionEvent.requestPermission()
            .then(response => {
                if (response === 'granted') {
                    startAccelerometer();
                } else {
                    useTouchFallback();
                }
            })
            .catch(() => useTouchFallback());
    } else if (window.DeviceMotionEvent) {
        startAccelerometer();
    } else {
        useTouchFallback();
    }
}

function startAccelerometer() {
    let lastTime = Date.now();
    let stepCount = 0;
    
    window.addEventListener('devicemotion', (e) => {
        if (revealedCount >= REQUIRED_FRAGMENTS) return;
        
        const acc = e.accelerationIncludingGravity;
        const movement = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
        
        const currentTime = Date.now();
        
        // Detectar "paso" (pico de movimiento)
        if (movement > 20 && currentTime - lastTime > 300) {
            stepCount++;
            
            if (stepCount % 3 === 0) { // Cada 3 pasos
                revealFragmentRandom();
            }
            
            lastTime = currentTime;
        }
    });
}

function useTouchFallback() {
    let touchCount = 0;
    
    document.addEventListener('touchmove', (e) => {
        if (revealedCount >= REQUIRED_FRAGMENTS) return;
        
        touchCount++;
        
        if (touchCount % 30 === 0) { // Cada 30 movimientos de touch
            const touch = e.touches[0];
            revealFragment(touch.clientX, touch.clientY);
        }
    });
}

function revealFragment(x, y) {
    if (revealedCount >= REQUIRED_FRAGMENTS) return;
    
    const fragment = document.createElement('div');
    fragment.className = 'drift-fragment';
    fragment.textContent = driftFragments[revealedCount];
    
    // Posición con margen desde bordes
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
    setTimeout(() => {
        driftScreen.classList.add('completed');
        document.removeEventListener('mousemove', handleMouseDrift);
        
        // Iniciar web normal después de la transición
        setTimeout(() => {
            driftScreen.style.display = 'none';
        }, 800);
    }, 1000);
}

// ========== TU CÓDIGO ACTUAL CONTINÚA AQUÍ ==========
// Navegación por puntos...