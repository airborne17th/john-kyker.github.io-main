// Global Game State
const gameState = {
    mode: 'commander', // or 'standard'
    playerCount: 4,
    initialLife: 40,
    players: [
        { id: 1, name: "Player 1", life: 40, infect: 0, active: true },
        { id: 2, name: "Player 2", life: 40, infect: 0, active: true },
        { id: 3, name: "Player 3", life: 40, infect: 0, active: false },
        { id: 4, name: "Player 4", life: 40, infect: 0, active: false }
    ]
};

function initializeSetup() {
    // 1. Get player count and update active status
    selectPlayerCount();

    // 2. Set Initial Life based on mode
    const isCommander = document.getElementById('commander').checked;
    gameState.mode = isCommander ? 'commander' : 'standard';
    gameState.initialLife = isCommander ? 40 : 20;

    // 3. Update each player in the array
    gameState.players.forEach((player, index) => {
        player.life = gameState.initialLife;
        player.infect = 0;
        // Grab names from the input fields p1name, p2name, etc.
        const nameInput = document.getElementById(`p${index + 1}name`);
        if (nameInput) player.name = nameInput.value || `Player ${index + 1}`;
    });

    document.getElementById("playerForm").hidden = true;
    updateSetup();
}

function updateSetup() {
    gameState.players.forEach((player) => {
        const id = player.id; // 1, 2, 3, or 4
        
        // Update Names and Counts
        document.getElementById(`Player${id}Name`).innerHTML = player.name;
        document.getElementById(`Player${id}LifeCount`).innerHTML = player.life;
        document.getElementById(`Player${id}InfectCount`).innerHTML = player.infect;

        // Show/Hide player container based on active status
        const container = document.getElementById(`Player${id}Life`);
        if (container) {
            container.hidden = !player.active;
        }
    });
}

function selectPlayerCount() {
    const count = parseInt(document.getElementById("pCount").value);
    gameState.playerCount = count;

    gameState.players.forEach((player, index) => {
        // If index is 0 and count is 2, (0 < 2) is true.
        // If index is 2 and count is 2, (2 < 2) is false.
        player.active = index < count;
        
        // Disable/Enable the name input fields
        const nameInput = document.getElementById(`p${index + 1}name`);
        if (nameInput) nameInput.disabled = !player.active;
    });
}

function randomBackground() {
    let random = Math.floor(Math.random() * 8);
    switch (random) {
        case 0:
            document.getElementById("bg").src = "./img/bg/angel.jpg";
            break;
        case 1:
            document.getElementById("bg").src = "./img/bg/chandra.jpg";
            break;
        case 2:
            document.getElementById("bg").src = "./img/bg/dragon.jpg";
            break;
        case 3:
            document.getElementById("bg").src = "./img/bg/eldrazi.jpg";
            break;
        case 4:
            document.getElementById("bg").src = "./img/bg/hydra.jpg";
            break;
        case 5:
            document.getElementById("bg").src = "./img/bg/jodah.jpg";
            break;
        case 6:
            document.getElementById("bg").src = "./img/bg/rainbow.jpg";
            break;
        case 7:
            document.getElementById("bg").src = "./img/bg/wings.jpg";
            break;
    }
}

function changeLife(playerIndex, amount) {
    gameState.players[playerIndex].life += amount;
    updateSetup(); // Re-render the screen
}

function changeInfect(playerIndex, amount) {
    const player = gameState.players[playerIndex];
    player.infect += amount;
    
    // Prevent negative infect
    if (player.infect < 0) player.infect = 0;
    
    updateSetup();
}

function playerConcede(playerIndex) {
    if (confirm("Are you sure?")) {
        gameState.players[playerIndex].life = 0;
        updateSetup();
    }
}

function Reset() {
    gameState.players.forEach(player => {
        player.life = gameState.initialLife;
        player.infect = 0;
    });
    updateSetup();
    document.getElementById("playerForm").hidden = false;
    document.getElementById("playerForm").focus();
}

function prepareOnClicks() {
    gameState.players.forEach((player, index) => {
        const id = player.id;

        // Life Buttons
        document.getElementById(`Player${id}LifeUp`).onclick = () => changeLife(index, 1);
        document.getElementById(`Player${id}LifeDown`).onclick = () => changeLife(index, -1);

        // Infect Buttons
        document.getElementById(`Player${id}InfectUp`).onclick = () => changeInfect(index, 1);
        document.getElementById(`Player${id}InfectDown`).onclick = () => changeInfect(index, -1);

        // Concede
        document.getElementById(`Player${id}Concede`).onclick = () => playerConcede(index);
    });

    document.getElementById('reset').onclick = Reset;
    // document.getElementById('background').onclick = randomizeBackground;
}

const backgrounds = [
    './assets/mtgLife/bg/wings.jpg',
    './assets/mtgLife/bg/rainbow.jpg',
    './assets/mtgLife/bg/jodah.jpg',
    './assets/mtgLife/bg/hydra.jpg',
    './assets/mtgLife/bg/eldrazi.jpg',
    './assets/mtgLife/bg/dragon.jpg',
    './assets/mtgLife/bg/chandra.jpg',
    './assets/mtgLife/bg/angel.jpg'
];

function randomizeBackground() {
  const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  console.log(randomBg);
  document.getElementById('bg').src = randomBg;
}

window.onload = function() {
    prepareOnClicks();
    updateSetup();
    randomizeBackground();
};