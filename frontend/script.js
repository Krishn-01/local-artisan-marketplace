// ===============================
// ✅ ArtisanHub Project Script.js
// ===============================

// ✅ Translation Object (Required)
const translations = {
  en: {
    login_success: "Login successful!",
    login_error: "Invalid credentials!",
    register_success: "Registration successful!",
    logout_success: "Logged out successfully!",
    user_exists: "User already exists!"
  },

  hi: {
    login_success: "लॉगिन सफल हुआ!",
    login_error: "गलत जानकारी!",
    register_success: "रजिस्ट्रेशन सफल हुआ!",
    logout_success: "लॉग आउट हो गया!",
    user_exists: "यूज़र पहले से मौजूद है!"
  }
};

// ✅ Global State Variables
// ===============================

// Logged-in user
let currentUser = null;

// Uploaded image for AI product generation
let uploadedImageData = null;

// Shopping data
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

// Marketplace products
let allProducts = [];

// Language preference
let currentLanguage = localStorage.getItem("language") || "en";


// ===============================
// ✅ Change Language Function
// ===============================
function changeLanguage() {
  currentLanguage = document.getElementById("languageSelect").value;
  localStorage.setItem("language", currentLanguage);

  showToast("Language changed successfully ✅");
}


function initializeApp() {

  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    updateUIForLoggedInUser();
  }

  // Load language preference
  document.getElementById("languageSelect").value = currentLanguage;

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
             loadProductsFromDB();   // ✅ Fetch from MongoDB
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
    showToast("Please upload an image first!", "error");
    return;
  }

  if (!currentUser) {
    showToast("Please login to use AI features!", "error");
    showPage("login");
    return;
  }

  // ✅ Open AI Suggestions Page
  showPage("ai-suggestions");

  // ✅ Show Loading
  document.getElementById("aiLoading").style.display = "block";
  document.getElementById("aiResults").style.display = "none";

  try {

    const aiSuggestions = await generateAIContent();

    // ✅ Fill Form Fields
    document.getElementById("productName").value = aiSuggestions.name;
    document.getElementById("productDescription").value =
      aiSuggestions.description;
    document.getElementById("productStory").value = aiSuggestions.story;
    document.getElementById("productHashtags").value =
      aiSuggestions.hashtags;
    document.getElementById("productPrice").value = aiSuggestions.price;

    // ✅ Auto Select Category (IMPORTANT FIX)
    document.getElementById("productCategory").value =
  aiSuggestions.category.toLowerCase() || "jewelry";

    // ✅ Price Range Display
    document.getElementById("priceRangeMin").textContent =
      aiSuggestions.priceRange.min;
    document.getElementById("priceRangeMax").textContent =
      aiSuggestions.priceRange.max;

    // ✅ Hide Loading and Show Results
    document.getElementById("aiLoading").style.display = "none";
    document.getElementById("aiResults").style.display = "block";

    showToast("AI suggestions generated successfully! ✅");
  } catch (error) {
    console.error("AI Error:", error);
    showToast("Error generating AI suggestions!", "error");
    document.getElementById("aiLoading").style.display = "none";
  }
}


