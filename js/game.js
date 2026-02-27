// =====================================
// 1️⃣ LOAD SETTINGS FROM HOME PAGE
// =====================================

let settings = JSON.parse(localStorage.getItem("gameSettings"));

let from = settings.from;
let to = settings.to;
let count = settings.count;
let level = settings.level;
let sortType = settings.sort;


// =====================================
// 2️⃣ LEVEL LOGIC
// =====================================

let timeLimit;
let floatMode = false;

if (level === "Easy") {
    timeLimit = count * 10;   // more time
}
else if (level === "Medium") {
    timeLimit = count * 6;
}
else if (level === "Hard") {
    timeLimit = count * 5;
    floatMode = true;
    to = to * 10; // complex numbers
}


// =====================================
// 3️⃣ GENERATE UNIQUE NUMBERS
// =====================================

function generateNumbers(min, max, count, floatMode) {

    let set = new Set();

    while (set.size < count) {

        let num;

        if (floatMode) {
            num = parseFloat(
                (Math.random() * (max - min) + min).toFixed(2)
            );
        } else {
            num = Math.floor(Math.random() * (max - min + 1)) + min;
        }

        set.add(num);
    }

    return Array.from(set);
}

let originalNumbers =
    generateNumbers(from, to, count, floatMode);


// =====================================
// 4️⃣ CREATE CORRECT SORTED ANSWER
// =====================================

let correctAnswer = [...originalNumbers];

if (sortType === "ascending") {
    correctAnswer.sort((a, b) => a - b);
} else {
    correctAnswer.sort((a, b) => b - a);
}


// =====================================
// 5️⃣ SHOW NUMBERS ON SCREEN
// =====================================

let container = document.getElementById("numbersContainer");
let selectedBox = document.getElementById("selectedNumbers");

// show numbers text
selectedBox.innerText = originalNumbers.join(", ");

originalNumbers.forEach(num => {

    let circle = document.createElement("div");
    circle.className = "number-circle";
    circle.innerText = num;

    // random position
    circle.style.top = Math.random() * 240 + "px";
    circle.style.left = Math.random() * 850 + "px";

    container.appendChild(circle);
});


// =====================================
// 6️⃣ TIMER SYSTEM
// =====================================

let timeRemaining = timeLimit;
let timerDisplay = document.getElementById("timer");

function formatTime(sec) {

    let m = Math.floor(sec / 60);
    let s = sec % 60;

    return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

timerDisplay.innerText = formatTime(timeRemaining);

let timer = setInterval(() => {

    timeRemaining--;
    timerDisplay.innerText = formatTime(timeRemaining);

    if (timeRemaining <= 0) {
        clearInterval(timer);
        finishGame(false); // timeout
    }

}, 1000);


// =====================================
// 7️⃣ SIMULATED USER ANSWER
// (Replace later with real user sorting)
// =====================================

let userAnswer = [...originalNumbers];


// =====================================
// 8️⃣ FINISH GAME FUNCTION
// =====================================

function finishGame(userFinished) {

    clearInterval(timer);

    let correctCount = 0;

    for (let i = 0; i < count; i++) {
        if (userAnswer[i] === correctAnswer[i]) {
            correctCount++;
        }
    }

    let accuracy =
        ((correctCount / count) * 100).toFixed(2);

    let score = 0;

    if (userFinished) {
        score = Math.floor(
            accuracy * 10 + timeRemaining * 5
        );
    }

    let resultData = {

        level: level,
        sortType: sortType,

        original: originalNumbers,
        correct: correctAnswer,
        user: userAnswer,

        accuracy: accuracy,
        score: score,

        timeLeft: timeRemaining,
        totalTime: timeLimit
    };

    localStorage.setItem(
        "gameResult",
        JSON.stringify(resultData)
    );

    window.location.href = "result.html";
}


// =====================================
// 9️⃣ EXIT BUTTON
// =====================================

function goHome() {
    window.location.href = "home.html";
}