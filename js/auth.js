let currentStep = 1;
const totalSteps = 3;

window.goToStep = function(step) {
  if (step < 1 || step > totalSteps) return;
  
  // Validation before going forward
  if (step > currentStep) {
    if (!validateCurrentStep()) {
      return;
    }
  }

  // Hide all steps
  const steps = document.querySelectorAll('.form-step');
  steps.forEach(s => s.classList.remove('active'));

  // Show active step
  const activeStepSection = document.getElementById(`step-section-${step}`);
  if (activeStepSection) {
    activeStepSection.classList.add('active');
  }

  // Update Stepper Nodes UI
  updateStepperUI(step);

  currentStep = step;
  
  // Trigger Mapbox resize if on step 3
  if (step === 3 && typeof window.resizeMap === 'function') {
    setTimeout(window.resizeMap, 200);
  }
};

function updateStepperUI(step) {
  // Update timeline line width
  const line = document.getElementById('progress-indicator-line');
  if (line) {
    const percentage = ((step - 1) / (totalSteps - 1)) * 100;
    line.style.width = `${percentage}%`;
  }

  // Update node numbers color styling
  for (let i = 1; i <= totalSteps; i++) {
    const node = document.getElementById(`step-node-${i}`);
    if (node) {
      if (i < step) {
        // Completed step
        node.className = 'w-8 h-8 rounded-full bg-emerald-500 text-cyberDark font-bold text-xs flex items-center justify-center shadow-lg border border-emerald-500/30';
        node.innerHTML = '✔';
      } else if (i === step) {
        // Active step
        const isNGO = document.getElementById('ngo-register-form') !== null;
        const colorClass = isNGO ? 'bg-techBlue text-cyberDark border-techBlue/30' : 'bg-ecoGreen text-cyberDark border-ecoGreen/30';
        node.className = `w-8 h-8 rounded-full ${colorClass} font-bold text-xs flex items-center justify-center shadow-lg border`;
        node.innerHTML = i;
      } else {
        // Pending step
        node.className = 'w-8 h-8 rounded-full bg-cyberCard text-gray-500 font-bold text-xs flex items-center justify-center border border-white/10';
        node.innerHTML = i;
      }
    }
  }
}

function validateCurrentStep() {
  const activeSection = document.getElementById(`step-section-${currentStep}`);
  if (!activeSection) return true;

  const requiredInputs = activeSection.querySelectorAll('input[required], select[required]');
  let isValid = true;

  requiredInputs.forEach(input => {
    // Clear previous errors
    input.classList.remove('border-red-500');
    
    if (!input.value.trim()) {
      input.classList.add('border-red-500');
      isValid = false;
    }

    // Specific password checking
    if (input.id === 'reg-password' && input.value.length < 8) {
      input.classList.add('border-red-500');
      isValid = false;
      alert('Password must be at least 8 characters long.');
    }
  });

  return isValid;
}

// Live password strength listener
document.addEventListener('DOMContentLoaded', () => {
  const passwordInput = document.getElementById('reg-password');
  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      evaluatePasswordStrength(passwordInput.value);
    });
  }
});

function evaluatePasswordStrength(password) {
  const strengthBars = [
    document.getElementById('strength-bar-1'),
    document.getElementById('strength-bar-2'),
    document.getElementById('strength-bar-3')
  ];
  
  if (!strengthBars[0]) return;

  // Clear active colors
  strengthBars.forEach(bar => {
    bar.className = 'flex-grow rounded bg-white/5 transition-colors';
  });

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;

  if (password.length === 0) return;

  if (score === 1) {
    strengthBars[0].className = 'flex-grow rounded bg-red-500 transition-colors';
  } else if (score === 2) {
    strengthBars[0].className = 'flex-grow rounded bg-yellow-500 transition-colors';
    strengthBars[1].className = 'flex-grow rounded bg-yellow-500 transition-colors';
  } else if (score === 3) {
    strengthBars[0].className = 'flex-grow rounded bg-emerald-500 transition-colors';
    strengthBars[1].className = 'flex-grow rounded bg-emerald-500 transition-colors';
    strengthBars[2].className = 'flex-grow rounded bg-emerald-500 transition-colors';
  }
}

