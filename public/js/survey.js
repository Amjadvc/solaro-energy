//handel pre load
const preLaod = document.querySelector("#pre_load");
window.addEventListener("load", () => {
  setTimeout(() => {
    preLaod.classList.remove("show-preload");
  }, 200);
});

// Utility functions
const toggleButtonState = (button, isActive) => {
  if (isActive) {
    button.classList.add("active");
    button.removeAttribute("disabled");
  } else {
    button.classList.remove("active");
    button.setAttribute("disabled", true);
  }
};

// electric_bill_Nonprofit_validation
const validateStepFour = () => {
  const numInput = document.querySelector("#electricityBillRef");
  const btnFoure = document
    .querySelector("#step4")
    .querySelector("[data-next]");

  numInput.addEventListener("input", () => {
    let inputValue = numInput.value.replace(/^0+/, "") || "0";
    let numInpValue = parseFloat(inputValue);

    numInput.value = inputValue;

    if (!isNaN(numInpValue) && numInpValue > 0) {
      if (numInpValue > 1e6) {
        numInput.value = numInpValue.toExponential();
      }
      toggleButtonState(btnFoure, true);
    } else {
      toggleButtonState(btnFoure, false);
    }
  });
};

//organization_name_validation
const validateStepSix = () => {
  const orgInput = document.querySelector("#organizationNameRef");
  const btnsix = document.querySelector("#step6").querySelector("[data-next]");

  orgInput.addEventListener("input", () => {
    toggleButtonState(btnsix, orgInput.value.trim() !== "");
  });
};

//Full_name_validation
const validateStepSeven = () => {
  const firstNameInp = document.querySelector("#firstName");
  const lastNameInp = document.querySelector("#lastName");
  const summitButtonSeven = document
    .querySelector("#step7")
    .querySelector("[data-next]");

  const lettersRegex = /^[A-Za-z]{2,}$/;

  const validateNames = () => {
    const isFirstNameValid = lettersRegex.test(firstNameInp.value);
    const isLastNameValid = lettersRegex.test(lastNameInp.value);

    toggleButtonState(summitButtonSeven, isFirstNameValid && isLastNameValid);
  };

  firstNameInp.addEventListener("input", validateNames);
  lastNameInp.addEventListener("input", validateNames);

  validateNames();
};

//email_validation
const validateStepsixten = () => {
  const emailAddressInp = document.querySelector("#email");
  const summitButton16 = document
    .querySelector("#step16")
    .querySelector("[data-next]");

  var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const validateEmail = () => {
    const isEmailValid = emailRegex.test(emailAddressInp.value.trim());
    toggleButtonState(summitButton16, isEmailValid);
  };

  emailAddressInp.addEventListener("input", validateEmail);

  validateEmail();
};

