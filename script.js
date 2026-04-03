// =============================================
// 1. DOM ELEMENTS
// =============================================

const form = document.getElementById("signupForm");
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const submitBtn = document.getElementById("submitBtn");
const togglePasswordBtn = document.getElementById("togglePassword");
const togglePasswordConfirmBtn = document.getElementById(
  "toggleConfirmPassword",
);
const successModal = document.getElementById("successModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const strengthFill = document.getElementById("strengthFill");
const strengthText = document.getElementById("strengthText");

// =============================================
// 2. HELPER FUNCTIONS
// =============================================

function showError(input, message) {
  const formGroup = input.closest(".form-group");

  formGroup.classList.remove("success");
  formGroup.classList.add("error");

  const errorMessage = formGroup.querySelector(".error-message");
  errorMessage.textContent = message;
}

function showSuccess(input, message = "") {
  const formGroup = input.closest(".form-group");

  formGroup.classList.remove("error");
  formGroup.classList.add("success");

  const errorMessage = formGroup.querySelector(".error-message");
  errorMessage.textContent = message;
}

function togglePasswordVisibility(input, button) {
  if (input.type === "password") {
    input.type = "text";
    button.textContent = "Hide";
  } else {
    input.type = "password";
    button.textContent = "Show";
  }
}

function saveFormData() {
  const formData = {
    fullName: fullNameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
    confirmPassword: confirmPasswordInput.value,
  };

  localStorage.setItem("formData", JSON.stringify(formData));
}

function loadFormData() {
  const savedData = localStorage.getItem("formData");

  if (!savedData) return;

  const formData = JSON.parse(savedData);

  fullNameInput.value = formData.fullName || "";
  emailInput.value = formData.email || "";
  passwordInput.value = formData.password || "";
  confirmPasswordInput.value = formData.confirmPassword || "";
}

function openModal() {
  successModal.classList.add("show");
}

function closeModal() {
  successModal.classList.remove("show");
}

function updatePasswordStrength(password) {
  if (password.length === 0) {
    strengthFill.style.width = "0";
    strengthFill.style.background = "transparent";
    strengthText.textContent = "Password strength";
    return;
  }

  if (password.length < 6) {
    strengthFill.style.width = "25%";
    strengthFill.style.background = "#ff5d7a";
    strengthText.textContent = "Weak password";
    return;
  }

  let strength = 1;

  if (/\d/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength === 1) {
    strengthFill.style.width = "25%";
    strengthFill.style.background = "#ff5d7a";
    strengthText.textContent = "Weak password";
  } else if (strength === 2) {
    strengthFill.style.width = "50%";
    strengthFill.style.background = "#ffb347";
    strengthText.textContent = "Medium password";
  } else if (strength === 3) {
    strengthFill.style.width = "75%";
    strengthFill.style.background = "#22c7a5";
    strengthText.textContent = "Strong password";
  } else {
    strengthFill.style.width = "100%";
    strengthFill.style.background = "#2fd38b";
    strengthText.textContent = "Very strong password";
  }
}
// =============================================
// 3. VALIDATION HELPERS
// =============================================

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  const hasMinLength = password.length >= 6;
  const hasNumber = /\d/.test(password);

  return hasMinLength && hasNumber;
}

// =============================================
// 4. FIELD VALIDATION FUNCTIONS
// =============================================

function validateFullName() {
  const fullNameValue = fullNameInput.value.trim();

  if (fullNameValue === "") {
    showError(fullNameInput, "Full name is required");
    return false;
  }

  if (fullNameValue.length < 2) {
    showError(fullNameInput, "Full name must be at least 2 characters");
    return false;
  }

  showSuccess(fullNameInput);
  return true;
}

function validateEmail() {
  const emailValue = emailInput.value.trim();

  if (emailValue === "") {
    showError(emailInput, "Email address is required");
    return false;
  }

  if (!isValidEmail(emailValue)) {
    showError(emailInput, "Please enter a valid email address");
    return false;
  }

  showSuccess(emailInput);
  return true;
}

function validatePassword() {
  const passwordValue = passwordInput.value;

  if (passwordValue === "") {
    showError(passwordInput, "Password is required");
    return false;
  }

  if (!isValidPassword(passwordValue)) {
    showError(
      passwordInput,
      "Password must be at least 6 characters and include 1 number",
    );
    return false;
  }

  showSuccess(passwordInput);
  return true;
}

function validateConfirmPassword() {
  const confirmPasswordValue = confirmPasswordInput.value;
  const passwordValue = passwordInput.value;

  if (confirmPasswordValue === "") {
    showError(confirmPasswordInput, "Please confirm your password");
    return false;
  }

  if (confirmPasswordValue !== passwordValue) {
    showError(confirmPasswordInput, "Passwords do not match");
    return false;
  }

  showSuccess(confirmPasswordInput);
  return true;
}

// =============================================
// 5. CHECK WHOLE FORM
// =============================================

function checkFormValidity() {
  const isNameValid = validateFullName();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isConfirmValid = validateConfirmPassword();

  if (isNameValid && isEmailValid && isPasswordValid && isConfirmValid) {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
}

// =============================================
// 6. LIVE VALIDATION EVENTS
// =============================================

fullNameInput.addEventListener("input", () => {
  validateFullName();
  checkFormValidity();
  saveFormData();
});

emailInput.addEventListener("input", () => {
  validateEmail();
  checkFormValidity();
  saveFormData();
});

passwordInput.addEventListener("input", () => {
  validatePassword();
  validateConfirmPassword();
  updatePasswordStrength(passwordInput.value);
  checkFormValidity();
  saveFormData();
});

confirmPasswordInput.addEventListener("input", () => {
  validateConfirmPassword();
  checkFormValidity();
  saveFormData();
});

togglePasswordBtn.addEventListener("click", () => {
  togglePasswordVisibility(passwordInput, togglePasswordBtn);
});

togglePasswordConfirmBtn.addEventListener("click", () => {
  togglePasswordVisibility(confirmPasswordInput, togglePasswordConfirmBtn);
});

closeModalBtn.addEventListener("click", () => {
  closeModal();
});

successModal.addEventListener("click", (e) => {
  if (e.target === successModal) {
    closeModal();
  }
});
// =============================================
// 7. FORM SUBMIT
// =============================================

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const isNameValid = validateFullName();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();
  const isConfirmValid = validateConfirmPassword();

  if (isNameValid && isEmailValid && isPasswordValid && isConfirmValid) {
    // RESETING FORM
    form.reset();
    localStorage.removeItem("formData");
    updatePasswordStrength("");

    const formGroups = document.querySelectorAll(".form-group");

    formGroups.forEach((group) => {
      group.classList.remove("success", "error");

      const errorMessage = group.querySelector(".error-message");
      errorMessage.textContent = "";
    });

    submitBtn.disabled = true;

    openModal();
  }
});

loadFormData();
updatePasswordStrength(passwordInput.value);
checkFormValidity();
