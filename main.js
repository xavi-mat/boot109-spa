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
const progressBar = document.getElementById('progress-bar')
const toast = document.getElementById('toast');
const toastText = document.getElementById('toast-text');

const resultsSect = document.getElementById("results");
const gradeBox = document.getElementById("grade");
const resultMsg = document.getElementById("result-msg");
const replayBtn = document.getElementById("replay-btn");

const homeBtn = document.getElementById("home-btn");
const spinnerBox = document.getElementById('spinner');

// Constants
const NUM_QUESTIONS = 5;
const APIURL =
    `https://opentdb.com/api.php?amount=${NUM_QUESTIONS}&category=20&difficulty=hard&type=multiple`;

////////////////////////////////////////////////////////////////////////////////
// Globals
let questions;
let currentQuestionIndex;
let points = { right: 0, wrong: 0 };

////////////////////////////////////////////////////////////////////////////////
// Functions
function goHome() {
    hideAllSections();
    const database = getSavedData();

    let inn = '';

    database.forEach((stat) =>
        inn += `<li>${stat.date} . ${stat.correctAnswers} . ${stat.incorrectAnswers}</li>`
    );

    if (inn === '') {
        inn = 'There are no stats to show.';
    } else {
        inn = '<ul>' + inn + '</ul>';
    }

    statsBox.innerHTML = inn;

    showSection(homeSect);
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
    spinnerBox.classList.remove('d-none');
    document
        .querySelectorAll("section")
        .forEach((sect) => sect.classList.add("d-none"));

}

function showSection(section) {
    setTimeout(() => {
        section.classList.remove('d-none');
        spinnerBox.classList.add('d-none');
    }, 2000);
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
        .then(() => {
            showNextQuestion();
        })
        .catch(()=>{
            goHome();
            showToast('warning', 'Server is down, what a pity!');
        });
}

function showNextQuestion() {
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

    showSection(questionsSect);
}

function selectAnswer(ev) {

    const clickedButton = ev.target;

    clickedButton.classList.remove("btn-primary");  // Remove blue color
    recolorClickedButton(clickedButton);
    nextBtn.disabled = false;
    disableAllAnswerButtons();
    updateProgressBar();
}

function recolorClickedButton(clickedButton) {

    if (clickedButton.dataset.correct) {
        clickedButton.classList.add("btn-success");
        points.right++;
        showToast('success', 'Correct!');

    } else {
        clickedButton.classList.add("btn-danger");
        points.wrong++;
        showToast('danger', 'Incorrect!');
    }
}


function disableAllAnswerButtons() {
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
    const database = getSavedData();
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
    showSection(resultsSect);
}

function goBackQuestion() {
    if (currentQuestionIndex > 1) {
        currentQuestionIndex -= 2; // shorthand for minus 2
        showNextQuestion();
    }
}

function updateProgressBar() {
    let progress = 100 * currentQuestionIndex / NUM_QUESTIONS;
    progress = Math.floor(progress);
    progressBar.style.width = `${progress}%`;
}

function showToast(color, text) {

    toastText.classList.remove('alert-success');
    toastText.classList.remove('alert-danger');
    toastText.classList.remove('alert-warning');

    toastText.innerHTML = text;
    toastText.classList.add(`alert-${color}`);

    toast.classList.add('show');

    setTimeout(
        () => { toast.classList.remove('show'); },
        2000
    );
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
homeBtn.addEventListener("click", goHome);


////////////////////////////////////////////////////////////////////////////////
// Init
goHome();
