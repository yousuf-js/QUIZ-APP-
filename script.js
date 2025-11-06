// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCMTzuZ7bFT3icjNQWRzn1LTT4jdhUsF3E",
  authDomain: "quiz-app-dd7de.firebaseapp.com",
  databaseURL: "https://quiz-app-dd7de-default-rtdb.firebaseio.com",
  projectId: "quiz-app-dd7de",
  storageBucket: "quiz-app-dd7de.firebasestorage.app",
  messagingSenderId: "542207038857",
  appId: "1:542207038857:web:d8592e14f3184769bc3d58"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.database();

// Questions array
var questions = [
  { question: "Q1: HTML Stands for?", option1: "Hyper Text Markup Language", option2: "Hyper Tech Markup Language", option3: "Hyper Touch Markup Language", corrAnswer: "Hyper Text Markup Language" },
  { question: "CSS Stands for", option1: "Cascoding Style Sheets", option2: "Cascading Style Sheets", option3: "Cascating Style Sheets", corrAnswer: "Cascading Style Sheets" },
  { question: "Which tag is used for most large heading", option1: "<h6>", option2: "<h2>", option3: "<h1>", corrAnswer: "<h1>" },
  { question: "Which tag is used to make element unique", option1: "id", option2: "class", option3: "label", corrAnswer: "id" },
  { question: "Any element assigned with id, can be get in css", option1: "by # tag", option2: "by @ tag", option3: "by & tag", corrAnswer: "by # tag" },
  { question: "CSS can be used with ______ methods", option1: "8", option2: "3", option3: "4", corrAnswer: "3" },
  { question: "In JS variable types are ____________", option1: "6", option2: "3", option3: "8", corrAnswer: "8" },
  { question: "In array we can use key name and value", option1: "True", option2: "False", option3: "None of above", corrAnswer: "False" },
  { question: "toFixed() is used to define length of decimal", option1: "True", option2: "False", option3: "None of above", corrAnswer: "True" },
  { question: "push() method is used to add element in the start of array", option1: "True", option2: "False", option3: "None of above", corrAnswer: "False" }
];

var index = 0;
var score = 0;
var totalSecondsPerQ = 120;
var timer = null;
var remaining = totalSecondsPerQ;

// DOM elements
var quesEl, choicesWrap, nextBtn, qcountEl, progressBar, timerText, timerPath, scoreNow;

// Init after DOM load
window.addEventListener('load', function() {
  quesEl = document.getElementById("ques");
  choicesWrap = document.getElementById("choices");
  nextBtn = document.getElementById("nextBtn");
  qcountEl = document.getElementById("qcount");
  progressBar = document.getElementById("progressBar");
  timerText = document.getElementById("timerText");
  timerPath = document.getElementById("timerPath");
  scoreNow = document.getElementById("scoreNow");

  init();
});

// Initialize quiz
function init() {
  renderQuestion();
  nextBtn.addEventListener("click", () => handleNext(false));
}

// Render question
function renderQuestion() {
  clearSelection();

  if (index >= questions.length) {
    showResult();
    return;
  }

  var item = questions[index];
  quesEl.innerText = item.question; // show question as text

  choicesWrap.innerHTML = "";
  for (var i = 1; i <= 3; i++) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice-btn";
    btn.dataset.value = i;
    var letters = ["A", "B", "C"];
    btn.innerHTML = "<div class='label'>" + letters[i-1] + "</div><div class='txt'></div>";
    btn.querySelector(".txt").innerText = item["option" + i]; // ensure text shows
    btn.addEventListener("click", onChoose);
    choicesWrap.appendChild(btn);
  }

  qcountEl.textContent = "Question " + (index + 1) + " / " + questions.length;
  progressBar.style.width = Math.round((index / questions.length) * 100) + "%";

  nextBtn.disabled = true;
  nextBtn.textContent = index === questions.length - 1 ? "Finish" : "Next";
  scoreNow.textContent = score;

  resetTimer();
  startTimer();
}

// Clear selection
function clearSelection() {
  document.querySelectorAll(".choice-btn.selected").forEach(el => el.classList.remove("selected"));
  nextBtn.disabled = true;
}

// Option click
function onChoose(e) {
  clearSelection();
  e.currentTarget.classList.add("selected");
  nextBtn.disabled = false;
}

// Handle next question
function handleNext(timeUp = false) {
  var selected = document.querySelector(".choice-btn.selected");
  var chosenText = "";

  if (selected) {
    var val = Number(selected.dataset.value);
    chosenText = questions[index]["option" + val];
    if (chosenText === questions[index].corrAnswer) score++;
  } else if(timeUp){
    chosenText = "No Answer";
  }

  // Firebase push (overwrite fix)
  db.ref("quizApp/attempts").push({
    question: questions[index].question,
    options: {
      option1: questions[index].option1,
      option2: questions[index].option2,
      option3: questions[index].option3
    },
    correctAnswer: questions[index].corrAnswer,
    userSelected: chosenText,
    status: chosenText === questions[index].corrAnswer ? "Correct" : (chosenText === "No Answer" ? "Unattempted" : "Incorrect"),
    date: new Date().toLocaleString()
  });

  scoreNow.textContent = score;
  index++;
  progressBar.style.width = Math.round((index / questions.length) * 100) + "%";
  renderQuestion();
}

// Timer functions
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
      setTimeout(() => handleNext(true), 650); // auto next
    }
  }, 1000);
}

function resetTimer() {
  if(timer) { clearInterval(timer); timer=null; }
}

function updateTimerUI() {
  var mm = Math.floor(remaining / 60);
  var ss = remaining % 60;
  timerText.textContent = String(mm).padStart(2,'0') + ":" + String(ss).padStart(2,'0');

  var percent = remaining / totalSecondsPerQ;
  timerPath.style.strokeDashoffset = Math.round((1 - percent) * 100);

  if(percent < 0.25) timerPath.style.stroke = "#fb7185";
  else if(percent < 0.5) timerPath.style.stroke = "#f59e0b";
  else timerPath.style.stroke = "#60a5fa";
}

function flashTimeUp() {
  var el = document.querySelector(".timer-circle");
  if(!el) return;
  el.animate([
    {transform:'scale(1)'},
    {transform:'scale(1.06)'},
    {transform:'scale(1)'}
  ], {duration:500, easing:'ease-out'});
}

// Show result
function showResult() {
  resetTimer();
  var percent = (score / questions.length) * 100;
  var pctStr = percent.toFixed(2);

  var title = percent < 40 ? "Need Improvement" : "Good job!";
  var icon = percent < 40 ? "warning" : "success";
  var footerText = percent < 40 ? "Keep practicing — you'll get better!" : "Nice work — keep it up!";

  db.ref("quizApp/result").push({
    score: score,
    percentage: pctStr + "%",
    totalQuestions: questions.length,
    date: new Date().toLocaleString()
  });

  Swal.fire({
    title: title,
    html: "<div style='font-weight:700;font-size:1.4rem'>" + pctStr + "%</div><div style='margin-top:8px;color:#6b7280'>" + footerText + "</div>",
    icon: icon,
    confirmButtonText: 'Retake',
    showCloseButton: true,
    allowOutsideClick: false
  }).then(() => {
    index = 0;
    score = 0;
    progressBar.style.width = '0%';
    renderQuestion();
  });
}
