let currentIndex = 0;
let score = 0;
let selectedAnswer = null;
let timer;
let timeLeft;

const questions = [

/* ================= FRONTEND (10) ================= */

{category:"frontend",difficulty:"easy",question:"HTML stands for?",options:["Hyper Text Markup Language","High Text","Hyperlinks","None"],correct:0},
{category:"frontend",difficulty:"easy",question:"Which language runs in browser?",options:["Python","Java","JavaScript","C++"],correct:2},
{category:"frontend",difficulty:"easy",question:"Which is CSS framework?",options:["Bootstrap","Node","MongoDB","Express"],correct:0},

{category:"frontend",difficulty:"medium",question:"Which React hook manages state?",options:["useState","useData","useEffect","useBind"],correct:0},
{category:"frontend",difficulty:"medium",question:"Which CSS property centers text?",options:["align","text-align","center","position"],correct:1},
{category:"frontend",difficulty:"medium",question:"Which is JavaScript framework?",options:["Laravel","Django","React","Flask"],correct:2},

{category:"frontend",difficulty:"hard",question:"Which lifecycle method replaced in React hooks?",options:["componentDidMount","render","useState","setState"],correct:0},
{category:"frontend",difficulty:"hard",question:"Which method converts JSON to object?",options:["JSON.parse()","JSON.stringify()","parseInt()","toString()"],correct:0},
{category:"frontend",difficulty:"hard",question:"Which CSS layout is 2D grid system?",options:["Flexbox","Grid","Float","Block"],correct:1},
{category:"frontend",difficulty:"hard",question:"Which attribute is used for routing in React?",options:["href","to","link","route"],correct:1},

/* ================= BACKEND (10) ================= */

{category:"backend",difficulty:"easy",question:"Node.js is?",options:["Runtime","Database","Framework","Language"],correct:0},
{category:"backend",difficulty:"easy",question:"Which is backend framework?",options:["Express","Bootstrap","HTML","CSS"],correct:0},
{category:"backend",difficulty:"easy",question:"Which database is NoSQL?",options:["MongoDB","MySQL","Oracle","Postgres"],correct:0},

{category:"backend",difficulty:"medium",question:"Which HTTP method is used to create data?",options:["GET","POST","DELETE","PUT"],correct:1},
{category:"backend",difficulty:"medium",question:"Which status code means Not Found?",options:["200","201","404","500"],correct:2},
{category:"backend",difficulty:"medium",question:"Which is relational DB?",options:["MongoDB","MySQL","Redis","Cassandra"],correct:1},

{category:"backend",difficulty:"hard",question:"JWT stands for?",options:["Java Web Token","JSON Web Token","JavaScript Web Token","None"],correct:1},
{category:"backend",difficulty:"hard",question:"Which protocol is stateless?",options:["HTTP","FTP","SMTP","TCP"],correct:0},
{category:"backend",difficulty:"hard",question:"Which middleware handles authentication?",options:["Auth middleware","Router","Controller","View"],correct:0},
{category:"backend",difficulty:"hard",question:"Which port is default for HTTP?",options:["80","3000","8080","443"],correct:0},

/* ================= GENERAL (10) ================= */

{category:"general",difficulty:"easy",question:"Which company created Java?",options:["Sun Microsystems","Google","Microsoft","IBM"],correct:0},
{category:"general",difficulty:"easy",question:"Which symbol is used for id in CSS?",options:["#",".","*","@"],correct:0},
{category:"general",difficulty:"easy",question:"Which device is used to connect networks?",options:["Router","Keyboard","Monitor","Mouse"],correct:0},

{category:"general",difficulty:"medium",question:"CPU stands for?",options:["Central Processing Unit","Computer Processing Unit","Core Unit","None"],correct:0},
{category:"general",difficulty:"medium",question:"Which language is object oriented?",options:["C","Java","HTML","CSS"],correct:1},
{category:"general",difficulty:"medium",question:"Which protocol sends emails?",options:["SMTP","HTTP","FTP","TCP"],correct:0},

{category:"general",difficulty:"hard",question:"Which sorting algorithm is fastest average?",options:["Bubble","Selection","QuickSort","Insertion"],correct:2},
{category:"general",difficulty:"hard",question:"Big-O of binary search?",options:["O(n)","O(log n)","O(n²)","O(1)"],correct:1},
{category:"general",difficulty:"hard",question:"Which OS is open source?",options:["Windows","Linux","MacOS","iOS"],correct:1},
{category:"general",difficulty:"hard",question:"Which layer handles encryption?",options:["Application","Transport","Presentation","Network"],correct:2}

];


