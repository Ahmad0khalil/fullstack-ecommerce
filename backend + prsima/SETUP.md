# Backend setup

This is the Express + PostgreSQL API for the storefront. It didn't ship with a
database schema, so here's the full first-run setup.

## 1. Install dependencies

```bash
npm install
```

## 2. Create the database

Make sure PostgreSQL is running locally, then create a database (or reuse an
existing one) and point `.env` at it. The `.env` file already has working
defaults for a local Postgres install — edit `DB_USER`, `DB_PASSWORD`,
`DB_NAME` etc. to match your setup.

## 3. Create the tables

```bash
psql -U <DB_USER> -d <DB_NAME> -f database/schema.sql
```

This creates `users`, `categories`, `products`, `carts`, `cart_items`,
`orders`, and `order_items`, with the foreign keys, uniqueness constraints,
and checks the existing queries in `services/` rely on (e.g. the
`ON CONFLICT (cart_id, product_id)` upsert in `cart.service.js` needs a
unique constraint that wasn't defined anywhere before).

## 4. Seed some data (recommended)

```bash
npm run seed
```

This creates:
- An admin account — `admin@example.com` / `Admin123!` (override via
  `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` / `SEED_ADMIN_USERNAME` in
  `.env` if you want different credentials)
- 4 categories and 8 sample products, so the storefront isn't empty

Safe to re-run — it skips anything that already exists.

## 5. Run the server

```bash
npm run dev     # nodemon, auto-restarts on changes
npm start       # plain node
```

Server runs at `http://localhost:5000` by default (`PORT` in `.env`).

## What changed from the version you had

- **Added `database/schema.sql` and `scripts/seed.js`** — there was no schema
  or migration anywhere, so the app had no way to actually create its tables.
- **Categories were login-gated.** `GET /api/categories` required a valid
  JWT, which would have broken the public homepage and product filters for
  any logged-out visitor. Reads are now public; create/update/delete still
  require the `admin` role.
- **Product create/update/delete had no admin check** — any logged-in
  customer could create, edit, or delete products. Now requires `admin`.
- **`GET /api/orders` leaked every customer's order history to any logged-in
  user.** It now returns all orders only for admins, and just the current
  user's own orders for everyone else. Same fix applied to fetching a single
  order by ID.
- **There was no way to update an order's status.** The admin UI had a
  "mark as shipped/delivered/etc." control, but nothing on the backend to
  handle it. Added `PUT /api/orders/:id` (admin-only).
