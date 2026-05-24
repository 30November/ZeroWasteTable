document.addEventListener('DOMContentLoaded', () => {
  initCounters();
});

function initCounters() {
  const counterElements = document.querySelectorAll('[data-counter-target]');
  
  const observerOptions = {
    root: null,
    threshold: 0.5, // Trigger when 50% of the element is visible
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const endVal = parseInt(target.getAttribute('data-counter-target'), 10);
        const duration = parseInt(target.getAttribute('data-counter-duration') || '2000', 10);
        const suffix = target.getAttribute('data-counter-suffix') || '';
        
        animateCount(target, 0, endVal, duration, suffix);
        observer.unobserve(target); // Only animate once
      }
    });
  }, observerOptions);

  counterElements.forEach(el => observer.observe(el));
}

function animateCount(element, start, end, duration, suffix) {
  let startTimestamp = null;
  
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    
    // Easing out quadratic function
    const easeProgress = progress * (2 - progress);
    const currentValue = Math.floor(easeProgress * (end - start) + start);
    
    // Format large numbers with commas
    element.textContent = currentValue.toLocaleString() + suffix;
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = end.toLocaleString() + suffix;
    }
  };
  
  window.requestAnimationFrame(step);
}
