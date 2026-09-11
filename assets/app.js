/* ==========================================================================
   SARAVAN PRASANNA - FUTURISTIC LIGHT PORTFOLIO (app.js)
   Visual Identity: Soft-Futuristic Daylight Architecture
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Cursor initialized to standard browser cursor
  initThreeJSSphere();
  initScrollSpyAndNavbar();
  initIntersectionReveals();
  initProjectFilters();
  initAudioSynth();
  initModalSystem();
});

/* --------------------------------------------------------------------------
   1. THREE.JS DAYLIGHT CHROMATIC GLASS SPHERE
   -------------------------------------------------------------------------- */

/* --------------------------------------------------------------------------
   2. THREE.JS DAYLIGHT CHROMATIC GLASS SPHERE
   -------------------------------------------------------------------------- */
let scene, camera, renderer, sphereMesh, innerCoreMesh, particles;
let mouseSphereX = 0, mouseSphereY = 0;
let targetRotX = 0, targetRotY = 0;
let isDragging = false, prevMouseX = 0, prevMouseY = 0;

function initThreeJSSphere() {
  const container = document.getElementById('three-container');
  if (!container || typeof THREE === 'undefined') return;

  const width = container.clientWidth || 480;
  const height = container.clientHeight || 480;

  // Scene & Camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 5.5;

  // Renderer with transparent canvas
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  container.appendChild(renderer.domElement);

  // Soft Ambient & Directional Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0x8B5CF6, 2.2); // Lavender
  keyLight.position.set(5, 5, 4);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x38BDF8, 2.0); // Powder Blue
  fillLight.position.set(-5, -3, 3);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0xEC4899, 2.5, 10); // Iridescent pink
  rimLight.position.set(0, 4, -2);
  scene.add(rimLight);

  // 1. Outer Chromatic Orbital Ring framing the portrait
  const ringGeo = new THREE.TorusGeometry(2.2, 0.035, 16, 100);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x8B5CF6,
    roughness: 0.2,
    metalness: 0.8,
    transparent: true,
    opacity: 0.65
  });
  sphereMesh = new THREE.Mesh(ringGeo, ringMat);
  sphereMesh.rotation.x = Math.PI / 4;
  scene.add(sphereMesh);

  // 2. Second Counter-Rotating Cyan Ring
  const ringGeo2 = new THREE.TorusGeometry(2.38, 0.02, 16, 100);
  const ringMat2 = new THREE.MeshStandardMaterial({
    color: 0x38BDF8,
    roughness: 0.3,
    metalness: 0.9,
    transparent: true,
    opacity: 0.55
  });
  innerCoreMesh = new THREE.Mesh(ringGeo2, ringMat2);
  innerCoreMesh.rotation.x = -Math.PI / 3;
  scene.add(innerCoreMesh);

  // 3. Floating Ethereal Particle Swarm
  const partCount = 80;
  const partGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(partCount * 3);
  const colors = new Float32Array(partCount * 3);

  const col1 = new THREE.Color(0x8B5CF6);
  const col2 = new THREE.Color(0x38BDF8);

  for (let i = 0; i < partCount * 3; i += 3) {
    const r = 2.2 + Math.random() * 1.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    positions[i] = r * Math.sin(phi) * Math.cos(theta);
    positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i + 2] = r * Math.cos(phi);

    const mixed = col1.clone().lerp(col2, Math.random());
    colors[i] = mixed.r;
    colors[i + 1] = mixed.g;
    colors[i + 2] = mixed.b;
  }

  partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  partGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const partMat = new THREE.PointsMaterial({
    size: 0.045,
    vertexColors: true,
    transparent: true,
    opacity: 0.75
  });
  particles = new THREE.Points(partGeo, partMat);
  scene.add(particles);

  // Mouse Parallax & Drag Handlers
  window.addEventListener('mousemove', (e) => {
    mouseSphereX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseSphereY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
    container.style.cursor = 'grabbing';
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    if (container) container.style.cursor = 'grab';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - prevMouseX;
    const deltaY = e.clientY - prevMouseY;
    targetRotY += deltaX * 0.008;
    targetRotX += deltaY * 0.008;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });

  // Resize Listener
  window.addEventListener('resize', () => {
    if (!container) return;
    const newW = container.clientWidth;
    const newH = container.clientHeight;
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, newH);
  });

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Constant subtle rotation
    sphereMesh.rotation.y += 0.004;
    sphereMesh.rotation.x += 0.002;
    innerCoreMesh.rotation.y -= 0.007;
    innerCoreMesh.rotation.z += 0.003;
    particles.rotation.y += 0.0015;

    // Mouse parallax lerp
    sphereMesh.rotation.y += (targetRotY + mouseSphereX * 0.35 - sphereMesh.rotation.y) * 0.05;
    sphereMesh.rotation.x += (targetRotX - mouseSphereY * 0.35 - sphereMesh.rotation.x) * 0.05;

    // Gentle float wobble
    sphereMesh.position.y = Math.sin(elapsedTime * 1.2) * 0.1;
    innerCoreMesh.position.y = Math.sin(elapsedTime * 1.2) * 0.1;

    renderer.render(scene, camera);
  }
  animate();
}

