document.addEventListener('DOMContentLoaded', () => {
  // 1. Sync Create Listing Form with Live Card Preview
  const form = document.getElementById('create-listing-form');
  if (form) {
    initLivePreviewSync();
  }

  // 2. Init Active Countdown Timers for Listings (active-listings.html)
  initExpiryTimers();
});

function initLivePreviewSync() {
  const nameInput = document.getElementById('food-name-input');
  const descInput = document.getElementById('food-desc-input');
  const qtyInput = document.getElementById('food-qty-input');
  const unitInput = document.getElementById('food-unit-input');
  const typeInput = document.getElementById('food-type-input');
  const uploadInput = document.getElementById('image-upload-trigger');

  const previewName = document.getElementById('preview-food-name');
  const previewDesc = document.getElementById('preview-food-desc');
  const previewQty = document.getElementById('preview-food-qty');
  const previewUnit = document.getElementById('preview-food-unit');
  const previewBadge = document.getElementById('preview-badge-type');
  const previewImage = document.getElementById('card-preview-image');
  const previewPlaceholder = document.getElementById('card-preview-image-placeholder');

  // Input Listeners
  if (nameInput && previewName) {
    nameInput.addEventListener('input', () => {
      previewName.textContent = nameInput.value || 'Paneer Butter Masala';
    });
  }

  if (descInput && previewDesc) {
    descInput.addEventListener('input', () => {
      previewDesc.textContent = descInput.value || 'Prepared for banquet lunch, stored immediately at 4°C in steel containers. FSSAI certified.';
    });
  }

  if (qtyInput && previewQty) {
    qtyInput.addEventListener('input', () => {
      previewQty.textContent = qtyInput.value || '25';
    });
  }

  if (unitInput && previewUnit) {
    unitInput.addEventListener('change', () => {
      previewUnit.textContent = unitInput.value;
    });
  }

  if (typeInput && previewBadge) {
    typeInput.addEventListener('change', () => {
      const type = typeInput.value;
      previewBadge.textContent = type;
      
      // Update badge color classes dynamically
      if (type === 'Veg') {
        previewBadge.className = 'absolute top-4 left-4 px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 uppercase tracking-wide';
      } else if (type === 'Non-Veg') {
        previewBadge.className = 'absolute top-4 left-4 px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-red-950/60 border border-red-800/40 text-red-400 uppercase tracking-wide';
      } else {
        previewBadge.className = 'absolute top-4 left-4 px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-blue-950/60 border border-blue-800/40 text-blue-400 uppercase tracking-wide';
      }
    });
  }

  // Handle uploaded photograph previews
  if (uploadInput && previewImage) {
    uploadInput.addEventListener('change', () => {
      const file = uploadInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImage.src = e.target.result;
          previewImage.classList.remove('hidden');
          if (previewPlaceholder) {
            previewPlaceholder.classList.add('hidden');
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

// Global active timers handler
function initExpiryTimers() {
  const timerElements = document.querySelectorAll('[data-expiry-deadline]');
  
  if (timerElements.length === 0) return;

  const updateTimers = () => {
    const now = new Date().getTime();

    timerElements.forEach(el => {
      const deadlineStr = el.getAttribute('data-expiry-deadline');
      const deadline = new Date(deadlineStr).getTime();
      const diff = deadline - now;

      if (diff <= 0) {
        el.textContent = 'EXPIRED';
        el.className = 'font-mono text-red-500 font-bold';
        
        // Update parent status badge if exists
        const parentCard = el.closest('.listing-card');
        if (parentCard) {
          const statusBadge = parentCard.querySelector('.status-badge');
          if (statusBadge) {
            statusBadge.textContent = 'EXPIRED';
            statusBadge.className = 'px-2.5 py-0.5 rounded-full text-[9px] font-semibold bg-red-950/60 border border-red-800/40 text-red-400 uppercase tracking-wide status-badge';
          }
        }
        return;
      }

      // Calculate time metrics
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      // Render countdown format
      el.textContent = `${hours}h ${minutes}m ${seconds}s`;

      // Dynamic color styling
      if (hours < 2) {
        el.className = 'font-mono text-red-400 font-bold animate-pulse';
      } else if (hours < 6) {
        el.className = 'font-mono text-yellow-400 font-bold';
      } else {
        el.className = 'font-mono text-emerald-400 font-bold';
      }
    });
  };

  // Run immediately and start loop
  updateTimers();
  setInterval(updateTimers, 1000);
}
