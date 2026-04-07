let playerCount; 

function initializeSetup() {
    mode = document.getElementById("mode");
    switch(mode){
        case 0:
            P1Initial = 20;
            P2Initial = 20;
            P3Initial = 20;
            P4Initial = 20;
            break;
            case 1:
                P1Initial = 40;
                P2Initial = 40;
                P3Initial = 40;
                P4Initial = 40;
            break;
    }
    Player1Counter = P1Initial;
    Player2Counter = P2Initial;
    Player3Counter = P3Initial;
    Player4Counter = P4Initial;
    Player1Infect = 0;
    Player2Infect = 0;
    Player3Infect = 0;
    Player4Infect = 0;
    P1Name = document.getElementById("p1name");
    P2Name = document.getElementById("p2name");
    P3Name = document.getElementById("p3name");
    P4Name = document.getElementById("p4name");
    switch(playerCount) {
        case 1:
            P1Active = false;
            P2Active = true;
            P3Active = true;
            P4Active = true;
          break;
        case 2:
            P1Active = false;
            P2Active = false;
            P3Active = true;
            P4Active = true;
          break;
        case 3:
            P1Active = false;
            P2Active = false;
            P3Active = false;
            P4Active = true;
            break;
        case 4:
            P1Active = false;
            P2Active = false;
            P3Active = false;
            P4Active = false;
            break;
      }
      updateSetup();
}

function updateSetup(){
    
}

function selectPlayerCount(count){
    playerCount = count;
    switch(count) {
        case 1:
            document.getElementById("p1name").disabled = false;
            document.getElementById("p2name").disabled = true;
            document.getElementById("p3name").disabled = true;
            document.getElementById("p4name").disabled = true;
          break;
        case 2:
            document.getElementById("p1name").disabled = false;
            document.getElementById("p2name").disabled = false;
            document.getElementById("p3name").disabled = true;
            document.getElementById("p4name").disabled = true;
          break;
        case 3:
            document.getElementById("p1name").disabled = false;
            document.getElementById("p2name").disabled = false;
            document.getElementById("p3name").disabled = false;
            document.getElementById("p4name").disabled = true;
            break;
        case 4:
            document.getElementById("p1name").disabled = false;
            document.getElementById("p2name").disabled = false;
            document.getElementById("p3name").disabled = false;
            document.getElementById("p4name").disabled = false;
            break;
      }
}
