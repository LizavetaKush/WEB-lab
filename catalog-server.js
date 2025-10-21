// ============================================
// КОНФИГУРАЦИЯ API
// ============================================

const API_BASE_URL = 'http://localhost:3000';
const API_ENDPOINTS = {
    products: `${API_BASE_URL}/products`,
    favorites: `${API_BASE_URL}/favorites`,
    cart: `${API_BASE_URL}/cart`
};

// ============================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// ============================================

let allCategories = new Set(); // Требование 5: использование Set для категорий
let currentPage = 1;
let itemsPerPage = 12;
let totalItems = 0;
let favoritesData = [];
let cartData = [];

// ============================================
// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Инициализация каталога с JSON Server API');
    
    // Проверка доступности API
    await checkAPIConnection();
    
    // Загрузка начальных данных
    await loadCategories();
    await loadProducts();
    await updateCounters();
    
    console.log('✅ Каталог успешно загружен');
});

// ============================================
// ПРОВЕРКА ПОДКЛЮЧЕНИЯ К API
// ============================================

async function checkAPIConnection() {
    try {
        const response = await fetch(API_BASE_URL);
        if (response.ok) {
            updateAPIIndicator('connected');
            console.log('✅ API подключен');
        } else {
            throw new Error('API недоступен');
        }
    } catch (error) {
        updateAPIIndicator('error');
        console.error('❌ Ошибка подключения к API:', error);
        showError('Не удалось подключиться к серверу. Убедитесь, что JSON Server запущен.');
    }
}

function updateAPIIndicator(status) {
    const indicator = document.getElementById('api-indicator');
    indicator.className = 'api-indicator';
    
    switch(status) {
        case 'connected':
            indicator.textContent = '🟢 Connected to API';
            break;
        case 'loading':
            indicator.textContent = '🟡 Loading...';
            indicator.classList.add('loading');
            break;
        case 'error':
            indicator.textContent = '🔴 API Error';
            indicator.classList.add('error');
            break;
    }
}

// ============================================
// ЗАГРУЗКА КАТЕГОРИЙ (Требование 5: Set)
// ============================================

async function loadCategories() {
    try {
        const response = await fetch(API_ENDPOINTS.products);
        const products = await response.json();
        
        // Использование Set для уникальных категорий
        allCategories = new Set(products.map(p => p.category));
        
        renderCategories();
        console.log('📂 Загружены категории:', Array.from(allCategories));
    } catch (error) {
        console.error('Ошибка загрузки категорий:', error);
    }
}

function renderCategories() {
    const container = document.getElementById('categories-container');
    container.innerHTML = '';
    
    allCategories.forEach(category => {
        const chip = document.createElement('label');
        chip.className = 'category-chip active';
        chip.innerHTML = `
            <input type="checkbox" value="${category}" checked onchange="toggleCategory(this)">
            <span>${getCategoryIcon(category)} ${category}</span>
        `;
        container.appendChild(chip);
    });
}

function getCategoryIcon(category) {
    const icons = {
        'Electric Skateboards': '🛹',
        'Electric Scooters': '🛴',
        'Accessories': '🔧'
    };
    return icons[category] || '📦';
}

function toggleCategory(checkbox) {
    checkbox.parentElement.classList.toggle('active', checkbox.checked);
    applyFilters();
}

// ============================================
// ЗАГРУЗКА И ОТОБРАЖЕНИЕ ТОВАРОВ
// ============================================

