# Talorax

**Discover. Connect. Build.**

Talorax is a social opportunity network for students, recent graduates, career
changers, and early-career professionals. It blends professional networking,
career discovery, projects, communities, and opportunities into one modern,
social experience — without feeling like a traditional job board.

This repository contains the first functional **MVP**, powered by realistic
mock data and structured so a real backend can be added later.

## Product loop

> Discover → Engage → Connect → Build → Prove → Get Discovered → Opportunity

## Features in this MVP

- **Landing page** — public marketing page with hero and feature sections
- **Authentication** — sign up, log in, log out (mock auth, localStorage-backed)
- **Onboarding** — 4-step flow (persona, interests, goals, skills)
- **Home feed** — social "For You" feed with multiple post types and
  like / comment / share / save / follow interactions
- **Create flow** — post, project, opportunity, or collaboration
- **Discover** — People, Companies, Projects, and Communities tabs
- **Opportunities** — filterable list with transparent match scoring
- **Opportunity detail** — responsibilities, required skills, team, and an
  honest "Why you're seeing this" explanation
- **Opportunity Radar** — signature feature surfacing opportunities, people,
  projects, and skills to grow
- **Profile** — professional/social profile (own and others)
- **Project pages** — portfolio item + social post
- **Messaging** — conversation list and window
- **Responsive** — thoughtful desktop and mobile layouts (mobile bottom nav)

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for build/dev tooling
- [React Router](https://reactrouter.com/) for client-side routing
- Plain CSS with a small design-token system (no CSS framework)

## Getting started

```bash
npm install
npm run dev      # start the dev server
```

Then open the printed local URL. On the login page you can click
**"Continue as demo user"** to explore the app with seeded data instantly.

Other scripts:

```bash
npm run build    # type-check and produce a production build in dist/
npm run preview  # preview the production build locally
npm run lint     # run the linter
```

## Project structure

```
src/
├── components/
│   ├── ui/         # Reusable primitives (Button, Card, Avatar, Modal, Tabs, …)
│   ├── layout/     # App shell: navigation, guards, layout
│   ├── content/    # Post / Project / Person / Opportunity / Company / Community cards
│   ├── social/     # Connect & Follow buttons
│   └── create/     # Create flow modal
├── data/           # Centralized mock/seed data (users, companies, posts, …)
├── models/         # TypeScript interfaces for every domain entity
├── pages/          # One component per route
├── services/       # App state, mock auth, storage (swap points for a backend)
└── utils/          # Formatting + deterministic match scoring
```

## Notes on the mock backend

- **Auth** and **storage** are isolated in `src/services/` so they can be
  replaced with real API calls without touching page components.
- **Social state** (likes, saves, follows, connections, new posts, messages)
  lives in an in-memory React context (`services/appState.tsx`).
- **Match scoring** (`utils/matching.ts`) is intentionally simple, transparent,
  and rule-based — it is **not** an AI matching engine, and the UI says so.

## Roadmap (future phases)

Real backend & database, real-time messaging, richer recommendations,
notifications, and search are intentionally out of scope for this MVP.
