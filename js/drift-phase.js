const driftFragments = [
  "en un marco urbano en el que se nos empuja",
  "a dirigirnos de un punto A",
  "a un punto B",
  "deambular se convierte en un acto político,",
  "un ejercicio de escucha de la ciudad",
  "en el que cuerpo, movimiento y espacio se entrecruzan",
  "atendiendo tanto a lo visible",
  "como a lo invisible del paisaje",
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
  const isAndroid = /Android/i.test(navigator.userAgent);
  const REQUIRED_FRAGMENTS = 8;
  const REVEAL_DISTANCE = 200;
  
  let accelerationHistory = [];
  const historySize = 10;
  let lastStepTime = 0;
  const stepCooldown = 350;
  let stepsPerFragment = 2;
  let stepsSinceLastFragment = 0;
  
  let isMoving = false;
  let lastMovementTime = 0;
  const movementTimeout = 1500;
  let movementCheckInterval = null;
  
  const initDesktopDrift = () => {
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
      revealFragment(e.clientX, e.clientY);
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
      useTapMode();
    }
  };
  
  const showPermissionButton = () => {
    const permButton = document.createElement("button");
    permButton.textContent = "pulsa aquí para comenzar";
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
            useTapMode();
          }
        })
        .catch((error) => {
          console.error("💥 Error:", error);
          permButton.remove();
          useTapMode();
        });
    };
  
    driftScreen.appendChild(permButton);
  };
  
  const startMotionDetection = () => {
    console.log("🧭 Sensores de movimiento activados");
  
    accelerationHistory = [];
    window.addEventListener("devicemotion", handleMotion);
  
    showMovementIndicator();
    showTapHelper();
  
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
  
  const showTapHelper = () => {
    const helper = document.createElement("div");
    helper.textContent = "o toca la pantalla";
    helper.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        color: #f1faee;
        font-size: 12px;
        font-family: inherit;
        z-index: 999;
        opacity: 0.6;
      `;
  
    driftScreen.appendChild(helper);
  
    driftScreen.addEventListener("touchstart", handleTap);
  };
  
  const handleTap = (e) => {
    if (revealedCount >= REQUIRED_FRAGMENTS) return;
  
    const touch = e.touches[0];
    revealFragment(touch.clientX, touch.clientY);
    vibrate();
  };
  
  const updateMovementStatus = (moving) => {
    const indicator = document.getElementById("movement-indicator");
    if (!indicator) return;
  
    if (moving) {
      indicator.classList.remove("stopped");
      indicator.classList.add("moving");
      indicator.style.background = "#98c1d9";
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
  
  const handleMotion = (event) => {
    if (revealedCount >= REQUIRED_FRAGMENTS) return;
  
    const acc = event.accelerationIncludingGravity;
  
    if (!acc || acc.x === null || acc.y === null || acc.z === null) return;
  
    const magnitude = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
  
    accelerationHistory.push(magnitude);
  
    if (accelerationHistory.length > historySize) {
      accelerationHistory.shift();
    }
  
    if (accelerationHistory.length >= historySize) {
      detectStep();
    }
  };
  
  const detectStep = () => {
    const currentTime = Date.now();
    const timeSinceLastStep = currentTime - lastStepTime;
  
    if (timeSinceLastStep < stepCooldown) {
      return;
    }
  
    const avg =
      accelerationHistory.reduce((a, b) => a + b, 0) / accelerationHistory.length;
    const variance =
      accelerationHistory.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) /
      accelerationHistory.length;
    const stdDev = Math.sqrt(variance);
  
    const recent = accelerationHistory.slice(-3);
    const middle = recent[1];
    const isPeak = middle > recent[0] && middle > recent[2];
  
    const threshold = isAndroid ? 0.8 : 1.0;
  
    if (isPeak && stdDev > threshold) {
      lastStepTime = currentTime;
      lastMovementTime = currentTime;
      stepsSinceLastFragment++;
  
      if (!isMoving) {
        isMoving = true;
        updateMovementStatus(true);
      }
  
      console.log(
        `👟 Paso ${stepsSinceLastFragment}/${stepsPerFragment} (stdDev: ${stdDev.toFixed(
          2
        )})`
      );
  
      if (stepsSinceLastFragment >= stepsPerFragment) {
        stepsSinceLastFragment = 0;
        revealFragmentRandom();
        vibrate();
      }
    }
  };
  
  const useTapMode = () => {
    console.log("👆 Modo táctil puro");
  
    const instruction = document.createElement("div");
    instruction.textContent = "toca la pantalla para revelar";
    instruction.style.cssText = `
        position: fixed;
        bottom: 120px;
        left: 50%;
        transform: translateX(-50%);
        color: #f1faee;
        font-size: 14px;
        font-family: inherit;
        z-index: 999;
        text-align: center;
      `;
  
    driftScreen.appendChild(instruction);
    driftScreen.addEventListener("touchstart", handleTap);
  };
  
  const vibrate = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }
  };
  
  const revealFragment = (x, y) => {
    if (revealedCount >= REQUIRED_FRAGMENTS) return;
  
    if (isMobile && revealedCount > 0) {
      const previousFragments =
        driftContainer.querySelectorAll(".drift-fragment");
      previousFragments.forEach((frag) => {
        frag.style.transition = "opacity 0.3s";
        frag.style.opacity = "0";
        setTimeout(() => frag.remove(), 300);
      });
    }
  
    const fragment = document.createElement("div");
    fragment.className = "drift-fragment";
    fragment.textContent = driftFragments[revealedCount];
  
    if (isMobile) {
      fragment.style.left = "50%";
      fragment.style.top = "50%";
      fragment.style.transform = "translate(-50%, -50%)";
    } else {
      const safeX = Math.max(20, Math.min(x, window.innerWidth - 320));
      const safeY = Math.max(20, Math.min(y, window.innerHeight - 100));
  
      fragment.style.left = safeX + "px";
      fragment.style.top = safeY + "px";
    }
  
    driftContainer.appendChild(fragment);
  
    setTimeout(() => fragment.classList.add("visible"), 10);
  
    revealedCount++;
    revealedCountDisplay.textContent = revealedCount;
  
    if (revealedCount >= REQUIRED_FRAGMENTS) {
      completeDrift();
    }
  };
  
  const revealFragmentRandom = () => {
    if (isMobile) {
      revealFragment(0, 0);
    } else {
      const x = Math.random() * (window.innerWidth - 320) + 20;
      const y = Math.random() * (window.innerHeight - 100) + 20;
      revealFragment(x, y);
    }
  };
  
  const showSkipButton = () => {
    const skipButton = document.createElement("button");
    skipButton.textContent = "saltar";
    skipButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        padding: 0;
        background: transparent;
        color: #3d5a80;
        border: none;
        font-family: inherit;
        font-size: 14px;
        cursor: pointer;
        z-index: 10000;
        -webkit-tap-highlight-color: transparent;
        opacity: 0.7;
      `;
  
    skipButton.onclick = () => {
      completeDrift();
    };
  
    driftScreen.appendChild(skipButton);
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
      driftScreen.removeEventListener("touchstart", handleTap);
  
      setTimeout(() => {
        driftScreen.style.display = "none";
      }, 800);
    }, 1000);
  };
  
  if (isMobile) {
    initMobileDrift();
  } else {
    initDesktopDrift();
  }
  
  showSkipButton();