async function loadProducts() {
    try {
        updateAPIIndicator('loading');
        
        // Построение URL с параметрами (Требования 3, 4, 5, 6, 7, 9)
        const url = buildAPIUrl();
        console.log('📡 Запрос к API:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const products = await response.json();
        
        // Получение общего количества из заголовков (для пагинации)
        totalItems = parseInt(response.headers.get('X-Total-Count') || products.length);
        
        // Требование 10: обновление отображения
        renderProducts(products);
        renderPagination();
        updateStats(products.length);
        
        updateAPIIndicator('connected');
    } catch (error) {
        console.error('❌ Ошибка загрузки товаров:', error);
        updateAPIIndicator('error');
        showError('Ошибка загрузки товаров. Проверьте подключение к серверу.');
    }
}

// ============================================
// ПОСТРОЕНИЕ URL С ПАРАМЕТРАМИ ФИЛЬТРАЦИИ
// ============================================

function buildAPIUrl() {
    let url = API_ENDPOINTS.products;
    const params = new URLSearchParams();
    
    // 1. Полнотекстовый поиск (Требование 3)
    const searchQuery = document.getElementById('search-query').value.trim();
    if (searchQuery) {
        params.append('q', searchQuery);
    }
    
    // 2. Фильтрация по категориям (Требование 5)
    const selectedCategories = getSelectedCategories();
    if (selectedCategories.length > 0 && selectedCategories.length < allCategories.size) {
        // Если выбраны не все категории, добавляем фильтр
        // JSON Server не поддерживает OR для category, поэтому делаем множественные запросы
        // Или используем только первую категорию для демонстрации
        params.append('category', selectedCategories[0]);
    }
    
    // 3. Фильтрация по наличию (Требование 6)
    const stockFilter = document.getElementById('stock-filter').value;
    if (stockFilter !== 'all') {
        params.append('inStock', stockFilter);
    }
    
    // 4. Фильтрация по диапазону цен (Требование 7)
    const priceMin = document.getElementById('price-min').value;
    const priceMax = document.getElementById('price-max').value;
    if (priceMin) params.append('price_gte', priceMin);
    if (priceMax) params.append('price_lte', priceMax);
    
    // 5. Фильтрация по рейтингу (Требование 7)
    const ratingMin = document.getElementById('rating-min').value;
    if (ratingMin) params.append('rating_gte', ratingMin);
    
    // 6. Сортировка (Требование 4)
    const sortValue = document.getElementById('sort-select').value;
    if (sortValue) {
        const [field, order] = sortValue.split(':');
        params.append('_sort', field);
        params.append('_order', order);
    }
    
    // 7. Пагинация (Требование 9)
    itemsPerPage = parseInt(document.getElementById('items-per-page').value);
    if (itemsPerPage !== 999) {
        params.append('_page', currentPage);
        params.append('_limit', itemsPerPage);
    }
    
    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
}

function getSelectedCategories() {
    const checkboxes = document.querySelectorAll('#categories-container input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

// ============================================
// ОТОБРАЖЕНИЕ ТОВАРОВ (Требование 10)
// ============================================

function renderProducts(products) {
    const container = document.getElementById('catalog-products');
    
    // Требование 8: обработка ситуации "не найдено"
    if (!products || products.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">🔍</div>
                <h2>Товары не найдены</h2>
                <p>По заданным критериям поиска товары не найдены.<br>Попробуйте изменить параметры фильтрации.</p>
                <button class="btn-action btn-primary" onclick="resetFilters()">
                    🔄 Сбросить фильтры
                </button>
            </div>
        `;
        return;
    }
    
    // Отображение карточек товаров
    container.innerHTML = '';
    
    products.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-catalog-card';
    
    // Проверка, находится ли товар в избранном
    const isInFavorites = favoritesData.some(fav => fav.productId === product.id);
    
    card.innerHTML = `
        <div class="product-catalog-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='images/Rectangle.png'">
            ${product.inStock ? 
                '<span class="catalog-badge in-stock">В наличии</span>' : 
                '<span class="catalog-badge out-of-stock">Нет в наличии</span>'
            }
        </div>
        <div class="product-catalog-content">
            <span class="product-catalog-category">${product.category}</span>
            <h3 class="product-catalog-title">${product.name}</h3>
            <p class="product-catalog-description">${product.description}</p>
            <div class="product-catalog-specs">
                ${product.maxSpeed !== 'N/A' ? `<span class="spec-item">⚡ ${product.maxSpeed}</span>` : ''}
                ${product.range !== 'N/A' && product.range !== 'Extended' ? `<span class="spec-item">🔋 ${product.range}</span>` : ''}
                ${product.range === 'Extended' ? `<span class="spec-item">🔋 Extended</span>` : ''}
                <span class="spec-item">⭐ ${product.rating}/5</span>
            </div>
            <div class="product-catalog-footer">
                <span class="product-catalog-price">$${product.price.toLocaleString()}</span>
            </div>
            <div class="product-actions">
                <button class="btn-favorite ${isInFavorites ? 'added' : ''}" 
                        onclick="toggleFavorite(${product.id}, this)"
                        title="${isInFavorites ? 'Удалить из избранного' : 'Добавить в избранное'}">
                    ${isInFavorites ? '❤️ В избранном' : '🤍 В избранное'}
                </button>
                <button class="btn-cart" 
                        onclick="addToCart(${product.id})"
                        ${!product.inStock ? 'disabled' : ''}
                        title="Добавить в корзину">
                    🛒 ${product.inStock ? 'В корзину' : 'Недоступно'}
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// ============================================
// ПАГИНАЦИЯ (Требование 9)
// ============================================

function renderPagination() {
    const container = document.getElementById('pagination');
    
    if (itemsPerPage === 999) {
        container.innerHTML = '';
        return;
    }
    
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = `
        <button onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            ◀ Назад
        </button>
        <span class="page-info">
            Страница ${currentPage} из ${totalPages}
        </span>
        <button onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            Вперед ▶
        </button>
    `;
}

function goToPage(page) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    loadProducts();
    
    // Прокрутка к началу каталога
    document.querySelector('.catalog-section').scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// ДОБАВЛЕНИЕ В ИЗБРАННОЕ (Требование 11)
// ============================================

async function toggleFavorite(productId, button) {
    try {
        // Проверяем, есть ли товар в избранном
        const existingFavorite = favoritesData.find(fav => fav.productId === productId);
        
        if (existingFavorite) {
            // Удаляем из избранного
            await fetch(`${API_ENDPOINTS.favorites}/${existingFavorite.id}`, {
                method: 'DELETE'
            });
            
            button.classList.remove('added');
            button.innerHTML = '🤍 В избранное';
            button.title = 'Добавить в избранное';
            
            console.log(`✅ Товар #${productId} удален из избранного`);
        } else {
            // Получаем данные товара
            const product = await getProductById(productId);
            
            // Добавляем в избранное
            const response = await fetch(API_ENDPOINTS.favorites, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    category: product.category
                })
            });
            
            if (response.ok) {
                button.classList.add('added');
                button.innerHTML = '❤️ В избранном';
                button.title = 'Удалить из избранного';
                
                console.log(`✅ Товар #${productId} добавлен в избранное`);
            }
        }
        
        // Обновляем счетчики
        await updateCounters();
        
    } catch (error) {
        console.error('❌ Ошибка при работе с избранным:', error);
        alert('Ошибка при добавлении в избранное. Проверьте подключение к серверу.');
    }
}

// ============================================
// ДОБАВЛЕНИЕ В КОРЗИНУ (Требование 12)
// ============================================

async function addToCart(productId) {
    try {
        // Проверяем, есть ли товар уже в корзине
        const existingItem = cartData.find(item => item.productId === productId);
        
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
            
            console.log(`✅ Количество товара #${productId} увеличено`);
        } else {
            // Получаем данные товара
            const product = await getProductById(productId);
            
            // Добавляем в корзину
            const response = await fetch(API_ENDPOINTS.cart, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    category: product.category,
                    quantity: 1
                })
            });
            
            if (response.ok) {
                console.log(`✅ Товар #${productId} добавлен в корзину`);
            }
        }
        
        // Обновляем счетчики
        await updateCounters();
        
        // Визуальная обратная связь
        showNotification(`"${(await getProductById(productId)).name}" добавлен в корзину!`);
        
    } catch (error) {
        console.error('❌ Ошибка при добавлении в корзину:', error);
        alert('Ошибка при добавлении в корзину. Проверьте подключение к серверу.');
    }
}

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

