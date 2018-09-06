var moveCounter = document.querySelector('.moves');
var stars = document.querySelectorAll('.fa-star');
let flipped = false;
let lock = false;
let firstCard, secondCard;
let flippedCards = [];
let matched = [];
let clockOff = true;
var reload = document.querySelector('.restart');
reload.addEventListener('click', restart);

//unshuffled deck
const deck = document.querySelector('.deck');

//array of icons
const cards = Array.from(document.querySelectorAll('.deck li'));


//start clock at first deck click 
deck.addEventListener('click', event => {
    const clickTarget = event.target;
    if (clickTarget) {
        if (clockOff) {
            startClock();
            clockOff = false;
        }
    }
})

function restart() {
    var i;
    for (i = 0; i < cards.length; i++) {
        cards[i].className = 'card';
    }
    totalMoves.innerHTML = "";
    totalTime.innerHTML = "";
    totalScore.innerHTML = "";
    refresh();
}

//shuffle deck, reset score, reset stars, reset moves 
function refresh() {

    //make each card clickable
    cards.forEach(card => card.addEventListener('click', flipCard));

    //creates array of shuffled cards
    let shuffled = shuffle(cards);

    //adds HTML for shuffled cards to the deck
    for (card of shuffled) {
        deck.appendChild(card);
    }

    //    Shuffle function from http://stackoverflow.com/a/2450976
    function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    matched = [];

    //reset moves
    moves = 0;
    moveCounter.innerHTML = moves;

    //reset stars
    for (var i = 0; i < stars.length; i++) {
        stars[i].style.visibility = 'visible';
    }

    //reset timer
    seconds = 0;
    minutes = 0;
    clock.innerHTML = '0 min 0 secs';
    clockOff = true;
}

var totalMoves = document.querySelector('.total-moves');
var totalScore = document.querySelector('.total-score');
var totalTime = document.querySelector('.time');


//info to printo to modal
function gameStats() {
    var yourMoves = document.querySelector('.moves').innerHTML;

    var starScore = document.querySelector('.stars').innerHTML;

    var clockTime = clock.innerHTML;

    totalMoves.innerHTML = `Moves = ${yourMoves}`;
    totalTime.innerHTML = `Time = ${clockTime}`;
    totalScore.innerHTML = `Score = ${starScore}`;
}

var clock = document.querySelector('.timer');
var seconds = 0;
var minutes = 0;
var ticker;
//start game timer

function startClock() {

    ticker = setInterval(function () {
        clock.innerHTML = minutes + " min " + seconds + " secs";
        seconds++;
        if (seconds == 60) {
            minutes++;
            seconds = 0;
        }
    }, 1000);
}

//stop game timer
function stopClock() {
    clearInterval(ticker);
}

let moves = 0;

//add moves to move counter and remove stars 
function addMove() {
    moves++;
    moveCounter.innerHTML = moves;

    if (moves > 10 && moves < 16) {
        for (i = 0; i < 3; i++) {
            if (i > 1) {
                stars[i].style.visibility = "collapse";
            }
        }
    } else if (moves > 15) {
        for (i = 0; i < 3; i++) {
            if (i > 0) {
                stars[i].style.visibility = "collapse";
            }
        }
    }
}

//flip cards on click
function flipCard() {
    if (lock) return;
    if (this === firstCard) return;

    this.classList.add('open', 'show');

    if (!flipped) {
        //first click
        flipped = true;
        firstCard = this;
        return;
    }
    //second click
    secondCard = this;

    addMove();

    checkMatch();
}

//shuffle the deck when page loads
document.body.onload = refresh();

document.querySelector('.close').addEventListener('click', () => {
    toggleModal();
    restart();
});

document.querySelector('.replay').addEventListener('click', () => {
    toggleModal();
    restart();
});

function toggleModal() {
    var popup = document.getElementById('popup');

    //toggle SHOW and HIDE Game Over popup
    popup.classList.toggle('show');
}

//check match, stop clock & trigger popupif 16 matched flipped cards
function checkMatch() {
    if (firstCard.firstElementChild.className === secondCard.firstElementChild.className) {

        matched.push(firstCard, secondCard);

        //match, disable click
        disable();

        //check matched array for 16 to prompt Congrats popup
        if ((matched.length) === 16) {
            stopClock();
            gameStats();
            toggleModal();
        }
    } else {
        //no match, flip card back over
        faceDown();
    }
}

//prevent double-click match
function reset() {
    [flipped, lock] = [false, false];
    [firstCard, secondCard] = [null, null];
}

//disable click for matched cards
function disable() {
    firstCard.removeEventListener('click', flipCard);
    firstCard.classList.replace('open', 'match');
    secondCard.removeEventListener('click', flipCard);
    secondCard.classList.replace('open', 'match');

    reset();
}

//flip cards over if not a match
function faceDown() {
    lock = true;
    setTimeout(() => {
        firstCard.classList.remove('open', 'show');
        secondCard.classList.remove('open', 'show');

        reset();

    }, 1000);
}