let result = JSON.parse(localStorage.getItem("gameResult"));

console.log(result);

document.getElementById("level").innerText = result.level;
document.getElementById("sortType").innerText = result.sortType;
document.getElementById("accuracy").innerText = result.accuracy + "%";
document.getElementById("score").innerText = result.score;
document.getElementById("timeLeft").innerText = result.timeLeft;

document.getElementById("correctAnswer").innerText = result.correctAnswer;
document.getElementById("userAnswer").innerText = result.userAnswer;