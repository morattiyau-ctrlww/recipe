# Recipe Book

A beautiful, modern recipe book web app. Browse, search, filter, and manage your favorite recipes with full create/read/update/delete functionality, backed by Supabase.

## Features

- Responsive grid of recipe cards with image fallback, tag badges, and a "View" button
- Add / edit recipes in a dialog form (title, description, image URL, ingredients, instructions, tags)
- Full recipe detail view with edit and delete (with confirmation)
- Real-time search by title or description
- Filter by tag with clickable badges
- Warm, appetizing color palette built on Tailwind CSS v4 + shadcn/ui

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [Tailwind CSS](https://tailwindcss.com) v4
- [shadcn/ui](https://ui.shadcn.com) components
- [lucide-react](https://lucide.dev) icons
- [Supabase](https://supabase.com) (Postgres) for persistence

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the **SQL Editor**, run the contents of [`supabase/schema.sql`](supabase/schema.sql) to create the `recipes` table and RLS policies.
3. Copy your project URL and anon (publishable) key from **Project Settings → API**.

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Scripts

| Command          | Description                |
| ---------------- | -------------------------- |
| `npm run dev`    | Start the dev server       |
| `npm run build`  | Create a production build  |
| `npm run start`  | Start the production build |
| `npm run lint`   | Run ESLint                 |
