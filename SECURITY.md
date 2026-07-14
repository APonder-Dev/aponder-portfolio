# Security Policy

## Supported Versions

This is a personal portfolio project. Security fixes are applied to the latest version only.

| Version | Supported |
|---|---|
| latest (`main`) | ✅ |
| older commits | ❌ |

---

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please **do not open a public GitHub issue**.

Instead, report it privately:

- **Email:** Anthony@aponder.dev
- **Subject line:** `[SECURITY] aponder-portfolio — <brief description>`
- **Discord:** aponder

### What to include

- A clear description of the vulnerability
- Steps to reproduce (proof-of-concept or reproduction script if possible)
- Potential impact assessment
- Any suggested mitigation or fix

### What to expect

- **Acknowledgement** within 48 hours
- **Status update** (confirmed / not reproducible / out of scope) within 5 business days
- **Fix timeline** communicated once the issue is confirmed
- Credit in the fix commit/changelog if desired

---

## Security Design Notes

The following decisions are intentional — please do not report them as vulnerabilities unless you have a bypass:

### Authentication
- Admin routes (`/admin/**`, `/api/admin/**`) require a valid JWT cookie (`admin_token`) signed with `ADMIN_SECRET`.
- Passwords are hashed with SHA-256 using `ADMIN_SECRET` as a pepper via Node's built-in `crypto` module. This is intentionally **not** bcrypt/argon2, because it runs at startup inside a VPS-deployed Node process where performance is not a concern and the pepper provides meaningful key-stretching defense against offline attacks assuming `ADMIN_SECRET` is kept secret.
- `lib/auth.ts` uses `jose` exclusively and is Edge Runtime-safe. `lib/password.ts` uses `node:crypto` and must never be imported in Edge routes (e.g., Next.js middleware or `proxy.ts`).

### Contact form
- A honeypot field (`website`) is included in the contact form. Submissions where this field is non-empty are silently rejected at the API level.
- No rate limiting is implemented at the application layer — this is expected to be handled at the Nginx/reverse-proxy level.

### Content Security
- Blog content is rendered via `react-markdown` with `rehype-highlight` and `rehype-slug`. Raw HTML in markdown posts is **not** sanitized by default — only trusted admin users should be able to create/edit posts.
- Media uploads are stored in `public/uploads/`. Uploaded filenames are sanitized but the directory should not be writable by the web process in production (handled by file system permissions).

### Out of Scope
- Vulnerabilities requiring physical access to the server
- Denial-of-service attacks against the SQLite database from an authenticated admin
- Issues in dependencies that have no known exploit path in this codebase
- Spam through the public contact form (no user accounts exist)

---

## Dependency Auditing

Run `npm audit` to check for known vulnerabilities in dependencies. Critical and high severity issues in the production dependency tree will be patched promptly.
