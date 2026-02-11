// FASE DE DERIVA INICIAL - CON GIROSCOPIO
const driftFragments = [
  "mirar la ciudad es siempre un ejercicio político",
  "cada cuerpo porta sus deseos",
  "el juego no respeta los límites del parque",
  "la ciudad fue diseñada para otros cuerpos",
  "qué son estas fuentes clausuradas en el barrio de las aguas",
  "el barrio se infla por unos lugares",
  "y se desinfla por otros",
  "allguien busca en las calles pequeñas y pintorescas",
  "una ciudad que se torna imagen",
  "no encontré ni un banco",
  "en estas calles amables",
  "llenas de cuerpos cansados",
  "caminar desautomatiza la percepción",
  "activa las geografías afectivas",
  "y el espacio no es un contenedor vacío",
  "es un campo de fuerzas y conflictos",
];

const driftScreen = document.getElementById("drift-screen");
const driftContainer = document.getElementById("drift-container");
const revealedCountDisplay = document.getElementById("revealed-count");

let revealedCount = 0;
let distanceTraveled = 0;
let lastMouseX = 0;
let lastMouseY = 0;

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
const REQUIRED_FRAGMENTS = 16;
const REVEAL_DISTANCE = 200;

let lastAcceleration = { x: 0, y: 0, z: 0 };
let lastRotation = { alpha: 0, beta: 0, gamma: 0 };
let movementDetected = false;
const MOVEMENT_THRESHOLD = 10;
const MOVEMENT_COOLDOWN = 300;
let movementCounter = 0;

// DECLARAR TODAS LAS FUNCIONES PRIMERO
const initDesktopDrift = () => {
  showInstruction("mueve el ratón para revelar los fragmentos");
  document.addEventListener("mousemove", handleMouseDrift);
};

const handleMouseDrift = (e) => {
  if (revealedCount >= REQUIRED_FRAGMENTS) return;

  const dx = e.clientX - lastMouseX;
  const dy = e.clientY - lastMouseY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  distanceTraveled += distance;

  lastMouseX = e.clientX;
  lastMouseY = e.clientY;

  if (distanceTraveled > REVEAL_DISTANCE) {
    revealFragment(e.clientX, e.clientY); // Ahora usa la posición del ratón
    distanceTraveled = 0;
  }
};

const initMobileDrift = () => {
  console.log("📱 Modo móvil iniciado");

  const needsPermission =
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function";

  if (needsPermission) {
    showPermissionButton();
  } else if (window.DeviceMotionEvent) {
    startMotionDetection();
  } else {
    useTapFallback();
  }
};

const showPermissionButton = () => {
  const permButton = document.createElement("button");
  permButton.textContent = "activar";
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

  permButton.onclick = () => {
    console.log("🖱️ Solicitando permisos...");

    DeviceMotionEvent.requestPermission()
      .then((response) => {
        console.log("📋 Respuesta:", response);

        if (response === "granted") {
          permButton.remove();
          startMotionDetection();
        } else {
          permButton.remove();
          showPermissionDenied();
        }
      })
      .catch((error) => {
        console.error("💥 Error:", error);
        permButton.remove();
        useTapFallback();
      });
  };

  driftScreen.appendChild(permButton);
};

const showPermissionDenied = () => {
  showInstruction("toca la pantalla para revelar");
  setTimeout(() => {
    useTapFallback();
  }, 2000);
};

const startMotionDetection = () => {
  console.log("🧭 Sensores de movimiento activados");

  window.addEventListener("devicemotion", handleMotion);
  window.addEventListener("deviceorientation", handleOrientation);

  showInstruction("mueve el móvil para revelar");
  showStepCounter();
};

const handleMotion = (event) => {
  if (revealedCount >= REQUIRED_FRAGMENTS || movementDetected) return;

  const acc = event.accelerationIncludingGravity;
  if (!acc || acc.x === null) return;

  const deltaX = Math.abs(acc.x - lastAcceleration.x);
  const deltaY = Math.abs(acc.y - lastAcceleration.y);
  const deltaZ = Math.abs(acc.z - lastAcceleration.z);
  const accelDelta = deltaX + deltaY + deltaZ;

  console.log(`📊 Accel: ${accelDelta.toFixed(1)}`);

  if (accelDelta > MOVEMENT_THRESHOLD) {
    detectMovement("acelerómetro", accelDelta);
  }

  lastAcceleration = { x: acc.x, y: acc.y, z: acc.z };
};

