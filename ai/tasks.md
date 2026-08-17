# Implementation Tasks

## 1. UI Setup
- [x] Add Tailwind CSS, use #0984e3 as the primary color, #e17055 as the secondary color, and use other matching colors as and when needed.
- [x] Create landing page with header, footer, hero section, and put CTA to login/register. In header, keep the logo (you can generate an appropriate one), login and register link. In hero section, keep a heading about the website, a sub-heading, and CTA to login/register.

## 2. Auth Implementation
- [x] Implement Login page and integrate backend API for login. Ensure all fields accepted by backend API is present on the form.
- [x] Implement Register page and integrate backend API for register. Ensure all fields accepted by backend API is present on the form.

## 3. Dashboard Implementation
- [x] Implement Dashboard page showing paginated product list (max 20 items per page) sorted by nearing expiration date, summary metric cards, status badges, and user session management.

## 4. Add Product Feature (Separate Page)
- [x] Implement separate Add Product page (`/products/add`) allowing manual UPC entry, live device camera barcode scanning, product attributes (title, amount, category, location, expiry date, notes), integrated with backend API (`POST /products`).

## 5. Update & Delete Product Feature
- [x] Implement separate Edit Product page (`/products/edit/:id`) fetching details by ID, allowing update, and inline Delete confirmation dialog on Dashboard, integrated with backend APIs (`PUT /products/:id`, `DELETE /products/:id`).

## 6. Search & Filters Feature
- [x] Implement real-time search by title & UPC barcode, and filter options by expiry date range (within 7 days, 1 month, 3 months, expired) and category/location on Dashboard.