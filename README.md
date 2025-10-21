# 🚀 WEB-lab - Boosted USA

Лабораторные работы по курсу "Веб-технологии"  
**Проект:** Электрические скейтборды и самокаты Boosted USA

---

## 📁 Структура проекта

```
WEB-lab/
├── 📄 index.html              # Главная страница (лендинг)
├── 📄 catalog.html            # Каталог (статичная версия)
├── 📄 catalog-server.html     # Каталог (JSON Server API) ⭐
├── 📄 favorites.html          # Страница избранного ⭐⭐
├── 📄 cart.html               # Страница корзины покупок ⭐⭐
├── 📄 api-demo.html           # Интерактивная демонстрация API
├── 📄 styles.css              # Общие стили
├── 📄 catalog.js              # JavaScript для статичного каталога
├── 📄 catalog-server.js       # JavaScript для работы с API ⭐
├── 📄 favorites.js            # JavaScript для избранного ⭐⭐
├── 📄 cart.js                 # JavaScript для корзины ⭐⭐
├── 📄 db.json                 # База данных JSON Server ⭐
├── 📄 package.json            # Конфигурация npm
├── 📁 images/                 # Изображения товаров
└── 📚 Документация/
    ├── README-SERVER.md                    # Руководство по JSON Server
    ├── ИНСТРУКЦИЯ-ПРОВЕРКА-КЛИЕНТА.md     # Инструкция проверки каталога
    ├── ПРОВЕРКА-ИЗБРАННОЕ-КОРЗИНА.md      # Инструкция проверки (избранное/корзина) ⭐⭐
    ├── СВОДКА-ИЗБРАННОЕ-КОРЗИНА.md        # Краткая сводка (избранное/корзина) ⭐⭐
    ├── БЫСТРАЯ-ПРОВЕРКА.md                # Быстрая проверка
    ├── БЫСТРЫЙ-СТАРТ.md                   # Быстрый старт
    ├── ОТЧЕТ-О-ВЫПОЛНЕНИИ.md              # Отчет о выполнении
    └── server-instructions.md             # Инструкции по серверу (EN)
```

---

## 🎯 Выполненные лабораторные работы

### ✅ Лабораторная #3 - Лендинг Boosted USA
- Главная страница с продуктами
- Адаптивная верстка
- Современный дизайн

### ✅ Лабораторная #7 - JSON Server API

**Реализованные требования:**

**Страница "Каталог":**

| № | Требование | Файл | Статус |
|---|------------|------|--------|
| 1 | Загрузка данных при открытии | catalog-server.js | ✅ |
| 2 | Использование fetch() | catalog-server.js | ✅ |
| 3 | Поиск по полям (?q=) | catalog-server.js | ✅ |
| 4 | Сортировка (?_sort, ?_order) | catalog-server.js | ✅ |
| 5 | Категории (Set) + фильтрация | catalog-server.js | ✅ |
| 6 | Расширенная фильтрация | catalog-server.js | ✅ |
| 7 | Фильтрация по диапазонам | catalog-server.js | ✅ |
| 8 | Обработка "не найдено" | catalog-server.js | ✅ |
| 9 | Пагинация (_page, _limit) | catalog-server.js | ✅ |
| 10 | Обновление отображения | catalog-server.js | ✅ |
| 11 | Добавление в избранное | catalog-server.js | ✅ |
| 12 | Добавление в корзину | catalog-server.js | ✅ |

**Страница "Избранное":**

| № | Требование | Файл | Статус |
|---|------------|------|--------|
| 1 | Оформление соответствует лендингу | favorites.html | ✅ |
| 2 | Удаление товара из избранного | favorites.js | ✅ |

**Страница "Корзина":**

| № | Требование | Файл | Статус |
|---|------------|------|--------|
| 1 | Оформление соответствует лендингу | cart.html | ✅ |
| 2 | Удаление товара из корзины | cart.js | ✅ |
| 3 | Изменение количества товара | cart.js | ✅ |
| 4 | Расчет общей стоимости | cart.js | ✅ |
| 5 | Кнопка оформления заказа | cart.js | ✅ |

