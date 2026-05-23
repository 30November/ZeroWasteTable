document.addEventListener('DOMContentLoaded', () => {
  // Dismiss loading spinner
  dismissLoader();

  // Page load anim
  document.body.classList.add('loaded');

  // Initialize Scroll Reveals
  initScrollReveals();

  // Mobile navigation trigger setup
  initMobileMenu();

  // Dark mode toggle
  initDarkMode();

  // Back to top button
  initBackToTop();

  // Global Dialog Dismissal Handler
  initDialogHandlers();

  // Contact form toast hook
  initContactForm();

  // Quick helper for floating particle effects in hero
  createHeroParticles();

  // Initialize Lucide Icons if loaded
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Start background real-time notification simulation
  startAlertSimulation();
});

// ============================
// LOADING SPINNER
// ============================
function dismissLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  // Small delay so the animation is seen
  setTimeout(() => {
    loader.classList.add('fade-out');
    // Remove from DOM after transition
    setTimeout(() => loader.remove(), 600);
  }, 700);
}

// ============================
// SCROLL REVEALS
// ============================
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

// ============================
// MOBILE MENU
// ============================
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.toggle('hidden');
      menuBtn.setAttribute('aria-expanded', String(!isHidden));
      const icon = menuBtn.querySelector('svg');
      if (icon) {
        icon.innerHTML = isHidden
          ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>'
          : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
      }
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

// ============================
// DARK MODE TOGGLE
// ============================
function initDarkMode() {
  const toggle = document.getElementById('dark-mode-toggle');
  
  // Apply saved preference on load globally
  const saved = localStorage.getItem('zwt-theme');
  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.remove('dark');
    if (toggle) updateToggleIcon(toggle, 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.add('dark');
    if (toggle) updateToggleIcon(toggle, 'dark');
  }

  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.add('dark');
      localStorage.setItem('zwt-theme', 'dark');
      updateToggleIcon(toggle, 'dark');
      showToast('Switched to dark mode', 'info');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('zwt-theme', 'light');
      updateToggleIcon(toggle, 'light');
      showToast('Switched to light mode', 'info');
    }
  });
}

function updateToggleIcon(btn, mode) {
  if (mode === 'dark') {
    // Moon icon (currently dark → show moon)
    btn.innerHTML = `
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
      </svg>`;
    btn.setAttribute('aria-label', 'Switch to light mode');
  } else {
    // Sun icon (currently light → show sun)
    btn.innerHTML = `
      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>`;
    btn.setAttribute('aria-label', 'Switch to dark mode');
  }
}

// ============================
// TOAST NOTIFICATIONS
// ============================
window.showToast = function(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = {
    success: `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`,
    error:   `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`,
    info:    `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.style.position = 'relative';
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || icons.info}</div>
    <span>${message}</span>
    <button class="toast-close" aria-label="Dismiss notification">
      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
    <div class="toast-progress"></div>
  `;

  container.appendChild(toast);

  // Trigger show animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  // Close button
  toast.querySelector('.toast-close').addEventListener('click', () => dismissToast(toast));

  // Auto-dismiss after 4s
  setTimeout(() => dismissToast(toast), 4000);

  // Cap at 4 toasts
  const toasts = container.querySelectorAll('.toast');
  if (toasts.length > 4) dismissToast(toasts[0]);
};

function dismissToast(toast) {
  toast.classList.remove('show');
  toast.classList.add('hide');
  setTimeout(() => toast.remove(), 450);
}

// ============================
// BACK TO TOP
// ============================
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================
// CONTACT FORM → TOAST
// ============================
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    // Show loading state
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Simulate async send
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      form.reset();
      showToast('Request submitted! Our team will reach out shortly.', 'success');
    }, 1200);
  });
}

// ============================
// DIALOG / MODAL HANDLERS
// ============================
window.toggleSlidePanel = function(panelId) {
  const panel = document.getElementById(panelId);
  const overlay = document.getElementById(panelId + '-overlay');
  if (panel) panel.classList.toggle('active');
  if (overlay) overlay.classList.toggle('hidden');
};

window.toggleModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.toggle('hidden');
    modal.classList.toggle('flex');
  }
};

function initDialogHandlers() {
  document.addEventListener('click', (e) => {
    if (e.target.matches('.modal-overlay')) {
      const modal = e.target.closest('.modal-container');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
    }
  });
}

