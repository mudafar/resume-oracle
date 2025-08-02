# Copilot Instructions for resume-oracle-ui

## Project Overview
- This is a Next.js (React) monorepo for a resume and job-matching UI, using Redux Toolkit for state management and RTK Query for API calls.
- The main user flow is a multi-step wizard, with each step as a React component in `src/flow/steps/`.
- State is managed globally via Redux slices in `src/store/slices/`. API calls are handled via `src/store/services/llmApi.ts`.
- The app is designed for extensibility: new steps, modals, and UI flows can be added with minimal boilerplate.

## Key Architectural Patterns
- **Multi-Step Flow:**
  - Steps are registered in `src/flow/steps/stepComponents.ts` and rendered by `src/flow/MultiStepFlow.tsx`.
  - Each step is a React component created with `createStep` from `src/utils/createStep.ts`.
- **State Management:**
  - Use Redux Toolkit slices for all persistent state. Example: `profileSectionsSlice`, `matchesSlice`, `stepSlice`.
  - Use RTK Query (`llmApi.ts`) for most async API calls. Prefer mutations/queries over manual fetch.
  - **LLM Services:** All LLM-related backend logic is implemented in langchain-js services (see `src/services/`).
  - `src/hooks/useLlmService.ts` There is a custom React hook for LLM services that provides an interface similar to RTK Query, making it easy to swap between RTK and direct service calls.
  - **Migration Note:** All LLM API calls are being migrated to use these LLM services directly, bypassing RTK Query for LLM endpoints. Prefer the custom LLM hook for new LLM features.
- **Data Flow:**
  - Most data is passed via Redux, not props drilling. Use selectors/hooks from `src/store/store.ts`.
  - Cross-step communication (e.g., advancing steps, updating sections) should use Redux actions.
- **UI Components:**
  - Shared UI primitives are in `src/app/components/ui/`.
  - Modals and dialogs are colocated with their feature in `src/flow/steps/<feature>/`.

## Developer Workflows
- **Development:**
  - Start with `npm run dev` (see README for alternatives).
  - Hot reload is enabled for all files in `src/`.
- **Testing:**
  - No formal test suite is present; manual testing is the norm.
- **Debugging:**
  - Use Redux DevTools and React DevTools for state/UI inspection.
  - API errors are surfaced via RTK Query error states and UI alerts.

## Project-Specific Conventions
- **Step Navigation:**
  - The current step is managed in Redux (`stepSlice`). Use `setCurrentStep` to advance or jump steps.
- **Profile Section Matching:**
  - Use utility functions (e.g., `groupMatchesByProfileSection`, `getOrderedMatchedProfileSections`) to map matches to profile sections.
  - Always prefer selectors/utilities over duplicating mapping/filtering logic inline.
- **API Integration:**
  - All backend calls go through `llmApi.ts` (RTK Query). Define new endpoints there and use the generated hooks.
  - API types (e.g., `EnhancementResponse`, `BaseJobRequirementMatch`) are colocated with the API slice for discoverability.
- **Component Structure:**
  - Feature-specific modals/components live in their step folder (e.g., `profileSections/`, `jobRequirementsMatching/`).
  - UI primitives (Button, Card, etc.) are in `src/app/components/ui/` and should be reused.

## Migration Notes
- The project is migrating from RTK Query (RTQ) API calls to direct usage of LLM service classes via a custom React hook (`useLlmService`). This hook provides an interface similar to RTK Query hooks, including properties like `isLoading`, `error`, `data`, and a `reset` function.
- The `useLlmService` hook is standardized to always inject the current `llmConfig` from the Redux store into the service function, so consumers of the hook do not need to select or pass `llmConfig` manually.
- The return value of `useLlmService` is refactored to match the tuple style of RTK Query hooks: `[trigger, { isLoading, error, data, reset }]`.
- There is a focus on DRYing up the logic for LLM service calls, so that all LLM-related features (cover letter, resume, profile section parsing, etc.) use the same hook and interface.
- The project is moving towards using selectors defined inside Redux slices (e.g., `llmConfigSlice`) for accessing state, and these selectors can be accessed via the slice's default export.
- There is an emphasis on type safety and correct typing for the custom hook, especially to avoid TypeScript errors when destructuring or calling the returned values.
- The type returned from LLM services should match the type of the corresponding Redux store slice. This ensures consistency between the service layer and the Redux state, making it easier to update the store with the results of LLM service calls.

## Generics and Type Inference for LLM Service Hooks
- Always use the generic form of `useLlmService<DATA_TYPE>()` to enforce the expected return type from the LLM service. This ensures that the hook and its consumers are type-safe and aligned with the Zod-inferred types.
- The `DATA_TYPE` should be imported from the centralized Zod-inferred types in `src/services/zodModels.ts`.
- Example: `const [trigger, { data }] = useLlmService<JobRequirementMatchList>(...)`.
- This pattern should be applied to all usages of `useLlmService` in the codebase, including but not limited to `triggerParseProfileSections`, `triggerExtractRequirements`, and `triggerMatch`.
- If a service returns a union or array, use the most specific type possible (e.g., `JobRequirementMatch[]`).

## Types and Type Safety
- All types and interfaces used across Redux slices, services, and components should be defined in a single location whenever possible (e.g., in the relevant slice or a shared types file).
- Do not redefine types or interfaces in multiple places. Always import the type from its source of truth.
- The type returned from LLM services must match the type of the corresponding Redux store slice. This ensures consistency and prevents type drift.
- When updating or extending a type, update it in its source location and refactor all usages to import from there.
- Use Zod schemas from `src/services/zodModels.ts` for runtime validation and type inference. Do not redefine Zod schemas in service files unless a schema does not exist yet. If a schema is missing, list the missing schemas and ask before creating new ones.
- Prefer using `z.infer<typeof SchemaName>` for deriving TypeScript types from Zod schemas to ensure type alignment between validation and usage.

## LLM Service Schema Usage
- When calling `invokeWithStructuredOutput`, always pass the Zod schema object (e.g., `JobRequirementMatchListSchema`), not the inferred TypeScript type. This ensures runtime validation and type safety.
- Never pass the inferred type (e.g., `JobRequirementMatchList`) to `invokeWithStructuredOutput`—only the Zod schema should be used for validation.
- Use the inferred type (e.g., `JobRequirementMatchList`) only for static typing in TypeScript, not for runtime validation.

## Examples
- To add a new step: create a component in `src/flow/steps/`, register it in `stepComponents.ts`, and add any state to Redux as needed.
- To add a new API call: add an endpoint to `llmApi.ts` and use the generated hook in your component.
- To map matches to profile sections: use or extend `groupMatchesByProfileSection` or similar utilities.

---

If any conventions or flows are unclear, please ask for clarification or propose updates to this file.
