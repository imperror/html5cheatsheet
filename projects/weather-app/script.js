// API конфігурація
const API_KEY = 'f4710e14d9ac17c0136681b456163947'; // Додайте ваш API ключ з openweathermap.org
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Елементи DOM
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const cityName = document.getElementById('cityName');
const currentTemp = document.getElementById('currentTemp');
const currentIcon = document.getElementById('currentIcon');
const weatherDesc = document.getElementById('weatherDesc');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const pressure = document.getElementById('pressure');
const forecastContainer = document.getElementById('forecastContainer');

// Тестові дані для різних міст
const mockData = {
    'київ': {
        city: 'Київ',
        temperature: 22,
        description: 'Сонячно',
        icon: '☀️',
        feelsLike: 25,
        humidity: 60,
        windSpeed: 5,
        pressure: 1013,
        forecast: [
            { day: 'Сьогодні', icon: '☀️', high: 25, low: 18 },
            { day: 'Завтра', icon: '⛅', high: 23, low: 16 },
            { day: 'Пн', icon: '🌧️', high: 20, low: 14 },
            { day: 'Вт', icon: '⛈️', high: 18, low: 12 },
            { day: 'Ср', icon: '🌤️', high: 21, low: 15 },
            { day: 'Чт', icon: '☀️', high: 24, low: 17 },
            { day: 'Пт', icon: '⛅', high: 22, low: 16 }
        ]
    },
    'львів': {
        city: 'Львів',
        temperature: 18,
        description: 'Хмарно',
        icon: '☁️',
        feelsLike: 20,
        humidity: 75,
        windSpeed: 3,
        pressure: 1008,
        forecast: [
            { day: 'Сьогодні', icon: '☁️', high: 20, low: 12 },
            { day: 'Завтра', icon: '🌧️', high: 17, low: 10 },
            { day: 'Пн', icon: '⛈️', high: 15, low: 8 },
            { day: 'Вт', icon: '🌤️', high: 19, low: 11 },
            { day: 'Ср', icon: '☀️', high: 22, low: 14 },
            { day: 'Чт', icon: '⛅', high: 21, low: 13 },
            { day: 'Пт', icon: '☁️', high: 18, low: 12 }
        ]
    },
    'одеса': {
        city: 'Одеса',
        temperature: 26,
        description: 'Ясно',
        icon: '🌞',
        feelsLike: 28,
        humidity: 45,
        windSpeed: 8,
        pressure: 1015,
        forecast: [
            { day: 'Сьогодні', icon: '🌞', high: 28, low: 22 },
            { day: 'Завтра', icon: '☀️', high: 27, low: 21 },
            { day: 'Пн', icon: '🌤️', high: 25, low: 19 },
            { day: 'Вт', icon: '⛅', high: 24, low: 18 },
            { day: 'Ср', icon: '☀️', high: 26, low: 20 },
            { day: 'Чт', icon: '🌞', high: 29, low: 23 },
            { day: 'Пт', icon: '☀️', high: 27, low: 21 }
        ]
    },
    'харків': {
        city: 'Харків',
        temperature: 19,
        description: 'Переважно хмарно',
        icon: '⛅',
        feelsLike: 21,
        humidity: 65,
        windSpeed: 4,
        pressure: 1010,
        forecast: [
            { day: 'Сьогодні', icon: '⛅', high: 21, low: 15 },
            { day: 'Завтра', icon: '☁️', high: 19, low: 13 },
            { day: 'Пн', icon: '🌧️', high: 17, low: 11 },
            { day: 'Вт', icon: '🌤️', high: 20, low: 14 },
            { day: 'Ср', icon: '☀️', high: 23, low: 16 },
            { day: 'Чт', icon: '⛅', high: 22, low: 15 },
            { day: 'Пт', icon: '☁️', high: 20, low: 14 }
        ]
    },
    'дніпро': {
        city: 'Дніпро',
        temperature: 24,
        description: 'Сонячно',
        icon: '☀️',
        feelsLike: 26,
        humidity: 50,
        windSpeed: 6,
        pressure: 1014,
        forecast: [
            { day: 'Сьогодні', icon: '☀️', high: 26, low: 19 },
            { day: 'Завтра', icon: '🌤️', high: 24, low: 17 },
            { day: 'Пн', icon: '⛅', high: 22, low: 15 },
            { day: 'Вт', icon: '🌧️', high: 19, low: 13 },
            { day: 'Ср', icon: '⛈️', high: 17, low: 11 },
            { day: 'Чт', icon: '🌤️', high: 21, low: 14 },
            { day: 'Пт', icon: '☀️', high: 25, low: 18 }
        ]
    }
};

