<h1 align="center">Memory Lane</h1>

<p align="center">
 A web application to create and share memory lanes with friends and family
</p>

<p align="center">
  <a href="#about"><strong>About</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#implementation"><strong>Implementation</strong></a> ·
  <a href="#local-development"><strong>Local Development</strong></a>
</p>
<br/>

## About

Memory Lane is a web application designed to simplify sharing memories with friends and family. Instead of relying on multiple platforms like social media, messaging apps, and email, users can create a "memory lane" — a chronological collection of events with titles, descriptions, timestamps, and images — and share it via a single link.

This first iteration focuses on a seamless user experience, leveraging Supabase for authentication and storage, and tRPC for type-safe API interactions.

## Features

- **Manage Memory Lanes**: Define a memory lane with a title and description.
- **Manage Events**: Include events with titles, descriptions, timestamps, and at least one image, displayed chronologically.
- **Share Easily**: Generate a shareable link for friends and family.
- **Responsive UI**: Optimized for both desktop and mobile.
- **Image Upload**: Drag-and-drop or file picker support, stored via Supabase Storage.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router for a modern React setup.
- **Database**: [Supabase](https://supabase.com) with PostgreSQL and built-in auth.
- **File Storage**: [Supabase Storage](https://supabase.com/docs/guides/storage) for image uploads.
- **API**: [tRPC](https://trpc.io) for type-safe, single-endpoint API with routers.
- **State Management**: [TanStack Query](https://tanstack.com/query) for efficient data fetching and caching.
- **UI Components/Styling**: [Shadcn UI](https://ui.shadcn.com/) with [Tailwind CSS](https://tailwindcss.com) v4 for reusable components.

## Implementation

### Technical Design

- **Frontend**: Built with Next.js for server-side rendering and a smooth user experience. Key pages include a homepage for managing memory lanes and a detail page for viewing events in a timeline.
- **API with tRPC**: The API leverages tRPC’s single-endpoint architecture with routers for:
  - No traditional REST verbs (GET/POST) are used; tRPC handles queries and mutations seamlessly.
- **Data Model**:
  - `MemoryLane`: `{ id, title, description, createdAt, userId, slug, visibility }`
  - `Event`: `{ id, laneId, title, description, timestamp, imageUrl }`
- **Authentication**: Handled via Supabase Auth, ensuring only authenticated users can create and manage memory lanes.
- **Image Handling**: Images are uploaded to Supabase Storage via a drag-and-drop interface, with URLs stored in the database for retrieval.
- **Reusability**: Components like `EventCard`, `ImageUploader`, and ... are modular and reusable.

### UI Screenshots

...

### Why This Approach?

- **Supabase**: Provides authentication and storage out of the box, streamlining development and scalability.
- **tRPC**: Ensures type safety and simplifies API interactions without the overhead of traditional REST endpoints.
- **Next.js**: Combines frontend and backend logic efficiently with App Router and server components.
- **Shadcn UI + Tailwind**: Offers a balance of rapid development and design flexibility.

## Local Development

### Prerequisites

- Node.js (v20 or later)
- pnpm (v10 or later)
- Docker (optional, for local Supabase setup)

### Setup

1. Clone the repository

   ```bash
   git clone https://github.com/karimdaghari/unplanned.git
   cd unplanned
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Copy the example environment file and update with your credentials

   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your Supabase credentials

5. Start the development database

   ```bash
   pnpm db:start
   ```

6. Migrate the database schema

   ```bash
   pnpm db:migrate
   ```

7. Run the development server

   ```bash
   pnpm dev
   ```

8. Open [http://localhost:3000](http://localhost:3000) in your browser

### Running the API

The tRPC API is integrated into the Next.js app and runs automatically with `pnpm dev`. No separate API server is needed.

## Notes

- **Authentication**: Already implemented with Supabase Auth, tying memory lanes to user accounts.
- **File Storage**: Using Supabase Storage for images, making it scalable and secure.
- **Improvements**: Enhanced the mockup with a timeline view and drag-and-drop uploader for better UX.
