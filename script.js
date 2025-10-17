var questions = [
  { 
    question: "Q1: HTML Stands for?", 
    option1: "Hyper Text Markup Language", 
    option2: "Hyper Tech Markup Language", 
    option3: "Hyper Touch Markup Language", 
    corrAnswer: "Hyper Text Markup Language" 
  },
  { 
    question: "CSS Stands for", 
    option1: "Cascoding Style Sheets", 
    option2: "Cascading Style Sheets", 
    option3: "Cascating Style Sheets", 
    corrAnswer: "Cascading Style Sheets" 
  },
  { 
    question: "Which tag is used for most large heading", 
    option1: "&lt;h6&gt;", 
    option2: "&lt;h2&gt;", 
    option3: "&lt;h1&gt;", 
    corrAnswer: "&lt;h1&gt;" 
  },
  { 
    question: "Which tag is used to make element unique", 
    option1: "id", 
    option2: "class", 
    option3: "label", 
    corrAnswer: "id" 
  },
  { 
    question: "Any element assigned with id, can be get in css", 
    option1: "by # tag", 
    option2: "by @ tag", 
    option3: "by & tag", 
    corrAnswer: "by # tag" 
  },
  { 
    question: "CSS can be used with ______ methods", 
    option1: "8", 
    option2: "3", 
    option3: "4", 
    corrAnswer: "3" 
  },
  { 
    question: "In JS variable types are ____________", 
    option1: "6", 
    option2: "3", 
    option3: "8", 
    corrAnswer: "8" 
  },
  { 
    question: "In array we can use key name and value", 
    option1: "True", 
    option2: "False", 
    option3: "None of above", 
    corrAnswer: "False" 
  },
  { 
    question: "toFixed() is used to define length of decimal", 
    option1: "True", 
    option2: "False", 
    option3: "None of above", 
    corrAnswer: "True" 
  },
  { 
    question: "push() method is used to add element in the start of array", 
    option1: "True", 
    option2: "False", 
    option3: "None of above", 
    corrAnswer: "False" 
  }
];


var index = 0;
var score = 0;

var totalSecondsPerQ = 120;
var timer = null;
var remaining = totalSecondsPerQ;


var quesEl = document.getElementById("ques");
var choicesWrap = document.getElementById("choices");
var nextBtn = document.getElementById("nextBtn");
var qcountEl = document.getElementById("qcount");
var progressBar = document.getElementById("progressBar");
var timerText = document.getElementById("timerText");
var timerPath = document.getElementById("timerPath");
var scoreNow = document.getElementById("scoreNow");

function init() {
  renderQuestion();
  nextBtn.addEventListener("click", handleNext);
}


function renderQuestion() {
  clearSelection(); 

  if (index >= questions.length) {
    showResult();
    return;
  }

  var item = questions[index];
  quesEl.textContent = item.question;

  choicesWrap.innerHTML = "";
  for (var i = 1; i <= 3; i++) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice-btn";
    btn.dataset.value = i;
    var letters = ["A", "B", "C"];
    btn.innerHTML = "<div class='label'>" + letters[i-1] + "</div><div class='txt'>" + item["option" + i] + "</div>";
    btn.addEventListener("click", onChoose);
    choicesWrap.appendChild(btn);
  }

  qcountEl.textContent = "Question " + (index + 1) + " / " + questions.length;
  var pct = Math.round(((index) / questions.length) * 100);
  progressBar.style.width = pct + "%";

  nextBtn.disabled = true;
  nextBtn.textContent = index === questions.length - 1 ? "Finish" : "Next";

  scoreNow.textContent = score;

  resetTimer();
  startTimer();
}


function clearSelection() {
  var existing = document.querySelectorAll(".choice-btn.selected");
  existing.forEach(function(el) {
    el.classList.remove("selected");
  });

  nextBtn.disabled = true;
}


function onChoose(e) {
  clearSelection();
  var btn = e.currentTarget;
  btn.classList.add("selected");
  nextBtn.disabled = false;
}


function handleNext() {
  var selected = document.querySelector(".choice-btn.selected");
  if (selected) {
    var val = Number(selected.dataset.value);
    var chosenText = questions[index]["option" + val];
    if (chosenText === questions[index].corrAnswer) {
      score++;
    }
  }

  scoreNow.textContent = score;
  index++;
  progressBar.style.width = Math.round((index / questions.length) * 100) + "%";
  renderQuestion();
}


function startTimer() {
  remaining = totalSecondsPerQ;
  updateTimerUI();
  if (timer) clearInterval(timer);
  timer = setInterval(function() {
    remaining--;
    updateTimerUI();
    if (remaining <= 0) {
      clearInterval(timer);
      flashTimeUp();
      setTimeout(function() {
        handleNext();
      }, 650);
    }
  }, 1000);
}

function resetTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}


function updateTimerUI() {
  var mm = Math.floor(remaining / 60);
  var ss = remaining % 60;
  timerText.textContent = String(mm).padStart(2, '0') + ":" + String(ss).padStart(2, '0');

  var percent = remaining / totalSecondsPerQ;

  var dash = Math.round((1 - percent) * 100);
  timerPath.style.strokeDashoffset = String(dash);

  if (percent < 0.25) {
    timerPath.style.stroke = "#fb7185"; 
  } else if (percent < 0.5) {
    timerPath.style.stroke = "#f59e0b"; 
  } else {
    timerPath.style.stroke = "#60a5fa"; 
  }
}


function flashTimeUp() {
  var el = document.querySelector(".timer-circle");
  if (!el) return;
  el.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(1.06)' },
    { transform: 'scale(1)' }
  ], { duration: 500, easing: 'ease-out' });
}


function showResult() {
  resetTimer();

  var percent = ((score / questions.length) * 100);
  var pctStr = percent.toFixed(2);

  var title = "";
  var icon = "";
  var footerText = "";

  if (percent < 40) {
    title = "Need Improvement";
    icon = "warning";
    footerText = "Keep practicing — you'll get better!";
  } else {
    title = "Good job!";
    icon = "success";
    footerText = "Nice work — keep it up!";
  }

  Swal.fire({
    title: title,
    html: "<div style='font-weight:700;font-size:1.4rem'>" + pctStr + "%</div><div style='margin-top:8px;color:#6b7280'>" + footerText + "</div>",
    icon: icon,
    confirmButtonText: 'Retake',
    showCloseButton: true,
    allowOutsideClick: false
  }).then(function(result) {
    index = 0;
    score = 0;
    progressBar.style.width = '0%';
    renderQuestion();
  });
}

window.addEventListener('load', function() {
  init();
});
