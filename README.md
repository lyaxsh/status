# Status Timeline App

A modern, password-protected timeline app with admin posting, random color dots, and pixel-perfect UI.

## Features
- Pixel-perfect vertical timeline with colored dots
- Admin page with random default color for each new update
- Password protection for both timeline and admin
- Timeline only at `/`, admin only at `/admin`
- No `/timeline` route
- Browser password managers discouraged from saving real passcode

## Local Development

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Set up your local database:**
   - By default, uses SQLite (`dev.db`).
   - To reset/clear updates:
     ```sh
     npx prisma db push
     npx prisma db execute --file=clear-updates.sql --schema=prisma/schema.prisma
     ```
3. **Start the dev server:**
   ```sh
   npm run dev
   ```

## Production/Deployment (Vercel)

- **Do NOT use `dev.db` or SQLite for production on Vercel.**
- Use a cloud database (Postgres, MySQL, or hosted SQLite like Turso).
- Set the `DATABASE_URL` environment variable in Vercel dashboard to your production DB.
- Vercel will auto-detect Next.js and deploy.
- All routes except `/` and `/admin` are redirected to `/`.

## Environment Variables

Create a `.env` file (not committed) with at least:
```
DATABASE_URL=your_database_url_here
ADMIN_PASSCODE=your_admin_passcode_here
```

## Useful Scripts
- `npm run dev` — Start local dev server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npx prisma migrate dev --name <desc>` — Run a new migration
- `npx prisma studio` — Visual DB browser
- `npx prisma db execute --file=clear-updates.sql --schema=prisma/schema.prisma` — Clear all updates

## Security Notes
- Password fields are protected from browser autofill.
- Passcode is required for both timeline and admin.
- Do not commit `.env` or `dev.db` to your repo.

---

**Deploy, enjoy, and stay secure!** 