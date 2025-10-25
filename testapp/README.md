# Test App for Automation Practice

This test application is a minimal full-stack example intended for automation testing practice.

Structure
- backend/: Express API with file-based JSON storage (lowdb)
- frontend/: Vite + Lit web components + Storybook for component-driven testing

Quick start (macOS zsh)

1. Backend

```bash
cd testapp/backend
npm install
npm run start
```

2. Frontend

```bash
cd testapp/frontend
npm install
npm run dev
```

3. Storybook

```bash
cd testapp/frontend
npm install
npm run storybook
```

Notes
- The backend uses `lowdb` (file `db.json`) for simplicity.
- Use the VS Code tasks provided in `.vscode/tasks.json` to start backend, frontend, and Storybook easily.

API endpoints
- POST /api/auth/login { username, password } => returns a mock token
- GET /api/users
- POST /api/users
- GET /api/products
- POST /api/products

Next steps
- Add Playwright tests that hit the running frontend and backend.
- Extend components and stories as needed for your test cases.

Enjoy testing!
