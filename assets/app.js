/* ==========================================================================
   SARAVAN PRASANNA - PORTFOLIO INTERACTIVE SCRIPT (app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initThreeJS();
  initTypewriter();
  initAudioSynth();
  initCustomCursor();
  initTerminal();
  initSkillBarsAndFilters();
  initProjectSimulators();
  initModals();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   1. Preloader Boot Sequence
   -------------------------------------------------------------------------- */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const barFill = document.querySelector('.loader-bar-fill');
  const statusText = document.querySelector('.loader-status');
  const percentText = document.querySelector('.loader-percentage');

  const bootLogs = [
    "INITIALIZING_SARAVAN_OS_v2.0...",
    "LOADING_THREE_JS_NEURAL_MATRIX...",
    "CALIBRATING_OPENCV_CNN_PIPELINE...",
    "ESTABLISHING_ESP32_I2S_COMMUNICATION...",
    "SYNCHRONIZING_GROQ_LLAMA3_API...",
    "SYSTEM_READY_OPEN_FOR_INTERNSHIPS"
  ];

  let progress = 0;
  let logIndex = 0;

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 12) + 5;
    if (progress > 100) progress = 100;

    barFill.style.width = `${progress}%`;
    percentText.textContent = `${progress}%`;

    if (logIndex < bootLogs.length && progress > (logIndex + 1) * 15) {
      statusText.textContent = bootLogs[logIndex];
      logIndex++;
    }

    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        triggerInitialAnimations();
      }, 400);
    }
  }, 90);
}

function triggerInitialAnimations() {
  // Animate skill bars in view
  const skillFills = document.querySelectorAll('.skill-level-fill');
  skillFills.forEach(fill => {
    const targetWidth = fill.getAttribute('data-width') || '85%';
    fill.style.width = targetWidth;
  });
}

/* --------------------------------------------------------------------------
   2. Three.js Interactive Neural Core Background
   -------------------------------------------------------------------------- */
let scene, camera, renderer, neuralMesh, particlesMesh;
let mouseX = 0, mouseY = 0;

function initThreeJS() {
  const canvasContainer = document.getElementById('three-bg');
  if (!canvasContainer || typeof THREE === 'undefined') return;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.appendChild(renderer.domElement);

  // Create 3D Wireframe Icosahedron (AI Neural Core)
  const geometry = new THREE.IcosahedronGeometry(12, 2);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00f3ff,
    wireframe: true,
    transparent: true,
    opacity: 0.25
  });
  neuralMesh = new THREE.Mesh(geometry, material);
  scene.add(neuralMesh);

  // Add Particle Network Cloud
  const particlesCount = 400;
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);

  const color1 = new THREE.Color(0x00f3ff);
  const color2 = new THREE.Color(0x9d00ff);

  for (let i = 0; i < particlesCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 120;
    positions[i + 1] = (Math.random() - 0.5) * 120;
    positions[i + 2] = (Math.random() - 0.5) * 120;

    const mixedColor = Math.random() > 0.5 ? color1 : color2;
    colors[i] = mixedColor.r;
    colors[i + 1] = mixedColor.g;
    colors[i + 2] = mixedColor.b;
  }

  const particlesGeo = new THREE.BufferGeometry();
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particlesMat = new THREE.PointsMaterial({
    size: 1.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.7
  });

  particlesMesh = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particlesMesh);

  // Mouse Listener
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Window Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animateThreeJS();
}

function animateThreeJS() {
  requestAnimationFrame(animateThreeJS);

  if (neuralMesh) {
    neuralMesh.rotation.x += 0.003;
    neuralMesh.rotation.y += 0.005;
    
    // Smooth lerp interaction
    neuralMesh.rotation.y += mouseX * 0.01;
    neuralMesh.rotation.x += mouseY * 0.01;
  }

  if (particlesMesh) {
    particlesMesh.rotation.y -= 0.001;
  }

  renderer.render(scene, camera);
}

/* --------------------------------------------------------------------------
   3. Typewriter Effect for Hero Title
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const target = document.getElementById('typing-target');
  if (!target) return;

  const phrases = [
    "AI & Autonomous Systems Engineer",
    "Embedded AI Robotics Specialist (ESP32, C++)",
    "Computer Vision & Deep Learning Creator",
    "Full-Stack Web & ML Developer (Python, Flask, JS)"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      target.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      target.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentPhrase.length) {
      speed = 2200; // Pause at end of phrase
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  type();
}

/* --------------------------------------------------------------------------
   4. Audio Synth (Web Audio API for UI clicks)
   -------------------------------------------------------------------------- */
let audioCtx = null;
let soundEnabled = true;

