// ============================================
// FEEDBACK PAGE - JavaScript (UPDATED)
// ============================================

const API_BASE_URL = 'http://localhost:3001';
const API_ENDPOINTS = {
    products: `${API_BASE_URL}/products`,
    feedback: `${API_BASE_URL}/feedback`,
    favorites: `${API_BASE_URL}/favorites`,
    cart: `${API_BASE_URL}/cart`,
    orders: `${API_BASE_URL}/orders`
};

const MIN_COMMENT_LENGTH = 20; // Минимальное количество символов для отзыва

let currentUser = null;
let selectedRating = 0;
let products = [];
let feedbackList = [];
let userOrders = [];

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
    
    // Проверяем кнопку админ-панели
    checkAdminNavLink();
});

function checkAdminNavLink() {
    const adminNavLink = document.getElementById('admin-nav-link');
    if (currentUser && currentUser.role === 'admin' && adminNavLink) {
        adminNavLink.style.display = 'block';
    }
}

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
    
    const loginNotice = document.getElementById('login-notice');
    const feedbackForm = document.getElementById('feedback-form');
    
    if (!currentUser) {
        loginNotice.style.display = 'block';
        feedbackForm.style.display = 'none';
    } else if (currentUser.role === 'admin') {
        // Администратор не может оставлять отзывы
        loginNotice.innerHTML = '<strong>⚠️ Администраторы не могут оставлять отзывы</strong>';
        loginNotice.style.display = 'block';
        feedbackForm.style.display = 'none';
    } else {
        loginNotice.style.display = 'none';
        feedbackForm.style.display = 'block';
        // Загружаем заказы пользователя
        loadUserOrders();
    }
}

// ============================================
// ЗАГРУЗКА ЗАКАЗОВ ПОЛЬЗОВАТЕЛЯ
// ============================================

async function loadUserOrders() {
    if (!currentUser) return;
    
    try {
        const response = await fetch(`${API_ENDPOINTS.orders}?userId=${currentUser.id}`);
        if (!response.ok) {
            throw new Error('Не удалось загрузить заказы');
        }
        
        userOrders = await response.json();
        console.log('✅ Заказы пользователя загружены:', userOrders.length);
        
        // Обновляем список товаров в селекте (только купленные)
        updateProductSelect();
        
    } catch (error) {
        console.error('❌ Ошибка загрузки заказов:', error);
    }
}

function updateProductSelect() {
    const productSelect = document.getElementById('product-select');
    productSelect.innerHTML = '<option value="">Выберите товар...</option>';
    
    if (userOrders.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'У вас пока нет купленных товаров';
        option.disabled = true;
        productSelect.appendChild(option);
        return;
    }
    
    // Собираем уникальные товары из заказов
    const purchasedProductIds = new Set();
    userOrders.forEach(order => {
        order.items.forEach(item => {
            purchasedProductIds.add(item.productId);
        });
    });
    
    // Добавляем только купленные товары
    products.forEach(product => {
        if (purchasedProductIds.has(product.id)) {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.name} - $${product.price}`;
            productSelect.appendChild(option);
        }
    });
    
    if (purchasedProductIds.size === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'У вас пока нет купленных товаров';
        option.disabled = true;
        productSelect.appendChild(option);
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
        
        // Заполняем фильтр товаров (все товары)
        populateProductFilter();
        
    } catch (error) {
        console.error('❌ Ошибка загрузки товаров:', error);
    }
}

function populateProductFilter() {
    const productFilter = document.getElementById('product-filter');
    productFilter.innerHTML = '<option value="">Все товары</option>';
    
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = product.name;
        productFilter.appendChild(option);
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
    
    // Показываем только одобренные отзывы
    filtered = filtered.filter(f => f.approved);
    
    if (productFilter) {
        filtered = filtered.filter(f => f.productId == productFilter);
    }
    
    if (ratingFilter) {
        filtered = filtered.filter(f => f.rating == ratingFilter);
    }
    
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
    if (starRating) {
        starRating.addEventListener('mouseleave', () => {
            highlightStars(selectedRating);
        });
    }
    
    // Форма отзыва
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await submitFeedback();
        });
    }
    
    // Валидация длины комментария
    const commentField = document.getElementById('comment');
    if (commentField) {
        commentField.addEventListener('input', () => {
            validateComment();
            updateCommentCount();
        });
    }
}

function updateCommentCount() {
    const comment = document.getElementById('comment').value;
    const countEl = document.getElementById('comment-count');
    if (countEl) {
        countEl.textContent = comment.length;
        
        if (comment.length >= MIN_COMMENT_LENGTH) {
            countEl.style.color = '#28a745';
        } else {
            countEl.style.color = '#e74c3c';
        }
    }
}

function validateComment() {
    const comment = document.getElementById('comment').value.trim();
    const commentField = document.getElementById('comment');
    
    if (comment.length > 0 && comment.length < MIN_COMMENT_LENGTH) {
        commentField.style.borderColor = '#e74c3c';
        return false;
    } else {
        commentField.style.borderColor = '#e0e0e0';
        return true;
    }
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
    
    // Проверка роли
    if (currentUser.role === 'admin') {
        alert('Администраторы не могут оставлять отзывы');
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
    
    if (comment.length < MIN_COMMENT_LENGTH) {
        alert(`Отзыв должен содержать минимум ${MIN_COMMENT_LENGTH} символов`);
        return;
    }
    
    // Проверка, что товар был куплен
    const isPurchased = userOrders.some(order => 
        order.items.some(item => item.productId === productId)
    );
    
    if (!isPurchased) {
        alert('Вы можете оставить отзыв только на купленный товар');
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
            approved: true
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
