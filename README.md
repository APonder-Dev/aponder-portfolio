# APonder.dev — Portfolio

Full-stack personal portfolio for Anthony Ponder — Minecraft Plugin Developer & Software Engineer. Built with Next.js 16, Prisma 5, and Tailwind CSS. Includes a fully-featured admin panel, CMS, blog engine, and contact system.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript 5.5 |
| Styling | Tailwind CSS 3.4 + Framer Motion |
| Icons | Lucide React |
| Database | SQLite via Prisma 5 |
| Auth | `jose` (JWT, Edge-safe) + SHA-256 password hashing |
| Email | Nodemailer + Resend |
| Blog rendering | `react-markdown` + `rehype-highlight` + `rehype-slug` |

---

## Features

### Frontend
- Animated terminal hero card with live ASCII skill bars
- Scroll-triggered entrance animations (Framer Motion)
- Sticky header with scroll progress bar
- Mobile hamburger nav (closes on link tap)
- Filterable skills grid with category tabs
- Project cards with detail modals and GitHub links
- Multi-category pricing section with tab switcher
- 5-step process timeline
- Testimonials carousel with admin-managed content
- FAQ accordion
- Contact form with honeypot spam protection and email fallback
- Newsletter signup on blog posts
- Recent posts strip on homepage
- Light/dark mode toggle (ThemeContext)
- SEO metadata + Open Graph + JSON-LD structured data
- Auto-generated sitemap and robots.txt

### Blog (`/blog`)
- Tag filtering and full-text search (client-side)
- Table of contents (sticky sidebar, ≥3 headings)
- Reading time estimate
- View counter (incremented per unique visit)
- Prev/Next post navigation
- Related posts by shared tags
- Series grouping with ordered nav
- Code block copy buttons
- Newsletter subscribe widget
- Social share links (X, LinkedIn)
- Preview mode (time-locked token for draft review)

### Admin Panel (`/admin`)
Secured with JWT cookie. All content editable without a redeploy.

| Section | What you can do |
|---|---|
| Dashboard | View stats: total posts, published, drafts, price overrides |
| Site Content | Edit Hero, About, Skills, Services, Process, FAQ, Contact, SEO, Testimonials |
| Blog Posts | Create, edit, publish, schedule, delete; bulk publish/unpublish/delete |
| Inbox | View, reply to, archive, and delete contact form submissions |
| Subscribers | View newsletter subscribers, email all via BCC |
| Media | Upload images, copy URLs, delete files |
| Pricing | Manage categories and plans without touching code |
| Projects | Add/edit/reorder portfolio projects |
| Activity Log | Audit trail of admin actions |
| Settings | Change admin password |
| Availability | Toggle "Available for Projects" badge, update resume/booking URLs |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### 1. Clone and install

```bash
git clone https://github.com/APonder-Dev/aponder-portfolio.git
cd aponder-portfolio
npm install
```

### 2. Environment variables

Create a `.env.local` file in the project root:

```env
# Database (SQLite — path relative to project root)
DATABASE_URL="file:./prisma/dev.db"

# Admin authentication
ADMIN_SECRET="your-strong-random-secret-here"

# Email (pick one or both)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="you@example.com"
SMTP_PASS="your-smtp-password"
RESEND_API_KEY="re_xxxxxxxxxxxx"
FROM_EMAIL="Anthony <anthony@aponder.dev>"
```

### 3. Set up the database

```bash
npm run db:push
```

### 4. Run the dev server

```bash
npm run dev
# → http://localhost:3000
# → Admin: http://localhost:3000/admin
```

On first admin login, the password is set by hashing whatever you provide against `ADMIN_SECRET`. Set a password by calling `/api/admin/auth/setup` or using the admin UI once you're in.

---

## Production Build

```bash
npm run build
npm start
```

### VPS Deployment (Nginx + PM2)

**1. Build**

```bash
npm run build
```

**2. Copy to server**

```bash
rsync -avz .next/standalone/ user@your-vps:/var/www/aponder/
rsync -avz .next/static/     user@your-vps:/var/www/aponder/.next/static/
rsync -avz public/            user@your-vps:/var/www/aponder/public/
```

