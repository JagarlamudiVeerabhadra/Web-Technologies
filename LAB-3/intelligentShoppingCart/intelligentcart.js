class SmartShoppingCart {
    constructor() {
        this.products = [
            { id: 1, name: 'MacBook Pro 16"', price: 2499.99, category: 'electronics', stock: 5 },
            { id: 2, name: 'AirPods Pro', price: 249.99, category: 'electronics', stock: 12 },
            { id: 3, name: 'Python Programming', price: 39.99, category: 'books', stock: 25 },
            { id: 4, name: 'Cotton T-Shirt', price: 29.99, category: 'clothing', stock: 30 },
            { id: 5, name: 'Ceramic Coffee Mug', price: 19.99, category: 'kitchen', stock: 18 },
            { id: 6, name: 'JavaScript: The Good Parts', price: 34.99, category: 'books', stock: 15 }
        ];
        
        this.cart = [];
        this.discounts = [];
        this.init();
    }

    init() {
        this.renderProducts();
        this.renderCart();
        this.startTimeDiscountCheck();
    }

    renderProducts() {
        const container = document.getElementById('productsContainer');
        container.innerHTML = this.products.map(product => `
            <div class="product-card">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-meta">
                    Category: <strong>${product.category.toUpperCase()}</strong> | 
                    Stock: <strong>${product.stock}</strong>
                </div>
                <button class="add-to-cart-btn" 
                        onclick="smartCart.addToCart(${product.id})"
                        ${product.stock === 0 ? 'disabled' : ''}>
                    ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart 🛒'}
                </button>
            </div>
        `).join('');
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product || product.stock === 0) return;

        const cartItem = this.cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        
        product.stock--;
        this.applyAutomaticDiscounts();
        this.renderProducts();
        this.renderCart();
    }

    updateQuantity(productId, delta) {
        const cartItem = this.cart.find(item => item.id === productId);
        if (!cartItem) return;

        const newQty = cartItem.quantity + delta;
        if (newQty <= 0) {
            this.removeItem(productId);
            return;
        }

        cartItem.quantity = newQty;
        const product = this.products.find(p => p.id === productId);
        product.stock += delta < 0 ? 1 : 0;

        this.applyAutomaticDiscounts();
        this.renderProducts();
        this.renderCart();
    }

    removeItem(productId) {
        const cartItem = this.cart.find(item => item.id === productId);
        if (!cartItem) return;

        const product = this.products.find(p => p.id === productId);
        product.stock += cartItem.quantity;

        this.cart = this.cart.filter(item => item.id !== productId);
        this.applyAutomaticDiscounts();
        this.renderProducts();
        this.renderCart();
    }

    applyCoupon() {
        const input = document.getElementById('couponInput');
        const code = input.value.trim().toUpperCase();
        input.value = '';

        if (!code) return alert('Please enter a coupon code!');

        let discount = null;
        let isValid = false;

        // String method parsing and validation
        switch(true) {
            case code === 'SAVE10':
                discount = { name: 'General 10% OFF', percent: 0.10, type: 'percent' };
                isValid = true;
                break;
            case code === 'BULK20':
                discount = { name: 'Bulk 20% OFF', percent: 0.20, type: 'percent' };
                isValid = true;
                break;
            case code === 'BOOKS30':
                const booksTotal = this.getCategoryTotal('books');
                if (booksTotal > 0) {
                    discount = { name: 'Books 30% OFF', percent: 0.30, type: 'category', category: 'books' };
                    isValid = true;
                }
                break;
            case /^ELEC(\d{2})$/.test(code):
                const elecPercent = parseInt(code.slice(4)) / 100;
                const electronicsTotal = this.getCategoryTotal('electronics');
                if (electronicsTotal > 0 && elecPercent <= 0.25) {
                    discount = { name: `${elecPercent*100}% Electronics`, percent: elecPercent, type: 'category', category: 'electronics' };
                    isValid = true;
                }
                break;
            case code.length === 6 && code.startsWith('SAVE') && !isNaN(code.slice(4)):
                const savePercent = parseInt(code.slice(4)) / 100;
                if (savePercent <= 0.15) {
                    discount = { name: `SAVE${savePercent*100}%`, percent: savePercent, type: 'percent' };
                    isValid = true;
                }
                break;
        }

        if (isValid) {
            this.discounts.push({ code, ...discount, appliedAt: new Date() });
            alert(`✅ Coupon "${code}" applied! ${discount.name}`);
        } else {
            alert('❌ Invalid coupon code!');
        }

        this.renderCart();
    }

    getCategoryTotal(category) {
        return this.cart
            .filter(item => item.category === category)
            .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    applyAutomaticDiscounts() {
        // Bulk discount: 15% off for 5+ items total
        if (this.cart.reduce((sum, item) => sum + item.quantity, 0) >= 5) {
            if (!this.discounts.find(d => d.name.includes('Bulk Quantity'))) {
                this.discounts.push({ 
                    name: 'Bulk Quantity 15% OFF (5+ items)', 
                    percent: 0.15, 
                    type: 'bulk',
                    automatic: true 
                });
            }
        }

        // Category bundle: Electronics + Books = $50 off
        const elecTotal = this.getCategoryTotal('electronics');
        const booksTotal = this.getCategoryTotal('books');
        if (elecTotal > 0 && booksTotal > 0) {
            if (!this.discounts.find(d => d.name.includes('Tech+Books Bundle'))) {
                this.discounts.push({ 
                    name: 'Tech+Books Bundle $50 OFF', 
                    amount: 50, 
                    type: 'bundle',
                    automatic: true 
                });
            }
        }
    }

    startTimeDiscountCheck() {
        const checkTimeDiscount = () => {
            const now = new Date();
            const hour = now.getHours();
            
            // Morning 8-11 AM: 10% off | Evening 6-9 PM: 15% off
            let timeDiscount = null;
            if (hour >= 8 && hour < 11) {
                timeDiscount = { name: 'Morning Special 10% OFF', percent: 0.10, type: 'time', automatic: true };
            } else if (hour >= 18 && hour < 21) {
                timeDiscount = { name: 'Evening Happy Hour 15% OFF', percent: 0.15, type: 'time', automatic: true };
            }

            const existingTimeDiscount = this.discounts.find(d => d.type === 'time');
            if (timeDiscount && !existingTimeDiscount) {
                this.discounts.push(timeDiscount);
            } else if (!timeDiscount && existingTimeDiscount) {
                this.discounts = this.discounts.filter(d => d.type !== 'time');
            }
        };

        checkTimeDiscount(); // Initial check
        setInterval(checkTimeDiscount, 60000); // Check every minute
    }

    calculateTotals() {
        let subtotal = 0;
        let discountTotal = 0;
        let discountDetails = [];

        // Calculate subtotal
        this.cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });

        // Apply all discounts
        this.discounts.forEach(discount => {
            let discountAmount = 0;
            
            if (discount.amount) {
                discountAmount = discount.amount;
            } else {
                let applicableSubtotal = subtotal;
                
                // Category-specific discounts
                if (discount.type === 'category') {
                    applicableSubtotal = this.getCategoryTotal(discount.category);
                }
                
                discountAmount = applicableSubtotal * discount.percent;
            }
            
            discountTotal += discountAmount;
            discountDetails.push(`${discount.name}: -$${discountAmount.toFixed(2)}`);
        });

        const grandTotal = Math.max(0, subtotal - discountTotal);
        return { subtotal, discountTotal, grandTotal, discountDetails };
    }

    renderCart() {
        const { subtotal, discountTotal, grandTotal, discountDetails } = this.calculateTotals();
        
        const container = document.getElementById('cartContainer');
        const summary = document.getElementById('cartSummary');
        
        if (this.cart.length === 0) {
            container.innerHTML = '<div class="empty-cart">Your cart is empty. Start shopping! 🛒</div>';
            summary.style.display = 'none';
            return;
        }

        container.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <div class="item-price">
                        $${(item.price * item.quantity).toFixed(2)}
                        <span style="font-size: 0.8em; color: #7f8c8d;">
                            ($${item.price.toFixed(2)} × ${item.quantity})
                        </span>
                    </div>
                </div>
                <div>
                    <div class="quantity-wrapper">
                        <button class="qty-btn" onclick="smartCart.updateQuantity(${item.id}, -1)">−</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="smartCart.updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="smartCart.removeItem(${item.id})">Remove ❌</button>
                </div>
            </div>
        `).join('');

        // Update summary
        document.getElementById('subtotalAmount').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('discountsList').innerHTML = discountDetails.map(d => `<span>${d}</span>`).join('<br>') || '-';
        document.getElementById('grandTotal').textContent = `$${grandTotal.toFixed(2)}`;
        summary.style.display = 'block';
    }
}

// Global instance
const smartCart = new SmartShoppingCart();
