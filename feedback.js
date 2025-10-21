// ============================================
// FEEDBACK PAGE - JavaScript
// ============================================

const API_BASE_URL = 'http://localhost:3000';
const API_ENDPOINTS = {
    products: `${API_BASE_URL}/products`,
    feedback: `${API_BASE_URL}/feedback`,
    favorites: `${API_BASE_URL}/favorites`,
    cart: `${API_BASE_URL}/cart`
};

let currentUser = null;
let selectedRating = 0;
let products = [];
let feedbackList = [];

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('💬 Загрузка страницы отзывов');
    
    // Проверяем авторизацию
    checkAuth();
    
    // Загружаем данные
    await loadProducts();
    await loadFeedback();
    
    // Настраиваем обработчики
    setupEventHandlers();
    
    // Обновляем счетчики
    updateCounters();
});

// ============================================
// ПРОВЕРКА АВТОРИЗАЦИИ
// ============================================

function checkAuth() {
    const userDataStr = localStorage.getItem('currentUser');
    if (userDataStr) {
        try {
            currentUser = JSON.parse(userDataStr);
            console.log('✅ Пользователь авторизован:', currentUser.firstName);
        } catch (e) {
            console.error('Ошибка при чтении данных пользователя:', e);
            currentUser = null;
        }
    }
    
    // Показываем/скрываем уведомление о входе
    const loginNotice = document.getElementById('login-notice');
    const feedbackForm = document.getElementById('feedback-form');
    
    if (!currentUser) {
        loginNotice.style.display = 'block';
        feedbackForm.style.display = 'none';
    } else {
        loginNotice.style.display = 'none';
        feedbackForm.style.display = 'block';
    }
}

// ============================================
// ЗАГРУЗКА ТОВАРОВ
// ============================================

async function loadProducts() {
    try {
        const response = await fetch(API_ENDPOINTS.products);
        if (!response.ok) {
            throw new Error('Не удалось загрузить товары');
        }
        
        products = await response.json();
        console.log('✅ Товары загружены:', products.length);
        
        // Заполняем селекты
        populateProductSelects();
        
    } catch (error) {
        console.error('❌ Ошибка загрузки товаров:', error);
    }
}

function populateProductSelects() {
    const productSelect = document.getElementById('product-select');
    const productFilter = document.getElementById('product-filter');
    
    // Очищаем опции
    productSelect.innerHTML = '<option value="">Выберите товар...</option>';
    productFilter.innerHTML = '<option value="">Все товары</option>';
    
    // Добавляем товары
    products.forEach(product => {
        // Для формы отзыва
        const option1 = document.createElement('option');
        option1.value = product.id;
        option1.textContent = `${product.name} - $${product.price}`;
        productSelect.appendChild(option1);
        
        // Для фильтра
        const option2 = document.createElement('option');
        option2.value = product.id;
        option2.textContent = product.name;
        productFilter.appendChild(option2);
    });
}

// ============================================
// ЗАГРУЗКА ОТЗЫВОВ
// ============================================

async function loadFeedback() {
    try {
        const response = await fetch(API_ENDPOINTS.feedback);
        if (!response.ok) {
            throw new Error('Не удалось загрузить отзывы');
        }
        
        feedbackList = await response.json();
        console.log('✅ Отзывы загружены:', feedbackList.length);
        
        // Применяем фильтры
        applyFilters();
        
    } catch (error) {
        console.error('❌ Ошибка загрузки отзывов:', error);
        showError('Не удалось загрузить отзывы');
    }
}

function applyFilters() {
    const productFilter = document.getElementById('product-filter').value;
    const ratingFilter = document.getElementById('rating-filter').value;
    
    let filtered = [...feedbackList];
    
    // Фильтр по товару
    if (productFilter) {
        filtered = filtered.filter(f => f.productId == productFilter);
    }
    
    // Фильтр по рейтингу
    if (ratingFilter) {
        filtered = filtered.filter(f => f.rating == ratingFilter);
    }
    
    // Сортируем по дате (новые первые)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    renderFeedback(filtered);
}

