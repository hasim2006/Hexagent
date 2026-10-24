# Contributing to Hexagent

Thank you for your interest in contributing to **Hexagent**! We welcome community contributions to build the world's most advanced autonomous AI workforce.

---

## 🛠️ Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/<your-username>/Hexagent.git
   cd Hexagent
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Verify Types and Code Style**
   ```bash
   npm run typecheck
   npm run lint
   npm run build
   ```

---

## 📁 Architecture Principles

Hexagent uses a **Domain-Driven Architecture**:
- Place UI primitives in `src/components/ui/`
- Place canvas / shader / graphics components in `src/components/visuals/`
- Place public landing sections in `src/components/landing/`
- Place agent persona visualizers in `src/components/workforce/`
- Place dashboard / OS components in `src/components/dashboard/`
- Place individual agent workspaces in `src/components/workspaces/`
- Keep global OS state centralized in `src/os/store.tsx`

---

## 🔀 Submitting a Pull Request

1. Create a feature branch: `git checkout -b feat/your-feature-name`
2. Follow conventional commit messages: `feat(...)`, `fix(...)`, `docs(...)`, `refactor(...)`
3. Ensure `npm run build` succeeds without errors
4. Open a Pull Request referencing any related issues
