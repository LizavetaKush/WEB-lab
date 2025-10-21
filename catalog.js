// Массив товаров (15 объектов с 6+ полями каждый)
const products = [
    {
        id: 1,
        name: "Boosted Stealth",
        price: 1599,
        category: "Electric Skateboards",
        image: "images/skate1.jpg",
        description: "The most powerful board ever made. Top speed: 24 mph, Range: 14 miles.",
        inStock: true,
        maxSpeed: "24 mph",
        range: "14 miles",
        rating: 4.9
    },
    {
        id: 2,
        name: "Boosted Plus",
        price: 1399,
        category: "Electric Skateboards",
        image: "images/skate2.jpg",
        description: "Extended range electric skateboard. Top speed: 22 mph, Range: 14 miles.",
        inStock: true,
        maxSpeed: "22 mph",
        range: "14 miles",
        rating: 4.7
    },
    {
        id: 3,
        name: "Boosted Mini X",
        price: 999,
        category: "Electric Skateboards",
        image: "images/skate3.jpg",
        description: "Compact yet powerful. Perfect for urban commuting. Top speed: 20 mph.",
        inStock: true,
        maxSpeed: "20 mph",
        range: "14 miles",
        rating: 4.6
    },
    {
        id: 4,
        name: "Boosted Rev",
        price: 1599,
        category: "Electric Scooters",
        image: "images/skoot1.jpg",
        description: "Revolutionary electric scooter. Speed past traffic at 24 mph.",
        inStock: true,
        maxSpeed: "24 mph",
        range: "22 miles",
        rating: 4.8
    },
    {
        id: 5,
        name: "Belt Kit",
        price: 25,
        category: "Accessories",
        image: "images/kit.jpg",
        description: "Replacement belt kit for your Boosted board. High-quality materials.",
        inStock: true,
        maxSpeed: "N/A",
        range: "N/A",
        rating: 4.3
    },
    {
        id: 6,
        name: "Bearing Service Kit",
        price: 50,
        category: "Accessories",
        image: "images/kit2.png",
        description: "Complete bearing service kit to keep your board running smoothly.",
        inStock: true,
        maxSpeed: "N/A",
        range: "N/A",
        rating: 4.5
    },
    {
        id: 7,
        name: "Motor Kits",
        price: 350,
        category: "Accessories",
        image: "images/motor-kits.jpg",
        description: "Replacement motor kits for enhanced performance and reliability.",
        inStock: false,
        maxSpeed: "N/A",
        range: "N/A",
        rating: 4.7
    },
    {
        id: 8,
        name: "Pulley Belt Upgrade",
        price: 75,
        category: "Accessories",
        image: "images/pulley-belt-upgrade.jpg",
        description: "Upgrade your pulley and belt system for better performance.",
        inStock: true,
        maxSpeed: "N/A",
        range: "N/A",
        rating: 4.4
    },
    {
        id: 9,
        name: "Skid Plates",
        price: 20,
        category: "Accessories",
        image: "images/skid-plates.jpg",
        description: "Protect the bottom of your board with durable skid plates.",
        inStock: true,
        maxSpeed: "N/A",
        range: "N/A",
        rating: 4.2
    },
    {
        id: 10,
        name: "Shred Lights",
        price: 99,
        category: "Accessories",
        image: "images/shred-lights.jpg",
        description: "Premium LED lights for safe night riding. Super bright and durable.",
        inStock: true,
        maxSpeed: "N/A",
        range: "N/A",
        rating: 4.6
    },
    {
        id: 11,
        name: "Boosted Mini S",
        price: 749,
        category: "Electric Skateboards",
        image: "images/boosted-mini.jpg",
        description: "Affordable and portable electric skateboard. Perfect for beginners.",
        inStock: true,
        maxSpeed: "18 mph",
        range: "7 miles",
        rating: 4.5
    },
    {
        id: 12,
        name: "Extended Battery",
        price: 299,
        category: "Accessories",
        image: "images/Extended Battery.jpg",
        description: "Extended range battery pack. Double your riding distance.",
        inStock: true,
        maxSpeed: "N/A",
        range: "Extended",
        rating: 4.8
    },
    {
        id: 13,
        name: "Remote Control",
        price: 99,
        category: "Accessories",
        image: "images/Remote Control.jpg",
        description: "Replacement wireless remote with precise throttle control.",
        inStock: true,
        maxSpeed: "N/A",
        range: "N/A",
        rating: 4.4
    },
    {
        id: 14,
        name: "Wheel Set - 85mm",
        price: 89,
        category: "Accessories",
        image: "images/Wheel Set - 85mm.jpg",
        description: "Premium urethane wheels for smooth rides. Set of 4 wheels.",
        inStock: false,
        maxSpeed: "N/A",
        range: "N/A",
        rating: 4.6
    },
    {
        id: 15,
        name: "Charging Cable",
        price: 45,
        category: "Accessories",
        image: "images/Charging Cable.jpg",
        description: "Fast charging cable for all Boosted boards and scooters.",
        inStock: true,
        maxSpeed: "N/A",
        range: "N/A",
        rating: 4.1
    }
];

