"use strict";
/**
 * Simple Page Application - Exercise
 * for The Bridge
 * by xavimat
 * 2022-05-04
 */

////////////////////////////////////////////////////////////////////////////////
// DOM Constants
const homeSect = document.getElementById("home");
const startBtn = document.getElementById("start-btn");
const statsBox = document.getElementById("stats-box");

const questionsSect = document.getElementById("question");
const questionText = document.getElementById("question-text");
const answersBox = document.getElementById("answers-box");
const nextBtn = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");
const toast = document.getElementById("toast");
const toastText = document.getElementById("toast-text");

const resultsSect = document.getElementById("results");
const gradeBox = document.getElementById("grade");
const resultMsg = document.getElementById("result-msg");
const replayBtn = document.getElementById("replay-btn");
const homeBtnResults = document.getElementById("home-btn-results");

const homeBtnNav = document.getElementById("home-btn-nav");
const spinnerBox = document.getElementById("spinner");

const ctx = document.getElementById("myChart");

// Constants
const NUM_QUESTIONS = 10;
const APIURL = `https://opentdb.com/api.php?amount=${NUM_QUESTIONS}&category=20&difficulty=hard&type=multiple`;

////////////////////////////////////////////////////////////////////////////////
// Globals
let questions;
let currentQuestionIndex;
let points = { right: 0, wrong: 0 };
let myChart;

////////////////////////////////////////////////////////////////////////////////
// Functions
function goHome() {
  hideAllSections();
  const database = getSavedData();

  // Placeholder data as stats:
  // let inn = '';

  // database.forEach((stat) => {
  //     const label = stat.date.slice(0,-3);
  //     const percent =  100 * stat.correctAnswers / (stat.incorrectAnswers + stat.correctAnswers);
  //     inn += `<li>${label}: ${percent}%</li>`;
  // });

  // if (inn === '') {
  //     inn = 'There are no stats to show.';
  // } else {
  //     inn = '<ul>' + inn + '</ul>';
  // }

  if (database.length > 0) {
    statsBox.innerHTML = ""; // if some1 has done test at least once put empty string
    showChart(database); // then show on empty array results from chart on empty string
  } else {
    statsBox.innerHTML = "There are no stats to show.";
  }

  showSection(homeSect);
}

function showChart(database) {
  // Create the data for the chart from the 'data' array
  const labels = [];
  const data = [];

  database.forEach((stat) => {
    const label = stat.date.slice(0, -3);
    const percent =
      (100 * stat.correctAnswers) /
      (stat.incorrectAnswers + stat.correctAnswers);

    labels.push(label);
    data.push(percent.toFixed(0));
  });

  // Destroy former chart, if any

  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "% of success",
          data: data,
          borderWidth: 1,
          backgroundColor: "#ffc107",
          borderRadius: 15,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
      responsive: false,
    },
  });
}

function startQuiz() {
  // hide all
  hideAllSections();
  // reinitializing variables to start quiz again
  points = { right: 0, wrong: 0 };
  currentQuestionIndex = 0;
  updateProgressBar();
  // fetch questions
  getQuestions();
}

function hideAllSections() {
  spinnerBox.classList.remove("d-none"); // shows spinner
  document
    .querySelectorAll("section")
    .forEach((sect) => sect.classList.add("d-none")); // removes all sections
}

function showSection(section) {
  // We love to see the spinner!! for one second
  setTimeout(() => {
    section.classList.remove("d-none"); // shows sections
    spinnerBox.classList.add("d-none"); // removes spinner
  }, 1000);
}

async function getQuestions() {
  try {
    const res = await axios(APIURL);
    questions = res.data.results;
    showNextQuestion();
  } catch (error) {
    goHome();
    showToast("warning", "Server is down, what a pity!");
  }
  // former versions:
  // fetch(APIURL)
  //     .then((response) => { // gets info from server, if success then we use it
  //         const data = response.json() ; // translating to readable info
  //         questions = data.results;  // assighning the results to questions variable
  //         showNextQuestion();  // perform function
  // });

  //     fetch(APIURL)  // gets the data of quiz from the api
  //         .then((resp) => resp.json()) // then waits for data to arrive, converts to an object whatever comes from json is put into the next parameter of .then
  //         .then((data) => data.results) // we chose data. data is the object with all info from api. result is the property of the info we have recieved from api
  //         // taking data as an object returns data.results. Returns only the thing we want, which is resutls not reponse_code.
  //         .then(dataResults => {  //
  //             questions = dataResults; // questions is now an array with all the questions
  //         })
  //         .then(() => {   // wait for questions to have questions then show next quesiton function
  //             showNextQuestion(); //
  //         })
  //         .catch(()=>{
  //             goHome();
  //             showToast('warning', 'Server is down, what a pity!');
  //         });
}