//phone_validation
const validatePhoneNumber = () => {
  const phoneInp = document.querySelector("#phone");
  const summitButtonphone = document

    .querySelector("#step17")
    .querySelector("[data-submit]");

  const phoneRegex = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;

  phoneInp.addEventListener("input", function () {
    let cleaned = phoneInp.value.replace(/\D/g, "");
    phoneInp.value = cleaned;
    let length = cleaned.length;

    if (length > 3 && length <= 6) {
      phoneInp.value = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else if (length > 6) {
      phoneInp.value = `(${cleaned.slice(0, 3)}) ${cleaned.slice(
        3,
        6
      )}-${cleaned.slice(6, 10)}`;
    } else {
      phoneInp.value = cleaned;
    }

    if (phoneInp.value.match(phoneRegex)) {
      toggleButtonState(summitButtonphone, true);
    } else {
      toggleButtonState(summitButtonphone, false);
    }
  });

  summitButtonphone.addEventListener("click", function () {
    if (!summitButtonphone.hasAttribute("disabled")) {
      summitButtonphone.classList.add("active-an");
    } else {
      summitButtonphone.classList.remove("active-an");
    }
  });
};

//Handle_electric_bill_Home
const handleSlider = () => {
  const slider = document.querySelector(".range-slider .slider");
  const thumb = document.querySelector(".range-slider .slider-thump");
  const tooltip = document.querySelector(".range-slider .tooltip");
  const progress = document.querySelector(".range-slider .progress");

  const updateSlider = () => {
    const maxValue = slider.getAttribute("max");
    const val = `${(slider.value / maxValue) * 100}%`;
    tooltip.innerHTML = `$${slider.value}`;
    progress.style.width = val;
    thumb.style.left = val;
  };

  slider.addEventListener("input", updateSlider);
  updateSlider();
};

//Google_autocomplete&Map_initialization
const btnfive = document.querySelector("[data-address]");
async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker"
  );
  const { Autocomplete } = await google.maps.importLibrary("places");

  const map = new Map(document.getElementById("map"), {
    center: { lat: 37.0902, lng: 95.7129 },
    zoom: 19,
    mapId: "4504f8b37365c3d0",
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeId: "satellite",
  });
  map.setOptions({ draggableCursor: "crosshair" });

  //Style the marker
  const customPin = new PinElement({
    scale: 1.3,
    background: "#fbbc04",
    borderColor: "#fff",
    glyphColor: "#fff",
  });

  const marker = new AdvancedMarkerElement({
    map,
    position: { lat: 37.0902, lng: 95.7129 },
    content: customPin.element,
  });

  //animate a marker
  function applyAnimation() {
    customPin.element.classList.remove("marker-animated");
    void customPin.element.offsetWidth;
    customPin.element.classList.add("marker-animated");
  }

  // Move the marker to the clicked location
  map.addListener("click", function (event) {
    const clickedLocation = event.latLng;
    marker.position = clickedLocation;
    applyAnimation();
  });

  // Initialize the autocomplete input
  const input = document.getElementById("address");
  const autocomplete = new Autocomplete(input);

  let selectedPlace = null;

  // Bind autocomplete results to map
  autocomplete.addListener("place_changed", function () {
    const place = autocomplete.getPlace();
    const showAddress = document.querySelector("#addressShow");
    // Make sure the place has a geometry (location)
    if (place.geometry && place.geometry.location) {
      selectedPlace = place.formatted_address || input.value; // Store the selected place
      toggleButtonState(btnfive, true);
      showAddress.innerHTML = input.value;
      const location = place.geometry.location;
      map.setCenter(location);
      map.setZoom(19);

      // Move the marker to the selected location
      marker.position = location;
      applyAnimation();
    } else {
      selectedPlace = null;
      toggleButtonState(btnfive, false);
    }
  });

  // Listen for input changes to check if the value matches the selected place
  input.addEventListener("input", function () {
    if (selectedPlace && input.value === selectedPlace) {
      toggleButtonState(btnfive, true);
    } else {
      toggleButtonState(btnfive, false);
    }
  });
}

// Handle button state based on radio selection
const handleRadioButtons = () => {
  document.querySelectorAll("[data-step]").forEach((step) => {
    const labels = step.querySelectorAll(".radiosConainer label");
    const nextBtn = step.querySelector("[data-next]");
    let findSelected = false;

    nextBtn.setAttribute("disabled", true);

    labels.forEach((label) => {
      label.addEventListener("click", function () {
        labels.forEach((lbl) => lbl.classList.remove("active"));
        this.classList.add("active");
        findSelected = true;
        toggleButtonState(nextBtn, findSelected);
      });
    });
  });
};

let stepHistory = []; // Stack to store the history of visited steps

const stepTransitions = {
  "#step1": {
    next: {
      residential: "#step8",
      default: "#step2",
    },
    prev: null,
  },
  "#step2": {
    next: "#step3",
    prev: "#step1",
  },
  "#step3": {
    next: "#step4",
    prev: "#step2",
  },
  "#step4": {
    next: "#step5",
    prev: "#step3",
  },
  "#step5": {
    next: "#step15",
    prev: "#step4",
  },
  "#step6": {
    next: "#step7",
    prev: "#step15",
  },
  "#step7": {
    next: "#step16",
    prev: "#step15",
  },
  "#step8": {
    next: {
      own: "#step9",
      default: "#step10",
    },
    prev: "#step1",
  },
  "#step9": {
    next: "#step5",
    prev: "#step10",
  },
  "#step10": {
    next: {
      none: "#step5",
      default: "#step9",
    },
    prev: "#step8",
  },
  "#step15": {
    next: () => {
      const secondLastStep = stepHistory[stepHistory.length - 2];
      return secondLastStep === "#step4" ? "#step6" : "#step7";
    },
  },
  "#step16": {
    next: "#step17",
    prev: "#step7",
  },
  "#step17": {
    next: null,
    prev: "#step16",
  },
};

// Handle step transitions and back button
const initializeStepTransitions = () => {
  Object.entries(stepTransitions).forEach(([currentStepSelector, config]) => {
    const currentStep = document.querySelector(currentStepSelector);
    const nextButton = currentStep.querySelector("[data-next]");

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        const nextStepSelector = determineNextStepSelector(
          currentStepSelector,
          config
        );
        const nextStep = document.querySelector(nextStepSelector);

        if (nextStep) {
          stepHistory.push(currentStepSelector); // Add current step to history before moving forward
          transitionToNextStep(currentStep, nextStep);
        }
      });
    }
  });

  // Add event listener for back button (outside the loop)
  const backButton = document.querySelector("#backButton");
  if (backButton) {
    backButton.addEventListener("click", () => {
      const currentStepVisible = Object.keys(stepTransitions).find(
        (selector) =>
          !document.querySelector(selector).classList.contains("hidden")
      );
      if (currentStepVisible && stepHistory.length > 0) {
        const prevStepSelector = stepHistory.pop();
        const prevStep = document.querySelector(prevStepSelector);

        if (prevStep) {
          transitionToPreviousStep(
            document.querySelector(currentStepVisible),
            prevStep
          );
        }
      }
    });
  }
};