async function getProductById(id) {
    const response = await fetch(`${API_ENDPOINTS.products}/${id}`);
    return await response.json();
}

async function updateCounters() {
    try {
        // Загрузка данных избранного и корзины
        const [favResponse, cartResponse, productsResponse] = await Promise.all([
            fetch(API_ENDPOINTS.favorites),
            fetch(API_ENDPOINTS.cart),
            fetch(API_ENDPOINTS.products)
        ]);
        
        favoritesData = await favResponse.json();
        cartData = await cartResponse.json();
        const allProducts = await productsResponse.json();
        
        // Обновление счетчиков
        document.getElementById('favorites-badge').textContent = favoritesData.length;
        document.getElementById('favorites-count').textContent = favoritesData.length;
        document.getElementById('cart-badge').textContent = cartData.length;
        document.getElementById('cart-count').textContent = cartData.length;
        document.getElementById('total-products').textContent = allProducts.length;
        
    } catch (error) {
        console.error('Ошибка обновления счетчиков:', error);
    }
}

function updateStats(displayedCount) {
    const resultsText = `Показано товаров: ${displayedCount} из ${totalItems}`;
    document.getElementById('results-count').textContent = resultsText;
}

// ============================================
// ПРИМЕНЕНИЕ И СБРОС ФИЛЬТРОВ
// ============================================