function showNextQuestion() {
  // get question item
  const questionItem = questions[currentQuestionIndex]; //1 element of array is taken from questions
  // put the question text
  questionText.innerHTML = questionItem.question; // question text is an element from dom(div)
  //pintar

  // empty the answers box
  while (answersBox.firstChild) {
    answersBox.removeChild(answersBox.firstChild);
  }

  // put the four answers
  const answers = [...questionItem.incorrect_answers]; //  with ... making a copy of the inncorect ansswrs array
  answers.push(questionItem.correct_answer); //add correct answer to array of inncorect answer
  shuffleArray(answers);

  answers.forEach((answer) => {
    // iterates over answerrs
    const button = document.createElement("button"); // creating new button and declaring it
    button.innerHTML = answer; // paints the four answers in the button
    button.classList.add("btn", "btn-primary", "m-1"); // makes button which are the answersblu????
    if (answer === questionItem.correct_answer) {
      button.dataset.correct = true; //dataset is a list of attributes,
    }
    button.addEventListener("click", selectAnswer);
    answersBox.appendChild(button); ///  add four question buttons to div
  });
  // activate the next button
  if (currentQuestionIndex === questions.length - 1) {
    // if user is at last question
    nextBtn.innerText = "See results";
  } else {
    nextBtn.innerText = "Next";
  }

  nextBtn.disabled = true;

  // add one to the counter
  currentQuestionIndex++;

  showSection(questionsSect);
}

function selectAnswer(ev) {
  const clickedButton = ev.target;

  clickedButton.classList.remove("btn-primary"); // Remove blue color
  recolorClickedButton(clickedButton);
  nextBtn.disabled = false; // makes next button available after selecting an answer
  disableAllAnswerButtons();
  updateProgressBar();
}

function recolorClickedButton(clickedButton) {
  if (clickedButton.dataset.correct) {
    // if button you clicked is the correct turn to green
    clickedButton.classList.add("btn-success");
    points.right++; //  add one to correct answers
    showToast("success", "Correct!");
  } else {
    clickedButton.classList.add("btn-danger"); // else turn red
    points.wrong++; // add 1 to wrong answers
    showToast("danger", "Incorrect!");
  }
}

function disableAllAnswerButtons() {
  // after selecting an answer, it disables all other answers
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

function getSavedData() {
  const usersDb = localStorage.getItem("results"); //traemos la informacion del local storage a un var
  const dataArray = JSON.parse(usersDb) || []; //creating var to store. necessary step to translate to js
  return dataArray;
}

function saveResults() {
  const database = getSavedData(); //the result of a function saved in a variable
  const resultsData = {
    date: new Date().toLocaleString("es"), // the date
    correctAnswers: points.right, // correct answers
    incorrectAnswers: points.wrong, // incorrect answers
  };
  database.push(resultsData); //pushing infoOfUsers to database array
  localStorage.setItem("results", JSON.stringify(database)); // puts data back into local storage
}

function showResults() {
  gradeBox.innerHTML = `${points.right} / ${NUM_QUESTIONS}`; // paints right
  // and wrong answers into gradebox section
  if (points.right >= 8) {
    resultMsg.innerHTML = `Well done, you scored ${points.right} correct answers and ${points.wrong} wrong answers.`;
  } else if (points.right >= 4) {
    resultMsg.innerHTML = `Not bad. you scored ${points.right} correct answers and ${points.wrong} wrong answers.`;
  } else {
    resultMsg.innerHTML = `Unfortunately, you scored ${points.right} correct answer(s) and ${points.wrong} wrong answer(s).`;
  }
  showSection(resultsSect);
}

function updateProgressBar() {
  let progress = (100 * currentQuestionIndex) / NUM_QUESTIONS; // find percentage of progress
  progress = Math.floor(progress); /// get rid of decimal points
  progressBar.style.width = `${progress}%`; // show progress bar progress
}

function showToast(color, text) {
  toastText.classList.remove("alert-success");
  toastText.classList.remove("alert-danger");
  toastText.classList.remove("alert-warning");

  toastText.innerHTML = text;
  toastText.classList.add(`alert-${color}`);

  toast.classList.add("show");

  setTimeout(hideToast, 2000);
}

function hideToast() {
  toast.classList.remove("show");
}

// /**
//  * THIS IS ANOTHER VERSION
//  * This function gets a boolean, colors the toast, puts a text and shows the toast.
//  * The color and text depend on the boolean received.
//  * true is correct, false is incorrect.
//  * @param {*} correct boolean
//  */
// function showToast(correct) {

//     if (correct) {
//         toastText.classList.remove('alert-danger');
//         toastText.classList.add('alert-success');
//         toastText.innerHTML = 'Correct!';

//     } else {
//         toastText.classList.add('alert-danger');
//         toastText.classList.remove('alert-success');
//         toastText.innerHTML = 'Incorrect!';

//     }

//     toast.classList.add('show');
// }

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
homeBtnNav.addEventListener("click", goHome);
homeBtnResults.addEventListener("click", goHome);

////////////////////////////////////////////////////////////////////////////////
// Init
goHome(); // we need this here because if not if wouldnt go back to home page
