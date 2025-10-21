// ============================================
// ADMIN PANEL - JavaScript
// ============================================

const API_BASE_URL = 'http://localhost:3000';
const API_ENDPOINTS = {
    products: `${API_BASE_URL}/products`,
    feedback: `${API_BASE_URL}/feedback`,
    orders: `${API_BASE_URL}/orders`,
    users: `${API_BASE_URL}/users`,
    favorites: `${API_BASE_URL}/favorites`,
    cart: `${API_BASE_URL}/cart`
};

let currentUser = null;
let products = [];
let feedbackList = [];
let orders = [];
let editingProductId = null;

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('⚙️ Загрузка админ-панели');
    
    // Проверяем доступ
    if (!checkAdminAccess()) {
        showAccessDenied();
        return;
    }
    
    // Показываем админ-панель
    document.getElementById('access-check').style.display = 'none';
    document.getElementById('admin-main').style.display = 'block';
    
    // Загружаем данные
    await loadAllData();
    
    // Настраиваем обработчики
    setupEventHandlers();
    
    // Обновляем счетчики
    updateCounters();
});

// ============================================
// ПРОВЕРКА ДОСТУПА
// ============================================

function checkAdminAccess() {
    const userDataStr = localStorage.getItem('currentUser');
    if (!userDataStr) {
        return false;
    }
    
    try {
        currentUser = JSON.parse(userDataStr);
        if (currentUser.role !== 'admin') {
            return false;
        }
        console.log('✅ Админ авторизован:', currentUser.firstName);
        return true;
    } catch (e) {
        console.error('Ошибка при чтении данных пользователя:', e);
        return false;
    }
}

function showAccessDenied() {
    const accessCheck = document.getElementById('access-check');
    accessCheck.innerHTML = `
        <div class="access-denied">
            <div class="access-denied-icon">🔒</div>
            <h2 class="access-denied-title">Доступ запрещен</h2>
            <p class="access-denied-text">
                У вас нет прав для доступа к админ-панели.<br>
                Пожалуйста, войдите как администратор.
            </p>
            <a href="auth.html" class="btn-submit-admin">
                Войти
            </a>
        </div>
    `;
}

// ============================================
// ЗАГРУЗКА ДАННЫХ
// ============================================

async function loadAllData() {
    try {
        const [productsRes, feedbackRes, ordersRes] = await Promise.all([
            fetch(API_ENDPOINTS.products),
            fetch(API_ENDPOINTS.feedback),
            fetch(API_ENDPOINTS.orders)
        ]);
        
        products = await productsRes.json();
        feedbackList = await feedbackRes.json();
        orders = await ordersRes.json();
        
        console.log('✅ Данные загружены');
        console.log('Товары:', products.length);
        console.log('Отзывы:', feedbackList.length);
        console.log('Заказы:', orders.length);
        
        // Отображаем данные
        renderDashboard();
        renderProducts();
        renderFeedback();
        renderOrders();
        
    } catch (error) {
        console.error('❌ Ошибка загрузки данных:', error);
        alert('Не удалось загрузить данные. Проверьте, запущен ли JSON Server.');
    }
}

// ============================================
// ПЕРЕКЛЮЧЕНИЕ ПАНЕЛЕЙ
// ============================================