// Функція відображення повідомлень
function showMessage(message, type = 'info') {
    // Видаляємо попередні повідомлення
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Вставляємо повідомлення після заголовка
    const header = document.querySelector('.header');
    header.parentNode.insertBefore(messageDiv, header.nextSibling);
    
    // Автоматично приховуємо через 5 секунд
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Функція показу завантаження
function showLoading() {
    const weatherContent = document.querySelector('.weather-content');
    weatherContent.classList.add('loading');
    
    cityName.textContent = 'Завантаження...';
    currentTemp.textContent = '--';
    weatherDesc.textContent = 'Отримання даних...';
    currentIcon.textContent = '⏳';
}

// Функція приховування завантаження
function hideLoading() {
    const weatherContent = document.querySelector('.weather-content');
    weatherContent.classList.remove('loading');
}

// Функція оновлення погоди
function updateWeather(data) {
    hideLoading();
    
    // Додаємо анімацію появи
    const weatherContent = document.querySelector('.weather-content');
    weatherContent.classList.add('fade-in');
    
    cityName.textContent = data.city;
    currentTemp.textContent = data.temperature;
    currentIcon.textContent = data.icon;
    weatherDesc.textContent = data.description;
    feelsLike.textContent = `${data.feelsLike}°C`;
    humidity.textContent = `${data.humidity}%`;
    windSpeed.textContent = `${data.windSpeed} м/с`;
    pressure.textContent = `${data.pressure} гПа`;
    
    // Оновлення прогнозу
    forecastContainer.innerHTML = '';
    data.forecast.forEach((day, index) => {
        const dayElement = document.createElement('div');
        dayElement.className = 'forecast-day fade-in';
        dayElement.style.animationDelay = `${index * 0.1}s`;
        dayElement.innerHTML = `
            <div class="day-name">${day.day}</div>
            <div class="day-icon">${day.icon}</div>
            <div class="day-temps">
                <span class="high">${day.high}°</span>
                <span class="low">${day.low}°</span>
            </div>
        `;
        forecastContainer.appendChild(dayElement);
    });
    
    // Видаляємо клас анімації після завершення
    setTimeout(() => {
        weatherContent.classList.remove('fade-in');
    }, 1000);
}

// Функція отримання погоди з API
async function fetchWeatherData(city) {
    try {
        showLoading();
        
        // Поточна погода
        const currentResponse = await fetch(
            `${API_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=uk`
        );
        
        if (!currentResponse.ok) {
            if (currentResponse.status === 404) {
                throw new Error('Місто не знайдено');
            } else if (currentResponse.status === 401) {
                throw new Error('Невірний API ключ');
            } else {
                throw new Error('Помилка сервера');
            }
        }
        
        const currentData = await currentResponse.json();
        
        // Прогноз на 5 днів (кожні 3 години)
        const forecastResponse = await fetch(
            `${API_BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=uk`
        );
        
        if (!forecastResponse.ok) {
            throw new Error('Не вдалося отримати прогноз');
        }
        
        const forecastData = await forecastResponse.json();
        
        // Обробка даних
        const weatherData = processWeatherData(currentData, forecastData);
        updateWeather(weatherData);
        
        // Зберігаємо останнє успішне місто
        localStorage.setItem('lastCity', city);
        
        showMessage(`Погода для ${weatherData.city} оновлена`, 'success');
        
    } catch (error) {
        hideLoading();
        console.error('Weather API Error:', error);
        showMessage(`Помилка: ${error.message}`, 'error');
        
        // Якщо API не працює, показуємо тестові дані
        const mockCity = city.toLowerCase();
        if (mockData[mockCity]) {
            updateWeather(mockData[mockCity]);
        }
    }
}

// Функція обробки даних з API
function processWeatherData(current, forecast) {
    // Карта іконок погоди
    const weatherIcons = {
        '01d': '☀️', '01n': '🌙',
        '02d': '⛅', '02n': '☁️',
        '03d': '☁️', '03n': '☁️',
        '04d': '☁️', '04n': '☁️',
        '09d': '🌧️', '09n': '🌧️',
        '10d': '🌦️', '10n': '🌧️',
        '11d': '⛈️', '11n': '⛈️',
        '13d': '❄️', '13n': '❄️',
        '50d': '🌫️', '50n': '🌫️'
    };
    
    // Дні тижня
    const days = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    
    // Обробка прогнозу
    const processedForecast = [];
    
    // Додаємо сьогоднішній день
    processedForecast.push({
        day: 'Сьогодні',
        icon: weatherIcons[current.weather[0].icon] || '🌤️',
        high: Math.round(current.main.temp_max),
        low: Math.round(current.main.temp_min)
    });
    
    // Групування прогнозу по днях
    const dailyForecasts = {};
    const today = new Date().toDateString();
    
    forecast.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toDateString();
        
        // Пропускаємо сьогоднішні дані
        if (dateKey === today) return;
        
        if (!dailyForecasts[dateKey]) {
            dailyForecasts[dateKey] = {
                temps: [],
                icons: [],
                date: date
            };
        }
        
        dailyForecasts[dateKey].temps.push(item.main.temp);
        dailyForecasts[dateKey].icons.push(item.weather[0].icon);
    });
    
    // Створення прогнозу на наступні дні
    const sortedDates = Object.keys(dailyForecasts).sort();
    sortedDates.slice(0, 6).forEach((dateKey, index) => {
        const dayData = dailyForecasts[dateKey];
        const date = dayData.date;
        const dayName = index === 0 ? 'Завтра' : days[date.getDay()];
        
        // Знаходимо найпопулярнішу іконку за день
        const iconCounts = {};
        dayData.icons.forEach(icon => {
            iconCounts[icon] = (iconCounts[icon] || 0) + 1;
        });
        const mostFrequentIcon = Object.keys(iconCounts).reduce((a, b) => 
            iconCounts[a] > iconCounts[b] ? a : b
        );
        
        processedForecast.push({
            day: dayName,
            icon: weatherIcons[mostFrequentIcon] || '🌤️',
            high: Math.round(Math.max(...dayData.temps)),
            low: Math.round(Math.min(...dayData.temps))
        });
    });
    
    return {
        city: current.name,
        temperature: Math.round(current.main.temp),
        description: current.weather[0].description,
        icon: weatherIcons[current.weather[0].icon] || '🌤️',
        feelsLike: Math.round(current.main.feels_like),
        humidity: current.main.humidity,
        windSpeed: Math.round(current.wind ? current.wind.speed : 0),
        pressure: current.main.pressure,
        forecast: processedForecast
    };
}