const setup = document.getElementById("setup");
const quizBox = document.getElementById("quizBox");
const resultBox = document.getElementById("resultBox");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const progress = document.getElementById("progress");
const timerEl = document.getElementById("timer");
const leaderboardEl = document.getElementById("leaderboard");

document.getElementById("startBtn").onclick = startQuiz;
document.getElementById("nextBtn").onclick = nextQuestion;
document.getElementById("restartBtn").onclick = restartQuiz;

document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("light");
  document.body.classList.toggle("dark");
};

function startQuiz(){
  const cat = document.getElementById("category").value;
  const diff = document.getElementById("difficulty").value;

  filtered = questions.filter(q =>
    (cat==="all"||q.category===cat) &&
    q.difficulty===diff
  );

  if(filtered.length===0){
    alert("No Questions Found");
    return;
  }

  currentIndex=0;
  score=0;

  setup.classList.add("hidden");
  quizBox.classList.remove("hidden");

  loadQuestion(filtered);
}

let filtered=[];

function loadQuestion(list){
  const q=list[currentIndex];
  selectedAnswer=null;
  questionEl.textContent=q.question;
  optionsEl.innerHTML="";

  timeLeft = q.difficulty==="easy"?20:q.difficulty==="medium"?15:10;
  timerEl.textContent=timeLeft+"s";
  startTimer(list);

  q.options.forEach((opt,index)=>{
    const btn=document.createElement("button");
    btn.textContent=opt;
    btn.onclick=()=>{
      selectedAnswer=index;
      document.querySelectorAll("#options button")
        .forEach(b=>b.classList.remove("selected"));
      btn.classList.add("selected");
    };
    optionsEl.appendChild(btn);
  });

  progress.style.width=((currentIndex+1)/list.length)*100+"%";
}

function startTimer(list){
  clearInterval(timer);
  timer=setInterval(()=>{
    timeLeft--;
    timerEl.textContent=timeLeft+"s";
    if(timeLeft<=0){
      nextQuestion();
    }
  },1000);
}

function nextQuestion(){
  clearInterval(timer);

  if(selectedAnswer===filtered[currentIndex].correct){
    score++;
  }

  currentIndex++;

  if(currentIndex<filtered.length){
    loadQuestion(filtered);
  }else{
    showResult();
  }
}

function showResult(){
  quizBox.classList.add("hidden");
  resultBox.classList.remove("hidden");

  const percent=((score/filtered.length)*100).toFixed(1);
  document.getElementById("scoreText").textContent=`Score: ${score}/${filtered.length}`;
  document.getElementById("percentText").textContent=`Percentage: ${percent}%`;

  let grade="C";
  if(percent>=80) grade="A";
  else if(percent>=60) grade="B";

  document.getElementById("gradeText").textContent=`Grade: ${grade}`;

  updateLeaderboard(percent);
}

function updateLeaderboard(percent){
  let board=JSON.parse(localStorage.getItem("leaderboard"))||[];
  board.push(percent);
  board.sort((a,b)=>b-a);
  board=board.slice(0,5);
  localStorage.setItem("leaderboard",JSON.stringify(board));

  leaderboardEl.innerHTML="";
  board.forEach(p=>{
    const li=document.createElement("li");
    li.textContent=p+"%";
    leaderboardEl.appendChild(li);
  });
}

function restartQuiz(){
  resultBox.classList.add("hidden");
  setup.classList.remove("hidden");
}
