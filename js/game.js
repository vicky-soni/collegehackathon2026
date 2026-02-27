const settings = JSON.parse(localStorage.getItem("gameSettings"));

if (!settings) window.location.href = "index.html";

const from = Number(settings.from);
const to = Number(settings.to);
const count = Number(settings.count);
const level = settings.level;
const sortType = settings.sort;
let floatMode = false;
let timeLimit = 0;
document.getElementById("game-mode").innerText = "Level : " + level
document.getElementById("sort-type").innerText = "Sort : " + sortType

if (level === "Easy") timeLimit = count * 5;
if (level === "Medium") timeLimit = count * 2;
if (level === "Hard") {
    timeLimit = count * 1.5;
    floatMode = true;
}

function generateNumbers() {
    let numbers = [];

    if (floatMode) {
        for (let i = from; i <= to; i += 0.01) {
            numbers.push(parseFloat(i.toFixed(2)));
        }
    } else {
        for (let i = from; i <= to; i++) {
            numbers.push(i);
        }
    }

    if (count > numbers.length) {
        alert("Range too small for selected count.");
        window.location.href = "index.html";
    }

    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    return numbers.slice(0, count);
}

const originalNumbers = generateNumbers();

function sortNumbers(arr, ascending = true) {
    return [...arr].sort((a, b) => ascending ? a - b : b - a);
}

const correctAnswer = sortNumbers(originalNumbers, sortType === "ascending");

let expectedIndex = 0;
let userAnswer = [];
let totalClicks = 0;
let timeRemaining = timeLimit;

const container = document.getElementById("numbersContainer");
const selectedBox = document.getElementById("selectedNumbers");

function createCirclesRandom() {
    container.innerHTML = "";

    const minCircleSize = 50; 
    let circleSize = minCircleSize;
    let spacing = 10; 
    let usedPositions = [];

    let containerWidth = 800; 
    let containerHeight = 260;

    originalNumbers.forEach((num) => {

        const div = document.createElement("div");
        div.className = "number";
        div.style.width = circleSize + "px";
        div.style.height = circleSize + "px";
        div.innerText = num;

        let pos;
        let attempts = 0;
        const maxAttempts = 500;

        do {
            pos = {
                x: Math.random() * (containerWidth - circleSize),
                y: Math.random() * (containerHeight - circleSize)
            };

            const collides = usedPositions.some(p => {
                const dx = p.x - pos.x;
                const dy = p.y - pos.y;
                return Math.sqrt(dx * dx + dy * dy) < circleSize + spacing;
            });

            if (!collides) break;

            attempts++;

            if (attempts % 100 === 0) {
                containerWidth += 50;
                containerHeight += 50;
            }

        } while (attempts < maxAttempts);

        usedPositions.push(pos);

        div.style.position = "absolute";
        div.style.left = pos.x + "px";
        div.style.top = pos.y + "px";

        div.addEventListener("click", () => handleClick(div, num));

        container.appendChild(div);
    });

    container.style.width = containerWidth + "px";
    container.style.height = containerHeight + "px";
}


function handleClick(element, value) {
    totalClicks++;

    const correctValue = correctAnswer[expectedIndex];

    if (value === correctValue) {
        element.classList.add("correct");
        element.style.pointerEvents = "none";

        userAnswer.push(value);
        selectedBox.innerText = userAnswer.join(", ");

        expectedIndex++;

        if (expectedIndex === count) finishGame(true);

    } else {
        element.classList.add("wrong");

        setTimeout(() => element.classList.remove("wrong"), 300);
    }
}

function startTimer() {
    updateTimer();

    const timer = setInterval(() => {
        timeRemaining--;
        updateTimer();

        if (timeRemaining <= 0) {
            clearInterval(timer);
            finishGame(false);
        }
    }, 1000);
}

function updateTimer() {
    const m = Math.floor(timeRemaining / 60);
    const s = timeRemaining % 60;
    document.getElementById("timer").innerText =
        `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function finishGame(userFinished) {
    let accuracy = totalClicks === 0
        ? 0
        : ((count / totalClicks) * 100);

    accuracy = Math.min(accuracy, 100).toFixed(2);

    const score = Math.floor(
        accuracy * 5 + (timeRemaining > 0 ? timeRemaining : 0) * 3
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

function goHome() {
    window.location.href = "index.html";
}

createCirclesRandom();
startTimer();