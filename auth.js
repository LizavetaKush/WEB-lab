// ============================================
// AUTH PAGE - JavaScript
// ============================================

const API_BASE_URL = 'http://localhost:3000';
const API_ENDPOINTS = {
    users: `${API_BASE_URL}/users`,
    favorites: `${API_BASE_URL}/favorites`,
    cart: `${API_BASE_URL}/cart`
};

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔐 Загрузка страницы авторизации');
    
    // Проверяем, авторизован ли пользователь
    checkUserStatus();
    
    // Обработчики форм
    setupFormHandlers();
    
    // Обновляем счетчики
    updateCounters();
});

// ============================================
// ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК
// ============================================

function switchTab(tabName) {
    // Переключаем активные вкладки
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    
    tabs.forEach(tab => {
        if (tab.textContent.toLowerCase().includes(tabName === 'login' ? 'вход' : 'регистрация')) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    forms.forEach(form => {
        if (form.id === `${tabName}-form`) {
            form.classList.add('active');
        } else {
            form.classList.remove('active');
        }
    });
    
    // Очищаем сообщения
    hideSuccessMessage();
    clearFormErrors();
}

// ============================================
// НАСТРОЙКА ОБРАБОТЧИКОВ ФОРМ
// ============================================

function setupFormHandlers() {
    // Обработчик формы входа
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleLogin();
    });
    
    // Обработчик формы регистрации
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleRegister();
    });
}

// ============================================
// ОБРАБОТКА ВХОДА
// ============================================

async function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    
    // Валидация
    if (!validateEmail(email)) {
        showError('login-email');
        return;
    }
    
    if (!password) {
        showError('login-password');
        return;
    }
    
    clearFormErrors();
    
    try {
        // Ищем пользователя
        const response = await fetch(`${API_ENDPOINTS.users}?email=${email}`);
        const users = await response.json();
        
        if (users.length === 0) {
            alert('Пользователь с таким email не найден');
            return;
        }
        
        const user = users[0];
        
        // Проверяем пароль (в реальном приложении используйте хеширование!)
        if (user.password !== password) {
            alert('Неверный пароль');
            return;
        }
        
        // Сохраняем данные пользователя
        const userData = {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        console.log('✅ Успешный вход:', userData);
        
        // Показываем сообщение об успехе
        showSuccessMessage(`Добро пожаловать, ${user.firstName}!`);
        
        // Обновляем статус пользователя
        checkUserStatus();
        
        // Перенаправляем через 2 секунды
        setTimeout(() => {
            const redirectUrl = user.role === 'admin' ? 'admin.html' : 'catalog-server.html';
            window.location.href = redirectUrl;
        }, 2000);
        
    } catch (error) {
        console.error('❌ Ошибка при входе:', error);
        alert('Не удалось войти. Попробуйте еще раз.');
    }
}

// ============================================
// ОБРАБОТКА РЕГИСТРАЦИИ
// ============================================

async function handleRegister() {
    const firstName = document.getElementById('register-firstname').value.trim();
    const lastName = document.getElementById('register-lastname').value.trim();
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();
    const passwordConfirm = document.getElementById('register-password-confirm').value.trim();
    
    // Валидация
    let hasErrors = false;
    
    if (!firstName) {
        showError('register-firstname');
        hasErrors = true;
    }
    
    if (!lastName) {
        showError('register-lastname');
        hasErrors = true;
    }
    
    if (!username) {
        showError('register-username');
        hasErrors = true;
    }
    
    if (!validateEmail(email)) {
        showError('register-email');
        hasErrors = true;
    }
    
    if (password.length < 6) {
        showError('register-password');
        hasErrors = true;
    }
    
    if (password !== passwordConfirm) {
        showError('register-password-confirm');
        hasErrors = true;
    }
    
    if (hasErrors) {
        return;
    }
    
    clearFormErrors();
    
    try {
        // Проверяем, существует ли пользователь с таким email
        const checkResponse = await fetch(`${API_ENDPOINTS.users}?email=${email}`);
        const existingUsers = await checkResponse.json();
        
        if (existingUsers.length > 0) {
            alert('Пользователь с таким email уже существует');
            return;
        }
        
        // Создаем нового пользователя
        const newUser = {
            username: username,
            email: email,
            password: password, // В реальном приложении используйте хеширование!
            role: 'customer',
            firstName: firstName,
            lastName: lastName,
            createdAt: new Date().toISOString()
        };
        
        const response = await fetch(API_ENDPOINTS.users, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });
        
        if (!response.ok) {
            throw new Error('Не удалось создать пользователя');
        }
        
        const createdUser = await response.json();
        console.log('✅ Пользователь создан:', createdUser);
        
        // Показываем сообщение об успехе
        showSuccessMessage('Регистрация успешна! Теперь вы можете войти.');
        
        // Очищаем форму
        document.getElementById('register-form').reset();
        
        // Переключаемся на форму входа через 2 секунды
        setTimeout(() => {
            switchTab('login');
            // Автозаполняем email
            document.getElementById('login-email').value = email;
        }, 2000);
        
    } catch (error) {
        console.error('❌ Ошибка при регистрации:', error);
        alert('Не удалось зарегистрироваться. Попробуйте еще раз.');
    }
}

// ============================================
// ВАЛИДАЦИЯ
// ============================================

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(fieldId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}-error`);
    
    if (field) field.classList.add('error');
    if (error) error.classList.add('show');
}

function clearFormErrors() {
    const errorInputs = document.querySelectorAll('.form-input.error');
    const errorMessages = document.querySelectorAll('.error-message.show');
    
    errorInputs.forEach(input => input.classList.remove('error'));
    errorMessages.forEach(msg => msg.classList.remove('show'));
}

// ============================================
// УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЕМ
// ============================================

function checkUserStatus() {
    const userDataStr = localStorage.getItem('currentUser');
    if (userDataStr) {
        try {
            const userData = JSON.parse(userDataStr);
            showUserStatus(userData);
        } catch (e) {
            console.error('Ошибка при чтении данных пользователя:', e);
        }
    }
}

function showUserStatus(userData) {
    const statusEl = document.getElementById('user-status');
    const nameEl = document.getElementById('user-name');
    
    if (statusEl && nameEl) {
        nameEl.textContent = `👤 ${userData.firstName} ${userData.lastName}`;
        statusEl.classList.add('show');
    }
}

function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        localStorage.removeItem('currentUser');
        location.reload();
    }
}

// ============================================
// СООБЩЕНИЯ
// ============================================

function showSuccessMessage(message) {
    const msgEl = document.getElementById('success-message');
    if (msgEl) {
        msgEl.textContent = message;
        msgEl.classList.add('show');
    }
}

function hideSuccessMessage() {
    const msgEl = document.getElementById('success-message');
    if (msgEl) {
        msgEl.classList.remove('show');
    }
}

// ============================================
// ОБНОВЛЕНИЕ СЧЕТЧИКОВ
// ============================================

async function updateCounters() {
    try {
        const [favResponse, cartResponse] = await Promise.all([
            fetch(API_ENDPOINTS.favorites),
            fetch(API_ENDPOINTS.cart)
        ]);
        
        const favorites = await favResponse.json();
        const cart = await cartResponse.json();
        
        const favCountEl = document.getElementById('favorites-count');
        const cartCountEl = document.getElementById('cart-count');
        
        if (favCountEl) favCountEl.textContent = favorites.length;
        if (cartCountEl) cartCountEl.textContent = cart.length;
        
    } catch (error) {
        console.error('Ошибка обновления счетчиков:', error);
    }
}

console.log('🔐 Страница авторизации инициализирована');

