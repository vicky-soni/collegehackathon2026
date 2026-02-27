let settings = JSON.parse(localStorage.getItem("gameSettings"));
console.log(settings); // check in console
function generateNumbers(from, to, count) {
    let numbers = [];
    for (let i = 0; i < count; i++) {
        let randomNum = Math.floor(Math.random() * (to - from + 1)) + from;
        numbers.push(randomNum);
    }
    return numbers;
}
let randomNumbers = generateNumbers(
    settings.from,
    settings.to,
    settings.count
);
let numbersDiv = document.getElementById("numbers");
for (let i = 0; i < randomNumbers.length; i++) {
    let box = document.createElement("div");
    box.className = "numberBox";
    box.innerText = randomNumbers[i];
    numbersDiv.appendChild(box);
}