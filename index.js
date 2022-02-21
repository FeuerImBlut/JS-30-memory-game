const cards = document.querySelectorAll('.card');
let leaderboardBlock = document.querySelector('.leaderboard');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let endTurns = 8;
let turns = 0;
let leaderboard;


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
    localStorage.setItem('leaderboard', leaderboard);
}

(function getLocalStorage() {
    if (localStorage.getItem('leaderboard')) {
        leaderboard = localStorage.getItem('leaderboard');
    }
})()

function endGame() {
    let name = prompt('Enter your name:', 'Joker');
    let result = `${name}: ${turns}`;
    if (leaderboard.length < 10) {
        leaderboard.push(result);
    }
    else {
        leaderboard.shift();
        leaderboard.push(result);
    }
    setLocalStorage();
    alert(`Congratulations, ${name} ! It took you ${turns} turns to finish the game`);
}

// window.addEventListener('beforeunload', setLocalStorage);
// window.addEventListener('load', getLocalStorage);

(function fillLeaderboard() {
    while (leaderboardBlock.firstChild) {
        leaderboardBlock.firstChild.remove();
    }
    if (leaderboard.length) {
        leaderboard = [];
        return;} 
    leaderboard.forEach(element => {
        let div = document.createElement('div');
        div.innerHTML = element;
        leaderboardBlock.appendChild(div);
    });
})()

endGame();

