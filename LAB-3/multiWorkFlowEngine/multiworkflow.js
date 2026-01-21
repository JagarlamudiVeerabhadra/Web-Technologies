// Steps and progress
const steps = document.querySelectorAll('.step');
const progressBar = document.getElementById('progressBar');
const totalSteps = steps.length;
let currentStep = 1;

// Temporary storage
const formData = {
  name: '',
  email: '',
  street: '',
  city: '',
  password: '',
  agree: false
};

function showStep(step) {
  steps.forEach(s => {
    if (Number(s.dataset.step) === step) {
      s.classList.add('active');
    } else {
      s.classList.remove('active');
    }
  });
  updateProgress(step);
}

function updateProgress(step) {
  const percent = (step - 1) / (totalSteps - 1) * 100;
  progressBar.style.width = percent + '%';
}

function clearErrors() {
  document.querySelectorAll('.error').forEach(e => e.textContent = '');
}

// Validation for each step
function validateStep1() {
  clearErrors();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  let ok = true;

  if (name === '' || /\d/.test(name)) {
    document.getElementById('nameError').textContent = 'Enter a valid name.';
    ok = false;
  }
  const emailPattern = /^[^@]+@[^@]+\.[^@]+$/;
  if (email === '' || !emailPattern.test(email)) {
    document.getElementById('emailError').textContent = 'Enter a valid email.';
    ok = false;
  }

  if (ok) {
    formData.name = name;
    formData.email = email;
  }
  return ok;
}

function validateStep2() {
  clearErrors();
  const street = document.getElementById('street').value.trim();
  const city = document.getElementById('city').value.trim();
  let ok = true;

  if (street.length < 3) {
    document.getElementById('streetError').textContent = 'Street too short.';
    ok = false;
  }
  if (city === '') {
    document.getElementById('cityError').textContent = 'City is required.';
    ok = false;
  }

  if (ok) {
    formData.street = street;
    formData.city = city;
  }
  return ok;
}

function validateStep3() {
  clearErrors();
  const pwd = document.getElementById('password').value;
  const confirm = document.getElementById('confirmPassword').value;
  let ok = true;

  if (pwd.length < 6) {
    document.getElementById('passwordError').textContent =
      'Password must be at least 6 characters.';
    ok = false;
  }
  if (pwd !== confirm) {
    document.getElementById('confirmPasswordError').textContent =
      'Passwords do not match.';
    ok = false;
  }

  if (ok) {
    formData.password = pwd;
  }
  return ok;
}

function validateStep4() {
  clearErrors();
  const agree = document.getElementById('agree').checked;
  if (!agree) {
    document.getElementById('agreeError').textContent =
      'You must agree to continue.';
    return false;
  }
  formData.agree = agree;
  return true;
}

// Initial view
showStep(currentStep);

// Navigation
document.getElementById('next1').addEventListener('click', () => {
  if (validateStep1()) {
    currentStep = 2;
    showStep(currentStep);
  }
});

document.getElementById('next2').addEventListener('click', () => {
  if (validateStep2()) {
    currentStep = 3;
    showStep(currentStep);
  }
});

document.getElementById('next3').addEventListener('click', () => {
  if (validateStep3()) {
    currentStep = 4;
    showStep(currentStep);
  }
});

document.getElementById('prev2').addEventListener('click', () => {
  currentStep = 1;
  showStep(currentStep);
});

document.getElementById('prev3').addEventListener('click', () => {
  currentStep = 2;
  showStep(currentStep);
});

document.getElementById('prev4').addEventListener('click', () => {
  currentStep = 3;
  showStep(currentStep);
});

// Submission
document.getElementById('multiStepForm').addEventListener('submit', (e) => {
  e.preventDefault(); // block normal submit until final validation

  if (!validateStep4()) {
    return;
  }

  // All steps valid; you can send formData with fetch/XHR here
  console.log('Form submitted with data:', formData);
  alert('Form successfully submitted! Check console for data.');

  e.target.reset();
  currentStep = 1;
  showStep(currentStep);
});
