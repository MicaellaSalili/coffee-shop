const STORAGE_KEY = "coffeeShopCMSData";
let hasUnsavedChanges = false;

const defaultContent = {
    businessName: "Your Coffee Shop",
    tagline: "Fresh brews, welcoming space, every day.",
    logoImage: "images/logo.jpg",
    heroTitle: "Welcome to Your Coffee Shop",
    heroSubtitle: "Customize this website easily with the built-in CMS.",
    heroImage: "images/coffee.jpg",
    menuSectionImage: "images/menu.jpg",
    announcement: "Open daily • Fresh pastries • Friendly service",
    aboutTitle: "About Our Shop",
    aboutText: "Share your story, highlight your specialties, and keep your website updated anytime.",
    locationTitle: "Location Guide",
    locationText: "Use the map below to find us easily and plan your visit.",
    mapEmbedUrl: "https://www.google.com/maps?q=coffee%20shop&output=embed",
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
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return { ...defaultContent };
        }

        const parsed = JSON.parse(raw);
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
            menuItems: Array.isArray(parsed.menuItems) ? parsed.menuItems : defaultContent.menuItems,
            features: Array.isArray(parsed.features) ? parsed.features : defaultContent.features,
            hours: Array.isArray(parsed.hours) ? parsed.hours : defaultContent.hours
        };
    } catch {
        return { ...defaultContent };
    }
}

function setStatus(message, type = "info") {
    const status = document.getElementById("cmsStatus");
    if (!status) {
        return;
    }

    status.textContent = message;
    status.className = `cms-status cms-status-${type}`;
}

