"use strict";
console.log("testing");

const buttonA = document.querySelector(".A");
const buttonB = document.querySelector(".B");
const buttonC = document.querySelector(".C");
const buttonD = document.querySelector(".D");
const buttonE = document.querySelector(".E");

const modal = document.querySelector(".modal");
const scoreText = document.querySelector(".score");
function displayModal() {
  modal.style.display = "block";
}
window.onload = function () {
  displayModal();
};
function displayExit(msg) {
  document.querySelector(".heading").innerHTML = msg.head;
  document.querySelector(".desc").innerHTML = msg.desc;
  setTimeout(() => {
    modal.style.display = "block";
  }, 2000);
  document.querySelector(".btn-modal").style.display = "block";
  document.querySelector(".btn-modal").innerHTML = msg.btn;
}
//API to fetch the QUIZ Data
const quiz = async function () {
  try {
    const res = await fetch(
      "https://opentdb.com/api.php?amount=10&category=9&type=multiple"
    );
    const data = await res.json();
    return data.results;
  } catch (err) {
    console.error("Error:", err);
  }
};
const shuffle = function (arr) {
  let currentIndex = arr.length;
  let randomIndex;

  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [
      arr[randomIndex],
      arr[currentIndex],
    ];
  }
  return arr;
};

// To check IF the answer is valid and update the Score by 1
const checkAns = function (correct_ans, ans, score) {
  if (ans.innerHTML === correct_ans) {
    ans.style.background = "green";
    console.log(`Correct Answer`);
    score++;
  } else {
    console.log("Incorrect!!");
    ans.style.background = "red";
    score--;
  }
  return score;
};

const renderQuestion = (questions, i) => {
  const ques = document.querySelector(".question");
  ques.innerHTML = questions[i].question;
  let but = document.getElementsByClassName("btn-ans");
  console.log(but);
  for (let button of but) {
    button.style.background = "#d934d6";
    button.style.display = "block";
  }
  let options = questions[i].incorrect_answers;
  //Developing the Options
  options.push(questions[i].correct_answer);
  shuffle(options);
  buttonA.innerHTML = options[0];
  buttonB.innerHTML = options[1];
  buttonC.innerHTML = options[2];
  buttonD.innerHTML = options[3];
};

const waitForAns = (questions, i, score) => {
  return new Promise((resolve) => {
    buttonA.addEventListener("click", () => {
      score = checkAns(questions[i].correct_answer, buttonA, score);
      resolve(score);
    });
    buttonB.addEventListener("click", () => {
      score = checkAns(questions[i].correct_answer, buttonB, score);
      resolve(score);
    });
    buttonC.addEventListener("click", () => {
      score = checkAns(questions[i].correct_answer, buttonC, score);
      resolve(score);
    });
    buttonD.addEventListener("click", () => {
      score = checkAns(questions[i].correct_answer, buttonD, score);
      resolve(score);
    });
  });
};
// Actual Gameplay function
const game = async function () {
  const questions = await quiz();
  const length = questions.length;
  //initial score
  let score = 0;
  buttonE.addEventListener("click", () => {
    displayExit({
      head: "You Forfeit!!😒",
      desc: "Booo hooo!! 💩 ",
      btn: "Wanna Try Again ? 😎",
    });
    throw new Error("Exited!!");
  });
  try {
    //game starts
    for (let i = 0; i < length; i++) {
      scoreText.innerHTML = `Score : ${score}`;
      //Asking a question
      setTimeout(() => {
        renderQuestion(questions, i);
      }, 2000);
      //Updating Score based on Answer
      score = await waitForAns(questions, i, score);

      if (score < 0) {
        displayExit({
          head: "GAME OVER",
          desc: `Your Final Score: ${score} `,
          btn: "Try Again!",
        });

        throw new Error("Score reached negative!!!");
      } else if (score === 10) {
        displayExit({
          head: "CONGRATS!!!!🎉🎉 You Are A Quiz Champ👑",
          desc: `Your Final Score: ${score} `,
          btn: "Try Again!",
        });
      }
    }
  } catch (err) {
    console.error(err.message);
  }
};
const startGame = () => {
  document.querySelector(".heading").innerHTML = "Get Ready!!!";
  // document.querySelector(".desc").innerHTML = "Get Ready!!!";
  document.querySelector(".btn-modal").style.display = "none";
  let count = 5;
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      document.querySelector(".desc").innerHTML = `Starting in : ${count--}`;
    }, i * 1000);
  }
  setTimeout(() => {
    modal.style.display = "none";
  }, 6000);
  game();
};
