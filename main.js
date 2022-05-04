"use strict";
/**
 * Simple Page Application - Exercise
 * for The Bridge
 * by xavimat
 * 2022-05-04
 */

////////////////////////////////////////////////////////////////////////////////
// Constants
// DOM
const home = document.getElementById("home");
const startBtn = document.getElementById("start-btn");
const questionsSect = document.getElementById("question");
const questionText = document.getElementById("question-text");
const answersBox = document.getElementById("answers-box");
const backBtn = document.getElementById("back-btn");
const nextBtn = document.getElementById("next-btn");
const results = document.getElementById("results");
const grade = document.getElementById("grade");
const resultMsg = document.getElementById("result-msg");
const replayBtn = document.getElementById("replay-btn");
const APIURL =
  "https://opentdb.com/api.php?amount=10&category=20&difficulty=hard&type=multiple";
////////////////////////////////////////////////////////////////////////////////
// Globals
let questions;
let currentQuestionIndex;
let right = 0;
let wrong = 0;

////////////////////////////////////////////////////////////////////////////////
// Functions
async function startQuiz() {
  // hide all
  hideAllSections();
  // fetch questions
  const data = await getQuestions();
  questions = data.results;
  console.log(questions);
  // restart counter
  currentQuestionIndex = 0;
  // call first question
  showNextQuestion();
}

function hideAllSections() {
  document
    .querySelectorAll("section")
    .forEach((sect) => sect.classList.add("d-none"));
}

function getQuestions() {
  return fetch(APIURL).then((response) => response.json());
}

function showNextQuestion() {
  // show the question section
  questionsSect.classList.remove("d-none");
  // get question item
  const questionItem = questions[currentQuestionIndex];
  // put the question text
  questionText.innerHTML = questionItem.question;
  // empty the answers box
  while (answersBox.firstChild) {
    answersBox.removeChild(answersBox.firstChild);
  }
  // put the four answers
  const answers = [...questionItem.incorrect_answers];
  answers.push(questionItem.correct_answer);
  shuffleArray(answers);

  answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer;
    button.classList.add("btn", "btn-primary", "m-1");
    if (answer === questionItem.correct_answer) {
      button.dataset.correct = true;
    }
    button.addEventListener("click", selectAnswer);
    answersBox.appendChild(button);
  });
  // activate the buttons
  if (currentQuestionIndex === 0) {
    backBtn.style.visibility = "hidden";
  } else {
    backBtn.style.visibility = "visible";
  }

  if (currentQuestionIndex === questions.length - 1) {
    nextBtn.innerText = "See results";
  } else {
    nextBtn.innerText = "Next";
  }

  backBtn.disabled = true;
  nextBtn.disabled = true;
  // add one to the counter
  currentQuestionIndex++;
}

function selectAnswer(ev) {
  const clickedButton = ev.target;
  clickedButton.classList.remove("btn-primary");
  if (clickedButton.dataset.correct) {
    clickedButton.classList.add("btn-success");
    right = right + 1;
  } else {
    clickedButton.classList.add("btn-danger");
    wrong = wrong + 1;
  }
  backBtn.disabled = false;
  nextBtn.disabled = false;
  Array.from(answersBox.children).forEach((button) => {
    button.disabled = true;
  });
}

function goNextQuestion() {
  if (currentQuestionIndex < questions.length) {
    showNextQuestion();
  } else {
    hideAllSections();
    showResults();
  }
}

function showResults() {
  alert(
    `Well done, you scored ${right} correct answers and ${wrong} wrong answers.`
  );
  var usersDb = localStorage.getItem("results"); //traemos la informacion del local storage a un var
  let database = JSON.parse(usersDb); //creating var to store. necessary step to translate to js
  if (database == null) {
    database = [];
  }
  let results = {
    date: new Date(),  
    correctAnswers: right,
    incorrectAnswers: wrong,

  };
  database.push(results); //pushing infoOfUsers to database array
  localStorage.setItem("results", JSON.stringify(database));
}

function goBackQuestion() {
  if (currentQuestionIndex > 1) {
    currentQuestionIndex -= 2; // shorthand for minus 2
    showNextQuestion();
  }
}

////////////////////////////////////////////////////////////////////////////////
// Ultils
// from https://stackoverflow.com/a/12646864
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
////////////////////////////////////////////////////////////////////////////////
// Listeners

startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", goNextQuestion);
backBtn.addEventListener("click", goBackQuestion);

////////////////////////////////////////////////////////////////////////////////
// Init
////////////////////////////////////////////////////////////////////////////////
//
// make two variables for the wrong and right answrers incrementing them
// show results with these numbers
//the variables will sTART EVERY TIME a users starts the quiz and will be stored in the local storage. end at the end