function isValidUrl(value) {
    try {
        const parsed = new URL(value);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}

function isValidImageReference(value) {
    if (!value) {
        return false;
    }

    if (value.startsWith("data:image/")) {
        return true;
    }

    if (value.startsWith("images/") || value.startsWith("./") || value.startsWith("../")) {
        return true;
    }

    return isValidUrl(value);
}

function setFieldValidation(input, condition, message) {
    if (!input) {
        return;
    }

    input.setCustomValidity(condition ? "" : message);
}

function validatePayload(payload, form) {
    const checks = [
        { input: form.businessName, valid: payload.businessName.length > 1, message: "Enter a business name." },
        { input: form.heroTitle, valid: payload.heroTitle.length > 1, message: "Enter a hero title." },
        { input: form.heroSubtitle, valid: payload.heroSubtitle.length > 3, message: "Enter a longer hero subtitle." },
        { input: form.logoImage, valid: isValidImageReference(payload.logoImage), message: "Use a valid logo image path, URL, or upload." },
        { input: form.heroImage, valid: isValidImageReference(payload.heroImage), message: "Use a valid hero image path, URL, or upload." },
        { input: form.menuSectionImage, valid: isValidImageReference(payload.menuSectionImage), message: "Use a valid menu image path, URL, or upload." },
        { input: form.messengerUrl, valid: isValidUrl(payload.contact.messengerUrl), message: "Messenger link must be a valid URL." },
        { input: form.facebookUrl, valid: isValidUrl(payload.socialLinks.facebook), message: "Facebook link must be a valid URL." },
        { input: form.instagramUrl, valid: isValidUrl(payload.socialLinks.instagram), message: "Instagram link must be a valid URL." },
        { input: form.tiktokUrl, valid: isValidUrl(payload.socialLinks.tiktok), message: "TikTok link must be a valid URL." },
        { input: form.mapEmbedUrl, valid: isValidUrl(payload.mapEmbedUrl), message: "Map embed URL must be a valid URL." }
    ];

    checks.forEach(check => setFieldValidation(check.input, check.valid, check.message));

    const mapLooksEmbeddable = /google\.[^/]+\/maps|output=embed|pb=!/i.test(payload.mapEmbedUrl);
    setFieldValidation(form.mapEmbedUrl, mapLooksEmbeddable, "Use a Google Maps embed URL.");

    const hasMenuItems = payload.menuItems.length > 0;
    const menuHasNameAndPrice = payload.menuItems.every(item => item.name && item.price);
    if (!hasMenuItems || !menuHasNameAndPrice) {
        setStatus("Add at least one menu item with both name and price.", "error");
        return false;
    }

    const hasHours = payload.hours.length > 0;
    if (!hasHours) {
        setStatus("Add at least one opening hours entry.", "error");
        return false;
    }

    if (!form.checkValidity()) {
        form.reportValidity();
        setStatus("Please fix the highlighted fields and try again.", "error");
        return false;
    }

    return true;
}

function createMenuRow(item = {}) {
    const fileInputId = `menu-image-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const row = document.createElement("div");
    row.className = "menu-row";
    row.innerHTML = `
        <label>Name <input type="text" data-menu="name" value="${item.name || ""}"></label>
        <label>Description <input type="text" data-menu="description" value="${item.description || ""}"></label>
        <label>Price <input type="text" data-menu="price" value="${item.price || ""}"></label>
        <label class="menu-image-field">Image Path/URL <input type="text" data-menu="image" value="${item.image || ""}"></label>
        <div class="menu-image-tools">
            <input type="file" id="${fileInputId}" data-menu="image-file" accept="image/*" hidden>
            <button type="button" class="btn btn-outline cms-dark-outline menu-upload-btn">Upload Image</button>
            <button type="button" class="btn btn-outline cms-dark-outline menu-clear-btn">Clear Image</button>
            <button type="button" class="btn btn-outline cms-dark-outline remove-row">Remove</button>
        </div>
        <img class="cms-menu-item-preview" src="${item.image || ""}" alt="Menu item image preview">
    `;

    const imageInput = row.querySelector('[data-menu="image"]');
    const imageFileInput = row.querySelector('[data-menu="image-file"]');
    const uploadButton = row.querySelector(".menu-upload-btn");
    const clearButton = row.querySelector(".menu-clear-btn");
    const previewImage = row.querySelector(".cms-menu-item-preview");

    const updateMenuImagePreview = imageValue => {
        previewImage.src = imageValue || "";
        uploadButton.textContent = imageValue ? "Change Selected Image" : "Upload Image";
    };

    imageInput.addEventListener("input", () => {
        updateMenuImagePreview(imageInput.value.trim());
        hasUnsavedChanges = true;
        setStatus("You have unsaved changes.", "info");
    });

    uploadButton.addEventListener("click", () => {
        imageFileInput.click();
    });

    imageFileInput.addEventListener("change", async event => {
        const selectedFile = event.target.files && event.target.files[0];
        if (!selectedFile) {
            return;
        }

        try {
            const dataUrl = await readFileAsDataUrl(selectedFile);
            imageInput.value = dataUrl;
            updateMenuImagePreview(dataUrl);
            hasUnsavedChanges = true;
            setStatus("Menu item image selected. Save to apply changes.", "info");
        } catch {
            setStatus("Could not read selected menu image.", "error");
        }
    });

    clearButton.addEventListener("click", () => {
        imageInput.value = "";
        imageFileInput.value = "";
        updateMenuImagePreview("");
        hasUnsavedChanges = true;
        setStatus("Menu item image cleared.", "info");
    });

    row.querySelector(".remove-row").addEventListener("click", () => {
        row.remove();
        hasUnsavedChanges = true;
        setStatus("Menu item removed.", "info");
    });

    updateMenuImagePreview(item.image || "");
    return row;
}

function setPreview(previewId, imageSrc, fallbackAlt) {
    const preview = document.getElementById(previewId);
    if (!preview) {
        return;
    }

    preview.src = imageSrc || "";
    preview.alt = fallbackAlt;
}

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Failed to read selected image."));
        reader.readAsDataURL(file);
    });
}

function hydrateForm(content) {
    const form = document.getElementById("cmsForm");

    form.businessName.value = content.businessName;
    form.tagline.value = content.tagline;
    form.logoImage.value = content.logoImage;
    form.heroTitle.value = content.heroTitle;
    form.heroSubtitle.value = content.heroSubtitle;
    form.heroImage.value = content.heroImage;
    form.menuSectionImage.value = content.menuSectionImage;
    form.announcement.value = content.announcement;
    form.aboutTitle.value = content.aboutTitle;
    form.aboutText.value = content.aboutText;
    form.locationTitle.value = content.locationTitle;
    form.locationText.value = content.locationText;
    form.mapEmbedUrl.value = content.mapEmbedUrl;
    form.features.value = content.features.join("\n");
    form.hours.value = content.hours.map(item => `${item.day} | ${item.time}`).join("\n");
    form.address.value = content.contact.address;
    form.phone.value = content.contact.phone;
    form.email.value = content.contact.email;
    form.messengerUrl.value = content.contact.messengerUrl;
    form.facebookUrl.value = content.socialLinks.facebook;
    form.instagramUrl.value = content.socialLinks.instagram;
    form.tiktokUrl.value = content.socialLinks.tiktok;
    form.primary.value = content.theme.primary;
    form.accent.value = content.theme.accent;

    const menuEditor = document.getElementById("menuEditor");
    menuEditor.innerHTML = "";
    (content.menuItems || []).forEach(item => menuEditor.appendChild(createMenuRow(item)));
    if ((content.menuItems || []).length === 0) {
        menuEditor.appendChild(createMenuRow());
    }

    setPreview("logoPreview", content.logoImage, "Logo preview");
    setPreview("heroPreview", content.heroImage, "Hero preview");
    setPreview("menuSectionPreview", content.menuSectionImage, "Menu section preview");
}

function buildPayload(form) {
    const featureList = form.features.value
        .split("\n")
        .map(item => item.trim())
        .filter(Boolean);

    const hoursList = form.hours.value
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
            const [day, time] = line.split("|").map(part => (part || "").trim());
            return {
                day: day || "Day",
                time: time || "Closed"
            };
        });

    const menuItems = Array.from(document.querySelectorAll("#menuEditor .menu-row"))
        .map(row => {
            const name = row.querySelector('[data-menu="name"]').value.trim();
            const description = row.querySelector('[data-menu="description"]').value.trim();
            const price = row.querySelector('[data-menu="price"]').value.trim();
            const image = row.querySelector('[data-menu="image"]').value.trim();

            return { name, description, price, image };
        })
        .filter(item => item.name || item.description || item.price || item.image);

    return {
        businessName: form.businessName.value.trim(),
        tagline: form.tagline.value.trim(),
        logoImage: form.logoImage.value.trim(),
        heroTitle: form.heroTitle.value.trim(),
        heroSubtitle: form.heroSubtitle.value.trim(),
        heroImage: form.heroImage.value.trim(),
        menuSectionImage: form.menuSectionImage.value.trim(),
        announcement: form.announcement.value.trim(),
        aboutTitle: form.aboutTitle.value.trim(),
        aboutText: form.aboutText.value.trim(),
        locationTitle: form.locationTitle.value.trim(),
        locationText: form.locationText.value.trim(),
        mapEmbedUrl: form.mapEmbedUrl.value.trim(),
        features: featureList,
        menuItems,
        hours: hoursList,
        contact: {
            address: form.address.value.trim(),
            phone: form.phone.value.trim(),
            email: form.email.value.trim(),
            messengerUrl: form.messengerUrl.value.trim()
        },
        socialLinks: {
            facebook: form.facebookUrl.value.trim(),
            instagram: form.instagramUrl.value.trim(),
            tiktok: form.tiktokUrl.value.trim()
        },
        theme: {
            primary: form.primary.value,
            accent: form.accent.value
        }
    };
}

function bindEvents() {
    const form = document.getElementById("cmsForm");

    const imageBindings = [
        {
            inputName: "logoImage",
            fileId: "logoImageFile",
            uploadBtnId: "logoImageUploadBtn",
            clearBtnId: "logoImageClearBtn",
            previewId: "logoPreview",
            alt: "Logo preview"
        },
        {
            inputName: "heroImage",
            fileId: "heroImageFile",
            uploadBtnId: "heroImageUploadBtn",
            clearBtnId: "heroImageClearBtn",
            previewId: "heroPreview",
            alt: "Hero preview"
        },
        {
            inputName: "menuSectionImage",
            fileId: "menuSectionImageFile",
            uploadBtnId: "menuSectionImageUploadBtn",
            clearBtnId: "menuSectionImageClearBtn",
            previewId: "menuSectionPreview",
            alt: "Menu section preview"
        }
    ];

    imageBindings.forEach(binding => {
        const textInput = form[binding.inputName];
        const fileInput = document.getElementById(binding.fileId);
        const uploadButton = document.getElementById(binding.uploadBtnId);
        const clearButton = document.getElementById(binding.clearBtnId);

        const syncUploadButtonLabel = () => {
            if (!uploadButton) {
                return;
            }
            uploadButton.textContent = textInput.value.trim() ? "Change Selected Image" : "Upload Image";
        };

        textInput.addEventListener("input", () => {
            setPreview(binding.previewId, textInput.value.trim(), binding.alt);
            syncUploadButtonLabel();
            hasUnsavedChanges = true;
            setStatus("You have unsaved changes.", "info");
        });

        uploadButton.addEventListener("click", () => {
            fileInput.click();
        });

        fileInput.addEventListener("change", async event => {
            const selectedFile = event.target.files && event.target.files[0];
            if (!selectedFile) {
                return;
            }

            try {
                const dataUrl = await readFileAsDataUrl(selectedFile);
                textInput.value = dataUrl;
                setPreview(binding.previewId, dataUrl, binding.alt);
                syncUploadButtonLabel();
                hasUnsavedChanges = true;
                setStatus("Image uploaded. Save to apply changes to the website.", "info");
            } catch {
                setStatus("Could not read the selected image. Please try another file.", "error");
            }
        });

        clearButton.addEventListener("click", () => {
            textInput.value = "";
            fileInput.value = "";
            setPreview(binding.previewId, "", binding.alt);
            syncUploadButtonLabel();
            hasUnsavedChanges = true;
            setStatus("Image cleared.", "info");
        });

        syncUploadButtonLabel();
    });

    form.addEventListener("input", () => {
        hasUnsavedChanges = true;
    });

    form.addEventListener("submit", event => {
        event.preventDefault();
        const payload = buildPayload(form);

        if (!validatePayload(payload, form)) {
            return;
        }

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
            hasUnsavedChanges = false;
            setStatus("Saved successfully. Open the website to see your updates.", "success");
        } catch {
            setStatus("Save failed. Browser storage might be full or blocked.", "error");
        }
    });

    document.getElementById("addMenuItem").addEventListener("click", () => {
        const menuEditor = document.getElementById("menuEditor");
        if (menuEditor.querySelectorAll(".menu-row").length >= 8) {
            setStatus("Maximum of 8 menu items allowed.", "error");
            return;
        }
        menuEditor.appendChild(createMenuRow());
        hasUnsavedChanges = true;
        setStatus("Menu item row added.", "info");
    });

    document.getElementById("resetDefault").addEventListener("click", () => {
        const confirmed = window.confirm("Reset CMS content to default values?");
        if (!confirmed) {
            return;
        }

        try {
            localStorage.removeItem(STORAGE_KEY);
            hydrateForm(defaultContent);
            hasUnsavedChanges = false;
            setStatus("Reset to default content.", "success");
        } catch {
            setStatus("Reset failed. Please refresh and try again.", "error");
        }
    });

    window.addEventListener("beforeunload", event => {
        if (!hasUnsavedChanges) {
            return;
        }

        event.preventDefault();
        event.returnValue = "";
    });
}

(function initCMS() {
    const content = loadContent();
    hydrateForm(content);
    bindEvents();
    setStatus("Ready to edit.", "info");
})();
