document.addEventListener('DOMContentLoaded', () => {
  // Page load anim
  document.body.classList.add('loaded');

  // Initialize Scroll Reveals
  initScrollReveals();

  // Mobile navigation trigger setup
  initMobileMenu();

  // Global Dialog Dismissal Handler
  initDialogHandlers();

  // Quick helper for floating particle effects in hero
  createHeroParticles();
});

// Intersection Observer for scroll-triggered slide/fade animations
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once visible, we don't need to track it anymore
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

// Mobile Menu toggles
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
      const isHidden = mobileMenu.classList.contains('hidden');
      const icon = menuBtn.querySelector('svg');
      if (icon) {
        if (isHidden) {
          icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
        } else {
          icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
        }
      }
    });
  }
}

// Universal dialogs and side drawers toggle helpers
window.toggleSlidePanel = function(panelId) {
  const panel = document.getElementById(panelId);
  const overlay = document.getElementById(panelId + '-overlay');
  
  if (panel) {
    panel.classList.toggle('active');
  }
  if (overlay) {
    overlay.classList.toggle('hidden');
  }
};

window.toggleModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.toggle('hidden');
    modal.classList.toggle('flex');
  }
};

function initDialogHandlers() {
  // Dismiss elements when clicking outside their content
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

// Generate animated canvas/div floating background dots for cyber aesthetic
function createHeroParticles() {
  const container = document.getElementById('hero-particles');
  if (!container) return;

  const count = 30;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'absolute rounded-full pointer-events-none opacity-20';
    
    // Choose neon green or tech blue
    const isGreen = Math.random() > 0.5;
    particle.style.backgroundColor = isGreen ? 'var(--primary)' : 'var(--secondary)';
    
    const size = Math.random() * 6 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.left = `${Math.random() * 100}%`;
    
    // Floating animation
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * -20;
    particle.style.animation = `float ${duration}s ease-in-out infinite`;
    particle.style.animationDelay = `${delay}s`;
    
    container.appendChild(particle);
  }
}

// Utility formatting functions
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
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};