---

## 🚀 Быстрый старт

### Шаг 1: Установка зависимостей

```bash
npm install
```

### Шаг 2: Запуск JSON Server

```bash
npm run server
```

Сервер запустится на `http://localhost:3000`

### Шаг 3: Открытие страниц

- **Главная:** `index.html`
- **Каталог (статичный):** `catalog.html`
- **Каталог (API):** `catalog-server.html` ⭐
- **Избранное:** `favorites.html` ⭐⭐
- **Корзина:** `cart.html` ⭐⭐
- **Демо API:** `api-demo.html`

---

## 📡 API Endpoints

| Endpoint | Описание | Пример |
|----------|----------|---------|
| `GET /products` | Все товары | [localhost:3000/products](http://localhost:3000/products) |
| `GET /products?q=boosted` | Поиск | [localhost:3000/products?q=boosted](http://localhost:3000/products?q=boosted) |
| `GET /products?_sort=price&_order=asc` | Сортировка | [localhost:3000/products?_sort=price&_order=asc](http://localhost:3000/products?_sort=price&_order=asc) |
| `GET /products?category=Accessories` | Фильтр | [localhost:3000/products?category=Accessories](http://localhost:3000/products?category=Accessories) |
| `GET /favorites` | Избранное | [localhost:3000/favorites](http://localhost:3000/favorites) |
| `GET /cart` | Корзина | [localhost:3000/cart](http://localhost:3000/cart) |

---

## 📦 База данных (db.json)

### Товары - 15 объектов

**Категории:**
- 🛹 Electric Skateboards (4 товара)
- 🛴 Electric Scooters (1 товар)
- 🔧 Accessories (10 товаров)

**Поля каждого товара (10 полей):**
1. `id` - ID
2. `name` - Название
3. `price` - Цена
4. `category` - Категория
5. `image` - Фото ⭐ (обязательное)
6. `description` - Описание
7. `inStock` - Наличие
8. `maxSpeed` - Скорость
9. `range` - Дальность
10. `rating` - Рейтинг

**Дополнительные разделы:**
- `favorites` - Избранное (изначально пусто)
- `cart` - Корзина (изначально пусто)

---

## 🧪 Проверка работы

### Быстрая проверка (3 минуты):

```bash
# 1. Запустите сервер
npm run server

# 2. Откройте catalog-server.html
# 3. Попробуйте:
#    - Поиск: введите "boosted"
#    - Сортировка: выберите "Цена: возрастание"
#    - Фильтр: снимите галочку "Accessories"
#    - Избранное: нажмите "🤍 В избранное"
#    - Корзина: нажмите "🛒 В корзину"
```

### Подробная инструкция:

Смотрите файлы:
- **БЫСТРАЯ-ПРОВЕРКА.md** - проверка за 3 минуты
- **ИНСТРУКЦИЯ-ПРОВЕРКА-КЛИЕНТА.md** - детальная инструкция

---

## 💻 Технологии

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **API:** JSON Server (REST API)
- **Методы:** Fetch API, async/await
- **Структуры данных:** Set, Array, Object
- **HTTP:** GET, POST, PATCH, DELETE

---

## 🎨 Особенности реализации

### 1. Поиск (Requirement 3)
```javascript
// Полнотекстовый поиск по всем полям
GET /products?q=boosted
```

### 2. Сортировка (Requirement 4)
```javascript
// Сортировка через JSON Server
GET /products?_sort=price&_order=asc
```

### 3. Категории - Set (Requirement 5)
```javascript
// Использование Set для уникальных категорий
let allCategories = new Set(products.map(p => p.category));
```

### 4. Фильтрация по диапазонам (Requirement 7)
```javascript
// Фильтр цен: от 50 до 500
GET /products?price_gte=50&price_lte=500

// Минимальный рейтинг: 4.5
GET /products?rating_gte=4.5
```

### 5. Пагинация (Requirement 9)
```javascript
// Первая страница, 12 товаров
GET /products?_page=1&_limit=12
```

### 6. Избранное (Requirement 11)
```javascript
// Добавить в избранное
POST /favorites
{
  "productId": 1,
  "name": "Boosted Stealth",
  "price": 1599,
  ...
}

// Удалить из избранного
DELETE /favorites/1
```

### 7. Корзина (Requirement 12)
```javascript
// Добавить в корзину
POST /cart
{
  "productId": 5,
  "quantity": 1,
  ...
}

// Увеличить количество
PATCH /cart/1
{
  "quantity": 2
}
```

---

## 📊 Статистика проекта

- **Файлов:** 26+
- **Строк кода:** 4500+
- **Товаров в БД:** 15
- **API endpoints:** 6
- **Страниц:** 6 (index, catalog, catalog-server, favorites, cart, api-demo)
- **Требований выполнено:** 19/19 ✅

---

## 🔥 ВАЖНО: ФИЛЬТРАЦИЯ НА СЕРВЕРЕ

**Все данные для выполнения запросов к серверу передаются в параметрах URL.**

- ✅ Поиск: `?q=запрос`
- ✅ Категории: `?category=название`
- ✅ Наличие: `?inStock=true`
- ✅ Цена: `?price_gte=50&price_lte=500`
- ✅ Рейтинг: `?rating_gte=4.5`
- ✅ Сортировка: `?_sort=price&_order=asc`
- ✅ Пагинация: `?_page=1&_limit=12`

**Клиентская фильтрация НЕ используется!**

Подробнее: **ФИЛЬТРАЦИЯ-НА-СЕРВЕРЕ.md**

---

## 🔗 Полезные ссылки

- [JSON Server Documentation](https://github.com/typicode/json-server)
- [Fetch API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [JavaScript Set MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)

---

## 📞 Помощь и поддержка

### Если что-то не работает:

1. **Проверьте, запущен ли сервер:**
   ```bash
   npm run server
   ```

2. **Проверьте доступность API:**
   - Откройте http://localhost:3000
   - Должен отобразиться JSON Server

3. **Проверьте консоль браузера (F12):**
   - Ищите ошибки в Console
   - Проверьте Network на запросы

4. **Перезапустите все:**
   ```bash
   # Ctrl+C (остановить сервер)
   npm run server
   # F5 (обновить страницу)
   ```

---

## ✅ Статус проекта

**Лабораторная работа #7:** ✅ ВЫПОЛНЕНА

**Все требования реализованы и протестированы!**

**Каталог товаров:**
- ✅ JSON файл создан (15 товаров, 10 полей)
- ✅ JSON Server настроен и работает
- ✅ Страница каталога загружает данные с API
- ✅ Поиск, сортировка, фильтрация работают (Set для категорий)
- ✅ Пагинация реализована
- ✅ Добавление в избранное/корзину работает
- ✅ Обработка ошибок реализована

**Страница "Избранное":**
- ✅ Оформление соответствует лендингу
- ✅ Удаление товаров реализовано (DELETE запросы)
- ✅ Перемещение в корзину работает
- ✅ Статистика отображается

**Страница "Корзина":**
- ✅ Оформление соответствует лендингу
- ✅ Удаление товаров реализовано (DELETE запросы)
- ✅ Изменение количества работает (PATCH запросы)
- ✅ Расчет общей стоимости (с налогом и доставкой)
- ✅ Оформление заказа с очисткой корзины
- ✅ Модальное окно успешной покупки

**Документация:**
- ✅ Подробные инструкции по проверке
- ✅ Краткие сводки для быстрого старта
- ✅ README обновлен

---

**Дата выполнения:** Октябрь 2025  
**Автор:** Lab 7 - JSON Server Integration  
**Проект:** Boosted USA - Electric Skateboards & Scooters
