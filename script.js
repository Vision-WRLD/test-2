// ======================== LUXÉ JEWELS - MAIN SCRIPT ========================

// Product Database
const products = [
    {
        id: 1,
        name: "Eternal Solitaire Ring",
        price: 2450,
        category: "rings",
        material: "gold",
        stone: "diamond",
        color: "gold",
        size: ["6", "7", "8"],
        image: "gold",
        description: "A timeless solitaire diamond ring set in 18k yellow gold. 1.2 carat brilliant-cut diamond.",
        specs: { Material: "18K Yellow Gold", "Diamond Weight": "1.2ct", "Band Width": "2.8mm" }
    },
    {
        id: 2,
        name: "Lumina Pearl Necklace",
        price: 890,
        category: "necklaces",
        material: "gold",
        stone: "pearl",
        color: "white",
        size: ["16", "18"],
        image: "pearl",
        description: "Classic freshwater pearls with a delicate 18k gold clasp. A symbol of refined elegance.",
        specs: { Material: "18K Gold & Freshwater Pearls", Length: "18 inches" }
    },
    {
        id: 3,
        name: "Celestial Diamond Bracelet",
        price: 1650,
        category: "bracelets",
        material: "rose-gold",
        stone: "diamond",
        color: "rose",
        size: ["7", "8"],
        image: "rose",
        description: "Delicate tennis bracelet featuring 12 brilliant diamonds in rose gold setting.",
        specs: { Material: "18K Rose Gold", "Total Diamonds": "12", "Carat Weight": "2.4ct" }
    },
    {
        id: 4,
        name: "Aurora Drop Earrings",
        price: 1250,
        category: "earrings",
        material: "platinum",
        stone: "sapphire",
        color: "blue",
        size: ["One Size"],
        image: "blue",
        description: "Elegant sapphire drop earrings with diamond accents in platinum.",
        specs: { Material: "Platinum", Stone: "Sapphire & Diamond" }
    },
    {
        id: 5,
        name: "Midnight Signet Ring",
        price: 780,
        category: "rings",
        material: "silver",
        stone: "none",
        color: "black",
        size: ["7", "8", "9"],
        image: "black",
        description: "Bold signet ring with engraved monogram option in oxidized silver.",
        specs: { Material: "Sterling Silver", Finish: "Oxidized" }
    },
    {
        id: 6,
        name: "Opal Cascade Necklace",
        price: 2100,
        category: "necklaces",
        material: "gold",
        stone: "opal",
        color: "white",
        size: ["18"],
        image: "white",
        description: "Ethically sourced Australian opal pendant suspended on a fine gold chain.",
        specs: { Material: "18K Gold", Stone: "Australian Opal" }
    }
];

// Cart Management
let cart = JSON.parse(localStorage.getItem('luxecart')) || [];

function saveCart() {
    localStorage.setItem('luxecart', JSON.stringify(cart));
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartCount();
    
    // Visual feedback
    const btn = document.querySelector('.add-to-cart-btn');
    if (btn) {
        const originalText = btn.textContent;
        btn.textContent = '✓ Added to Cart';
        btn.style.background = '#155724';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 1500);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
    updateCartCount();
}

function updateCartCount() {
    const countEl = document.getElementById('cart-count');
    if (countEl) {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        countEl.textContent = totalItems;
    }
}

