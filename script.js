document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  initToolTabs();
  initPercentageCalculator();
  initCgpaCalculator();
  initAttendanceCalculator();

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});

function initMobileNav() {
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('mainNav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initToolTabs() {
  var tabs = document.querySelectorAll('.tool-tab');
  var navLinks = document.querySelectorAll('.nav-link[data-tool]');

  function showTool(toolId) {
    document.querySelectorAll('.tool-section').forEach(function (section) {
      section.classList.toggle('active', section.id === toolId);
    });

    tabs.forEach(function (tab) {
      var active = tab.getAttribute('data-tool') === toolId;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      showTool(tab.getAttribute('data-tool'));
      window.scrollTo({
        top: document.querySelector('.tool-tabs').offsetTop - 60,
        behavior: 'smooth'
      });
    });
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      showTool(link.getAttribute('data-tool'));
    });
  });

  var hash = window.location.hash.replace('#', '');
  if (
    hash &&
    document.getElementById(hash) &&
    document.getElementById(hash).classList.contains('tool-section')
  ) {
    showTool(hash);
  }
}

function isValidNumber(value) {
  return value !== '' && !isNaN(value) && isFinite(value);
}

function showError(el, message) {
  el.textContent = message;
  el.hidden = false;
}

function hideError(el) {
  el.hidden = true;
  el.textContent = '';
}

function formatNumber(num, decimals) {
  decimals = decimals === undefined ? 2 : decimals;
  return Number(num.toFixed(decimals)).toString();
}

function initPercentageCalculator() {
  var form = document.getElementById('percentageForm');
  var resultBox = document.getElementById('percentageResult');
  var errorBox = document.getElementById('percentageError');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    hideError(errorBox);
    resultBox.hidden = true;

    var obtained = document.getElementById('obtainedMarks').value.trim();
    var total = document.getElementById('totalMarks').value.trim();

    if (!isValidNumber(obtained) || !isValidNumber(total)) {
      showError(errorBox, 'Please enter valid numbers for both fields.');
      return;
    }

    obtained = parseFloat(obtained);
    total = parseFloat(total);

    if (total <= 0) {
      showError(errorBox, 'Total marks must be greater than 0.');
      return;
    }

    if (obtained < 0) {
      showError(errorBox, 'Marks obtained cannot be negative.');
      return;
    }

    if (obtained > total) {
      showError(errorBox, 'Marks obtained cannot be greater than total marks.');
      return;
    }

    var percentage = (obtained / total) * 100;

    resultBox.innerHTML =
      '<h3>Result</h3>' +
      '<div class="result-line"><span>Marks Obtained</span><strong>' + formatNumber(obtained) + '</strong></div>' +
      '<div class="result-line"><span>Total Marks</span><strong>' + formatNumber(total) + '</strong></div>' +
      '<div class="result-line"><span>Percentage</span><strong>' + formatNumber(percentage) + '%</strong></div>';

    resultBox.hidden = false;
  });
}

function initCgpaCalculator() {
  var form = document.getElementById('cgpaForm');
  var resultBox = document.getElementById('cgpaResult');
  var errorBox = document.getElementById('cgpaError');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    hideError(errorBox);
    resultBox.hidden = true;

    var cgpa = document.getElementById('cgpaValue').value.trim();
    var multiplierInput = document.getElementById('cgpaMultiplier').value.trim();

    if (!isValidNumber(cgpa)) {
      showError(errorBox, 'Please enter a valid CGPA value.');
      return;
    }

    cgpa = parseFloat(cgpa);

    if (cgpa < 0 || cgpa > 10) {
      showError(errorBox, 'CGPA must be between 0 and 10.');
      return;
    }

    var multiplier = 9.5;

    if (multiplierInput !== '') {
      if (!isValidNumber(multiplierInput) || parseFloat(multiplierInput) <= 0) {
        showError(errorBox, 'Conversion factor must be a positive number.');
        return;
      }
      multiplier = parseFloat(multiplierInput);
    }

    var percentage = cgpa * multiplier;

    resultBox.innerHTML =
      '<h3>Result</h3>' +
      '<div class="result-line"><span>CGPA</span><strong>' + formatNumber(cgpa) + '</strong></div>' +
      '<div class="result-line"><span>Conversion Factor</span><strong>' + formatNumber(multiplier) + '</strong></div>' +
      '<div class="result-line"><span>Equivalent Percentage</span><strong>' + formatNumber(percentage) + '%</strong></div>';

    resultBox.hidden = false;
  });
}

