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
  const isAndroid = /Android/i.test(navigator.userAgent);
  const REQUIRED_FRAGMENTS = 16;
  const REVEAL_DISTANCE = 200;
  
  // Variables para interval automático
  let autoRevealInterval = null;
  const AUTO_REVEAL_DELAY = 3000; // 3 segundos por frase
  
  // Variables para detección de movimiento
  let accelerationHistory = [];
  const historySize = 10;
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
    showWalkingInstruction();
  
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
  
  const showWalkingInstruction = () => {
    const instruction = document.createElement("div");
    instruction.id = "walking-instruction";
    instruction.textContent = "empieza a caminar";
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
  
    // Si estaba moviéndose y ahora se detuvo
    if (isMoving && timeSinceLastMovement > movementTimeout) {
      isMoving = false;
      updateMovementStatus(false);
      pauseAutoReveal();
      console.log("⏸️ Pausado - esperando movimiento");
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
      detectMovement();
    }
  };
  
  const detectMovement = () => {
    const avg =
      accelerationHistory.reduce((a, b) => a + b, 0) / accelerationHistory.length;
    const variance =
      accelerationHistory.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) /
      accelerationHistory.length;
    const stdDev = Math.sqrt(variance);
  
    const recent = accelerationHistory.slice(-3);
    const middle = recent[1];
    const isPeak = middle > recent[0] && middle > recent[2];
  
    const threshold = isAndroid ? 2.0 : 2.5;
  
    if (isPeak && stdDev > threshold) {
      lastMovementTime = Date.now();
  
      // Si no estaba moviéndose, ahora sí
      if (!isMoving) {
        isMoving = true;
        updateMovementStatus(true);
        
        // Ocultar instrucción inicial si existe
        const instruction = document.getElementById("walking-instruction");
        if (instruction) {
          instruction.style.transition = "opacity 0.5s";
          instruction.style.opacity = "0";
          setTimeout(() => instruction.remove(), 500);
        }
  
        resumeAutoReveal();
      }
    }
  };
  
  const resumeAutoReveal = () => {
    // Si ya hay un interval activo, no crear otro
    if (autoRevealInterval) {
      console.log("▶️ Ya estaba activo");
      return;
    }
  
    console.log(`▶️ Reanudando desde frase ${revealedCount + 1}/${REQUIRED_FRAGMENTS}`);
  
    // Revelar inmediatamente al reanudar
    if (revealedCount < REQUIRED_FRAGMENTS) {
      revealFragmentRandom();
      vibrate();
    }
  
    // Iniciar interval
    autoRevealInterval = setInterval(() => {
      if (revealedCount < REQUIRED_FRAGMENTS && isMoving) {
        revealFragmentRandom();
        vibrate();
      }
    }, AUTO_REVEAL_DELAY);
  };
  
  const pauseAutoReveal = () => {
    if (autoRevealInterval) {
      clearInterval(autoRevealInterval);
      autoRevealInterval = null;
      console.log(`⏸️ Pausado en frase ${revealedCount}/${REQUIRED_FRAGMENTS}`);
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
  
    driftScreen.addEventListener("touchstart", (e) => {
      if (revealedCount >= REQUIRED_FRAGMENTS) return;
  
      const touch = e.touches[0];
      revealFragment(touch.clientX, touch.clientY);
      vibrate();
    });
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
  
    if (autoRevealInterval) {
      clearInterval(autoRevealInterval);
      autoRevealInterval = null;
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
  
  if (isMobile) {
    initMobileDrift();
  } else {
    initDesktopDrift();
  }
  
  showSkipButton();