// ============================
// HERO PARTICLES
// ============================
function createHeroParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  const count = 28;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'absolute rounded-full pointer-events-none';

    const isGreen = Math.random() > 0.5;
    particle.style.backgroundColor = isGreen ? 'var(--primary)' : 'var(--secondary)';
    particle.style.opacity = (Math.random() * 0.15 + 0.05).toFixed(2);

    const size = Math.random() * 5 + 2;
    particle.style.width  = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.top    = `${Math.random() * 100}%`;
    particle.style.left   = `${Math.random() * 100}%`;

    const duration = Math.random() * 12 + 8;
    const delay    = Math.random() * -20;
    particle.style.animation      = `float ${duration}s ease-in-out infinite`;
    particle.style.animationDelay = `${delay}s`;

    container.appendChild(particle);
  }
}

// ============================
// UTILITY FUNCTIONS
// ============================
window.formatBytes = function(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

window.timeAgo = function(dateParam) {
  if (!dateParam) return null;
  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  const TODAY = new Date();
  const seconds = Math.round((TODAY - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours   = Math.round(minutes / 60);
  const days    = Math.round(hours / 24);
  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24)   return `${hours}h ago`;
  return `${days}d ago`;
};

// ============================
// AI CHATBOT FUNCTIONALITY
// ============================
window.toggleChatbot = function() {
  const windowEl = document.getElementById('chatbot-window');
  if (windowEl) {
    windowEl.classList.toggle('active');
  }
};

window.handleChatKey = function(e) {
  if (e.key === 'Enter') {
    sendChatMessage();
  }
};

window.sendChatMessage = function() {
  const input = document.getElementById('chatbot-input');
  if (!input) return;
  const msg = input.value.trim();
  if (!msg) return;

  // Append user message
  appendChatMessage(msg, 'user');
  input.value = '';

  // Simulate bot typing response
  setTimeout(() => {
    const response = getBotResponse(msg);
    appendChatMessage(response, 'bot');
  }, 700);
};

function appendChatMessage(text, sender) {
  const container = document.getElementById('chatbot-messages');
  if (!container) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${sender}`;
  msgDiv.textContent = text;
  container.appendChild(msgDiv);

  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

function getBotResponse(input) {
  const text = input.toLowerCase();
  
  if (text.includes('hi') || text.includes('hello') || text.includes('hey')) {
    return 'Hello! How can I help you today? Ask me about listing food, pickup routes, or verification.';
  }
  if (text.includes('donate') || text.includes('list') || text.includes('food') || text.includes('surplus')) {
    return 'Restaurants and supermarkets can list food by signing up, going to their dashboard, and selecting "Create Listing". NGOs nearby will be notified instantly!';
  }
  if (text.includes('ngo') || text.includes('pick') || text.includes('receive') || text.includes('claim')) {
    return 'NGOs can register on ZeroWasteTable and see local listings via the Live Donation Radar. From there, they can claim and dispatch couriers for collection.';
  }
  if (text.includes('route') || text.includes('optimize') || text.includes('map') || text.includes('gps')) {
    return 'Our AI Route Optimizer calculates multi-stop pickup routes to reduce travel time and ensure food stays fresh. It is active in the NGO Portal!';
  }
  if (text.includes('safety') || text.includes('fssai') || text.includes('compliant') || text.includes('law')) {
    return 'We maintain FSSAI guidelines: all donors must verify temperatures, allergen lists, and log packaging timestamps. This ensures liability protection for food donors.';
  }
  if (text.includes('co2') || text.includes('carbon') || text.includes('emissions') || text.includes('waste')) {
    return 'Redistributing 1 kg of food saves roughly 2.5 kg of CO2 emissions from landfill decomposition. ZeroWasteTable has saved over 95,000 kg of CO2 so far!';
  }
  if (text.includes('admin') || text.includes('verify') || text.includes('approv')) {
    return 'Administrators oversee NGO verifications, FSSAI compliance auditing, and global impact metrics. Select "Admin" at login to view this.';
  }
  return "I'm sorry, I didn't quite get that. Try asking about 'how to list food', 'FSSAI compliance', 'route optimization', or 'CO2 impact'.";
}

// ============================
// SIMULATED REAL-TIME ALERTS
// ============================
function startAlertSimulation() {
  const alerts = [
    { text: "Grand Palace Hotel listed 18 kg of cooked meals!", type: "info" },
    { text: "Volunteer #22 successfully delivered bread packs to Feeding Hope NGO.", type: "success" },
    { text: "Apex Catering posted a new surplus listing: 12 kg Vegetarian Curries.", type: "info" },
    { text: "FSSAI verification completed for Urban Grocers franchise.", type: "success" },
    { text: "Roti Bank Mumbai claimed 30 kg Bakery packs from Greenwood Gourmet.", type: "success" }
  ];

  // Set interval to trigger a random notification every 45 seconds
  setInterval(() => {
    if (typeof showToast === 'function') {
      const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
      showToast(randomAlert.text, randomAlert.type);
    }
  }, 45000);
}