/* --------------------------------------------------------------------------
   3. SCROLL SPY & NAVBAR BLUR STATE
   -------------------------------------------------------------------------- */
function initScrollSpyAndNavbar() {
  const navbar = document.querySelector('.nav-glass-container');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Navbar scrolled shadow elevation
    if (navbar) {
      if (scrollPos > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Active link highlighting
    sections.forEach(sec => {
      const top = sec.offsetTop - 160;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. INTERSECTION OBSERVER REVEALS & SKILL FILL ANIMATION
   -------------------------------------------------------------------------- */
function initIntersectionReveals() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

        // Animate skill bars if within the skills card
        const skillFills = entry.target.querySelectorAll('.skill-fill');
        skillFills.forEach(fill => {
          const width = fill.getAttribute('data-width') || '85%';
          fill.style.width = width;
        });

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   5. PROJECT CATEGORY FILTERING
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
      playSoftChime(520);
    });
  });
}

/* --------------------------------------------------------------------------
   6. AMBIENT AUDIO SYNTH (SOFT FUTURISTIC CHIME)
   -------------------------------------------------------------------------- */
let audioCtx = null;
let soundEnabled = true;

function initAudioSynth() {
  const toggleBtn = document.getElementById('sound-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    toggleBtn.innerHTML = soundEnabled 
      ? '<i data-lucide="volume-2" style="width:14px;height:14px;"></i><span>AUDIO: ON</span>' 
      : '<i data-lucide="volume-x" style="width:14px;height:14px;"></i><span>AUDIO: OFF</span>';
    if (window.lucide) window.lucide.createIcons();
    if (soundEnabled) playSoftChime(660);
  });
}

function playSoftChime(freq = 523.25) {
  if (!soundEnabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!audioCtx) audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  } catch (e) {
    // AudioContext blocked by browser autoplay policy until interaction
  }
}

/* --------------------------------------------------------------------------
   7. INTERACTIVE MODAL SPEC SYSTEM
   -------------------------------------------------------------------------- */
