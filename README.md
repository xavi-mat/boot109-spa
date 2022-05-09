# boot109-spa
The Bridge - Exercise:

https://classroom.google.com/u/0/c/NDgwNDYwMTI2OTAz/a/NTExMTY0NjUzNDUz/details

## Description

### Authors
[Alex (@alextebbitt)](@alextebbitt) & [Xavi (@xavi-mat)](@xavi-mat)

### Technologies used
* HTML5 (only one file)
* [Bootstrap 5.1.3](https://getbootstrap.com)
* JavaScript (SPA)

### Challenge
Code a funcional quiz:
* With 10 questions
* Each question with 4 possible answers
* As a Single Page Application
* Fetching questions from an API
* Storing results in localStorage

## Screenshots

### Chart
A bar chart for the success percentage and a line chart for the failure percentage.

![Chart image](./doc/chart.png)

### Question
A question with four possible answers; only one of them is correct.

The *Next* button is faded because is disabled until the users clicks an answer.

![Question image](./doc/question.png)

### Correct answer
After giving a correct answer, the answer button is colored green, all answers
are disabled (to avoid former clicks), and the *next* button is enabled.

Also, a toast is shown reporting the success (or failure) and will be hidden in
three seconds.

![Answer Image](./doc/answer.png)

## TODO lists

### HTML, CSS
- [x] Structure of html minimal elements
- [x] Add navBar
- [x] Structure of html main containers
- [x] Add BS classes to elements
- [x] Beautify results
- [x] Spinner
- [x] Stats chart in home

### JS
- [x] Fetch data from API
- [x] Quiz functionality (questions, answers, next/back navigation)
- [x] Count right/wrong points
- [x] Show result points
- [x] Show result sentence (according to points)
- [x] Store points in localStorage
- [x] Retrieve points from localStorage
- [x] Show points in stats block
- [x] Progress bar
- [x] Toast
- [x] Spinner
- [x] Put data in chart
