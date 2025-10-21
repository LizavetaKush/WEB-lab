// ============================================
// AUTH PAGE - JavaScript (UPDATED)
// ============================================

const API_BASE_URL = 'http://localhost:3000';
const API_ENDPOINTS = {
    users: `${API_BASE_URL}/users`,
    favorites: `${API_BASE_URL}/favorites`,
    cart: `${API_BASE_URL}/cart`
};

// TOP-100 паролей 2024 года (упрощенный список)
const TOP_100_PASSWORDS = [
    '123456', 'password', '123456789', '12345678', '12345', '1234567', '1234567890',
    'qwerty', 'abc123', '111111', '123123', 'admin', 'letmein', 'welcome', 'monkey',
    '1234', 'password1', 'qwerty123', '123321', 'password123', 'iloveyou', 'admin123',
    'root', 'tinkoff', 'trustno1', '000000', 'master', 'sunshine', 'ashley', 'bailey'
];

let nicknameAttempts = 0;
const MAX_NICKNAME_ATTEMPTS = 5;

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔐 Загрузка страницы авторизации');
    
    checkUserStatus();
    setupFormHandlers();
    setupValidation();
    updateCounters();
});

// ============================================
// ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК
// ============================================

function switchTab(tabName) {
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
    
    hideSuccessMessage();
    clearFormErrors();
}

// ============================================
// НАСТРОЙКА ОБРАБОТЧИКОВ
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
    
    // Генерация никнейма
    document.getElementById('btn-generate-nickname').addEventListener('click', generateNickname);
}

// ============================================
// ВАЛИДАЦИЯ В РЕАЛЬНОМ ВРЕМЕНИ
// ============================================

function setupValidation() {
    const fields = {
        'register-firstname': validateName,
        'register-lastname': validateName,
        'register-phone': validatePhone,
        'register-birthdate': validateBirthdate,
        'register-email': validateEmailField,
        'register-password': validatePasswordField,
        'register-password-confirm': validatePasswordConfirm
    };
    
    Object.keys(fields).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', () => {
                hideError(fieldId);
                fields[fieldId]();
                checkFormValidity();
            });
            field.addEventListener('blur', () => {
                fields[fieldId]();
                checkFormValidity();
            });
        }
    });
    
    // Проверка соглашения
    const agreement = document.getElementById('register-agreement');
    if (agreement) {
        agreement.addEventListener('change', checkFormValidity);
    }
}

function validateName() {
    const firstname = document.getElementById('register-firstname').value.trim();
    const lastname = document.getElementById('register-lastname').value.trim();
    
    let isValid = true;
    
    if (!firstname) {
        showError('register-firstname', 'Введите имя');
        isValid = false;
    }
    
    if (!lastname) {
        showError('register-lastname', 'Введите фамилию');
        isValid = false;
    }
    
    return isValid;
}

function validatePhone() {
    const phone = document.getElementById('register-phone').value.trim();
    // Белорусские номера: +375 (код оператора) номер
    const phoneRegex = /^\+375\s?\(?(25|29|33|44)\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/;
    
    if (!phoneRegex.test(phone)) {
        showError('register-phone', 'Введите корректный номер РБ (например: +375 (29) 123-45-67)');
        return false;
    }
    
    hideError('register-phone');
    return true;
}

function validateBirthdate() {
    const birthdate = document.getElementById('register-birthdate').value;
    
    if (!birthdate) {
        showError('register-birthdate', 'Введите дату рождения');
        return false;
    }
    
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    if (age < 16) {
        showError('register-birthdate', 'Вам должно быть минимум 16 лет');
        return false;
    }
    
    hideError('register-birthdate');
    return true;
}

function validateEmailField() {
    const email = document.getElementById('register-email').value.trim();
    
    if (!validateEmail(email)) {
        showError('register-email', 'Введите корректный email');
        return false;
    }
    
    hideError('register-email');
    return true;
}

function validatePasswordField() {
    const mode = document.querySelector('input[name="password-mode"]:checked').value;
    
    if (mode === 'auto') {
        const generatedPassword = document.getElementById('generated-password').value;
        return generatedPassword.length > 0;
    }
    
    const password = document.getElementById('register-password').value;
    
    // Проверка длины
    if (password.length < 8 || password.length > 20) {
        showError('register-password', 'Пароль должен содержать от 8 до 20 символов');
        return false;
    }
    
    // Проверка на заглавную букву
    if (!/[A-ZА-Я]/.test(password)) {
        showError('register-password', 'Пароль должен содержать хотя бы одну заглавную букву');
        return false;
    }
    
    // Проверка на строчную букву
    if (!/[a-zа-я]/.test(password)) {
        showError('register-password', 'Пароль должен содержать хотя бы одну строчную букву');
        return false;
    }
    
    // Проверка на цифру
    if (!/\d/.test(password)) {
        showError('register-password', 'Пароль должен содержать хотя бы одну цифру');
        return false;
    }
    
    // Проверка на спецсимвол
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        showError('register-password', 'Пароль должен содержать хотя бы один спецсимвол');
        return false;
    }
    
    // Проверка на TOP-100 паролей
    if (TOP_100_PASSWORDS.includes(password.toLowerCase())) {
        showError('register-password', 'Этот пароль слишком распространенный. Выберите другой');
        return false;
    }
    
    hideError('register-password');
    return true;
}

