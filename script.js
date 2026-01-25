// Global Variables
let currentUser = null;
let uploadedImageData = null;
let currentProduct = null;
let cart = [];
let wishlist = [];
let allProducts = [];
let currentLanguage = 'en';

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadSampleProducts();
    updateCartCount();
    updateWishlistCount();
    checkUserSession();
});

// Initialize application
function initializeApp() {
    // Load user data from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
    
    // Load cart and wishlist
    cart = JSON.parse(localStorage.getItem('cart') || '[]');
    wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    // Load language preference
    currentLanguage = localStorage.getItem('language') || 'en';
    document.getElementById('languageSelect').value = currentLanguage;
    
    // Initialize chatbot
    initializeChatbot();
}

// Page Navigation
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Remove active class from all nav buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // Find and activate corresponding nav button
        const activeBtn = [...navButtons].find(btn => 
            btn.onclick && btn.onclick.toString().includes(`'${pageId}'`)
        );
        if (activeBtn) activeBtn.classList.add('active');
        
        // Page-specific actions
        switch(pageId) {
            case 'marketplace':
                displayProducts();
                break;
            case 'cart':
                displayCart();
                break;
            case 'wishlist':
                displayWishlist();
                break;
            case 'payment':
                displayOrderSummary();
                break;
        }
    }
}

