// ================= LOAD RESULT DATA =================

let result = JSON.parse(localStorage.getItem("gameResult"));

if(!result){
    window.location.href="index.html";
}

// ================= DISPLAY DATA =================

document.getElementById("level").innerText = result.level;
document.getElementById("sortType").innerText = result.sortType;

document.getElementById("original").innerText =
    result.original.join(", ");

document.getElementById("correct").innerText =
    result.correct.join(", ");

document.getElementById("user").innerText =
    result.user.join(", ");

document.getElementById("accuracy").innerText =
    result.accuracy;

document.getElementById("score").innerText =
    result.score;

// ================= STATUS =================

if(result.user.length === result.correct.length){
    document.getElementById("status").innerText = "Completed";
}else{
    document.getElementById("status").innerText = "Time Out";
}

// ================= BACK BUTTON =================

function goHome(){
    window.location.href="index.html";
}