// ===================================
// JWT AUTH & ROLE GUARD SIMULATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  const forms = [
    { id: 'ngo-login-form', role: 'ngo', redirect: '../ngo/dashboard.html' },
    { id: 'ngo-register-form', role: 'ngo', redirect: '../ngo/dashboard.html' },
    { id: 'restaurant-login-form', role: 'restaurant', redirect: '../restaurant/dashboard.html' },
    { id: 'restaurant-register-form', role: 'restaurant', redirect: '../restaurant/dashboard.html' }
  ];

  forms.forEach(f => {
    const el = document.getElementById(f.id);
    if (el) {
      el.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Mock JWT Token generation
        const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
        const payload = btoa(JSON.stringify({ role: f.role, name: "Verified Actor", exp: Math.floor(Date.now() / 1000) + 3600 }));
        const mockJWT = `${header}.${payload}.mockSignatureValue`;

        localStorage.setItem('zwt-token', mockJWT);
        localStorage.setItem('zwt-role', f.role);
        localStorage.setItem('zwt-user-email', el.querySelector('input[type="email"]')?.value || 'user@zerowaste.org');

        if (typeof showToast === 'function') {
          showToast('Authentication successful! Loading dashboard...', 'success');
        } else {
          alert('Login Successful!');
        }

        setTimeout(() => {
          window.location.href = f.redirect;
        }, 800);
      });
    }
  });

  // Active Route Guards check
  checkRoutePermission();

  // Attach logout handler to any logout links
  document.querySelectorAll('a[href*="select-role.html"]').forEach(btn => {
    // If it is in sidebar or bottom nav
    if (btn.classList.contains('sidebar-link') || btn.textContent.includes('Logout')) {
      btn.addEventListener('click', (e) => {
        logoutUser(e);
      });
    }
  });
});

window.loginAsAdmin = function(e) {
  if (e) e.preventDefault();
  
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ role: 'admin', name: "System Administrator", exp: Math.floor(Date.now() / 1000) + 3600 }));
  const mockJWT = `${header}.${payload}.adminSignatureValue`;

  localStorage.setItem('zwt-token', mockJWT);
  localStorage.setItem('zwt-role', 'admin');
  localStorage.setItem('zwt-user-email', 'admin@zerowaste.org');

  if (typeof showToast === 'function') {
    showToast('Admin authorization granted.', 'success');
  } else {
    alert('Authorized as Admin');
  }

  setTimeout(() => {
    // Determine relative redirect
    const isSub = window.location.pathname.includes('/auth/');
    window.location.href = isSub ? '../admin/dashboard.html' : 'admin/dashboard.html';
  }, 600);
};

function checkRoutePermission() {
  const path = window.location.pathname;
  const currentRole = localStorage.getItem('zwt-role');
  const currentToken = localStorage.getItem('zwt-token');

  // Check path matches folder
  if (path.includes('/ngo/')) {
    if (!currentToken || currentRole !== 'ngo') {
      console.warn("Unauthorized access to NGO portal.");
      window.location.href = '../auth/select-role.html';
    }
  }
  
  if (path.includes('/restaurant/')) {
    if (!currentToken || currentRole !== 'restaurant') {
      console.warn("Unauthorized access to Restaurant portal.");
      window.location.href = '../auth/select-role.html';
    }
  }

  if (path.includes('/admin/')) {
    if (!currentToken || currentRole !== 'admin') {
      console.warn("Unauthorized access to Admin portal.");
      window.location.href = '../auth/select-role.html';
    }
  }
}

window.logoutUser = function(e) {
  if (e) e.preventDefault();
  localStorage.removeItem('zwt-token');
  localStorage.removeItem('zwt-role');
  localStorage.removeItem('zwt-user-email');
  
  const isSub = window.location.pathname.includes('/ngo/') || window.location.pathname.includes('/restaurant/') || window.location.pathname.includes('/admin/');
  const redir = isSub ? '../auth/select-role.html' : 'auth/select-role.html';
  
  window.location.href = redir;
};