function validatePasswordConfirm() {
    const mode = document.querySelector('input[name="password-mode"]:checked').value;
    
    if (mode === 'auto') return true;
    
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-password-confirm').value;
    
    if (password !== confirm) {
        showError('register-password-confirm', 'Пароли не совпадают');
        return false;
    }
    
    hideError('register-password-confirm');
    return true;
}

function checkFormValidity() {
    const firstname = document.getElementById('register-firstname').value.trim();
    const lastname = document.getElementById('register-lastname').value.trim();
    const phone = document.getElementById('register-phone').value.trim();
    const birthdate = document.getElementById('register-birthdate').value;
    const email = document.getElementById('register-email').value.trim();
    const username = document.getElementById('register-username').value.trim();
    const agreement = document.getElementById('register-agreement').checked;
    
    const mode = document.querySelector('input[name="password-mode"]:checked').value;
    let passwordValid = false;
    
    if (mode === 'auto') {
        passwordValid = document.getElementById('generated-password').value.length > 0;
    } else {
        const password = document.getElementById('register-password').value;
        const confirm = document.getElementById('register-password-confirm').value;
        passwordValid = password.length >= 8 && password === confirm;
    }
    
    const isValid = firstname && lastname && phone && birthdate && email && 
                    username && passwordValid && agreement &&
                    validatePhone() && validateBirthdate() && 
                    validateEmailField() && validatePasswordField();
    
    document.getElementById('btn-register').disabled = !isValid;
}

// ============================================
// ГЕНЕРАЦИЯ НИКНЕЙМА
// ============================================

async function generateNickname() {
    const firstname = document.getElementById('register-firstname').value.trim();
    const lastname = document.getElementById('register-lastname').value.trim();
    
    if (!firstname || !lastname) {
        alert('Сначала введите имя и фамилию');
        return;
    }
    
    if (nicknameAttempts >= MAX_NICKNAME_ATTEMPTS) {
        // Разрешаем ручной ввод
        const usernameField = document.getElementById('register-username');
        usernameField.readOnly = false;
        usernameField.placeholder = 'Введите никнейм вручную';
        usernameField.value = '';
        alert('Достигнут лимит генераций. Теперь вы можете ввести никнейм вручную.');
        return;
    }
    
    nicknameAttempts++;
    document.getElementById('nickname-attempts').textContent = nicknameAttempts;
    
    // Генерация никнейма
    const firstPart = firstname.substring(0, Math.floor(Math.random() * 3) + 1);
    const lastPart = lastname.substring(0, Math.floor(Math.random() * 3) + 1);
    const number = Math.floor(Math.random() * 990) + 10;
    const suffixes = ['_pro', '_king', '_star', '_one', '_top', ''];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    const nickname = firstPart + lastPart + number + suffix;
    
    // Проверка уникальности
    const isUnique = await checkNicknameUnique(nickname);
    
    if (isUnique) {
        document.getElementById('register-username').value = nickname;
        hideError('register-username');
        checkFormValidity();
    } else {
        showError('register-username', 'Этот никнейм уже занят');
        // Автоматически попробуем снова
        if (nicknameAttempts < MAX_NICKNAME_ATTEMPTS) {
            setTimeout(generateNickname, 500);
        }
    }
}

async function checkNicknameUnique(nickname) {
    try {
        const response = await fetch(`${API_ENDPOINTS.users}?username=${nickname}`);
        const users = await response.json();
        return users.length === 0;
    } catch (error) {
        console.error('Ошибка проверки никнейма:', error);
        return true;
    }
}

// ============================================
// ПЕРЕКЛЮЧЕНИЕ РЕЖИМА ПАРОЛЯ
// ============================================

function togglePasswordMode() {
    const mode = document.querySelector('input[name="password-mode"]:checked').value;
    const manualFields = document.getElementById('manual-password-fields');
    const autoField = document.getElementById('auto-password-field');
    
    if (mode === 'manual') {
        manualFields.style.display = 'block';
        autoField.style.display = 'none';
        document.getElementById('register-password').required = true;
        document.getElementById('register-password-confirm').required = true;
    } else {
        manualFields.style.display = 'none';
        autoField.style.display = 'block';
        document.getElementById('register-password').required = false;
        document.getElementById('register-password-confirm').required = false;
        generatePassword();
    }
    
    checkFormValidity();
}

