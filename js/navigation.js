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
        
        if (sectionId === 'drift') {
            window.location.reload();
            return;
        }
        
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

const drawLineBetweenDots = (fromSection, toSection) => {
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

const showSection = (sectionId) => {
    mapScreen.classList.add('hidden');
    content.classList.add('active');
    backNav.style.display = 'block';
    
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    window.scrollTo(0, 0);
    
    if (typeof toggleImagePoints === 'function') {
        toggleImagePoints();
    }
}

const hideContent = () => {
    mapScreen.classList.remove('hidden');
    content.classList.remove('active');
    backNav.style.display = 'none';
    
    document.querySelectorAll('.dot').forEach(d => d.classList.remove('current'));
    if (currentSection) {
        const currentDot = document.getElementById(`dot-${currentSection}`);
        if (currentDot) {
            currentDot.classList.add('current');
        }
    }
    
    if (typeof toggleImagePoints === 'function') {
        toggleImagePoints();
    }
}

const randomizeDotPositions = () => {
    const dots = document.querySelectorAll('.dot');
    dots.forEach(dot => {
        const randomX = (Math.random() - 0.5) * 100;
        const randomY = (Math.random() - 0.5) * 100;
        
        const currentTransform = window.getComputedStyle(dot).transform;
        dot.style.transform = `translate(${randomX}px, ${randomY}px)`;
    });
};

randomizeDotPositions();