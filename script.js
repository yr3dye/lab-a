const OW_API_KEY = "ec21e2ac327c6a22d66578f9829a7326"
const CURRENT_ENDPOINT = "https://api.openweathermap.org/data/2.5/weather"
const FORECAST5_ENDPOINT = "https://api.openweathermap.org/data/2.5/forecast"
const ICON_ENDPOINT = "https://openweathermap.org/img/wn/{icon}@2x.png"

const weatherDisplay = document.getElementById("weather-display")
const errorDisplay = document.getElementById("error-display")
const locationInput = document.getElementById("locationInput")

const getUrl = (endpoint, q) => {
    const u = new URL(endpoint)
    u.searchParams.set("q", q)
    u.searchParams.set("appid", OW_API_KEY)
    u.searchParams.set("units", "metric")
    u.searchParams.set("lang", "en")
    return u.toString()
}

const parse = d => ({
    date: new Date(d.dt * 1000).toLocaleDateString(),
    time: new Date(d.dt * 1000).toLocaleTimeString(),
    temp: d.main.temp + " ℃",
    feels: d.main.feels_like + " ℃",
    pressure: d.main.pressure + " hPa",
    humidity: d.main.humidity + "%",
    wind: d.wind.speed + " m/s",
    desc: d.weather[0].description,
    icon: d.weather[0].icon
})

const block = w => {
    const b = document.createElement("div")
    b.className = "weather-block"
    b.innerHTML = `
        <div>${w.date} ${w.time}</div>
        <div class="weather-icon">
            <img src="${ICON_ENDPOINT.replace("{icon}", w.icon)}">
        </div>
        <div class="weather-temp">${w.temp}</div>
        <div class="weather-desc">${w.desc}</div>
        <div class="weather-stats">
            <div class="stat-item">Feels like ${w.feels}</div>
            <div class="stat-item">Humidity ${w.humidity}</div>
            <div class="stat-item">Wind ${w.wind}</div>
            <div class="stat-item">Pressure ${w.pressure}</div>
        </div>
    `
    return b
}

function fetchCurrentWeatherXHR(query) {
    const url = getUrl(CURRENT_ENDPOINT, query)

    const req = new XMLHttpRequest()
    req.open("GET", url, true)

    req.addEventListener("load", () => {
        if (req.status === 200) {
            const response = JSON.parse(req.responseText)
            console.log("CURRENT WEATHER RESPONSE (XHR):", response)
            weatherDisplay.appendChild(block(parse(response)))
        } else {
            console.log("XHR ERROR STATUS:", req.status)
            errorDisplay.textContent = "Location not found"
            errorDisplay.classList.remove("hidden")
        }
    })

    req.addEventListener("error", () => {
        console.log("XHR NETWORK ERROR")
        errorDisplay.textContent = "Network error"
        errorDisplay.classList.remove("hidden")
    })

    req.send()
}

function fetchForecastFetch(query) {
    fetch(getUrl(FORECAST5_ENDPOINT, query))
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => {
            console.log("FORECAST RESPONSE (FETCH):", data)
            data.list.slice(1, 5).forEach(x => {
                weatherDisplay.appendChild(block(parse(x)))
            })
        })
        .catch(() => {
            console.log("FETCH ERROR")
        })
}

document.getElementById("checkButton").addEventListener("click", e => {
    e.preventDefault()

    const q = locationInput.value.trim()
    if (!q) return

    weatherDisplay.innerHTML = ""
    errorDisplay.textContent = ""
    errorDisplay.classList.add("hidden")

    fetchCurrentWeatherXHR(q)
    fetchForecastFetch(q)
})
