const miradas = [
  "quien cuida de los jardines",
  "quien ha perdido algo",
  "quien busca sombra",
  "quien cuenta historias a las piedras",
  "quien lee las grietas",
  "quien duda",
  "quien pinta las calles",
  "quien aparece sólo de noche",
  "quien salta a la pata coja",
  "quien duda",
  "quien camina a cuatro patas",
  "quien malinterpreta las señales",
  "quien camina hacia atrás",
  "quien se ensimisma",
  "quien planta",
  "quien busca la montaña",
  "quien sigue el curso del río",
  "quien convalece",
  "quien permanece",
  "quien crece entre las rendijas",
  "quien se confunde con los mapas",
  "quien se refugia del frío",
  "quien dibuja mapas",
  "quien mira solo hacia arriba",
  "quien camina sin destino",
  "quien cotillea",
  "quien inventa atajos",
  "quien se oculta",
];

const generarBtn = document.getElementById("generar-mirada");
const miradaOutput = document.getElementById("mirada-output");

if (generarBtn && miradaOutput) {
  generarBtn.addEventListener("click", function () {
    const randomMirada = miradas[Math.floor(Math.random() * miradas.length)];
    miradaOutput.style.opacity = "0";
    miradaOutput.style.transform = "translateY(-10px)";

    setTimeout(() => {
      miradaOutput.textContent = randomMirada;
      miradaOutput.style.transition = "opacity 0.3s, transform 0.3s";
      miradaOutput.style.opacity = "1";
      miradaOutput.style.transform = "translateY(0)";
    }, 150);
  });
}
