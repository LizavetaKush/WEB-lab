// ===============================================
// КОНФИГУРАЦИЯ API
// ===============================================
// Получите свой бесплатный ключ на: https://www.omdbapi.com/apikey.aspx
// Замените 'YOUR_API_KEY' на ваш ключ после регистрации
const API_KEY = '3ff93915'; // ⚠️ ЗАМЕНИТЕ НА ВАШ КЛЮЧ!
const API_URL = 'https://www.omdbapi.com/';

// Элементы DOM
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const typeFilter = document.getElementById('typeFilter');
const yearFilter = document.getElementById('yearFilter');
const moviesContainer = document.getElementById('moviesContainer');
const loader = document.getElementById('loader');
const message = document.getElementById('message');

// Состояние приложения
let currentSearch = '';
let currentType = '';
let currentYear = '';
let moviesData = [];

// Инициализация приложения
function init() {
    // Проверка наличия API ключа
    if (API_KEY === 'YOUR_API_KEY') {
        showMessage('⚠️ Необходимо получить API ключ на omdbapi.com/apikey.aspx и заменить YOUR_API_KEY в файле script.js', 'error');
        return;
    }
    
    // Фокус на поле ввода
    searchInput.focus();
    
    // Загрузка начальных фильмов
    loadDefaultMovies();
    
    // Обработчики событий
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('input', handleInputChange);
    searchInput.addEventListener('keypress', handleKeyPress);
    clearBtn.addEventListener('click', handleClear);
    typeFilter.addEventListener('change', handleFilterChange);
    yearFilter.addEventListener('input', handleFilterChange);
}

// Загрузка начальных фильмов
async function loadDefaultMovies() {
    const defaultSearches = ['Batman', 'Matrix', 'Star', 'Lord'];
    const randomSearch = defaultSearches[Math.floor(Math.random() * defaultSearches.length)];
    await searchMovies(randomSearch);
}

// Обработка поиска
async function handleSearch() {
    const query = searchInput.value.trim();
    
    if (!query) {
        showMessage('Пожалуйста, введите название фильма', 'error');
        return;
    }
    
    currentSearch = query;
    await searchMovies(query);
}

// Обработка ввода в поле поиска
function handleInputChange(e) {
    const value = e.target.value;
    
    if (value.trim()) {
        clearBtn.classList.add('active');
    } else {
        clearBtn.classList.remove('active');
    }
}

// Обработка нажатия клавиши Enter
function handleKeyPress(e) {
    if (e.key === 'Enter') {
        handleSearch();
    }
}

// Очистка поля поиска
function handleClear() {
    searchInput.value = '';
    clearBtn.classList.remove('active');
    searchInput.focus();
    
    // Возврат к начальным фильмам
    loadDefaultMovies();
}

// Обработка изменения фильтров
async function handleFilterChange() {
    currentType = typeFilter.value;
    currentYear = yearFilter.value;
    
    if (currentSearch) {
        await searchMovies(currentSearch);
    } else {
        await loadDefaultMovies();
    }
}

