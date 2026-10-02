import { Forecast } from "./classes/forecast.js";

export default function ui_load() {
    const app = document.getElementById("app");
    
    // 1. Inject the HTML string
    app.innerHTML = 
    `   <div id="container">
            <div id="top_container">
                <form id="search_container">
                    <input type="text" id="search_input" placeholder="Enter a city name">
                    <button id="search_button">Search</button>
                </form>
            </div>
            <div id="middle_container">
                <div id="weather_container">
                    <div id="weather_location_and_time_container">
                        <div id="weather_location">LONDON
                        </div>
                        <div id="weather_time">3:00 PM
                        </div>
                    </div>
                    <div id="weather_description_container">
                        <div id="weather_description_top_container">
                            <div id="weather_description_top_top_container">
                                <div id="weather_icon">INSERT ICON
                                </div>
                                <div id="top_top_right">
                                    <div id="weather_desc_data">
                                        Cloudy
                                    </div>
                                    <div id="weather_desc_temperature">
                                        20F
                                    </div>
                                </div>
                            </div>
                            <div id="weather_short_desc">
                            </div>
                        </div>
                        <div id="weather_detailed_descrption_container">
                            <div id="weather_precipitation_container">
                                <div id="weather_precipitation_title">
                                Precipitation
                                </div>
                                <div id="weather_precipitation_value">
                                30%
                                </div>
                            </div>
                            <div id="weather_humidity_container">
                                <div id="weather_humidity_title">
                                Humidity
                                </div>
                                <div id="weather_humidity_value">
                                30%
                                </div>
                            </div>
                            <div id="weather_wind_container">
                                <div id="weather_wind_speed_title">
                                Wind Speed
                                </div>
                                <div id="weather_wind_speed_value">
                                10 km/h
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="forecast_container">
                    <div id="forecast_title">
                        5-Day Forecast
                    </div>
                    <div id="forecast_cards_container">
                        <div class="forecast_card">
                            <div class="forecast_card_date">Mon</div>
                            <div class="forecast_card_desc">desc</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
    ;
}

export async function get_weather_data_api(location) {
    const weather_api = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/next5days?key=734S6QA7GNFAHKL3HKBLZX3BX`);
    let weather_data = await weather_api.json();

    return {
        locationName: weather_data?.address ?? "Unknown Location",
        currentTime: weather_data?.currentConditions?.datetime ?? "XX:XX XX",
        weatherIconData: weather_data?.currentConditions?.icon ?? "Error",
        weatherDescription: weather_data?.currentConditions?.conditions ?? "Error",
        weatherTemperature: weather_data?.currentConditions?.temp ?? "O F",
        weatherActualDesc: weather_data?.description ?? "Error",
        weatherPrecipitation: weather_data?.currentConditions?.precipprob,
        weatherHumidity: weather_data?.currentConditions?.humidity ?? "0",
        weatherWindSpeed: weather_data?.currentConditions?.windspeed ?? "0 Km/h",
        weatherforcastdata: weather_data?.days ?? "Error"
    }

}

export function add_forcast_card(forecast_data){
    const app = document.getElementById("forecast_cards_container");

    app.innerHTML = ""; 
    // 2. Loop starting at 1 (skipping index 0) and ending at 5
    for (let i = 1; i <= 5; i++) {
        const day = forecast_data[i];
        // 3. Use += to append each new card to the existing HTML
        app.innerHTML += `
            <div class="forecast_card">
                <div class="forecast_card_date">${day.date}</div>
                <div class="forecast_card_desc">${day.description}</div>
            </div>
        `;
    }
}

export function ui_update_weather(data) {

    const {
        locationName,
        currentTime,
        weatherIconData,
        weatherDescription,
        weatherTemperature,
        weatherActualDesc,
        weatherPrecipitation,
        weatherHumidity,
        weatherWindSpeed,
        weatherforcastdata
    } = data;

    const currentforecast = weatherforcastdata.map((day) => {
        return new Forecast(day.datetime, day.temp, day.icon, day.description);
    });

    const weather_location = document.getElementById("weather_location");
    const current_time = document.getElementById("weather_time");
    const weather_icon_data = document.getElementById("weather_icon");
    const weather_description = document.getElementById("weather_desc_data");
    const weather_temperature = document.getElementById("weather_desc_temperature");
    const weather_actual_desctiption = document.getElementById("weather_short_desc");
    const weather_precipitation_value = document.getElementById("weather_precipitation_value");
    const weather_humidity_value = document.getElementById("weather_humidity_value");
    const weather_wind_speed_value = document.getElementById("weather_wind_speed_value");

    if (currentforecast) add_forcast_card(currentforecast);
    if (weather_location) weather_location.textContent = locationName;
    if (current_time) current_time.textContent = currentTime;
    if (weather_description) weather_description.textContent = weatherDescription;
    if (weather_temperature) weather_temperature.textContent = `${weatherTemperature}°`; // Assuming you want a degree symbol
    if (weather_actual_desctiption) weather_actual_desctiption.textContent = weatherActualDesc; // Kept your variable name spelling
    if (weather_precipitation_value) weather_precipitation_value.textContent = `${weatherPrecipitation}%`;
    if (weather_humidity_value) weather_humidity_value.textContent = `${weatherHumidity}%`;
    if (weather_wind_speed_value) weather_wind_speed_value.textContent = weatherWindSpeed;
    if (weatherIconData) weather_icon_data.textContent = weatherIconData;
}

export function ui_update_weather_location() {

    const weather_location_form = document.getElementById("search_container");
    const weather_location = document.getElementById("search_input");

    if (weather_location.value == "") {
        weather_location.value = "London";
    }

    weather_location_form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (weather_location.value == "") {
            console.error("Weather location input not found");
            return;
        }

        const location = weather_location.value;
            const weatherData = await get_weather_data_api(location);
            ui_update_weather(weatherData);

        return location;
    });
}