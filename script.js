const params = new URLSearchParams(window.location.search);
const selectedLoan = params.get('loan') || 'Personal Loan';

const loanTypeDisplay = document.getElementById('loanTypeDisplay');
const selectedLoanTypeInput = document.getElementById('selectedLoanType');
const documentFields = document.getElementById('documentFields');
const form = document.getElementById('loanForm');
const steps = Array.from(document.querySelectorAll('.form-step'));
const stepButtons = Array.from(document.querySelectorAll('.step-button'));
let currentStep = 0;

const loanDocuments = {
  'Personal Loan': [
    'Passport Size Photo',
    'Aadhaar Card',
    'PAN Card',
    'Salary Slip',
    'Bank Statement'
  ],
  'Home Loan': [
    'Property Documents',
    'Aadhaar Card',
    'PAN Card',
    'Income Proof'
  ],
  'Educational Loan': [
    'Admission Letter',
    'College ID',
    'Fee Structure'
  ],
  'Vehicle Loan': [
    'Vehicle Quotation',
    'Driving License'
  ],
  'Gold Loan': [
    'Gold Ownership Proof'
  ],
  'Business Loan': [
    'GST Certificate',
    'Business Registration Documents',
    'IT Returns',
    'Bank Statement'
  ]
};

function renderDocuments(loanName) {
  if (!documentFields) return;

  const docs = loanDocuments[loanName] || loanDocuments['Personal Loan'];
  documentFields.innerHTML = docs
    .map((doc) => `
      <label class="full-width">
        <span>${doc}</span>
        <input type="file" name="${doc.replace(/\s+/g, '').toLowerCase()}" />
      </label>
    `)
    .join('');
}

function setLoanType() {
  const loanLabel = selectedLoan || 'Personal Loan';
  if (loanTypeDisplay) {
    loanTypeDisplay.textContent = `Loan Type: ${loanLabel}`;
  }
  if (selectedLoanTypeInput) {
    selectedLoanTypeInput.value = loanLabel;
  }
  renderDocuments(loanLabel);
}

function updateStepUI() {
  steps.forEach((step, index) => {
    step.classList.toggle('active', index === currentStep);
  });

  stepButtons.forEach((button, index) => {
    button.classList.toggle('active', index === currentStep);
  });
}

function validateCurrentStep() {
  const activeStep = steps[currentStep];
  const requiredFields = activeStep.querySelectorAll('input[required], select[required], textarea[required]');

  for (const field of requiredFields) {
    if (field.type === 'checkbox') {
      if (!field.checked) {
        alert('Please complete the current section before continuing.');
        field.focus();
        return false;
      }
      continue;
    }

    if (!field.value.trim()) {
      alert('Please complete the current section before continuing.');
      field.focus();
      return false;
    }
  }

  const email = activeStep.querySelector('input[name="email"]');
  const mobile = activeStep.querySelector('input[name="mobile"]');
  const aadhaar = activeStep.querySelector('input[name="aadhaar"]');
  const pan = activeStep.querySelector('input[name="pan"]');
  const accountNumber = activeStep.querySelector('input[name="accountNumber"]');
  const confirmAccountNumber = activeStep.querySelector('input[name="confirmAccountNumber"]');
  const loanAmount = activeStep.querySelector('input[name="loanAmount"]');
  const declaration = activeStep.querySelector('input[name="declaration"]');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  if (email && email.value && !emailPattern.test(email.value)) {
    alert('Please enter a valid email address.');
    email.focus();
    return false;
  }

  if (mobile && mobile.value && !/^\d{10}$/.test(mobile.value)) {
    alert('Mobile number must be 10 digits.');
    mobile.focus();
    return false;
  }

  if (aadhaar && aadhaar.value && !/^\d{12}$/.test(aadhaar.value)) {
    alert('Aadhaar number must be 12 digits.');
    aadhaar.focus();
    return false;
  }

  if (pan && pan.value && !panPattern.test(pan.value.toUpperCase())) {
    alert('PAN format is invalid. Example: ABCDE1234F');
    pan.focus();
    return false;
  }

  if (accountNumber && confirmAccountNumber && accountNumber.value && confirmAccountNumber.value && accountNumber.value !== confirmAccountNumber.value) {
    alert('Account numbers do not match.');
    confirmAccountNumber.focus();
    return false;
  }

  if (loanAmount && Number(loanAmount.value) <= 0) {
    alert('Loan amount must be greater than zero.');
    loanAmount.focus();
    return false;
  }

  if (declaration && !declaration.checked) {
    alert('Please accept the declaration to proceed.');
    declaration.focus();
    return false;
  }

  return true;
}

function goToStep(index) {
  if (index < 0 || index >= steps.length) return;
  currentStep = index;
  updateStepUI();
}

if (form) {
  stepButtons.forEach((button) => {
    button.addEventListener('click', () => goToStep(Number(button.dataset.step)));
  });

  document.querySelectorAll('.next-btn').forEach((button) => {
    button.addEventListener('click', () => {
      if (validateCurrentStep()) {
        goToStep(Math.min(currentStep + 1, steps.length - 1));
      }
    });
  });

  document.querySelectorAll('.back-btn').forEach((button) => {
    button.addEventListener('click', () => {
      if (currentStep === 0) {
        window.location.href = 'index.html';
      } else {
        goToStep(currentStep - 1);
      }
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (validateCurrentStep()) {
      alert('Application submitted successfully!');
      form.reset();
      setLoanType();
      goToStep(0);
    }
  });
}

setLoanType();
updateStepUI();
