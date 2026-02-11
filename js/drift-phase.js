let accelerationHistory = [];
const historySize = 10;
let lastStepTime = 0;
const stepCooldown = 500;
let stepsPerFragment = 5;
let stepsSinceLastFragment = 0;

let isMoving = false;
let lastMovementTime = 0;
const movementTimeout = 1500; 
let movementCheckInterval = null;

const startMotionDetection = () => {
  console.log("🧭 Sensores de movimiento activados");
  
  accelerationHistory = [];
  window.addEventListener("devicemotion", handleMotion);
  
  showInstruction("camina o agita tu móvil como si estuvieses de paseo");
  showMovementIndicator();
  
  movementCheckInterval = setInterval(checkMovementStatus, 200);
};

const showMovementIndicator = () => {
  const indicator = document.createElement("div");
  indicator.id = "movement-indicator";
  indicator.className = "stopped";
  indicator.style.cssText = `
    position: fixed;
    top: 30px;
    left: 30px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ee6c4d;
    z-index: 999;
    transition: background 0.3s ease;
  `;
  
  driftScreen.appendChild(indicator);
};

const updateMovementStatus = (moving) => {
  const indicator = document.getElementById("movement-indicator");
  if (!indicator) return;
  
  if (moving) {
    indicator.classList.remove("stopped");
    indicator.classList.add("moving");
    indicator.style.background = "#98c1d9"
  } else {
    indicator.classList.remove("moving");
    indicator.classList.add("stopped");
    indicator.style.background = "#ee6c4d";
  }
};

const checkMovementStatus = () => {
  const currentTime = Date.now();
  const timeSinceLastMovement = currentTime - lastMovementTime;

  if (isMoving && timeSinceLastMovement > movementTimeout) {
    isMoving = false;
    updateMovementStatus(false);
  }
};

const detectStep = () => {
  const currentTime = Date.now();
  const timeSinceLastStep = currentTime - lastStepTime;

  if (timeSinceLastStep < stepCooldown) {
    return;
  }

  const avg = accelerationHistory.reduce((a, b) => a + b, 0) / accelerationHistory.length;
  const variance = accelerationHistory.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / accelerationHistory.length;
  const stdDev = Math.sqrt(variance);

  const recent = accelerationHistory.slice(-3);
  const middle = recent[1];
  const isPeak = middle > recent[0] && middle > recent[2];

  const threshold = isAndroid ? 2.0 : 2.5;

  if (isPeak && stdDev > threshold) {
    lastStepTime = currentTime;
    lastMovementTime = currentTime; 
    stepsSinceLastFragment++;
    
    if (!isMoving) {
      isMoving = true;
      updateMovementStatus(true);
    }
    
    console.log(`👟 Paso ${stepsSinceLastFragment}/5 (stdDev: ${stdDev.toFixed(2)})`);
    
    if (stepsSinceLastFragment >= stepsPerFragment) {
      stepsSinceLastFragment = 0;
      revealFragmentRandom();
      vibrate();
    }
  }
};

const completeDrift = () => {
  console.log("🎉 Deriva completada");
  
  if (movementCheckInterval) {
    clearInterval(movementCheckInterval);
    movementCheckInterval = null;
  }

  setTimeout(() => {
    driftScreen.classList.add("completed");
    window.removeEventListener("devicemotion", handleMotion);
    document.removeEventListener("mousemove", handleMouseDrift);

    setTimeout(() => {
      driftScreen.style.display = "none";
    }, 800);
  }, 1000);
};