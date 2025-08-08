# Schemas Directory

Runtime validation using Zod.

Conventions:
- Schema files end with `.schema.ts`.
- Optional inferred types may be exported inline or placed under `../types/<domain>`.
- Do not import from `types/store` to avoid circular dependencies.
- Keep files focused: one logical model (or tight cluster) per file.
