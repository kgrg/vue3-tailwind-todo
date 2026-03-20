# FocusOS — Rethinking How You Plan Your Day

> Your to-do app helps you **store** tasks. We help you **actually do them**.

FocusOS is an AI-powered daily planning tool that understands your energy, detects when you're stuck, and explains every recommendation. Built for overwhelmed professionals, students, and anyone who's tried every productivity app and still ends up paralyzed by a 47-item list.

**Status:** Stealth mode

---

## The Problem

| Stat | Source |
|------|--------|
| **80%** of employees experience productivity anxiety | Yomly, 2025 |
| **66%** burnout rate — an all-time high | Modern Health / Forbes, 2025 |
| **2 h 23 min** average productive time per workday | Voucher Cloud / BLS |
| **23 min** to refocus after a single interruption | UC Irvine |
| **70%** of employees feel distracted at work | Zippia, 2026 |

Traditional task managers are storage systems. They capture work but don't help you execute it. The result: overplanned days, growing backlogs, lost trust in the tool, and ultimately abandonment.

## Core Differentiators

| Capability | What It Does |
|------------|--------------|
| **Explainable AI** | Every task recommendation includes a visible "why" — no black-box scheduling |
| **Behavioral Intelligence** | Detects postponement loops, diagnoses blockers, and suggests interventions before you spiral |
| **Energy-Aware Planning** | Matches deep-work tasks to high-energy windows and light tasks to recovery slots |
| **Actionable Reflection** | Daily shutdown ritual that surfaces *why* tasks slipped, not just completion counts |
| **"Today's 5" Focus** | Recommends a realistic daily set to reduce overwhelm and rebuild planning trust |

## Market Context

FocusOS targets a **$1.44 billion** task management market growing at **13.1% CAGR** through 2031 (Mordor Intelligence, 2026). Competitors like Motion, Sunsama, and Amazing Marvin each address parts of the problem. None combine **behavioral intelligence + explainable AI** — Focus OS's strongest unique position.

### Competitive Landscape

| Competitor | Strength | Gap |
|------------|----------|-----|
| **Motion** | Full AI auto-scheduling | Opaque — no visible reasoning |
| **Sunsama** | Calm daily planning rituals | No proactive blocker detection |
| **Amazing Marvin** | Extreme customizability, ADHD support | Minimal AI; trusts user judgment only |
| **Todoist / TickTick** | Massive user bases, freemium | Storage-first — limited execution support |

## Tech Stack

- [Vue 3](https://vuejs.org/) + [Vue Router](https://router.vuejs.org/) + [Pinia](https://pinia.vuejs.org/)
- [Vite+](https://github.com/voidzero-dev/vite-plus) — unified build toolchain
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Express 5](https://expressjs.com/) (API)
- [Heroicons](https://heroicons.com/)

## Getting Started

### Prerequisites

- Node.js >= 22.18.0
- pnpm >= 9.12.3

### Installation

```bash
git clone https://github.com/yourusername/focus-os.git
cd focus-os
pnpm install
```

### Development

```bash
pnpm dev          # start both web and api in parallel
pnpm dev:web      # web only  (http://localhost:5173)
pnpm dev:api      # api only  (http://localhost:3001)
```

### Production Build

```bash
pnpm build        # build both apps
pnpm build:web    # web only
pnpm build:api    # api only
```

### Docker

Run both services in production mode:

```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| Web     | http://localhost:8080 |
| API     | http://localhost:3001 |

## Project Structure

```
├── apps/
│   ├── web/                 # Vue 3 frontend
│   │   └── src/
│   │       ├── core/        # Shared components & utilities
│   │       ├── layouts/     # App layouts
│   │       ├── modules/     # Feature modules
│   │       │   ├── activities/
│   │       │   ├── auth/
│   │       │   ├── habits/
│   │       │   └── tasks/
│   │       ├── pages/       # Route-level views
│   │       ├── router/
│   │       └── styles/
│   └── api/                 # Express 5 API
│       └── src/
│           ├── index.ts     # Server entry
│           ├── routes/      # Route handlers
│           ├── data.ts      # In-memory data
│           └── types.ts
├── docker/                  # Production Dockerfiles & nginx config
├── docs/                    # Architecture docs
├── document/product/        # PRD & market research
├── docker-compose.yml
└── pnpm-workspace.yaml
```

## Target Personas

1. **Overwhelmed Professional** — 66% burnout, 11+ hours/week in meetings, interrupted every 3 minutes
2. **Student / Knowledge Worker** — 30% of Gen Z face daily productivity anxiety
3. **Executive Dysfunction / ADHD** — validated by Amazing Marvin's success in this niche

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