// Determine the next step selector based on configuration and selected value
const determineNextStepSelector = (currentStepSelector, config) => {
  const currentStepConfig = config.next;
  if (typeof currentStepConfig === "function") {
    return currentStepConfig(stepHistory[stepHistory.length - 1]);
  } else if (typeof currentStepConfig === "object") {
    const selectedValue = getSelectedRadioValue(currentStepSelector);
    return currentStepConfig[selectedValue] || currentStepConfig.default;
  }
  return currentStepConfig;
};

let totalSteps = 10;
let initialTotalSteps = totalSteps;
let stepNumber = 1;

const handleDataCheckSteps = () => {
  document.querySelectorAll("label[data-check]").forEach((label) => {
    label.addEventListener("click", function () {
      const newTotal = parseInt(this.getAttribute("data-check"), 10);
      if (!isNaN(newTotal)) {
        totalSteps = newTotal;
        initialTotalSteps = totalSteps;
        updateProgressBar(totalSteps, stepNumber);
      }
    });
  });
};
handleDataCheckSteps();

// Handle transition to the next step
const transitionToNextStep = (currentStep, nextStep) => {
  //customeHeader_for_address_step
  stepFive = document.querySelector("#step5");
  if (currentStep.hasAttribute("data-r")) {
    stepFive.querySelector(".step-header").innerHTML = `Find your roof`;
  }
  if (currentStep.hasAttribute("data-b")) {
    stepFive.querySelector(
      ".step-header"
    ).innerHTML = `What is your business address?`;
  }

  currentStep.classList.add("hidden");
  nextStep.classList.remove("hidden");
  nextStep.classList.add("animate-next");
  setTimeout(() => {
    nextStep.classList.remove("animate-next");
  }, 500);
  stepNumber += 1;
  updateProgressBar(totalSteps, stepNumber);
  updateBackButtonState(nextStep);
};

// Handle transition to the previous step
const transitionToPreviousStep = (currentStep, prevStep) => {
  currentStep.classList.add("hidden");
  prevStep.classList.remove("hidden");
  prevStep.classList.add("animate-back");
  setTimeout(() => {
    prevStep.classList.remove("animate-back");
  }, 500);
  stepNumber -= 1;
  updateProgressBar(totalSteps, stepNumber);
  updateBackButtonState(prevStep);
};

// Update progress bar based on the current step
const updateProgressBar = (totalSteps, stepNumber) => {
  const progressCurrent = document.querySelector("[data-progress-current]");
  const progressTotla = document.querySelector("[data-progress-total]");
  const progressBar = document.querySelector("#progressBar");
  const progressPercentage = (stepNumber / totalSteps) * 100;
  progressTotla.innerHTML = totalSteps;
  progressCurrent.innerHTML = stepNumber;
  progressBar.style.width = `${progressPercentage}%`;
};

// Update back button state
const updateBackButtonState = (currentStep) => {
  const backButton = document.querySelector("#backButton");

  if (stepHistory.length > 0) {
    backButton.classList.remove("hidden");
  } else {
    backButton.classList.add("hidden");
  }
};

// Get selected value from radio inputs
const getSelectedRadioValue = (stepSelector) => {
  const radios = document.querySelectorAll(
    `${stepSelector} input[type="radio"]`
  );
  return Array.from(radios).find((radio) => radio.checked)?.value;
};

const searchParams = new URLSearchParams(window.location.search);
const zipCode = searchParams.get("zip");

const form = document.querySelector("#form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  if (zipCode) {
    data.zip = zipCode;
  }
  const jsonData = JSON.stringify(data);

  //remove redirection pls
  setTimeout(() => {
    window.location.href = "thanks.html";
  }, 200);

  // Edit her to add an api pls
  // fetch("https://api-endpoint", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: jsonData,
  // })
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     return response.json();
  //   })
  //   .then((data) => {
  //     console.log("Success:", data);
  //     setTimeout(() => {
  //       window.location.href = "thanks.html";
  //     }, 200);
  //   })
  //   .catch((error) => {
  //     console.error("There was a problem with the fetch operation:", error);
  //   });
});

const init = () => {
  validateStepFour();
  validateStepSix();
  validateStepSeven();
  validateStepsixten();
  handleSlider();
  handleRadioButtons();
  initializeStepTransitions();
  handleDataCheckSteps();
  validatePhoneNumber();
};

init();