async function generateAIContent() {
  try {

    // ✅ Get selected product type from dropdown
    const productType =
      document.getElementById("productTypeHint")?.value || "handmade item";

    // ✅ Send request to backend AI API
    const response = await fetch("http://localhost:5000/api/chatbot/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        prompt: `
You are an AI product content generator for an artisan marketplace.

The uploaded product type is: "${productType}"

Generate details for this product.

Reply ONLY in pure JSON format:

{
  "name": "Product name for ${productType}",
  "description": "Short attractive description",
  "story": "Small artisan story about handmade craft",
  "hashtags": "#tags",
  "price": 1200,
  "category": "${productType}"
}
        `
      })
    });

    const data = await response.json();

    // ✅ Extract JSON safely
    let aiText = data.text;

    const jsonStart = aiText.indexOf("{");
    const jsonEnd = aiText.lastIndexOf("}");

    const jsonString = aiText.substring(jsonStart, jsonEnd + 1);

    const aiProduct = JSON.parse(jsonString);

    return {
      name: aiProduct.name || "Handmade Product",
      description: aiProduct.description || "Beautiful artisan item.",
      story: aiProduct.story || "Crafted with love.",
      hashtags: aiProduct.hashtags || "#artisan #handmade",
      price: aiProduct.price || 999,
      category: aiProduct.category || productType,
      priceRange: { min: 500, max: 5000 }
    };

  } catch (error) {
    console.log("AI Error:", error);

    return {
      name: "Handmade Item",
      description: "AI could not generate description.",
      story: "No story available.",
      hashtags: "#handmade",
      price: 999,
      category: "handmade item",
      priceRange: { min: 500, max: 2000 }
    };
  }
}




async function regenerateContent() {

  const aiSuggestions = await generateAIContent();

  document.getElementById("productName").value = aiSuggestions.name;
  document.getElementById("productDescription").value =
    aiSuggestions.description;

  document.getElementById("productStory").value = aiSuggestions.story;
  document.getElementById("productHashtags").value =
    aiSuggestions.hashtags;

  document.getElementById("productPrice").value = aiSuggestions.price;

document.getElementById("productCategory").value =
  aiSuggestions.category.toLowerCase() || "jewelry";

  document.getElementById("priceRangeMin").textContent =
    aiSuggestions.priceRange.min;

  document.getElementById("priceRangeMax").textContent =
    aiSuggestions.priceRange.max;

  showToast("Content regenerated successfully! 🔄");
}

// Product Management
// ===============================
// ✅ Product Management (MongoDB)
// ===============================

async function createProductListing() {

  if (!currentUser || currentUser.userType !== "artisan") {
    showToast("Only artisans can create product listings!", "error");
    return;
  }

  // Collect form data
 const productData = {
  name: document.getElementById("productName").value,
  price: parseFloat(document.getElementById("productPrice").value),
  description: document.getElementById("productDescription").value,
  category: document.getElementById("productCategory").value,

  // ✅ Add these extra fields here
  story: document.getElementById("productStory").value,
  hashtags: document.getElementById("productHashtags").value,
  image: uploadedImageData,

  artisan: {
    name: currentUser.name,
    email: currentUser.email
  }
};


  // Validation
  if (!productData.name || !productData.description || !productData.price || !productData.category) {
    showToast("Please fill in all required fields!", "error");
    return;
  }

  try {
    // ✅ Send product to MongoDB backend
    const response = await fetch("http://localhost:5000/api/products/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    console.log("Product Saved:", data);

    showToast("Product Added to MongoDB Successfully ✅");

    // Reload products
    // loadProductsFromDB();

    // Go to marketplace
    showPage("marketplace");

  } catch (error) {
    console.error("Error adding product:", error);
    showToast("Failed to add product!", "error");
    
  }
}


function viewArtisanProfile(artisanName) {
  const artisanProducts = allProducts.filter(
    (p) => p.artisan.name === artisanName
  );

  if (artisanProducts.length === 0) {
    showToast("No artisan products found!", "error");
    return;
  }

  const artisan = artisanProducts[0].artisan;

  showPage("artisan-details");

  document.getElementById("artisanName").textContent = artisan.name;
  document.getElementById("totalProducts").textContent =
    artisanProducts.length;

  document.getElementById("artisanBio").textContent =
    `${artisan.name} creates beautiful handmade items.`;

  const artisanProductsGrid =
    document.getElementById("artisanProducts");

  artisanProductsGrid.innerHTML = artisanProducts
    .map((product) => createProductCard(product))
    .join("");
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
  const cartItems = document.getElementById("cartItems");
  const emptyCart = document.getElementById("emptyCart");
  const cartSummary = document.getElementById("cartSummary");

  if (!cartItems) return;

  // ✅ If Cart Empty
  if (cart.length === 0) {
    cartItems.innerHTML = "";
    emptyCart.style.display = "block";
    cartSummary.style.display = "none"; // ✅ Hide summary
    return;
  }

  // ✅ Cart has items
  emptyCart.style.display = "none";
  cartSummary.style.display = "block"; // ✅ Show summary
  updateCartSummary(); // ✅ Update totals

  // ✅ Show Cart Items
  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">

          <img src="${item.image}" class="item-image" />

          <div class="item-details">
            <h3 class="item-title">${item.name}</h3>
            <p class="item-price">₹${item.price}</p>
          </div>

          <div class="quantity-controls">
            <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', -1)">−</button>
            <span class="quantity-display">${item.quantity}</span>
            <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', 1)">+</button>
          </div>

          <button class="remove-btn" onclick="removeFromCart('${item.id}')">
            ❌ Remove
          </button>

        </div>
      `
    )
    .join("");
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
function updateWishlistCount() {

  const wishlistCountEl = document.getElementById("wishlistCount");

  // ✅ If element not found, don't crash
  if (!wishlistCountEl) {
    console.warn("wishlistCount element not found in HTML");
    return;
  }

  wishlistCountEl.textContent = wishlist.length;
}


// Search and Filter Functions
function searchProducts() {
  const searchTerm = document
    .getElementById("searchInput")
    .value.toLowerCase();

  const categoryFilter =
    document.getElementById("categoryFilter").value;

  const priceFilter =
    document.getElementById("priceFilter").value;

  let filteredProducts = allProducts.filter((product) => {
    // ✅ Search Match
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.artisan.name.toLowerCase().includes(searchTerm);

    // ✅ Category Match (FIXED)
    const matchesCategory =
      !categoryFilter ||
      product.category.toLowerCase() === categoryFilter.toLowerCase();

    // ✅ Price Match
    let matchesPrice = true;

    if (priceFilter) {
      if (priceFilter === "0-1000") {
        matchesPrice = product.price <= 1000;
      } else if (priceFilter === "1000-5000") {
        matchesPrice = product.price > 1000 && product.price <= 5000;
      } else if (priceFilter === "5000-10000") {
        matchesPrice = product.price > 5000 && product.price <= 10000;
      } else if (priceFilter === "10000+") {
        matchesPrice = product.price > 10000;
      }
    }

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // ✅ Show Products
  const productsGrid = document.getElementById("productsGrid");

  productsGrid.innerHTML = filteredProducts
    .map((product) => createProductCard(product))
    .join("");

  // ✅ Empty State
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

// ===============================
// ✅ Payment Processing (Final Working)
// ===============================
function processPayment() {

  if (!currentUser) {
    showToast("Please login first!", "error");
    showPage("login");
    return;
  }

  if (cart.length === 0) {
    showToast("Cart is empty!", "error");
    return;
  }

  showLoadingOverlay("Processing Payment... Please wait 💳");

  setTimeout(() => {

    hideLoadingOverlay();

    showToast("Payment Successful 🎉", "success");

    const order = {
      id: "ORD" + Date.now(),
      user: currentUser.email,
      items: [...cart],
      date: new Date().toLocaleString(),
      status: "Paid ✅"
    };

    let orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount();
    updateCartSummary();
    displayCart();

    showOrderSuccessModal(order);

    setTimeout(() => {
      document.querySelector(".modal")?.remove();
      showPage("marketplace");
    }, 3000);

  }, 2500);
}


function showOrderSuccessModal(order) {

  const modal = document.createElement("div");
  modal.className = "modal";

  modal.innerHTML = `
    <div class="modal-content">

      <!-- ✅ Header -->
      <div class="modal-header">
        <h3 style="color:green;">
          ✅ Payment Successful!
        </h3>

       <button class="modal-close" onclick="this.closest('.modal').remove()">
          &times;
        </button>
      </div>

      <!-- ✅ Body -->
      <div class="modal-body" style="text-align:center;">

        <p style="font-size:18px; margin-bottom:15px;">
          Thank you for shopping on <b>ArtisanHub</b> ❤️
        </p>

        <p><b>Order ID:</b> ${order.id}</p>
        <p><b>Status:</b> ${order.status}</p>

        <!-- ✅ Button -->
        <div class="modal-buttons" style="margin-top:20px;">
          <button class="add-cart" onclick="this.closest('.modal').remove()">
            Continue Shopping 🛍
          </button>
        </div>

      </div>
    </div>
  `;

  // ✅ IMPORTANT: Append Modal to Body
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

  // ✅ Step 1: Check browser support
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    showToast("❌ Voice recognition not supported in this browser!", "error");
    return;
  }

  // ✅ Step 2: Create recognition object
  recognition = new SpeechRecognition();

  // ✅ Step 3: Language setting
  recognition.lang = currentLanguage === "hi" ? "hi-IN" : "en-US";

  // ✅ Step 4: Settings
  recognition.continuous = false;
  recognition.interimResults = false;

  // ✅ Step 5: When voice starts
  recognition.onstart = () => {
    isListening = true;
    document.getElementById("voiceIndicator").style.display = "block";
    showToast("🎤 Listening... Speak now");
  };

  // ✅ Step 6: When voice result comes
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;

    // Put text inside chatbot input box
    document.getElementById("chatbotInput").value = transcript;

    // Auto send message
    sendChatbotMessage();
  };

  // ✅ Step 7: Error handling (NO LOOP)
  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    showToast("❌ Voice Error: " + event.error, "error");
  };

  // ✅ Step 8: When voice stops
  recognition.onend = () => {
    isListening = false;
    document.getElementById("voiceIndicator").style.display = "none";
  };

  // ✅ Step 9: Start recognition
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
function addChatMessage(sender, message, isThinking = false) {

  const messagesContainer = document.getElementById("chatbotMessages");

  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;

  if (isThinking) {
    messageDiv.classList.add("thinking");
  }

  if (sender === "bot") {
    messageDiv.innerHTML = `<i class="fas fa-robot"></i> ${message}`;
  } else {
    messageDiv.textContent = message;
  }

  messagesContainer.appendChild(messageDiv);

  // ✅ AUTO SCROLL FIX (MOST IMPORTANT)
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}


async function handleChatbotQuery(query) {

  // ✅ Show thinking properly
  addChatMessage("bot", "Thinking... 🤖", true);

  try {
    const response = await fetch("http://localhost:5000/api/chatbot/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: query })
    });

    const data = await response.json();

    console.log("AI Response:", data);

    // ✅ Remove thinking message safely
    const thinkingMsg = document.querySelector(".message.bot.thinking");
    if (thinkingMsg) thinkingMsg.remove();

    // ✅ Show bot reply
    addChatMessage("bot", data.text);

  } catch (error) {

    console.log("Chatbot Error:", error);

    // ✅ Remove thinking message
    const thinkingMsg = document.querySelector(".message.bot.thinking");
    if (thinkingMsg) thinkingMsg.remove();

    addChatMessage("bot", "❌ Backend not responding");
  }
}





function startVoiceChat() {     
  startVoiceInput(); 
}
// ===============================
// ✅ MongoDB Products Integration (100% Working)
// ===============================

const API_URL = "http://localhost:5000/api/products";

// ✅ Load Products from MongoDB
async function loadProductsFromDB() {
  try {
    console.log("Fetching products from MongoDB...");

    const response = await fetch(API_URL);
    const data = await response.json();

    console.log("Products received:", data);
  data.forEach(p => console.log("IMAGE:", p.image));

    // ✅ Convert MongoDB products into frontend format
   allProducts = data.map((p) => ({
  id: String(p._id),
  name: p.name,
  price: p.price,
  description: p.description,
  category: p.category || "General",
  story: p.story || "No story available",
  hashtags: p.hashtags || "",

  // ✅ Correct Image Fix
image: p.image ? p.image : "https://via.placeholder.com/250",


  artisan: p.artisan || { name: "Local Artisan" },
}));

    // ✅ Display Products
    displayProducts();
  } catch (error) {
    console.log("Error loading products:", error);
  }
}

// ===============================
// ✅ Display Products in Marketplace
// ===============================
function displayProducts() {
  const productsGrid = document.getElementById("productsGrid");

  if (!productsGrid) {
    console.log("❌ productsGrid not found in HTML!");
    return;
  }

  // If no products
  if (allProducts.length === 0) {
    productsGrid.innerHTML = `
      <h2>No Products Available</h2>
      <p>Add the first product to your marketplace!</p>
    `;
    return;
  }

  // Show all products
  productsGrid.innerHTML = allProducts
    .map((product) => createProductCard(product))
    .join("");
}
function displayWishlist() {
  const wishlistItems = document.getElementById("wishlistItems");
  const emptyWishlist = document.getElementById("emptyWishlist");

  if (!wishlistItems) return;

  // ✅ If wishlist is empty
  if (wishlist.length === 0) {
    wishlistItems.innerHTML = "";
    emptyWishlist.style.display = "block";
    return;
  }

  // ✅ Hide empty message
  emptyWishlist.style.display = "none";

  // ✅ Show wishlist products
  wishlistItems.innerHTML = wishlist
    .map(
      (item) => `
        <div class="wishlist-item">

          <!-- ✅ Product Image -->
          <img 
            src="${
              item.image &&
              (item.image.startsWith("http") ||
                item.image.startsWith("data:image") ||
                item.image.startsWith("assets"))
                ? item.image
                : "https://via.placeholder.com/120"
            }"
            class="item-image"
          />

          <!-- ✅ Product Details -->
          <div class="item-details">
            <h3 class="item-title">${item.name}</h3>
            <p class="item-price">₹${item.price}</p>
          </div>

          <!-- ✅ Buttons -->
          <div class="item-actions">

            <button class="add-btn" onclick="addToCart('${item.id}')">
              🛒 Add to Cart
            </button>

            <button class="remove-btn" onclick="toggleWishlist('${item.id}')">
              ❌ Remove
            </button>

          </div>

        </div>
      `
    )
    .join("");
}



// ===============================
// ✅ Create Product Card (Fixed Image + Buttons)
// ===============================
function createProductCard(product) {
  // ✅ Safe Image Handling
 let productImage =
  product.image &&
  (product.image.startsWith("http") ||
   product.image.startsWith("data:image") ||
   product.image.startsWith("assets"))
    ? product.image
    : "https://via.placeholder.com/400";

  return `
  <div class="product-card">

   <img src="${productImage}" class="product-image"/>


    <div class="product-info">

      <h3 class="product-title">${product.name}</h3>

      <p class="product-description">${product.description}</p>

      <h4 class="product-price">₹${product.price}</h4>

      <p><b>By:</b> ${product.artisan.name}</p>

      <button onclick="viewArtisanProfile('${product.artisan.name}')">
        View Artisan Profile
      </button>

      <button onclick="viewProductDetails('${product.id}')">
        View Details
      </button>

      <button onclick="addToCart('${product.id}')">
        Add to Cart
      </button>

      <button onclick="toggleWishlist('${product.id}')">
        ❤️ Wishlist
      </button>

    </div>
  </div>
`;
}

// ===============================
// ✅ Add to Cart (Fixed ID Matching)
// ===============================
function addToCart(productId) {
  if (!currentUser) {
    showToast("Please login first!", "error");
    showPage("login");
    return;
  }

  const product = allProducts.find(
    (p) => String(p.id) === String(productId)
  );

  if (!product) {
    showToast("Product not found!", "error");
    return;
  }

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();

  // ✅ ADD THIS LINE
  displayCart();

  showToast(`${product.name} added to cart! ✅`);
}


// ===============================
// ✅ Wishlist Toggle (Fixed)
// ===============================
function toggleWishlist(productId) {

  if (!currentUser) {
    showToast("Please login first!", "error");
    showPage("login");
    return;
  }

  // ✅ Convert ID to string
  productId = String(productId);

  // ✅ Find product
  const product = allProducts.find(
    (p) => String(p.id) === productId
  );

  if (!product) {
    showToast("Product not found!", "error");
    return;
  }

  // ✅ Find index safely
  const index = wishlist.findIndex(
    (item) => String(item.id) === productId
  );

  // ✅ Remove if exists
  if (index > -1) {
    wishlist.splice(index, 1);
    showToast("Removed from wishlist ❌");
  }

  // ✅ Add if not exists
  else {
    wishlist.push(product);
    showToast("Added to wishlist ❤️");
  }

  // ✅ Save wishlist
  localStorage.setItem("wishlist", JSON.stringify(wishlist));

  // ✅ Update UI
  updateWishlistCount();
  displayWishlist();
}



// ===============================
// ✅ View Product Details Modal
// ===============================
function viewProductDetails(productId) {
  const product = allProducts.find(
    (p) => String(p.id) === String(productId)
  );

  if (!product) return;

let productImage = product.image;

if (!productImage) {
  productImage = "https://via.placeholder.com/400";
}


  const modal = document.createElement("div");
  modal.className = "modal";

 modal.innerHTML = `
  <div class="modal-content modern-modal">
  <button class="modal-close" onclick="this.closest('.modal').remove()">
  &times;
  </button>

  

    <div class="modal-flex">

      <!-- LEFT IMAGE -->
      <div class="modal-left">
        <img src="${productImage}" />
      </div>

      <!-- RIGHT DETAILS -->
      <div class="modal-right">
        <h2>${product.name}</h2>

        <p><b>Description:</b> ${product.description}</p>
        <p><b>Price:</b> ₹${product.price}</p>
        <p><b>Category:</b> ${product.category}</p>
        <p><b>Artisan:</b> ${product.artisan.name}</p>

        <!-- BUTTONS -->
        <div class="modal-buttons">
          <button class="add-cart" onclick="addToCart('${product.id}')">
            Add to Cart
          </button>

          <button class="wishlist" onclick="toggleWishlist('${product.id}')">
            ❤️ Wishlist
          </button>

          <button class="close-btn" onclick="this.closest('.modal').remove()">
            Close
          </button>
        </div>

      </div>

    </div>

  </div>
`;
  document.body.appendChild(modal);
}

document.addEventListener("DOMContentLoaded", function () {

  initializeApp();

  // ✅ Static Necklace Product (Correct Place)
  updateCartCount();
  updateWishlistCount();

  displayCart();
  displayWishlist();
  loadProductsFromDB(); 
  checkUserSession();
});
