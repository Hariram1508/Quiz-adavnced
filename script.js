let questions = [

  {
    type: "single",
    question: "Which language runs in browser?",
    options: ["Python","Java","JavaScript","C++"],
    correct: 2
  },

  {
    type: "multi",
    question: "Select JavaScript frameworks",
    options: ["React","Angular","Laravel","Vue"],
    correct: [0,1,3]
  },

  {
    type: "single",
    question: "Which is CSS framework?",
    options: ["Node","Bootstrap","MongoDB","Express"],
    correct: 1
  },

  {
    type: "single",
    question: "Which company developed Java?",
    options: ["Sun Microsystems","Microsoft","Google","IBM"],
    correct: 0
  },

  {
    type: "single",
    question: "Which is backend runtime?",
    options: ["React","Node.js","HTML","CSS"],
    correct: 1
  },

  {
    type: "multi",
    question: "Select frontend technologies",
    options: ["HTML","CSS","Python","JavaScript"],
    correct: [0,1,3]
  }

];

let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;
let selectedAnswers = [];

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");
const timerEl = document.getElementById("timer");
const resultContainer = document.getElementById("resultContainer");
const scoreText = document.getElementById("scoreText");
const bestScoreText = document.getElementById("bestScoreText");
const progressFill = document.getElementById("progressFill");

document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("light");
};

function shuffleQuestions() {
  questions.sort(() => Math.random() - 0.5);
}

function loadQuestion() {

  clearInterval(timer);
  timeLeft = 15;
  timerEl.textContent = "Time: " + timeLeft;

  const q = questions[currentIndex];
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";
  selectedAnswers = [];

  q.options.forEach((option,index) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => selectAnswer(index, btn);
    optionsEl.appendChild(btn);
  });

  progressFill.style.width =
    ((currentIndex+1)/questions.length)*100 + "%";

  startTimer();
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = "Time: " + timeLeft;

    if (timeLeft <= 0) {
      showCorrectAnswer();
      setTimeout(nextQuestion, 1500);
    }

  },1000);
}

function selectAnswer(index, button) {

  const q = questions[currentIndex];

  if (q.type === "multi") {

    if (selectedAnswers.includes(index)) {
      selectedAnswers = selectedAnswers.filter(i => i !== index);
      button.classList.remove("selected");
    } else {
      selectedAnswers.push(index);
      button.classList.add("selected");
    }

  } else {
    selectedAnswers = [index];
    const buttons = optionsEl.querySelectorAll("button");
    buttons.forEach(btn => btn.classList.remove("selected"));
    button.classList.add("selected");

    showCorrectAnswer();
    setTimeout(nextQuestion, 1200);
  }
}

function showCorrectAnswer() {

  const q = questions[currentIndex];
  const buttons = optionsEl.querySelectorAll("button");

  if (q.type === "single") {

    buttons.forEach((btn,index) => {

      if (index === q.correct) {
        btn.classList.add("correct");
      } else if (selectedAnswers[0] === index) {
        btn.classList.add("wrong");
      }

    });

    if (selectedAnswers[0] === q.correct) score++;
  }

  if (q.type === "multi") {

    buttons.forEach((btn,index) => {

      if (q.correct.includes(index)) {
        btn.classList.add("correct");
      }

      if (selectedAnswers.includes(index) &&
          !q.correct.includes(index)) {
        btn.classList.add("wrong");
      }

    });

    if (JSON.stringify(selectedAnswers.sort()) ===
        JSON.stringify(q.correct.sort())) {
      score++;
    }

    setTimeout(nextQuestion, 1500);
  }
}

function nextQuestion() {

  clearInterval(timer);
  currentIndex++;

  if (currentIndex < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function showResult() {

  document.querySelector(".quiz-container").classList.add("hidden");
  resultContainer.classList.remove("hidden");

  scoreText.textContent =
    `Your Score: ${score} / ${questions.length}`;

  let bestScore = localStorage.getItem("bestScore") || 0;

  if (score > bestScore) {
    localStorage.setItem("bestScore", score);
    bestScore = score;
  }

  bestScoreText.textContent =
    `Best Score: ${bestScore}`;
}

function restartQuiz() {
  currentIndex = 0;
  score = 0;
  shuffleQuestions();
  document.querySelector(".quiz-container").classList.remove("hidden");
  resultContainer.classList.add("hidden");
  loadQuestion();
}

nextBtn.addEventListener("click", showCorrectAnswer);

shuffleQuestions();
loadQuestion();
