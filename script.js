// Baccarat (Punto Banco rules)
// by Riku Vakkuri

// Card variables
let suits = ["♠", "♥", "♦", "♣"];
let values = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];

// DOM variables
let welcomeMessage = document.getElementById('welcome-message');
let ruleInfo = document.getElementById('rule-info');
let payoutInfo = document.getElementById('payout-info');
let newGameButton = document.getElementById('new-game-button');
let playerButton = document.getElementById('player-button');
let bankerButton = document.getElementById('banker-button');
let tieButton = document.getElementById('tie-button');

// Game variables
let gameStart = false,
    gameOver = false,
    gameWon = false,
    money = 100
    bankerCards = [],
    playerCards = [],
    bankerPoints = 0,
    playerPoints = 0,
    deck = [], deck2=[], deck3=[], deck4=[], deck5=[], deck6=[], deck7=[], deck8=[]; // one deck of cards
    shoe = []; // consists of 8 decks shuffled together

playerButton.style.display = 'none';
bankerButton.style.display = 'none';
tieButton.style.display = 'none';
showStatus();

newGameButton.addEventListener('click', function() {
    newGameButton.style.display = 'none';
    playerButton.style.display = 'inline';
    bankerButton.style.display = 'inline';
    tieButton.style.display = 'inline';
    gameStart = true;
    gameOver = false;
    gameWon = false;
    moneyAmount(money);
    ruleInfo.innerHTML = "Punto Banco rules are used for this game.";
    payoutInfo.innerText = "Payouts: Player 2:1, Banker 2:1, Tie 8:1.\nWhich one you wanna bet on?";
    deck = createDeck();
    console.log(deck);
    deck2 = deck3 = deck4 = deck5 = deck6 = deck7 = deck8 = deck.slice(0);
    shoe = createShoe();
    shuffle(shoe);
    console.log(shoe);
    bankerCards = [ takeCardFromShoe(), takeCardFromShoe()];
    playerCards = [ takeCardFromShoe(), takeCardFromShoe()];
    console.log(bankerCards);
    console.log(playerCards);
    showStatus();
});

playerButton.addEventListener('click', function() {
    betTarget = "the Player hand";
    bet = placeBet();
});

bankerButton.addEventListener('click', function() {
    betTarget = "the Banker hand";
    bet = placeBet();
});

tieButton.addEventListener('click', function() {
    betTarget = "Tie";
    bet = placeBet();
});

function showStatus() {
    if (!gameStart) {
        welcomeMessage.innerHTML = "Welcome to Riku's Baccarat!";
        ruleInfo.innerHTML = " ";
        payoutInfo.innerHTML = " ";
        return;
    }
}

function createDeck() {
    let deck = [];
    for (let suitIndex = 0; suitIndex < suits.length; suitIndex++) {
        for (let valueIndex = 0; valueIndex < values.length; valueIndex++) {
            let card = {
                suit: suits[suitIndex],
                value: values[valueIndex]
            };
            deck.push( card );
        }
    }
    return deck;
}

function createShoe() {
    let shoe = deck.concat(deck2).concat(deck3).concat(deck4).concat(deck5).concat(deck6).concat(deck7).concat(deck8);
    return shoe;
}

function shuffle(shoe) {
    for (let i = 0; i < shoe.length; i++) {
      let swapIdx = Math.trunc(Math.random() * shoe.length);
      let tmp = shoe[swapIdx];
      shoe[swapIdx] = shoe[i];
      shoe[i] = tmp;
    }
}

function placeBet() {

    let bet = prompt("Place your bet.\nTable limits: min 10 EUR, max 5000 EUR", "100");
    Math.trunc(parseInt(bet));
    console.log(bet);
    if (bet == null || bet == "") {
        dealerSays = "You must place a bet if you want to play at my table.";
        ruleInfo.innerHTML = dealerSays;
        payoutInfo.innerHTML = "";
    }
    else if (isNaN(bet)) {
        dealerSays = "You cannot play here with that attitude."
        money = 0;
        moneyAmount(money);
        ruleInfo.innerHTML = dealerSays;
        payoutInfo.innerText = "I take all your money for that behavior.\nGet your ass up and go fuck yourself.";
        playerButton.style.display = 'none';
        bankerButton.style.display = 'none';
        tieButton.style.display = 'none';
    } 
    else if (bet < 10 || bet > 5000 ) {
        dealerSays = "Please consider the table limits.";
        ruleInfo.innerHTML = dealerSays;
        payoutInfo.innerHTML = "";
    }
    else if (bet > money) {
        dealerSays = "Not enough cash for making that bet."
        ruleInfo.innerHTML = dealerSays;
        payoutInfo.innerHTML = "";
    }
    else {
    dealerSays = "You bet " + bet + " EUR on " + betTarget + ".";
    money = money - bet;
    console.log(money);
    moneyAmount(money);
    ruleInfo.innerHTML = dealerSays;
    payoutInfo.innerHTML = "";
    }
}

function moneyAmount(money) {
    dealerSaysMoney = "You have " + money + " EUR."
    welcomeMessage.innerHTML = dealerSaysMoney;
}

function tellWhatCard(card) {
    return card.value + card.suit;
}

function takeCardFromShoe() {
    return shoe.shift();
}

function getCardNumericValue(card) {
    switch(card.value) {
      case 'A':
        return 1;
      case '2':
        return 2;
      case '3':
        return 3;
      case '4':
        return 4;
      case '5': 
        return 5;
      case '6':
        return 6;
      case '7':
        return 7;
      case '8':
        return 8;
      case '9':
        return 9;
      default:
        return 0;
    }
  }
