document.getElementById("playBtn").onclick = function () {

    let from = document.getElementById("from").value;
    let to = document.getElementById("to").value;
    let count = document.getElementById("count").value;
    let level = document.getElementById("level").value;
    let sort = document.getElementById("sortType").value;

    if (from === "" || to === "" || count === "") {
        alert("Please fill all fields!");
        return;
    }

    if (Number(from) >= Number(to)) {
        alert("Range is invalid!");
        return;
    }

    let gameSettings = {
        from: Number(from),
        to: Number(to),
        count: Number(count),
        level: level,
        sort: sort
    };

    localStorage.setItem("gameSettings", JSON.stringify(gameSettings));

    window.location.href = "game.html";
};