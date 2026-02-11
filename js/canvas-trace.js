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