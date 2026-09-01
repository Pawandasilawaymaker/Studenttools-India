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
const addSgpaSubject = document.getElementById("addSgpaSubject");
const sgpaSubjects = document.getElementById("sgpaSubjects");

if (addSgpaSubject && sgpaSubjects) {
  addSgpaSubject.addEventListener("click", function () {
    const subjectNumber =
      sgpaSubjects.querySelectorAll(".sgpa-subject").length + 1;

    const subject = document.createElement("div");
    subject.className = "form-group sgpa-subject";

    subject.innerHTML = `
      <label>Subject ${subjectNumber}</label>
      <input type="number" class="subject-credit" placeholder="Credits" min="0" step="any" required>
      <input type="number" class="subject-grade" placeholder="Grade Point" min="0" max="10" step="any" required>
    `;

    sgpaSubjects.appendChild(subject);
  });
}
// GPA Calculator
const gpaForm = document.getElementById("gpaForm");
const gpaResult = document.getElementById("gpaResult");
const gpaError = document.getElementById("gpaError");
const addGpaSubject = document.getElementById("addGpaSubject");
const gpaSubjects = document.getElementById("gpaSubjects");

if (addGpaSubject && gpaSubjects) {
  addGpaSubject.addEventListener("click", function () {
    const number =
      gpaSubjects.querySelectorAll(".gpa-subject").length + 1;

    const subject = document.createElement("div");
    subject.className = "form-group gpa-subject";

    subject.innerHTML = `
      <label>Subject ${number}</label>
      <input type="number" class="gpa-credit" placeholder="Credits" min="0" step="any" required>
      <input type="number" class="gpa-grade" placeholder="Grade Point" min="0" max="4" step="any" required>
    `;

    gpaSubjects.appendChild(subject);
  });
}

if (gpaForm) {
  gpaForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const credits = document.querySelectorAll(".gpa-credit");
    const grades = document.querySelectorAll(".gpa-grade");

    let totalCredits = 0;
    let totalPoints = 0;

    gpaError.hidden = true;
    gpaResult.hidden = true;

    for (let i = 0; i < credits.length; i++) {
      const credit = parseFloat(credits[i].value);
      const grade = parseFloat(grades[i].value);

      if (
        !Number.isFinite(credit) ||
        !Number.isFinite(grade) ||
        credit <= 0 ||
        grade < 0 ||
        grade > 4
      ) {
        gpaError.textContent =
          "Please enter valid credits and grade points between 0 and 4.";
        gpaError.hidden = false;
        return;
      }

      totalCredits += credit;
      totalPoints += credit * grade;
    }

    if (totalCredits === 0) {
      gpaError.textContent = "Total credits must be greater than 0.";
      gpaError.hidden = false;
      return;
    }

    const gpa = totalPoints / totalCredits;

    gpaResult.innerHTML = `<strong>Your GPA: ${gpa.toFixed(2)}</strong>`;
    gpaResult.hidden = false;
  });
}
// Percentage Increase / Decrease Calculator
const percentChangeForm = document.getElementById("percentChangeForm");
const percentChangeResult = document.getElementById("percentChangeResult");
const percentChangeError = document.getElementById("percentChangeError");

if (percentChangeForm) {
  percentChangeForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const oldValue = parseFloat(document.getElementById("oldValue").value);
    const newValue = parseFloat(document.getElementById("newValue").value);

    percentChangeError.hidden = true;
    percentChangeResult.hidden = true;

    if (!Number.isFinite(oldValue) || !Number.isFinite(newValue)) {
      percentChangeError.textContent = "Please enter both values.";
      percentChangeError.hidden = false;
      return;
    }

    if (oldValue === 0) {
      percentChangeError.textContent =
        "Original Value cannot be 0.";
      percentChangeError.hidden = false;
      return;
    }

    const change = ((newValue - oldValue) / Math.abs(oldValue)) * 100;

    if (change > 0) {
      percentChangeResult.innerHTML =
        `<strong>Percentage Increase: ${change.toFixed(2)}%</strong>`;
    } else if (change < 0) {
      percentChangeResult.innerHTML =
        `<strong>Percentage Decrease: ${Math.abs(change).toFixed(2)}%</strong>`;
    } else {
      percentChangeResult.innerHTML =
        `<strong>No Percentage Change: 0%</strong>`;
    }

    percentChangeResult.hidden = false;
  });
}