function switchPanel(panelName) {
    // Переключаем вкладки
    const tabs = document.querySelectorAll('.admin-tab');
    tabs.forEach(tab => {
        if (tab.textContent.toLowerCase().includes(getPanelKeyword(panelName))) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Переключаем панели
    const panels = document.querySelectorAll('.admin-panel');
    panels.forEach(panel => {
        if (panel.id === `${panelName}-panel`) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });
}

function getPanelKeyword(panelName) {
    const keywords = {
        'dashboard': 'статистика',
        'products': 'товарами',
        'feedback': 'отзывами',
        'orders': 'заказы'
    };
    return keywords[panelName] || panelName;
}

// ============================================
// ПАНЕЛЬ СТАТИСТИКИ
// ============================================

function renderDashboard() {
    const container = document.getElementById('stats-container');
    
    const totalProducts = products.length;
    const inStockProducts = products.filter(p => p.inStock).length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalFeedback = feedbackList.length;
    const avgRating = feedbackList.length > 0 
        ? (feedbackList.reduce((sum, f) => sum + f.rating, 0) / feedbackList.length).toFixed(1)
        : 0;
    
    container.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${totalProducts}</div>
            <div class="stat-label">📦 Всего товаров</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${inStockProducts}</div>
            <div class="stat-label">✅ В наличии</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${totalOrders}</div>
            <div class="stat-label">🛒 Заказов</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">$${totalRevenue.toFixed(2)}</div>
            <div class="stat-label">💰 Доход</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${totalFeedback}</div>
            <div class="stat-label">💬 Отзывов</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${avgRating}⭐</div>
            <div class="stat-label">📊 Средний рейтинг</div>
        </div>
    `;
}

// ============================================
// ПАНЕЛЬ ТОВАРОВ
// ============================================

function renderProducts() {
    const tbody = document.getElementById('products-tbody');
    tbody.innerHTML = '';
    
    products.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.id}</td>
            <td><strong>${product.name}</strong></td>
            <td>$${product.price}</td>
            <td>${product.category}</td>
            <td>
                <span class="badge ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                    ${product.inStock ? 'В наличии' : 'Нет в наличии'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-action btn-edit" onclick="editProduct(${product.id})">
                        ✏️ Изменить
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteProduct(${product.id})">
                        🗑️ Удалить
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ============================================
// УПРАВЛЕНИЕ ТОВАРАМИ
// ============================================

function openProductModal() {
    editingProductId = null;
    document.getElementById('product-modal-title').textContent = 'Добавить товар';
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('product-modal').classList.add('show');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.remove('show');
    editingProductId = null;
}

async function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    editingProductId = productId;
    
    document.getElementById('product-modal-title').textContent = 'Редактировать товар';
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-image').value = product.image;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-max-speed').value = product.maxSpeed || '';
    document.getElementById('product-range').value = product.range || '';
    document.getElementById('product-rating').value = product.rating || '';
    document.getElementById('product-in-stock').value = product.inStock ? 'true' : 'false';
    
    document.getElementById('product-modal').classList.add('show');
}

async function deleteProduct(productId) {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_ENDPOINTS.products}/${productId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Не удалось удалить товар');
        }
        
        console.log(`✅ Товар #${productId} удален`);
        alert('Товар успешно удален!');
        
        await loadAllData();
        
    } catch (error) {
        console.error('❌ Ошибка удаления товара:', error);
        alert('Не удалось удалить товар. Попробуйте еще раз.');
    }
}

// ============================================
// ПАНЕЛЬ ОТЗЫВОВ
// ============================================

function renderFeedback() {
    const tbody = document.getElementById('feedback-tbody');
    tbody.innerHTML = '';
    
    feedbackList.forEach(feedback => {
        const product = products.find(p => p.id === feedback.productId);
        const productName = product ? product.name : 'Товар не найден';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${feedback.id}</td>
            <td>${productName}</td>
            <td>${feedback.userName}</td>
            <td>${'⭐'.repeat(feedback.rating)}</td>
            <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${feedback.comment}
            </td>
            <td>
                <span class="badge ${feedback.approved ? 'approved' : 'pending'}">
                    ${feedback.approved ? 'Одобрен' : 'На модерации'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    ${!feedback.approved ? `
                        <button class="btn-action btn-approve" onclick="approveFeedback(${feedback.id})">
                            ✓ Одобрить
                        </button>
                    ` : ''}
                    <button class="btn-action btn-delete" onclick="deleteFeedback(${feedback.id})">
                        🗑️ Удалить
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function approveFeedback(feedbackId) {
    try {
        const response = await fetch(`${API_ENDPOINTS.feedback}/${feedbackId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                approved: true
            })
        });
        
        if (!response.ok) {
            throw new Error('Не удалось одобрить отзыв');
        }
        
        console.log(`✅ Отзыв #${feedbackId} одобрен`);
        alert('Отзыв одобрен!');
        
        await loadAllData();
        
    } catch (error) {
        console.error('❌ Ошибка одобрения отзыва:', error);
        alert('Не удалось одобрить отзыв. Попробуйте еще раз.');
    }
}

async function deleteFeedback(feedbackId) {
    if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_ENDPOINTS.feedback}/${feedbackId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Не удалось удалить отзыв');
        }
        
        console.log(`✅ Отзыв #${feedbackId} удален`);
        alert('Отзыв удален!');
        
        await loadAllData();
        
    } catch (error) {
        console.error('❌ Ошибка удаления отзыва:', error);
        alert('Не удалось удалить отзыв. Попробуйте еще раз.');
    }
}

// ============================================
// ПАНЕЛЬ ЗАКАЗОВ
// ============================================

function renderOrders() {
    const tbody = document.getElementById('orders-tbody');
    tbody.innerHTML = '';
    
    // Сортируем по дате (новые первые)
    const sortedOrders = [...orders].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    sortedOrders.forEach(order => {
        const date = new Date(order.createdAt).toLocaleDateString('ru-RU');
        const itemsCount = order.items.length;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>#${order.id}</strong></td>
            <td>${order.userName}</td>
            <td>${order.userEmail}</td>
            <td>${itemsCount} шт.</td>
            <td><strong>$${order.total.toFixed(2)}</strong></td>
            <td>${date}</td>
            <td>
                <span class="badge approved">
                    ${order.status}
                </span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ============================================
// ОБРАБОТЧИКИ СОБЫТИЙ
// ============================================

function setupEventHandlers() {
    // Форма товара
    const productForm = document.getElementById('product-form');
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveProduct();
    });
    
    // Закрытие модального окна по клику вне его
    const modal = document.getElementById('product-modal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeProductModal();
        }
    });
}

async function saveProduct() {
    const productData = {
        name: document.getElementById('product-name').value.trim(),
        price: parseFloat(document.getElementById('product-price').value),
        category: document.getElementById('product-category').value,
        image: document.getElementById('product-image').value.trim(),
        description: document.getElementById('product-description').value.trim(),
        maxSpeed: document.getElementById('product-max-speed').value.trim() || 'N/A',
        range: document.getElementById('product-range').value.trim() || 'N/A',
        rating: parseFloat(document.getElementById('product-rating').value) || 0,
        inStock: document.getElementById('product-in-stock').value === 'true'
    };
    
    try {
        let response;
        
        if (editingProductId) {
            // Обновляем существующий товар
            response = await fetch(`${API_ENDPOINTS.products}/${editingProductId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: editingProductId,
                    ...productData
                })
            });
        } else {
            // Создаем новый товар
            response = await fetch(API_ENDPOINTS.products, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
        }
        
        if (!response.ok) {
            throw new Error('Не удалось сохранить товар');
        }
        
        const savedProduct = await response.json();
        console.log('✅ Товар сохранен:', savedProduct);
        
        alert(editingProductId ? 'Товар обновлен!' : 'Товар добавлен!');
        
        closeProductModal();
        await loadAllData();
        
    } catch (error) {
        console.error('❌ Ошибка сохранения товара:', error);
        alert('Не удалось сохранить товар. Попробуйте еще раз.');
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

console.log('⚙️ Админ-панель инициализирована');

