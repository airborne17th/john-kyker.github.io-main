const days = 5;
const settings = {
  async: true,
  crossDomain: true,
  url: 'https://visual-crossing-weather.p.rapidapi.com/forecast',
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'e30a340171mshc1787ffa9a27599p1fe4adjsn017dcf68af30',
    'X-RapidAPI-Host': 'visual-crossing-weather.p.rapidapi.com',
  },
};

const stateCodes = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'AS', 'DC', 'GU', 'MP', 'PR', 'VI',
];
const selectElement = document.getElementById('state');

for (let i = 0; i < stateCodes.length; i++) {
  const option = document.createElement('option');
  option.text = stateCodes[i];
  selectElement.add(option);
}

function reformatDate(datetimeStr) {
  const datetime = new Date(datetimeStr);
  const month = datetime.getMonth() + 1; // add 1 since getMonth() returns 0-based index
  const day = datetime.getDate();
  return `${month}/${day}`;
}

async function getWeather() {
    const state = document.getElementById("state").value;
    const city = document.getElementById("city").value;
    const fulladd = `${city},${state},USA`;
  
    try {
      const response = await fetch(`https://visual-crossing-weather.p.rapidapi.com/forecast?aggregateHours=24&location=${fulladd}&contentType=json&unitGroup=us&shortColumnNames=0`, {
        "method": "GET",
        "headers": {
            'X-RapidAPI-Key': 'e30a340171mshc1787ffa9a27599p1fe4adjsn017dcf68af30',
          "x-rapidapi-host": "visual-crossing-weather.p.rapidapi.com"
        }
      });
      const data = await response.json();
      if (!data || Object.keys(data).length === 0) {
        console.log("API has no response.");
        alert("Sorry, error with getting weather data!");
        return null;
      }
  
      const address = data.locations[fulladd].address;
      const cur_datetime = new Date(data.locations[fulladd].currentConditions.datetime);
      const formattedDatetimeString = cur_datetime.toLocaleString();
      const cur_sunrise = data.locations[fulladd].currentConditions.sunrise.split('T')[1].slice(0, 5);
      const cur_sunset = data.locations[fulladd].currentConditions.sunset.split('T')[1].slice(0, 5);
      const cur_temp = `${data.locations[fulladd].currentConditions.temp}°F`;
      const cur_humid = `${data.locations[fulladd].currentConditions.humidity}%`;
      const tz = data.locations[fulladd].tz;
  
      document.getElementById("address").innerHTML = address;
      document.getElementById("datetime").innerHTML = formattedDatetimeString;
      document.getElementById("sunrise").innerHTML = cur_sunrise;
      document.getElementById("sunset").innerHTML = cur_sunset;
      document.getElementById("temp").innerHTML = cur_temp;
      document.getElementById("humidity").innerHTML = cur_humid;
      document.getElementById("tz").innerHTML = tz;
  
      const datetimeArray = [];
      const maxtArray = [];
      const mintArray = [];
      const humArray = [];
      const conArray = [];
  
      for (let i = 0; i < 5; i++) {
        let datetime = new Date(data.locations[fulladd].values[i].datetime);
        datetime = reformatDate(datetime);
        datetimeArray.push(datetime);
        maxtArray.push(`${data.locations[fulladd].values[i].maxt}°F`);
        mintArray.push(`${data.locations[fulladd].values[i].mint}°F`);
        humArray.push(`${data.locations[fulladd].values[i].humidity}%`);
        conArray.push(data.locations[fulladd].values[i].conditions);
      }

document.getElementById("datetime1").innerHTML = datetimeArray[0];
document.getElementById("datetime2").innerHTML = datetimeArray[1];
document.getElementById("datetime3").innerHTML = datetimeArray[2];
document.getElementById("datetime4").innerHTML = datetimeArray[3];
document.getElementById("datetime5").innerHTML = datetimeArray[4];

document.getElementById("maxt1").innerHTML = maxtArray[0];
document.getElementById("maxt2").innerHTML = maxtArray[1];
document.getElementById("maxt3").innerHTML = maxtArray[2];
document.getElementById("maxt4").innerHTML = maxtArray[3];
document.getElementById("maxt5").innerHTML = maxtArray[4];

document.getElementById("mint1").innerHTML = mintArray[0];
document.getElementById("mint2").innerHTML = mintArray[1];
document.getElementById("mint3").innerHTML = mintArray[2];
document.getElementById("mint4").innerHTML = mintArray[3];
document.getElementById("mint5").innerHTML = mintArray[4];

document.getElementById("hum1").innerHTML = humArray[0];
document.getElementById("hum2").innerHTML = humArray[1];
document.getElementById("hum3").innerHTML = humArray[2];
document.getElementById("hum4").innerHTML = humArray[3];
document.getElementById("hum5").innerHTML = humArray[4];

document.getElementById("con1").innerHTML = conArray[0];
document.getElementById("con2").innerHTML = conArray[1];
document.getElementById("con3").innerHTML = conArray[2];
document.getElementById("con4").innerHTML = conArray[3];
document.getElementById("con5").innerHTML = conArray[4];
    } catch (error) {
      console.log(error);
    }
  }