// Функция для генерации карточек товаров
function generateProductCards() {
    const catalogContainer = document.getElementById('catalog-products');
    
    // Очистка контейнера (на случай повторного вызова)
    catalogContainer.innerHTML = '';
    
    // Генерация карточки для каждого товара
    products.forEach(product => {
        // Создание элемента карточки
        const card = document.createElement('div');
        card.className = 'product-catalog-card';
        
        // Добавление анимации появления с задержкой
        card.style.animationDelay = `${products.indexOf(product) * 0.1}s`;
        
        // Формирование HTML содержимого карточки
        card.innerHTML = `
            <div class="product-catalog-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.inStock ? 
                    '<span class="catalog-badge in-stock">In Stock</span>' : 
                    '<span class="catalog-badge out-of-stock">Out of Stock</span>'
                }
            </div>
            <div class="product-catalog-content">
                <span class="product-catalog-category">${product.category}</span>
                <h3 class="product-catalog-title">${product.name}</h3>
                <p class="product-catalog-description">${product.description}</p>
                <div class="product-catalog-specs">
                    ${product.maxSpeed !== 'N/A' ? `<span class="spec-item">⚡ ${product.maxSpeed}</span>` : ''}
                    ${product.range !== 'N/A' && product.range !== 'Extended' ? `<span class="spec-item">🔋 ${product.range}</span>` : ''}
                    ${product.range === 'Extended' ? `<span class="spec-item">🔋 Extended Range</span>` : ''}
                </div>
                <div class="product-catalog-footer">
                    <span class="product-catalog-price">$${product.price.toLocaleString()}</span>
                    <button class="product-catalog-btn ${!product.inStock ? 'disabled' : ''}" 
                            ${!product.inStock ? 'disabled' : ''}
                            onclick="addToCart(${product.id})">
                        ${product.inStock ? 'Add to Cart' : 'Sold Out'}
                    </button>
                </div>
            </div>
        `;
        
        // Добавление карточки в контейнер
        catalogContainer.appendChild(card);
    });
}

// Функция добавления в корзину (placeholder)
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product && product.inStock) {
        alert(`"${product.name}" has been added to your cart!\nPrice: $${product.price}`);
        // Здесь может быть реальная логика добавления в корзину
    }
}

// Переменные для хранения текущего состояния фильтров
let currentProducts = [...products];
let searchQuery = '';
let selectedCategories = ['Electric Skateboards', 'Electric Scooters', 'Accessories'];
let currentSort = 'default';

// Функция обновления информации о фильтре
function updateFilterInfo(description, count) {
    document.getElementById('filter-description').textContent = description;
    document.getElementById('product-count').textContent = `Showing ${count} product${count !== 1 ? 's' : ''}`;
}

// Функция обновления активной кнопки
function setActiveButton(clickedButton) {
    // Убираем класс active со всех кнопок
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    // Добавляем класс active к нажатой кнопке
    if (clickedButton) {
        clickedButton.classList.add('active');
    }
}

