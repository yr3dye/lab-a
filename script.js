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

const snow = () => {
    const layer = document.querySelector(".snow-layer")
    layer.innerHTML = ""
    for (let i = 0; i < 80; i++) {
        const s = document.createElement("span")
        s.textContent = "❄"
        s.style.left = Math.random() * 100 + "vw"
        s.style.animationDuration = 5 + Math.random() * 10 + "s"
        s.style.fontSize = 10 + Math.random() * 20 + "px"
        layer.appendChild(s)
    }
}

document.getElementById("checkButton").addEventListener("click", e => {
    e.preventDefault()

    const q = locationInput.value.trim()
    if (!q) return

    weatherDisplay.innerHTML = ""
    errorDisplay.classList.add("hidden")
    errorDisplay.textContent = ""

    fetch(getUrl(CURRENT_ENDPOINT, q))
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(d => {
            weatherDisplay.appendChild(block(parse(d)))
        })
        .catch(() => {
            errorDisplay.textContent = "Location not found"
            errorDisplay.classList.remove("hidden")
        })

    fetch(getUrl(FORECAST5_ENDPOINT, q))
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(d => {
            d.list.slice(1, 5).forEach(x => {
                weatherDisplay.appendChild(block(parse(x)))
            })
        })
})

snow()
