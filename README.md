# TaskFlow - Modern Activity & Task Management

A modern, intuitive application for managing your daily activities, habits, and tasks. Built as a pnpm monorepo with a Vue 3 frontend and an Express API backend.

## Features

- **Activity Dashboard** — view and manage all your activities in one place
- **Habit Tracking** — build and maintain positive habits with visual tracking
- **Task Management** — organise tasks with categories and priorities
- **Progress Tracking** — monitor completion rates and activity patterns
- **Responsive Design** — works on desktop and mobile

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
git clone https://github.com/yourusername/taskflow.git
cd taskflow
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

### Dev Container

Open the repo in VS Code and select **Reopen in Container** (requires the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension), or launch via GitHub Codespaces. The container comes with Node 22, pnpm, and Docker-in-Docker pre-configured.

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
├── .devcontainer/           # Dev Container (containers.dev) config
├── docker-compose.yml
└── pnpm-workspace.yaml
```

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

