function toggleMenu() {
    const nav = document.getElementById('nav-links');
    const hamburger = document.querySelector('.hamburger');
    nav.classList.toggle('show');
    hamburger.classList.toggle('active');
}

// Slider functionality
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev-slide');
const nextBtn = document.querySelector('.next-slide');
let currentSlide = 0;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    
    if (index >= slides.length) currentSlide = 0;
    if (index < 0) currentSlide = slides.length - 1;
    
    slides[currentSlide].classList.add('active');
}

function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide--;
    showSlide(currentSlide);
}

// Auto advance slides
setInterval(nextSlide, 5000);

// Event listeners
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

const cart = [];
const cartBtn = document.getElementById('cart-button');
const cartModal = document.getElementById('cart-modal');
const cartItemsEl = document.getElementById('cart-items');
const checkoutBtn = document.getElementById('checkout-btn');
const cartCount = document.getElementById('cart-count');

// Update cart UI function
function updateCartUI() {
    cartItemsEl.innerHTML = cart.map((item, index) => `
        <li>
            ${item.quantity}x ${item.name} - ₦${(item.price * item.quantity).toLocaleString()}
            <button onclick="removeFromCart(${index})" style="color: red; background: none; border: none; cursor: pointer;">
                <i class="fas fa-times"></i>
            </button>
        </li>
    `).join('');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    
    // Add total amount to cart modal
    if (cart.length > 0) {
        cartItemsEl.innerHTML += `
            <li style="margin-top: 10px; border-top: 2px solid #eee; padding-top: 10px;">
                <strong>Total: ₦${totalPrice.toLocaleString()}</strong>
            </li>`;
    }
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
    showToast('Item removed from cart', 'info');
}

// Handle individual product cart additions
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const card = button.closest('.product-card');
        if (!card) return; // Not a product card (might be bowl form)

        const name = button.dataset.name;
        const price = parseInt(button.dataset.price);
        const quantityInput = card.querySelector('.qty-input');
        const quantity = parseInt(quantityInput?.value) || 1;

        // Add to cart
        cart.push({
            name,
            price,
            quantity
        });

        // Reset quantity to 1
        if (quantityInput) {
            quantityInput.value = 1;
        }

        updateCartUI();
        showToast(`Added ${quantity}x ${name} to cart`, 'success');
    });
});

// Bowl form submission
if (document.getElementById('bowlForm')) {
    document.getElementById('bowlForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const sizeSelect = document.getElementById('bowl-size');
        const selected = [...document.querySelectorAll("input[name='flavours']:checked")].map(el => el.value);
        const quantity = parseInt(document.getElementById('bowl-quantity').value) || 1;

        // Validation
        if (!sizeSelect.value) {
            showToast('Please select a bowl size', 'error');
            return;
        }
        if (selected.length === 0) {
            showToast('Please select at least one flavour', 'error');
            return;
        }

        // Parse bowl details
        const [size, priceText] = sizeSelect.value.split(' - ');
        const price = parseInt(priceText.replace('₦', ''));

        // Add to cart
        cart.push({
            name: `${size} with ${selected.join(', ')}`,
            price,
            quantity
        });

        // Reset form
        this.reset();
        updateCartUI();
        showToast(`Added ${quantity}x ${size} to cart`, 'success');
    });
}

// Cart button toggle
    const isHidden = cartModal.style.display === 'none';
    cartModal.style.display = isHidden ? 'flex' : 'none';
    if (isHidden) {
        setTimeout(() => {
            cartModal.style.opacity = '1';
        }, 10);
    } else {
        cartModal.style.opacity = '0';
    }
});

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
  
    const name = document.getElementById('customer-name').value.trim();
    const location = document.getElementById('customer-location').value.trim();
    const paymentConfirmed = document.getElementById('payment-confirmed').checked;
  
    if (!name || !location) {
        showToast('Please enter your name and location', 'error');
        return;
    }

    if (!paymentConfirmed) {
        showToast('Please confirm your payment', 'error');
        return;
    }
  
    const message = cart.map(item => 
        `${item.quantity}x ${item.name} - ₦${(item.price * item.quantity).toLocaleString()}`
    ).join('%0A');
  
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const finalMessage = `New Order!%0A%0ACustomer: ${name}%0ALocation: ${location}%0A%0AOrder Details:%0A${message}%0A%0ATotal: ₦${total.toLocaleString()}%0A%0APayment Status: Confirmed ✅`;
  
    window.open(`https://wa.me/2348029319622?text=${finalMessage}`, '_blank');
  
    // Clear cart and form
    cart.length = 0;
    updateCartUI();
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-location').value = '';
    document.getElementById('payment-confirmed').checked = false;
    cartModal.style.display = 'none';
    showToast('Order sent successfully!', 'success');
});
  

// Click outside to close cart modal
document.addEventListener('click', (e) => {
    if (!cartModal.contains(e.target) && e.target !== cartBtn) {
        cartModal.style.display = 'none';
    }
});

// Handle quantity buttons
function initQuantitySelectors() {
    document.querySelectorAll('.quantity-selector').forEach(selector => {
        const minusBtn = selector.querySelector('.minus');
        const plusBtn = selector.querySelector('.plus');
        const input = selector.querySelector('.qty-input');

        if (!minusBtn || !plusBtn || !input) return;

        // Minus button click
        minusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentValue = parseInt(input.value) || 1;
            if (currentValue > 1) {
                input.value = currentValue - 1;
            }
        });

        // Plus button click
        plusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentValue = parseInt(input.value) || 1;
            if (currentValue < 20) {
                input.value = currentValue + 1;
            }
        });

        // Manual input validation
        input.addEventListener('input', () => {
            let value = parseInt(input.value) || 1;
            if (value < 1) value = 1;
            if (value > 20) value = 20;
            input.value = value;
        });

        // Prevent form submission on button click
        minusBtn.type = 'button';
        plusBtn.type = 'button';
    });
}

// Initialize quantity selectors when DOM is loaded
document.addEventListener('DOMContentLoaded', initQuantitySelectors);
