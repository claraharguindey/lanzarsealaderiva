
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
    line.setAttribute('stroke', '#5b7ce6');
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

// Cursor personalizado
const cursor = document.getElementById('custom-cursor');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
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