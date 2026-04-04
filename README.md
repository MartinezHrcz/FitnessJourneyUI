# Fitness Journey Frontend

Frontend for the Fitness Journey thesis project.

This application provides the user interface for tracking workouts, logging calories, managing profile data, and interacting socially with other users. It is built with React + TypeScript and communicates with a separate backend API.

## Thesis Context

This repository contains the frontend of my thesis system, Fitness Journey.

Main goals of this frontend:

- Provide an intuitive and modern interface for fitness progress tracking.
- Integrate multiple domains in one app: workouts, diet, profile, and social.
- Consume authenticated REST and real-time WebSocket APIs.
- Be deployable as a static site (GitHub Pages) with environment-driven configuration.

## Core Features

- Authentication: register and login flows.
- User area: dashboard and profile pages.
- Workout module:
	- Workout sessions and workout history.
	- Workout plan creation, editing, and management.
- Diet module:
	- Daily calorie tracking.
	- Calorie history and day-level details.
- Social module:
	- Social hub.
	- Real-time chat over WebSocket/STOMP.
- Theming:
	- Global theme state via context.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- Tailwind CSS
- Vitest

## Project Structure

High-level source layout:

- src/api: API clients grouped by domain (auth, workouts, diet, social, etc.)
- src/components: reusable UI components
- src/contexts: app-level providers (for example theme)
- src/hooks: custom React hooks
- src/layouts: page layout wrappers
- src/pages: route-level screens grouped by domain
- src/routes: central route definitions
- src/types: shared TypeScript domain models
- src/utils: utility helpers

## Prerequisites

- Node.js 22+ recommended
- npm

## Environment Variables

This project uses environment variables for API endpoints and deployment base path.

Local and default values are defined in .env.
Production-oriented values are defined in .env.production.

Variables:

- VITE_API_URL: base URL of backend REST API
	- Example: https://backend-domain/api
- VITE_WS_URL: WebSocket endpoint for chat
	- Example: wss://backend-domain/ws-chat
- VITE_BASE_PATH: frontend base path for static hosting
	- Local: /
	- GitHub Pages: /<repository-name>/

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Review .env values and update if needed.

3. Start development server:

```bash
npm run dev
```

## Available Scripts

- npm run dev: run Vite dev server
- npm run build: type-check and build for production
- npm run preview: preview production build locally
- npm run lint: run ESLint
- npm run test: run test suite once (Vitest)
- npm run test:watch: run tests in watch mode

## Routing and GitHub Pages Compatibility

The app uses hash-based routing to avoid static host refresh issues:

- URL shape: /#/route
- This prevents 404 errors when refreshing deep links on GitHub Pages.

Vite base path is read from VITE_BASE_PATH, so built asset paths work under repository subpaths.

## Deployment (GitHub Pages)

This repository includes a GitHub Actions workflow:

- .github/workflows/deploy-pages.yml

What it does:

1. Installs dependencies.
2. Builds the app with:
	 - VITE_BASE_PATH=/${{ github.event.repository.name }}/
	 - VITE_API_URL from repository variables
	 - VITE_WS_URL from repository variables
3. Uploads the dist artifact.
4. Deploys to GitHub Pages.

Required GitHub repository variables:

- VITE_API_URL
- VITE_WS_URL

Recommended GitHub Pages setup:

1. Repository Settings -> Pages -> Source: GitHub Actions.
2. Ensure the default branch includes this workflow.
3. Push to main to trigger deployment.

## Testing

Unit and API-layer tests are written with Vitest.

Run all tests:

```bash
npm run test
```

Run in watch mode:

```bash
npm run test:watch
```

## Backend Contract Notes

This frontend expects a backend that supports:

- Auth endpoints (login/register/refresh)
- Domain endpoints for users, workouts, diet, social features
- WebSocket/STOMP endpoint for chat
- CORS and credentials configuration compatible with frontend domain
