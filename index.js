// localStorage.clear();
const cards = document.querySelectorAll('.card');
const leaderboard = document.querySelector('.leaderboard');
const leaderButton = document.querySelector('.leaders-button');
const leaderboardBlock = document.querySelector('.leaderboard-block');
const closeButton = document.querySelector('.close');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let endTurns = 8;
let turns = 0;
let leaderboardText;


function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;

    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.dc === secondCard.dataset.dc;
    isMatch ? disableCards() : unflipCards();
    if (!endTurns) {
        setTimeout(() => {
            endGame();
        }, 800);
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    --endTurns;
    resetBoard();

}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 750);
    turns++;
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

(function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
})();

cards.forEach(card => card.addEventListener('click', flipCard));

function setLocalStorage() {
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

(function getLocalStorage() {
    if (localStorage.getItem('leaderboard')) {
        leaderboardText = JSON.parse(localStorage.getItem('leaderboard'));
}
})()

function endGame() {
    let name = prompt('Enter your name:', 'Joker');
    let result = `${name}: ${turns}`;
    if (leaderboardText.length < 10) {
        leaderboardText.push(result);
    }
    else {
        leaderboardText.shift();
        leaderboardText.push(result);
    }
    setLocalStorage();
    alert(`Congratulations, ${name} ! It took you ${turns} turns to finish the game`);
}

(function fillLeaderboard() {
    while (leaderboardBlock.firstChild) {
        leaderboardBlock.firstChild.remove();
    }
    if (leaderboardText == undefined || leaderboardText.length == 0) {
        leaderboardText = [];
        return;} 
    leaderboardText.forEach(element => {
        let div = document.createElement('div');
        div.innerHTML = element;
        div.classList.add('leaders-text')
        leaderboardBlock.appendChild(div);
    });
})()

leaderButton.addEventListener('click', () =>{
    leaderboard.classList.toggle('hidden');
});

closeButton.addEventListener('click', () => {
    leaderboard.classList.toggle('hidden');
});
