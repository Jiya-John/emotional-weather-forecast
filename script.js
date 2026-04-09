const emotionalMap = {
    'Clear_Day': [
        'Emotional UV Index: 9/10 — wear protection from optimism.',
        'Confidence levels rising steadily.',
        'Visibility: high. Clarity of thought: questionable.',
        'Your vibe is pure sunshine today.'
    ],
    'Clear_Night': [
        'Starlit introspection: 100%. Logic is currently optional.',
        'A cool, crisp midnight for deep thoughts.',
        'Emotional state: Nocturnal and slightly mysterious.',
        'The stars are aligning, but your schedule is not.'
    ],
    'Clouds': [
        'Expect a slow, cozy melancholy — the kind that makes you want tea and soft music.',
        'Floating in a cloud of cozy thoughts.',
        'Emotional brightness low. Ideal conditions for dramatic staring out the window.',
        'Emotional fog: 40%. Proceed with caution.'
    ],
    'Rain': [
        'Nostalgia levels rising — memories may fall steadily throughout the day.',
        'Your inner monologue may become poetic. Avoid texting your ex.',
        'A drizzle of soft sadness may occur, but it’s the good kind that smells like fresh beginnings.',
        'Time for introspection, movie, blanket and tea.'
    ],
    'Drizzle': [
        'Slight emotional dampness. 10% chance of an unplanned epiphany.',
        'Your vibe is a gentle, rhythmic, and slightly annoying drizzle.',
        'Emotional humidity: high. Mood: mildly inconvenient.',
        'A subtle, sweet kind of sadness that smells like wet pavement.'
    ],
    'Thunderstorm': [
        'A storm of intensity is passing through. Channel it into creativity, not arguments.',
        'A powerful storm of emotions brewing.',
        'Chaotic thoughts swirling at high voltage. Expect sudden bursts of passion or panic.',
        'Emotional lightning strikes possible — dramatic decisions may occur.'
    ],
    'Snow': [
        'Soft emotions accumulating — perfect conditions for blankets and introspection.',
        'Your heart feels like a snow globe someone just shook. Let the flakes settle.',
        'Emotional temperature low. Seek warmth from cozy activities.',
        'Wrapped in a wintery emotional hug.'
    ],
    'Mist': [
        'Visibility: zero. Emotional direction: nonexistent.',
        'Wandering through a haze of dreams and poor decisions.',
        'A soft, blurred edge to the world. Logic has left the chat.',
        'Lost in a beautiful, foggy thought. Please do not find me.'
    ],
    'Fog': [
        'Emotional visibility: 2 feet. Tread carefully into the void.',
        'Current mood: a thick, impenetrable wall of "I don\'t know".',
        'Vibe check: obscured. Please wait for the haze to lift.',
        'Lost in the fog of your own internal contradictions.'
    ],
    'Windy': [
        'Your thoughts are blowing around like loose papers. Expect mental drafts and scattered ideas.',
        'Hold onto your sanity — gusts of chaos incoming.',
        'You may feel restless today, as if your soul wants to run errands without you.',
        'Emotional turbulence ahead. Secure your boundaries.'
    ],
    'Default': [
        'A unique blend of emotions today.',
        'Your vibe is an unpredictable mystery!',
        'Feeling a mix of everything beautiful.',
        'Just being you, and that is wonderful.'
    ]
};

const weatherToTheme = {
    'Clear_Day': 'theme-sunny',
    'Clear_Night': 'theme-sparkly',
    'Clouds': 'theme-sparkly',
    'Rain': 'theme-rainy',
    'Drizzle': 'theme-rainy',
    'Thunderstorm': 'theme-rainy',
    'Snow': 'theme-snowy',
    'Mist': 'theme-foggy',
    'Fog': 'theme-foggy',
    'Windy': 'theme-sparkly',
    'Default': 'theme-sparkly'
};

const screens = {
    input: document.getElementById('input-screen'),
    loading: document.getElementById('loading-screen'),
    forecast: document.getElementById('forecast-screen')
};

