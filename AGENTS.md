# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains the TypeScript React app. Group reusable UI in `src/components/`, learning flows in `src/scenes/`, and gamified logic (streaks, rewards, missions) in `src/game/`.
- `public/` hosts static assets: character sprites, background audio, emoji stickers.
- `tests/` mirrors `src/` structure for Vitest + Testing Library specs; snapshot assets live in `tests/__snapshots__/`.
- `docs/` stores behavioral specs, Octalysis design notes, and UX flows.

## Build, Test, and Development Commands
- `npm install` sets up dependencies.
- `npm run dev` starts the Vite dev server with hot reload.
- `npm run build` outputs an optimized production bundle to `dist/`.
- `npm run preview` serves the build locally for smoke tests.
- `npm run test` runs unit and component tests; add `--watch` while iterating.
- `npm run lint` enforces ESLint + Prettier formatting rules.

## Coding Style & Naming Conventions
- Use TypeScript strict mode and React function components.
- Two-space indentation; keep line length under 100 characters.
- Components, scenes, and hooks follow `PascalCase`; utility modules use `camelCase`.
- CSS modules live alongside components as `.module.scss`; design tokens sit in `src/styles/tokens.scss`.
- Run Prettier before every commit (`npx prettier --write "src/**/*.{ts,tsx,scss}"`).

## Testing Guidelines
- Write Vitest suites per scene in `tests/scenes/<SceneName>.test.tsx` with descriptive `describe` blocks.
- Cover success, failure, and edge cases for mission scoring, streak logic, and reward unlocks.
- Use data-testids prefixed with `mul-` for stable selectors.
- Target 90% statement coverage; gate PRs with `npm run test -- --coverage`.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat: add star-reward tracker`).
- Keep commits scoped; avoid mixing gameplay logic with styling tweaks.
- PRs should include a short summary, screenshots or screen recordings for UI changes, test plan (`npm run test` output), and references to design tickets.
- Request review from both a gameplay designer and an accessibility lead when altering reward loops or input flows.

## Gamification & UX Notes
- Align features with Octalysis core drives: epic meaning (mentor characters), accomplishment (badge ladder), empowerment (custom challenge builder), ownership (collectible stickers), social influence (family leaderboard), scarcity (limited-time missions), unpredictability (mystery boxes), and avoidance (gentle progress reminders).
- Keep copy playful yet clear for seven-year-olds; pair every numeric challenge with visual cues and positive feedback animations.
