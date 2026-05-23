// Chart.js configurations and rendering
document.addEventListener('DOMContentLoaded', () => {
  // Check which charts are present on the current page and initialize them
  if (document.getElementById('donation-trends-chart')) {
    renderRestaurantCharts();
  }
  
  if (document.getElementById('ngo-distribution-chart')) {
    renderNGOCharts();
  }
});

function renderRestaurantCharts() {
  const ctxTrends = document.getElementById('donation-trends-chart').getContext('2d');
  const ctxFoodDist = document.getElementById('food-dist-chart').getContext('2d');
  const ctxCO2 = document.getElementById('co2-savings-chart').getContext('2d');

  // Chart Global Defaults for dark theme
  Chart.defaults.color = '#9CA3AF'; // Light gray text
  Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";

  // 1. Line Chart: Weekly Donation Trends
  new Chart(ctxTrends, {
    type: 'line',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      datasets: [{
        label: 'Weight Donated (kg)',
        data: [120, 180, 150, 240, 290, 300],
        borderColor: '#10B981', // Eco Green
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: '#10B981'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { grid: { color: 'rgba(255, 255, 255, 0.03)' } },
        y: { grid: { color: 'rgba(255, 255, 255, 0.03)' }, beginAtZero: true }
      }
    }
  });

  // 2. Doughnut Chart: Food Distribution Categories
  new Chart(ctxFoodDist, {
    type: 'doughnut',
    data: {
      labels: ['Vegetarian', 'Vegan', 'Non-Vegetarian'],
      datasets: [{
        data: [65, 20, 15],
        backgroundColor: ['#10B981', '#3B82F6', '#F59E0B'],
        borderColor: 'rgba(13, 15, 18, 0.9)',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 15, boxWidth: 10, font: { size: 10 } }
        }
      },
      cutout: '75%'
    }
  });

  // 3. Bar Chart: CO2 Offsets by Month
  new Chart(ctxCO2, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'CO₂ Offsets (kg)',
        data: [420, 510, 680, 590, 720, 800],
        backgroundColor: 'rgba(59, 130, 246, 0.75)', // Tech Blue with opacity
        hoverBackgroundColor: '#3B82F6',
        borderRadius: 8,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { grid: { color: 'rgba(255, 255, 255, 0.03)' } },
        y: { grid: { color: 'rgba(255, 255, 255, 0.03)' }, beginAtZero: true }
      }
    }
  });
}

function renderNGOCharts() {
  const ctxDist = document.getElementById('ngo-distribution-chart').getContext('2d');
  const ctxSource = document.getElementById('ngo-source-chart').getContext('2d');

  Chart.defaults.color = '#9CA3AF';
  Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";

  // 1. Line Chart: NGO Distributions (Meals served per month)
  new Chart(ctxDist, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Meals Distributed',
        data: [450, 620, 580, 790, 910, 1100],
        borderColor: '#3B82F6', // Tech Blue
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: '#3B82F6'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { grid: { color: 'rgba(255, 255, 255, 0.03)' } },
        y: { grid: { color: 'rgba(255, 255, 255, 0.03)' }, beginAtZero: true }
      }
    }
  });

  // 2. Bar Chart: Source Contribution Breakdowns
  new Chart(ctxSource, {
    type: 'bar',
    data: {
      labels: ['Grand Palace Hotel', 'Urban Grocers', 'Apex Catering', 'Green Bakery'],
      datasets: [{
        label: 'Surplus Collected (kg)',
        data: [420, 310, 240, 110],
        backgroundColor: 'rgba(16, 185, 129, 0.75)', // Eco Green
        hoverBackgroundColor: '#10B981',
        borderRadius: 8,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { grid: { color: 'rgba(255, 255, 255, 0.03)' } },
        y: { grid: { color: 'rgba(255, 255, 255, 0.03)' }, beginAtZero: true }
      }
    }
  });
}
// Function triggered on step wizard transition to reload canvas sizes
window.resizeMap = function() {
  if (map) {
    map.resize();
  }
};
