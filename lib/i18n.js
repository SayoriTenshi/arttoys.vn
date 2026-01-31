/**
 * Internationalization (i18n) for Arttoys
 * Supports: English (en), Vietnamese (vi)
 */

const translations = {
  en: {
    // Tagline
    tagline: "Collecting is our passion",

    // Navigation
    "nav.products": "Products",
    "nav.about": "About",
    "nav.contact": "Contact",

    // Hero Section
    "hero.title": "Welcome to Arttoys",
    "hero.subtitle": "Collecting is our passion. Discover unique art toys and collectibles.",
    "hero.cta": "Browse Products",

    // TikTok Section
    "tiktok.title": "Latest Videos",
    "tiktok.subtitle": "Watch our latest TikTok content",

    // Products Section
    "products.title": "Featured Products",
    "products.subtitle": "Check out our latest collectibles",
    "products.series.tcoy": "Twinkle Twinkle Crush On You Series",

    // Product Names (TCOY Series)
    "products.tcoy.nerdy": "Nerdy Cupid",
    "products.tcoy.wyc": "When You Call",
    "products.tcoy.ihy": "I Hear You",
    "products.tcoy.blushing": "Blushing Moment",
    "products.tcoy.candy": "Candy Words",
    "products.tcoy.sweet": "Sweet Memories",

    // About Section
    "about.title": "About Us",
    "about.story": "[Arttoys story]",

    // Contact Section
    "contact.title": "Get in Touch",
    "contact.subtitle": "Have questions? We'd love to hear from you.",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.location": "Location",
    "contact.address": "HCM, Vietnam",
    "contact.followUs": "Follow Us",

    // Footer
    "footer.description": "Your trusted source for art toys and collectibles.",
    "footer.quickLinks": "Quick Links",
    "footer.aboutUs": "About Us",
    "footer.copyright": "© 2026 Arttoys. All rights reserved."
  },

  vi: {
    // Tagline
    tagline: "Sưu tầm là đam mê của chúng tôi",

    // Navigation
    "nav.products": "Sản phẩm",
    "nav.about": "Giới thiệu",
    "nav.contact": "Liên hệ",

    // Hero Section
    "hero.title": "Chào mừng đến với Arttoys",
    "hero.subtitle": "Sưu tầm là đam mê của chúng tôi. Khám phá các mô hình nghệ thuật và đồ sưu tầm độc đáo.",
    "hero.cta": "Xem sản phẩm",

    // TikTok Section
    "tiktok.title": "Video mới nhất",
    "tiktok.subtitle": "Xem các video TikTok mới nhất của chúng tôi",

    // Products Section
    "products.title": "Sản phẩm nổi bật",
    "products.subtitle": "Khám phá các sản phẩm mới nhất của chúng tôi",
    "products.series.tcoy": "Bộ sưu tập Twinkle Twinkle Crush On You",

    // Product Names (TCOY Series) - Keep original names or translate
    "products.tcoy.nerdy": "Nerdy Cupid",
    "products.tcoy.wyc": "When You Call",
    "products.tcoy.ihy": "I Hear You",
    "products.tcoy.blushing": "Blushing Moment",
    "products.tcoy.candy": "Candy Words",
    "products.tcoy.sweet": "Sweet Memories",

    // About Section
    "about.title": "Về chúng tôi",
    "about.story": "[Câu chuyện Arttoys]",

    // Contact Section
    "contact.title": "Liên hệ với chúng tôi",
    "contact.subtitle": "Bạn có câu hỏi? Chúng tôi rất muốn được nghe từ bạn.",
    "contact.email": "Email",
    "contact.phone": "Điện thoại",
    "contact.location": "Địa chỉ",
    "contact.address": "TP. Hồ Chí Minh, Việt Nam",
    "contact.followUs": "Theo dõi chúng tôi",

    // Footer
    "footer.description": "Nguồn cung cấp đáng tin cậy cho mô hình nghệ thuật và đồ sưu tầm.",
    "footer.quickLinks": "Liên kết nhanh",
    "footer.aboutUs": "Về chúng tôi",
    "footer.copyright": "© 2026 Arttoys. Bảo lưu mọi quyền."
  }
};

// Language display names
const langNames = {
  en: "EN",
  vi: "VI"
};

/**
 * Get translation for a key
 */
function t(key, lang) {
  const currentLang = lang || getCurrentLanguage();
  return translations[currentLang]?.[key] || translations.en[key] || key;
}

/**
 * Get current language from localStorage or default to 'en'
 */
function getCurrentLanguage() {
  return localStorage.getItem('arttoys-lang') || 'en';
}

/**
 * Set language and save to localStorage
 */
function setLanguage(lang) {
  if (translations[lang]) {
    localStorage.setItem('arttoys-lang', lang);
    applyTranslations(lang);
    updateLangDisplay(lang);
    document.documentElement.lang = lang;
  }
}

/**
 * Apply translations to all elements with data-i18n attribute
 */
function applyTranslations(lang) {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = t(key, lang);
    if (translation) {
      el.textContent = translation;
    }
  });
}

/**
 * Update language display in the navbar
 */
function updateLangDisplay(lang) {
  const langDisplay = document.getElementById('current-lang');
  if (langDisplay) {
    langDisplay.textContent = langNames[lang] || lang.toUpperCase();
  }

  // Update active state in dropdown
  document.querySelectorAll('[data-lang]').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-lang') === lang) {
      item.classList.add('active');
    }
  });
}

/**
 * Initialize language system
 */
function initI18n() {
  const currentLang = getCurrentLanguage();

  // Apply initial translations
  applyTranslations(currentLang);
  updateLangDisplay(currentLang);
  document.documentElement.lang = currentLang;

  // Add click handlers to language switcher
  document.querySelectorAll('[data-lang]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = item.getAttribute('data-lang');
      setLanguage(lang);
    });
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initI18n);
