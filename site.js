const STORAGE_KEY = "coffeeShopCMSData";

const defaultContent = {
    businessName: "Your Coffee Shop",
    tagline: "Fresh brews, welcoming space, every day.",
    logoImage: "images/logo.jpg",
    heroEyebrow: "Crafted daily",
    heroTitle: "Welcome to Your Coffee Shop",
    heroSubtitle: "Customize this website easily with the built-in CMS.",
    heroImage: "images/coffee.jpg",
    announcement: "Open daily • Fresh pastries • Friendly service",
    menuSectionImage: "images/menu.jpg",
    menuSectionTitle: "Featured Menu",
    menuSectionSubtitle: "Update items anytime from the CMS panel.",
    aboutTitle: "About Our Shop",
    aboutText: "Share your story, highlight your specialties, and keep your website updated anytime.",
    featureTitle: "Why Customers Love Us",
    hoursTitle: "Opening Hours",
    locationTitle: "Location Guide",
    locationText: "Use the map below to find us easily and plan your visit.",
    mapEmbedUrl: "https://www.google.com/maps?q=coffee%20shop&output=embed",
    contactTitle: "Contact",
    cmsCtaTitle: "Need changes?",
    cmsCtaText: "Use the built-in CMS to edit this website in minutes.",
    cmsCtaButton: "Manage Content",
    menuCtaButton: "View Menu",
    visitCtaButton: "Visit Us",
    features: [
        "Single-page storefront layout",
        "CMS editor for non-technical staff",
        "Custom colors and branding",
        "Flexible menu and schedule"
    ],
    menuItems: [
        {
            name: "Cappuccino",
            description: "Velvety milk foam with rich espresso",
            price: "₱120",
            image: "images/cappucinno.jpg"
        },
        {
            name: "Matcha Latte",
            description: "Ceremonial matcha, lightly sweetened",
            price: "₱150",
            image: "images/matcha_latte.jpg"
        },
        {
            name: "Iced Americano",
            description: "Bold espresso over cold water and ice",
            price: "₱110",
            image: "images/iced_americano.jpg"
        },
        {
            name: "Blueberry Muffin",
            description: "Baked fresh daily with real blueberries",
            price: "₱110",
            image: "images/blueberry_muffin.jpg"
        }
    ],
    hours: [
        { day: "Monday - Friday", time: "7:00 AM - 8:00 PM" },
        { day: "Saturday", time: "8:00 AM - 9:00 PM" },
        { day: "Sunday", time: "8:00 AM - 6:00 PM" }
    ],
    contact: {
        address: "123 Main Street, Your City",
        phone: "+00 000 000 0000",
        email: "hello@yourcoffeeshop.com",
        messengerUrl: "https://m.me/yourcoffeeshop"
    },
    socialLinks: {
        facebook: "https://facebook.com",
        instagram: "https://instagram.com",
        tiktok: "https://tiktok.com"
    },
    theme: {
        primary: "#6a3f27",
        accent: "#c17c47"
    }
};

function loadContent() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
            return defaultContent;
        }

        const parsed = JSON.parse(saved);
        return {
            ...defaultContent,
            ...parsed,
            contact: {
                ...defaultContent.contact,
                ...(parsed.contact || {})
            },
            theme: {
                ...defaultContent.theme,
                ...(parsed.theme || {})
            },
            socialLinks: {
                ...defaultContent.socialLinks,
                ...(parsed.socialLinks || {})
            },
            menuItems: Array.isArray(parsed.menuItems) && parsed.menuItems.length > 0
                ? parsed.menuItems
                : defaultContent.menuItems,
            features: Array.isArray(parsed.features) && parsed.features.length > 0
                ? parsed.features
                : defaultContent.features,
            hours: Array.isArray(parsed.hours) && parsed.hours.length > 0
                ? parsed.hours
                : defaultContent.hours
        };
    } catch {
        return defaultContent;
    }
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function applyTheme(theme) {
    document.documentElement.style.setProperty("--primary", theme.primary);
    document.documentElement.style.setProperty("--accent", theme.accent);
}

function renderMenu(menuItems, menuSectionImage) {
    const menuGrid = document.getElementById("menuGrid");
    if (!menuGrid) {
        return;
    }

    if (!menuItems || menuItems.length === 0) {
        menuGrid.innerHTML = '<p class="empty-state">No menu items yet. Add some from CMS.</p>';
        return;
    }

    const itemCards = menuItems.map(item => {
        const name = item.name || "Untitled item";
        const description = item.description || "";
        const price = item.price || "";
        const image = item.image || "images/coffee.jpg";

        return `
            <article class="menu-card">
                <img src="${image}" alt="${name}">
                <div class="menu-card-content">
                    <h3>${name}</h3>
                    <p>${description}</p>
                    <p class="price">${price}</p>
                </div>
            </article>
        `;
    }).join("");

    menuGrid.innerHTML = itemCards;
}

function renderList(targetId, items) {
    const target = document.getElementById(targetId);
    if (!target) {
        return;
    }

    target.innerHTML = items.map(item => `<li>${item}</li>`).join("");
}

