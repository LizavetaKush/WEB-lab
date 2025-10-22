/**
 * Theme Toggle Script
 * Переключение между светлой и темной темой
 */

// Функция для переключения темы
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    // Переключаем класс dark-theme на body
    body.classList.toggle('dark-theme');
    
    // Определяем текущую тему
    const isDarkTheme = body.classList.contains('dark-theme');
    
    // Меняем иконку в зависимости от темы
    if (isDarkTheme) {
        themeIcon.textContent = '☀️'; // Солнце для темной темы (означает переключение на светлую)
        // Сохраняем выбор темы в localStorage
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.textContent = '🌙'; // Луна для светлой темы (означает переключение на темную)
        localStorage.setItem('theme', 'light');
    }
}

// Функция для загрузки сохраненной темы при загрузке страницы
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.getElementById('themeIcon');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeIcon) {
            themeIcon.textContent = '☀️';
        }
    } else {
        document.body.classList.remove('dark-theme');
        if (themeIcon) {
            themeIcon.textContent = '🌙';
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем сохраненную тему
    loadTheme();
    
    // Добавляем обработчик события на кнопку переключения темы
    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
});

// Также загружаем тему сразу (до DOMContentLoaded), чтобы избежать мерцания
loadTheme();