// Функція пошуку міста
function searchCity() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showMessage('Введіть назву міста!', 'error');
        return;
    }
    
    // Якщо API ключ налаштований, використовуємо API
    if (API_KEY && API_KEY !== '') {
        fetchWeatherData(city);
    } else {
        // Використовуємо тестові дані
        const mockCity = city.toLowerCase();
        if (mockData[mockCity]) {
            updateWeather(mockData[mockCity]);
        } else {
            showMessage('Місто не знайдено! Спробуйте: Київ, Львів, Одеса, Харків, Дніпро', 'error');
        }
    }
    
    cityInput.value = '';
}

// Функція отримання погоди за геолокацією
function getCurrentLocationWeather() {
    if (!navigator.geolocation) {
        showMessage('Геолокація не підтримується вашим браузером', 'error');
        return;
    }
    
    showLoading();
    showMessage('Визначення вашого місцезнаходження...', 'info');
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            
            if (API_KEY && API_KEY !== '') {
                try {
                    const response = await fetch(
                        `${API_BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=uk`
                    );
                    
                    if (!response.ok) {
                        throw new Error('Не вдалося отримати дані');
                    }
                    
                    const data = await response.json();
                    cityInput.value = data.name;
                    fetchWeatherData(data.name);
                } catch (error) {
                    hideLoading();
                    showMessage('Не вдалося отримати дані для вашого місцезнаходження', 'error');
                }
            } else {
                hideLoading();
                updateWeather(mockData['київ']);
            }
        },
        (error) => {
            hideLoading();
            let errorMessage = 'Помилка геолокації';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Доступ до геолокації заборонено';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Інформація про місцезнаходження недоступна';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Час очікування геолокації вичерпано';
                    break;
            }
            
            showMessage(errorMessage, 'error');
        },
        {
            timeout: 10000,
            enableHighAccuracy: true,
            maximumAge: 300000 // 5 хвилин
        }
    );
}

// Обробники подій
searchBtn.addEventListener('click', searchCity);

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchCity();
    }
});

// Анімації кнопок
searchBtn.addEventListener('mousedown', () => {
    searchBtn.style.transform = 'scale(0.95)';
});

searchBtn.addEventListener('mouseup', () => {
    searchBtn.style.transform = 'scale(1)';
});

// Автодоповнення міст (бонус)
const ukrainianCities = [
    'Київ', 'Львів', 'Одеса', 'Харків', 'Дніпро', 'Запоріжжя', 'Кривий Ріг',
    'Миколаїв', 'Маріуполь', 'Вінниця', 'Херсон', 'Полтава', 'Чернігів',
    'Черкаси', 'Житомир', 'Суми', 'Хмельницький', 'Чернівці', 'Рівне',
    'Кременчук', 'Тернопіль', 'Івано-Франківськ', 'Луцьк', 'Біла Церква'
];

cityInput.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();
    if (value.length > 1) {
        const suggestions = ukrainianCities.filter(city => 
            city.toLowerCase().includes(value)
        );
        
        // Тут можна додати dropdown з пропозиціями
        if (suggestions.length > 0) {
            cityInput.title = `Пропозиції: ${suggestions.slice(0, 5).join(', ')}`;
        }
    }
});

// Збереження та відновлення останнього міста
function loadLastCity() {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
        cityInput.value = lastCity;
        searchCity();
    } else {
        // Завантажуємо дані для Києва за замовчуванням
        updateWeather(mockData['київ']);
    }
}

// Ініціалізація при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
    // Завантажуємо останнє місто або Київ за замовчуванням
    loadLastCity();
});

// Обробка помилок JavaScript
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    showMessage('Сталася помилка. Перезавантажте сторінку.', 'error');
});

// Експорт функцій для тестування (якщо потрібно)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        processWeatherData,
        updateWeather,
        searchCity
    };
}