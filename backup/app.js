/* =========================================
   SMARTBIKE PRO — App Logic & Interactions
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById('navbar');
  const handleNavScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ===== MOBILE NAV TOGGLE =====
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // ===== INTERSECTION OBSERVER — SCROLL ANIMATIONS =====
  const animatedEls = document.querySelectorAll('.animate-on-scroll');
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  animatedEls.forEach(el => scrollObserver.observe(el));

  // ===== HERO PARTICLES =====
  const particleContainer = document.getElementById('heroParticles');
  if (particleContainer) {
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 4 + 's';
      p.style.animationDuration = (3 + Math.random() * 3) + 's';
      particleContainer.appendChild(p);
    }
  }

  // ===== COUNTER ANIMATION =====
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el, target) {
    const duration = 2000;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ===== PARALLAX EFFECT =====
  const parallaxElements = [
    { selector: '.hero-orb--blue', speed: 0.03 },
    { selector: '.hero-orb--red', speed: -0.02 },
    { selector: '.hero-grid-overlay', speed: 0.01 },
  ];
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxElements.forEach(({ selector, speed }) => {
      const el = document.querySelector(selector);
      if (el) {
        el.style.transform = `translateY(${scrollY * speed}px)`;
      }
    });
  }, { passive: true });

  // ===== AI DIAGNOSIS =====
  const diagnosisBtn = document.getElementById('diagnosisBtn');
  const bikeIssueInput = document.getElementById('bikeIssue');
  const bikeModelInput = document.getElementById('bikeModel');
  const diagnosisResult = document.getElementById('diagnosisResult');
  const quickChips = document.querySelectorAll('.quick-chip');

  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      bikeIssueInput.value = chip.dataset.issue;
      chip.style.background = 'rgba(0, 212, 255, 0.3)';
    });
  });

  const diagnosisKB = {
    'start': {
      title: 'Starting Problem Detected',
      causes: ['Dead or weak battery', 'Faulty spark plug', 'Clogged carburetor/fuel injector', 'Starter motor issue'],
      urgency: 'medium',
      cost: '₹300 – ₹2,500',
      tip: 'Check if your battery is older than 18 months — most starting issues begin there.'
    },
    'noise': {
      title: 'Abnormal Engine Noise',
      causes: ['Worn timing chain', 'Loose engine mounting', 'Low engine oil', 'Valve clearance issue'],
      urgency: 'high',
      cost: '₹500 – ₹4,000',
      tip: 'Don\'t ride with unusual engine noise — it can lead to major engine damage.'
    },
    'brake': {
      title: 'Brake System Issue',
      causes: ['Worn brake pads', 'Air in brake line', 'Warped brake disc', 'Low brake fluid'],
      urgency: 'high',
      cost: '₹400 – ₹2,000',
      tip: 'Brake issues are safety-critical. Get them inspected immediately.'
    },
    'oil': {
      title: 'Oil Leak / Oil Issue',
      causes: ['Worn gasket or seal', 'Loose oil drain plug', 'Cracked engine casing', 'Overfilled oil'],
      urgency: 'medium',
      cost: '₹200 – ₹3,000',
      tip: 'Riding with low oil can cause permanent engine seizure.'
    },
    'battery': {
      title: 'Battery / Electrical Problem',
      causes: ['Battery past lifespan', 'Faulty charging system (rectifier/regulator)', 'Corroded terminals', 'Parasitic drain from aftermarket accessories'],
      urgency: 'medium',
      cost: '₹500 – ₹2,500',
      tip: 'A healthy battery should read 12.4V+ when the engine is off.'
    },
    'mileage': {
      title: 'Poor Fuel Efficiency',
      causes: ['Dirty air filter', 'Incorrect tire pressure', 'Old spark plug', 'Rich fuel mixture / carburetor issue'],
      urgency: 'low',
      cost: '₹200 – ₹1,500',
      tip: 'Regular servicing every 3,000 km keeps your mileage optimal.'
    },
    'vibration': {
      title: 'Excessive Vibration',
      causes: ['Unbalanced wheels', 'Worn chain sprocket', 'Engine mounting loose', 'Bent rim'],
      urgency: 'medium',
      cost: '₹300 – ₹2,000',
      tip: 'Vibrations accelerate wear on many parts — address it early.'
    },
    'overheat': {
      title: 'Engine Overheating',
      causes: ['Low coolant (liquid-cooled)', 'Clogged radiator fins', 'Faulty thermostat', 'Old / wrong grade engine oil'],
      urgency: 'high',
      cost: '₹400 – ₹3,500',
      tip: 'Stop riding immediately if the engine is overheating to avoid seizure.'
    }
  };

  function matchDiagnosis(text) {
    const lower = text.toLowerCase();
    const keywords = {
      start: ['start', 'crank', 'ignition', 'won\'t start', 'dead', 'kick'],
      noise: ['noise', 'sound', 'rattle', 'knock', 'tick', 'clunk', 'grind'],
      brake: ['brake', 'stop', 'squeak', 'squeal', 'disc', 'pad'],
      oil: ['oil', 'leak', 'drip', 'smoke', 'burning smell'],
      battery: ['battery', 'charge', 'electric', 'light dim', 'drain', 'voltage'],
      mileage: ['mileage', 'fuel', 'petrol', 'efficiency', 'consumption', 'average'],
      vibration: ['vibrat', 'shake', 'wobble', 'shudder'],
      overheat: ['heat', 'hot', 'overheat', 'temperature', 'coolant']
    };

    for (const [key, words] of Object.entries(keywords)) {
      for (const word of words) {
        if (lower.includes(word)) return diagnosisKB[key];
      }
    }
    return null;
  }

  diagnosisBtn.addEventListener('click', () => {
    const issue = bikeIssueInput.value.trim();
    const model = bikeModelInput.value.trim();
    if (!issue) {
      bikeIssueInput.focus();
      bikeIssueInput.style.borderColor = '#ff3366';
      setTimeout(() => bikeIssueInput.style.borderColor = '', 2000);
      return;
    }

    // Show loading
    diagnosisResult.innerHTML = `
      <div class="result-placeholder">
        <div class="ai-brain-icon" style="animation: brainPulse 0.5s ease-in-out infinite;">🧠</div>
        <p>Analyzing${model ? ' for <strong>' + escapeHtml(model) + '</strong>' : ''}...</p>
      </div>
    `;

    setTimeout(() => {
      const result = matchDiagnosis(issue);
      if (result) {
        diagnosisResult.innerHTML = `
          <div class="diagnosis-output" style="padding: 36px;">
            <h3>🔍 AI Analysis: ${result.title}</h3>
            <div class="result-section">
              <h4>Possible Causes</h4>
              <ul>${result.causes.map(c => `<li>${c}</li>`).join('')}</ul>
            </div>
            <div class="result-section">
              <h4>Urgency Level</h4>
              <span class="urgency-badge urgency-${result.urgency}">${result.urgency.toUpperCase()}</span>
            </div>
            <div class="result-section">
              <h4>Estimated Cost</h4>
              <p style="font-weight:600; color: var(--accent-green); font-size:1.1rem;">${result.cost}</p>
            </div>
            <div class="result-section">
              <h4>💡 Pro Tip</h4>
              <p>${result.tip}</p>
            </div>
            <a href="#booking" class="btn btn-primary btn-glow btn-full" style="margin-top:20px;">
              <span>📅</span> Book Repair Now
            </a>
          </div>
        `;
      } else {
        diagnosisResult.innerHTML = `
          <div class="diagnosis-output" style="padding: 36px;">
            <h3>🔍 AI Analysis</h3>
            <p style="margin-bottom:16px;">We couldn't auto-detect the specific issue from your description. This might need a hands-on inspection.</p>
            <div class="result-section">
              <h4>Recommendation</h4>
              <p>Book a <strong>Full Diagnostic Checkup</strong> — our experts will run a 50-point inspection on your bike.</p>
            </div>
            <div class="result-section">
              <h4>Estimated Cost</h4>
              <p style="font-weight:600; color: var(--accent-green); font-size:1.1rem;">₹199 (Diagnostic Fee, waived if repaired)</p>
            </div>
            <a href="#booking" class="btn btn-primary btn-glow btn-full" style="margin-top:20px;">
              <span>📅</span> Book Full Checkup
            </a>
          </div>
        `;
      }
      diagnosisResult.style.animation = 'fadeInUp 0.5s ease';
    }, 1500);
  });

  // ===== AI COST ESTIMATOR =====
  const estimateBtn = document.getElementById('estimateBtn');
  const estimateResult = document.getElementById('estimateResult');
  const estBikeType = document.getElementById('estBikeType');
  const estService = document.getElementById('estService');

  const costMatrix = {
    scooter: { general: [699, 1499], engine: [1200, 4500], brake: [400, 1200], oil: [300, 600], electrical: [350, 1500], emergency: [299, 1000] },
    commuter: { general: [799, 1699], engine: [1500, 5500], brake: [500, 1500], oil: [350, 700], electrical: [400, 1800], emergency: [299, 1200] },
    sport: { general: [1299, 2999], engine: [2500, 10000], brake: [800, 2500], oil: [500, 1200], electrical: [600, 3000], emergency: [499, 2000] },
    cruiser: { general: [1499, 3499], engine: [3000, 12000], brake: [800, 2800], oil: [600, 1500], electrical: [700, 3500], emergency: [599, 2500] },
    electric: { general: [999, 2499], engine: [2000, 8000], brake: [500, 1800], oil: [0, 0], electrical: [800, 4000], emergency: [399, 1800] },
  };

  estimateBtn.addEventListener('click', () => {
    const bike = estBikeType.value;
    const service = estService.value;
    if (!bike || !service) {
      estBikeType.style.borderColor = !bike ? '#ff3366' : '';
      estService.style.borderColor = !service ? '#ff3366' : '';
      setTimeout(() => {
        estBikeType.style.borderColor = '';
        estService.style.borderColor = '';
      }, 2000);
      return;
    }
    const range = costMatrix[bike]?.[service];
    if (!range) return;

    if (range[0] === 0 && range[1] === 0) {
      estimateResult.innerHTML = `
        <div class="estimate-output" style="animation: fadeInUp 0.5s ease;">
          <p class="est-price">N/A</p>
          <p class="est-note">Electric bikes don't require oil changes! Your bike uses sealed motor bearings.</p>
        </div>
      `;
      return;
    }

    estimateResult.innerHTML = `
      <div class="estimate-output" style="animation: fadeInUp 0.5s ease;">
        <p class="est-price">₹${range[0].toLocaleString()} – ₹${range[1].toLocaleString()}</p>
        <p class="est-note">Estimated range based on ${capitalise(bike)} • ${capitalise(service)} service. Final cost confirmed after inspection.</p>
      </div>
    `;
  });

  function capitalise(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // ===== BOOKING FORM =====
  const bookingForm = document.getElementById('bookingForm');
  const bookDateInput = document.getElementById('bookDate');
  
  // Set min date to today
  if (bookDateInput) {
    const today = new Date().toISOString().split('T')[0];
    bookDateInput.min = today;
    bookDateInput.value = today;
  }

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('bookName').value.trim();
    const phone = document.getElementById('bookPhone').value.trim();
    const bike = document.getElementById('bookBike').value.trim();
    const service = document.getElementById('bookService').value;

    if (!name || !phone || !bike || !service) return;

    const card = document.querySelector('.booking-card');
    card.innerHTML = `
      <div class="booking-success">
        <div class="success-icon">✅</div>
        <h3>Booking Confirmed!</h3>
        <p>Thank you, <strong>${escapeHtml(name)}</strong>! We've received your booking for <strong>${escapeHtml(service)}</strong>.</p>
        <p style="margin-top:8px; color: var(--text-muted);">We'll call you at <strong>${escapeHtml(phone)}</strong> to confirm your slot shortly.</p>
        <a href="https://wa.me/919876543210?text=Hi!%20I%20just%20booked%20${encodeURIComponent(service)}%20for%20my%20${encodeURIComponent(bike)}.%20Name:%20${encodeURIComponent(name)}" 
           class="btn btn-whatsapp" style="margin-top:24px;" target="_blank">
          <span>💬</span> Confirm via WhatsApp
        </a>
      </div>
    `;
    card.style.animation = 'fadeInUp 0.5s ease';
  });

  // ===== FLOATING CHATBOT =====
  const floatingChat = document.getElementById('floatingChat');
  const chatToggle = document.getElementById('chatToggle');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');

  chatToggle.addEventListener('click', () => {
    floatingChat.classList.toggle('open');
    if (floatingChat.classList.contains('open')) {
      setTimeout(() => chatInput.focus(), 300);
    }
  });

  function sendChatMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    appendMessage(text, 'user');
    chatInput.value = '';

    // Typing indicator
    const typingEl = document.createElement('div');
    typingEl.className = 'chat-msg chat-msg--bot';
    typingEl.innerHTML = `
      <span class="msg-avatar">🤖</span>
      <div class="msg-bubble" style="opacity:0.6;">Analyzing...</div>
    `;
    chatMessages.appendChild(typingEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(() => {
      chatMessages.removeChild(typingEl);
      const diagnosis = matchDiagnosis(text);
      let reply;
      if (diagnosis) {
        reply = `<strong>${diagnosis.title}</strong><br/><br/>
Possible causes:<br/>• ${diagnosis.causes.join('<br/>• ')}<br/><br/>
⚠️ Urgency: <strong>${diagnosis.urgency.toUpperCase()}</strong><br/>
💰 Est. Cost: <strong>${diagnosis.cost}</strong><br/><br/>
💡 ${diagnosis.tip}<br/><br/>
👉 <a href="#booking" style="color:#00d4ff;">Book a service</a> to get it fixed!`;
      } else {
        reply = `I couldn't identify the exact issue from your description. 🤔<br/><br/>
I'd recommend a <strong>Full Diagnostic Checkup (₹199)</strong> where our experts will inspect your bike thoroughly.<br/><br/>
👉 <a href="#booking" style="color:#00d4ff;">Book a checkup</a> or call us at <a href="tel:+919876543210" style="color:#00d4ff;">+91 98765 43210</a>`;
      }
      appendMessage(reply, 'bot');
    }, 1200);
  }

  chatSend.addEventListener('click', sendChatMessage);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendChatMessage();
  });

  function appendMessage(html, type) {
    const msg = document.createElement('div');
    msg.className = `chat-msg chat-msg--${type}`;
    if (type === 'bot') {
      msg.innerHTML = `<span class="msg-avatar">🤖</span><div class="msg-bubble">${html}</div>`;
    } else {
      msg.innerHTML = `<div class="msg-bubble">${escapeHtml(html)}</div><span class="msg-avatar">👤</span>`;
    }
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // ===== UTILITY =====
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

});