// Поиск фильмов через API
async function searchMovies(query) {
    showLoader();
    hideMessage();
    
    try {
        // Формирование URL с параметрами
        let url = `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`;
        
        if (currentType) {
            url += `&type=${currentType}`;
        }
        
        if (currentYear) {
            url += `&y=${currentYear}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.Response === 'True') {
            // Получение детальной информации для каждого фильма
            const detailedMovies = await Promise.all(
                data.Search.map(movie => getMovieDetails(movie.imdbID))
            );
            
            moviesData = detailedMovies.filter(movie => movie !== null);
            displayMovies(moviesData);
        } else {
            moviesData = [];
            displayMovies([]);
            showMessage(data.Error || 'Фильмы не найдены. Попробуйте изменить запрос.', 'info');
        }
    } catch (error) {
        console.error('Ошибка при поиске фильмов:', error);
        
        if (error.message.includes('Invalid API key')) {
            showMessage('❌ Неверный API ключ! Получите бесплатный ключ на omdbapi.com/apikey.aspx', 'error');
        } else {
            showMessage('Произошла ошибка при загрузке данных. Проверьте подключение к интернету.', 'error');
        }
    } finally {
        hideLoader();
    }
}

// Получение детальной информации о фильме
async function getMovieDetails(imdbID) {
    try {
        const response = await fetch(`${API_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`);
        const data = await response.json();
        
        if (data.Response === 'True') {
            return data;
        }
        return null;
    } catch (error) {
        console.error('Ошибка при получении деталей фильма:', error);
        return null;
    }
}

// Отображение фильмов
function displayMovies(movies) {
    moviesContainer.innerHTML = '';
    
    if (movies.length === 0) {
        return;
    }
    
    movies.forEach((movie, index) => {
        const movieCard = createMovieCard(movie, index);
        moviesContainer.appendChild(movieCard);
    });
}

// Создание карточки фильма
function createMovieCard(movie, index) {
    const card = document.createElement('article');
    card.className = 'movie-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    // Постер
    const posterWrapper = document.createElement('div');
    posterWrapper.className = 'movie-card__poster-wrapper';
    
    if (movie.Poster && movie.Poster !== 'N/A') {
        const poster = document.createElement('img');
        poster.className = 'movie-card__poster';
        poster.src = movie.Poster;
        poster.alt = `Постер фильма ${movie.Title}`;
        poster.loading = 'lazy';
        posterWrapper.appendChild(poster);
    } else {
        const noPoster = document.createElement('div');
        noPoster.className = 'movie-card__no-poster';
        noPoster.textContent = '🎬';
        posterWrapper.appendChild(noPoster);
    }
    
    // Контент карточки
    const content = document.createElement('div');
    content.className = 'movie-card__content';
    
    // Название
    const title = document.createElement('h2');
    title.className = 'movie-card__title';
    title.textContent = movie.Title;
    
    // Информация
    const info = document.createElement('div');
    info.className = 'movie-card__info';
    
    if (movie.Year && movie.Year !== 'N/A') {
        const year = document.createElement('span');
        year.className = 'movie-card__year';
        year.textContent = movie.Year;
        info.appendChild(year);
    }
    
    if (movie.Type && movie.Type !== 'N/A') {
        const type = document.createElement('span');
        type.className = 'movie-card__type';
        type.textContent = getTypeInRussian(movie.Type);
        info.appendChild(type);
    }
    
    // Рейтинг
    if (movie.imdbRating && movie.imdbRating !== 'N/A') {
        const rating = document.createElement('span');
        rating.className = 'movie-card__rating';
        rating.textContent = movie.imdbRating;
        info.appendChild(rating);
    }
    
    // Описание
    let plot = '';
    if (movie.Plot && movie.Plot !== 'N/A') {
        plot = movie.Plot;
    }
    
    const plotElement = document.createElement('p');
    plotElement.className = 'movie-card__plot';
    plotElement.textContent = plot || 'Описание недоступно';
    
    // Сборка карточки
    content.appendChild(title);
    content.appendChild(info);
    content.appendChild(plotElement);
    
    card.appendChild(posterWrapper);
    card.appendChild(content);
    
    // Клик по карточке - открытие IMDb
    card.addEventListener('click', () => {
        if (movie.imdbID) {
            window.open(`https://www.imdb.com/title/${movie.imdbID}/`, '_blank');
        }
    });
    
    return card;
}

// Перевод типа фильма на русский
function getTypeInRussian(type) {
    const types = {
        'movie': 'Фильм',
        'series': 'Сериал',
        'episode': 'Эпизод',
        'game': 'Игра'
    };
    
    return types[type.toLowerCase()] || type;
}

// Показать загрузчик
function showLoader() {
    loader.classList.add('active');
    moviesContainer.style.display = 'none';
}

// Скрыть загрузчик
function hideLoader() {
    loader.classList.remove('active');
    moviesContainer.style.display = 'grid';
}

// Показать сообщение
function showMessage(text, type = 'info') {
    message.textContent = text;
    message.className = `message active ${type}`;
}

// Скрыть сообщение
function hideMessage() {
    message.classList.remove('active');
}

// Запуск приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Вывод информации в консоль для разработчика
    if (API_KEY === 'YOUR_API_KEY') {
        console.error('%c⚠️ API КЛЮЧ НЕ НАСТРОЕН!', 'color: red; font-size: 20px; font-weight: bold;');
        console.log('%c📋 Инструкция по настройке:', 'color: orange; font-size: 14px; font-weight: bold;');
        console.log('1. Перейдите на https://www.omdbapi.com/apikey.aspx');
        console.log('2. Зарегистрируйтесь и получите БЕСПЛАТНЫЙ ключ');
        console.log('3. Проверьте почту и активируйте ключ');
        console.log('4. Откройте script.js и замените YOUR_API_KEY на ваш ключ');
        console.log('%cПодробная инструкция в файле SETUP.md', 'color: cyan; font-size: 12px;');
    } else {
        console.log('%c✅ API ключ настроен!', 'color: green; font-size: 14px;');
        console.log('OMDb API готов к использованию');
    }
    
    init();
});

// Дополнительная функциональность: сохранение фокуса после поиска
function maintainFocus() {
    searchInput.focus();
    const length = searchInput.value.length;
    searchInput.setSelectionRange(length, length);
}

// Обработка ошибок загрузки изображений
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG' && e.target.classList.contains('movie-card__poster')) {
        const wrapper = e.target.parentElement;
        wrapper.innerHTML = '<div class="movie-card__no-poster">🎬</div>';
    }
}, true);

// Дебаунс для фильтра по году
let yearTimeout;
const originalYearInput = yearFilter.addEventListener;

yearFilter.removeEventListener('input', handleFilterChange);
yearFilter.addEventListener('input', () => {
    clearTimeout(yearTimeout);
    yearTimeout = setTimeout(handleFilterChange, 500);
});

