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