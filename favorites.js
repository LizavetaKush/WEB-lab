// ============================================
// FAVORITES PAGE - JavaScript
// ============================================

const API_BASE_URL = 'http://localhost:3000';
const API_ENDPOINTS = {
    favorites: `${API_BASE_URL}/favorites`,
    cart: `${API_BASE_URL}/cart`,
    products: `${API_BASE_URL}/products`
};

let favoritesData = [];
let cartData = [];

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('❤️ Загрузка страницы избранного');
    await loadFavorites();
    await updateCounters();
});

// ============================================
// ЗАГРУЗКА ИЗБРАННОГО
// ============================================

async function loadFavorites() {
    try {
        const response = await fetch(API_ENDPOINTS.favorites);
        
        if (!response.ok) {
            throw new Error('Не удалось загрузить избранное');
        }
        
        favoritesData = await response.json();
        renderFavorites();
        updateStats();
        
        console.log('✅ Избранное загружено:', favoritesData.length, 'товаров');
        
    } catch (error) {
        console.error('❌ Ошибка загрузки избранного:', error);
        showError();
    }
}

// ============================================
// ОТОБРАЖЕНИЕ ИЗБРАННОГО
// ============================================

function renderFavorites() {
    const container = document.getElementById('favorites-container');
    
    // Если избранное пусто
    if (favoritesData.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💔</div>
                <h2 class="empty-title">Ваше избранное пусто</h2>
                <p class="empty-text">
                    Вы еще не добавили ни одного товара в избранное.<br>
                    Начните с просмотра нашего каталога!
                </p>
                <a href="catalog-server.html" class="btn-browse">
                    🛹 Перейти в каталог
                </a>
            </div>
        `;
        return;
    }
    
    // Отображение товаров
    container.innerHTML = '<div class="favorites-grid" id="favorites-grid"></div>';
    const grid = document.getElementById('favorites-grid');
    
    favoritesData.forEach(item => {
        const card = createFavoriteCard(item);
        grid.appendChild(card);
    });
}

function createFavoriteCard(item) {
    const card = document.createElement('div');
    card.className = 'favorite-card';
    
    card.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="favorite-image" onerror="this.src='images/Rectangle.png'">
        <div class="favorite-content">
            <div class="favorite-category">${item.category || 'Товар'}</div>
            <h3 class="favorite-name">${item.name}</h3>
            <div class="favorite-price">$${item.price.toLocaleString()}</div>
            <div class="favorite-actions">
                <button class="btn-remove" onclick="removeFromFavorites(${item.id})">
                    🗑️ Удалить
                </button>
                <button class="btn-add-cart" onclick="moveToCart(${item.id})">
                    🛒 В корзину
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// ============================================
// УДАЛЕНИЕ ИЗ ИЗБРАННОГО (Требование 1)
// ============================================

async function removeFromFavorites(favoriteId) {
    try {
        const item = favoritesData.find(f => f.id === favoriteId);
        
        if (!confirm(`Удалить "${item.name}" из избранного?`)) {
            return;
        }
        
        const response = await fetch(`${API_ENDPOINTS.favorites}/${favoriteId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification(`"${item.name}" удален из избранного`);
            await loadFavorites();
            await updateCounters();
            
            console.log(`✅ Товар #${favoriteId} удален из избранного`);
        } else {
            throw new Error('Ошибка при удалении');
        }
        
    } catch (error) {
        console.error('❌ Ошибка при удалении:', error);
        alert('Не удалось удалить товар. Попробуйте еще раз.');
    }
}

// ============================================
// ПЕРЕМЕЩЕНИЕ В КОРЗИНУ
// ============================================

async function moveToCart(favoriteId) {
    try {
        const item = favoritesData.find(f => f.id === favoriteId);
        
        // Проверяем, есть ли товар уже в корзине
        const cartResponse = await fetch(API_ENDPOINTS.cart);
        const cartItems = await cartResponse.json();
        const existingItem = cartItems.find(c => c.productId === item.productId);
        
        if (existingItem) {
            // Увеличиваем количество
            await fetch(`${API_ENDPOINTS.cart}/${existingItem.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    quantity: existingItem.quantity + 1
                })
            });
        } else {
            // Добавляем новый товар
            await fetch(API_ENDPOINTS.cart, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    category: item.category,
                    quantity: 1
                })
            });
        }
        
        showNotification(`"${item.name}" добавлен в корзину!`, 'success');
        await updateCounters();
        
        console.log(`✅ Товар "${item.name}" добавлен в корзину`);
        
    } catch (error) {
        console.error('❌ Ошибка при добавлении в корзину:', error);
        alert('Не удалось добавить товар в корзину.');
    }
}

// ============================================
// ОБНОВЛЕНИЕ СТАТИСТИКИ
// ============================================

function updateStats() {
    const totalItems = favoritesData.length;
    const totalValue = favoritesData.reduce((sum, item) => sum + item.price, 0);
    
    document.getElementById('total-items').textContent = totalItems;
    document.getElementById('total-value').textContent = `$${totalValue.toLocaleString()}`;
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
        
        document.getElementById('favorites-count').textContent = favorites.length;
        document.getElementById('cart-count').textContent = cart.length;
        
    } catch (error) {
        console.error('Ошибка обновления счетчиков:', error);
    }
}

// ============================================
// УВЕДОМЛЕНИЯ
// ============================================

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #ef5350 0%, #e53935 100%)';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showError() {
    const container = document.getElementById('favorites-container');
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">⚠️</div>
            <h2 class="empty-title">Ошибка загрузки</h2>
            <p class="empty-text">
                Не удалось загрузить избранное.<br>
                Убедитесь, что JSON Server запущен.
            </p>
            <button class="btn-browse" onclick="location.reload()">
                🔄 Перезагрузить страницу
            </button>
        </div>
    `;
}

// ============================================
// CSS АНИМАЦИИ
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('❤️ Страница избранного инициализирована');