// Floating Diamonds Background
function createDiamondCanvas() {
    const canvas = document.getElementById('diamondCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let diamonds = [];

    class Diamond {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - 100;
            this.size = Math.random() * 6 + 3;
            this.speed = Math.random() * 0.8 + 0.4;
            this.opacity = Math.random() * 0.4 + 0.2;
            this.rotation = Math.random() * 360;
        }

        update() {
            this.y += this.speed;
            this.rotation += 0.5;
            if (this.y > canvas.height) {
                this.y = -20;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(0, -this.size);
            ctx.lineTo(this.size * 0.7, 0);
            ctx.lineTo(0, this.size);
            ctx.lineTo(-this.size * 0.7, 0);
            ctx.closePath();
            ctx.fill();
            
            ctx.restore();
        }
    }

    // Create initial diamonds
    for (let i = 0; i < 35; i++) {
        diamonds.push(new Diamond());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        diamonds.forEach(diamond => {
            diamond.update();
            diamond.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Render Products Grid
function renderProducts(filteredProducts) {
    const container = document.getElementById('products-grid');
    if (!container) return;

    container.innerHTML = '';

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">
                <div class="placeholder-img" style="background: linear-gradient(135deg, #f5f1ed, #d4af37);">
                    <span class="img-text">${product.name.split(' ')[0]}</span>
                </div>
            </div>
            <div class="product-info">
                <p class="product-category">${product.category.toUpperCase()}</p>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toLocaleString()}</p>
            </div>
        `;
        card.addEventListener('click', () => {
            window.location.href = `product.html?id=${product.id}`;
        });
        container.appendChild(card);
    });
}

// Filter Products
function filterProducts() {
    const checkedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(el => el.value);
    const checkedPrices = Array.from(document.querySelectorAll('input[name="price"]:checked')).map(el => el.value);

    let filtered = products;

    if (checkedCategories.length > 0) {
        filtered = filtered.filter(p => checkedCategories.includes(p.category));
    }

    if (checkedPrices.length > 0) {
        filtered = filtered.filter(product => {
            return checkedPrices.some(range => {
                if (range === "0-500") return product.price <= 500;
                if (range === "500-1000") return product.price > 500 && product.price <= 1000;
                if (range === "1000-2000") return product.price > 1000 && product.price <= 2000;
                if (range === "2000+") return product.price > 2000;
            });
        });
    }

    document.getElementById('product-count').textContent = filtered.length;
    renderProducts(filtered);
}

// Render Single Product Page
function renderProductPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        document.getElementById('product-container').innerHTML = `<h2>Product not found</h2>`;
        return;
    }

    const container = document.getElementById('product-container');
    container.innerHTML = `
        <div class="product-container">
            <div class="product-images">
                <div class="main-image" id="main-image">
                    <div class="placeholder-img" style="background: linear-gradient(135deg, #f5f1ed, #d4af37);">
                        <span class="img-text">${product.name}</span>
                    </div>
                </div>
            </div>
            <div class="product-details">
                <h1>${product.name}</h1>
                <p class="product-price-detail">$${product.price.toLocaleString()}</p>
                <p class="product-description">${product.description}</p>
                
                <div class="product-options">
                    <div class="option-group">
                        <label>Color</label>
                        <div class="color-options">
                            <div class="color-option active" style="background: #d4af37;"></div>
                            <div class="color-option" style="background: #c0c0c0;"></div>
                            <div class="color-option" style="background: #b76e79;"></div>
                        </div>
                    </div>
                    <div class="option-group">
                        <label>Size</label>
                        <div class="size-options">
                            ${product.size.map(size => `<div class="size-option">${size}</div>`).join('')}
                        </div>
                    </div>
                </div>

                <div class="quantity-selector">
                    <button class="quantity-btn">-</button>
                    <span class="quantity-display">1</span>
                    <button class="quantity-btn">+</button>
                </div>

                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    ADD TO CART
                </button>

                <div class="product-specifications">
                    <h3>Specifications</h3>
                    ${Object.entries(product.specs).map(([key, value]) => `
                        <div class="spec-item">
                            <span class="spec-label">${key}</span>
                            <span class="spec-value">${value}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// Render Cart
function renderCart() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added anything yet.</p>
                <a href="collections.html" class="cta-button">Browse Collections</a>
            </div>
        `;
        updateCartTotals();
        return;
    }

    let html = '';
    cart.forEach(item => {
        html += `
            <div class="cart-item">
                <div class="cart-item-image">
                    <div class="placeholder-img" style="background: linear-gradient(135deg, #f5f1ed, #d4af37);">
                        <span class="img-text">${item.name.split(' ')[0]}</span>
                    </div>
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>Qty: ${item.quantity || 1}</p>
                </div>
                <div class="cart-item-actions">
                    <p class="cart-item-price">$${(item.price * (item.quantity || 1)).toLocaleString()}</p>
                    <a href="#" onclick="removeFromCart(${item.id}); return false;" class="remove-item">Remove</a>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    updateCartTotals();
}

function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const tax = subtotal * 0.085;
    const total = subtotal + tax;

    document.getElementById('cart-subtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('cart-tax').textContent = '$' + tax.toFixed(2);
    document.getElementById('cart-total').textContent = '$' + total.toFixed(2);
}

// Checkout Functions
function renderCheckoutSummary() {
    const container = document.getElementById('checkout-items');
    if (!container) return;

    let html = '';
    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * (item.quantity || 1);
        subtotal += itemTotal;
        html += `
            <div class="checkout-item">
                <div class="checkout-item-image">
                    <div class="placeholder-img" style="background: linear-gradient(135deg, #f5f1ed, #d4af37);"></div>
                </div>
                <div class="checkout-item-info">
                    <h4>${item.name}</h4>
                    <p>Qty: ${item.quantity || 1}</p>
                </div>
                <div class="checkout-item-price">$${itemTotal}</div>
            </div>
        `;
    });

    const tax = subtotal * 0.085;
    const shipping = 15;
    const total = subtotal + tax + shipping;

    container.innerHTML = html;
    document.getElementById('checkout-subtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('checkout-tax').textContent = '$' + tax.toFixed(2);
    document.getElementById('checkout-total').textContent = '$' + total.toFixed(2);
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    createDiamondCanvas();
    updateCartCount();

    // Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Collections Page
    if (document.getElementById('products-grid')) {
        renderProducts(products);
        
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', filterProducts);
        });

        document.getElementById('reset-filters')?.addEventListener('click', () => {
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
            renderProducts(products);
        });
    }

    // Product Detail Page
    if (window.location.pathname.includes('product.html')) {
        renderProductPage();
    }

    // Cart Page
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
    }

    // Checkout Page
    if (window.location.pathname.includes('checkout.html')) {
        renderCheckoutSummary();

        const form = document.getElementById('checkout-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const modal = document.getElementById('order-success-modal');
                const orderNumber = 'LX' + Math.floor(Math.random() * 900000) + 100000;
                
                document.getElementById('order-number').textContent = orderNumber;
                modal.style.display = 'flex';
                
                // Clear cart after successful order
                cart = [];
                saveCart();
            });
        }
    }

    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const successMsg = document.getElementById('form-success');
            successMsg.style.display = 'block';
            contactForm.reset();
            
            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 4000);
        });
    }
});

// Make addToCart available globally
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
