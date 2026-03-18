// Multi-language translations
const translations = {
    en: {
        // Navigation
        nav_home: 'Home',
        nav_upload: 'Upload Product',
        nav_marketplace: 'Marketplace',
        nav_wishlist: 'Wishlist',
        nav_cart: 'Cart',
        nav_login: 'Login',
        nav_register: 'Register',
        nav_logout: 'Logout',
        
        // Hero Section
        hero_title: 'AI-Powered Marketplace for Local Artisans',
        hero_subtitle: 'Connect talented artisans with global audiences using cutting-edge AI technology. Upload your creations, let AI tell your story, and reach new digital markets.',
        hero_start_selling: 'Start Selling Today',
        hero_browse: 'Browse Marketplace',
        
        // Features
        feature_ai_title: 'AI-Powered Descriptions',
        feature_ai_desc: 'Advanced AI analyzes your products and creates compelling descriptions, stories, and pricing suggestions automatically.',
        feature_chatbot_title: 'Smart Chatbot & Voice Assistant',
        feature_chatbot_desc: 'Get instant help with AI chatbot and voice commands for seamless shopping experience.',
        feature_multilang_title: 'Multi-Language Support',
        feature_multilang_desc: 'Available in multiple Indian languages including Hindi, Marathi, Tamil, Telugu, and more.',
        feature_payment_title: 'Secure Payment Options',
        feature_payment_desc: 'Multiple payment methods including UPI, cards, wallets with automatic price detection.',
        
        // Authentication
        login_title: 'Login to Your Account',
        register_title: 'Create Your Account',
        email_label: 'Email',
        password_label: 'Password',
        name_label: 'Full Name',
        phone_label: 'Phone Number',
        user_type_label: 'User Type',
        select_role: 'Select your role...',
        artisan_role: 'Artisan (Seller)',
        buyer_role: 'Buyer',
        login_button: 'Login',
        register_button: 'Create Account',
        login_register_link: "Don't have an account? Register here",
        register_login_link: 'Already have an account? Login here',
        login_success: 'Login successful!',
        register_success: 'Registration successful!',
        logout_success: 'Logged out successfully!',
        login_error: 'Invalid credentials!',
        user_exists: 'User already exists!',
        
        // Placeholders
        email_placeholder: 'Enter your email',
        password_placeholder: 'Enter your password',
        password_create_placeholder: 'Create a password (min 6 characters)',
        name_placeholder: 'Enter your full name',
        phone_placeholder: 'Enter your phone number',
        type_message: 'Type your message...',
        search_products: 'Search products...',
        
        // Upload Page
        upload_title: 'Upload Your Artisan Product',
        upload_subtitle: 'Share your beautiful handcrafted items with the world. Our AI will help create compelling descriptions and suggest optimal pricing.',
        upload_click: 'Click to Upload Image',
        upload_formats: 'Supports JPG, PNG, GIF up to 10MB',
        generate_ai: 'Generate AI Suggestions',
        voice_input: 'Voice Input',
        
        // AI Suggestions
        ai_suggestions_title: 'AI-Generated Product Details',
        ai_suggestions_subtitle: 'Our AI has analyzed your product and generated compelling content with price suggestions.',
        ai_analyzing: 'AI is analyzing your product...',
        ai_generated_content: 'AI Generated Content',
        product_name_label: 'Product Name',
        suggested_price_label: 'AI Suggested Price (₹)',
        category_label: 'Category',
        select_category: 'Select Category...',
        description_label: 'Product Description',
        story_label: "Artisan's Story",
        hashtags_label: 'Marketing Hashtags',
        price_range: 'Recommended range: ₹',
        regenerate_content: 'Regenerate Content',
        create_listing: 'Create Product Listing',
        
        // Placeholders for AI
        ai_name_placeholder: 'AI will generate a catchy product name...',
        ai_description_placeholder: 'AI will create a detailed description...',
        ai_story_placeholder: 'AI will craft an engaging backstory...',
        ai_hashtags_placeholder: 'AI will suggest trending hashtags...',
        
        // Marketplace
        marketplace_title: 'Artisan Marketplace',
        marketplace_subtitle: 'Discover unique handcrafted items from talented local artisans worldwide.',
        all_categories: 'All Categories',
        all_prices: 'All Prices',
        product_suggestions: 'Product Suggestions',
        ai_product_suggestions: 'AI Product Suggestions',
        suggestion_based_on: 'Based on your browsing history and preferences:',
        
        // Cart & Wishlist
        cart_title: 'Shopping Cart',
        wishlist_title: 'My Wishlist',
        empty_cart_title: 'Your cart is empty',
        empty_cart_subtitle: 'Browse our marketplace and add some beautiful handcrafted items!',
        empty_wishlist_title: 'Your wishlist is empty',
        empty_wishlist_subtitle: 'Browse our marketplace and add items you love!',
        browse_marketplace: 'Browse Marketplace',
        order_summary: 'Order Summary',
        subtotal: 'Subtotal',
        shipping: 'Shipping',
        tax: 'Tax (18%)',
        total: 'Total',
        proceed_payment: 'Proceed to Payment',
        
        // Payment
        payment_title: 'Payment Details',
        select_payment_method: 'Select Payment Method',
        credit_debit_card: 'Credit/Debit Card',
        upi_payment: 'UPI Payment',
        digital_wallet: 'Digital Wallet',
        card_number: 'Card Number',
        expiry_date: 'Expiry Date',
        cardholder_name: 'Cardholder Name',
        upi_id: 'UPI ID',
        scan_qr: 'Or scan QR code to pay',
        complete_payment: 'Complete Secure Payment',
        
        // Artisan Profile
        about_artisan: 'About Artisan',
        specialization: 'Specialization',
        artisan_products: 'Products by this Artisan',
        products: 'Products',
        rating: 'Rating',
        years_exp: 'Years',
        
        // Chatbot
        ai_assistant: 'AI Assistant',
        listening: 'Listening...'
    },
    
    hi: {
        // Navigation
        nav_home: 'होम',
        nav_upload: 'उत्पाद अपलोड करें',
        nav_marketplace: 'बाजार',
        nav_wishlist: 'इच्छा सूची',
        nav_cart: 'कार्ट',
        nav_login: 'लॉगिन',
        nav_register: 'रजिस्टर',
        nav_logout: 'लॉगआउट',
        
        // Hero Section
        hero_title: 'स्थानीय कारीगरों के लिए AI-संचालित मार्केटप्लेस',
        hero_subtitle: 'अत्याधुनिक AI तकनीक का उपयोग करके प्रतिभाशाली कारीगरों को वैश्विक दर्शकों से जोड़ें। अपनी रचनाएं अपलोड करें और नए डिजिटल बाजारों तक पहुंचें।',
        hero_start_selling: 'आज ही बेचना शुरू करें',
        hero_browse: 'मार्केटप्लेस ब्राउज़ करें',
        
        // Features
        feature_ai_title: 'AI-संचालित विवरण',
        feature_ai_desc: 'उन्नत AI आपके उत्पादों का विश्लेषण करती है और स्वचालित रूप से आकर्षक विवरण, कहानियां और मूल्य सुझाव बनाती है।',
        feature_chatbot_title: 'स्मार्ट चैटबॉट और वॉयस असिस्टेंट',
        feature_chatbot_desc: 'निर्बाध शॉपिंग अनुभव के लिए AI चैटबॉट और वॉयस कमांड के साथ तत्काल सहायता प्राप्त करें।',
        feature_multilang_title: 'बहु-भाषा समर्थन',
        feature_multilang_desc: 'हिंदी, मराठी, तमिल, तेलुगु और अन्य भारतीय भाषाओं में उपलब्ध।',
        feature_payment_title: 'सुरक्षित भुगतान विकल्प',
        feature_payment_desc: 'स्वचालित मूल्य पहचान के साथ UPI, कार्ड, वॉलेट सहित कई भुगतान विधियां।',
        
        // Authentication
        login_title: 'अपने खाते में लॉगिन करें',
        register_title: 'अपना खाता बनाएं',
        email_label: 'ईमेल',
        password_label: 'पासवर्ड',
        name_label: 'पूरा नाम',
        phone_label: 'फ़ोन नंबर',
        user_type_label: 'उपयोगकर्ता प्रकार',
        select_role: 'अपनी भूमिका चुनें...',
        artisan_role: 'कारीगर (विक्रेता)',
        buyer_role: 'खरीदार',
        login_button: 'लॉगिन',
        register_button: 'खाता बनाएं',
        login_register_link: 'खाता नहीं है? यहाँ रजिस्टर करें',
        register_login_link: 'पहले से खाता है? यहाँ लॉगिन करें',
        login_success: 'लॉगिन सफल!',
        register_success: 'पंजीकरण सफल!',
        logout_success: 'सफलतापूर्वक लॉगआउट हुआ!',
        login_error: 'गलत क्रेडेंशियल!',
        user_exists: 'उपयोगकर्ता पहले से मौजूद है!',
        
        // Placeholders
        email_placeholder: 'अपना ईमेल दर्ज करें',
        password_placeholder: 'अपना पासवर्ड दर्ज करें',
        password_create_placeholder: 'पासवर्ड बनाएं (न्यूनतम 6 अक्षर)',
        name_placeholder: 'अपना पूरा नाम दर्ज करें',
        phone_placeholder: 'अपना फ़ोन नंबर दर्ज करें',
        type_message: 'अपना संदेश टाइप करें...',
        search_products: 'उत्पाद खोजें...',
        
        // Upload Page
        upload_title: 'अपना कारीगर उत्पाद अपलोड करें',
        upload_subtitle: 'दुनिया के साथ अपनी सुंदर हस्तनिर्मित वस्तुओं को साझा करें। हमारी AI आकर्षक विवरण बनाने में मदद करेगी।',
        upload_click: 'इमेज अपलोड करने के लिए क्लिक करें',
        upload_formats: 'JPG, PNG, GIF समर्थित 10MB तक',
        generate_ai: 'AI सुझाव उत्पन्न करें',
        voice_input: 'वॉयस इनपुट',
        
        // AI Suggestions
        ai_suggestions_title: 'AI-जेनरेटेड उत्पाद विवरण',
        ai_suggestions_subtitle: 'हमारी AI ने आपके उत्पाद का विश्लेषण किया है और मूल्य सुझावों के साथ आकर्षक सामग्री तैयार की है।',
        ai_analyzing: 'AI आपके उत्पाद का विश्लेषण कर रही है...',
        ai_generated_content: 'AI जेनरेटेड सामग्री',
        product_name_label: 'उत्पाद का नाम',
        suggested_price_label: 'AI सुझाया गया मूल्य (₹)',
        category_label: 'श्रेणी',
        select_category: 'श्रेणी चुनें...',
        description_label: 'उत्पाद विवरण',
        story_label: 'कारीगर की कहानी',
        hashtags_label: 'मार्केटिंग हैशटैग',
        price_range: 'सुझाई गई सीमा: ₹',
        regenerate_content: 'सामग्री पुनर्जनित करें',
        create_listing: 'उत्पाद लिस्टिंग बनाएं',
        
        // Placeholders for AI
        ai_name_placeholder: 'AI एक आकर्षक उत्पाद नाम उत्पन्न करेगी...',
        ai_description_placeholder: 'AI एक विस्तृत विवरण बनाएगी...',
        ai_story_placeholder: 'AI एक दिलचस्प कहानी तैयार करेगी...',
        ai_hashtags_placeholder: 'AI ट्रेंडिंग हैशटैग सुझाएगी...',
        
        // Marketplace
        marketplace_title: 'कारीगर मार्केटप्लेस',
        marketplace_subtitle: 'दुनिया भर के प्रतिभाशाली स्थानीय कारीगरों की अनूठी हस्तनिर्मित वस्तुओं की खोज करें।',
        all_categories: 'सभी श्रेणियां',
        all_prices: 'सभी कीमतें',
        product_suggestions: 'उत्पाद सुझाव',
        ai_product_suggestions: 'AI उत्पाद सुझाव',
        suggestion_based_on: 'आपके ब्राउज़िंग इतिहास और प्राथमिकताओं के आधार पर:',
        
        // Cart & Wishlist
        cart_title: 'शॉपिंग कार्ट',
        wishlist_title: 'मेरी इच्छा सूची',
        empty_cart_title: 'आपका कार्ट खाली है',
        empty_cart_subtitle: 'हमारे मार्केटप्लेस को ब्राउज़ करें और कुछ सुंदर हस्तनिर्मित वस्तुएं जोड़ें!',
        empty_wishlist_title: 'आपकी इच्छा सूची खाली है',
        empty_wishlist_subtitle: 'हमारे मार्केटप्लेस को ब्राउज़ करें और पसंदीदा आइटम जोड़ें!',
        browse_marketplace: 'मार्केटप्लेस ब्राउज़ करें',
        order_summary: 'ऑर्डर सारांश',
        subtotal: 'उप-योग',
        shipping: 'शिपिंग',
        tax: 'कर (18%)',
        total: 'कुल',
        proceed_payment: 'भुगतान के लिए आगे बढ़ें',
        
        // Payment
        payment_title: 'भुगतान विवरण',
        select_payment_method: 'भुगतान विधि चुनें',
        credit_debit_card: 'क्रेडिट/डेबिट कार्ड',
        upi_payment: 'UPI भुगतान',
        digital_wallet: 'डिजिटल वॉलेट',
        card_number: 'कार्ड नंबर',
        expiry_date: 'समाप्ति तिथि',
        cardholder_name: 'कार्डधारक का नाम',
        upi_id: 'UPI ID',
        scan_qr: 'या भुगतान के लिए QR कोड स्कैन करें',
        complete_payment: 'सुरक्षित भुगतान पूरा करें',
        
        // Artisan Profile
        about_artisan: 'कारीगर के बारे में',
        specialization: 'विशेषज्ञता',
        artisan_products: 'इस कारीगर के उत्पाद',
        products: 'उत्पाद',
        rating: 'रेटिंग',
        years_exp: 'वर्ष',
        
        // Chatbot
        ai_assistant: 'AI सहायक',
        listening: 'सुन रहा है...'
    },
    
    mr: {
        // Navigation
        nav_home: 'मुख्यपृष्ठ',
        nav_upload: 'उत्पादन अपलोड करा',
        nav_marketplace: 'बाजारपेठ',
        nav_wishlist: 'इच्छा यादी',
        nav_cart: 'कार्ट',
        nav_login: 'लॉगिन',
        nav_register: 'नोंदणी करा',
        nav_logout: 'लॉगआउट',
        
        // Hero Section
        hero_title: 'स्थानिक कारागिरांसाठी AI-चालित मार्केटप्लेस',
        hero_subtitle: 'अत्याधुनिक AI तंत्रज्ञान वापरून प्रतिभावान कारागिरांना जागतिक प्रेक्षकांशी जोडा। तुमच्या निर्मिती अपलोड करा आणि नवीन डिजिटल बाजारपेठेत पोहोचा।',
        hero_start_selling: 'आजच विक्री सुरू करा',
        hero_browse: 'मार्केटप्लेस ब्राउज करा',
        
        // Features
        feature_ai_title: 'AI-चालित वर्णन',
        feature_ai_desc: 'प्रगत AI तुमच्या उत्पादनांचे विश्लेषण करते आणि आपोआप आकर्षक वर्णन, कथा आणि किंमत सूचना तयार करते.',
        feature_chatbot_title: 'स्मार्ट चॅटबॉट आणि व्हॉईस असिस्टंट',
        feature_chatbot_desc: 'निर्बाध खरेदी अनुभवासाठी AI चॅटबॉट आणि व्हॉईस कमांडसह तत्काळ मदत मिळवा.',
        feature_multilang_title: 'बहु-भाषा सहाय्य',
        feature_multilang_desc: 'हिंदी, मराठी, तमिळ, तेलुगू आणि इतर भारतीय भाषांमध्ये उपलब्ध.',
        feature_payment_title: 'सुरक्षित पेमेंट पर्याय',
        feature_payment_desc: 'आपोआप किंमत ओळखसह UPI, कार्ड, वॉलेट यासह अनेक पेमेंट पद्धती.',
        
        // Authentication
        login_title: 'तुमच्या खात्यात लॉगिन करा',
        register_title: 'तुमचे खाते तयार करा',
        email_label: 'ईमेल',
        password_label: 'पासवर्ड',
        name_label: 'पूर्ण नाव',
        phone_label: 'फोन नंबर',
        user_type_label: 'वापरकर्ता प्रकार',
        select_role: 'तुमची भूमिका निवडा...',
        artisan_role: 'कारागीर (विक्रेता)',
        buyer_role: 'खरेदीदार',
        login_button: 'लॉगिन',
        register_button: 'खाते तयार करा',
        login_register_link: 'खाते नाही? येथे नोंदणी करा',
        register_login_link: 'आधीच खाते आहे? येथे लॉगिन करा',
        
        // Cart & Wishlist
        cart_title: 'शॉपिंग कार्ट',
        wishlist_title: 'माझी इच्छा यादी',
        empty_cart_title: 'तुमची कार्ट रिकामी आहे',
        empty_cart_subtitle: 'आमचा मार्केटप्लेस ब्राउज करा आणि काही सुंदर हस्तकला वस्तू जोडा!',
        empty_wishlist_title: 'तुमची इच्छा यादी रिकामी आहे',
        empty_wishlist_subtitle: 'आमचा मार्केटप्लेस ब्राउज करा आणि आवडत्या वस्तू जोडा!',
        browse_marketplace: 'मार्केटप्लेस ब्राउज करा',
        
        // Chatbot
        ai_assistant: 'AI सहाय्यक',
        listening: 'ऐकत आहे...'
    },
    
    te: {
        // Navigation
        nav_home: 'హోమ్',
        nav_upload: 'ఉత్పత్తి అప్‌లోడ్ చేయండి',
        nav_marketplace: 'మార్కెట్‌ప్లేస్',
        nav_wishlist: 'కోరిక జాబితా',
        nav_cart: 'కార్ట్',
        nav_login: 'లాగిన్',
        nav_register: 'రిజిస్టర్',
        nav_logout: 'లాగ్‌అవుట్',
        
        // Hero Section
        hero_title: 'స్థానిక కళాకారుల కోసం AI-పవర్డ్ మార్కెట్‌ప్లేస్',
        hero_subtitle: 'అత్యాధునిక AI సాంకేతికతతో ప్రతిభావంతులైన కళాకారులను ప్రపంచ ప్రేక్షకులతో కనెక్ట్ చేయండి.',
        hero_start_selling: 'ఈ రోజే అమ్మకాలు ప్రారంభించండి',
        hero_browse: 'మార్కెట్‌ప్లేస్ బ్రౌజ్ చేయండి',
        
        // Features
        feature_ai_title: 'AI-పవర్డ్ వర్ణనలు',
        feature_chatbot_title: 'స్మార్ట్ చాట్‌బాట్ మరియు వాయిస్ అసిస్టెంట్',
        feature_multilang_title: 'బహుళ భాషా మద్దతు',
        feature_payment_title: 'సురక్షిత పేమెంట్ ఎంపికలు',
        
        // Authentication
        login_title: 'మీ ఖాతాలోకి లాగిన్ అవండి',
        register_title: 'మీ ఖాతాను సృష్టించండి',
        email_label: 'ఇమెయిల్',
        password_label: 'పాస్‌వర్డ్',
        name_label: 'పూర్తి పేరు',
        phone_label: 'ఫోన్ నంబర్',
        user_type_label: 'వినియోగదారు రకం',
        artisan_role: 'కళాకారుడు (అమ్మకందారు)',
        buyer_role: 'కొనుగోలుదారు',
        
        // Cart & Wishlist
        cart_title: 'షాపింగ్ కార్ట్',
        wishlist_title: 'నా కోరిక జాబితా',
        
        // Chatbot
        ai_assistant: 'AI సహాయకుడు',
        listening: 'వింటోంది...'
    },
    
    ta: {
        // Navigation
        nav_home: 'முகப்பு',
        nav_upload: 'தயாரிப்பு அப்லோடு செய்க',
        nav_marketplace: 'சந்தை',
        nav_wishlist: 'விருப்ப பட்டியல்',
        nav_cart: 'வண்டி',
        nav_login: 'உள்நுழை',
        nav_register: 'பதிவு செய்க',
        nav_logout: 'வெளியேறு',
        
        // Hero Section
        hero_title: 'உள்ளூர் கைவினைஞர்களுக்கான AI-இயங்கும் சந்தை',
        hero_subtitle: 'அதிநவீன AI தொழில்நுட்பத்தைப் பயன்படுத்தி திறமையான கைவினைஞர்களை உலகளாவிய பார்வையாளர்களுடன் இணைக்கவும்.',
        hero_start_selling: 'இன்றே விற்பனையைத் தொடங்கவும்',
        hero_browse: 'சந்தையை உலாவவும்',
        
        // Features
        feature_ai_title: 'AI-இயங்கும் விளக்கங்கள்',
        feature_chatbot_title: 'ஸ்மார்ட் சாட்பாட் மற்றும் குரல் உதவியாளர்',
        feature_multilang_title: 'பல மொழி ஆதரவு',
        feature_payment_title: 'பாதுகாப்பான கட்டண விருப்பங்கள்',
        
        // Authentication
        login_title: 'உங்கள் கணக்கில் உள்நுழைக',
        register_title: 'உங்கள் கணக்கை உருவாக்கவும்',
        email_label: 'மின்னஞ்சல்',
        password_label: 'கடவுச்சொல்',
        name_label: 'முழு பெயர்',
        phone_label: 'தொலைபேசி எண்',
        user_type_label: 'பயனர் வகை',
        artisan_role: 'கைவினைஞர் (விற்பனையாளர்)',
        buyer_role: 'வாங்குபவர்',
        
        // Cart & Wishlist
        cart_title: 'வாங்கல் வண்டி',
        wishlist_title: 'என் விருப்ப பட்டியல்',
        
        // Chatbot
        ai_assistant: 'AI உதவியாளர்',
        listening: 'கேட்டுக்கொண்டிருக்கிறது...'
    },
    
    bn: {
        // Navigation
        nav_home: 'হোম',
        nav_upload: 'পণ্য আপলোড',
        nav_marketplace: 'মার্কেটপ্লেস',
        nav_wishlist: 'ইচ্ছা তালিকা',
        nav_cart: 'কার্ট',
        nav_login: 'লগইন',
        nav_register: 'নিবন্ধন',
        nav_logout: 'লগআউট',
        
        // Hero Section
        hero_title: 'স্থানীয় কারিগরদের জন্য AI-চালিত মার্কেটপ্লেস',
        hero_subtitle: 'অত্যাধুনিক AI প্রযুক্তি ব্যবহার করে প্রতিভাবান কারিগরদের বিশ্বব্যাপী দর্শকদের সাথে সংযুক্ত করুন।',
        hero_start_selling: 'আজই বিক্রয় শুরু করুন',
        hero_browse: 'মার্কেটপ্লেস ব্রাউজ করুন',
        
        // Features
        feature_ai_title: 'AI-চালিত বর্ণনা',
        feature_chatbot_title: 'স্মার্ট চ্যাটবট এবং ভয়েস সহায়ক',
        feature_multilang_title: 'বহু-ভাষা সহায়তা',
        feature_payment_title: 'নিরাপদ পেমেন্ট অপশন',
        
    }
}