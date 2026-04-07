let options = [];
let displayOptionsVisible = true;
let currentAngle = 0;
let spinning = false;

// Event listener for the input field to add options
document.getElementById('optionInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    setOption(this.value);
  }
});

function setOption(option) {
    if (option.trim() === '') {
        alert('Please enter a valid option.');
        return;
    }
  options.push(option);
  getOptionList();
  // Clear input field after adding
  document.getElementById('optionInput').value = ''; 
}
function getOptions() {
  return options;
}
function clearOptions() {
  options = [];
}
function removeOption(option) {
  options = options.filter(opt => opt !== option);
}

function displayOptions() {
    displayOptionsVisible = !displayOptionsVisible;
    const optionsContainer = document.getElementById('optionList');
    const button = document.querySelector('button[onclick="displayOptions()"]');
    if (displayOptionsVisible) {
        button.textContent = 'Hide Options';
        optionsContainer.style.display = 'block';
        getOptionList();
    } else {
        button.textContent = 'Show Options';
        optionsContainer.style.display = 'none';
    }
}

function getOptionList() {
  const optionsDisplay = document.getElementById('optionsDisplay');
  optionsDisplay.innerHTML = '';
  options.forEach((option, idx) => {
    const li = document.createElement('li');

    // Create input box for editing
    const input = document.createElement('input');
    input.type = 'text';
    input.value = option;

    // Create remove button
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
      removeOption(option);
      getOptionList();
    });

    li.appendChild(input);
    li.appendChild(removeBtn);
    optionsDisplay.appendChild(li);
  });
}

function editOptions() {
    const optionsDisplay = document.getElementById('optionsDisplay');
    const inputs = optionsDisplay.querySelectorAll('input[type="text"]');
    options = Array.from(inputs).map(input => input.value); // Update options with current input values
    // Refresh the displayed options
    getOptionList(); 
}

function drawSpinnerWheel(angle = 0, selectedIndex = null) {
  const canvas = document.getElementById('spinnerCanvas');
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 10;
  const sliceAngle = (2 * Math.PI) / options.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(angle);

  options.forEach((option, i) => {
    // Highlight selected slice
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(
      0,
      0,
      radius,
      i * sliceAngle,
      (i + 1) * sliceAngle
    );
    ctx.closePath();
    ctx.fillStyle = (selectedIndex === i) 
      ? `rgba(255,215,0,0.7)` // gold highlight
      : `hsl(${(i * 360) / options.length}, 70%, 70%)`;
    ctx.fill();
    ctx.stroke();

    // Draw text
    ctx.save();
    ctx.rotate(i * sliceAngle + sliceAngle / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#333';
    ctx.font = (selectedIndex === i) ? 'bold 20px Arial' : '16px Arial';
    ctx.fillText(option, radius - 10, 5);
    ctx.restore();
  });

  ctx.restore();
}

/* function drawArrow() {
  const canvas = document.getElementById('spinnerCanvas');
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 5;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - radius); // Tip of arrow
  ctx.lineTo(centerX - 15, centerY - radius + 30); // Left base
  ctx.lineTo(centerX + 15, centerY - radius + 30); // Right base
  ctx.closePath();
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.restore();
} */

function spinWheel() {
  if (options.length === 0) {
    alert('Please add options before spinning the wheel.');
    return;
  }
  if (spinning) return;

  spinning = true;
  let spinTime = 0;
  const spinDuration = 3000;
  const startAngle = currentAngle;
  const endAngle = startAngle + Math.PI * 8 + Math.random() * Math.PI * 2;

  function animateSpin(timestamp) {
    if (!spinTime) spinTime = timestamp;
    const elapsed = timestamp - spinTime;
    const progress = Math.min(elapsed / spinDuration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    currentAngle = startAngle + (endAngle - startAngle) * ease;
    drawSpinnerWheel(currentAngle);

    if (progress < 1) {
      requestAnimationFrame(animateSpin);
    } else {
      spinning = false;
      // Find selected option
      const sliceAngle = (2 * Math.PI) / options.length;
      let normalizedAngle = (2 * Math.PI - (currentAngle % (2 * Math.PI))) % (2 * Math.PI);
      let selectedIndex = Math.floor(normalizedAngle / sliceAngle);
      if (selectedIndex >= options.length) selectedIndex = 0;
      const selectedOption = options[selectedIndex];
      document.getElementById('result').textContent = `You got: ${selectedOption}`;
      drawSpinnerWheel(currentAngle, selectedIndex); // Highlight selected slice
    }
  }

  requestAnimationFrame(animateSpin);
}

// Call drawSpinnerWheel() initially to show wheel
drawSpinnerWheel();