function renderHours(hours) {
    const hoursGrid = document.getElementById("hoursGrid");
    if (!hoursGrid) {
        return;
    }

    hoursGrid.innerHTML = hours.map(entry => {
        const day = entry.day || "Day";
        const time = entry.time || "Closed";
        return `
            <article class="hour-card">
                <h4>${day}</h4>
                <p>${time}</p>
            </article>
        `;
    }).join("");
}

function bindMenuImageModal(imageSrc, imageAlt) {
    const card = document.getElementById("menuImageCard");
    const modal = document.getElementById("menuImageModal");
    const modalImage = document.getElementById("menuModalImage");
    const closeButton = document.getElementById("closeMenuModal");
    const backdrop = document.getElementById("menuModalBackdrop");

    if (!card || !modal || !modalImage || !closeButton || !backdrop) {
        return;
    }

    const openModal = () => {
        modalImage.src = imageSrc;
        modalImage.alt = imageAlt;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
    };

    const closeModal = () => {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
    };

    card.onclick = openModal;
    card.onkeydown = event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openModal();
        }
    };
    closeButton.onclick = closeModal;
    backdrop.onclick = closeModal;
    modal.onkeydown = event => {
        if (event.key === "Escape") {
            closeModal();
        }
    };
}

function renderSite() {
    const content = loadContent();

    document.title = `${content.businessName} | Coffee Shop`;

    setText("brandName", content.businessName);
    setText("heroEyebrow", content.heroEyebrow);
    setText("heroTitle", content.heroTitle);
    setText("heroSubtitle", content.heroSubtitle);
    setText("announcementText", content.announcement);
    setText("menuSectionTitle", content.menuSectionTitle);
    setText("menuSectionSubtitle", content.menuSectionSubtitle);
    setText("aboutTitle", content.aboutTitle);
    setText("aboutText", content.aboutText);
    setText("featureTitle", content.featureTitle);
    setText("hoursTitle", content.hoursTitle);
    setText("locationTitle", content.locationTitle);
    setText("locationText", content.locationText);
    setText("footerShopName", content.businessName);
    setText("footerTagline", content.tagline);
    setText("contactTitle", content.contactTitle);
    setText("cmsCtaTitle", content.cmsCtaTitle);
    setText("cmsCtaText", content.cmsCtaText);
    setText("cmsCtaBtn", content.cmsCtaButton);
    setText("menuCtaBtn", content.menuCtaButton);
    setText("visitCtaBtn", content.visitCtaButton);
    setText("contactAddress", content.contact.address);
    setText("copyrightText", `© ${new Date().getFullYear()} ${content.businessName}. All rights reserved.`);

    const heroImage = document.getElementById("heroImage");
    if (heroImage) {
        heroImage.src = content.heroImage;
        heroImage.alt = `${content.businessName} hero image`;
    }

    const brandLogo = document.getElementById("brandLogo");
    if (brandLogo) {
        brandLogo.src = content.logoImage;
        brandLogo.alt = `${content.businessName} logo`;
    }

    renderMenu(content.menuItems, content.menuSectionImage);

    const menuSectionImage = document.getElementById("menuSectionImage");
    if (menuSectionImage) {
        menuSectionImage.src = content.menuSectionImage;
        menuSectionImage.alt = `${content.businessName} full menu image`;
    }

    setText("fullMenuTitle", "Full Menu");
    setText("menuImageCardTitle", "View Full Menu");

    bindMenuImageModal(content.menuSectionImage, `${content.businessName} full menu image`);

    const phoneLink = document.getElementById("contactPhone");
    if (phoneLink) {
        phoneLink.textContent = content.contact.phone;
        const phoneHref = String(content.contact.phone || "").replace(/\s+/g, "");
        phoneLink.href = phoneHref ? `tel:${phoneHref}` : "#";
    }

    const emailLink = document.getElementById("contactEmail");
    if (emailLink) {
        emailLink.textContent = content.contact.email;
        emailLink.href = content.contact.email ? `mailto:${content.contact.email}` : "#";
    }

    const messengerFab = document.getElementById("messengerFab");
    if (messengerFab) {
        messengerFab.href = content.contact.messengerUrl || "#";
    }

    const callFab = document.getElementById("callFab");
    if (callFab) {
        const phoneHref = String(content.contact.phone || "").replace(/\s+/g, "");
        callFab.href = phoneHref ? `tel:${phoneHref}` : "#";
    }

    const locationMap = document.getElementById("locationMap");
    if (locationMap) {
        locationMap.src = content.mapEmbedUrl;
    }

    const socialFacebook = document.getElementById("socialFacebook");
    if (socialFacebook) {
        socialFacebook.href = content.socialLinks.facebook || "#";
    }

    const socialInstagram = document.getElementById("socialInstagram");
    if (socialInstagram) {
        socialInstagram.href = content.socialLinks.instagram || "#";
    }

    const socialTiktok = document.getElementById("socialTiktok");
    if (socialTiktok) {
        socialTiktok.href = content.socialLinks.tiktok || "#";
    }

    renderList("featureList", content.features);
    renderHours(content.hours);
    applyTheme(content.theme);
}

renderSite();