// Authentication Functions
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple authentication (in real app, this would be server-side)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateUIForLoggedInUser();
        showToast(translations[currentLanguage].login_success || 'Login successful!');
        showPage('home');
    } else {
        showToast(translations[currentLanguage].login_error || 'Invalid credentials!', 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const userType = document.getElementById('userType').value;
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
        showToast(translations[currentLanguage].user_exists || 'User already exists!', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        phone,
        password,
        userType,
        joinDate: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    updateUIForLoggedInUser();
    
    showToast(translations[currentLanguage].register_success || 'Registration successful!');
    showPage('home');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUIForLoggedOutUser();
    showToast(translations[currentLanguage].logout_success || 'Logged out successfully!');
    showPage('home');
}

function updateUIForLoggedInUser() {
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('registerBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'inline-block';
    document.getElementById('userWelcome').style.display = 'inline-block';
    document.getElementById('userWelcome').textContent = `Welcome, ${currentUser.name}!`;
}

function updateUIForLoggedOutUser() {
    document.getElementById('loginBtn').style.display = 'inline-block';
    document.getElementById('registerBtn').style.display = 'inline-block';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('userWelcome').style.display = 'none';
}

function checkUserSession() {
    if (currentUser) {
        updateUIForLoggedInUser();
    }
}

// File Upload Functions
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        // Validate file type and size
        if (!file.type.startsWith('image/')) {
            showToast('Please select an image file!', 'error');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            showToast('File size must be less than 10MB!', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImageData = e.target.result;
            
            // Update upload area
            const uploadArea = document.querySelector('.upload-area');
            uploadArea.classList.add('has-file');
            document.getElementById('uploadText').textContent = `Selected: ${file.name}`;
            
            // Show preview
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = `<img src="${uploadedImageData}" class="preview-image" alt="Preview">`;
            
            // Enable generate button
            document.getElementById('generateBtn').disabled = false;
            
            showToast('Image uploaded successfully!');
        };
        reader.readAsDataURL(file);
    }
}

// AI Suggestions Functions
async function generateAISuggestions() {
    if (!uploadedImageData) {
        showToast('Please upload an image first!', 'error');
        return;
    }
    
    if (!currentUser) {
        showToast('Please login to use AI features!', 'error');
        showPage('login');
        return;
    }
    
    // Switch to AI suggestions page
    showPage('ai-suggestions');
    
    // Show loading
    document.getElementById('aiLoading').style.display = 'block';
    document.getElementById('aiResults').style.display = 'none';
    
    try {
        // Simulate AI processing (in real app, this would call Google Gemini API)
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const aiSuggestions = await generateAIContent();
        
        // Populate form fields
        document.getElementById('productName').value = aiSuggestions.name;
        document.getElementById('productDescription').value = aiSuggestions.description;
        document.getElementById('productStory').value = aiSuggestions.story;
        document.getElementById('productHashtags').value = aiSuggestions.hashtags;
        document.getElementById('productPrice').value = aiSuggestions.price;
        
        // Set price range
        document.getElementById('priceRangeMin').textContent = aiSuggestions.priceRange.min;
        document.getElementById('priceRangeMax').textContent = aiSuggestions.priceRange.max;
        
        // Hide loading and show results
        document.getElementById('aiLoading').style.display = 'none';
        document.getElementById('aiResults').style.display = 'block';
        
        showToast('AI suggestions generated successfully!');
        
    } catch (error) {
        console.error('Error generating AI suggestions:', error);
        showToast('Error generating AI suggestions. Please try again.', 'error');
        document.getElementById('aiLoading').style.display = 'none';
    }
}

async function generateAIContent() {
    // This would integrate with Google Gemini API in a real application
    // For now, we'll use sophisticated dummy data
    
    const suggestions = [
        {
            name: "Handwoven Sunset Tapestry",
            description: "A stunning handwoven tapestry featuring warm sunset colors that brings warmth and artistry to any space. Each thread is carefully selected and woven with traditional techniques passed down through generations. The intricate patterns tell stories of heritage and craftsmanship.",
            story: "Inspired by the golden hour sunsets over rolling hills, this piece took me three weeks to complete. I sourced the organic wool from local farms and dyed it using natural pigments from flowers and roots I collected during my morning walks. Each color represents a different emotion and memory from my childhood in the countryside.",
            hashtags: "#handwoven #tapestry #sunset #organic #artisan #homedecor #wallart #traditional #craftsmanship #natural #heritage #goldenhour #sustainable",
            price: 1899,
            priceRange: { min: 1500, max: 2500 }
        },
        {
            name: "Ceramic Ocean Wave Bowl",
            description: "A beautifully crafted ceramic bowl with flowing ocean wave patterns in deep blue and turquoise glazes. Perfect for serving or as a decorative centerpiece. The smooth curves and lustrous finish make it a functional work of art.",
            story: "Living by the coast my whole life, I've always been mesmerized by the ocean's rhythm. This bowl captures that eternal dance of waves in functional art form. Each piece is thrown on my pottery wheel and glazed with my signature ocean-inspired colors mixed from minerals I collect from the shore.",
            hashtags: "#ceramic #pottery #ocean #bowl #handmade #artisan #blue #turquoise #homedecor #functional #art #coastal #waves #ceramicart",
            price: 899,
            priceRange: { min: 600, max: 1200 }
        },
        {
            name: "Vintage-Style Leather Journal",
            description: "A premium leather-bound journal with hand-stitched binding and aged paper. Features a vintage brass clasp and comes with a matching leather bookmark. Perfect for writers, artists, and dreamers who appreciate the tactile experience of writing.",
            story: "As a writer myself, I understand the importance of a good journal. This piece combines traditional bookbinding techniques with modern durability. The leather is sourced ethically and ages beautifully with use, developing a unique patina that tells the story of your thoughts and dreams.",
            hashtags: "#leather #journal #vintage #handstitched #writing #notebook #artisan #brass #bookmark #stationery #writing #diary #handbound",
            price: 1299,
            priceRange: { min: 900, max: 1800 }
        },
        {
            name: "Silver Wire Mandala Earrings",
            description: "Intricate mandala-inspired earrings crafted from sterling silver wire. Each piece is hand-shaped and features delicate geometric patterns that catch and reflect light beautifully. Lightweight and comfortable for all-day wear.",
            story: "These earrings are born from my meditation practice and love for sacred geometry. I spend hours carefully shaping each wire by hand, creating patterns that represent harmony and balance. The mandala design is said to bring peace and positive energy to the wearer.",
            hashtags: "#silver #jewelry #mandala #earrings #handmade #wire #geometric #meditation #sacred #artisan #sterlingsilver #spiritual #lightweight",
            price: 2499,
            priceRange: { min: 2000, max: 3000 }
        },
        {
            name: "Reclaimed Wood Coffee Table",
            description: "A rustic coffee table crafted from reclaimed barn wood with a natural live edge. The rich patina and wood grain tell stories of decades past. Each piece is unique with its own character marks and natural beauty.",
            story: "This wood came from a 100-year-old barn that was being demolished. Instead of letting this beautiful timber go to waste, I carefully selected the best pieces and gave them new life as furniture. Every scratch and nail hole adds to its character and history.",
            hashtags: "#reclaimedwood #coffeetable #rustic #furniture #sustainable #upcycled #woodworking #liveedge #barnwood #vintage #handcrafted #eco",
            price: 8999,
            priceRange: { min: 7000, max: 12000 }
        }
    ];
    
    return suggestions[Math.floor(Math.random() * suggestions.length)];
}

async function regenerateContent() {
    const aiSuggestions = await generateAIContent();
    
    // Animate the content change
    const form = document.querySelector('.ai-output');
    form.style.opacity = '0.5';
    
    setTimeout(() => {
        document.getElementById('productName').value = aiSuggestions.name;
        document.getElementById('productDescription').value = aiSuggestions.description;
        document.getElementById('productStory').value = aiSuggestions.story;
        document.getElementById('productHashtags').value = aiSuggestions.hashtags;
        document.getElementById('productPrice').value = aiSuggestions.price;
        
        document.getElementById('priceRangeMin').textContent = aiSuggestions.priceRange.min;
        document.getElementById('priceRangeMax').textContent = aiSuggestions.priceRange.max;
        
        form.style.opacity = '1';
        showToast('Content regenerated successfully!');
    }, 500);
}

// Product Management
function createProductListing() {
    if (!currentUser || currentUser.userType !== 'artisan') {
        showToast('Only artisans can create product listings!', 'error');
        return;
    }
    
    // Collect form data
    const product = {
        id: Date.now().toString(),
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        story: document.getElementById('productStory').value,
        hashtags: document.getElementById('productHashtags').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        image: uploadedImageData,
        artisan: {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email
        },
        createdAt: new Date().toISOString(),
        rating: 0,
        reviews: []
    };
    
    // Validate required fields
    if (!product.name || !product.description || !product.price || !product.category) {
        showToast('Please fill in all required fields!', 'error');
        return;
    }
    
    // Add to products list
    allProducts.unshift(product);
    localStorage.setItem('products', JSON.stringify(allProducts));
    
    currentProduct = product;
    
    showToast('Product listing created successfully!');
    showPage('marketplace');
}

// Product Display Functions
function loadSampleProducts() {
    const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
    
    if (existingProducts.length === 0) {
        // Load sample products if none exist
        allProducts = [
            {
                id: '1',
                name: 'Handwoven Cotton Scarf',
                description: 'Beautiful handwoven cotton scarf with traditional patterns. Soft, comfortable, and perfect for any season.',
                story: 'Crafted using age-old weaving techniques passed down through generations.',
                price: 799,
                category: 'textiles',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iIzRjYWY1MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlNpbHZlciBOZWNrbGFjZTwvdGV4dD48L3N2Zz4=',
                artisan: { id: 'artisan3', name: 'Meera Patel', email: 'meera@example.com' },
                createdAt: new Date().toISOString(),
                rating: 4.7,
                reviews: []
            }
        ];
        localStorage.setItem('products', JSON.stringify(allProducts));
    } else {
        allProducts = existingProducts;
    }
}

function displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) return;
    
    if (allProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-store empty-icon"></i>
                <h3>No products available</h3>
                <p>Be the first to add a product to our marketplace!</p>
                <button class="btn primary" onclick="showPage('upload')">Add Product</button>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = allProducts.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    const isInWishlist = wishlist.some(item => item.id === product.id);
    const isInCart = cart.some(item => item.id === product.id);
    
    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="wishlist-btn ${isInWishlist ? 'active' : ''}" onclick="toggleWishlist('${product.id}')">
                <i class="fas fa-heart"></i>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">₹${product.price.toLocaleString()}</div>
                <p class="product-description">${product.description}</p>
                <div class="product-actions">
                    <button class="btn secondary" onclick="viewProductDetails('${product.id}')">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn primary ${isInCart ? 'disabled' : ''}" onclick="addToCart('${product.id}')" ${isInCart ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus"></i> ${isInCart ? 'Added' : 'Add to Cart'}
                    </button>
                </div>
                <div class="artisan-info" onclick="viewArtisanProfile('${product.artisan.id}')">
                    <i class="fas fa-user"></i> By ${product.artisan.name}
                </div>
            </div>
        </div>
    `;
}

function viewProductDetails(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Create modal for product details
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${product.name}</h3>
                <button onclick="this.closest('.modal').remove()" class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 10px; margin-bottom: 20px;">
                <div class="product-price" style="font-size: 1.5rem; color: #667eea; font-weight: bold; margin-bottom: 15px;">
                    ₹${product.price.toLocaleString()}
                </div>
                <p style="margin-bottom: 20px;"><strong>Description:</strong> ${product.description}</p>
                <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                    <strong>Artisan's Story:</strong><br>
                    ${product.story}
                </div>
                <p><strong>Category:</strong> ${product.category}</p>
                <p><strong>Artisan:</strong> ${product.artisan.name}</p>
                <div style="margin-top: 20px;">
                    <button class="btn primary" onclick="addToCart('${product.id}'); this.closest('.modal').remove();">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                    <button class="btn secondary" onclick="toggleWishlist('${product.id}'); this.closest('.modal').remove();">
                        <i class="fas fa-heart"></i> Add to Wishlist
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function viewArtisanProfile(artisanId) {
    // Find artisan products
    const artisanProducts = allProducts.filter(p => p.artisan.id === artisanId);
    if (artisanProducts.length === 0) return;
    
    const artisan = artisanProducts[0].artisan;
    
    // Show artisan details page
    showPage('artisan-details');
    
    // Update artisan profile
    document.getElementById('artisanName').textContent = artisan.name;
    document.getElementById('artisanLocation').innerHTML = '<i class="fas fa-map-marker-alt"></i> Mumbai, India';
    document.getElementById('totalProducts').textContent = artisanProducts.length;
    document.getElementById('artisanBio').textContent = `Passionate artisan specializing in traditional crafts with modern appeal. ${artisan.name} has been creating beautiful handmade items for over 5 years.`;
    
    // Update specialties
    const categories = [...new Set(artisanProducts.map(p => p.category))];
    const specialtiesContainer = document.getElementById('artisanSpecialties');
    specialtiesContainer.innerHTML = categories.map(cat => 
        `<span class="specialty-tag">${cat.charAt(0).toUpperCase() + cat.slice(1)}</span>`
    ).join('');
    
    // Display artisan products
    const artisanProductsGrid = document.getElementById('artisanProducts');
    artisanProductsGrid.innerHTML = artisanProducts.map(product => createProductCard(product)).join('');
}

// Cart Functions
function addToCart(productId) {
    if (!currentUser) {
        showToast('Please login to add items to cart!', 'error');
        showPage('login');
        return;
    }
    
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast(`${product.name} added to cart!`);
    
    // Update product card button
    displayProducts();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
    showToast('Item removed from cart!');
}

function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    const emptyCart = document.getElementById('emptyCart');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '';
        cartSummary.style.display = 'none';
        emptyCart.style.display = 'block';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartSummary.style.display = 'block';
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <h4 class="item-title">${item.name}</h4>
                <div class="item-price">₹${item.price.toLocaleString()}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', -1)">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', 1)">+</button>
                </div>
                <div class="item-total">Total: ₹${(item.price * item.quantity).toLocaleString()}</div>
            </div>
            <div class="item-actions">
                <button class="btn secondary" onclick="removeFromCart('${item.id}')">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        </div>
    `).join('');
    
    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 2000 ? 0 : 100;
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shipping + tax;
    
    document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString()}`;
    document.getElementById('shipping').textContent = `₹${shipping.toLocaleString()}`;
    document.getElementById('tax').textContent = `₹${tax.toLocaleString()}`;
    document.getElementById('total').textContent = `₹${total.toLocaleString()}`;
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

// Wishlist Functions
function toggleWishlist(productId) {
    if (!currentUser) {
        showToast('Please login to add items to wishlist!', 'error');
        showPage('login');
        return;
    }
    
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        showToast(`${product.name} removed from wishlist!`);
    } else {
        wishlist.push({
            ...product,
            addedAt: new Date().toISOString()
        });
        showToast(`${product.name} added to wishlist!`);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    displayProducts();
}

function removeFromWishlist(productId) {
    wishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    displayWishlist();
    showToast('Item removed from wishlist!');
}

function displayWishlist() {
    const wishlistItems = document.getElementById('wishlistItems');
    const emptyWishlist = document.getElementById('emptyWishlist');
    
    if (wishlist.length === 0) {
        wishlistItems.innerHTML = '';
        emptyWishlist.style.display = 'block';
        return;
    }
    
    emptyWishlist.style.display = 'none';
    
    wishlistItems.innerHTML = wishlist.map(item => `
        <div class="wishlist-item">
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <h4 class="item-title">${item.name}</h4>
                <div class="item-price">₹${item.price.toLocaleString()}</div>
                <p class="item-description">${item.description}</p>
            </div>
            <div class="item-actions">
                <button class="btn primary" onclick="addToCart('${item.id}')">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
                <button class="btn secondary" onclick="removeFromWishlist('${item.id}')">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        </div>
    `).join('');
}

function updateWishlistCount() {
    document.getElementById('wishlistCount').textContent = wishlist.length;
}

// Search and Filter Functions
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    
    let filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                             product.description.toLowerCase().includes(searchTerm) ||
                             product.artisan.name.toLowerCase().includes(searchTerm);
        
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        
        let matchesPrice = true;
        if (priceFilter) {
            if (priceFilter === '0-1000') {
                matchesPrice = product.price <= 1000;
            } else if (priceFilter === '1000-5000') {
                matchesPrice = product.price > 1000 && product.price <= 5000;
            } else if (priceFilter === '5000-10000') {
                matchesPrice = product.price > 5000 && product.price <= 10000;
            } else if (priceFilter === '10000+') {
                matchesPrice = product.price > 10000;
            }
        }
        
        return matchesSearch && matchesCategory && matchesPrice;
    });
    
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search empty-icon"></i>
                <h3>No products found</h3>
                <p>Try adjusting your search criteria or browse all products.</p>
            </div>
        `;
    }
}