const modalData = {
  'voice-robot': {
    title: 'AI-Powered Voice Assistant Robot (ESP32)',
    badge: 'Embedded AI · Hardware Pipeline',
    content: `
      <div style="display:flex;flex-direction:column;gap:18px;">
        <p style="font-size:0.95rem;color:var(--text-secondary);line-height:1.7;">
          A standalone, hands-free hardware AI robot that eliminates heavy server dependencies on the client device by streaming raw audio directly to an ultra-fast inference stack.
        </p>

        <h4 style="font-family:var(--font-heading);font-size:1.1rem;color:var(--text-primary);margin-top:8px;">End-to-End Signal Pipeline</h4>
        <div style="padding:16px;background:rgba(241,245,249,0.85);border-radius:14px;font-family:var(--font-mono);font-size:0.84rem;color:var(--text-primary);line-height:1.7;">
          [I2S MEMS Mic] → ESP32 WiFi Audio Stream → Flask STT Backend → Groq Meta Llama 3.3 70B (Tavily Augmented) → TTS Stream → [MAX98357A I2S Class-D Amp] + [SSD1306 OLED Animated Expressions]
        </div>

        <h4 style="font-family:var(--font-heading);font-size:1.1rem;color:var(--text-primary);margin-top:8px;">Hardware Constraints Resolved</h4>
        <ul style="padding-left:20px;font-size:0.9rem;color:var(--text-secondary);line-height:1.7;">
          <li><strong>RAM Optimization:</strong> Ring-buffered audio packets with FreeRTOS task scheduling to prevent heap overflow during continuous recording.</li>
          <li><strong>I2S Clock Conflicts:</strong> Synchronized dual-channel I2S clocks between input (microphone) and output (DAC amplifier).</li>
          <li><strong>EMI Mitigation:</strong> Filtered display bus noise from bleeding into analog microphone reference voltage.</li>
        </ul>

        <div style="display:flex;gap:10px;margin-top:10px;">
          <a href="https://github.com/wamender007-sara" target="_blank" rel="noopener" class="btn-pill btn-pill-holo">
            <span>View Hardware Schematics on GitHub</span>
          </a>
        </div>
      </div>
    `
  },
  'resume-ai': {
    title: 'ResumeAI: Client-Side Career Coach',
    badge: 'Generative AI · Privacy-First',
    content: `
      <div style="display:flex;flex-direction:column;gap:18px;">
        <p style="font-size:0.95rem;color:var(--text-secondary);line-height:1.7;">
          ResumeAI was engineered to solve the data privacy issue inherent in online resume checkers. Candidate documents never touch a third-party application server; parsing occurs client-side using PDF.js before structured prompts query Google Gemini.
        </p>

        <h4 style="font-family:var(--font-heading);font-size:1.1rem;color:var(--text-primary);">Key Architectural Innovations</h4>
        <ul style="padding-left:20px;font-size:0.9rem;color:var(--text-secondary);line-height:1.7;">
          <li><strong>Client-Side PDF/DOCX Parsing:</strong> Zero backend storage — candidates retain 100% control of their personal information.</li>
          <li><strong>Multi-Dimensional Scoring:</strong> Evaluates ATS readability, layout vulnerability, action-verb density, and role-specific keywords.</li>
          <li><strong>Conversational Co-Pilot:</strong> Interactive interview simulator with state retention across prompts using browser local storage.</li>
          <li><strong>Fault-Tolerant API Client:</strong> Exponential backoff retry loops ensuring smooth UX even during API rate limits.</li>
        </ul>

        <div style="display:flex;gap:12px;margin-top:10px;">
          <a href="https://resume-analyser-system-qvpx.vercel.app/" target="_blank" rel="noopener" class="btn-pill btn-pill-holo">
            <span>Open Live ResumeAI Web App</span>
          </a>
          <a href="https://github.com/wamender007-sara" target="_blank" rel="noopener" class="btn-pill btn-pill-ghost">
            <span>Inspect Repository</span>
          </a>
        </div>
      </div>
    `
  },
  'suraksha': {
    title: 'Suraksha Yatra: Tourist Safety Network',
    badge: 'Smart India Hackathon (SIH) · GIS Mapping',
    content: `
      <div style="display:flex;flex-direction:column;gap:18px;">
        <p style="font-size:0.95rem;color:var(--text-secondary);line-height:1.7;">
          Engineered for the Smart India Hackathon (SIH), Suraksha Yatra is a nationwide digital safety shield for domestic and international travelers across India.
        </p>

        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px;">
          <div style="padding:16px;background:rgba(241,245,249,0.8);border-radius:14px;">
            <div style="font-weight:700;font-size:1.2rem;color:var(--accent-violet);">986</div>
            <div style="font-size:0.8rem;color:var(--text-muted);">Tourist Destinations Mapped</div>
          </div>
          <div style="padding:16px;background:rgba(241,245,249,0.8);border-radius:14px;">
            <div style="font-weight:700;font-size:1.2rem;color:#059669;">165 Verified</div>
            <div style="font-size:0.8rem;color:var(--text-muted);">Emergency Facilities Registered</div>
          </div>
        </div>

        <h4 style="font-family:var(--font-heading);font-size:1.1rem;color:var(--text-primary);">System Features</h4>
        <ul style="padding-left:20px;font-size:0.9rem;color:var(--text-secondary);line-height:1.7;">
          <li>One-Tap SOS broadcast linking live GPS telemetry to municipal emergency dispatchers.</li>
          <li>Digital Tourist ID with secure QR verification for rapid medical and identification checks.</li>
          <li>PostgreSQL backend with Row-Level Security (RLS) guaranteeing strict compliance for traveler identity data.</li>
        </ul>

        <div style="display:flex;gap:12px;margin-top:10px;">
          <a href="https://sihi-037-sih-project-tourism-suraks.vercel.app/" target="_blank" rel="noopener" class="btn-pill btn-pill-holo">
            <span>Launch Live Suraksha Yatra Portal</span>
          </a>
        </div>
      </div>
    `
  },
  'smartbus': {
    title: 'SmartBus 360: Next-Gen Small-City Mobility',
    badge: 'Civic Mobility · Real-Time Telemetry',
    content: `
      <div style="display:flex;flex-direction:column;gap:18px;">
        <p style="font-size:0.95rem;color:var(--text-secondary);line-height:1.7;">
          Traditional Intelligent Transport Systems (ITS) require millions in proprietary onboard GPS hardware. SmartBus 360 replaces hardware boxes with smartphone telemetry and a lightweight web ecosystem.
        </p>

        <h4 style="font-family:var(--font-heading);font-size:1.1rem;color:var(--text-primary);">Three-Sided Ecosystem</h4>
        <ul style="padding-left:20px;font-size:0.9rem;color:var(--text-secondary);line-height:1.7;">
          <li><strong>Commuter App:</strong> Live 3D satellite vehicle tracking, sub-minute ETA predictions, and instant digital ticketing via UPI.</li>
          <li><strong>Conductor Terminal:</strong> Point-of-sale interface automating distance-tiered fares and real-time seat availability updates.</li>
          <li><strong>Transit Authority Central:</strong> Ridership heatmaps and schedule adherence analytics to optimize fleet frequencies.</li>
        </ul>

        <div style="display:flex;gap:12px;margin-top:10px;">
          <a href="https://smart-rural-bus-tracking-system.vercel.app/" target="_blank" rel="noopener" class="btn-pill btn-pill-holo">
            <span>Open SmartBus 360 Live Web App</span>
          </a>
        </div>
      </div>
    `
  },
  'attendance': {
    title: 'Smart Attendance & Emotion Analytics (Nxtsync)',
    badge: 'Machine Learning Internship · CPU Optimization',
    content: `
      <div style="display:flex;flex-direction:column;gap:18px;">
        <p style="font-size:0.95rem;color:var(--text-secondary);line-height:1.7;">
          Engineered during my Machine Learning internship at <strong>Nxtsync</strong>, this system delivers automated biometric verification and emotional engagement tracking completely offline.
        </p>

        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
          <div style="padding:14px;background:rgba(241,245,249,0.8);border-radius:12px;text-align:center;">
            <div style="font-weight:700;font-size:1.2rem;color:var(--accent-violet);">94.73%</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">Face Precision</div>
          </div>
          <div style="padding:14px;background:rgba(241,245,249,0.8);border-radius:12px;text-align:center;">
            <div style="font-weight:700;font-size:1.2rem;color:#0284C7;">20.5 FPS</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">Standard CPU</div>
          </div>
          <div style="padding:14px;background:rgba(241,245,249,0.8);border-radius:12px;text-align:center;">
            <div style="font-weight:700;font-size:1.2rem;color:#059669;">1,350</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">Benchmark Frames</div>
          </div>
        </div>

        <h4 style="font-family:var(--font-heading);font-size:1.1rem;color:var(--text-primary);">Engineering Details</h4>
        <ul style="padding-left:20px;font-size:0.9rem;color:var(--text-secondary);line-height:1.7;">
          <li><strong>CLAHE Preprocessing:</strong> Normalized variable lighting environments in standard classroom spaces.</li>
          <li><strong>Temporal Filter:</strong> Five-frame consecutive recognition window eliminates false-positive entry logs.</li>
          <li><strong>Normalized Database:</strong> SQLite schema with CSV export, student registry, and live emotion engagement curves.</li>
        </ul>
      </div>
    `
  },
  'learnpath': {
    title: 'LearnPath: Adaptive Learning Platform',
    badge: 'EdTech Architecture · Full-Stack',
    content: `
      <div style="display:flex;flex-direction:column;gap:18px;">
        <p style="font-size:0.95rem;color:var(--text-secondary);line-height:1.7;">
          A full-stack personalized learning organizer designed to convert passive YouTube viewing into structured, measurable skill acquisition.
        </p>

        <h4 style="font-family:var(--font-heading);font-size:1.1rem;color:var(--text-primary);">Core Capabilities</h4>
        <ul style="padding-left:20px;font-size:0.9rem;color:var(--text-secondary);line-height:1.7;">
          <li>Automated curriculum tiers: Beginner, Intermediate, and Expert milestone pathways.</li>
          <li>In-browser multi-language compiler for Python, C, C++, Java, and JavaScript.</li>
          <li>Auto-generated quizzes with instant grading, streak tracking, and autosaving persistent note scratchpad.</li>
        </ul>
      </div>
    `
  }
};

