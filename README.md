# Amma's Hurlikattu — online store

A mobile-first store for a homemade South Indian food brand. Customers pay with any UPI app, upload a payment screenshot, and the owner checks each payment by hand in a private admin panel. There is no payment gateway.

**Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · Prisma (SQLite locally, Postgres in production) · private file storage (local disk or any S3-compatible bucket).

## Quick start

```bash
npm install
cp .env.example .env          # then edit the values (see below)
npx prisma migrate dev        # creates the database
npm run dev                   # http://localhost:3000
```

The admin panel is at `/admin`. Log in with `ADMIN_PASSWORD`.

## Pages

| Route | What it does |
| --- | --- |
| `/` | Home: hero, trust badges, brand story, how ordering works, FAQ |
| `/shop` | Product page: gallery, quantity, live total, Buy Now, ingredients, preparation, delivery info |
| `/cart` | Cart with a live order summary |
| `/checkout` | One page in 3 steps: delivery details → UPI QR (amount filled in) → screenshot upload → Place Order |
| `/order/[code]` | Order success page and live status timeline (shows no phone number or address) |
| `/track` | Look up an order by its ID |
| `/admin` | Protected. Sales stats, status filters, search by ID, phone or name |
| `/admin/orders/[id]` | Protected. Customer and address, payment screenshot, status, courier tracking, private notes, WhatsApp the customer |

## Configuration

| Variable | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | Owner login password. **Required.** Use a long one. |
| `ADMIN_SESSION_SECRET` | 32+ random characters for signing admin sessions. **Required.** |
| `NEXT_PUBLIC_UPI_ID` / `NEXT_PUBLIC_UPI_PAYEE_NAME` | Shown on checkout and encoded in the QR code |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Country code + number, digits only (e.g. `919876543210`) |
| `DATABASE_URL` | SQLite file locally; Postgres URL in production |
| `STORAGE_DRIVER` + `S3_*` | `local` or `s3` (works with AWS S3, Cloudflare R2, Backblaze B2, MinIO) |

**Edit the product, price and copy in one place:** [src/lib/product.ts](src/lib/product.ts). Delivery fee, free-delivery threshold and delivery times are in [src/lib/config.ts](src/lib/config.ts).

**Photos:** the images in `public/images/*.svg` are illustrated placeholders. Add real food photos (JPG or WEBP, square, at least 1200 px) to `public/images/` and update the paths in `product.ts`. They are optimized automatically.

## How orders work

1. The browser sends the form and screenshot to `POST /api/orders`.
2. The server checks every field (Indian mobile number, pincode, state), recalculates the price itself (it never trusts the amount from the browser), and checks the image's real file type from its contents (JPG, PNG or WEBP, up to 5 MB).
3. The screenshot is saved to **private** storage. It is never placed in `/public`, and only a logged-in admin can view it, through `/api/admin/screenshots/[id]`.
4. The order is saved with status **Payment Verification**, and the customer gets an ID like `HK-7VF5-ERQS`.
5. The owner compares the screenshot or UTR with their bank app, then moves the order through Confirmed → Preparing → Shipped → Delivered. Every change is logged and shown on the customer's tracking page.

## Security notes

- The admin login uses an HS256-signed, httpOnly, SameSite=strict cookie that lasts 7 days. `src/proxy.ts` guards `/admin/*` and `/api/admin/*`, and every admin page and API route checks the session again on the server.
- Login attempts and order submissions are rate-limited per IP. The limiter keeps its counts in memory, so if you run more than one server instance, switch to Redis or Upstash.
- The public order page only shows the first name, city, quantity, total and status.

## Deploying to production

1. Create a Postgres database (Neon, Supabase, Railway…). In `prisma/schema.prisma`, change `provider = "sqlite"` to `"postgresql"`. Delete `prisma/migrations`, then run `npx prisma migrate dev --name init` against the new database.
2. Create a private bucket (Cloudflare R2 is cheap) and set `STORAGE_DRIVER=s3` and the `S3_*` variables. **This is required on Vercel and other serverless hosts, which have no permanent disk.**
3. Set all the variables on your host and deploy. The build runs `prisma generate` automatically. Run `npm run db:deploy` to apply migrations.

> **UPI note:** some UPI apps limit or flag payments made through QR or app links to *personal* UPI IDs. A free **merchant/business UPI ID** (from PhonePe Business, Paytm for Business, BharatPe or your bank) avoids this and gives you a cleaner payment history to check against.