**3. Start with PM2**

```bash
cd /var/www/aponder
npm install -g pm2
PORT=3000 pm2 start server.js --name aponder
pm2 save && pm2 startup
```

**4. Nginx reverse proxy**

```nginx
server {
    listen 80;
    server_name aponder.dev www.aponder.dev;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name aponder.dev www.aponder.dev;

    ssl_certificate     /etc/letsencrypt/live/aponder.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/aponder.dev/privkey.pem;

    gzip on;
    gzip_types text/plain application/json application/javascript text/css;

    location /_next/static/ {
        alias /var/www/aponder/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /public/ {
        alias /var/www/aponder/public/;
        expires 30d;
    }

    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
```

**5. SSL**

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d aponder.dev -d www.aponder.dev
```

---

## Project Structure

```
aponder-portfolio/
├── app/
│   ├── admin/                  # Admin panel (all pages + components)
│   │   ├── _AdminToastContext.tsx
│   │   ├── _AvailabilityToggle.tsx
│   │   ├── layout.tsx          # Sidebar navigation
│   │   ├── page.tsx            # Dashboard
│   │   ├── blog/               # Blog CMS
│   │   ├── content/            # Site content tabs
│   │   ├── inbox/
│   │   ├── subscribers/
│   │   ├── media/
│   │   ├── pricing/
│   │   ├── projects/
│   │   ├── logs/
│   │   └── settings/
│   ├── blog/
│   │   ├── page.tsx            # Blog listing
│   │   └── [slug]/page.tsx     # Blog post
│   ├── api/                    # API routes
│   ├── globals.css
│   ├── layout.tsx              # Root layout + fonts + metadata
│   └── page.tsx                # Homepage
├── components/
│   ├── Header.tsx
│   ├── Hero.tsx                # Terminal animation + stats
│   ├── About.tsx
│   ├── Skills.tsx
│   ├── Services.tsx
│   ├── Projects.tsx
│   ├── Process.tsx
│   ├── Pricing.tsx
│   ├── Testimonials.tsx
│   ├── RecentPosts.tsx
│   ├── Contact.tsx
│   ├── Footer.tsx
│   ├── BlogList.tsx
│   ├── NewsletterSignup.tsx
│   ├── TableOfContents.tsx
│   └── ...
├── context/
│   └── ThemeContext.tsx
├── data/
│   ├── projects.ts
│   └── pricing.ts
├── lib/
│   ├── auth.ts                 # Edge-safe JWT helpers
│   ├── db.ts                   # Prisma client singleton
│   └── password.ts             # Node crypto SHA-256 hashing
├── prisma/
│   └── schema.prisma
├── public/
├── .env.local                  # (not committed — see setup above)
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## Customization

**Domain** — replace all `https://aponder.dev` references in `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`, and `components/Footer.tsx`.

**Content** — all site text (hero headline, about, services, skills, process steps, FAQ, testimonials, contact info, SEO) is editable from the admin panel at `/admin/content` after deployment. No code changes needed.

**Projects & Pricing** — manageable via `/admin/projects` and `/admin/pricing`.

**Static fallback data** — `data/projects.ts` and `data/pricing.ts` are used as defaults before any admin edits are saved.

---

## Security Notes

- `.env` and `.env.local` are excluded from version control
- The SQLite database (`prisma/dev.db`) is excluded from version control
- Admin routes require a valid JWT cookie signed with `ADMIN_SECRET`
- Passwords are hashed with SHA-256 + `ADMIN_SECRET` as pepper using Node's built-in `crypto` module
- `lib/auth.ts` is Edge Runtime-safe (`jose` only); `lib/password.ts` is Node-only — never mix them
- Contact form includes a honeypot field to filter bot submissions
- Delete actions throughout the admin panel require an armed-state confirmation click

See [SECURITY.md](./SECURITY.md) for the full vulnerability disclosure policy.

---

## License

MIT — see [LICENSE](./LICENSE).

Copyright © 2025 Anthony Ponder
