// Baccarat (Punto Banco rules)
// by Riku Vakkuri

// Card variables
let suits = ["♠", "♥", "♦", "♣"];
let values = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];

// DOM variables
let welcomeMessage = document.getElementById('welcome-message'),
    ruleInfo = document.getElementById('rule-info'),
    payoutInfo = document.getElementById('payout-info'),
    playerCardInfo = document.getElementById('playerCard-info'),
    bankerCardInfo = document.getElementById('bankerCard-info'),
    naturalInfo = document.getElementById('natural-info'),
    winningHand = document.getElementById('winning-hand'),
    winningInfo = document.getElementById('winning-info'),
    newGameButton = document.getElementById('new-game-button'),
    playerButton = document.getElementById('player-button'),
    bankerButton = document.getElementById('banker-button'),
    tieButton = document.getElementById('tie-button'),
    takeCardButton = document.getElementById('takeCard-button');
    nextButton = document.getElementById('next-button');
    showCardButton = document.getElementById('showCard-button');

// Game variables
let gameStart = false,
    gameOver = false,
    playerNatural = false,
    bankerNatural = false,
    money = 100,
    bet = 0,
    bankerCards = [],
    playerCards = [],
    bankerPoints = 0,
    playerPoints = 0,
    deck = [], deck2=[], deck3=[], deck4=[], deck5=[], deck6=[], deck7=[], deck8=[]; // one deck of cards
    shoe = []; // consists of 8 decks shuffled together

// Let's create the decks and shoe here, at the very beginning
deck = createDeck();
deck2 = deck3 = deck4 = deck5 = deck6 = deck7 = deck8 = deck.slice(0);
shoe = createShoe();
shuffle(shoe);

playerButton.style.display = 'none';
bankerButton.style.display = 'none';
tieButton.style.display = 'none';
takeCardButton.style.display = 'none';
nextButton.style.display = 'none';
showCardButton.style.display = 'none';
welcomeToBaccarat();

