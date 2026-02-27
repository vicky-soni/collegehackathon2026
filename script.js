function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
let num = getRandomNumber(10, 50);
console.log(num);