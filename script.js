// import { initiateUI } from './ui.js'

async function search(location){
    if (!location || location.length === 0){
        location = 'Brooklyn, NY';
    }
    const data = await getWeather.forecast(location);
    console.log(data)
    const parsedData = parse(data);

    display.update(parsedData);
}

const getWeather = ((location = 'Brooklyn,NY') => {
    const URL = 'http://api.weatherapi.com/v1'
    const API = '614224b56c5041de8d8181958232404'
    const currentWeather = '/current.json'
    const forecast = '/forecast.json'

    return {
        forecast: async (location) => {
            const response = await fetch(`${URL+forecast}?key=${API}&q=${location}&days=7`); 
            const data = response.json();
            return data;
        },
        icon: async (URL) => {
            const response = await fetch(URL);
            return response;
        }
    }
})();

function parse(data){
    const location = {};
    location.name = data.location.name;
    location.country = data.location.country;
    location.state = data.location.region;
    location.localTime = data.location.localtime;

    const current = {};
    current.condition = data.current.condition;
    current.tempC = data.current.temp_c;
    current.tempF = data.current.temp_f;
    current.feelsLikeC = data.current.feelslike_c;
    current.feelsLikeF = data.current.feelslike_f;

    const forecast = [];
    for (let i = 0; i < 7; i++){
        forecast[i] = {};
        forecast[i].date = data.forecast.forecastday[i].date;
        forecast[i].condition = data.forecast.forecastday[i].day.condition;
        forecast[i].maxTempC = data.forecast.forecastday[i].day.maxtemp_c;
        forecast[i].maxTempF = data.forecast.forecastday[i].day.maxtemp_f;
        forecast[i].minTempC = data.forecast.forecastday[i].day.mintemp_c;
        forecast[i].minTempF = data.forecast.forecastday[i].day.mintemp_f;
        forecast.push(forecast[i]);
    }

    return {
        location, current, forecast
    }
}

// UI
const content = document.querySelector('.content');

// Result Output
const display = (function(){
    // header
    const header = document.createElement('div');
    header.classList.add('header');
    const title = document.createElement('h1');
    title.textContent = 'Weather App'
    let switchCF = true;
    const switchBtn = document.createElement('button');
    switchBtn.addEventListener('click', () => {
        switchCF = !switchCF;
        display.update()
    })
    header.append(title, switchBtn);
    content.append(header);

    // searchform
    const searchForm = document.createElement('form');
    searchForm.classList.add('searchForm');
    const searchLabel = document.createElement('label');
    const searchInp = document.createElement('input');
    searchInp.placeholder = 'Search location';
    searchLabel.append(searchInp);
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Search';
    searchForm.append(searchLabel, submitBtn);

    content.append(searchForm);

    searchForm.addEventListener('submit', (e)=> {
        e.preventDefault();
        search(e.target[0].value)
    })

    // location info
    const locationDiv = document.createElement('div');
    locationDiv.classList.add('location');
    const date = document.createElement('p');
    const name = document.createElement('h1');
    const state = document.createElement('h2');
    const country = document.createElement('h2');
    const localTime = document.createElement('p');
    locationDiv.append(date, name, state, country, localTime);
    content.append(locationDiv);

    // current Weather info
    const weatherDiv = document.createElement('div');
    weatherDiv.classList.add('weather');
    const temp = document.createElement('p');
    const feelsLike = document.createElement('p');

    const condition = document.createElement('div');
    const conditionText = document.createElement('p');
    const conditionIcon = document.createElement('img');
    condition.append(conditionText, conditionIcon);
    
    weatherDiv.append(temp, feelsLike, condition)
    content.append(weatherDiv);
    
    // forecast info
    const forecastDiv = document.createElement('div');
    forecastDiv.classList.add('forecast');
    for(let i = 0; i < 7; i++){
        const day = document.createElement('div');
        day.classList.add('day');
        day.id = `day${i}`;
        const weekday = document.createElement('h3');
        weekday.classList.add('weekday')
        const icon = document.createElement('img');
        icon.classList.add('icon');
        const tempDiv = document.createElement('div');
        const span = document.createElement('span')
        const temp = document.createElement('p');
        tempDiv.classList.add('temp');
        tempDiv.append(span, temp)
        day.append(weekday, icon, tempDiv);
        
        forecastDiv.append(day);
    }
    content.append(forecastDiv);

    let lastEntry;
    return {
        update: async function(data = lastEntry){
            lastEntry = data;

            let degree = switchCF ? 'C' : 'F'
            switchBtn.textContent = switchCF ? 'Display in F' : 'Display in C'

            // location
            date.textContent = formatDate(new Date(data.location.localTime));
            name.textContent = data.location.name;
            state.textContent = data.location.state
            country.textContent = data.location.country
            localTime.textContent = 'local time: ' + data.location.localTime.split(' ')[1];


            // weather
            temp.textContent = data.current['temp' + degree] + `°${degree}`
            feelsLike.textContent = `Feels like ${data.current['feelsLike' + degree]}°${degree}`
            conditionText.textContent = data.current.condition.text;
            conditionIcon.src = `http://${data.current.condition.icon}`;
            console.log(data)

            // forecast
            for(let i = 0; i < 7; i++){
                const day = document.querySelector(`#day${i}`);
                const weekday = day.querySelector('.weekday');
                const icon = day.querySelector('.icon');
                
                const tempSpan = day.querySelector('.temp span')
                const temp = day.querySelector('.temp p');
                weekday.textContent = formatDate(new Date(data.forecast[i].date.split('-')));
                icon.src = `http://${data.forecast[i].condition.icon}`;
                const minTemp = `${data.forecast[i]['minTemp' + degree]}`
                const maxTemp = `${data.forecast[i]['maxTemp' + degree]}`
                tempSpan.textContent = 'Min / Max'
                temp.textContent = `${minTemp} / ${maxTemp}°${degree}`
            }
        }
    }
})();

function formatDate(date){
    const weekDay = translateDay(date.getDay());
    const month = date.getMonth() + 1
    const day = date.getDate();
    const year = date.getFullYear();

    return `${weekDay}, ${month}/${day}/${year}`;
}

function translateDay(int){
    switch(int){
        case 0: return 'Sunday';
        case 1: return 'Monday';
        case 2: return 'Tuesday';
        case 3: return 'Wednesday';
        case 4: return 'Thursday';
        case 5: return 'Friday';
        case 6: return 'Saturday';
    }
}

search();