newGameButton.addEventListener('click', function() {
    clearText();
    resetGameVariables();
    newGameButton.style.display = 'none';
    playerButton.style.display = 'inline';
    bankerButton.style.display = 'inline';
    tieButton.style.display = 'inline';
    gameStart = true;
    moneyAmount(money);
    ruleInfo.innerHTML = "Punto Banco rules are used for this game.";
    payoutInfo.innerText = "Payouts: Player 2:1, Banker 2:1, Tie 8:1.\nWhich one you wanna bet on?";
    checkIfBroke(money);
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

    bet = prompt("Place your bet.\n\nTable limits: min 10 EUR, max 5000 EUR", "100");
    bet = Math.trunc(parseInt(bet));
    console.log(bet);
    if (bet == null || bet == "") {
        dealerSays = "You must place a bet, if you wish to stay at my table.";
        ruleInfo.innerHTML = dealerSays;
        payoutInfo.innerHTML = "";
    }
    else if (isNaN(bet)) {
        dealerSays = "You cannot play here with that attitude.";
        money = 0;
        moneyAmount(money);
        ruleInfo.innerHTML = dealerSays;
        payoutInfo.innerText = "I took all your money for that behavior. Get lost!";
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
        dealerSays = "Not enough cash to make that bet."
        ruleInfo.innerHTML = dealerSays;
        payoutInfo.innerHTML = "";
    }
    else {
    dealerSays = "You bet " + bet + " EUR on " + betTarget + ".";
    money = money - bet;
    moneyAmount(money);
    ruleInfo.innerHTML = dealerSays;
    payoutInfo.innerHTML = "";
    playerButton.style.display = 'none';
    bankerButton.style.display = 'none';
    tieButton.style.display = 'none';
    baccaratGame();
    return bet;
    }
}

function moneyAmount(money) {
    dealerSaysMoney = "You have " + money + " EUR.";
    welcomeMessage.innerHTML = dealerSaysMoney;
}

function tellWhatCard(card) {
    return card.value + card.suit;
}

function takeCardFromShoe() {
    return shoe.shift();
}

function baccaratGame() {
    playerCards = [ takeCardFromShoe(), takeCardFromShoe()];
    bankerCards = [ takeCardFromShoe(), takeCardFromShoe()];
    calculateValues();
    checkIfOverTen();
    takeCardButton.style.display = 'inline';
}

takeCardButton.addEventListener('click', function() {
    if (secondPress == false) {
        secondPress = true;
        let showPlayerCards = "";
        for (let i = 0; i < playerCards.length; i++) {
            showPlayerCards += tellWhatCard(playerCards[i]) + " ";
        }
        let showBankerCards = "";
        for (let i = 0; i < bankerCards.length; i++) {
            showBankerCards += tellWhatCard(bankerCards[i]) + " ";
        }
        playerCardInfo.innerText = "\nPlayer hand: " + showPlayerCards + "\nPoints: " + playerPoints;
        bankerCardInfo.innerText = "Banker hand: " + showBankerCards + "\nPoints: " + bankerPoints;
        checkNatural(); // Natural rule overrides all other rules
        if (playerNatural == false && bankerNatural == false) { // Check if Player stands. Only if natural rule not in effect.
            checkPlayerStand();
            return;
        }
    }
    else if (secondPress == true) {
        takeMoreCards();
        return;
    }
});

nextButton.addEventListener('click', function() {
    naturalInfo.innerHTML = "";
    endGame();
});

function welcomeToBaccarat() {
    if (!gameStart) {
        welcomeMessage.innerHTML = "Welcome to Riku's Baccarat!";
        ruleInfo.innerHTML = " ";
        payoutInfo.innerHTML = " ";
        return;
    }
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
function calculateValues() {
    playerPoints = 0;
    bankerPoints = 0;
    for (let i = 0; i < playerCards.length; i++) {
        playerPoints += getCardNumericValue(playerCards[i]);
    }
    for (let i = 0; i < bankerCards.length; i++) {
        bankerPoints += getCardNumericValue(bankerCards[i]);
    }
    return playerPoints, bankerPoints;
}
function checkIfOverTen() {
    if (playerPoints > 9) {
        playerPoints -= 10; // if the score is 10 or more, drop the first digit.
    }
    if (bankerPoints > 9) {
        bankerPoints -= 10;
    }
    return;
}

function checkNatural() {
    if (playerPoints == 8 || playerPoints == 9) {
        naturalInfo.innerHTML = "Player is dealt a natural.";
        playerNatural = true;
        gameOver = true;
        takeCardButton.style.display = 'none';
        nextButton.style.display = 'inline';
    }
    if (bankerPoints == 8 || bankerPoints == 9) {
        naturalInfo.innerHTML = "Banker is dealt a natural.";
        bankerNatural = true;
        gameOver = true;
        takeCardButton.style.display = 'none';
        nextButton.style.display = 'inline';
    }
    if (playerNatural == true && bankerNatural == true) {
        naturalInfo.innerHTML = "Both Player and Banker were dealt a natural.";
        takeCardButton.style.display = 'none';
        nextButton.style.display = 'inline';
    }
    return;
}

function checkPlayerStand() {
    if (playerPoints == 6 || playerPoints == 7) { // player stands with 6 or 7
        playerStands = true;
        naturalInfo.innerHTML = "Player stands.";
    }
    else {
        playerStands = false;
    }
    return;
}

function bankerTakesThirdCard() {
    bankerCards.push(takeCardFromShoe());
    calculateValues();
    checkIfOverTen();
    showBankerCards = "";
    for (let i = 0; i < bankerCards.length; i++) {
        showBankerCards += tellWhatCard(bankerCards[i]) + " ";
    }
    bankerCardInfo.innerText = "Banker hand: " + showBankerCards + "\nPoints: " + bankerPoints;
    showCardButton.style.display = 'none';
    gameOver = true;
    return;
}

function playerTakesThirdCard() {
    playerCards.push(takeCardFromShoe());
    calculateValues();
    checkIfOverTen();
    playerThirdCardValue = playerCards[2].value;
    showPlayerCards = "";
    for (let i = 0; i < playerCards.length; i++) {
        showPlayerCards += tellWhatCard(playerCards[i]) + " ";
    }
    playerCardInfo.innerText = "\nPlayer hand: " + showPlayerCards + "\nPoints: " + playerPoints;
    showCardButton.style.display = 'none';
    return playerThirdCardValue;
}

showCardButton.addEventListener('click', function() {
    if (bankerThirdCard == true) {
        bankerTakesThirdCard();
        gameOver = true;
        takeCardButton.style.display = 'none';
        nextButton.style.display = 'inline';
    }
    if (playerThirdCard == true) {
        playerTakesThirdCard();
        takeCardButton.style.display = 'inline';
        nextButton.style.display = 'none';
    }
    naturalInfo.innerHTML = "";
    return;
});

function takeMoreCards() {
    if (playerThirdCard == false) {
        if (playerStands == true) { // Player stands with 6 or 7
            if (bankerPoints == 6 || bankerPoints == 7) { // if banker has 6 or 7, he stands.
                naturalInfo.innerHTML = "Player stands. Banker also decides to stand."
                gameOver = true;
                takeCardButton.style.display = 'none';
                nextButton.style.display = 'inline';
                return;
            }
            else if (bankerPoints <= 5) { // Banker takes a 3rd card if his hand value is 5 or under.
                naturalInfo.innerHTML = "Banker takes a third card."
                bankerThirdCard = true;
                bankerTakesThirdCard();
                takeCardButton.style.display = 'none';
                nextButton.style.display = 'inline';
                return;
            }
        }
        else if (playerStands == false) {
            if (playerPoints <= 5) { // Player automatically hits if his hand value is 5 or under.
                naturalInfo.innerHTML = "Player is given a third card. Click OK to continue."
                playerThirdCard = true;
                takeCardButton.style.display = 'none';
                showCardButton.style.display = 'inline';
                return;
            }
        }
    }
    if (playerThirdCard == true) {
        if (bankerPoints == 0 || bankerPoints == 1 || bankerPoints == 2) {
            naturalInfo.innerHTML = "Banker takes a third card."
            bankerThirdCard = true;
            bankerTakesThirdCard();
            takeCardButton.style.display = 'none';
            nextButton.style.display = 'inline';
            return;
        }
        else if (bankerPoints == 3) {
            if (playerThirdCardValue != 8) { // Banker takes a 3rd card if Player's third card is 0-1-2-3-4-5-6-7-9 (not 8) 
                naturalInfo.innerHTML = "Banker takes a third card."
                bankerThirdCard = true;
                bankerTakesThirdCard();
                takeCardButton.style.display = 'none';
                nextButton.style.display = 'inline';
                return;
            }
            else if (playerThirdCardValue == 8) { // If Player 3rd card value is 8, Banker stands.
                naturalInfo.innerHTML = "Banker stands."
                gameOver = true;
                takeCardButton.style.display = 'none';
                nextButton.style.display = 'inline';
                return;
            }
        }
        else if (bankerPoints == 4) {
            if (playerThirdCardValue >= 2 && playerThirdCardValue <= 7) { // Player's 3rd card is 2-3-4-5-6-7
                naturalInfo.innerHTML = "Banker takes a third card."
                bankerThirdCard = true;
                bankerTakesThirdCard();
                takeCardButton.style.display = 'none';
                nextButton.style.display = 'inline';
                return;
            }
            else {
                naturalInfo.innerHTML = "Banker stands."
                gameOver = true;
                takeCardButton.style.display = 'none';
                nextButton.style.display = 'inline';
                return;
            }
        }
        else if (bankerPoints == 5) {
            if (playerThirdCardValue >=4 && playerThirdCardValue <= 7) { // Player 3rd card value 4-5-6-7
                naturalInfo.innerHTML = "Banker takes a third card."
                bankerThirdCard = true;
                bankerTakesThirdCard();
                takeCardButton.style.display = 'none';
                nextButton.style.display = 'inline';
                return;
            }
            else {
                naturalInfo.innerHTML = "Banker stands."
                gameOver = true;
                takeCardButton.style.display = 'none';
                nextButton.style.display = 'inline';
                return;
            }
        }
        else if (bankerPoints == 6) {
            if (playerThirdCardValue == 6 || playerThirdCardValue == 7) {
                naturalInfo.innerHTML = "Banker takes a third card."
                bankerThirdCard = true;
                bankerTakesThirdCard();
                takeCardButton.style.display = 'none';
                nextButton.style.display = 'inline';
                return;
            }
            else {
                naturalInfo.innerHTML = "Banker stands."
                gameOver = true;
                takeCardButton.style.display = 'none';
                nextButton.style.display = 'inline';
                return;
            }
        }
        else if (bankerPoints == 7) {
            naturalInfo.innerHTML = "Banker stands."
            gameOver = true;
            takeCardButton.style.display = 'none';
            nextButton.style.display = 'inline';
            return;
        }
    }
    return;
}

function endGame() {
    if (gameOver == true) {
        if (playerPoints > bankerPoints) {
            if (betTarget == "the Player hand") {
                winningHand.innerHTML = "Winning hand: PLAYER";
                winningInfo.innerHTML = "Congratulations, you win " + bet * 2 + " EUR!";
                money += bet * 2;
            }
            else if (betTarget == "the Banker hand") {
                winningHand.innerHTML = "Winning hand: PLAYER";
                winningInfo.innerHTML = "You lose " + bet + " EUR.\nBetter luck next time!";
            }
            else if (betTarget == "Tie") {
                winningHand.innerHTML = "Winning hand: PLAYER";
                winningInfo.innerHTML = "You lose " + bet + " EUR.\nBetter luck next time!";
            }
        }
        if (playerPoints < bankerPoints) {
            if (betTarget == "the Player hand") {
                winningHand.innerHTML = "Winning hand: BANKER";
                winningInfo.innerText = "You lose " + bet + " EUR.\nBetter luck next time!";
            }
            else if (betTarget == "the Banker hand") {
                winningHand.innerHTML = "Winning hand: BANKER";
                winningInfo.innerHTML = "Congratulations, you win " + bet * 2 + " EUR!";
                money += bet * 2;
            }
            else if (betTarget == "Tie") {
                winningHand.innerHTML = "Winning hand: BANKER";
                winningInfo.innerText = "You lose " + bet + " EUR.\nBetter luck next time!";
            }
        }
        if (playerPoints == bankerPoints) {
            if (betTarget == "the Player hand") {
                winningHand.innerText = "It\'s a Tie!\nYou get your money back.";
                money += bet;
            }
            else if (betTarget == "the Banker hand") {
                winningHand.innerText = "It\'s a Tie!\nYou get your money back.";
                money += bet;
            }
            else if (betTarget == "Tie") {
                winningHand.innerText = "It\'s a Tie!\nYou win " + bet * 8 + " EUR.";
                money += bet * 8;
            }
        }
        ruleInfo.innerHTML = "\xa0";
        moneyAmount(money);
        nextButton.style.display = 'none';
        newGameButton.style.display = 'inline';
    }
}

function clearText() {
    playerCardInfo.innerHTML = "";
    bankerCardInfo.innerHTML = "";
    winningHand.innerHTML = "";
    winningInfo.innerHTML = "";
}

function resetGameVariables() {
    bankerPoints = 0;
    playerPoints = 0;
    gameOver = false,
    playerNatural = false,
    bankerNatural = false,
    playerStands = false,
    secondPress = false, // This is for Take Card -button to check later if it is already pressed
    playerThirdCard = false,
    bankerThirdCard = false,
    bet = 0,
    bankerCards = [],
    playerCards = [];
}

function checkIfBroke(money) {
    if (money == 0) {
        ruleInfo.innerText = "Where is your money, sir?\nYou cannot play here if you\'re broke.";
        payoutInfo.innerText = "Please leave the casino immediately!";
        playerButton.style.display = 'none';
        bankerButton.style.display = 'none';
        tieButton.style.display = 'none';
    }
}