// Функция перегенерации карточек с текущим массивом
function updateCatalog(filteredProducts, description) {
    currentProducts = filteredProducts;
    
    const catalogContainer = document.getElementById('catalog-products');
    catalogContainer.innerHTML = '';
    
    // Проверка на пустые результаты
    if (filteredProducts.length === 0) {
        showNoResultsMessage();
        updateFilterInfo(description, 0);
        return;
    }
    
    // Генерация карточек
    filteredProducts.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-catalog-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="product-catalog-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.inStock ? 
                    '<span class="catalog-badge in-stock">In Stock</span>' : 
                    '<span class="catalog-badge out-of-stock">Out of Stock</span>'
                }
            </div>
            <div class="product-catalog-content">
                <span class="product-catalog-category">${product.category}</span>
                <h3 class="product-catalog-title">${product.name}</h3>
                <p class="product-catalog-description">${product.description}</p>
                <div class="product-catalog-specs">
                    ${product.maxSpeed !== 'N/A' ? `<span class="spec-item">⚡ ${product.maxSpeed}</span>` : ''}
                    ${product.range !== 'N/A' && product.range !== 'Extended' ? `<span class="spec-item">🔋 ${product.range}</span>` : ''}
                    ${product.range === 'Extended' ? `<span class="spec-item">🔋 Extended Range</span>` : ''}
                    <span class="spec-item">⭐ ${product.rating}/5</span>
                </div>
                <div class="product-catalog-footer">
                    <span class="product-catalog-price">$${product.price.toLocaleString()}</span>
                    <button class="product-catalog-btn ${!product.inStock ? 'disabled' : ''}" 
                            ${!product.inStock ? 'disabled' : ''}
                            onclick="addToCart(${product.id})">
                        ${product.inStock ? 'Add to Cart' : 'Sold Out'}
                    </button>
                </div>
            </div>
        `;
        
        catalogContainer.appendChild(card);
    });
    
    updateFilterInfo(description, filteredProducts.length);
}

// Функция отображения сообщения "Ничего не найдено"
function showNoResultsMessage() {
    const catalogContainer = document.getElementById('catalog-products');
    catalogContainer.innerHTML = `
        <div class="no-results-container">
            <div class="no-results-icon">🔍</div>
            <h2 class="no-results-title">No products found</h2>
            <p class="no-results-message">
                We couldn't find any products matching your search criteria.
                <br>Try adjusting your filters or search terms.
            </p>
            <button class="no-results-btn" onclick="resetAllFilters()">
                🔄 Reset All Filters
            </button>
        </div>
    `;
}

// ========================================
// МЕТОДЫ ФИЛЬТРАЦИИ И СОРТИРОВКИ МАССИВОВ
// ========================================

// 1. Показать все товары (reset)
function showAll() {
    updateCatalog([...products], 'Showing all products');
    setActiveButton(event.target.closest('.filter-btn'));
}

// 2. FILTER: Только электрические скейтборды
function filterSkateboards() {
    const filtered = products.filter(product => product.category === 'Electric Skateboards');
    updateCatalog(filtered, 'Electric Skateboards only');
    setActiveButton(event.target.closest('.filter-btn'));
}

// 3. FILTER: Только аксессуары
function filterAccessories() {
    const filtered = products.filter(product => product.category === 'Accessories');
    updateCatalog(filtered, 'Accessories only');
    setActiveButton(event.target.closest('.filter-btn'));
}

// 4. FILTER: Только товары в наличии
function filterInStock() {
    const filtered = products.filter(product => product.inStock === true);
    updateCatalog(filtered, 'In stock products only');
    setActiveButton(event.target.closest('.filter-btn'));
}

// 5. FILTER: Товары дешевле $100
function filterCheap() {
    const filtered = products.filter(product => product.price < 100);
    updateCatalog(filtered, 'Products under $100');
    setActiveButton(event.target.closest('.filter-btn'));
}

// 6. FILTER: Премиум товары (от $500)
function filterExpensive() {
    const filtered = products.filter(product => product.price >= 500);
    updateCatalog(filtered, 'Premium products ($500+)');
    setActiveButton(event.target.closest('.filter-btn'));
}

// 7. SORT: Сортировка по цене (возрастание)
function sortByPriceAsc() {
    const sorted = [...currentProducts].sort((a, b) => a.price - b.price);
    updateCatalog(sorted, 'Sorted by price: Low to High');
    setActiveButton(event.target.closest('.filter-btn'));
}

// 8. SORT: Сортировка по цене (убывание)
function sortByPriceDesc() {
    const sorted = [...currentProducts].sort((a, b) => b.price - a.price);
    updateCatalog(sorted, 'Sorted by price: High to Low');
    setActiveButton(event.target.closest('.filter-btn'));
}

// 9. SORT: Сортировка по названию (A-Z)
function sortByName() {
    const sorted = [...currentProducts].sort((a, b) => a.name.localeCompare(b.name));
    updateCatalog(sorted, 'Sorted alphabetically (A-Z)');
    setActiveButton(event.target.closest('.filter-btn'));
}

// 10. REVERSE: Обратный порядок
function reverseOrder() {
    const reversed = [...currentProducts].reverse();
    updateCatalog(reversed, 'Reversed order');
    setActiveButton(event.target.closest('.filter-btn'));
}

// ========================================
// ЭТАП 3: РАСШИРЕННАЯ ФИЛЬТРАЦИЯ И ПОИСК
// ========================================

// Функция применения всех фильтров одновременно
function applyAllFilters() {
    let filtered = [...products];
    
    // 1. Фильтрация по категориям
    if (selectedCategories.length > 0) {
        filtered = filtered.filter(product => selectedCategories.includes(product.category));
    }
    
    // 2. Поиск по названию и описанию
    if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(query) || 
            product.description.toLowerCase().includes(query)
        );
    }
    
    // 3. Сортировка
    filtered = applySorting(filtered, currentSort);
    
    // Обновление описания
    let description = 'Showing filtered products';
    if (searchQuery.trim() !== '') {
        description = `Search results for "${searchQuery}"`;
    } else if (selectedCategories.length < 3) {
        description = `Filtered by: ${selectedCategories.join(', ')}`;
    } else {
        description = 'Showing all products';
    }
    
    updateCatalog(filtered, description);
}

// Функция сортировки
function applySorting(productsArray, sortType) {
    const sorted = [...productsArray];
    
    switch(sortType) {
        case 'price-asc':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-desc':
            return sorted.sort((a, b) => b.price - a.price);
        case 'name-asc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case 'rating-desc':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'rating-asc':
            return sorted.sort((a, b) => a.rating - b.rating);
        default:
            return sorted; // Default order
    }
}

// Обработчик поиска (вызывается при вводе в поисковую строку)
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    searchQuery = searchInput.value;
    
    // Показать/скрыть кнопку очистки
    const clearBtn = document.getElementById('clear-search');
    if (searchQuery.trim() !== '') {
        clearBtn.style.display = 'block';
    } else {
        clearBtn.style.display = 'none';
    }
    
    applyAllFilters();
}

// Очистка поиска
function clearSearch() {
    const searchInput = document.getElementById('search-input');
    searchInput.value = '';
    searchQuery = '';
    document.getElementById('clear-search').style.display = 'none';
    applyAllFilters();
}

// Обработчик сортировки
function handleSort() {
    const sortSelect = document.getElementById('sort-select');
    currentSort = sortSelect.value;
    applyAllFilters();
}

// Обработчик фильтрации по категориям
function handleCategoryFilter() {
    const checkboxes = document.querySelectorAll('.category-checkbox');
    selectedCategories = [];
    
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedCategories.push(checkbox.value);
        }
    });
    
    applyAllFilters();
}

// Сброс всех фильтров
function resetAllFilters() {
    // Сброс поиска
    document.getElementById('search-input').value = '';
    searchQuery = '';
    document.getElementById('clear-search').style.display = 'none';
    
    // Сброс сортировки
    document.getElementById('sort-select').value = 'default';
    currentSort = 'default';
    
    // Сброс категорий (отметить все)
    const checkboxes = document.querySelectorAll('.category-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
    selectedCategories = ['Electric Skateboards', 'Electric Scooters', 'Accessories'];
    
    // Сброс кнопок фильтров (убрать active)
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Применить фильтры
    applyAllFilters();
}

// Запуск генерации карточек при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    applyAllFilters();
    console.log('Catalog loaded:', products.length, 'products');
    console.log('Advanced filtering system initialized');
});

