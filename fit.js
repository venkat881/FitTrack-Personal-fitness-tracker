const workoutForm = document.getElementById('workout-form');
const workoutLog = document.getElementById('workout-log');
const nutritionForm = document.getElementById('nutrition-form');
const nutritionLog = document.getElementById('nutrition-log');
const weightForm = document.getElementById('weight-form');

const calorieBurnRate = 0.1; // Approx 0.1 calories per rep
let weightChart;

// --- Workout Section ---
function saveWorkout(workout) {
  const totalReps = workout.sets * workout.reps;
  workout.calories = Math.round(totalReps * calorieBurnRate);
  const workouts = JSON.parse(localStorage.getItem('workouts')) || [];
  workouts.push(workout);
  localStorage.setItem('workouts', JSON.stringify(workouts));
}

function loadWorkouts() {
  workoutLog.innerHTML = '';
  let totalBurned = 0;
  const workouts = JSON.parse(localStorage.getItem('workouts')) || [];
  workouts.forEach(w => {
    const li = document.createElement('li');
    li.textContent = `${w.exercise} - ${w.sets} x ${w.reps} reps (${w.calories} cal)`;
    workoutLog.appendChild(li);
    totalBurned += w.calories;
  });
  document.getElementById('calories-burned').textContent = totalBurned;
}

workoutForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const workout = {
    exercise: document.getElementById('exercise').value,
    sets: parseInt(document.getElementById('sets').value),
    reps: parseInt(document.getElementById('reps').value)
  };
  saveWorkout(workout);
  loadWorkouts();
  workoutForm.reset();
});

// --- Nutrition Section ---
function saveMeal(meal) {
  const meals = JSON.parse(localStorage.getItem('meals')) || [];
  meals.push(meal);
  localStorage.setItem('meals', JSON.stringify(meals));
}

function loadMeals() {
  nutritionLog.innerHTML = '';
  let totalConsumed = 0;
  const meals = JSON.parse(localStorage.getItem('meals')) || [];
  meals.forEach(m => {
    const li = document.createElement('li');
    li.textContent = `${m.meal} - ${m.calories} cal`;
    nutritionLog.appendChild(li);
    totalConsumed += parseInt(m.calories);
  });
  document.getElementById('calories-consumed').textContent = totalConsumed;
}

nutritionForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const meal = {
    meal: document.getElementById('meal').value,
    calories: parseInt(document.getElementById('calories').value)
  };
  saveMeal(meal);
  loadMeals();
  nutritionForm.reset();
});

// --- Weight Tracker + Chart.js ---
function saveWeightEntry(entry) {
  const weights = JSON.parse(localStorage.getItem('weights')) || [];
  weights.push(entry);
  localStorage.setItem('weights', JSON.stringify(weights));
}

function loadWeightChart() {
  const weights = JSON.parse(localStorage.getItem('weights')) || [];
  const labels = weights.map((_, i) => `Day ${i + 1}`);
  const data = weights.map(w => w.weight);

  const ctx = document.getElementById('weight-chart').getContext('2d');
  if (weightChart) weightChart.destroy();

  weightChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Weight Progress (kg)',
        data,
        borderColor: 'rgb(75, 192, 192)',
        fill: false,
        tension: 0.2
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}

weightForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const entry = {
    weight: parseFloat(document.getElementById('weight').value)
  };
  saveWeightEntry(entry);
  loadWeightChart();
  weightForm.reset();
});

// --- Initial Load ---
window.addEventListener('load', () => {
  loadWorkouts();
  loadMeals();
  loadWeightChart();
});
// --- Clear Workouts ---
document.getElementById('clear-workouts').addEventListener('click', function() {
  localStorage.removeItem('workouts');
  loadWorkouts();
});

// --- Clear Meals ---
document.getElementById('clear-meals').addEventListener('click', function() {
  localStorage.removeItem('meals');
  loadMeals();
});

// --- Clear Weight Entries ---
document.getElementById('clear-weights').addEventListener('click', function() {
  localStorage.removeItem('weights');
  loadWeightChart();
});