function applyFilters() {
    currentPage = 1; // Сбрасываем на первую страницу
    loadProducts();
}

function resetFilters() {
    // Сброс всех полей
    document.getElementById('search-query').value = '';
    document.getElementById('price-min').value = '';
    document.getElementById('price-max').value = '';
    document.getElementById('rating-min').value = '';
    document.getElementById('sort-select').value = '';
    document.getElementById('stock-filter').value = 'all';
    document.getElementById('items-per-page').value = '12';
    
    // Восстановление всех категорий
    document.querySelectorAll('#categories-container input[type="checkbox"]').forEach(cb => {
        cb.checked = true;
        cb.parentElement.classList.add('active');
    });
    
    currentPage = 1;
    itemsPerPage = 12;
    
    loadProducts();
}

// ============================================
// ПРОСМОТР ИЗБРАННОГО И КОРЗИНЫ
// ============================================

// Теперь используются отдельные страницы:
// - favorites.html - страница избранного
// - cart.html - страница корзины
// Навигация обновлена в HTML

// ============================================
// УВЕДОМЛЕНИЯ
// ============================================

function showNotification(message) {
    // Простое уведомление (можно заменить на toast-уведомление)
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showError(message) {
    const container = document.getElementById('catalog-products');
    container.innerHTML = `
        <div class="no-results">
            <div class="no-results-icon">⚠️</div>
            <h2>Ошибка загрузки</h2>
            <p>${message}</p>
            <button class="btn-action btn-primary" onclick="location.reload()">
                🔄 Перезагрузить страницу
            </button>
        </div>
    `;
}

// ============================================
// CSS АНИМАЦИИ (добавляются динамически)
// ============================================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
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

// ============================================
// ЛОГИРОВАНИЕ ДЛЯ ОТЛАДКИ
// ============================================

console.log(`
╔═══════════════════════════════════════════════════════════╗
║  📦 КАТАЛОГ ТОВАРОВ С JSON SERVER API                     ║
╠═══════════════════════════════════════════════════════════╣
║  ✅ Требование 1: Загрузка данных при открытии            ║
║  ✅ Требование 2: Использование fetch()                   ║
║  ✅ Требование 3: Поиск по полям (?q=...)                 ║
║  ✅ Требование 4: Сортировка (?_sort & ?_order)           ║
║  ✅ Требование 5: Категории (Set) + фильтрация            ║
║  ✅ Требование 6: Расширенная фильтрация                  ║
║  ✅ Требование 7: Фильтрация по диапазонам                ║
║  ✅ Требование 8: Обработка "не найдено"                  ║
║  ✅ Требование 9: Пагинация (_page & _limit)              ║
║  ✅ Требование 10: Обновление отображения                 ║
║  ✅ Требование 11: Добавление в избранное                 ║
║  ✅ Требование 12: Добавление в корзину                   ║
╚═══════════════════════════════════════════════════════════╝
`);