function showScreen(screenName) {
    const currentActive = document.querySelector('.screen.active');
    const nextScreen = screens[screenName];

    if (currentActive) {
        // Prevent double-triggering if the same screen is requested
        if (currentActive === nextScreen) return;

        currentActive.classList.add('fade-out');

        setTimeout(() => {
            currentActive.classList.remove('active', 'fade-out');

            // Important: Remove 'active' from ALL screens first to be absolutely sure
            Object.values(screens).forEach(s => s.classList.remove('active'));

            nextScreen.classList.remove('fade-in');
            nextScreen.classList.add('active', 'fade-in');

            setTimeout(() => {
                nextScreen.classList.remove('fade-in');
            }, 600);
        }, 600);
    } else {
        nextScreen.classList.add('active', 'fade-in');
        setTimeout(() => {
            nextScreen.classList.remove('fade-in');
        }, 600);
    }
}

function getRandomSentence(category) {
    const sentences = emotionalMap[category] || emotionalMap['Default'];
    return sentences[Math.floor(Math.random() * sentences.length)];
}

function createParticles(type) {
    const container = document.getElementById('particle-container');
    if (container) container.remove();

    const newContainer = document.createElement('div');
    newContainer.id = 'particle-container';
    document.body.appendChild(newContainer);

    const count = 50;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        if (type === 'rain') p.className = 'particle rain-drop';
        else if (type === 'snow') p.className = 'particle snow-flake';
        else if (type === 'sparkle') p.className = 'particle sparkle';
        else if (type === 'fog') p.className = 'fog-cloud';
        else if (type === 'star') p.className = 'particle star';
        else if (type === 'wind') p.className = 'wind-streak';

        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDuration = (Math.random() * 3 + 2) + 's';
        p.style.animationDelay = Math.random() * 5 + 's';

        if (type === 'fog' || type === 'star' || type === 'wind') {
            p.style.top = Math.random() * 100 + 'vh';
            if (type === 'fog') {
                p.style.animationDuration = (Math.random() * 20 + 10) + 's';
            }
            if (type === 'wind') {
                p.style.animationDuration = (Math.random() * 2 + 1) + 's';
            }
        }

        newContainer.appendChild(p);
    }
}