function filterProducts() {
    searchProducts(); // Reuse search logic for filtering
}

// Payment Functions
function showPaymentForm(method) {
    // Hide all payment forms
    document.getElementById('cardPayment').style.display = 'none';
    document.getElementById('upiPayment').style.display = 'none';
    document.getElementById('walletPayment').style.display = 'none';
    
    // Show selected payment form
    document.getElementById(method + 'Payment').style.display = 'block';
}

function displayOrderSummary() {
    const orderSummary = document.getElementById('orderSummary');
    
    if (cart.length === 0) {
        orderSummary.innerHTML = '<p>No items in cart</p>';
        return;
    }
    
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 2000 ? 0 : 100;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;
    
    orderSummary.innerHTML = `
        <h3>Order Summary</h3>
        ${cart.map(item => `
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                <span>${item.name} (${item.quantity}x)</span>
                <span>₹${(item.price * item.quantity).toLocaleString()}</span>
            </div>
        `).join('')}
        <hr style="margin: 15px 0;">
        <div style="display: flex; justify-content: space-between;">
            <span>Subtotal:</span>
            <span>₹${subtotal.toLocaleString()}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <span>Shipping:</span>
            <span>₹${shipping.toLocaleString()}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
            <span>Tax (18%):</span>
            <span>₹${tax.toLocaleString()}</span>
        </div>
        <hr style="margin: 15px 0;">
        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.2rem;">
            <span>Total:</span>
            <span>₹${total.toLocaleString()}</span>
        </div>
    `;
}

