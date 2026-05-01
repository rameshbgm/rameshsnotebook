# Ramesh's Notebook — Deployment Setup

## Stack
- Laravel 13, PHP 8.3+
- Vite (frontend build)
- Hostinger shared hosting (git deploy to `public_html/`)
- No database — file-based sessions and cache

---

## Repository
- **GitHub:** https://github.com/rameshbgm/rameshsnotebook.git
- **Branch:** `main`
- **Hostinger git deploy:** connected to `public_html/`

---

## Project Structure on Hostinger

```
public_html/               ← entire Laravel project lives here
├── .htaccess              ← root router (routes to public/)
├── .env                   ← production config (committed)
├── vendor/                ← PHP dependencies (committed, no SSH needed)
├── public/
│   ├── .htaccess          ← Laravel front controller routing
│   ├── index.php          ← Laravel entry point
│   ├── build/             ← compiled Vite assets (committed)
│   ├── ramesh_notebook_editorial.html   ← v1.0 portfolio
│   └── ramesh_notebook_terminal.html    ← v2.0 portfolio
└── ...
```

---

## Why vendor/ and public/build/ are committed

Hostinger shared hosting has no SSH/terminal access to run `composer install`
or `npm run build` post-deploy. All dependencies are committed to git so a
`git pull` is a fully self-contained deployment.

---

## .htaccess Files

### Root `.htaccess` (public_html/.htaccess)
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On

    # If a real file exists inside public/, serve it directly (CSS, JS, HTML, images)
    RewriteCond %{DOCUMENT_ROOT}/public%{REQUEST_URI} -f
    RewriteRule ^(.*)$ public/$1 [L]

    # Everything else goes straight to Laravel's front controller
    RewriteRule ^(.*)$ public/index.php [L]
</IfModule>
```

**Key rule:** always rewrite to `public/index.php`, never to the `public/` directory.
Rewriting to the directory triggers `Options -Indexes` in `public/.htaccess` → 403.

### `public/.htaccess` — standard Laravel, do not modify.

---

## .env (production)

```env
APP_NAME="Ramesh's Notebook"
APP_ENV=production
APP_KEY=base64:btSNyH61TU6K/300ZBaf7B7VNMZpTYAnvhwOJQbNvFY=
APP_DEBUG=false
APP_URL=https://rameshsnotebook.com

SESSION_DRIVER=file
SESSION_LIFETIME=120
CACHE_STORE=file
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=local
LOG_CHANNEL=single
LOG_LEVEL=error
```

---

## Deploy: Making Changes

```bash
# 1. Edit files locally

# 2. If PHP dependencies changed
composer install --no-dev --optimize-autoloader

# 3. If frontend (CSS/JS) changed
npm run build

# 4. Commit and push
git add -A
git commit -m "your message"
git push origin main
```

Hostinger auto-pulls on push (git deploy webhook). Done.

---

## Hostinger Settings to Verify

| Setting | Value |
|---|---|
| PHP Version | 8.3 or higher |
| Git deploy branch | main |
| Document root | public_html |

Check PHP version in Hostinger panel → **Hosting** → **PHP Configuration**.

---

## Errors Encountered & Fixes

| Error | Cause | Fix |
|---|---|---|
| **500 Internal Server Error** | `vendor/` missing — `index.php` couldn't find autoloader | Removed `vendor/`, `public/build/`, `.env` from `.gitignore` and committed them |
| **403 Forbidden** | Root `.htaccess` rewrote to `public/` directory → `Options -Indexes` blocked it | Changed rewrite target from `public/$1` directory to `public/index.php` for non-static requests |

---

## Version Selector

Both portfolio pages have a dropdown to switch between versions:
- **v1.0 Editorial** → `ramesh_notebook_editorial.html` (serif, magazine style)
- **v2.0 Terminal** → `ramesh_notebook_terminal.html` (monospace, dark theme)

User preference is persisted in `localStorage` so the browser remembers the last selection.
