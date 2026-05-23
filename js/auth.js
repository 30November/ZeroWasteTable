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
