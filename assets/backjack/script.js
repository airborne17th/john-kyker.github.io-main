const deck = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
const  playerHand = [];
const  dealerHand = [];
let playerValue = 0;
let dealerValue = 0;
let playerHandSize = 0;
let dealerHandSize = 0;
let dealerDisplayedValue; 
let newCard;
let newValue;
let rand;
let playerAce = false;
let dealerAce = false;
let playerScore = 0;
let double = false;

function getCardValue(card) {
  if (card === "A") return 1;
  if (["J","Q","K"].includes(card)) return 10;
  return Number(card);
}

function scoreHand(hand) {
  let total = 0;
  let aces = 0;
  for (const card of hand) {
    const value = getCardValue(card);
    if (card === "A") aces++;
    total += value;
  }
  if (aces > 0 && total + 10 <= 21) total += 10;
  return total;
}

function hit(){
    playerHand.push(dealNewCard());
    playerValue = scoreHand(playerHand);
    document.getElementById("DoubleBtn").disabled = true;
    document.getElementById("playerHand").innerHTML = playerHand;
    document.getElementById("playerValue").innerHTML = playerValue;
    if(checkBust(playerValue) == true){
        document.getElementById("gameUpdate").innerHTML = ("You Bust!");
        document.getElementById("HitBtn").disabled = true;
        document.getElementById("StandBtn").disabled = true;
        document.getElementById("DoubleBtn").disabled = true;
        document.getElementById("NewHandBtn").disabled = false;
        playerScore--;
        document.getElementById("playerScore").innerHTML = playerScore;
    }
}

function doubledown(){
    playerHand.push(dealNewCard());
    playerValue = scoreHand(playerHand);
    document.getElementById("playerHand").innerHTML = playerHand;
    document.getElementById("playerValue").innerHTML = playerValue;
    if(checkBust(playerValue) == true){
        document.getElementById("gameUpdate").innerHTML = ("You Bust!");
        document.getElementById("HitBtn").disabled = true;
        document.getElementById("StandBtn").disabled = true;
        document.getElementById("DoubleBtn").disabled = true;
        document.getElementById("NewHandBtn").disabled = false;
        playerScore--;
        playerScore--;
        document.getElementById("playerScore").innerHTML = playerScore;
    } else {
        double = true;
        stand();
    }
}



function checkBust(total){
let bust = false;
    if(total > 21){
        bust = true;
    }
    return bust;
}

function dealNewCard(){
rand = Math.floor(Math.random() * deck.length);
newCard = deck[rand];
return newCard;
}

function stand(){
    playerValue = scoreHand(playerHand);
    document.getElementById("playerHand").innerHTML = playerHand;
    document.getElementById("playerValue").innerHTML = playerValue;
    document.getElementById("HitBtn").disabled = true;
    document.getElementById("StandBtn").disabled = true;
    document.getElementById("DoubleBtn").disabled = true;
    dealerTurn();
}

function dealerTurn() {
        while(dealerValue < 17){
            dealerHand.push(dealNewCard());
            dealerValue = scoreHand(dealerHand);
            document.getElementById("dealerHand").innerHTML = dealerHand;
            document.getElementById("dealerValue").innerHTML = dealerValue;
        }
        getHandResults();
}

function getHandResults(){
    if(playerValue == 21 && playerHand.length == 2){
        document.getElementById("gameUpdate").innerHTML = ("Blackjack! Double points :3");
        playerScore++;
        playerScore++;
    } else {
        if(playerValue == dealerValue){
            document.getElementById("gameUpdate").innerHTML = ("Tie!");
        }
        if(playerValue > dealerValue || dealerValue > 21){
            document.getElementById("gameUpdate").innerHTML = ("You Win!");
            if(double == true){
                playerScore++;
                playerScore++;
            } else {
                playerScore++;
            }
        }
        if(playerValue < dealerValue && dealerValue <= 21){
            document.getElementById("gameUpdate").innerHTML = ("Sorry, you lost!");
            if(double == true){
                playerScore--;
                playerScore--;
            } else {
                playerScore--;
            }
        }
    }
    document.getElementById("playerScore").innerHTML = playerScore;
    document.getElementById("dealerHand").innerHTML = dealerHand;
    document.getElementById("dealerValue").innerHTML = dealerValue;
    document.getElementById("NewHandBtn").disabled = false;
}

function clearHand(){
    playerHand.splice(0,playerHand.length);
    dealerHand.splice(0,dealerHand.length);
    playerValue = 0;
    dealerValue = 0;
}

function newHand(){
    double = false;
    playerAce = false;
    dealerAce = false;
    dealerHand.push(dealNewCard());
    dealerHand.push(dealNewCard());
    dealerValue = scoreHand(dealerHand);
    document.getElementById("dealerHand").innerHTML = "? " + dealerHand[1];
    document.getElementById("dealerValue").innerHTML = "?";
    playerHand.push(dealNewCard());
    playerHand.push(dealNewCard());
    playerValue = scoreHand(playerHand);
    document.getElementById("playerHand").innerHTML = playerHand;
    document.getElementById("playerValue").innerHTML = playerValue;
}

function init(){
    newHand();
    playerScore = 0;
    document.getElementById("playerScore").innerHTML = playerScore;
    document.getElementById("NewHandBtn").disabled = true;
}

function reset(){
    document.getElementById("HitBtn").disabled = false;
    document.getElementById("StandBtn").disabled = false;
    document.getElementById("DoubleBtn").disabled = false;
    document.getElementById("gameUpdate").innerHTML = ("Hand Status");
    clearHand();
    newHand();
    playerScore = 0;
    document.getElementById("playerScore").innerHTML = playerScore;
}

function newDeal(){
    document.getElementById("HitBtn").disabled = false;
    document.getElementById("StandBtn").disabled = false;
    document.getElementById("DoubleBtn").disabled = false;
    document.getElementById("gameUpdate").innerHTML = ("Hand Status");
    clearHand();
    newHand();
    document.getElementById("NewHandBtn").disabled = true;
}

