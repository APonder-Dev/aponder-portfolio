import path from 'path'

// Where uploaded files live. In dev this defaults to public/uploads; in
// production set UPLOADS_DIR (e.g. /var/lib/aponder-portfolio/uploads) so
// uploads survive deploys. Keeping the production dir outside the project
// also avoids Turbopack build panics on symlinks that leave the repo root.
export const UPLOADS_DIR = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.join(process.cwd(), 'public', 'uploads')

export const MUSIC_DIR = path.join(UPLOADS_DIR, 'music')
