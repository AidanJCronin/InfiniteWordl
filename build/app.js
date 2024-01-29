import { WORDS } from "./words.js";
import { FIVEWORDS } from "./fivewords.js";
import { FOURWORDS } from "./fourwords.js";
import { SIXWORDS } from "./sixwords.js";

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let wordSize = 5;
let nextLetter = 0;
let rightGuessString = FIVEWORDS[Math.floor(Math.random() * FIVEWORDS.length)];

console.log(rightGuessString);

function initBoard() {
  let board = document.getElementById("game-board");

  board.innerHTML = "";

  for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
    let row = document.createElement("div");
    row.className = "letter-row";

    for (let j = 0; j < wordSize; j++) {
      let box = document.createElement("div");
      box.className = "letter-box";
      row.appendChild(box);
    }

    board.appendChild(row);
  }
}

function shadeKeyBoard(letter, color) {
  for (const elem of document.getElementsByClassName("keyboard-button")) {
    if (elem.textContent === letter) {
      let oldColor = elem.style.backgroundColor;
      if (oldColor === "#538d4e") {
        return;
      }

      if (oldColor === "#b59f3b" && color !== "#538d4e") {
        return;
      }

      elem.style.backgroundColor = color;
      break;
    }
  }
}

function deleteLetter() {
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
  let box = row.children[nextLetter - 1];
  box.textContent = "";
  box.classList.remove("filled-box");
  currentGuess.pop();
  nextLetter -= 1;
}

function checkGuess() {
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
  let guessString = "";
  let rightGuess = Array.from(rightGuessString);

  for (const val of currentGuess) {
    guessString += val;
  }

  if (guessString.length != wordSize) {
    toastr.error("Not enough letters!");
    return;
  }

  if (!WORDS.includes(guessString)) {
    toastr.error("Word not in list!");
    return;
  }

  var letterColor = ["#2b2a33", "#2b2a33", "#2b2a33", "#2b2a33", "#2b2a33", "#2b2a33"];

  for (let i = 0; i < wordSize; i++) {
    if (rightGuess[i] == currentGuess[i]) {
      letterColor[i] = "#538d4e";
      rightGuess[i] = "#";
    }
  }

  for (let i = 0; i < wordSize; i++) {
    if (letterColor[i] == "#538d4e") continue;
    for (let j = 0; j < wordSize; j++) {
      if (rightGuess[j] == currentGuess[i]) {
        letterColor[i] = "#b59f3b";
        rightGuess[j] = "#";
      }
    }
  }

  for (let i = 0; i < wordSize; i++) {
    let box = row.children[i];
    let delay = 320 * i;
    setTimeout(() => {
      animateCSS(box, "flipInX");
      box.style.backgroundColor = letterColor[i];
      shadeKeyBoard(guessString.charAt(i) + "", letterColor[i]);
    }, delay);
  }

  if (guessString === rightGuessString) {
    toastr.success("You guessed right! Game over!");
    guessesRemaining = 0;
    return;
  } else {
    guessesRemaining -= 1;
    currentGuess = [];
    nextLetter = 0;

    if (guessesRemaining === 0) {
      toastr.error("You've run out of guesses! Game over!");
      toastr.info(`The right word was: "${rightGuessString}"`);
    }
  }
}

function insertLetter(pressedKey) {
  if (nextLetter === wordSize) {
    return;
  }
  pressedKey = pressedKey.toLowerCase();

  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
  let box = row.children[nextLetter];
  animateCSS(box, "pulse");
  box.textContent = pressedKey;
  box.classList.add("filled-box");
  currentGuess.push(pressedKey);
  nextLetter += 1;
}

const animateCSS = (element, animation, prefix = "animate__") =>
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = element;
    node.style.setProperty("--animate-duration", "0.3s");

    node.classList.add(`${prefix}animated`, animationName);

    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve("Animation ended");
    }

    node.addEventListener("animationend", handleAnimationEnd, { once: true });
  });



document.addEventListener("keyup", (e) => {
  if (guessesRemaining === 0) {
    return;
  }

  let pressedKey = String(e.key);
  if (pressedKey === "Backspace" && nextLetter !== 0) {
    deleteLetter();
    return;
  }

  if (pressedKey === "Enter") {
    checkGuess();
    return;
  }

  let found = pressedKey.match(/[a-z]/gi);
  if (!found || found.length > 1) {
    return;
  } else {
    insertLetter(pressedKey);
  }
});

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
  const target = e.target;

  if (!target.classList.contains("keyboard-button")) {
    return;
  }
  let key = target.textContent;

  if (key === "Del") {
    key = "Backspace";
  }

  document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
});

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("four-letter-mode").addEventListener("click", function () {
    switchMode(4);
  });

  document.getElementById("five-letter-mode").addEventListener("click", function () {
    switchMode(5);
  });

  document.getElementById("six-letter-mode").addEventListener("click", function () {
    switchMode(6);
  });

  function switchMode(size) {
    wordSize = size;
    restartGame();
  }

  function resetKeyboardColors() {
    const defaultColor = "rgb(129, 129, 129)";
    const keyboardButtons = document.getElementsByClassName("keyboard-button");
  
    for (const button of keyboardButtons) {
      button.style.backgroundColor = defaultColor;
    }
  }
  
  function restartGame() {
    guessesRemaining = NUMBER_OF_GUESSES;
    currentGuess = [];
    nextLetter = 0;
    rightGuessString = getRandomWord(wordSize);
    console.log(rightGuessString);
    resetKeyboardColors();
    initBoard();
  }
  
  function getRandomWord(size) {
    console.log(size);
    if (size == 4){
      return FOURWORDS[Math.floor(Math.random() * FOURWORDS.length)];
    }
    if (size == 5){
      return FIVEWORDS[Math.floor(Math.random() * FIVEWORDS.length)];
    }
    if (size == 6){
      return SIXWORDS[Math.floor(Math.random() * SIXWORDS.length)];
    }
  }

});

initBoard();
