function getWeather() {
    const apiKey = 'SUA_CHAVE_API';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Por favor escolha uma cidade.');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Erro ao obter dados meteorológicos atuais:', error);
            alert('Erro ao buscar dados meteorológicos atuais. Tente novamente.');
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Erro ao buscar dados da previsão:', error);
            alert('Erro ao buscar dados da previsão. Tente novamente.');
        });
}

function getWindDirection(degree) {
    if (degree > 337.5 || degree <= 22.5) return 'N';
    if (degree > 22.5 && degree <= 67.5) return 'NE';
    if (degree > 67.5 && degree <= 112.5) return 'L';
    if (degree > 112.5 && degree <= 157.5) return 'SE';
    if (degree > 157.5 && degree <= 202.5) return 'S';
    if (degree > 202.5 && degree <= 247.5) return 'SO';
    if (degree > 247.5 && degree <= 292.5) return 'O';
    if (degree > 292.5 && degree <= 337.5) return 'NO';
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const additionalInfoDiv = document.getElementById('additional-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    weatherInfoDiv.innerHTML = '';
    additionalInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15);
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const windDirection = data.wind.deg;
        const windCompass = getWindDirection(windDirection);
        const feelsLike = Math.round(data.main.feels_like - 273.15);
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `
            <p>${temperature}°C</p>
        `;

        const weatherHtml = `
            <p>${cityName}</p>
        `;

        const additionalHtml = `
            <p>Umidade: ${humidity}%</p>
            <p>Velocidade do Vento: ${windSpeed} m/s</p>
            <p>Direção do Vento: ${windDirection}° (${windCompass})</p>
            <p>Sensação Térmica: ${feelsLike}°C</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        additionalInfoDiv.innerHTML = additionalHtml;
        weatherIcon.src = iconUrl;
        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    const next24Hours = hourlyData.slice(0, 8); 

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); 
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); 
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block'; 
}