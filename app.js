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
  initSdrAudio();
  initOodaEngine();
  initTelemetry();
  initBlochSphere();
  initEnergySimulator();
  initCliConsole();
  initMissionControl();
  initEasterEgg();
  
  // Initial logs
  addLog('SYSTEM', 'Tüm bilişsel modüller başarıyla başlatıldı. Portal çevrim içi.');
  addLog('SYSTEM', 'CLI terminali aktif. Komutları denemek için /help yazabilirsiniz.');
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.error('Service Worker registration failed', err));
  }
});

/* ==========================================
   TAB NAVIGATION SYSTEM
   ========================================== */
function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  const panels = document.querySelectorAll('.content-panel');
  const orbAgi = document.getElementById('orb-agi');
  const orbOmega = document.getElementById('orb-omega');
  const orbEnergy = document.getElementById('orb-energy');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });

  window.setHeroBanner = function(imgSrc, thumbEl) {
    const mainImg = document.getElementById('banner-logo-img');
    if (mainImg) {
      mainImg.style.opacity = '0.3';
      setTimeout(() => {
        mainImg.src = imgSrc;
        mainImg.style.opacity = '1';
      }, 150);
    }
    const thumbs = document.querySelectorAll('.banner-thumb');
    thumbs.forEach(t => t.classList.remove('active'));
    if (thumbEl) thumbEl.classList.add('active');
    addLog('SYSTEM', `Ana hero banner görseli güncellendi: [${imgSrc.split('/').pop()}]`);
  };

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
      if (orbEnergy) orbEnergy.style.opacity = '0.05';
      addLog('SYSTEM', 'ARAT AGI RESEARCH laboratuvar ortamı görüntülendi.');
    } else if (tabName === 'omega') {
      orbOmega.style.transform = 'scale(1.4) translate(-10%, -10%)';
      orbOmega.style.opacity = '0.3';
      orbAgi.style.opacity = '0.05';
      if (orbEnergy) orbEnergy.style.opacity = '0.05';
      addLog('SYSTEM', 'ARAT OMEGA EW bilişsel elektronik harp kontrol paneli görüntülendi.');
    } else if (tabName === 'energy') {
      if (orbEnergy) {
        orbEnergy.style.transform = 'translate(-50%, -50%) scale(1.3)';
        orbEnergy.style.opacity = '0.25';
      }
      orbAgi.style.opacity = '0.05';
      orbOmega.style.opacity = '0.05';
      addLog('SYSTEM', 'ARAT ENERGY (VOLT) Kuantum Termodinamik ve Akıllı Şebeke laboratuvarı görüntülendi.');
    } else if (tabName === 'mission') {
      orbOmega.style.transform = 'none';
      orbAgi.style.transform = 'none';
      orbOmega.style.opacity = '0.15';
      orbAgi.style.opacity = '0.15';
      if (orbEnergy) orbEnergy.style.opacity = '0.15';
      addLog('SYSTEM', 'Taktiksel Görev Kontrol paneli görüntülendi.');
    } else {
      orbAgi.style.transform = 'none';
      orbOmega.style.transform = 'none';
      orbAgi.style.opacity = '0.15';
      orbOmega.style.opacity = '0.15';
      if (orbEnergy) orbEnergy.style.opacity = '0.05';
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

  window.clearAllObstacles = function() {
    obstacles = [];
    resetSimulation();
  };

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    const gridX = Math.floor((clickX / rect.width) * gridCount);
    const gridY = Math.floor((clickY / rect.height) * gridCount);
    
    if (gridX >= 0 && gridX < gridCount && gridY >= 0 && gridY < gridCount) {
      if (e.shiftKey) {
        if (gridX === agent.x && gridY === agent.y) return;
        target = { x: gridX, y: gridY };
        obstacles = obstacles.filter(o => o.x !== gridX || o.y !== gridY);
        addLog('AGI SIMULATION', `Hedef koordinatı güncellendi: (${gridX}, ${gridY})`);
        resetSimulation();
      } else if (e.ctrlKey) {
        if (gridX === target.x && gridY === target.y) return;
        agent = { x: gridX, y: gridY };
        obstacles = obstacles.filter(o => o.x !== gridX || o.y !== gridY);
        addLog('AGI SIMULATION', `Ajan koordinatı güncellendi: (${gridX}, ${gridY})`);
        resetSimulation();
      } else {
        if ((gridX === agent.x && gridY === agent.y) || (gridX === target.x && gridY === target.y)) return;
        const idx = obstacles.findIndex(o => o.x === gridX && o.y === gridY);
        if (idx !== -1) {
          obstacles.splice(idx, 1);
          addLog('AGI SIMULATION', `Engel kaldırıldı: (${gridX}, ${gridY})`);
        } else {
          obstacles.push({ x: gridX, y: gridY });
          addLog('AGI SIMULATION', `Yeni engel eklendi: (${gridX}, ${gridY})`);
        }
        resetSimulation();
      }
    }
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

    if (window.updateSdrAudio) {
      window.updateSdrAudio();
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
   OMEGA EW: SDR WEB AUDIO DEMODULATOR
   ========================================== */
window.audioPlaying = false;
function initSdrAudio() {
  const audioBtn = document.getElementById('btn-audio-toggle');
  const audioWave = document.getElementById('audio-wave');
  if (!audioBtn || !audioWave) return;

  const svgAudio = document.getElementById('svg-audio');
  
  const svgMuted = '<svg id="svg-audio" class="audio-icon" viewBox="0 0 24 24" style="width:14px;height:14px;fill:currentColor;"><path d="M3.63 3.63L2.36 4.9 7.46 10H4v4h4l4 4v-4.17l4.08 4.08c-.73.44-1.53.77-2.38.97v2.02c1.39-.27 2.68-.86 3.79-1.68l2.1 2.1 1.27-1.27L3.63 3.63zM10 15.17L8.83 14H6v-2h2.83l1.17 1.17v2zM12 4L9.91 6.09 12 8.18V4zm4.5 8c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71z"/></svg>';
  const svgPlaying = '<svg id="svg-audio" class="audio-icon" viewBox="0 0 24 24" style="width:14px;height:14px;fill:currentColor;"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';

  let audioCtx = null;
  let oscillators = [];
  let gainNode = null;
  let noiseSource = null;
  let fhssInterval = null;

  function setupAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.connect(audioCtx.destination);
    }
  }

  function stopAllSounds() {
    oscillators.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    oscillators = [];
    
    if (noiseSource) {
      try { noiseSource.stop(); } catch(e) {}
      noiseSource = null;
    }
    
    if (fhssInterval) {
      clearInterval(fhssInterval);
      fhssInterval = null;
    }
  }

  function playSignalSound(type, isJamming) {
    if (!window.audioPlaying) return;
    setupAudioContext();
    
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    stopAllSounds();

    if (isJamming) {
      const bufferSize = 2 * audioCtx.sampleRate;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2.0 - 1.0;
      }
      
      noiseSource = audioCtx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, audioCtx.currentTime);
      
      noiseSource.connect(filter);
      filter.connect(gainNode);
      
      noiseSource.start();
      return;
    }

    if (type === 'bpsk') {
      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      osc.connect(gainNode);
      osc.start();
      oscillators.push(osc);
    } 
    else if (type === 'qpsk') {
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      
      osc1.frequency.setValueAtTime(500, audioCtx.currentTime);
      osc2.frequency.setValueAtTime(504, audioCtx.currentTime);
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      
      osc1.start();
      osc2.start();
      oscillators.push(osc1, osc2);
    } 
    else if (type === 'fhss') {
      const osc = audioCtx.createOscillator();
      osc.type = 'sawtooth';
      osc.connect(gainNode);
      osc.start();
      oscillators.push(osc);

      const frequencies = [250, 400, 300, 600, 800, 500, 1000, 150];
      let hopIndex = 0;
      
      fhssInterval = setInterval(() => {
        if (!window.audioPlaying) return;
        const targetFreq = frequencies[hopIndex];
        osc.frequency.setValueAtTime(targetFreq, audioCtx.currentTime);
        hopIndex = (hopIndex + 1) % frequencies.length;
      }, 250);
    } 
    else if (type === 'lpi') {
      const osc = audioCtx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(90, audioCtx.currentTime);
      
      const lfo = audioCtx.createOscillator();
      lfo.frequency.setValueAtTime(0.5, audioCtx.currentTime);
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.setValueAtTime(25, audioCtx.currentTime);
      
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      
      osc.connect(gainNode);
      
      lfo.start();
      osc.start();
      oscillators.push(osc, lfo);
    }
  }

  function updateAudioTrigger() {
    const type = document.getElementById('select-signal-type').value;
    const spectrumIndicator = document.getElementById('spectrum-indicator');
    const jammingOn = spectrumIndicator.textContent.includes('JAMMING');
    playSignalSound(type, jammingOn);
  }

  audioBtn.addEventListener('click', () => {
    window.audioPlaying = !window.audioPlaying;
    
    if (window.audioPlaying) {
      setupAudioContext();
      audioBtn.innerHTML = svgPlaying + ' <span>SESİ KAPA</span>';
      audioBtn.classList.remove('btn-outline');
      audioBtn.classList.add('btn-primary');
      audioBtn.classList.remove('pulse-btn');
      audioWave.classList.add('audio-playing');
      addLog('OMEGA SDR', 'SDR Demodülatör ses çıkışı açıldı.');
      updateAudioTrigger();
    } else {
      audioBtn.innerHTML = svgMuted + ' <span>SESİ AÇ</span>';
      audioBtn.classList.remove('btn-primary');
      audioBtn.classList.add('btn-outline');
      audioWave.classList.remove('audio-playing');
      stopAllSounds();
      addLog('OMEGA SDR', 'SDR Demodülatör ses çıkışı kapatıldı.');
    }
  });

  window.updateSdrAudio = function() {
    if (window.audioPlaying) {
      updateAudioTrigger();
    }
  };
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
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const rect = canvas.getBoundingClientRect();
    const deltaX = e.clientX - previousMousePosition.x;
    const deltaY = e.clientY - previousMousePosition.y;

    phi = (phi - deltaX * 0.015) % (Math.PI * 2);
    if (phi < 0) phi += Math.PI * 2;

    theta = Math.max(0.01, Math.min(Math.PI - 0.01, theta + deltaY * 0.015));

    previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.setQuantumState = function(newTheta, newPhi) {
    theta = Math.max(0.01, Math.min(Math.PI - 0.01, newTheta));
    phi = newPhi % (Math.PI * 2);
    if (phi < 0) phi += Math.PI * 2;
  };

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
    if (!isDragging) {
      rotationAngle += 0.005;
    }

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

    const px = centerX + x * radius;
    const py = centerY - z * radius + y * radius * 0.15;

    // Update text indicators
    document.getElementById('txt-bloch-coords').innerHTML = `
      <span>|ψ⟩ Coords: θ=${currentTheta.toFixed(2)}, φ=${(currentPhi % (Math.PI*2)).toFixed(2)}</span>
      <span>Kararlılık: ${document.getElementById('chk-quantum-noise').checked ? '%42.8' : '%94.5'}</span>
    `;

    // Amplitudes
    const alphaReal = Math.cos(currentTheta / 2);
    const betaReal = Math.cos(currentPhi) * Math.sin(currentTheta / 2);
    const betaImag = Math.sin(currentPhi) * Math.sin(currentTheta / 2);

    const sign = betaImag >= 0 ? '+' : '-';
    const absVal = Math.abs(betaImag).toFixed(3);
    
    document.getElementById('txt-bloch-amplitudes').innerHTML = `
      <span>α: ${alphaReal.toFixed(3)} | β: ${betaReal.toFixed(3)} ${sign} ${absVal}i</span>
      <span>|ψ⟩ = ${alphaReal.toFixed(2)}|0⟩ + (${betaReal.toFixed(2)}${sign}${absVal}i)|1⟩</span>
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
   ARAT ENERGY: SMART GRID & TOKAMAK FUSION SIMULATOR
   ========================================== */
function initEnergySimulator() {
  const gridCanvas = document.getElementById('grid-canvas');
  const fusionCanvas = document.getElementById('fusion-canvas');
  if (!gridCanvas || !fusionCanvas) return;

  const gCtx = gridCanvas.getContext('2d');
  const fCtx = fusionCanvas.getContext('2d');

  let gWidth, gHeight, fWidth, fHeight;
  let animTime = 0;

  // Grid Simulation State
  let gridDemand = 45; // MW
  let gridMode = 'autonomous';
  let gridFrequency = 50.00;
  let fusionGen = 48.5; // MW
  let solarGen = 18.2; // MW
  let batteryStorage = 88.4; // % SoC
  let isBalancing = false;

  // Tokamak Fusion State
  let magneticField = 13.8; // Tesla
  let plasmaTemp = 124.5; // Million °C
  let thermalEff = 94.6; // %
  let qFactor = 3.42;
  let plasmaTurbulence = 1.0;
  let pulseEffect = 0;

  // Grid Nodes
  const gridNodes = [
    { id: 'fusion', name: 'Tokamak Reaktörü', type: 'gen', x: 0.2, y: 0.3, power: 48.5, color: '#f5af19' },
    { id: 'solar', name: 'Kuantum Hasadı', type: 'gen', x: 0.2, y: 0.75, power: 18.2, color: '#00ff66' },
    { id: 'battery', name: 'Katı Hal SMES', type: 'storage', x: 0.5, y: 0.5, power: 25.0, color: '#00f2fe' },
    { id: 'ai', name: 'Edge AI Merkezi', type: 'load', x: 0.8, y: 0.25, power: -22.0, color: '#00f2fe' },
    { id: 'defense', name: 'OMEGA Savunma', type: 'load', x: 0.8, y: 0.55, power: -18.5, color: '#ff3366' },
    { id: 'substation', name: 'Şehir Dağıtımı', type: 'load', x: 0.8, y: 0.85, power: -30.0, color: '#f5af19' }
  ];

  const gridLinks = [
    { from: 0, to: 2 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 2, to: 4 },
    { from: 2, to: 5 },
    { from: 0, to: 3 }
  ];

  // Plasma Particles
  const plasmaParticles = [];
  const particleCount = 70;
  for (let i = 0; i < particleCount; i++) {
    plasmaParticles.push({
      angle: Math.random() * Math.PI * 2,
      radiusRatio: 0.3 + Math.random() * 0.45,
      speed: 0.02 + Math.random() * 0.04,
      size: 1.5 + Math.random() * 2.5,
      colorHue: Math.random() > 0.4 ? 40 : 180 + Math.random() * 40
    });
  }

  function resize() {
    if (gridCanvas.parentElement) {
      const gRect = gridCanvas.parentElement.getBoundingClientRect();
      gridCanvas.width = gWidth = gRect.width;
      gridCanvas.height = gHeight = gRect.height;
    }
    if (fusionCanvas.parentElement) {
      const fRect = fusionCanvas.parentElement.getBoundingClientRect();
      fusionCanvas.width = fWidth = fRect.width;
      fusionCanvas.height = fHeight = fRect.height;
    }
  }

  window.addEventListener('resize', resize);

  // Controls Event Listeners
  const demandRange = document.getElementById('range-grid-demand');
  if (demandRange) {
    demandRange.addEventListener('input', (e) => {
      gridDemand = parseFloat(e.target.value);
      updateGridTelemetry();
    });
  }

  const modeSelect = document.getElementById('select-grid-mode');
  if (modeSelect) {
    modeSelect.addEventListener('change', (e) => {
      gridMode = e.target.value;
      addLog('VOLT ENERJİ', `Şebeke çalışma modu güncellendi: [${gridMode.toUpperCase()}]`);
      if (gridMode === 'surge') {
        gridFrequency = 50.18;
      } else if (gridMode === 'island') {
        gridFrequency = 49.95;
      } else {
        gridFrequency = 50.00;
      }
      updateGridTelemetry();
    });
  }

  const balanceBtn = document.getElementById('btn-grid-balance');
  if (balanceBtn) {
    balanceBtn.addEventListener('click', () => {
      window.balanceGrid();
    });
  }

  const pulseBtn = document.getElementById('btn-plasma-pulse');
  if (pulseBtn) {
    pulseBtn.addEventListener('click', () => {
      window.pulsePlasma();
    });
  }

  const stabilizeBtn = document.getElementById('btn-plasma-stabilize');
  if (stabilizeBtn) {
    stabilizeBtn.addEventListener('click', () => {
      window.stabilizePlasma();
    });
  }

  window.balanceGrid = function() {
    isBalancing = true;
    addLog('VOLT ENERJİ', 'Bilişsel Yük Dengeleme devrede. Onsager entropi akış matrisleri optimize ediliyor...');
    setTimeout(() => {
      gridFrequency = 50.00;
      const energyInd = document.getElementById('energy-indicator');
      if (energyInd) {
        energyInd.textContent = '100% SYNC';
        energyInd.className = 'status-value text-green';
      }
      addLog('VOLT ENERJİ', 'Şebeke frekansı 50.00 Hz değerine kilitlendi. Süperiletken SMES stabil.');
      isBalancing = false;
      updateGridTelemetry();
    }, 1200);
  };

  window.pulsePlasma = function() {
    pulseEffect = 1.0;
    qFactor = (3.42 + Math.random() * 0.8).toFixed(2);
    plasmaTemp = (124.5 + Math.random() * 20).toFixed(1);
    addLog('VOLT ENERJİ', `Tokamak manyetik darbe gönderildi. Anlık Q-Faktörü: ${qFactor}, Sıcaklık: ${plasmaTemp} M °C`);
    updateFusionStats();
  };

  window.stabilizePlasma = function() {
    plasmaTurbulence = 0.4;
    magneticField = 14.5;
    thermalEff = 97.2;
    addLog('VOLT ENERJİ', 'Kuantum manyetik kilitleme aktif. Plazma kırılma riski %0.01 seviyesine düşürüldü.');
    updateFusionStats();
    setTimeout(() => {
      plasmaTurbulence = 1.0;
      magneticField = 13.8;
      thermalEff = 94.6;
      updateFusionStats();
    }, 4000);
  };

  function updateGridTelemetry() {
    const tele = document.getElementById('grid-telemetry-text');
    if (tele) {
      tele.innerHTML = `
        <div>ŞEBEKE FREKANSI: ${gridFrequency.toFixed(2)} Hz</div>
        <div>TALEP YÜKÜ: ${gridDemand.toFixed(1)} MW | SMES: %${batteryStorage.toFixed(1)}</div>
        <div>KAYIP/KAÇAK: %0.08 (Süperiletken Hatlar)</div>
        <div>FÜZYON KATKISI: ${fusionGen.toFixed(2)} MW (Net Pozitif)</div>
      `;
    }
  }

  function updateFusionStats() {
    const qBadge = document.getElementById('fusion-q-badge');
    const txtMag = document.getElementById('txt-mag-field');
    const txtTemp = document.getElementById('txt-plasma-temp');
    const txtEff = document.getElementById('txt-thermal-eff');

    if (qBadge) qBadge.textContent = `Q-FAKTÖRÜ: ${qFactor}`;
    if (txtMag) txtMag.textContent = `${magneticField} Tesla`;
    if (txtTemp) txtTemp.textContent = `${plasmaTemp} M °C`;
    if (txtEff) txtEff.textContent = `%${thermalEff}`;
  }

  // Draw Smart Grid Canvas
  function drawSmartGrid() {
    if (!gWidth || !gHeight) return;
    gCtx.clearRect(0, 0, gWidth, gHeight);

    // Draw grid lines
    gridLinks.forEach(link => {
      const fromNode = gridNodes[link.from];
      const toNode = gridNodes[link.to];

      const x1 = fromNode.x * gWidth;
      const y1 = fromNode.y * gHeight;
      const x2 = toNode.x * gWidth;
      const y2 = toNode.y * gHeight;

      // Base line
      gCtx.beginPath();
      gCtx.moveTo(x1, y1);
      gCtx.lineTo(x2, y2);
      gCtx.strokeStyle = 'rgba(245, 175, 25, 0.2)';
      gCtx.lineWidth = 2;
      gCtx.stroke();

      // Flowing power packet
      const packetT = ((animTime * 1.5 + (link.from * 0.3)) % 1);
      const px = x1 + (x2 - x1) * packetT;
      const py = y1 + (y2 - y1) * packetT;

      gCtx.beginPath();
      gCtx.arc(px, py, 3.5, 0, Math.PI * 2);
      gCtx.fillStyle = '#f5af19';
      gCtx.shadowColor = '#f5af19';
      gCtx.shadowBlur = 8;
      gCtx.fill();
      gCtx.shadowBlur = 0;
    });

    // Draw grid nodes
    gridNodes.forEach(node => {
      const nx = node.x * gWidth;
      const ny = node.y * gHeight;

      // Glow circle
      gCtx.beginPath();
      gCtx.arc(nx, ny, 16, 0, Math.PI * 2);
      gCtx.fillStyle = 'rgba(13, 17, 34, 0.85)';
      gCtx.strokeStyle = node.color;
      gCtx.lineWidth = 2;
      gCtx.fill();
      gCtx.stroke();

      // Inner dot
      gCtx.beginPath();
      gCtx.arc(nx, ny, 6, 0, Math.PI * 2);
      gCtx.fillStyle = node.color;
      gCtx.shadowColor = node.color;
      gCtx.shadowBlur = 10;
      gCtx.fill();
      gCtx.shadowBlur = 0;

      // Label text
      gCtx.font = '9px Orbitron, sans-serif';
      gCtx.fillStyle = '#ffffff';
      gCtx.textAlign = 'center';
      gCtx.fillText(node.name, nx, ny - 22);

      gCtx.font = '8px Inter, sans-serif';
      gCtx.fillStyle = node.type === 'load' ? '#ff4b2b' : '#00ff66';
      gCtx.fillText(`${node.power > 0 ? '+' : ''}${node.power} MW`, nx, ny + 28);
    });
  }

  // Draw Tokamak Fusion Plasma Canvas
  function drawFusionPlasma() {
    if (!fWidth || !fHeight) return;
    fCtx.clearRect(0, 0, fWidth, fHeight);

    const cx = fWidth / 2;
    const cy = fHeight / 2;
    const maxR = Math.min(fWidth, fHeight) * 0.42;

    // Draw Tokamak outer & inner magnetic containment chambers
    fCtx.beginPath();
    fCtx.arc(cx, cy, maxR, 0, Math.PI * 2);
    fCtx.strokeStyle = 'rgba(245, 175, 25, 0.35)';
    fCtx.lineWidth = 3;
    fCtx.stroke();

    fCtx.beginPath();
    fCtx.arc(cx, cy, maxR * 0.3, 0, Math.PI * 2);
    fCtx.fillStyle = 'rgba(5, 7, 15, 0.95)';
    fCtx.strokeStyle = 'rgba(0, 242, 254, 0.5)';
    fCtx.lineWidth = 2;
    fCtx.fill();
    fCtx.stroke();

    // Draw Magnetic Field Lines (Ellipses)
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI / 4) + (animTime * 0.2);
      fCtx.save();
      fCtx.translate(cx, cy);
      fCtx.rotate(angle);
      fCtx.beginPath();
      fCtx.ellipse(0, 0, maxR * 0.85, maxR * 0.38, 0, 0, Math.PI * 2);
      fCtx.strokeStyle = `rgba(245, 175, 25, ${0.08 + (pulseEffect * 0.2)})`;
      fCtx.lineWidth = 1.2;
      fCtx.stroke();
      fCtx.restore();
    }

    // Plasma Core Vortex
    const gradient = fCtx.createRadialGradient(cx, cy, maxR * 0.25, cx, cy, maxR * 0.8);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    gradient.addColorStop(0.3, `rgba(245, 175, 25, ${0.6 + pulseEffect * 0.3})`);
    gradient.addColorStop(0.7, 'rgba(255, 75, 43, 0.4)');
    gradient.addColorStop(1, 'transparent');

    fCtx.beginPath();
    fCtx.arc(cx, cy, maxR * 0.8, 0, Math.PI * 2);
    fCtx.fillStyle = gradient;
    fCtx.fill();

    // Pulse Shockwave
    if (pulseEffect > 0.02) {
      fCtx.beginPath();
      fCtx.arc(cx, cy, maxR * (1 - pulseEffect * 0.5), 0, Math.PI * 2);
      fCtx.strokeStyle = `rgba(255, 255, 255, ${pulseEffect})`;
      fCtx.lineWidth = 4 * pulseEffect;
      fCtx.stroke();
      pulseEffect *= 0.95;
    }

    // Plasma Particles
    plasmaParticles.forEach(p => {
      p.angle += p.speed * plasmaTurbulence;
      const r = maxR * p.radiusRatio;
      const px = cx + Math.cos(p.angle) * r;
      const py = cy + Math.sin(p.angle) * r;

      fCtx.beginPath();
      fCtx.arc(px, py, p.size, 0, Math.PI * 2);
      fCtx.fillStyle = `hsl(${p.colorHue}, 100%, 70%)`;
      fCtx.shadowColor = `hsl(${p.colorHue}, 100%, 50%)`;
      fCtx.shadowBlur = 6;
      fCtx.fill();
      fCtx.shadowBlur = 0;
    });

    // Center Core Label
    fCtx.font = '10px Orbitron, sans-serif';
    fCtx.fillStyle = '#f5af19';
    fCtx.textAlign = 'center';
    fCtx.fillText('TOKAMAK CORE', cx, cy - 4);
    fCtx.font = '8px Inter, sans-serif';
    fCtx.fillStyle = '#00ff66';
    fCtx.fillText('D-T FUSION', cx, cy + 10);
  }

  function loop() {
    animTime += 0.02;
    const energyPanel = document.getElementById('panel-energy');
    if (energyPanel && energyPanel.classList.contains('active')) {
      if (gridCanvas.width === 0 || fusionCanvas.width === 0) resize();
      drawSmartGrid();
      drawFusionPlasma();
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
        addLog('SYSTEM', '  <span style="color:#f5af19">/energy</span> - Akıllı Şebeke ve Tokamak Füzyon telemetrisini listeler.');
        addLog('SYSTEM', '  <span style="color:#f5af19">/grid [balance|island|surge|quantum]</span> - Şebeke çalışma modunu değiştirir.');
        addLog('SYSTEM', '  <span style="color:#f5af19">/fusion [pulse|stabilize]</span> - Füzyon plazmasına manyetik darbe veya kilitleme uygular.');
        addLog('SYSTEM', '  <span style="color:#f5af19">/power [eco|normal|overdrive]</span> - Güç profilini ayarlar.');
        addLog('SYSTEM', '  <span style="color:#00f2fe">/theme [matrix|default|fusion|nebula]</span> - Arayüzün neon rengini/temasını değiştirir.');
        addLog('SYSTEM', '  <span style="color:#00f2fe">/audio [on|off]</span> - SDR ses demodülatörünü açar/kapatır.');
        addLog('SYSTEM', '  <span style="color:#00f2fe">/quantum &lt;theta&gt; &lt;phi&gt;</span> - Bloch küresi durumunu ayarlar (örnek: /quantum 1.04 0.78).');
        addLog('SYSTEM', '  <span style="color:#00f2fe">/obstacle [clear|random]</span> - Çıkarım engellerini temizler veya karıştırır.');
        addLog('SYSTEM', '  <span style="color:#00f2fe">/about</span> - ARAT LABS hakkında detayları gösterir.');
        addLog('SYSTEM', '  <span style="color:#00f2fe">/clear</span> - Tüm terminal satırlarını temizler.');
        break;

      case '/energy':
        addLog('VOLT ENERJİ', '<b>[ARAT ENERGY &amp; SMART GRID RAPORU]</b>');
        addLog('VOLT ENERJİ', '  - Tokamak D-T Plazma Durumu: AKTİF (Q=3.42 Net Pozitif)');
        addLog('VOLT ENERJİ', '  - Şebeke Frekansı: 50.00 Hz | Senkronizasyon: %100');
        addLog('VOLT ENERJİ', '  - Süperiletken SMES Rezervi: 48.5 MWs (%88.4 SoC)');
        addLog('VOLT ENERJİ', '  - Katı Hal PDU Verimi: %99.4 | Termoelektrik Geri Kazanım: 4.2 kW');
        break;

      case '/grid':
        const gMode = arg.trim().toLowerCase();
        const modeElem = document.getElementById('select-grid-mode');
        if (['balance', 'autonomous', 'island', 'surge', 'quantum'].includes(gMode)) {
          if (gMode === 'balance') {
            if (window.balanceGrid) window.balanceGrid();
          } else {
            if (modeElem) {
              modeElem.value = gMode;
              modeElem.dispatchEvent(new Event('change'));
            }
          }
        } else {
          addLog('SYSTEM', 'Kullanım: /grid [balance|island|surge|quantum]');
        }
        break;

      case '/fusion':
        const fAction = arg.trim().toLowerCase();
        if (fAction === 'pulse') {
          if (window.pulsePlasma) window.pulsePlasma();
        } else if (fAction === 'stabilize') {
          if (window.stabilizePlasma) window.stabilizePlasma();
        } else {
          addLog('SYSTEM', 'Kullanım: /fusion [pulse|stabilize]');
        }
        break;

      case '/power':
        const pMode = arg.trim().toLowerCase();
        if (pMode === 'eco') {
          window.ganPower = 8;
          addLog('SYSTEM', 'Güç profili [ECO] moduna alındı. GaN çıkış gücü 8W olarak kısıtlandı.');
        } else if (pMode === 'overdrive') {
          window.ganPower = 48;
          addLog('SYSTEM', 'Güç profili [OVERDRIVE] moduna alındı. Maksimum taktik güç devrede (+48 dBm).');
        } else if (pMode === 'normal') {
          window.ganPower = 15;
          addLog('SYSTEM', 'Güç profili [NORMAL] moduna alındı.');
        } else {
          addLog('SYSTEM', 'Kullanım: /power [eco|normal|overdrive]');
        }
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

      case '/theme':
        const themeName = arg.trim().toLowerCase();
        if (['default', 'matrix', 'fusion', 'nebula'].includes(themeName)) {
          document.body.classList.remove('theme-fusion', 'theme-nebula', 'cyber-mode');
          if (themeName === 'matrix') {
            document.body.classList.add('cyber-mode');
          } else if (themeName !== 'default') {
            document.body.classList.add(`theme-${themeName}`);
          }
          addLog('SYSTEM', `Arayüz teması başarıyla değiştirildi: [${themeName.toUpperCase()}]`);
        } else {
          addLog('SYSTEM', 'Hata: Geçersiz tema ismi. Seçenekler: default, matrix, fusion, nebula');
        }
        break;

      case '/audio':
        const audioState = arg.trim().toLowerCase();
        const audioBtn = document.getElementById('btn-audio-toggle');
        if (audioState === 'on') {
          if (!window.audioPlaying && audioBtn) audioBtn.click();
        } else if (audioState === 'off') {
          if (window.audioPlaying && audioBtn) audioBtn.click();
        } else {
          addLog('SYSTEM', 'Kullanım: /audio [on|off]');
        }
        break;

      case '/quantum':
        const qParts = arg.split(' ');
        if (qParts.length === 2) {
          const tVal = parseFloat(qParts[0]);
          const pVal = parseFloat(qParts[1]);
          if (!isNaN(tVal) && !isNaN(pVal)) {
            if (window.setQuantumState) {
              window.setQuantumState(tVal, pVal);
              addLog('SYSTEM', `Kuantum Bloch durum koordinatları el ile güncellendi: θ=${tVal.toFixed(2)}, φ=${pVal.toFixed(2)}`);
            } else {
              addLog('SYSTEM', 'Hata: Bloch küresi başlatılamadı.');
            }
          } else {
            addLog('SYSTEM', 'Hata: Koordinatlar sayısal değer olmalıdır.');
          }
        } else {
          addLog('SYSTEM', 'Kullanım: /quantum <theta> <phi> (örnek: /quantum 1.04 0.78)');
        }
        break;

      case '/obstacle':
        const obsAction = arg.trim().toLowerCase();
        if (obsAction === 'clear') {
          if (window.clearAllObstacles) {
            window.clearAllObstacles();
            addLog('SYSTEM', 'AGI simülatöründeki tüm engeller kaldırıldı.');
          }
        } else if (obsAction === 'random' || obsAction === '') {
          if (window.redistributeObstacles) {
            window.redistributeObstacles(6);
            addLog('SYSTEM', 'Engeller rastgele olarak yeniden dağıtıldı.');
          }
        } else {
          addLog('SYSTEM', 'Kullanım: /obstacle [clear|random]');
        }
        break;

      case '/about':
        addLog('SYSTEM', '<pre style="color:var(--color-agi); font-family:monospace; line-height: 1.1; font-size: 0.65rem;">' +
          '    ___    ____  ___  ______   __    ___    ____  _____\n' +
          '   /   |  / __ \\/   |/_  __/  / /   /   |  / __ )/ ___/\n' +
          '  / /| | / /_/ / /| |  / /   / /   / /| | / __  |\\__ \\ \n' +
          ' / ___ |/ _, _/ ___ | / /   / /___/ ___ |/ /_/ /___/ / \n' +
          '/_/  |_/_/ |_/_/  |_|/_/   /_____/_/  |_/_____//____/  \n' +
          '                                                       </pre>');
        addLog('SYSTEM', '<b>ARAT LABS - Bilişsel Kontrol Paneli v2.0</b>');
        addLog('SYSTEM', 'Gelişmiş Active Inference, Kuantum Biliş ve Bilişsel Elektronik Harp Simülasyon Ekosistemi.');
        addLog('SYSTEM', 'Tüm hakları saklıdır © 2026 Arat Labs Enterprise.');
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
    },
    'quantum-tunnel-jam': {
      title: 'Bilişsel Spektrum Tünelleme ve Elektronik Taarruz',
      text: 'Çok parazitli bir muharebe sahasında, İHA bilişsel sistemi Lindblad kuantum sönümlemesiyle karar alacak, hedefe giden yolda aktif çıkarımla engelleri aşacak ve GaN amplifikatörünü overdrive modunda çalıştırarak elektronik taarruz (jamming) başlatacaktır.',
      steps: [
        { time: 'T+0.0s', title: 'Karmaşık Görev Başlatıldı', desc: 'Bilişsel Spektrum Tünelleme ve Taarruz görevi kilitlendi. Spektrum analizi aktif.' },
        { time: 'T+3.0s', title: 'Kuantum Karar Stabilizasyonu', desc: 'Muharebe alanındaki yoğun elektromanyetik gürültü algılandı. Lindblad denklemi ile karar alma süreci kararlı Bloch küresine tünelledi.' },
        { time: 'T+6.0s', title: 'Aktif Çıkarım İle Rota Çizimi', desc: 'Engellerin arasından hedefe ulaşacak en düşük varyasyonel serbest enerjili rotasyon hesaplandı ve ajan ilerlemeye başladı.' },
        { time: 'T+9.0s', title: 'GaN Jammer Overdrive Tetiği', desc: 'Tehdit sinyali tespit edildi. Jamming vericisi devreye alındı. Telemetride RF çıkış gücü overdrive seviyesi olan +48 dBm\'e ulaştı.' },
        { time: 'T+12.0s', title: 'Peltier Isı Eşleme Modu', desc: 'GaN amplifikatör sıcaklığı 78°C sınırını aştı. Peltier soğutma fanı maksimum hızda döndürülmeye başlandı.' },
        { time: 'T+15.0s', title: 'Harp Alanı Baskılandı', desc: 'Karşı spektrum tamamen köreltildi, engeller aşıldı ve otonom İHA hedefine vardı. Sistem güvenli standby moduna çekildi.' }
      ]
    },
    'energy-grid-defense': {
      title: 'Akıllı Şebeke Siber-Fiziksel Savunma & Aşırı Yük İzolasyonu',
      text: 'Siber-fiziksel saldırı altında dengesini kaybeden mikro-şebekede, bilişsel yük dengeleyici ve katı hal SMES batarya rezervi otonom devreye girerek ada moduna geçer ve çöküşü engeller.',
      steps: [
        { time: 'T+0.0s', title: 'Şebeke Saldırısı Algılandı', desc: 'Frekans dalgalanması 49.60 Hz sınırına indi. Reaktif güç açığı tespit edildi.' },
        { time: 'T+3.0s', title: 'Otonom Ada Modu Aktivasyonu', desc: 'Şebeke izole ada moduna geçirildi. Kritik olmayan sivil yükler sınırlandırıldı.' },
        { time: 'T+6.0s', title: 'Katı Hal SMES Besleme', desc: '20 MW süperiletken manyetik batarya anlık devreye girerek 400 mikrosaniyede açığı kapattı.' },
        { time: 'T+9.0s', title: 'Bilişsel Yük Dengeleme', desc: 'Onsager matrisleri optimize edildi. Frekans 50.00 Hz değerine tam kilitlendi.' },
        { time: 'T+12.0s', title: 'Şebeke Senkronize ve Güvende', desc: 'Tehdit bertaraf edildi. Şebeke %100 senkronizasyonla normale döndü.' }
      ]
    },
    'fusion-plasma-confinement': {
      title: 'Manyetik Tokamak Plazma Kırılma Önleme ve Manyetik Kilitleme',
      text: 'Füzyon reaktöründe termal kaçak ve plazma türbülansı başladığında, yapay zeka geri besleme döngüsü manyetik alan bobinlerini mikrosaniye hassasiyetle kontrol ederek kırılmayı önler.',
      steps: [
        { time: 'T+0.0s', title: 'Plazma Manyetik Tutulum Başladı', desc: 'D-T füzyon yakıtı 120 M °C sıcaklığa çıkarıldı. Q-faktörü 3.42 seviyesinde.' },
        { time: 'T+3.0s', title: 'Plazma Kırılma (Disruption) Riski', desc: 'MHD kararsızlığı nedeniyle plazma çeperine manyetik kaçak tespit edildi.' },
        { time: 'T+6.0s', title: 'Manyetik Darbe Düzeltmesi', desc: '14.5 Tesla gücünde süperiletken manyetik darbe gönderilerek plazma merkez eksene çekildi.' },
        { time: 'T+9.0s', title: 'Termal Verim Maksimizasyonu', desc: 'Plazma kilitlenmesi tamamlandı. Termal verim %97.2 seviyesine yükseltildi.' },
        { time: 'T+12.0s', title: 'Sürekli Füzyon Kararlılığı', desc: 'Reaktör kararlı rejimde net 48.5 MW elektrik üretimine devam ediyor.' }
      ]
    },
    'deep-space-energy-harvest': {
      title: 'Derin Uzay / Uç Platform Termodinamik Enerji Hasatlama',
      text: 'Güneş ışınlarının zayıf olduğu derin uzay ve taktik operasyonlarda, kuantum termodinamik serbest enerji hasatlayıcıları ve Seebeck/Peltier hücreleri atık ısıyı elektriğe dönüştürür.',
      steps: [
        { time: 'T+0.0s', title: 'Düşük Güç Ortamına Giriş', desc: 'Harici güç kaynakları kesildi. Termodinamik enerji hasatlama sensörleri aktif.' },
        { time: 'T+3.0s', title: 'Kuantum Seebeck Dönüşümü', desc: 'GaN güç yükselticinin atık ısısından +4.2 kW saf elektrik geri kazanıldı.' },
        { time: 'T+6.0s', title: 'Serbest Enerji Minimizasyonu', desc: 'Helmholtz serbest enerji formülasyonu ile entropi üretimi sıfıra yakınsadı.' },
        { time: 'T+9.0s', title: 'Sonsuz Çalışma Döngüsü', desc: 'Uç yapay zeka ajanları sıfır harici enerjiyle kendi kendini idame ettiriyor.' }
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
    } else if (spec === missionSpecs['energy-grid-defense'] || spec === missionSpecs['fusion-plasma-confinement'] || spec === missionSpecs['deep-space-energy-harvest']) {
      switchTab('energy');
    } else {
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
    const isGridDefense = spec === missionSpecs['energy-grid-defense'];
    const isFusionConf = spec === missionSpecs['fusion-plasma-confinement'];
    const isSpaceHarvest = spec === missionSpecs['deep-space-energy-harvest'];

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

    if (isGridDefense) {
      if (stepIdx === 1) {
        const modeEl = document.getElementById('select-grid-mode');
        if (modeEl) {
          modeEl.value = 'island';
          modeEl.dispatchEvent(new Event('change'));
        }
      } else if (stepIdx === 3) {
        if (window.balanceGrid) window.balanceGrid();
      }
    }

    if (isFusionConf) {
      if (stepIdx === 2) {
        if (window.pulsePlasma) window.pulsePlasma();
      } else if (stepIdx === 3) {
        if (window.stabilizePlasma) window.stabilizePlasma();
      }
    }

    if (isSpaceHarvest) {
      if (stepIdx === 1) {
        const modeEl = document.getElementById('select-grid-mode');
        if (modeEl) {
          modeEl.value = 'quantum';
          modeEl.dispatchEvent(new Event('change'));
        }
      }
    }

    const isTunnelJam = spec === missionSpecs['quantum-tunnel-jam'];
    if (isTunnelJam) {
      if (stepIdx === 1) {
        document.getElementById('chk-quantum-noise').checked = true;
      } else if (stepIdx === 2) {
        document.getElementById('chk-quantum-noise').checked = false;
        if (window.redistributeObstacles) window.redistributeObstacles(5);
      } else if (stepIdx === 3) {
        switchTab('omega');
        if (globalToggleJamming) globalToggleJamming(true);
        window.ganPower = 48;
      } else if (stepIdx === 4) {
        window.orinTemp = 82;
        window.ganTemp = 78;
      } else if (stepIdx === 5) {
        if (globalToggleJamming) globalToggleJamming(false);
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
