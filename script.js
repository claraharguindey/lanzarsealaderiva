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
    
    // Crear línea SVG
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#98c1d9');
    line.setAttribute('stroke-width', '2');
    line.style.opacity = '0';
    
    linesSvg.appendChild(line);
    
    // Animar la línea
    setTimeout(() => {
        line.style.transition = 'opacity 0.5s';
        line.style.opacity = '0.7';
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

// Cursor personalizado con garabato continuo
const cursor = document.getElementById('custom-cursor');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

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
    mouseX = e.clientX;
    mouseY = e.clientY;
    
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

function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
}

// Activar cursor solo en desktop
if (window.innerWidth > 768) {
    cursor.style.display = 'block';
    animateCursor();
}

// Efecto hover en dots
dots.forEach(dot => {
    dot.addEventListener('mouseenter', function() {
        cursor.style.transform = 'scale(2)';
    });
    dot.addEventListener('mouseleave', function() {
        cursor.style.transform = 'scale(1)';
    });
});

// Efecto hover en botón generar
if (generarBtn) {
    generarBtn.addEventListener('mouseenter', function() {
        cursor.style.transform = 'scale(2)';
    });
    generarBtn.addEventListener('mouseleave', function() {
        cursor.style.transform = 'scale(1)';
    });
}