async function fetchWeather(location) {
    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('Location not found');
        }

        const { latitude, longitude, name } = geoData.results[0];

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day,wind_speed_10m`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        const code = weatherData.current.weather_code;
        const temp = Math.round(weatherData.current.temperature_2m);
        const isDay = weatherData.current.is_day;
        const windSpeed = weatherData.current.wind_speed_10m;

        let condition = 'Default';

        if (windSpeed > 15) {
            condition = 'Windy';
        } else if (code === 0) {
            condition = isDay ? 'Clear_Day' : 'Clear_Night';
        } else if ([1, 2, 3].includes(code)) {
            condition = 'Clouds';
        } else if ([51, 53, 55, 61, 63, 65].includes(code)) {
            condition = 'Rain';
        } else if ([52, 56, 62].includes(code)) {
            condition = 'Drizzle';
        } else if ([71, 73, 75, 77, 80, 81, 82].includes(code)) {
            condition = 'Snow';
        } else if ([45].includes(code)) {
            condition = 'Fog';
        } else if ([48].includes(code)) {
            condition = 'Mist';
        } else if ([95, 96, 99].includes(code)) {
            condition = 'Thunderstorm';
        } else {
            condition = 'Default';
        }

        console.log(`City: ${name}, Code: ${code}, Wind: ${windSpeed}, Day: ${isDay}, Mapped Condition: ${condition}`);

        return {
            city: name,
            temp: temp,
            condition: condition
        };
    } catch (err) {
        console.error('Weather Fetch Error:', err);
        throw err;
    }
}

function updateUI(data) {
    const { temp, condition, city } = data;

    document.getElementById('temp').textContent = `${temp}°C`;
    document.getElementById('condition').textContent = condition.replace('_', ' ');
    document.getElementById('emotional-sentence').textContent = getRandomSentence(condition);

    const iconEl = document.getElementById('forecast-icon');
    const icons = {
        'Clear_Day': '☀️',
        'Clear_Night': '🌙',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Drizzle': '🌦️',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Mist': '🌫️',
        'Fog': '🌫️',
        'Windy': '💨',
        'Default': '🌈'
    };
    iconEl.textContent = icons[condition] || icons['Default'];

    document.body.className = '';
    const theme = weatherToTheme[condition] || 'theme-sparkly';
    document.body.classList.add(theme);

    const typeMap = {
        'theme-sunny': 'sparkle',
        'theme-rainy': 'rain',
        'theme-snowy': 'snow',
        'theme-foggy': 'fog',
        'theme-sparkly': 'star'
    };

    const type = typeMap[theme] || 'sparkle';

    // Priority: If it's Windy, always show wind particles regardless of theme
    let finalType = type;
    if (condition === 'Windy') {
        finalType = 'wind';
    } else if (type === 'star' && condition !== 'Clear_Night') {
        finalType = 'sparkle';
    }

    createParticles(finalType);
}

document.getElementById('location-form').onsubmit = async (e) => {
    e.preventDefault();
    const location = document.getElementById('location-input').value.trim();

    if (!location) return;

    try {
        // First, check if the location exists using the geocoding API
        // We do this BEFORE switching to the loading screen
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('Location not found');
        }

        // If we reach here, location is valid. NOW we show the loading screen.
        showScreen('loading');

        const { latitude, longitude } = geoData.results[0];
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,is_day,wind_speed_10m`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        // We can wrap the fetchWeather logic here or call a modified version.
        // For simplicity and to fix the flow, let's just manually handle the data.
        const code = weatherData.current.weather_code;
        const temp = Math.round(weatherData.current.temperature_2m);
        const isDay = weatherData.current.is_day;
        const windSpeed = weatherData.current.wind_speed_10m;

        let condition = 'Default';
        if (windSpeed > 15) {
            condition = 'Windy';
        } else if (code === 0) {
            condition = isDay ? 'Clear_Day' : 'Clear_Night';
        } else if ([1, 2, 3].includes(code)) {
            condition = 'Clouds';
        } else if ([51, 53, 55, 61, 63, 65].includes(code)) {
            condition = 'Rain';
        } else if ([52, 56, 62].includes(code)) {
            condition = 'Drizzle';
        } else if ([71, 73, 75, 77, 80, 81, 82].includes(code)) {
            condition = 'Snow';
        } else if ([45].includes(code)) {
            condition = 'Fog';
        } else if ([48].includes(code)) {
            condition = 'Mist';
        } else if ([95, 96, 99].includes(code)) {
            condition = 'Thunderstorm';
        }

        updateUI({ temp, condition, city: geoData.results[0].name });
        showScreen('forecast');

    } catch (err) {
        const errorEl = document.getElementById('error-message');
        errorEl.textContent = "I couldn’t find that place. Maybe it only exists in your imagination.";
        errorEl.style.display = 'block';

        const input = document.getElementById('location-input');
        input.style.borderColor = 'red';
        setTimeout(() => input.style.borderColor = '', 1000);

        // Ensure we are back on the input screen if a transition started
        showScreen('input');
    }
};

// Clear error message when user starts typing again
document.getElementById('location-input').oninput = () => {
    document.getElementById('error-message').style.display = 'none';
};

document.getElementById('btn-reset').onclick = () => {
    showScreen('input');
};

document.getElementById('btn-refresh').onclick = () => {
    const conditionText = document.getElementById('condition').textContent;
    const condition = conditionText.replace(' ', '_');

    const key = emotionalMap[condition] ? condition : (
        document.body.classList.contains('theme-sunny') ? 'Clear_Day' : (
        document.body.classList.contains('theme-sparkly') ? 'Clear_Night' : condition)
    );

    document.getElementById('emotional-sentence').textContent = getRandomSentence(key);
};
