# Документация по методам массивов JavaScript

## Этап 2 - Реализованные методы обработки массивов

В каталоге товаров реализовано **10 кнопок фильтрации и сортировки**, каждая из которых использует стандартные методы JavaScript для работы с массивами.

---

## 1. **Show All** - Сброс фильтров
**Метод:** Spread operator (`...`)
```javascript
function showAll() {
    const allProducts = [...products];
    updateCatalog(allProducts, 'Showing all products');
}
```
**Описание:** Создает копию исходного массива с помощью spread оператора и отображает все 15 товаров.

---

## 2. **Skateboards Only** - FILTER
**Метод:** `Array.prototype.filter()`
```javascript
function filterSkateboards() {
    const filtered = products.filter(product => product.category === 'Electric Skateboards');
    updateCatalog(filtered, 'Electric Skateboards only');
}
```
**Описание:** Метод `filter()` создает новый массив, содержащий только те элементы, которые прошли проверку (электрические скейтборды).

**Результат:** 4 товара

---

## 3. **Accessories Only** - FILTER
**Метод:** `Array.prototype.filter()`
```javascript
function filterAccessories() {
    const filtered = products.filter(product => product.category === 'Accessories');
    updateCatalog(filtered, 'Accessories only');
}
```
**Описание:** Фильтрует массив, оставляя только товары категории "Accessories".

**Результат:** 10 товаров

---

## 4. **In Stock Only** - FILTER
**Метод:** `Array.prototype.filter()`
```javascript
function filterInStock() {
    const filtered = products.filter(product => product.inStock === true);
    updateCatalog(filtered, 'In stock products only');
}
```
**Описание:** Отбирает только товары, которые есть в наличии (свойство `inStock === true`).

**Результат:** 13 товаров

---

## 5. **Under $100** - FILTER
**Метод:** `Array.prototype.filter()`
```javascript
function filterCheap() {
    const filtered = products.filter(product => product.price < 100);
    updateCatalog(filtered, 'Products under $100');
}
```
**Описание:** Фильтрует товары по условию: цена меньше $100.

**Результат:** 5 товаров

---

## 6. **Premium ($500+)** - FILTER
**Метод:** `Array.prototype.filter()`
```javascript
function filterExpensive() {
    const filtered = products.filter(product => product.price >= 500);
    updateCatalog(filtered, 'Premium products ($500+)');
}
```
**Описание:** Отбирает премиум товары с ценой от $500 и выше.

**Результат:** 5 товаров

---

## 7. **Price: Low to High** - SORT
**Метод:** `Array.prototype.sort()`
```javascript
function sortByPriceAsc() {
    const sorted = [...currentProducts].sort((a, b) => a.price - b.price);
    updateCatalog(sorted, 'Sorted by price: Low to High');
}
```
**Описание:** Метод `sort()` сортирует массив по возрастанию цены. Использует функцию сравнения `(a, b) => a.price - b.price`.

**Особенность:** Сортирует текущий отфильтрованный массив, а не исходный!

---

## 8. **Price: High to Low** - SORT
**Метод:** `Array.prototype.sort()`
```javascript
function sortByPriceDesc() {
    const sorted = [...currentProducts].sort((a, b) => b.price - a.price);
    updateCatalog(sorted, 'Sorted by price: High to Low');
}
```
**Описание:** Сортирует товары по убыванию цены (от самых дорогих к дешевым).

---

## 9. **Sort A-Z** - SORT с localeCompare
**Метод:** `Array.prototype.sort()` + `String.prototype.localeCompare()`
```javascript
function sortByName() {
    const sorted = [...currentProducts].sort((a, b) => a.name.localeCompare(b.name));
    updateCatalog(sorted, 'Sorted alphabetically (A-Z)');
}
```
**Описание:** Сортирует товары по названию в алфавитном порядке. Метод `localeCompare()` обеспечивает корректную сортировку строк с учетом локали.

---

## 10. **Reverse Order** - REVERSE
**Метод:** `Array.prototype.reverse()`
```javascript
function reverseOrder() {
    const reversed = [...currentProducts].reverse();
    updateCatalog(reversed, 'Reversed order');
}
```
**Описание:** Метод `reverse()` переворачивает массив в обратном порядке.

**Особенность:** Работает с текущим массивом, что позволяет комбинировать с другими фильтрами!

---

## Дополнительные методы массивов, использованные в коде

### `forEach()`
```javascript
filteredProducts.forEach((product, index) => {
    // Генерация карточки для каждого товара
});
```
Используется для итерации по массиву товаров и создания карточек.

### `find()`
```javascript
const product = products.find(p => p.id === productId);
```
Используется в функции `addToCart()` для поиска товара по ID.

### `indexOf()`
```javascript
card.style.animationDelay = `${products.indexOf(product) * 0.1}s`;
```
Используется для определения индекса товара и установки задержки анимации.

---

## Комбинирование методов

Благодаря переменной `currentProducts`, можно **комбинировать** фильтры и сортировки:

**Пример:**
1. Нажать "Accessories Only" → отфильтровать 10 аксессуаров
2. Нажать "Price: Low to High" → отсортировать эти 10 аксессуаров по цене
3. Нажать "Reverse Order" → перевернуть порядок

Это демонстрирует **цепочку преобразований массива** с сохранением промежуточных результатов!

---

## Технические детали

### Иммутабельность
Все методы создают **новые массивы**, не изменяя исходный:
```javascript
const sorted = [...currentProducts].sort(...);  // Создаем копию перед сортировкой
```

### Производительность
- `filter()` - O(n) - линейная сложность
- `sort()` - O(n log n) - логарифмическая сложность
- `reverse()` - O(n) - линейная сложность

### UI/UX особенности
- Активная кнопка подсвечивается
- Отображается описание текущего фильтра
- Показывается количество найденных товаров
- Плавная анимация появления карточек с задержкой

---

## Заключение

Реализовано **10 интерактивных кнопок**, демонстрирующих работу следующих методов массивов:

1. ✅ `filter()` - 5 различных фильтров
2. ✅ `sort()` - 3 различных сортировки
3. ✅ `reverse()` - обратный порядок
4. ✅ `spread operator (...)` - создание копий массивов
5. ✅ `forEach()` - итерация
6. ✅ `find()` - поиск элемента
7. ✅ `indexOf()` - определение индекса

Все методы работают с реальными данными (массив из 15 товаров) и обновляют DOM в реальном времени!

