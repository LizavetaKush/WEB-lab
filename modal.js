/**
 * Universal Modal System
 * Handles all modal windows on the site
 */

console.log('🎭 modal.js ЗАГРУЖЕН (версия 4.0 - использован addEventListener)');

class ModalManager {
    constructor() {
        this.modals = new Map();
        this.activeModal = null;
        this.init();
    }

    init() {
        // Close modal on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.close(this.activeModal);
            }
        });

        // Prevent body scroll when modal is open
        this.observeBodyClass();
    }

    /**
     * Create a modal dynamically
     */
    create(id, options = {}) {
        const {
            title = 'Modal',
            content = '',
            className = '',
            closeOnOverlay = true,
            onClose = null
        } = options;

        // Remove existing modal with same ID
        if (this.modals.has(id)) {
            this.destroy(id);
        }

        // Create modal HTML
        const modalHTML = `
            <div class="modal-overlay ${className}" id="${id}" role="dialog" aria-modal="true">
                <div class="modal-container">
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <button class="modal-close" aria-label="Close modal">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            </div>
        `;

        // Insert modal into DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modalElement = document.getElementById(id);
        const closeBtn = modalElement.querySelector('.modal-close');
        const overlay = modalElement;

        // Close button handler
        closeBtn.addEventListener('click', () => this.close(id));

        // Overlay click handler
        if (closeOnOverlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.close(id);
                }
            });
        }

        // Prevent modal container clicks from closing
        const container = modalElement.querySelector('.modal-container');
        container.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Store modal data
        this.modals.set(id, {
            element: modalElement,
            onClose: onClose
        });

        return modalElement;
    }

    /**
     * Open modal
     */
    open(id) {
        const modal = this.modals.get(id);
        if (!modal) {
            console.error(`Modal ${id} not found`);
            return;
        }

        // Close any open modal
        if (this.activeModal && this.activeModal !== id) {
            this.close(this.activeModal);
        }

        modal.element.classList.add('active');
        document.body.classList.add('menu-open'); // Prevent scrolling
        this.activeModal = id;
    }

    /**
     * Close modal
     */
    close(id) {
        const modal = this.modals.get(id);
        if (!modal) return;

        modal.element.classList.remove('active');
        document.body.classList.remove('menu-open');
        this.activeModal = null;

        // Call onClose callback if exists
        if (modal.onClose && typeof modal.onClose === 'function') {
            modal.onClose();
        }
    }

    /**
     * Destroy modal
     */
    destroy(id) {
        const modal = this.modals.get(id);
        if (!modal) return;

        if (this.activeModal === id) {
            this.close(id);
        }

        modal.element.remove();
        this.modals.delete(id);
    }

    /**
     * Update modal content
     */
    updateContent(id, content) {
        const modal = this.modals.get(id);
        if (!modal) return;

        const body = modal.element.querySelector('.modal-body');
        if (body) {
            body.innerHTML = content;
        }
    }

    /**
     * Update modal title
     */
    updateTitle(id, title) {
        const modal = this.modals.get(id);
        if (!modal) return;

        const titleElement = modal.element.querySelector('.modal-header h2');
        if (titleElement) {
            titleElement.textContent = title;
        }
    }

    /**
     * Show product detail modal
     */
    showProductDetail(product) {
        const modalId = 'product-detail-modal';
        
        const content = `
            <div class="product-detail-grid">
                <div class="product-detail-image">
                    ${product.inStock ? '<span class="product-detail-badge">В НАЛИЧИИ</span>' : '<span class="product-detail-badge" style="background: #999;">НЕТ В НАЛИЧИИ</span>'}
                    <img src="${product.image || 'images/placeholder.jpg'}" alt="${product.name}">
                </div>
                <div class="product-detail-info">
                    <h3>${product.name}</h3>
                    <span class="product-detail-category">${product.category || 'Товар'}</span>
                    <p class="product-detail-description">${product.description || 'Описание отсутствует'}</p>
                    
                    ${product.specs ? `
                        <div class="product-detail-specs">
                            ${product.specs.speed ? `
                                <div class="spec-detail-item">
                                    <div class="spec-detail-label">Скорость</div>
                                    <div class="spec-detail-value">${product.specs.speed}</div>
                                </div>
                            ` : ''}
                            ${product.specs.range ? `
                                <div class="spec-detail-item">
                                    <div class="spec-detail-label">Дальность</div>
                                    <div class="spec-detail-value">${product.specs.range}</div>
                                </div>
                            ` : ''}
                            ${product.specs.power ? `
                                <div class="spec-detail-item">
                                    <div class="spec-detail-label">Мощность</div>
                                    <div class="spec-detail-value">${product.specs.power}</div>
                                </div>
                            ` : ''}
                            ${product.specs.weight ? `
                                <div class="spec-detail-item">
                                    <div class="spec-detail-label">Вес</div>
                                    <div class="spec-detail-value">${product.specs.weight}</div>
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}
                    
                    <div class="product-detail-price">$${product.price}</div>
                    
                    <div class="modal-actions">
                        ${product.inStock ? `
                            <button type="button" class="modal-btn modal-btn-primary" data-modal-action="cart" data-product-id="${product.id || 0}">
                                🛒 Добавить в корзину
                            </button>
                            <button type="button" class="modal-btn modal-btn-secondary" data-modal-action="favorite" data-product-id="${product.id || 0}">
                                ❤️ В избранное
                            </button>
                        ` : `
                            <button type="button" class="modal-btn modal-btn-secondary" disabled>
                                Товар отсутствует
                            </button>
                        `}
                    </div>
                </div>
            </div>
        `;

        this.create(modalId, {
            title: 'Детали товара',
            content: content,
            className: 'product-detail-modal',
            closeOnOverlay: true
        });

        this.open(modalId);
        
        // Add event listeners for action buttons
        const modal = this.modals.get(modalId);
        if (modal && modal.element) {
            const cartBtn = modal.element.querySelector('[data-modal-action="cart"]');
            const favoriteBtn = modal.element.querySelector('[data-modal-action="favorite"]');
            
            if (cartBtn) {
                cartBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const productId = parseInt(e.currentTarget.dataset.productId);
                    if (window.addToCart) {
                        window.addToCart(productId);
                    }
                });
            }
            
            if (favoriteBtn) {
                favoriteBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const productId = parseInt(e.currentTarget.dataset.productId);
                    if (window.toggleFavorite) {
                        window.toggleFavorite(productId, e.currentTarget);
                    }
                });
            }
        }
    }

    /**
     * Show product form modal (add/edit)
     */
    showProductForm(product = null, onSubmit = null) {
        const modalId = 'product-form-modal';
        const isEdit = product !== null;
        
        const content = `
            <form class="modal-form" id="productForm">
                <div class="form-group">
                    <label class="form-label" for="productName">Название товара *</label>
                    <input type="text" id="productName" class="form-input" value="${product?.name || ''}" required>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="productCategory">Категория *</label>
                        <select id="productCategory" class="form-select" required>
                            <option value="">Выберите категорию</option>
                            <option value="electric-skateboard" ${product?.category === 'electric-skateboard' ? 'selected' : ''}>Электрические скейтборды</option>
                            <option value="electric-scooter" ${product?.category === 'electric-scooter' ? 'selected' : ''}>Электрические самокаты</option>
                            <option value="accessories" ${product?.category === 'accessories' ? 'selected' : ''}>Аксессуары</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="productPrice">Цена ($) *</label>
                        <input type="number" id="productPrice" class="form-input" value="${product?.price || ''}" step="0.01" min="0" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="productDescription">Описание</label>
                    <textarea id="productDescription" class="form-textarea">${product?.description || ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="productImage">URL изображения</label>
                    <input type="text" id="productImage" class="form-input" value="${product?.image || ''}" placeholder="images/product.jpg">
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="productSpeed">Скорость</label>
                        <input type="text" id="productSpeed" class="form-input" value="${product?.specs?.speed || ''}" placeholder="24 mph">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="productRange">Дальность</label>
                        <input type="text" id="productRange" class="form-input" value="${product?.specs?.range || ''}" placeholder="14 miles">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label" for="productPower">Мощность</label>
                        <input type="text" id="productPower" class="form-input" value="${product?.specs?.power || ''}" placeholder="2100W">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="productWeight">Вес</label>
                        <input type="text" id="productWeight" class="form-input" value="${product?.specs?.weight || ''}" placeholder="7.5 kg">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">
                        <input type="checkbox" id="productInStock" ${product?.inStock !== false ? 'checked' : ''}>
                        В наличии
                    </label>
                </div>
                
                <div class="modal-actions">
                    <button type="submit" class="modal-btn modal-btn-primary">
                        ${isEdit ? '💾 Сохранить изменения' : '➕ Добавить товар'}
                    </button>
                    <button type="button" class="modal-btn modal-btn-secondary" onclick="modalManager.close('${modalId}')">
                        ❌ Отмена
                    </button>
                </div>
            </form>
        `;

        this.create(modalId, {
            title: isEdit ? 'Редактировать товар' : 'Добавить товар',
            content: content,
            closeOnOverlay: false
        });

        this.open(modalId);

        // Handle form submission
        const form = document.getElementById('productForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                id: product?.id,
                name: document.getElementById('productName').value,
                category: document.getElementById('productCategory').value,
                price: parseFloat(document.getElementById('productPrice').value),
                description: document.getElementById('productDescription').value,
                image: document.getElementById('productImage').value,
                specs: {
                    speed: document.getElementById('productSpeed').value,
                    range: document.getElementById('productRange').value,
                    power: document.getElementById('productPower').value,
                    weight: document.getElementById('productWeight').value
                },
                inStock: document.getElementById('productInStock').checked
            };

            if (onSubmit && typeof onSubmit === 'function') {
                onSubmit(formData);
            }

            this.close(modalId);
        });
    }

    /**
     * Show delete confirmation modal
     */
    showDeleteConfirmation(item, onConfirm = null) {
        const modalId = 'delete-confirmation-modal';
        
        const content = `
            <div class="delete-icon">⚠️</div>
            <h3 class="delete-message">Вы уверены, что хотите удалить этот товар?</h3>
            <p class="delete-warning">"${item.name}"</p>
            <p class="delete-warning">Это действие нельзя отменить.</p>
            
            <div class="modal-actions">
                <button class="modal-btn modal-btn-danger" id="confirmDeleteBtn">
                    🗑️ Да, удалить
                </button>
                <button class="modal-btn modal-btn-secondary" onclick="modalManager.close('${modalId}')">
                    ❌ Отмена
                </button>
            </div>
        `;

        this.create(modalId, {
            title: 'Подтверждение удаления',
            content: content,
            className: 'delete-modal',
            closeOnOverlay: true
        });

        this.open(modalId);

        // Handle confirmation
        const confirmBtn = document.getElementById('confirmDeleteBtn');
        confirmBtn.addEventListener('click', () => {
            if (onConfirm && typeof onConfirm === 'function') {
                onConfirm(item.id);
            }
            this.close(modalId);
        });
    }

    observeBodyClass() {
        // Ensure body scroll is disabled when modal is open
        const observer = new MutationObserver(() => {
            if (this.activeModal) {
                if (!document.body.classList.contains('menu-open')) {
                    document.body.classList.add('menu-open');
                }
            }
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
}

// Create global instance
const modalManager = new ModalManager();

// Make it available globally
window.modalManager = modalManager;

