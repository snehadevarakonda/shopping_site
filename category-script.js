// Get products from script.js
let displayedProducts = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();

    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Sort functionality
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSort);
    }

    // Filter functionality
    const priceSelect = document.getElementById('price-select');
    if (priceSelect) {
        priceSelect.addEventListener('change', applyFilters);
    }

    const sizeSelect = document.getElementById('size-select');
    if (sizeSelect) {
        sizeSelect.addEventListener('change', applyFilters);
    }

    const catSelect = document.getElementById('cat-select');
    if (catSelect) {
        catSelect.addEventListener('change', applyFilters);
    }

    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
});

// Load products for a specific category
function loadCategoryProducts(category, productNames) {
    const productKeys = {
        'electronics': 'electronics',
        'fashion': 'fashion',
        'homegarden': 'homegarden',
        'sports': 'sports'
    };

    const categoryKey = productKeys[category];
    if (!products[categoryKey]) {
        console.error('Category not found:', category);
        return;
    }

    displayedProducts = products[categoryKey];
    renderProducts(displayedProducts);
}

// Render products
function renderProducts(productsToRender) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    if (productsToRender.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 2rem;">No products found.</p>';
        return;
    }

    productsGrid.innerHTML = productsToRender.map(product => `
        <div class="product-card" onclick="openProductModal(${product.id})">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price}</p>
                <button class="btn btn-primary" style="width: 100%; margin-top: 1rem;" onclick="event.stopPropagation(); addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Handle search
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase();
    
    const filtered = displayedProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
    );
    
    renderProducts(filtered);
    applyFilters();
}

// Handle sort
function handleSort() {
    const sortSelect = document.getElementById('sort-select');
    const sortValue = sortSelect.value;

    let sorted = [...displayedProducts];

    if (sortValue === 'price-low') {
        sorted.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-high') {
        sorted.sort((a, b) => b.price - a.price);
    } else if (sortValue === 'name') {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    displayedProducts = sorted;
    renderProducts(displayedProducts);
    applyFilters();
}

// Apply filters
function applyFilters() {
    let filtered = [...displayedProducts];
    const searchInput = document.getElementById('search-input');
    
    // Search filter
    if (searchInput && searchInput.value) {
        const searchTerm = searchInput.value.toLowerCase();
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
    }

    // Price filter
    const priceSelect = document.getElementById('price-select');
    if (priceSelect && priceSelect.value !== 'all') {
        const [min, max] = priceSelect.value.split('-').map(v => v === '+' ? Infinity : parseInt(v));
        if (priceSelect.value === '1000+') {
            filtered = filtered.filter(p => p.price >= 1000);
        } else {
            filtered = filtered.filter(p => p.price >= min && p.price < (max + 1));
        }
    }

    // Size filter (for fashion)
    const sizeSelect = document.getElementById('size-select');
    if (sizeSelect && sizeSelect.value !== 'all') {
        filtered = filtered.filter(p => p.size.includes(sizeSelect.value));
    }

    // Category filter (for home & garden)
    const catSelect = document.getElementById('cat-select');
    if (catSelect && catSelect.value !== 'all') {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(catSelect.value.toLowerCase()));
    }

    renderProducts(filtered);
}

// Clear all filters
function clearFilters() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) sortSelect.value = 'name';

    const priceSelect = document.getElementById('price-select');
    if (priceSelect) priceSelect.value = 'all';

    const sizeSelect = document.getElementById('size-select');
    if (sizeSelect) sizeSelect.value = 'all';

    const catSelect = document.getElementById('cat-select');
    if (catSelect) catSelect.value = 'all';

    displayedProducts = displayedProducts.length ? displayedProducts : products.electronics;
    renderProducts(displayedProducts);
}

// Make functions global
window.clearFilters = clearFilters;