function initAttendanceCalculator() {
  var form = document.getElementById('attendanceForm');
  var resultBox = document.getElementById('attendanceResult');
  var errorBox = document.getElementById('attendanceError');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    hideError(errorBox);
    resultBox.hidden = true;

    var attended = document.getElementById('classesAttended').value.trim();
    var held = document.getElementById('classesHeld').value.trim();
    var required = document.getElementById('requiredPercent').value.trim();

    if (!isValidNumber(attended) || !isValidNumber(held) || !isValidNumber(required)) {
      showError(errorBox, 'Please enter valid numbers in all fields.');
      return;
    }

    attended = parseFloat(attended);
    held = parseFloat(held);
    required = parseFloat(required);

    if (held <= 0) {
      showError(errorBox, 'Total classes held must be greater than 0.');
      return;
    }

    if (attended < 0) {
      showError(errorBox, 'Classes attended cannot be negative.');
      return;
    }

    if (attended > held) {
      showError(errorBox, 'Classes attended cannot be greater than total classes held.');
      return;
    }

    if (required <= 0 || required > 100) {
      showError(errorBox, 'Required attendance percentage must be between 1 and 100.');
      return;
    }

    var currentPercent = (attended / held) * 100;

    var html =
      '<h3>Result</h3>' +
      '<div class="result-line"><span>Current Attendance</span><strong>' + formatNumber(currentPercent) + '%</strong></div>' +
      '<div class="result-line"><span>Required Attendance</span><strong>' + formatNumber(required) + '%</strong></div>';

    if (currentPercent < required) {
      var reqFraction = required / 100;
      var denominator = 1 - reqFraction;

      if (denominator <= 0) {
        html += '<div class="result-line"><span>Classes Needed</span><strong>Not achievable (100% required)</strong></div>';
      } else {
        var classesNeeded = (reqFraction * held - attended) / denominator;
        classesNeeded = Math.max(0, Math.ceil(classesNeeded));

        html +=
          '<div class="result-line"><span>Status</span><strong>Below requirement</strong></div>' +
          '<div class="result-line"><span>Classes to Attend (consecutively)</span><strong>' + classesNeeded + '</strong></div>';
      }
    } else {
      var maxTotalAllowed = (attended * 100) / required;
      var canMiss = Math.floor(maxTotalAllowed - held);
      canMiss = Math.max(0, canMiss);

      html +=
        '<div class="result-line"><span>Status</span><strong>Meets requirement</strong></div>' +
        '<div class="result-line"><span>Classes You Can Still Miss</span><strong>' + canMiss + '</strong></div>';
    }

    resultBox.innerHTML = html;
    resultBox.hidden = false;
  });
}
const sgpaForm = document.getElementById("sgpaForm");
const sgpaResult = document.getElementById("sgpaResult");
const sgpaError = document.getElementById("sgpaError");

if (sgpaForm) {
  sgpaForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const credits = document.querySelectorAll(".subject-credit");
    const grades = document.querySelectorAll(".subject-grade");

    let totalCredits = 0;
    let weightedPoints = 0;

    sgpaError.hidden = true;
    sgpaResult.hidden = true;

    for (let i = 0; i < credits.length; i++) {
      const credit = parseFloat(credits[i].value);
      const grade = parseFloat(grades[i].value);

      if (
        !Number.isFinite(credit) ||
        !Number.isFinite(grade) ||
        credit <= 0 ||
        grade < 0 ||
        grade > 10
      ) {
        sgpaError.textContent =
          "Please enter valid credits and grade points (0–10) for every subject.";
        sgpaError.hidden = false;
        return;
      }

      totalCredits += credit;
      weightedPoints += credit * grade;
    }

    if (totalCredits === 0) {
      sgpaError.textContent = "Total credits must be greater than 0.";
      sgpaError.hidden = false;
      return;
    }

    const sgpa = weightedPoints / totalCredits;

    sgpaResult.innerHTML = `<strong>Your SGPA: ${sgpa.toFixed(2)}</strong>`;
    sgpaResult.hidden = false;
  });
}