function initAudioSynth() {
  const toggleBtn = document.getElementById('sound-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      toggleBtn.innerHTML = soundEnabled 
        ? `<i class="lucide-volume-2"></i> SOUND: ON` 
        : `<i class="lucide-volume-x"></i> SOUND: OFF`;
      toggleBtn.style.color = soundEnabled ? 'var(--cyan)' : 'var(--text-muted)';
    });
  }

  // Attach sound triggers to interactive buttons
  document.querySelectorAll('a, button, .social-icon-btn, .project-card, .filter-btn').forEach(elem => {
    elem.addEventListener('mouseenter', () => playSound(800, 0.03, 'sine'));
    elem.addEventListener('click', () => playSound(1200, 0.08, 'triangle'));
  });
}

function playSound(freq, duration, type = 'sine') {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Ignore audio restrictions
  }
}

/* --------------------------------------------------------------------------
   5. Custom Particle Cursor
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const dot = document.querySelector('.cursor-dot');
  const circle = document.querySelector('.cursor-circle');
  if (!dot || !circle) return;

  let circleX = 0, circleY = 0;
  let mousePosX = 0, mousePosY = 0;

  document.addEventListener('mousemove', (e) => {
    mousePosX = e.clientX;
    mousePosY = e.clientY;
    dot.style.left = `${mousePosX}px`;
    dot.style.top = `${mousePosY}px`;
  });

  function updateCircle() {
    circleX += (mousePosX - circleX) * 0.15;
    circleY += (mousePosY - circleY) * 0.15;
    circle.style.left = `${circleX}px`;
    circle.style.top = `${circleY}px`;
    requestAnimationFrame(updateCircle);
  }
  updateCircle();
}

/* --------------------------------------------------------------------------
   6. Interactive AI Terminal (SP-OS v2.0)
   -------------------------------------------------------------------------- */
function initTerminal() {
  const drawer = document.getElementById('terminal-drawer');
  const openBtns = document.querySelectorAll('.open-terminal-btn');
  const closeBtn = document.querySelector('.terminal-close');
  const input = document.getElementById('terminal-input');
  const output = document.querySelector('.terminal-body');
  const chipBtns = document.querySelectorAll('.chip-btn');

  if (!drawer || !input || !output) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      drawer.classList.add('open');
      input.focus();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => drawer.classList.remove('open'));
  }

  // Handle Preset Chips
  chipBtns.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        input.value = cmd;
        processCommand(cmd);
      }
    });
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim();
      if (cmd) {
        processCommand(cmd);
        input.value = '';
      }
    }
  });

  function processCommand(cmd) {
    appendOutput(`\n<span style="color: var(--cyan)">guest@saravan-os:~$</span> ${escapeHTML(cmd)}`);

    const lower = cmd.toLowerCase();

    if (lower === 'help') {
      appendOutput(`
Available Commands:
  <span style="color:var(--cyan)">whoami</span>     : Summary profile of Saravan Prasanna
  <span style="color:var(--cyan)">skills</span>     : Technical stack & competencies
  <span style="color:var(--cyan)">projects</span>   : Major AI & Full-Stack projects
  <span style="color:var(--cyan)">awards</span>     : Hackathon wins & achievements
  <span style="color:var(--cyan)">contact</span>    : Phone, Email, Location & Social Links
  <span style="color:var(--cyan)">github</span>     : Open GitHub portfolio profile directly
  <span style="color:var(--cyan)">linkedin</span>   : Open LinkedIn profile directly
  <span style="color:var(--cyan)">matrix</span>     : Rain animation mode
  <span style="color:var(--cyan)">clear</span>      : Clear terminal screen
      `);
    } else if (lower === 'whoami') {
      appendOutput(`
SARAVAN PRASANNA - AI Engineer & Tech Lead
Education : B.Tech AI & Data Science (2025 - 2029) at V S B College of Engineering
Status    : Fresher 2nd Year | Open to Internships
Focus     : Embedded AI Robotics (ESP32), Computer Vision (OpenCV, CNN), Full-Stack Web (Flask, Three.js)
      `);
    } else if (lower === 'skills') {
      appendOutput(`
Languages  : C++, Python, JavaScript, HTML, CSS, SQL
AI / CV    : OpenCV, Haar Cascade, LBPH, CNN, FER2013, Meta Llama 3.3 70B, Groq API, CLAHE
Embedded   : ESP32, I2S MEMS Mic, Class-D Amplifier, OLED Interface, Digital Signal Processing
Web & DB   : Flask, Three.js, Chart.js, SQLite, REST APIs
      `);
    } else if (lower === 'projects') {
      appendOutput(`
1. <span style="color:#fff; font-weight:bold">AI-Powered Voice Assistant Robot</span> (ESP32, Flask, Groq Llama 3.3, Tavily, I2S Audio, OLED)
2. <span style="color:#fff; font-weight:bold">LearnPath — Adaptive Learning Platform</span> (Python, Flask, SQLite, Judge0 API, Chart.js)
3. <span style="color:#fff; font-weight:bold">Smart Attendance & Emotion Analytics</span> (OpenCV, LBPH, CNN FER2013, 94.7% Precision, 20.5 FPS)
4. <span style="color:#fff; font-weight:bold">Glassmorphic Educational Platform</span> (HTML5, CSS3, JS)
      `);
    } else if (lower === 'awards') {
      appendOutput(`
🏆 1st Place - Ideathon Winner (Inter-Collegiate Fest)
🥈 3rd Place - Code Debugging Challenge
🎨 3rd Place - Web Design Competition (GIT Institution, Kottayam)
⚡ Innovation Catalyst - Intra College Project Contest
⚙️ Sparkathon 6-Hour IoT Hackathon Participant
      `);
    } else if (lower === 'contact') {
      appendOutput(`
Phone    : +91 80152 81343
Email    : saravanprasanna.10@gmail.com
Location : Gandhi Maanagar, Peelamedu, Coimbatore
LinkedIn : https://www.linkedin.com/in/saravan-prasanna-k-u-a9b0723b2/
GitHub   : https://github.com/wamender007-sara
      `);
    } else if (lower === 'github') {
      appendOutput(`Opening GitHub...`);
      window.open('https://github.com/wamender007-sara', '_blank');
    } else if (lower === 'linkedin') {
      appendOutput(`Opening LinkedIn...`);
      window.open('https://www.linkedin.com/in/saravan-prasanna-k-u-a9b0723b2/', '_blank');
    } else if (lower === 'clear') {
      output.innerHTML = '';
    } else if (lower === 'matrix') {
      appendOutput(`\n[ACTIVATING NEURAL MATRIX STREAM]\n01010011 01000001 01010010 01000001 01010110 01000001 01001110 00100000 01010000 01010010 01000001 01010011 01000001 01001110 01001110 01000001`);
    } else {
      appendOutput(`Command not recognized: '${escapeHTML(cmd)}'. Type '<span style="color:var(--cyan)">help</span>' for options.`);
    }

    output.scrollTop = output.scrollHeight;
  }

  function appendOutput(htmlText) {
    const div = document.createElement('div');
    div.innerHTML = htmlText;
    output.appendChild(div);
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
}