function processPayment() {
    if (!currentUser) {
        showToast('Please login to complete payment!', 'error');
        return;
    }
    
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    
    // Show loading overlay
    showLoadingOverlay('Processing payment...');
    
    // Simulate payment processing
    setTimeout(() => {
        hideLoadingOverlay();
        
        // Create order
        const order = {
            id: 'ORD' + Date.now(),
            userId: currentUser.id,
            items: [...cart],
            total: cart.reduce((total, item) => total + (item.price * item.quantity), 0) * 1.18 + 100,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };
        
        // Save order
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Clear cart
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        
        showToast('Payment successful! Order confirmed.', 'success');
        
        // Show order confirmation
        showOrderConfirmation(order);
    }, 3000);
}

function showOrderConfirmation(order) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-check-circle text-success"></i> Order Confirmed!</h3>
            </div>
            <div class="modal-body" style="text-align: center;">
                <div class="success-message">
                    <h4>Thank you for your purchase!</h4>
                    <p>Order ID: <strong>${order.id}</strong></p>
                    <p>Total Amount: <strong>₹${order.total.toLocaleString()}</strong></p>
                    <p>You will receive a confirmation email shortly.</p>
                </div>
                <button class="btn primary" onclick="this.closest('.modal').remove(); showPage('home');">
                    Continue Shopping
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Utility Functions
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function showLoadingOverlay(message) {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.id = 'loadingOverlay';
    overlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>${message}</p>
        </div>
    `;
    
    document.body.appendChild(overlay);
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.remove();
    }
}

// Voice Assistant Functions
let recognition;
let isListening = false;

function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showToast('Voice recognition not supported in this browser!', 'error');
        return;
    }
    
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
        isListening = true;
        document.getElementById('voiceIndicator').style.display = 'block';
        showToast('Listening... Please speak now');
    };
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleVoiceCommand(transcript);
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        showToast('Voice recognition error. Please try again.', 'error');
        stopVoiceInput();
    };
    
    recognition.onend = () => {
        stopVoiceInput();
    };
    
    recognition.start();
}

function stopVoiceInput() {
    isListening = false;
    document.getElementById('voiceIndicator').style.display = 'none';
    if (recognition) {
        recognition.stop();
    }
}

function handleVoiceCommand(command) {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('home') || lowerCommand.includes('होम')) {
        showPage('home');
        showToast('Navigated to home page');
    } else if (lowerCommand.includes('marketplace') || lowerCommand.includes('बाजार')) {
        showPage('marketplace');
        showToast('Navigated to marketplace');
    } else if (lowerCommand.includes('cart') || lowerCommand.includes('कार्ट')) {
        showPage('cart');
        showToast('Navigated to cart');
    } else if (lowerCommand.includes('wishlist') || lowerCommand.includes('इच्छा सूची')) {
        showPage('wishlist');
        showToast('Navigated to wishlist');
    } else if (lowerCommand.includes('search') || lowerCommand.includes('खोज')) {
        const searchTerm = lowerCommand.replace(/search for|search|खोज/, '').trim();
        if (searchTerm) {
            document.getElementById('searchInput').value = searchTerm;
            searchProducts();
            showToast(`Searching for "${searchTerm}"`);
        }
    } else {
        // Handle as chatbot query
        addChatMessage('user', command);
        handleChatbotQuery(command);
    }
}

// Chatbot Functions
function initializeChatbot() {
    const chatbotMessages = document.getElementById('chatbotMessages');
    chatbotMessages.innerHTML = `
        <div class="message bot">
            <i class="fas fa-robot"></i> Hello! I'm your AI assistant. How can I help you today?
        </div>
    `;
}

function toggleChatbot() {
    const container = document.getElementById('chatbotContainer');
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
}

function handleChatbotKeypress(event) {
    if (event.key === 'Enter') {
        sendChatbotMessage();
    }
}

function sendChatbotMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addChatMessage('user', message);
    input.value = '';
    
    // Simulate AI response
    setTimeout(() => {
        handleChatbotQuery(message);
    }, 1000);
}

function addChatMessage(sender, message) {
    const messagesContainer = document.getElementById('chatbotMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    if (sender === 'bot') {
        messageDiv.innerHTML = `<i class="fas fa-robot"></i> ${message}`;
    } else {
        messageDiv.textContent = message;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function handleChatbotQuery(query) {
    const lowerQuery = query.toLowerCase();
    let response = '';
    
    if (lowerQuery.includes('price') || lowerQuery.includes('cost')) {
        response = 'Our products range from ₹500 to ₹15,000. You can filter products by price range in the marketplace to find items within your budget.';
    } else if (lowerQuery.includes('shipping') || lowerQuery.includes('delivery')) {
        response = 'We offer free shipping on orders above ₹2,000. For orders below this amount, shipping charges are ₹100. Delivery typically takes 3-7 business days.';
    } else if (lowerQuery.includes('return') || lowerQuery.includes('refund')) {
        response = 'We have a 15-day return policy for all handcrafted items. Items must be in original condition. Refunds are processed within 5-7 business days.';
    } else if (lowerQuery.includes('artisan') || lowerQuery.includes('maker')) {
        response = 'All our products are made by verified local artisans. You can view each artisan\'s profile and story by clicking on their name on any product card.';
    } else if (lowerQuery.includes('payment') || lowerQuery.includes('pay')) {
        response = 'We accept credit/debit cards, UPI payments, and digital wallets like Google Pay, Paytm, and PhonePe. All transactions are secure and encrypted.';
    } else if (lowerQuery.includes('help') || lowerQuery.includes('support')) {
        response = 'I\'m here to help! You can ask me about products, pricing, shipping, payments, or anything else. You can also use voice commands by clicking the microphone button.';
    } else {
        response = 'I understand you\'re asking about "' + query + '". Could you please be more specific? I can help you with product information, pricing, shipping, payments, and more!';
    }
    
    addChatMessage('bot', response);
}

function startVoiceChat() {     
  startVoiceInput(); 
}

const products = [
  {
    id: '1',
    name: 'Handwoven Scarf',
    description: 'Beautiful handwoven scarf with natural dyes.',
    story: 'This scarf is crafted with traditional weaving techniques...',
    price: 899,
    category: 'textiles',
    image: 'data:image/svg+xml;base64,...',
    artisan: { 
      id: 'artisan1', 
      name: 'Priya Sharma', 
      email: 'priya@example.com' 
    },
    createdAt: new Date().toISOString(),
    rating: 4.5,
    reviews: []
  },
  {
    id: '2',
    name: 'Ceramic Tea Set',
    description: 'Elegant ceramic tea set with hand-painted floral designs. Includes teapot, 4 cups, and serving tray.',
    story: 'Each piece is carefully shaped on the pottery wheel and decorated with love.',
    price: 1299,
    category: 'pottery',
    image: 'data:image/svg+xml;base64,...',
    artisan: { 
      id: 'artisan2', 
      name: 'Rajesh Kumar', 
      email: 'rajesh@example.com' 
    },
    createdAt: new Date().toISOString(),
    rating: 4.8,
    reviews: []
  }
];
