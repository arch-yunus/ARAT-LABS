/* ==========================================
   ARAT LABS - SYSTEM CONTROLLER (app.js)
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initClock();
  initLogger();
  initNeuralNetwork();
  initActiveInferenceSim();
  initSdrSpectrum();
  initOodaEngine();
  initTelemetry();
  initBlochSphere();
  initCliConsole();
  initMissionControl();
  initEasterEgg();
  
  // Initial logs
  addLog('SYSTEM', 'Tüm bilişsel modüller başarıyla başlatıldı. Portal çevrim içi.');
  addLog('SYSTEM', 'CLI terminali aktif. Komutları denemek için /help yazabilirsiniz.');
});

/* ==========================================
   TAB NAVIGATION SYSTEM
   ========================================== */
function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  const panels = document.querySelectorAll('.content-panel');
  const orbAgi = document.getElementById('orb-agi');
  const orbOmega = document.getElementById('orb-omega');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  window.switchTab = function(tabName) {
    // Update tabs
    tabs.forEach(t => {
      if (t.getAttribute('data-tab') === tabName) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    // Update panels
    panels.forEach(p => {
      if (p.id === `panel-${tabName}`) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    // Animate background glow orbs based on tab selection
    if (tabName === 'agi') {
      orbAgi.style.transform = 'scale(1.4) translate(10%, 10%)';
      orbAgi.style.opacity = '0.3';
      orbOmega.style.opacity = '0.05';
      addLog('SYSTEM', 'ARAT AGI RESEARCH laboratuvar ortamı görüntülendi.');
    } else if (tabName === 'omega') {
      orbOmega.style.transform = 'scale(1.4) translate(-10%, -10%)';
      orbOmega.style.opacity = '0.3';
      orbAgi.style.opacity = '0.05';
      addLog('SYSTEM', 'ARAT OMEGA EW bilişsel elektronik harp kontrol paneli görüntülendi.');
    } else if (tabName === 'mission') {
      orbOmega.style.transform = 'none';
      orbAgi.style.transform = 'none';
      orbOmega.style.opacity = '0.2';
      orbAgi.style.opacity = '0.2';
      addLog('SYSTEM', 'Taktiksel Görev Kontrol paneli görüntülendi.');
    } else {
      orbAgi.style.transform = 'none';
      orbOmega.style.transform = 'none';
      orbAgi.style.opacity = '0.15';
      orbOmega.style.opacity = '0.15';
      addLog('SYSTEM', 'Ana Manifesto portalı görüntülendi.');
    }
  };
}

/* ==========================================
   CLOCK TIMER
   ========================================== */
function initClock() {
  const clockEl = document.getElementById('system-clock');
  
  function updateTime() {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hrs}:${mins}:${secs}`;
  }
  
  setInterval(updateTime, 1000);
  updateTime();
}

/* ==========================================
   CENTRAL TERMINAL LOG SYSTEM
   ========================================== */
function initLogger() {
  const clearBtn = document.getElementById('btn-clear-logs');
  clearBtn.addEventListener('click', () => {
    const container = document.getElementById('console-log-rows');
    container.innerHTML = '';
    addLog('SYSTEM', 'Konsol günlüğü kullanıcı tarafından temizlendi.');
  });
}

function addLog(source, message) {
  const container = document.getElementById('console-log-rows');
  if (!container) return;

  const now = new Date();
  const hrs = String(now.getHours()).padStart(2, '0');
  const mins = String(now.getMinutes()).padStart(2, '0');
  const secs = String(now.getSeconds()).padStart(2, '0');
  const timeString = `[${hrs}:${mins}:${secs}]`;

  const logRow = document.createElement('div');
  logRow.className = 'log-row';
  
  let sourceColor = '#38bdf8';
  if (source === 'SYSTEM') sourceColor = '#38bdf8';
  else if (source.includes('AGI') || source.includes('INFERENCE') || source.includes('COGNITION')) sourceColor = '#00f2fe';
  else if (source.includes('OMEGA') || source.includes('EW') || source.includes('SDR') || source.includes('OODA')) sourceColor = '#ff3366';
  else if (source.includes('HARDWARE')) sourceColor = '#f5af19';
  else if (source === 'CLI') sourceColor = '#a3e635';

  logRow.innerHTML = `
    <span class="log-time">${timeString}</span>
    <span class="log-source" style="color: ${sourceColor}">[${source}]</span>
    <span class="log-text">${message}</span>
  `;

  container.appendChild(logRow);
  container.scrollTop = container.scrollHeight;

  while (container.children.length > 80) {
    container.removeChild(container.firstChild);
  }
}

/* ==========================================
   AGI RESEARCH: NEURAL NETWORK GRAPH
   ========================================== */
function initNeuralNetwork() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let nodes = [];
  const maxNodes = 18;
  let animId;

  function resize() {
    const parent = canvas.parentElement;
    width = canvas.width = parent.clientWidth;
    height = canvas.height = parent.clientHeight;
  }
  
  window.addEventListener('resize', () => {
    if (document.getElementById('panel-agi').classList.contains('active')) {
      resize();
    }
  });

  class Node {
    constructor(id) {
      this.id = id;
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 4 + 3;
      this.pulsePhase = Math.random() * Math.PI;
      this.label = `Node_${id}`;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulsePhase += 0.05;

      if (this.x < 10 || this.x > width - 10) this.vx *= -1;
      if (this.y < 10 || this.y > height - 10) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      const currentRadius = this.radius + Math.sin(this.pulsePhase) * 1.5;
      ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 242, 254, ${0.4 + Math.sin(this.pulsePhase) * 0.3})`;
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      if (this.id % 4 === 0) {
        ctx.font = '8px monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillText(this.label, this.x + 8, this.y + 4);
      }
    }
  }

  function setup() {
    resize();
    nodes = [];
    for (let i = 0; i < maxNodes; i++) {
      nodes.push(new Node(i));
    }
  }

  let pulses = [];

  function draw() {
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(0, 242, 254, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    ctx.lineWidth = 0.5;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${1.0 - dist / 120 * 0.85})`;
          ctx.stroke();
        }
      }
    }

    nodes.forEach(node => {
      node.update();
      node.draw();
    });

    if (Math.random() < 0.08 && nodes.length > 0) {
      const source = nodes[Math.floor(Math.random() * nodes.length)];
      const neighbors = nodes.filter(n => {
        if (n === source) return false;
        const dist = Math.sqrt(Math.pow(n.x - source.x, 2) + Math.pow(n.y - source.y, 2));
        return dist < 120;
      });
      if (neighbors.length > 0) {
        const dest = neighbors[Math.floor(Math.random() * neighbors.length)];
        pulses.push({
          x: source.x,
          y: source.y,
          sx: source.x,
          sy: source.y,
          dx: dest.x,
          dy: dest.y,
          progress: 0,
          speed: Math.random() * 0.03 + 0.01
        });
      }
    }

    pulses.forEach((pulse, idx) => {
      pulse.progress += pulse.speed;
      pulse.x = pulse.sx + (pulse.dx - pulse.sx) * pulse.progress;
      pulse.y = pulse.sy + (pulse.dy - pulse.sy) * pulse.progress;

      ctx.beginPath();
      ctx.arc(pulse.x, pulse.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(0, 242, 254, 0.8)';
      ctx.fill();
      ctx.shadowBlur = 0;

      if (pulse.progress >= 1) {
        pulses.splice(idx, 1);
        if (Math.random() < 0.2) {
          triggerAgiAction();
        }
      }
    });

    animId = requestAnimationFrame(draw);
  }

  function triggerAgiAction() {
    const memoryKeys = [
      'fep_state_space', 
      'quantum_cognition_entanglement', 
      'kalman_ekf_fusion', 
      'cuda_swiglu_activations', 
      'arena_alloc_reclaim',
      'agent_surprise_gradient'
    ];
    const key = memoryKeys[Math.floor(Math.random() * memoryKeys.length)];
    addLog('AGI COGNITION', `Vektörel bellek araması tetiklendi: [${key}] eşleşmesi bulundu.`);
  }

  const refreshBtn = document.getElementById('btn-neural-refresh');
  refreshBtn.addEventListener('click', () => {
    setup();
    addLog('AGI COGNITION', 'Bilişsel sinir ağı topolojisi sıfırlandı ve yeniden yapılandırıldı.');
  });

  setup();
  draw();
}

/* ==========================================
   AGI RESEARCH: ACTIVE INFERENCE SIMULATOR
   ========================================== */
let globalResetAgent = null; // expose to CLI
function initActiveInferenceSim() {
  const canvas = document.getElementById('inference-canvas');
  const feCanvas = document.getElementById('fe-chart-canvas');
  if (!canvas || !feCanvas) return;

  const ctx = canvas.getContext('2d');
  const feCtx = feCanvas.getContext('2d');

  let width, height;
  let feWidth, feHeight;
  
  const gridCount = 8;
  let cellSize;
  
  let agent = { x: 0, y: 0 };
  let target = { x: 7, y: 7 };
  let obstacles = [
    { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 },
    { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 }
  ];
  
  let freeEnergyHistory = [];
  let stepCount = 0;
  let simInterval;

  function resize() {
    const parent = canvas.parentElement;
    width = canvas.width = parent.clientWidth;
    height = canvas.height = parent.clientHeight;
    cellSize = width / gridCount;

    feWidth = feCanvas.width = feCanvas.parentElement.clientWidth;
    feHeight = feCanvas.height = feCanvas.parentElement.clientHeight;
  }

  function drawArena() {
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridCount; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(width, i * cellSize);
      ctx.stroke();
    }

    ctx.fillStyle = 'rgba(255, 51, 102, 0.2)';
    ctx.strokeStyle = 'rgba(255, 51, 102, 0.5)';
    ctx.lineWidth = 1.5;
    obstacles.forEach(obs => {
      ctx.fillRect(obs.x * cellSize + 2, obs.y * cellSize + 2, cellSize - 4, cellSize - 4);
      ctx.strokeRect(obs.x * cellSize + 2, obs.y * cellSize + 2, cellSize - 4, cellSize - 4);
    });

    const tx = target.x * cellSize + cellSize / 2;
    const ty = target.y * cellSize + cellSize / 2;
    const pulseRad = (cellSize / 3) + Math.sin(Date.now() / 200) * 4;
    
    ctx.beginPath();
    ctx.arc(tx, ty, pulseRad, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 255, 102, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(tx, ty, cellSize / 5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 255, 102, 0.85)';
    ctx.fill();

    const ax = agent.x * cellSize + cellSize / 2;
    const ay = agent.y * cellSize + cellSize / 2;
    
    ctx.beginPath();
    ctx.arc(ax, ay, cellSize / 3, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(ax, ay, cellSize / 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 242, 254, 0.9)';
    ctx.fill();
  }

  function computeFreeEnergy(stateX, stateY) {
    const distGoal = Math.sqrt(Math.pow(stateX - target.x, 2) + Math.pow(stateY - target.y, 2));
    
    let surpriseObs = 0;
    obstacles.forEach(obs => {
      const d = Math.sqrt(Math.pow(stateX - obs.x, 2) + Math.pow(stateY - obs.y, 2));
      if (d === 0) surpriseObs += 999;
      else if (d < 1.5) surpriseObs += (1.5 - d) * 4.0;
    });

    let fe = distGoal * 0.8 + surpriseObs * 1.5;

    if (document.getElementById('chk-quantum-noise').checked) {
      fe += (Math.random() - 0.5) * 0.6;
    }

    return parseFloat(fe.toFixed(3));
  }

  function makeInferenceStep() {
    const neighbors = [
      { x: agent.x, y: agent.y - 1 },
      { x: agent.x, y: agent.y + 1 },
      { x: agent.x - 1, y: agent.y },
      { x: agent.x + 1, y: agent.y }
    ].filter(n => n.x >= 0 && n.x < gridCount && n.y >= 0 && n.y < gridCount);

    let bestAction = null;
    let minFE = Infinity;

    neighbors.forEach(n => {
      const isObstacle = obstacles.some(o => o.x === n.x && o.y === n.y);
      if (isObstacle) return;

      const fe = computeFreeEnergy(n.x, n.y);
      if (fe < minFE) {
        minFE = fe;
        bestAction = n;
      }
    });

    if (bestAction) {
      agent = bestAction;
      stepCount++;
      
      const surpriseVal = minFE;
      document.getElementById('surprise-value').textContent = `Sürpriz Değeri: ${surpriseVal} nats`;
      
      freeEnergyHistory.push(surpriseVal);
      if (freeEnergyHistory.length > 50) {
        freeEnergyHistory.shift();
      }
      
      drawArena();
      drawChart();

      if (agent.x === target.x && agent.y === target.y) {
        addLog('AGI SIMULATION', 'Ajan hedefe ulaştı. Serbest Enerji minimuma çekildi.');
        stopSimulation();
        setTimeout(resetSimulation, 3000);
      }
    }
  }

  function drawChart() {
    feCtx.clearRect(0, 0, feWidth, feHeight);

    if (freeEnergyHistory.length < 2) return;

    feCtx.beginPath();
    feCtx.strokeStyle = 'rgba(0, 242, 254, 0.8)';
    feCtx.lineWidth = 2;

    const padding = 15;
    const chartW = feWidth - padding * 2;
    const chartH = feHeight - padding * 2;

    const maxVal = Math.max(...freeEnergyHistory, 5);
    const minVal = Math.min(...freeEnergyHistory, 0);
    const valRange = maxVal - minVal;

    freeEnergyHistory.forEach((val, idx) => {
      const x = padding + (idx / (freeEnergyHistory.length - 1)) * chartW;
      const y = padding + chartH - ((val - minVal) / valRange) * chartH;

      if (idx === 0) feCtx.moveTo(x, y);
      else feCtx.lineTo(x, y);
    });

    feCtx.stroke();

    feCtx.lineTo(padding + chartW, padding + chartH);
    feCtx.lineTo(padding, padding + chartH);
    feCtx.fillStyle = 'rgba(0, 242, 254, 0.08)';
    feCtx.fill();
  }

  function startSimulation() {
    stopSimulation();
    simInterval = setInterval(makeInferenceStep, 500);
  }

  function stopSimulation() {
    if (simInterval) clearInterval(simInterval);
  }

  function resetSimulation() {
    agent = { x: 0, y: 0 };
    stepCount = 0;
    freeEnergyHistory = [computeFreeEnergy(0, 0)];
    drawArena();
    drawChart();
    startSimulation();
  }

  globalResetAgent = resetSimulation; // Bind to global scope for CLI access

  document.getElementById('btn-sim-reset').addEventListener('click', () => {
    resetSimulation();
    addLog('AGI SIMULATION', 'Active Inference simülasyonu sıfırlandı.');
  });

  window.redistributeObstacles = function(customCount) {
    obstacles = [];
    const count = customCount || 6;
    while (obstacles.length < count) {
      const x = Math.floor(Math.random() * gridCount);
      const y = Math.floor(Math.random() * gridCount);
      if ((x === 0 && y === 0) || (x === target.x && y === target.y)) continue;
      if (!obstacles.some(o => o.x === x && o.y === y)) {
        obstacles.push({ x, y });
      }
    }
    resetSimulation();
  };

  document.getElementById('btn-sim-obstacle').addEventListener('click', () => {
    redistributeObstacles(7);
    addLog('AGI SIMULATION', 'Yeni engeller yerleştirildi. Ajan çıkarım haritasını güncelliyor.');
  });

  resize();
  resetSimulation();
}

/* ==========================================
   OMEGA EW: SDR SPECTRUM ANALYZER
   ========================================== */
let globalToggleJamming = null; // expose to CLI
function initSdrSpectrum() {
  const canvas = document.getElementById('spectrum-canvas');
  const specCanvas = document.getElementById('spectrogram-canvas');
  if (!canvas || !specCanvas) return;

  const ctx = canvas.getContext('2d');
  const specCtx = specCanvas.getContext('2d');

  let width, height;
  let specWidth, specHeight;
  
  let noiseFloor = -90;
  let jammingActive = false;
  let sweepPhase = 0;

  function resize() {
    const parent = canvas.parentElement;
    width = canvas.width = parent.clientWidth;
    height = canvas.height = parent.clientHeight - 60;
    
    specWidth = specCanvas.width = parent.clientWidth;
    specHeight = specCanvas.height = 60;
  }

  let spectrogramData = specCtx.createImageData(specWidth || 400, specHeight || 60);

  function drawSpectrum() {
    ctx.clearRect(0, 0, width, height);

    const activeSignalType = document.getElementById('select-signal-type').value;

    ctx.strokeStyle = 'rgba(255, 51, 102, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 5; i++) {
      const y = (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      ctx.font = '8px monospace';
      ctx.fillStyle = 'rgba(255, 51, 102, 0.4)';
      ctx.fillText(`${-20 - i * 20} dBm`, 5, y - 2);
    }

    ctx.beginPath();
    ctx.strokeStyle = jammingActive ? 'rgba(255, 51, 102, 0.85)' : 'rgba(0, 242, 254, 0.85)';
    ctx.lineWidth = 1.5;

    let currentLineColors = [];
    sweepPhase += 0.05;

    for (let x = 0; x < width; x++) {
      let signalValue = parseFloat(noiseFloor) + 120;
      signalValue += (Math.random() - 0.5) * 4;

      if (activeSignalType === 'bpsk') {
        const center = width / 2;
        const widthBpsk = 60;
        const dist = Math.abs(x - center);
        if (dist < widthBpsk) {
          const rad = (dist / widthBpsk) * Math.PI * 2;
          const amplitude = Math.sin(rad + sweepPhase * 0.5) * 4 + 28;
          signalValue += Math.max(0, amplitude * (1.0 - dist / widthBpsk));
        }
      } 
      else if (activeSignalType === 'qpsk') {
        const center = width * 0.35;
        const dist = Math.abs(x - center);
        if (dist < 40) {
          const amplitude = Math.sin(sweepPhase) * 2 + 45;
          signalValue += Math.max(0, amplitude * Math.pow(1.0 - dist / 40, 2.5));
        }
      } 
      else if (activeSignalType === 'fhss') {
        const jumpIndex = Math.floor(sweepPhase / 2.0) % 4;
        const centers = [width * 0.15, width * 0.45, width * 0.72, width * 0.85];
        const center = centers[jumpIndex];
        const dist = Math.abs(x - center);
        if (dist < 20) {
          signalValue += Math.max(0, 50 * (1.0 - dist / 20));
        }
      } 
      else if (activeSignalType === 'lpi') {
        const center = width * 0.65;
        const widthLpi = 150;
        const dist = Math.abs(x - center);
        if (dist < widthLpi) {
          signalValue += Math.max(0, 8 * (1.0 - dist / widthLpi));
        }
      }

      if (jammingActive) {
        const jamCenter = width / 2;
        const jamDist = Math.abs(x - jamCenter);
        const noiseFactor = 45 * Math.sin(x * 0.1 + sweepPhase) * Math.random();
        signalValue += Math.max(0, noiseFactor * (1.5 - jamDist / (width / 2)));
      }

      const scaledY = height - (signalValue / 120) * height;
      
      if (x === 0) ctx.moveTo(x, scaledY);
      else ctx.lineTo(x, scaledY);

      currentLineColors.push(signalValue);
    }

    ctx.stroke();
    shiftSpectrogram(currentLineColors);
  }

  function shiftSpectrogram(signalValues) {
    if (!spectrogramData.data) return;

    const rowBytes = specWidth * 4;

    for (let y = specHeight - 1; y > 0; y--) {
      const srcIdx = (y - 1) * rowBytes;
      const destIdx = y * rowBytes;
      for (let i = 0; i < rowBytes; i++) {
        spectrogramData.data[destIdx + i] = spectrogramData.data[srcIdx + i];
      }
    }

    for (let x = 0; x < specWidth; x++) {
      const val = signalValues[Math.floor((x / specWidth) * signalValues.length)] || 0;
      const intensity = Math.min(255, Math.floor((val / 120) * 255));
      
      const idx = x * 4;
      if (jammingActive) {
        spectrogramData.data[idx] = intensity;
        spectrogramData.data[idx + 1] = intensity * 0.1;
        spectrogramData.data[idx + 2] = intensity * 0.2;
      } else {
        spectrogramData.data[idx] = intensity * 0.1;
        spectrogramData.data[idx + 1] = intensity * 0.7;
        spectrogramData.data[idx + 2] = intensity;
      }
      spectrogramData.data[idx + 3] = 255;
    }

    specCtx.putImageData(spectrogramData, 0, 0);
  }

  const noiseSlider = document.getElementById('range-noise-floor');
  noiseSlider.addEventListener('input', (e) => {
    noiseFloor = e.target.value;
  });

  function toggleJamming(forceState) {
    if (forceState !== undefined) {
      jammingActive = forceState;
    } else {
      jammingActive = !jammingActive;
    }
    
    const statusDot = document.getElementById('jamming-status-dot');
    const spectrumIndicator = document.getElementById('spectrum-indicator');
    const jamBtn = document.getElementById('btn-jamming-toggle');

    if (jammingActive) {
      jamBtn.textContent = "KARİŞTİRMA AKTİF (DURDUR)";
      jamBtn.classList.remove('btn-danger');
      jamBtn.classList.add('btn-secondary');
      statusDot.classList.remove('dot-red');
      statusDot.classList.add('dot-amber');
      
      spectrumIndicator.textContent = "JAMMING ON";
      spectrumIndicator.className = "status-value text-red";

      addLog('OMEGA EW', 'Jamming tetiklendi. Spektrum aldatıcı gürültü ile kaplandı (+43 dBm).');
    } else {
      jamBtn.textContent = "AKTİF ALDATMA / KARİŞTİRMA (JAMMING)";
      jamBtn.classList.remove('btn-secondary');
      jamBtn.classList.add('btn-danger');
      statusDot.classList.remove('dot-amber');
      statusDot.classList.add('dot-red');
      
      spectrumIndicator.textContent = "SECURE";
      spectrumIndicator.className = "status-value text-green";

      addLog('OMEGA EW', 'Jamming durduruldu. Spektrum güvenli dinleme moduna döndü.');
    }
  }

  globalToggleJamming = toggleJamming; // Expose

  document.getElementById('btn-jamming-toggle').addEventListener('click', () => {
    toggleJamming();
  });

  const signalSelect = document.getElementById('select-signal-type');
  signalSelect.addEventListener('change', (e) => {
    const val = e.target.value.toUpperCase();
    addLog('OMEGA SDR', `Analiz frekansı hedeflenen sinyal türüne kilitlendi: [${val}]`);
  });

  function tick() {
    if (document.getElementById('panel-omega').classList.contains('active') || width === undefined) {
      if (!width) {
        resize();
        spectrogramData = specCtx.createImageData(specWidth, specHeight);
      }
      drawSpectrum();
    }
    requestAnimationFrame(tick);
  }

  resize();
  tick();
}

/* ==========================================
   OMEGA EW: COGNITIVE OODA LOOP ENGINE
   ========================================== */
function initOodaEngine() {
  const steps = {
    OBSERVE: document.getElementById('step-observe'),
    ORIENT: document.getElementById('step-orient'),
    DECIDE: document.getElementById('step-decide'),
    ACT: document.getElementById('step-act')
  };

  const oodaStateBadge = document.getElementById('ooda-state-badge');
  const obsData = document.getElementById('ooda-obs-data');
  const oriData = document.getElementById('ooda-ori-data');
  const decData = document.getElementById('ooda-dec-data');
  const actData = document.getElementById('ooda-act-data');
  const bayesianTableBody = document.getElementById('bayesian-table-body');

  let currentState = 'OBSERVE';
  
  const modulations = ['FHSS', 'BPSK', 'QPSK', 'LPI'];
  let currentModulationIndex = 0;

  function setStepActive(activeKey) {
    Object.keys(steps).forEach(key => {
      if (key === activeKey) {
        if (key === 'ACT') {
          steps[key].classList.add('act-active');
        } else {
          steps[key].classList.add('active');
        }
      } else {
        steps[key].classList.remove('active', 'act-active');
      }
    });
  }

  function runOodaLoop() {
    // Only advance cycle if not overridden by a running mission scenario
    if (window.missionRunning) return;

    switch (currentState) {
      case 'OBSERVE':
        setStepActive('OBSERVE');
        oodaStateBadge.textContent = 'OBSERVE STATE';
        oodaStateBadge.className = 'badge badge-info';
        
        const scanFreq = (2.4 + Math.random() * 3.6).toFixed(3);
        obsData.textContent = `Tarama Frekansı: ${scanFreq} GHz`;
        currentModulationIndex = (currentModulationIndex + 1) % modulations.length;
        
        addLog('OODA LOOP', `OBSERVE: SDR spektrum taraması tamamlandı.`);
        currentState = 'ORIENT';
        break;

      case 'ORIENT':
        setStepActive('ORIENT');
        oodaStateBadge.textContent = 'ORIENT STATE';
        oodaStateBadge.className = 'badge badge-warning';
        
        const targetMod = modulations[currentModulationIndex];
        const confidence = (96.5 + Math.random() * 3.3).toFixed(1);
        oriData.textContent = `Tespit: ${targetMod} (%${confidence})`;
        
        document.getElementById('select-signal-type').value = targetMod.toLowerCase();

        addLog('OODA LOOP', `ORIENT: Sinyal ${targetMod} olarak tanımlandı.`);
        currentState = 'DECIDE';
        break;

      case 'DECIDE':
        setStepActive('DECIDE');
        oodaStateBadge.textContent = 'DECIDE STATE';
        oodaStateBadge.className = 'badge badge-warning';
        
        const targetModName = modulations[currentModulationIndex];
        let p1, p2, p3;
        
        if (targetModName === 'FHSS') {
          p1 = 0.621; p2 = 0.965; p3 = 0.742;
        } else if (targetModName === 'LPI') {
          p1 = 0.450; p2 = 0.310; p3 = 0.885;
        } else {
          p1 = 0.942; p2 = 0.681; p3 = 0.895;
        }

        bayesianTableBody.innerHTML = `
          <tr>
            <td>DRFM Karıştırma (Gürültü Barajı)</td>
            <td>0.89</td>
            <td>Orta</td>
            <td class="${p1 > p2 && p1 > p3 ? 'text-green text-bold' : ''}">${p1}</td>
          </tr>
          <tr>
            <td>Frekans Takip Çevrimli Karıştırma</td>
            <td>0.72</td>
            <td>Düşük</td>
            <td class="${p2 > p1 && p2 > p3 ? 'text-green text-bold' : ''}">${p2}</td>
          </tr>
          <tr>
            <td>Mülti-Modlu Yalancı Hedef Üretimi</td>
            <td>0.95</td>
            <td>Yüksek (Yoğun CPU)</td>
            <td class="${p3 > p1 && p3 > p2 ? 'text-green text-bold' : ''}">${p3}</td>
          </tr>
        `;

        const chosenTactic = p1 > p2 && p1 > p3 ? 'DRFM Karıştırma' : 
                             p2 > p1 && p2 > p3 ? 'Frekans Takip Karıştırma' : 'Mülti-Mod Yalancı Hedef';
        decData.textContent = `Öneri: ${chosenTactic}`;

        addLog('OODA LOOP', `DECIDE: Bayesian optimum strateji: ${chosenTactic}`);
        currentState = 'ACT';
        break;

      case 'ACT':
        setStepActive('ACT');
        oodaStateBadge.textContent = 'ACT STATE';
        oodaStateBadge.className = 'badge badge-danger';
        
        const outputPwr = (35 + Math.floor(Math.random() * 15));
        actData.textContent = `Güç: +${outputPwr} dBm (Aktif)`;
        
        addLog('OODA LOOP', `ACT: GaN güç yükselticiye spektrum engelleme sinyali gönderildi.`);
        currentState = 'OBSERVE';
        break;
    }
  }

  setInterval(runOodaLoop, 2500);
  runOodaLoop();
}

/* ==========================================
   SWaP-C HARDWARE TELEMETRY
   ========================================= */
let globalTelemetryStress = null; // expose to CLI
function initTelemetry() {
  const barOrinLoad = document.getElementById('bar-orin-load');
  const txtOrinTemp = document.getElementById('txt-orin-temp');
  const txtOrinLoad = document.getElementById('txt-orin-load');
  
  const barGanPower = document.getElementById('bar-gan-power');
  const txtGanTemp = document.getElementById('txt-gan-temp');
  const txtGanPower = document.getElementById('txt-gan-power');
  
  const txtPeltierStatus = document.getElementById('txt-peltier-status');
  const lightPeltier = document.getElementById('light-peltier');
  const svgFan = document.getElementById('svg-fan');
  
  const stressBtn = document.getElementById('btn-stress-test');

  window.orinTemp = 42;
  window.orinLoad = 45;
  window.ganTemp = 38;
  window.ganPower = 12;
  
  let stressActive = false;
  window.peltierActive = false; // globally accessible

  function toggleStress(forceState) {
    if (forceState !== undefined) {
      stressActive = forceState;
    } else {
      stressActive = !stressActive;
    }

    if (stressActive) {
      stressBtn.textContent = "Stresi Durdur";
      stressBtn.classList.remove('btn-outline');
      stressBtn.classList.add('btn-danger');
      addLog('HARDWARE', 'Gömülü Jetson Orin Nano donanım stres testi başlatıldı. CUDA çekirdekleri %100 yükte.');
    } else {
      stressBtn.textContent = "Yük Testi";
      stressBtn.classList.remove('btn-danger');
      stressBtn.classList.add('btn-outline');
      addLog('HARDWARE', 'Stres testi durduruldu. Soğuma eğrisi bekleniyor.');
    }
  }

  globalTelemetryStress = toggleStress; // Expose

  stressBtn.addEventListener('click', () => {
    toggleStress();
  });

  function updateTelemetryLoop() {
    if (stressActive) {
      window.orinLoad = Math.min(100, window.orinLoad + (Math.random() * 15 + 5));
      window.orinTemp = Math.min(85, window.orinTemp + (Math.random() * 2 + 0.5));
    } else {
      window.orinLoad = Math.max(25, window.orinLoad + (Math.random() - 0.5) * 8);
      window.orinTemp = Math.max(39, window.orinTemp + (Math.random() - 0.5) * 1.5);
    }

    const spectrumIndicator = document.getElementById('spectrum-indicator');
    const jammingIsOn = spectrumIndicator.textContent.includes('JAMMING');
    
    if (jammingIsOn) {
      window.ganPower = Math.min(48, window.ganPower + 3);
      window.ganTemp = Math.min(75, window.ganTemp + 1.2);
    } else {
      window.ganPower = Math.max(12, window.ganPower - 2);
      window.ganTemp = Math.max(38, window.ganTemp - 0.8);
    }

    // Peltier Cooling Autopilot logic
    if (window.orinTemp > 55 || window.ganTemp > 52) {
      if (!window.peltierActive) {
        window.peltierActive = true;
        addLog('HARDWARE', 'UYARI: Kritik sıcaklık eşiği aşıldı! Peltier aktif sıvı soğutma devreye sokuldu.');
      }
    } else if (window.orinTemp < 44 && window.ganTemp < 42) {
      if (window.peltierActive) {
        window.peltierActive = false;
        addLog('HARDWARE', 'BİLGİ: Sistem sıcaklığı normale döndü. Peltier soğutma standby konumunda.');
      }
    }

    if (window.peltierActive) {
      window.orinTemp = Math.max(38, window.orinTemp - (Math.random() * 2 + 1));
      window.ganTemp = Math.max(36, window.ganTemp - (Math.random() * 1.5 + 0.8));
      
      txtPeltierStatus.textContent = 'DURUM: AKTİF SOĞUTMA';
      txtPeltierStatus.style.color = '#00ff66';
      lightPeltier.classList.add('active');
      svgFan.classList.add('cooling-active');
      svgFan.style.animationDuration = '0.5s';
    } else {
      txtPeltierStatus.textContent = 'DURUM: STANDBY (Beklemede)';
      txtPeltierStatus.style.color = '#718096';
      lightPeltier.classList.remove('active');
      
      if (window.orinTemp > 45) {
        svgFan.classList.add('cooling-active');
        svgFan.style.animationDuration = '3s';
      } else {
        svgFan.classList.remove('cooling-active');
      }
    }

    barOrinLoad.style.width = `${window.orinLoad}%`;
    txtOrinLoad.textContent = `${Math.floor(window.orinLoad)}%`;
    txtOrinTemp.textContent = `${window.orinTemp.toFixed(1)} °C`;
    
    if (window.orinLoad > 85) {
      barOrinLoad.style.backgroundColor = '#ff3366';
    } else if (window.orinLoad > 65) {
      barOrinLoad.style.backgroundColor = '#f5af19';
    } else {
      barOrinLoad.style.backgroundColor = '#00f2fe';
    }

    barGanPower.style.width = `${(window.ganPower / 48) * 100}%`;
    txtGanPower.textContent = `${window.ganPower.toFixed(0)}W`;
    txtGanTemp.textContent = `${window.ganTemp.toFixed(1)} °C`;

    if (window.ganTemp > 60) {
      barGanPower.style.backgroundColor = '#ff3366';
    } else {
      barGanPower.style.backgroundColor = '#f5af19';
    }
  }

  setInterval(updateTelemetryLoop, 1000);
}

/* ==========================================
   AGI SPEC: BLOCH SPHERE QUANTUM VISUALIZER
   ========================================== */
function initBlochSphere() {
  const canvas = document.getElementById('bloch-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = 150;
  let height = canvas.height = 120;
  const cx = width / 2;
  const cy = height / 2;
  const r = 40; // sphere radius

  let rotationAngle = 0;
  let theta = 1.047; // Latitude (0 to PI)
  let phi = 0.785;   // Longitude (0 to 2PI)

  function resize() {
    const parent = canvas.parentElement;
    width = canvas.width = parent.clientWidth;
    height = canvas.height = parent.clientHeight;
  }
  
  window.addEventListener('resize', () => {
    if (document.getElementById('panel-agi').classList.contains('active')) {
      resize();
    }
  });

  function drawBlochSphere() {
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2.6;

    // 1. Draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 2. Draw horizontal ellipse (Equator)
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius, radius * 0.3, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.08)';
    ctx.stroke();

    // 3. Draw vertical axes
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 5);
    ctx.lineTo(centerX, centerY + radius + 5); // Z Axis
    ctx.moveTo(centerX - radius - 5, centerY);
    ctx.lineTo(centerX + radius + 5, centerY); // X/Y plane projection
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.stroke();

    // Z labels (|0⟩ and |1⟩)
    ctx.font = '7px monospace';
    ctx.fillStyle = 'rgba(0, 242, 254, 0.6)';
    ctx.fillText('|0⟩', centerX - 4, centerY - radius - 8);
    ctx.fillText('|1⟩', centerX - 4, centerY + radius + 12);

    // 4. Calculate Vector Point Coordinates from Spherical Coordinates
    // Evolve rotationAngle slightly over time
    rotationAngle += 0.01;

    // Modify angles slightly if quantum noise is checked
    let currentTheta = theta;
    let currentPhi = phi + rotationAngle;
    if (document.getElementById('chk-quantum-noise').checked) {
      currentTheta += (Math.random() - 0.5) * 0.15;
      currentPhi += (Math.random() - 0.5) * 0.25;
    }

    // 3D Spherical to Cartesian coordinates projection
    const x = Math.sin(currentTheta) * Math.cos(currentPhi);
    const y = Math.sin(currentTheta) * Math.sin(currentPhi);
    const z = Math.cos(currentTheta);

    // Project coordinates onto 2D canvas coordinates
    // We tilt the sphere slightly: Y axis goes into the screen, X goes right, Z goes up
    const px = centerX + x * radius;
    const py = centerY - z * radius + y * radius * 0.15; // slightly flattened perspective

    // Update text indicators
    document.getElementById('txt-bloch-coords').innerHTML = `
      <span>|ψ⟩ Coords: θ=${currentTheta.toFixed(2)}, φ=${(currentPhi % (Math.PI*2)).toFixed(2)}</span>
      <span>Kararlılık: ${document.getElementById('chk-quantum-noise').checked ? '%42.8' : '%94.5'}</span>
    `;

    // 5. Draw vector line and arrowhead
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(px, py);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Arrow tip
    ctx.beginPath();
    ctx.arc(px, py, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Projection dashed lines to Z axis and XY plane
    ctx.beginPath();
    ctx.setLineDash([2, 2]);
    ctx.moveTo(px, py);
    ctx.lineTo(centerX, py); // projection to Z axis
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.stroke();
    ctx.setLineDash([]); // Reset
  }

  function loop() {
    if (document.getElementById('panel-agi').classList.contains('active') || !width) {
      if (canvas.width === 0) resize();
      drawBlochSphere();
    }
    requestAnimationFrame(loop);
  }

  resize();
  loop();
}

/* ==========================================
   CLI CONSOLE SYSTEM COMMANDS
   ========================================== */
function initCliConsole() {
  const cliInput = document.getElementById('cli-input');
  if (!cliInput) return;

  cliInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const input = cliInput.value.trim();
      cliInput.value = '';

      if (input !== '') {
        processCommand(input);
      }
    }
  });

  function processCommand(cmdLine) {
    addLog('CLI', `> ${cmdLine}`);

    // Parse command name and args
    const parts = cmdLine.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    switch (cmd) {
      case '/help':
        addLog('SYSTEM', '<b>Mevcut CLI Komutları:</b>');
        addLog('SYSTEM', '  <span style="color:#00f2fe">/jam</span> - Elektronik harp karıştırmayı açar/kapatır.');
        addLog('SYSTEM', '  <span style="color:#00f2fe">/stress</span> - CPU/GPU yük stres testini tetikler.');
        addLog('SYSTEM', '  <span style="color:#00f2fe">/reset</span> - AGI active inference ajanını başlangıç noktasına döndürür.');
        addLog('SYSTEM', '  <span style="color:#00f2fe">/status</span> - Sistem telemetrisi ve çalışma istatistikleri raporu verir.');
        addLog('SYSTEM', '  <span style="color:#00f2fe">/clear</span> - Tüm terminal satırlarını temizler.');
        break;

      case '/jam':
        if (globalToggleJamming) {
          globalToggleJamming();
        } else {
          addLog('SYSTEM', 'Hata: OMEGA modülü aktif değil.');
        }
        break;

      case '/stress':
        if (globalTelemetryStress) {
          globalTelemetryStress();
        } else {
          addLog('SYSTEM', 'Hata: Telemetri kontrolcü başlatılamadı.');
        }
        break;

      case '/reset':
        if (globalResetAgent) {
          globalResetAgent();
          addLog('SYSTEM', 'AGI Pathfinder Ajanı konumu sıfırlandı (0, 0).');
        } else {
          addLog('SYSTEM', 'Hata: AGI çıkarım motoru aktif değil.');
        }
        break;

      case '/status':
        const specName = document.getElementById('select-signal-type').value.toUpperCase();
        const jammingOn = document.getElementById('spectrum-indicator').textContent.includes('JAMMING');
        addLog('SYSTEM', `<b>[SİSTEM TELEMETRİ DURUM RAPORU]</b>`);
        addLog('SYSTEM', `  - Jetson Orin Core Sıcaklığı: ${window.orinTemp ? window.orinTemp.toFixed(1) : 42}°C | Yük: ${window.orinLoad ? window.orinLoad.toFixed(0) : 45}%`);
        addLog('SYSTEM', `  - GaN Güç Amplifikatörü: ${window.ganPower ? window.ganPower.toFixed(0) : 12}W | Sıcaklık: ${window.ganTemp ? window.ganTemp.toFixed(1) : 38}°C`);
        addLog('SYSTEM', `  - Peltier Soğutma Modülü: ${window.peltierActive ? 'AKTİF SOĞUTMA' : 'STANDBY'}`);
        addLog('SYSTEM', `  - Aktif Spektrum Dinleme: ${specName} | Karıştırıcı Verici: ${jammingOn ? 'YAYINDA (+43 dBm)' : 'KAPALI'}`);
        break;

      case '/clear':
        document.getElementById('console-log-rows').innerHTML = '';
        addLog('SYSTEM', 'Konsol temizlendi.');
        break;

      default:
        addLog('SYSTEM', `<span style="color:#ff3366">Hata: Geçersiz sistem komutu: ${cmd}. Yardım menüsü için /help yazın.</span>`);
        break;
    }
  }
}

/* ==========================================
   MISSION CONTROL STORYBOARD ENGINE
   ========================================== */
function initMissionControl() {
  const missionTypeSelect = document.getElementById('select-mission-type');
  const detailsTitle = document.getElementById('mission-details-title');
  const detailsText = document.getElementById('mission-details-text');
  const startBtn = document.getElementById('btn-start-mission');
  const stopBtn = document.getElementById('btn-stop-mission');
  const stepsList = document.getElementById('timeline-steps-list');
  const progressPercent = document.getElementById('mission-progress-percent');

  window.missionRunning = false;
  let storyboardTimeouts = [];

  const missionSpecs = {
    'ew-patrol': {
      title: 'OMEGA Sınır Ötesi Elektronik Harp Devriyesi',
      text: 'İHA platformumuz sınır hattında uçuş gerçekleştirirken, düşman hava savunma radarları (LPI radar) tespit edilecek ve Bayesian karar mekanizması tarafından otomatik karıştırma (Jamming) başlatılacaktır.',
      steps: [
        { time: 'T+0.0s', title: 'Uçuş Hattı Kilitlendi', desc: 'İHA otonom devriye rotasına girdi. SDR spektrum taraması 2.45 GHz bandına kilitlendi.' },
        { time: 'T+3.0s', title: 'Tehdit Radarı Yakalandı', desc: 'Wigner-Ville analizi yardımıyla düşük güçte çalışan askeri radar sinyali (LPI radar) tespit edildi.' },
        { time: 'T+6.0s', title: 'Sinyal Deşifre Ve Karar', desc: 'DenseNet yapay zeka sınıflandırıcısı sinyali LPI olarak doğruladı. Bayesian karar tablosu DRFM gürültü karıştırma kararını üretti.' },
        { time: 'T+9.0s', title: 'GaN Jamming Yayını Başladı', desc: 'OMEGA karıştırıcı verici +43 dBm gücünde DRFM yayını başlattı. Telemetride GaN güç tüketimi 45W değerine fırladı.' },
        { time: 'T+12.0s', title: 'Peltier Soğutma Devrede', desc: 'İşlemci ve yükselteç ısısı sınır değere ulaştığı için Peltier otomatik devreye girerek sistemi soğuttu.' },
        { time: 'T+15.0s', title: 'Görev Başarıyla Tamamlandı', desc: 'Düşman radarı bloke edildi ve İHA güvenli rotaya döndü. Jamming durduruldu.' }
      ]
    },
    'swarm-avoid': {
      title: 'AGI Otonom Sürü İHA Koordinasyon Görevi',
      text: '12 adet asenkron İHA otonom ajanı, bilinmeyen bir alanda engelleri aşarak hedef noktaya ulaşmak için hiyerarşik aktif çıkarım gerçekleştirecektir. Amaç serbest enerjiyi minimuma indirmektir.',
      steps: [
        { time: 'T+0.0s', title: 'Sürü Ajanları Senkronize', desc: '12 asenkron mikroservis haberleşmesi kuruldu. AGI Bilişsel Bağlantı Grafiği orkestrasyonu başladı.' },
        { time: 'T+3.0s', title: 'Vektör Bellek Yüklemesi', desc: 'Semantik veri tabanından `swarm_avoidance_obstacles` modeli çağrıldı. Engel haritası çıkarım motoruna işlendi.' },
        { time: 'T+6.0s', title: 'Aktif Çıkarım (Active Inference)', desc: 'Ajanlar hareket planını hesaplayarak varyasyonel serbest enerji / sürpriz değerini 0.12 nats altına düşürdü.' },
        { time: 'T+9.0s', title: 'Anlık CPU Isı Artışı', desc: 'Çıkarım yoğunluğu nedeniyle Jetson Orin Nano CPU yükü %98 seviyesine çıktı. Peltier soğutma fanı çalıştırıldı.' },
        { time: 'T+12.0s', title: 'Engeller Güvenle Aşıldı', desc: 'Ajanlar hedef koordinatlara yaklaştı. Serbest enerji sıfıra yakınsıyor.' },
        { time: 'T+15.0s', title: 'Sürü Hedefe Ulaştı', desc: 'Tüm sürü elemanları kayıp vermeden hedef bölgeye vardı. Çıkarım motoru bekleme moduna girdi.' }
      ]
    },
    'quantum-decide': {
      title: 'Kuantum Bilişsel Durum ve Karar Destek Simülasyonu',
      text: 'Yoğun parazit altında kuantum tünelleme algoritmalarının koherent kararlar alabilme kabiliyeti Lindblad Master Denklemi ile simüle edilecektir. Bloch küresi karar uzayını çizer.',
      steps: [
        { time: 'T+0.0s', title: 'Kuantum Karar Modülü Aktif', desc: 'Lindblad denklem matrisleri oluşturuldu. Bloch küresi koherent başlangıç durumuna kilitlendi.' },
        { time: 'T+3.0s', title: 'Dış Gürültü Girişi (Noise)', desc: 'Sisteme harici kuantum bilişsel gürültü dahil edildi. Bloch küresi kararsız yörüngede dönmeye başladı.' },
        { time: 'T+6.0s', title: 'Bilişsel Tünelleme', desc: 'Lindblad denklemi sönümleme terimleri gürültü bileşenlerini filtre etti. Küre konumu kararlı hale getiriliyor.' },
        { time: 'T+9.0s', title: 'Karar Matrisi Stabil', desc: 'Karar alma olasılığı %94.2 olasılıkla nihai duruma tünelledi. AGI orkestrasyonu tehdidi ayırt etti.' },
        { time: 'T+12.0s', title: 'Nihai Karar Çıktısı', desc: 'Belirsizlik altında en doğru lojistik karar otonom verildi. Görev tamamlandı.' }
      ]
    }
  };

  missionTypeSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    const spec = missionSpecs[val];
    if (spec) {
      detailsTitle.textContent = spec.title;
      detailsText.textContent = spec.text;
    }
  });

  startBtn.addEventListener('click', () => {
    const val = missionTypeSelect.value;
    const spec = missionSpecs[val];
    if (spec) {
      startMission(spec);
    }
  });

  stopBtn.addEventListener('click', () => {
    stopMission();
  });

  function startMission(spec) {
    window.missionRunning = true;
    startBtn.disabled = true;
    missionTypeSelect.disabled = true;
    stopBtn.disabled = false;
    stepsList.innerHTML = '';
    progressPercent.textContent = 'GÖREV BAŞLADI (%0)';
    progressPercent.className = 'badge badge-warning blinking';

    addLog('GÖREV KONTROL', `Simülasyon başlatıldı: [${spec.title}]`);

    // Synchronize views
    if (spec === missionSpecs['ew-patrol']) {
      switchTab('omega');
    } else if (spec === missionSpecs['swarm-avoid'] || spec === missionSpecs['quantum-decide']) {
      switchTab('agi');
    }

    // Schedule storyboard timeline cards
    spec.steps.forEach((step, index) => {
      const timeoutId = setTimeout(() => {
        const percent = Math.floor(((index + 1) / spec.steps.length) * 100);
        progressPercent.textContent = `GÖREV YÜRÜTÜLÜYOR (%${percent})`;
        
        // Remove active class from previous timeline steps
        const prevCards = stepsList.querySelectorAll('.timeline-card');
        prevCards.forEach(card => {
          card.classList.remove('active');
          card.classList.add('done');
        });

        // Add new card
        const card = document.createElement('div');
        card.className = 'timeline-card active';
        card.innerHTML = `
          <div class="timeline-card-header">
            <span class="timeline-card-title">${step.title}</span>
            <span class="timeline-card-time">${step.time}</span>
          </div>
          <span class="timeline-card-desc">${step.desc}</span>
        `;
        stepsList.appendChild(card);
        stepsList.scrollTop = stepsList.scrollHeight;

        // Perform side-effects inside simulator models
        triggerScenarioActions(spec, index);

        addLog('GÖREV KONTROL', `Aşama tetiklendi: ${step.title}`);

        if (index === spec.steps.length - 1) {
          // Finished
          progressPercent.textContent = 'TAMAMLANDI';
          progressPercent.className = 'badge badge-info';
          stopBtn.disabled = true;
          startBtn.disabled = false;
          missionTypeSelect.disabled = false;
          window.missionRunning = false;
        }

      }, index * 3000); // 3 seconds interval

      storyboardTimeouts.push(timeoutId);
    });
  }

  function triggerScenarioActions(spec, stepIdx) {
    const isEw = spec === missionSpecs['ew-patrol'];
    const isSwarm = spec === missionSpecs['swarm-avoid'];
    const isQuantum = spec === missionSpecs['quantum-decide'];

    if (isEw) {
      if (stepIdx === 1) {
        document.getElementById('select-signal-type').value = 'lpi';
        addLog('OMEGA SDR', 'SDR spektrum dinlemesi LPI radarı yakaladı.');
      } else if (stepIdx === 3) {
        // Toggle Jamming ON
        if (globalToggleJamming) globalToggleJamming(true);
      } else if (stepIdx === 4) {
        // High thermal Peltier trigger
        window.orinTemp = 68;
        window.ganTemp = 65;
      } else if (stepIdx === 5) {
        // Stop Jamming
        if (globalToggleJamming) globalToggleJamming(false);
      }
    }

    if (isSwarm) {
      if (stepIdx === 1) {
        // Redistribute and reset agent
        if (window.redistributeObstacles) window.redistributeObstacles(8);
      } else if (stepIdx === 3) {
        // Raise Orin stress load
        window.orinLoad = 98;
        window.orinTemp = 74;
      } else if (stepIdx === 5) {
        // Chill down
        window.orinLoad = 35;
      }
    }

    if (isQuantum) {
      if (stepIdx === 1) {
        // Enable Quantum Noise
        document.getElementById('chk-quantum-noise').checked = true;
      } else if (stepIdx === 3) {
        // Stabilization
        document.getElementById('chk-quantum-noise').checked = false;
      }
    }
  }

  function stopMission() {
    storyboardTimeouts.forEach(id => clearTimeout(id));
    storyboardTimeouts = [];
    
    startBtn.disabled = false;
    missionTypeSelect.disabled = false;
    stopBtn.disabled = true;
    window.missionRunning = false;
    
    progressPercent.textContent = 'İPTAL EDİLDİ';
    progressPercent.className = 'badge badge-info';
    
    // Stop all jamming and stress tests
    if (globalToggleJamming) globalToggleJamming(false);
    if (globalTelemetryStress) globalTelemetryStress(false);
    
    addLog('GÖREV KONTROL', 'Göre simülasyonu kullanıcı tarafından manuel olarak sonlandırıldı.');
  }
}

/* ==========================================
   CYBER OVERDRIVE MODE (EASTER EGG)
   ========================================== */
function initEasterEgg() {
  const banner = document.getElementById('banner-click-trigger');
  if (!banner) return;

  banner.addEventListener('click', () => {
    const isCyber = document.body.classList.toggle('cyber-mode');
    
    const agiIndicator = document.getElementById('agi-indicator');
    const spectrumIndicator = document.getElementById('spectrum-indicator');

    if (isCyber) {
      agiIndicator.textContent = "MATRIX OVERRIDE";
      agiIndicator.className = "status-value text-green";
      
      if (spectrumIndicator.textContent !== "JAMMING ON") {
        spectrumIndicator.textContent = "CYBER LOCK";
        spectrumIndicator.className = "status-value text-green";
      }

      addLog('SYSTEM', 'MATRIX OVERDRIVE: Bilişsel arayüz emülasyonu yeşil matris moduna geçirildi.');
      addLog('SYSTEM', 'Gelişmiş veri süzgeçleri ve tarama çizgileri aktif edildi.');
    } else {
      agiIndicator.textContent = "OPTIMAL";
      agiIndicator.className = "status-value text-blue";
      
      if (spectrumIndicator.textContent === "CYBER LOCK") {
        spectrumIndicator.textContent = "SECURE";
        spectrumIndicator.className = "status-value text-green";
      }

      addLog('SYSTEM', 'Arayüz varsayılan fütüristik mavi/kırmızı moda döndürüldü.');
    }
  });
}
