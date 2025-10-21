// ============================================
// SHOPPING CART PAGE - JavaScript
// ============================================

const API_BASE_URL = 'http://localhost:3000';
const API_ENDPOINTS = {
    cart: `${API_BASE_URL}/cart`,
    favorites: `${API_BASE_URL}/favorites`,
    products: `${API_BASE_URL}/products`
};

let cartData = [];

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🛒 Загрузка страницы корзины');
    await loadCart();
    await updateCounters();
});

// ============================================
// ЗАГРУЗКА КОРЗИНЫ
// ============================================

async function loadCart() {
    try {
        const response = await fetch(API_ENDPOINTS.cart);
        
        if (!response.ok) {
            throw new Error('Не удалось загрузить корзину');
        }
        
        cartData = await response.json();
        renderCart();
        
        console.log('✅ Корзина загружена:', cartData.length, 'позиций');
        
    } catch (error) {
        console.error('❌ Ошибка загрузки корзины:', error);
        showError();
    }
}

// ============================================
// ОТОБРАЖЕНИЕ КОРЗИНЫ
// ============================================

function renderCart() {
    const container = document.getElementById('cart-container');
    
    // Если корзина пуста
    if (cartData.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🛒</div>
                <h2 class="empty-title">Ваша корзина пуста</h2>
                <p class="empty-text">
                    Вы еще не добавили ни одного товара в корзину.<br>
                    Начните покупки прямо сейчас!
                </p>
                <a href="catalog-server.html" class="btn-browse">
                    🛹 Перейти в каталог
                </a>
            </div>
        `;
        return;
    }
    
    // Отображение товаров и сводки
    container.innerHTML = `
        <div class="cart-layout">
            <div class="cart-items">
                <h2 style="margin-bottom: 20px; font-size: 1.8em;">
                    Товары в корзине (${cartData.length})
                </h2>
                <div id="cart-items-list"></div>
            </div>
            <div class="cart-summary">
                <h2 class="summary-title">Сводка заказа</h2>
                <div id="summary-details"></div>
                <button class="btn-checkout" onclick="checkout()">
                    ✅ Оформить заказ
                </button>
                <a href="catalog-server.html" class="continue-shopping">
                    ← Продолжить покупки
                </a>
            </div>
        </div>
    `;
    
    renderCartItems();
    renderSummary();
}

function renderCartItems() {
    const list = document.getElementById('cart-items-list');
    
    cartData.forEach(item => {
        const card = createCartItem(item);
        list.appendChild(card);
    });
}

function createCartItem(item) {
    const div = document.createElement('div');
    div.className = 'cart-item';
    
    const itemTotal = item.price * item.quantity;
    
    div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="item-image" onerror="this.src='images/Rectangle.png'">
        <div class="item-details">
            <div>
                <div class="item-category">${item.category || 'Товар'}</div>
                <h3 class="item-name">${item.name}</h3>
            </div>
            <div class="item-price">$${item.price.toLocaleString()} × ${item.quantity}</div>
        </div>
        <div class="item-actions">
            <div class="item-total">$${itemTotal.toLocaleString()}</div>
            <div class="quantity-controls">
                <button class="qty-btn" onclick="changeQuantity(${item.id}, ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>
                    −
                </button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn" onclick="changeQuantity(${item.id}, ${item.quantity + 1})">
                    +
                </button>
            </div>
            <button class="btn-remove" onclick="removeFromCart(${item.id})">
                🗑️ Удалить
            </button>
        </div>
    `;
    
    return div;
}

// ============================================
// РАСЧЕТ ОБЩЕЙ СТОИМОСТИ (Требование 4)
// ============================================

function renderSummary() {
    const details = document.getElementById('summary-details');
    
    const subtotal = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% налог
    const shipping = subtotal > 500 ? 0 : 50; // Бесплатная доставка при заказе > $500
    const total = subtotal + tax + shipping;
    
    details.innerHTML = `
        <div class="summary-row">
            <span class="summary-label">Товаров:</span>
            <span class="summary-value">${cartData.reduce((sum, item) => sum + item.quantity, 0)} шт.</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Подытог:</span>
            <span class="summary-value">$${subtotal.toLocaleString()}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Налог (10%):</span>
            <span class="summary-value">$${tax.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span class="summary-label">Доставка:</span>
            <span class="summary-value">${shipping === 0 ? 'Бесплатно' : '$' + shipping}</span>
        </div>
        <div class="summary-row total">
            <span>Итого:</span>
            <span>$${total.toFixed(2)}</span>
        </div>
    `;
}

// ============================================
// ИЗМЕНЕНИЕ КОЛИЧЕСТВА (Требование 3)
// ============================================

async function changeQuantity(cartId, newQuantity) {
    if (newQuantity < 1) {
        // Если количество меньше 1, удаляем товар
        await removeFromCart(cartId);
        return;
    }
    
    try {
        const response = await fetch(`${API_ENDPOINTS.cart}/${cartId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quantity: newQuantity
            })
        });
        
        if (response.ok) {
            await loadCart();
            console.log(`✅ Количество обновлено для товара #${cartId}: ${newQuantity}`);
        } else {
            throw new Error('Ошибка при обновлении количества');
        }
        
    } catch (error) {
        console.error('❌ Ошибка при изменении количества:', error);
        alert('Не удалось изменить количество. Попробуйте еще раз.');
    }
}

// ============================================
// УДАЛЕНИЕ ИЗ КОРЗИНЫ (Требование 2)
// ============================================

async function removeFromCart(cartId) {
    try {
        const item = cartData.find(c => c.id === cartId);
        
        if (!confirm(`Удалить "${item.name}" из корзины?`)) {
            return;
        }
        
        const response = await fetch(`${API_ENDPOINTS.cart}/${cartId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await loadCart();
            await updateCounters();
            
            console.log(`✅ Товар #${cartId} удален из корзины`);
        } else {
            throw new Error('Ошибка при удалении');
        }
        
    } catch (error) {
        console.error('❌ Ошибка при удалении:', error);
        alert('Не удалось удалить товар. Попробуйте еще раз.');
    }
}

// ============================================
// ОФОРМЛЕНИЕ ЗАКАЗА (Требование 5)
// ============================================

async function checkout() {
    try {
        // Сохраняем данные заказа для модального окна
        const orderTotal = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const orderItems = cartData.length;
        
        // Очищаем корзину на сервере
        const deletePromises = cartData.map(item => 
            fetch(`${API_ENDPOINTS.cart}/${item.id}`, {
                method: 'DELETE'
            })
        );
        
        await Promise.all(deletePromises);
        
        console.log('✅ Заказ успешно оформлен!');
        console.log(`Товаров: ${orderItems}, Сумма: $${orderTotal.toFixed(2)}`);
        
        // Показываем модальное окно успеха
        showSuccessModal(orderItems, orderTotal);
        
        // Обновляем корзину
        await loadCart();
        await updateCounters();
        
    } catch (error) {
        console.error('❌ Ошибка при оформлении заказа:', error);
        alert('Не удалось оформить заказ. Попробуйте еще раз.');
    }
}

// ============================================
// МОДАЛЬНОЕ ОКНО УСПЕШНОЙ ПОКУПКИ
// ============================================

function showSuccessModal(itemsCount, total) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-icon">🎉</div>
            <h2 class="modal-title">Заказ успешно оформлен!</h2>
            <p class="modal-text">
                Спасибо за покупку!<br>
                <strong>Товаров: ${itemsCount}</strong><br>
                <strong>Сумма: $${total.toFixed(2)}</strong><br><br>
                Мы отправили подтверждение на вашу электронную почту.<br>
                Ожидайте доставку в течение 3-5 рабочих дней.
            </p>
            <div class="modal-buttons">
                <button class="modal-btn btn-primary-modal" onclick="closeModalAndRedirect('catalog-server.html')">
                    🛹 Продолжить покупки
                </button>
                <button class="modal-btn btn-secondary-modal" onclick="closeModal()">
                    Закрыть
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Закрытие по клику вне модального окна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => modal.remove(), 300);
    }
}

function closeModalAndRedirect(url) {
    closeModal();
    setTimeout(() => {
        window.location.href = url;
    }, 300);
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
// ОБРАБОТКА ОШИБОК
// ============================================

function showError() {
    const container = document.getElementById('cart-container');
    container.innerHTML = `
        <div class="empty-cart">
            <div class="empty-icon">⚠️</div>
            <h2 class="empty-title">Ошибка загрузки</h2>
            <p class="empty-text">
                Не удалось загрузить корзину.<br>
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
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('🛒 Страница корзины инициализирована');

