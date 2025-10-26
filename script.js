// Global cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Products data
const products = {
    electronics: [
        { id: 1, name: "iPhone 15 Pro", price: 999, image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500", category: "Electronics", color: "Space Gray", size: "6.1 inch" },
        { id: 2, name: "Samsung Galaxy S24", price: 849, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500", category: "Electronics", color: "Phantom Black", size: "6.2 inch" },
        { id: 3, name: "MacBook Pro 16", price: 2499, image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500", category: "Electronics", color: "Space Gray", size: "16 inch" },
        { id: 4, name: "AirPods Pro", price: 249, image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500", category: "Electronics", color: "White", size: "Regular" },
        { id: 5, name: "Smart Watch", price: 399, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", category: "Electronics", color: "Black", size: "42mm" }
    ],
    fashion: [
        { id: 6, name: "Leather Jacket", price: 199, image: "https://images.unsplash.com/photo-1551033406-611cf9a28f64?w=500", category: "Fashion", color: "Black", size: "M" },
        { id: 7, name: "Designer Dress", price: 149, image: "https://images.unsplash.com/photo-1597222717341-ee0a8b9e7e11?w=500", category: "Fashion", color: "Red", size: "S" },
        { id: 8, name: "Running Shoes", price: 89, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", category: "Fashion", color: "White/Blue", size: "10" },
        { id: 9, name: "Sunglasses", price: 79, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500", category: "Fashion", color: "Black", size: "One Size" }
    ],
    homegarden: [
        { id: 10, name: "Wall Art Set", price: 89, image: "https://images.unsplash.com/photo-1537444792194-b34420a36f61?w=500", category: "Home & Garden", color: "Mixed", size: "Set of 3" },
        { id: 11, name: "Table Lamp", price: 59, image: "https://images.unsplash.com/photo-1507473885765-e6c81b3b6e73?w=500", category: "Home & Garden", color: "Gold", size: "18 inch" },
        { id: 12, name: "Plant Pot Set", price: 39, image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500", category: "Home & Garden", color: "Terracotta", size: "3 pieces" },
        { id: 13, name: "Throw Pillows", price: 29, image: "https://images.unsplash.com/photo-1587521723222-2eac8e219e8e?w=500", category: "Home & Garden", color: "Blue/Gray", size: "18x18" }
    ],
    sports: [
        { id: 14, name: "Basketball", price: 25, image: "https://images.unsplash.com/photo-1614634716296-62a46977e2b9?w=500", category: "Sports", color: "Orange", size: "Standard" },
        { id: 15, name: "Yoga Mat", price: 34, image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=500", category: "Sports", color: "Purple", size: "68x24 inch" },
        { id: 16, name: "Dumbbells Set", price: 149, image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500", category: "Sports", color: "Black", size: "5-25 lbs" },
        { id: 17, name: "Gym Bag", price: 45, image: "https://images.unsplash.com/photo-1597938427793-b4da6aad02ff?w=500", category: "Sports", color: "Gray", size: "Large" }
    ]
};

// Initialize cart count
function updateCartCount() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        if (el) el.textContent = cartCount;
    });
}

// Add to cart
function addToCart(productId) {
    const product = findProductById(productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartCount();
    showNotification('Product added to cart!');
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    if (typeof renderCart === 'function') renderCart();
    showNotification('Product removed from cart');
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, item.quantity + change);
        saveCart();
        updateCartCount();
        if (typeof renderCart === 'function') renderCart();
        if (typeof calculateTotal === 'function') calculateTotal();
    }
}

// Clear cart
function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
    if (typeof renderCart === 'function') renderCart();
    showNotification('Cart cleared');
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Find product by ID
function findProductById(id) {
    for (const category in products) {
        const product = products[category].find(p => p.id === id);
        if (product) return product;
    }
    return null;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #FFA4A4;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Load featured products
function loadFeaturedProducts() {
    const featuredGrid = document.getElementById('featured-products');
    if (!featuredGrid) return;

    const featured = [
        products.electronics[0],
        products.fashion[0],
        products.homegarden[0],
        products.sports[0]
    ];

    featuredGrid.innerHTML = featured.map(product => `
        <div class="product-card" onclick="openProductModal(${product.id})">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price}</p>
            </div>
        </div>
    `).join('');
}

// Open product modal
function openProductModal(productId) {
    const product = findProductById(productId);
    if (!product) return;

    const modal = document.getElementById('product-modal');
    const details = document.getElementById('product-details');
    
    if (modal && details) {
        details.innerHTML = `
            <div style="display: flex; gap: 2rem; align-items: start;">
                <img src="${product.image}" alt="${product.name}" style="width: 300px; border-radius: 10px;">
                <div style="flex: 1;">
                    <h2 style="margin-bottom: 1rem;">${product.name}</h2>
                    <p style="font-size: 1.2rem; color: #FFA4A4; font-weight: 600; margin-bottom: 1rem;">$${product.price}</p>
                    <p style="margin-bottom: 1rem;"><strong>Category:</strong> ${product.category}</p>
                    <p style="margin-bottom: 1rem;"><strong>Color:</strong> ${product.color}</p>
                    <p style="margin-bottom: 2rem;"><strong>Size:</strong> ${product.size}</p>
                    <button class="btn btn-primary" onclick="addToCart(${product.id}); closeModal('product-modal');">Add to Cart</button>
                </div>
            </div>
        `;
        modal.classList.add('active');
    }
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    loadFeaturedProducts();

    // Cart icon is now a link, no need for click handler

    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close modals on outside click
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal') || e.target.classList.contains('close')) {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
});

// Make functions global
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.openProductModal = openProductModal;
window.closeModal = closeModal;

