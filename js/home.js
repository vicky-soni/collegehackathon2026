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
    else if (Number(from) < 0)
    {
        alert("Range cannot be Less than 1");
        return;
    }
    else if (Number(to) > 50)
    {
        alert("Range cannot be greater than 50");
        return;
    }

    let fromNum = Number(from);
    let toNum = Number(to);
    let countNum = Number(count);

    if (!Number.isInteger(countNum) || countNum < 1) {
        alert("Count must be a whole number greater than or equal to 1.");
        return;
    }

    let maxUniqueIntegers = (toNum - fromNum + 1);
    if (countNum > maxUniqueIntegers) {
        alert("Count is too large for the selected range of unique numbers.");
        return;
    }

    let gameSettings = {
        from: fromNum,
        to: toNum,
        count: countNum,
        level: level,
        sort: sort
    };

    localStorage.setItem("gameSettings", JSON.stringify(gameSettings));
    window.location.href = "game.html";
};
