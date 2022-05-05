"use strict";
/**
 * Simple Page Application - Exercise
 * for The Bridge
 * by xavimat
 * 2022-05-04
 */

////////////////////////////////////////////////////////////////////////////////
// DOM Constants
const home = document.getElementById("home");
const startBtn = document.getElementById("start-btn");
const questionsSect = document.getElementById("question");
const questionText = document.getElementById("question-text");
const answersBox = document.getElementById("answers-box");
const nextBtn = document.getElementById("next-btn");
const resultsSect = document.getElementById("results");
const gradeBox = document.getElementById("grade");
const resultMsg = document.getElementById("result-msg");
const replayBtn = document.getElementById("replay-btn");

// Constants
const NUM_QUESTIONS = 2;
const APIURL =
  `https://opentdb.com/api.php?amount=${NUM_QUESTIONS}&category=20&difficulty=hard&type=multiple`;

////////////////////////////////////////////////////////////////////////////////
// Globals
let questions;
let currentQuestionIndex;
let points = {right: 0, wrong: 0};

////////////////////////////////////////////////////////////////////////////////
// Functions
function startQuiz() {
  // hide all
  hideAllSections();
  // reinitializing variables to start quiz again
  points = {right: 0, wrong: 0};
  currentQuestionIndex = 0;
  // fetch questions
  getQuestions();
}

function hideAllSections() {
    document
    .querySelectorAll("section")
    .forEach((sect) => sect.classList.add("d-none"));
}

function getQuestions() {
    // fetch(APIURL)
    //     .then((response) => { // gets info from server, if success then we use it
    //         const data = response.json() ; // translating to readable info
    //         questions = data.results;  // assighning the results to questions variable
    //         showNextQuestion();  // perform function
    // });

    fetch(APIURL)
        .then((resp) => resp.json())
        .then((data) => data.results)
        .then(dataResults => {
            questions = dataResults;
        })
        .then(()=>{
            showNextQuestion();
        });
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
  // activate the next button
  if (currentQuestionIndex === questions.length - 1) {
    nextBtn.innerText = "See results";
  } else {
    nextBtn.innerText = "Next";
  }

  nextBtn.disabled = true;

  // add one to the counter
  currentQuestionIndex++;
}

function selectAnswer(ev) {
  const clickedButton = ev.target;
  clickedButton.classList.remove("btn-primary");
  if (clickedButton.dataset.correct) {
    clickedButton.classList.add("btn-success");
    points.right++;
  } else {
    clickedButton.classList.add("btn-danger");
    points.wrong++;
  }
  nextBtn.disabled = false;
  Array.from(answersBox.children).forEach((button) => {
    button.disabled = true;
  });
}

function goNextQuestion() {

  if (currentQuestionIndex < questions.length) {
    // There are more questions:
    showNextQuestion();

  } else {
    // There are no more questions:
    hideAllSections();
    saveResults();
    showResults();
  }
}

function saveResults() {
  const usersDb = localStorage.getItem("results"); //traemos la informacion del local storage a un var
  const database = JSON.parse(usersDb) || []; //creating var to store. necessary step to translate to js

  const resultsData = {
    date: new Date(),
    correctAnswers: points.right,
    incorrectAnswers: points.wrong,
  };
  database.push(resultsData); //pushing infoOfUsers to database array
  localStorage.setItem("results", JSON.stringify(database));
}

function showResults() {

//   alert(
//     `Well done, you scored ${points.right} correct answers and ${points.wrong} wrong answers.`
//   );

    gradeBox.innerHTML = `${points.right} / ${points.right + points.wrong}`;

    if (points.right >= 8) {
        resultMsg.innerHTML = `Well done, you scored ${points.right} correct answers and ${points.wrong} wrong answers.`;
    } else if (points.right >= 4) {
        resultMsg.innerHTML = `Not bad. you scored ${points.right} correct answers and ${points.wrong} wrong answers.`;
    } else {
        resultMsg.innerHTML = `Unfortunatelly, you scored ${points.right} correct answer(s) and ${points.wrong} wrong answer(s).`;
    }
    resultsSect.classList.remove("d-none");
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
replayBtn.addEventListener("click", startQuiz);


////////////////////////////////////////////////////////////////////////////////
// Init
////////////////////////////////////////////////////////////////////////////////
//
// make two variables for the wrong and right answrers incrementing them
// show results with these numbers
//the variables will sTART EVERY TIME a users starts the quiz and will be stored in the local storage. end at the end