function initModalSystem() {
  window.openModal = function(projectId) {
    const data = modalData[projectId];
    if (!data) return;

    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-content').innerHTML = data.content;
    document.getElementById('project-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    playSoftChime(784);
  };

  window.closeModal = function() {
    document.getElementById('project-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  window.handleModalBackdropClick = function(e) {
    if (e.target.id === 'project-modal') {
      closeModal();
    }
  };

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

/* --------------------------------------------------------------------------
   8. REAL EMAIL TRANSMISSION VIA FORMSUBMIT (Direct to saravanprasanna.10@gmail.com)
   -------------------------------------------------------------------------- */
window.handleFormSubmit = async function(e) {
  e.preventDefault();
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const subject = subjectInput ? subjectInput.value.trim() : '';
  const message = messageInput.value.trim();

  if (!name || !email || !message) return;

  const submitBtn = document.getElementById('submit-btn');
  const submitText = document.getElementById('submit-btn-text');
  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toast-title');
  const toastDesc = document.getElementById('toast-desc');

  // Loading State
  if (submitBtn) {
    submitBtn.disabled = true;
    if (submitText) submitText.textContent = 'Transmitting to Mail...';
  }

  try {
    const response = await fetch('https://formsubmit.co/ajax/saravanprasanna.10@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        _subject: subject || ('Portfolio Inquiry from ' + name),
        message: message,
        _captcha: 'false',
        _template: 'table'
      })
    });

    const result = await response.json();

    if (result.success === 'true' || result.success === true) {
      toastTitle.textContent = 'Message Delivered to Mail!';
      toastDesc.textContent = 'Success! Your message was sent directly to saravanprasanna.10@gmail.com.';
      toast.classList.add('show');
      playSoftChime(880);
      document.getElementById('contact-form').reset();
    } else if (result.message && result.message.includes('Activation')) {
      toastTitle.textContent = 'Activation Email Sent!';
      toastDesc.textContent = 'Check saravanprasanna.10@gmail.com & click "Activate Form" once to complete setup.';
      toast.classList.add('show');
      playSoftChime(784);
      document.getElementById('contact-form').reset();
    } else {
      toastTitle.textContent = 'Transmission Dispatched!';
      toastDesc.textContent = 'Thank you, ' + name + '! Your inquiry is on its way to Saravan.';
      toast.classList.add('show');
      playSoftChime(880);
      document.getElementById('contact-form').reset();
    }
  } catch (err) {
    console.error('Mail dispatch error:', err);
    toastTitle.textContent = 'Opening Email Client...';
    toastDesc.textContent = 'Redirecting to your default mail app to send directly.';
    toast.classList.add('show');

    setTimeout(() => {
      const mailtoUrl = 'mailto:saravanprasanna.10@gmail.com?subject=' + 
        encodeURIComponent(subject || 'Portfolio Inquiry from ' + name) + 
        '&body=' + encodeURIComponent(message + '\n\nSender: ' + name + ' (' + email + ')');
      window.location.href = mailtoUrl;
    }, 800);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      if (submitText) submitText.textContent = 'Transmit Message';
    }
    setTimeout(() => {
      if (toast) toast.classList.remove('show');
    }, 6000);
  }
};
