const settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://www.dnd5eapi.co/api/ability-scores/cha",
	"method": "GET",
};

let scoreArray = [];

function fetchAbility(){
    let e = document.getElementById("ability");
    let value = e.value;
    settings.url = "https://www.dnd5eapi.co/api/ability-scores/" + value;
    $.ajax(settings).done(function (response) {
        console.log(response);
        let desc = response.desc;
        document.getElementById("ability_data").innerHTML = desc;
        let skillsArray = response.skills.map(skill => skill.name);
        console.log(skillsArray);
                // create a new unordered list element
                let skillsList = document.createElement("ul");
        
                // loop through the skillsArray and add a new list item for each skill
                skillsArray.forEach(function(skill) {
                    let listItem = document.createElement("li");
                    listItem.innerText = skill;
                    skillsList.appendChild(listItem);
                });
                // append the skillsList to the DOM
                document.getElementById("skill_list").innerHTML = "Related Skills: ";
                document.getElementById("skill_list").appendChild(skillsList);
    });
}

function fetchAlignment(){
    let e = document.getElementById("alignment");
    let value = e.value;
    settings.url = "https://www.dnd5eapi.co/api/alignments/" + value;
    $.ajax(settings).done(function (response) {
        console.log(response);
        let desc = response.desc;
        document.getElementById("alignment_data").innerHTML = desc;
    });
}

function fetchSkill(){
    let e = document.getElementById("skill");
    let value = e.value;
    settings.url = "https://www.dnd5eapi.co/api/skills/" + value;
    $.ajax(settings).done(function (response) {
        console.log(response);
        let desc = response.desc;
        let desc1 = response.ability_score.name;
        document.getElementById("skill_data").innerHTML = desc;
        document.getElementById("ability_score").innerHTML = "Related Ability: " + desc1;
    });
}

function rollDie(num) { 
    var result = Math.floor(Math.random()*num+1);
    var x = document.getElementById("die-audio");
    x.play();
    document.getElementById("die").innerHTML = result;
};
    
function randomizeScores() {
    scoreArray = [];
    let rollArray = [];
    for(let b = 0; b < 6; b++){
    for (let i = 0; i < 4; i++) {
        rollArray[i] = Math.floor(Math.random() * 6) + 1;
    }
    let lowestNumber = Math.min(...rollArray);
    let lowestNumberIndex = rollArray.indexOf(lowestNumber);
    if (lowestNumberIndex !== -1) {
        rollArray.splice(lowestNumberIndex, 1);
    }
    let sum = rollArray.reduce((partialSum, a) => partialSum + a, 0);
    console.log(rollArray, sum);
    scoreArray[b] = sum;
    }
    console.log(scoreArray);
    document.getElementById("score-list").innerHTML = "Your ability score  " + scoreArray;
}

function standardScores() {
    scoreArray = [15,14,13,12,10,8];
    document.getElementById("score-list").innerHTML = "Your ability score  " + scoreArray;
}

function downloadCharData(){
// Define the data you want to write to the file
let data = "Name: " + document.getElementById("cname").value + "\n" +
"Race: " + document.getElementById("race").value + "\n" 
+ "Class: " + document.getElementById("class").value + "\n" 
+ "Background: " + document.getElementById("background").value + "\n" 
+ "Ability Scores: " + scoreArray;

// Create a new Blob object with the data
const blob = new Blob([data], { type: "text/plain" });

// Create a URL for the blob
const url = URL.createObjectURL(blob);

// Create a new anchor element and set its download attribute
const a = document.createElement("a");
a.href = url;
a.download = "character.txt";

// Programmatically click the anchor element to trigger the download
a.click();

// Release the URL object to free up memory
URL.revokeObjectURL(url);
}
