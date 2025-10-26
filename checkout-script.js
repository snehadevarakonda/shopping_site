// Initialize checkout page
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    loadOrderSummary();
    setupCheckoutForm();

    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
});

// Load order summary
function loadOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        // Redirect to cart if empty
        window.location.href = 'cart.html';
        return;
    }

    const orderItemsDiv = document.getElementById('order-items');
    if (!orderItemsDiv) return;

    orderItemsDiv.innerHTML = cart.map(item => `
        <div class="summary-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    document.getElementById('checkout-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('checkout-shipping').textContent = shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`;
    document.getElementById('checkout-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('checkout-total').textContent = `$${total.toFixed(2)}`;
}

// Setup checkout form
function setupCheckoutForm() {
    const form = document.getElementById('checkout-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleCheckout();
    });
}

// Handle checkout submission
function handleCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('Your cart is empty!');
        window.location.href = 'cart.html';
        return;
    }

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        pincode: document.getElementById('pincode').value,
        state: document.getElementById('state').value,
        payment: document.querySelector('input[name="payment"]:checked').value
    };

    // Generate order ID
    const orderId = 'ORD-' + Date.now();

    // Show success message
    const checkoutContainer = document.getElementById('checkout-container');
    const successMessage = document.getElementById('success-message');
    const orderIdSpan = document.getElementById('order-id');

    if (checkoutContainer && successMessage && orderIdSpan) {
        checkoutContainer.style.display = 'none';
        successMessage.classList.add('show');
        orderIdSpan.textContent = orderId;
    }

    // Clear cart
    localStorage.removeItem('cart');
    updateCartCount();
}
