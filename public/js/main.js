//handle fixed-form
const fixedForm = document.querySelector(".fixed-form");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  const scrollableHeight = documentHeight - viewportHeight;

  const startThresholdPercent = 25;
  const endThresholdPercent = 95;

  const startThreshold = (startThresholdPercent / 100) * scrollableHeight;
  const endThreshold = (endThresholdPercent / 100) * scrollableHeight;

  if (scrollY > startThreshold && scrollY < endThreshold) {
    fixedForm.classList.remove("fixed-form-hidden");
  } else {
    fixedForm.classList.add("fixed-form-hidden");
  }
});

//handle onload focus
window.onload = function () {
  zipInpOne.focus();
};

const formOne = document.querySelector("#formOne");
const formTwo = document.querySelector("#formTwo");
const zipInpOne = document.querySelector("#zipOne");
const zipInpTwo = document.querySelector("#zipTwo");
const zipRegex = /^\d{5}(-\d{4})?$/;

// General validation function
const validateStep = (input, form) => {
  let isValid = true;
  const zipValue = input.value.trim();

  if (!zipRegex.test(zipValue)) {
    setError(form);
    isValid = false;
  } else {
    setSuccess(form);
  }

  return isValid;
};

// Event listener for form submission
const setupFormValidation = (form, input) => {
  form.addEventListener("submit", function (e) {
    if (!validateStep(input, form)) {
      e.preventDefault();
    }
    input.addEventListener("input", () => validateStep(input, form));
  });
};

// Set up validation for each form
setupFormValidation(formOne, zipInpOne);
setupFormValidation(formTwo, zipInpTwo);

// Error and success handling functions
const setError = (element) => {
  element.classList.add("invalid");
};

const setSuccess = (element) => {
  element.classList.remove("invalid");
};
