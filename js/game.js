// ================= LOAD SETTINGS =================

let settings = JSON.parse(localStorage.getItem("gameSettings"));

if (!settings) {
    window.location.href = "index.html";
}

let from = settings.from;
let to = settings.to;
let count = settings.count;
let level = settings.level;
let sortType = settings.sort;


// ================= LEVEL RULES =================

let timeLimit;
let floatMode = false;

if (level === "Easy") {
    timeLimit = null; // No timer
}

if (level === "Medium") {
    timeLimit = count * 5;
}

if (level === "Hard") {
    timeLimit = count * 4;
    floatMode = true;
}


// ================= GENERATE UNIQUE NUMBERS =================

function generateNumbers() {

    let set = new Set();
    let maxUniqueIntegers = to - from + 1;

    if (!floatMode && count > maxUniqueIntegers) {
        throw new Error("Invalid settings: count exceeds available unique integers in range.");
    }

    let attempts = 0;
    let maxAttempts = count * 1000;

    while (set.size < count) {
        attempts++;
        if (attempts > maxAttempts) {
            throw new Error("Could not generate enough unique numbers with current settings.");
        }

        let num;

        if (floatMode) {
            num = parseFloat(
                (Math.random() * (to - from) + from).toFixed(2)
            );
        } else {
            num = Math.floor(
                Math.random() * (to - from + 1)
            ) + from;
        }

        set.add(num);
    }

    return Array.from(set);
}

let originalNumbers;
try {
    originalNumbers = generateNumbers();
} catch (error) {
    alert(error.message);
    window.location.href = "index.html";
}


// ================= BUBBLE SORT =================

function bubbleSort(arr, asc = true) {

    let a = [...arr];

    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < a.length - i - 1; j++) {

            if (asc ? a[j] > a[j + 1] : a[j] < a[j + 1]) {
                [a[j], a[j + 1]] = [a[j + 1], a[j]];
            }

        }
    }

    return a;
}

let correctAnswer = bubbleSort(
    originalNumbers,
    sortType === "ascending"
);


// ================= GAME VARIABLES =================

let expectedIndex = 0;
let userAnswer = [];
let totalClicks = 0;

let container = document.getElementById("numbersContainer");
let selectedBox = document.getElementById("selectedNumbers");


// ================= SAFE RANDOM POSITION =================

let usedPositions = [];

function getSafePosition() {

    let x, y, valid;

    do {

        valid = true;
        x = Math.random() * 800;
        y = Math.random() * 260;

        for (let pos of usedPositions) {

            let dx = pos.x - x;
            let dy = pos.y - y;

            if (Math.sqrt(dx * dx + dy * dy) < 70) {
                valid = false;
                break;
            }
        }

    } while (!valid);

    usedPositions.push({ x, y });
    return { x, y };
}


// ================= CREATE CIRCLES =================

function createCircles() {

    container.innerHTML = "";
    usedPositions = [];

    originalNumbers.forEach(num => {

        let div = document.createElement("div");
        div.className = "number";
        div.innerText = num;

        let pos = getSafePosition();
        div.style.left = pos.x + "px";
        div.style.top = pos.y + "px";

        div.onclick = function () {
            handleClick(div, num);
        };

        container.appendChild(div);

    });
}


// ================= CLICK LOGIC =================

function handleClick(element, value) {

    totalClicks++;

    let correctValue = correctAnswer[expectedIndex];

    if (value === correctValue) {

        element.classList.add("correct");
        element.onclick = null;

        userAnswer.push(value);
        selectedBox.innerText = userAnswer.join(", ");

        expectedIndex++;

        if (expectedIndex === count) {
            finishGame(true);
        }

    } else {

        element.classList.add("wrong");

        // small shake effect
        element.style.transform = "translateX(5px)";
        setTimeout(() => element.style.transform = "translateX(-5px)", 100);
        setTimeout(() => {
            element.style.transform = "translateX(0)";
            element.classList.remove("wrong");
        }, 250);
    }
}


// ================= TIMER =================

let timerInterval;
let timeRemaining = timeLimit;

function startTimer() {

    if (timeLimit === null) {
        document.getElementById("timer").innerText = "∞";
        return;
    }

    updateTimer();

    timerInterval = setInterval(() => {

        timeRemaining--;
        updateTimer();

        if (timeRemaining <= 0) {
            finishGame(false);
        }

    }, 1000);
}

function updateTimer() {

    let m = Math.floor(timeRemaining / 60);
    let s = timeRemaining % 60;

    document.getElementById("timer").innerText =
        `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}


// ================= FINISH GAME =================

function finishGame(userFinished) {

    clearInterval(timerInterval);

    // Accuracy based on minimum optimal clicks
    let accuracy = totalClicks === 0
        ? 0
        : ((count / totalClicks) * 100);

    if (accuracy > 100) accuracy = 100;

    accuracy = accuracy.toFixed(2);

    // Score formula
    let score = Math.floor(
        accuracy * 5 + (timeRemaining || 0) * 3
    );

    localStorage.setItem("gameResult", JSON.stringify({
        level,
        sortType,
        original: originalNumbers,
        correct: correctAnswer,
        user: userAnswer,
        accuracy,
        score
    }));

    window.location.href = "result.html";
}


// ================= EXIT =================

function goHome() {
    window.location.href = "index.html";
}


// ================= AUTO START =================

createCircles();
startTimer();