const handleOrientation = (event) => {
  if (revealedCount >= REQUIRED_FRAGMENTS || movementDetected) return;

  const alpha = event.alpha || 0;
  const beta = event.beta || 0;
  const gamma = event.gamma || 0;

  const deltaAlpha = Math.abs(alpha - lastRotation.alpha);
  const deltaBeta = Math.abs(beta - lastRotation.beta);
  const deltaGamma = Math.abs(gamma - lastRotation.gamma);
  const rotationDelta = deltaAlpha + deltaBeta + deltaGamma;

  console.log(`🧭 Rotación: ${rotationDelta.toFixed(1)}`);

  if (rotationDelta > 15) {
    detectMovement("giroscopio", rotationDelta);
  }

  lastRotation = { alpha, beta, gamma };
};

const detectMovement = (sensor, value) => {
  if (movementDetected) return;

  movementDetected = true;
  movementCounter++;

  updateStepCounter();
  console.log(`🎯 Movimiento detectado por ${sensor} (${movementCounter})`);

  revealFragmentRandom();
  vibrate();

  setTimeout(() => {
    movementDetected = false;
  }, MOVEMENT_COOLDOWN);
};

const showStepCounter = () => {
  const counter = document.createElement("div");
  counter.id = "step-counter";
  counter.textContent = "0";
  counter.style.cssText = `
          position: fixed;
          top: 30px;
          right: 30px;
          color: #293241;
          padding: 8px 16px;
          border: none;
          font-size: 13px;
          font-family: inherit;
          z-index: 999;
      `;

  driftScreen.appendChild(counter);
};

const updateStepCounter = () => {
  const counter = document.getElementById("step-counter");
  if (counter) {
    counter.textContent = `${movementCounter}`;
  }
};

const useTapFallback = () => {
  console.log("👆 Modo táctil");

  let tapCount = 0;

  driftScreen.addEventListener("touchstart", (e) => {
    if (revealedCount >= REQUIRED_FRAGMENTS) return;

    tapCount++;

    if (tapCount % 2 === 0) {
      const touch = e.touches[0];
      revealFragment(touch.clientX, touch.clientY);
      vibrate();
    }
  });
};

const showInstruction = (text) => {
  const instruction = document.createElement("div");
  instruction.textContent = text;
  instruction.style.cssText = `
          position: fixed;
          bottom: 120px;
          left: 50%;
          transform: translateX(-50%);
          color: #f1faee;
          border: none;
          font-size: 14px;
          font-family: inherit;
          z-index: 999;
          text-align: center;
          max-width: 80%;
      `;

  driftScreen.appendChild(instruction);
  setTimeout(() => {
    instruction.style.transition = "opacity 0.5s";
    instruction.style.opacity = "0";
    setTimeout(() => instruction.remove(), 500);
  }, 4000);
};

const vibrate = () => {
  if ("vibrate" in navigator) {
    navigator.vibrate(50);
  }
};

const revealFragment = (x, y) => {
  if (revealedCount >= REQUIRED_FRAGMENTS) return;

  const fragment = document.createElement("div");
  fragment.className = "drift-fragment";
  fragment.textContent = driftFragments[revealedCount];

  const safeX = Math.max(20, Math.min(x, window.innerWidth - 320));
  const safeY = Math.max(20, Math.min(y, window.innerHeight - 100));

  fragment.style.left = safeX + "px";
  fragment.style.top = safeY + "px";

  driftContainer.appendChild(fragment);

  setTimeout(() => fragment.classList.add("visible"), 10);

  revealedCount++;
  revealedCountDisplay.textContent = revealedCount;

  if (revealedCount >= REQUIRED_FRAGMENTS) {
    completeDrift();
  }
};

const revealFragmentRandom = () => {
  const x = Math.random() * (window.innerWidth - 320) + 20;
  const y = Math.random() * (window.innerHeight - 100) + 20;
  revealFragment(x, y);
};

const completeDrift = () => {
  console.log("🎉 Deriva completada");

  const counter = document.getElementById("step-counter");
  if (counter) counter.remove();

  setTimeout(() => {
    driftScreen.classList.add("completed");
    window.removeEventListener("devicemotion", handleMotion);
    window.removeEventListener("deviceorientation", handleOrientation);
    document.removeEventListener("mousemove", handleMouseDrift);

    setTimeout(() => {
      driftScreen.style.display = "none";
    }, 800);
  }, 1000);
};

// AHORA SÍ EJECUTAR
if (isMobile) {
  initMobileDrift();
} else {
  initDesktopDrift();
}
