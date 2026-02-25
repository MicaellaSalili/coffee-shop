# Coffee Shop Website + CMS Prototype

A customizable coffee shop website with a browser-based CMS editor.

This repository is designed as a **prototype / MVP** for rapid demos, client reviews, and content iteration.

---

## 1) Project Overview

The project has two main interfaces:

- **Storefront** (`coffee_shop.html`) — customer-facing website
- **CMS Editor** (`cms.html`) — admin-style content editor

All content updates are applied through the CMS and reflected on the storefront after save.

---

## 2) Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- Browser `localStorage` for persistence

No backend or framework is required for this prototype.

---

## 3) File Structure

```text
coffee-shop/
├─ coffee_shop.html     # Public website
├─ cms.html             # CMS editor UI
├─ site.js              # Storefront rendering logic
├─ cms.js               # CMS form logic, validation, save/reset, uploads
├─ styles.css           # Shared styles (site + CMS)
├─ images/              # Static image assets
└─ README.md
```

---

## 4) Features

### Storefront

- Dynamic content rendering from CMS data
- Hero section with editable images/text
- Featured menu cards
- Separate full-menu image viewer with modal + close button
- About and feature highlights
- Opening hours section
- Location guide with embedded map
- Contact details and social links in footer
- Floating action buttons (Messenger + Call)

### CMS

- Section-based content editor
- Quick navigation sidebar
- Validation + status messages (info/success/error)
- Upload image support (logo, hero, menu section, and each menu item)
- “Change Selected Image” + “Clear Image” workflows
- Menu item add/remove support (up to 8 rows)
- Unsaved changes warning on tab close
- Reset to default content

---

## 5) How to Run

### Option A: With VS Code Live Server (recommended)

1. Open the project in VS Code.
2. Start Live Server on the project root.
3. Open:
	 - `coffee_shop.html` for storefront
	 - `cms.html` for CMS editor

### Option B: Open files directly

You can open `coffee_shop.html` and `cms.html` in a browser, but some embed/file behaviors may vary by browser security policy.

---

## 6) CMS Usage Guide

1. Open `cms.html`.
2. Use **Quick Navigation** to jump between sections.
3. Edit fields as needed.
4. Upload/change/clear images where applicable.
5. Click **Save Changes**.
6. Open `coffee_shop.html` (or click **View Website**) to verify updates.

### Image Field Behavior

- You can use either:
	- a file upload, or
	- an image path/URL
- If an image is already set, upload button changes to **Change Selected Image**.
- Use **Clear Image** to remove accidental selections.

---

## 7) Data Persistence Model

Data is stored in browser `localStorage` using:

- Key: `coffeeShopCMSData`

### Important Notes

- Data is saved **per browser profile/device**.
- Clearing browser storage removes saved CMS content.
- This is not multi-user and not cloud-synced.

---

## 8) Validation & Error Handling

The CMS currently validates:

- Required text fields
- URL format for social/messenger/map links
- Image references (data URL, relative path, or web URL)
- At least one menu item with name + price
- At least one opening-hours entry
- Storage save/reset error fallback messages

Status feedback is shown inline in the CMS (`Ready`, `Unsaved changes`, `Saved successfully`, error messages).

---

## 9) Content Areas Editable in CMS

- Branding (shop name, tagline, logo)
- Hero (title, subtitle, hero image)
- Announcement text
- Menu section image (full menu)
- Menu item list (name, description, price, image)
- About section content
- Feature list
- Opening hours list
- Contact details (address, phone, email)
- Social links (Facebook, Instagram, TikTok)
- Messenger link
- Location section and map embed URL
- Theme colors (primary/accent)

---

## 10) Security & Production Disclaimer

This CMS is a **prototype**.

It does **not** include:

- authentication/login
- role-based access control
- backend database
- secure media storage
- audit logs

Use this for prototype/demo workflows, not as a production-secure CMS.

---

## 11) Handover Checklist (If Selling/Transferring)

When handing this to a client/team, transfer:

- Source code repository
- Domain + hosting credentials
- Any third-party accounts (maps, analytics, etc.)
- Asset files (images, logos, menu image)
- Setup guide (this README)

Also explain that prototype CMS data is browser-local unless migrated to backend.

---

## 12) Recommended Next Step (Production CMS)

To evolve into production:

1. Add authentication for admin users
2. Move data to backend DB/API
3. Use secure cloud media storage
4. Add role permissions and audit log
5. Add backup/export tools

Possible stacks:

- Supabase (Auth + DB + Storage)
- Firebase (Auth + Firestore + Storage)
- Headless CMS (Sanity/Contentful/Strapi)

---

## 13) Troubleshooting

### Changes are not showing on storefront

- Ensure you clicked **Save Changes** in CMS.
- Refresh `coffee_shop.html`.
- Confirm you’re using the same browser profile.

### Wrong data still appears

- Existing `localStorage` may override defaults.
- Use **Reset to Default** in CMS, then save again.

### Map not rendering

- Use a valid embeddable map URL (Google Maps embed format).