function renderFeedback(feedback) {
    const container = document.getElementById('feedback-container');
    
    if (feedback.length === 0) {
        container.innerHTML = `
            <div class="no-feedback">
                <div class="no-feedback-icon">📭</div>
                <h3>Нет отзывов</h3>
                <p>Будьте первым, кто оставит отзыв!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    feedback.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        const productName = product ? product.name : 'Товар не найден';
        
        const feedbackEl = createFeedbackElement(item, productName);
        container.appendChild(feedbackEl);
    });
}

function createFeedbackElement(item, productName) {
    const div = document.createElement('div');
    div.className = 'feedback-item';
    
    const initials = item.userName.split(' ').map(n => n[0]).join('').toUpperCase();
    const date = new Date(item.createdAt).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    div.innerHTML = `
        <div class="feedback-header-row">
            <div class="feedback-user">
                <div class="user-avatar">${initials}</div>
                <div class="user-info">
                    <div class="user-name">${item.userName}</div>
                    <div class="feedback-date">${date}</div>
                </div>
            </div>
        </div>
        <div class="feedback-product">📦 ${productName}</div>
        <div class="feedback-rating">
            ${generateStars(item.rating)}
        </div>
        <div class="feedback-comment">${item.comment}</div>
    `;
    
    return div;
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '<span class="star">★</span>' : '<span class="star" style="color: #ddd;">★</span>';
    }
    return stars;
}

// ============================================
// ОБРАБОТЧИКИ СОБЫТИЙ
// ============================================

function setupEventHandlers() {
    // Рейтинг звёздочками
    const stars = document.querySelectorAll('.star-rating .star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.getAttribute('data-rating'));
            setRating(rating);
        });
        
        star.addEventListener('mouseenter', () => {
            const rating = parseInt(star.getAttribute('data-rating'));
            highlightStars(rating);
        });
    });
    
    const starRating = document.getElementById('star-rating');
    starRating.addEventListener('mouseleave', () => {
        highlightStars(selectedRating);
    });
    
    // Форма отзыва
    const feedbackForm = document.getElementById('feedback-form');
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await submitFeedback();
    });
}

function setRating(rating) {
    selectedRating = rating;
    document.getElementById('rating-value').value = rating;
    highlightStars(rating);
    
    const ratingTexts = ['Ужасно', 'Плохо', 'Нормально', 'Хорошо', 'Отлично'];
    document.getElementById('rating-text').textContent = ratingTexts[rating - 1];
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.star-rating .star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// ============================================
// ОТПРАВКА ОТЗЫВА
// ============================================

async function submitFeedback() {
    if (!currentUser) {
        alert('Пожалуйста, войдите, чтобы оставить отзыв');
        window.location.href = 'auth.html';
        return;
    }
    
    const productId = parseInt(document.getElementById('product-select').value);
    const rating = selectedRating;
    const comment = document.getElementById('comment').value.trim();
    
    // Валидация
    if (!productId) {
        alert('Пожалуйста, выберите товар');
        return;
    }
    
    if (!rating) {
        alert('Пожалуйста, выберите рейтинг');
        return;
    }
    
    if (!comment) {
        alert('Пожалуйста, напишите отзыв');
        return;
    }
    
    try {
        const feedbackData = {
            productId: productId,
            userId: currentUser.id,
            userName: `${currentUser.firstName} ${currentUser.lastName}`,
            rating: rating,
            comment: comment,
            createdAt: new Date().toISOString(),
            approved: true // В реальном приложении требуется модерация
        };
        
        const response = await fetch(API_ENDPOINTS.feedback, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(feedbackData)
        });
        
        if (!response.ok) {
            throw new Error('Не удалось отправить отзыв');
        }
        
        const savedFeedback = await response.json();
        console.log('✅ Отзыв отправлен:', savedFeedback);
        
        // Показываем сообщение об успехе
        showSuccessMessage('Спасибо за ваш отзыв! 🎉');
        
        // Очищаем форму
        document.getElementById('feedback-form').reset();
        setRating(0);
        document.getElementById('rating-text').textContent = 'Выберите рейтинг';
        
        // Перезагружаем отзывы
        await loadFeedback();
        
    } catch (error) {
        console.error('❌ Ошибка при отправке отзыва:', error);
        alert('Не удалось отправить отзыв. Попробуйте еще раз.');
    }
}

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

function showSuccessMessage(message) {
    const msgEl = document.getElementById('success-message');
    msgEl.textContent = message;
    msgEl.classList.add('show');
    
    setTimeout(() => {
        msgEl.classList.remove('show');
    }, 5000);
}

function showError(message) {
    const container = document.getElementById('feedback-container');
    container.innerHTML = `
        <div class="no-feedback">
            <div class="no-feedback-icon">⚠️</div>
            <h3>Ошибка</h3>
            <p>${message}</p>
        </div>
    `;
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

console.log('💬 Страница отзывов инициализирована');

