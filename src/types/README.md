# Types Directory

Domain-scoped TypeScript interfaces & type aliases.

Conventions:
- Files end with `.types.ts`.
- One domain per subfolder: core, flow, job, profile, resume, llm, store.
- No Zod schemas here (see `../schemas`).
- Inferred types from schemas may live here if not colocated.
- Avoid importing from `schemas/*` to prevent circularity.