/* --------------------------------------------------------------------------
   7. Skill Filtering & Category Animation
   -------------------------------------------------------------------------- */
function initSkillBarsAndFilters() {
  const filterBtns = document.querySelectorAll('.skills-filter .filter-btn');
  const skillCards = document.querySelectorAll('.skills-grid .skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        if (cat === 'all' || card.getAttribute('data-cat') === cat) {
          card.style.display = 'block';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8. Interactive Project Simulators (Waveform, Compiler, Emotion)
   -------------------------------------------------------------------------- */
function initProjectSimulators() {
  // Waveform Visualizer for Voice Assistant Robot
  const waveCanvas = document.getElementById('voice-waveform');
  if (waveCanvas) {
    const ctx = waveCanvas.getContext('2d');
    let phase = 0;

    function renderWave() {
      ctx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#00f3ff';

      for (let x = 0; x < waveCanvas.width; x++) {
        const y = Math.sin(x * 0.05 + phase) * 15 + waveCanvas.height / 2;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      phase += 0.1;
      requestAnimationFrame(renderWave);
    }
    renderWave();
  }

  // Compiler Simulator for LearnPath
  const runCodeBtn = document.getElementById('run-code-sim');
  const compilerOutput = document.getElementById('compiler-out');
  if (runCodeBtn && compilerOutput) {
    runCodeBtn.addEventListener('click', () => {
      compilerOutput.textContent = "Compiling Python script...";
      setTimeout(() => {
        compilerOutput.innerHTML = `<span style="color:var(--green)">[PASS] Test Case 1: OK</span>\n<span style="color:var(--green)">[PASS] Test Case 2: Output matching expected [1, 2, 3]</span>\nExecution time: 0.04s`;
      }, 700);
    });
  }

  // Emotion Analytics Simulator
  const simEmotionBtn = document.getElementById('sim-emotion-btn');
  const emotionBadge = document.getElementById('sim-emotion-badge');
  const emotionScore = document.getElementById('sim-emotion-score');
  
  if (simEmotionBtn && emotionBadge && emotionScore) {
    const emotions = [
      { name: "HAPPY 😊", score: "94.2%", color: "#00ff66" },
      { name: "NEUTRAL 😐", score: "91.8%", color: "#00f3ff" },
      { name: "SURPRISE 😮", score: "88.5%", color: "#ff9e00" },
      { name: "FOCUS 🧠", score: "96.4%", color: "#9d00ff" }
    ];
    let idx = 0;

    simEmotionBtn.addEventListener('click', () => {
      idx = (idx + 1) % emotions.length;
      const curr = emotions[idx];
      emotionBadge.textContent = curr.name;
      emotionBadge.style.color = curr.color;
      emotionScore.textContent = `Confidence: ${curr.score} (Consecutive Filter Passed)`;
      playSound(1000, 0.05);
    });
  }
}

/* --------------------------------------------------------------------------
   9. Modal Deep Dives
   -------------------------------------------------------------------------- */
const modalData = {
  voice_robot: {
    title: "AI-Powered Voice Assistant Robot (ESP32 Embedded AI)",
    tech: ["ESP32 Microcontroller", "C++", "I2S MEMS Mic", "Flask Backend", "Meta Llama 3.3 70B", "Groq API", "Tavily Web Search", "I2S Class-D Amp", "OLED Display"],
    content: `
      <p>Engineered a standalone, hands-free AI voice assistant integrating embedded audio hardware with cloud-based AI to enable real-time conversational interaction.</p>
      <h4 style="color:var(--cyan); margin:16px 0 8px 0;">Technical Pipeline:</h4>
      <ul>
        <li>Voice capture via I2S MEMS Microphone and streaming over WiFi to Python Flask server.</li>
        <li>Speech-to-text conversion & real-time context generation using Meta Llama 3.3 70B via Groq API.</li>
        <li>Augmented with Tavily API web search to overcome static cutoff limitations.</li>
        <li>Text-to-speech synthesized audio returned to I2S Class-D amplifier for crystal clear audio.</li>
        <li>Reactive OLED display with custom-animated facial expressions synced with listening, processing, and speaking states.</li>
      </ul>
    `
  },
  learnpath: {
    title: "LearnPath — Adaptive Learning Platform",
    tech: ["Python", "Flask", "SQLite", "HTML5/CSS3/JS", "YouTube Data API v3", "Judge0 API", "Chart.js"],
    content: `
      <p>Full-stack adaptive e-learning platform created to structure free web learning resources with real-time feedback loops and compiler environments.</p>
      <h4 style="color:var(--cyan); margin:16px 0 8px 0;">Key Innovations:</h4>
      <ul>
        <li>Personalized onboarding questionnaire mapping skill stages to curated YouTube videos.</li>
        <li>Weekly auto-generated assessment rotation with instant grading engine.</li>
        <li>Integrated multi-language online compiler (Python, C, C++, Java, JS) executing custom test cases with live pass/fail feedback.</li>
        <li>Chart.js analytics dashboard tracking watch history, quiz score trends, and study streaks.</li>
      </ul>
    `
  },
  attendance: {
    title: "Smart Attendance & Emotion Analytics System",
    tech: ["Python", "OpenCV", "Flask", "SQLite", "CNN FER2013", "CLAHE Preprocessing", "Chart.js"],
    content: `
      <p>Full-stack, browser-based Smart Attendance and Emotion Analytics System operating on local hardware without GPU or cloud dependency.</p>
      <h4 style="color:var(--cyan); margin:16px 0 8px 0;">System Performance & Architecture:</h4>
      <ul>
        <li>Three parallel CV components: OpenCV Haar Cascade for face detection, LBPH recognizer for identification, and CNN trained on FER2013 for 7-class emotion detection.</li>
        <li>CLAHE preprocessing to handle changing indoor light conditions.</li>
        <li>5-frame consecutive recognition filter eliminating false-positive attendance logs.</li>
        <li>Tested across 1,350 test frames: 94.73% face recognition precision, 87.4% emotion CNN F1-score at ~20.5 FPS on Intel i5 CPU.</li>
      </ul>
    `
  }
};

function initModals() {
  const backdrop = document.getElementById('modal-backdrop');
  const closeBtn = document.querySelector('.modal-close-btn');
  const titleElem = document.getElementById('modal-title');
  const bodyElem = document.getElementById('modal-body-content');

  if (!backdrop) return;

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectKey = btn.getAttribute('data-project');
      const data = modalData[projectKey];

      if (data) {
        titleElem.textContent = data.title;
        bodyElem.innerHTML = data.content;
        backdrop.classList.add('active');
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => backdrop.classList.remove('active'));
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) backdrop.classList.remove('active');
  });
}

/* --------------------------------------------------------------------------
   10. Smooth Scrolling Setup
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
