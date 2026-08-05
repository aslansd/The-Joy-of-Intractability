# The Joy of Intractability

An interactive, playable introduction to computational complexity theory, inspired by the active-learning style of Nicky Case. The app explores **P, NP, NP-completeness, reductions, P vs NP, and practical approaches to hard optimization problems** through small interactive experiments.

## Educational scope

The examples are deliberately simplified. They illustrate ideas rather than claiming that a particular toy instance proves a complexity result. In particular:

- **P** is about polynomial-time algorithms, not about an algorithm being literally instant.
- **NP** is defined by polynomial-time verification of certificates; it does not mean “problems that are hard to solve.”
- **NP-complete** problems are both in NP and NP-hard.
- **TSP** is NP-complete in its decision form and NP-hard in its optimization form.
- The **P vs NP** question remains open.
- Brute-force exponential growth is used as an intuition pump, not as a proof that every NP problem needs exponential time.

## Run locally

Prerequisites: Node.js 18+

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
npm run preview
```

## Quality checks

```bash
npm run lint
npm run build
```

## Deployment

The frontend is a Vite/React application. For Cloud Run, the deployment should serve the generated `dist/` directory with a production HTTP server.