function generatePassword() {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}';
    
    let password = '';
    
    // Гарантируем наличие каждого типа символов
    password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    password += numbers.charAt(Math.floor(Math.random() * numbers.length));
    password += special.charAt(Math.floor(Math.random() * special.length));
    
    // Добавляем остальные символы
    const allChars = uppercase + lowercase + numbers + special;
    const length = 12; // Длина пароля
    
    for (let i = password.length; i < length; i++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    // Перемешиваем символы
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    document.getElementById('generated-password').value = password;
    checkFormValidity();
}

// ============================================
// ОБРАБОТКА РЕГИСТРАЦИИ
// ============================================

async function handleRegister() {
    const firstname = document.getElementById('register-firstname').value.trim();
    const lastname = document.getElementById('register-lastname').value.trim();
    const middlename = document.getElementById('register-middlename').value.trim();
    const phone = document.getElementById('register-phone').value.trim();
    const birthdate = document.getElementById('register-birthdate').value;
    const email = document.getElementById('register-email').value.trim();
    const username = document.getElementById('register-username').value.trim();
    
    const mode = document.querySelector('input[name="password-mode"]:checked').value;
    let password;
    
    if (mode === 'auto') {
        password = document.getElementById('generated-password').value;
    } else {
        password = document.getElementById('register-password').value;
    }
    
    // Финальная валидация
    if (!validatePhone() || !validateBirthdate() || !validateEmailField() || !validatePasswordField()) {
        alert('Пожалуйста, исправьте ошибки в форме');
        return;
    }
    
    try {
        // Проверка существования email
        const checkEmailResponse = await fetch(`${API_ENDPOINTS.users}?email=${email}`);
        const existingEmailUsers = await checkEmailResponse.json();
        
        if (existingEmailUsers.length > 0) {
            alert('Пользователь с таким email уже существует');
            return;
        }
        
        // Проверка уникальности никнейма
        const isUnique = await checkNicknameUnique(username);
        if (!isUnique) {
            showError('register-username', 'Этот никнейм уже занят');
            return;
        }
        
        // Создание пользователя
        const newUser = {
            username: username,
            email: email,
            password: password,
            role: 'customer',
            firstName: firstname,
            lastName: lastname,
            middleName: middlename || null,
            phone: phone,
            birthdate: birthdate,
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
        
        showSuccessMessage('Регистрация успешна! Теперь вы можете войти.');
        
        // Очистка формы
        document.getElementById('register-form').reset();
        nicknameAttempts = 0;
        document.getElementById('nickname-attempts').textContent = '0';
        document.getElementById('register-username').readOnly = true;
        
        setTimeout(() => {
            switchTab('login');
            document.getElementById('login-email').value = email;
        }, 2000);
        
    } catch (error) {
        console.error('❌ Ошибка при регистрации:', error);
        alert('Не удалось зарегистрироваться. Попробуйте еще раз.');
    }
}

// ============================================
// ОБРАБОТКА ВХОДА
// ============================================

async function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    
    if (!validateEmail(email)) {
        showError('login-email', 'Введите корректный email');
        return;
    }
    
    if (!password) {
        showError('login-password', 'Введите пароль');
        return;
    }
    
    clearFormErrors();
    
    try {
        const response = await fetch(`${API_ENDPOINTS.users}?email=${email}`);
        const users = await response.json();
        
        if (users.length === 0) {
            alert('Пользователь с таким email не найден');
            return;
        }
        
        const user = users[0];
        
        if (user.password !== password) {
            alert('Неверный пароль');
            return;
        }
        
        const userData = {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            middleName: user.middleName,
            role: user.role
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        console.log('✅ Успешный вход:', userData);
        
        showSuccessMessage(`Добро пожаловать, ${user.firstName}!`);
        
        checkUserStatus();
        
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
// МОДАЛЬНОЕ ОКНО СОГЛАШЕНИЯ
// ============================================

function showAgreement() {
    document.getElementById('agreement-modal').classList.add('show');
}

function closeAgreement() {
    document.getElementById('agreement-modal').classList.remove('show');
}

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}-error`);
    
    if (field) field.classList.add('error');
    if (error) {
        error.textContent = message || error.textContent;
        error.classList.add('show');
    }
}

function hideError(fieldId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(`${fieldId}-error`);
    
    if (field) field.classList.remove('error');
    if (error) error.classList.remove('show');
}

function clearFormErrors() {
    const errorInputs = document.querySelectorAll('.form-input.error');
    const errorMessages = document.querySelectorAll('.error-message.show');
    
    errorInputs.forEach(input => input.classList.remove('error'));
    errorMessages.forEach(msg => msg.classList.remove('show'));
}

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
