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

## Examples
- To add a new step: create a component in `src/flow/steps/`, register it in `stepComponents.ts`, and add any state to Redux as needed.
- To add a new API call: add an endpoint to `llmApi.ts` and use the generated hook in your component.
- To map matches to profile sections: use or extend `groupMatchesByProfileSection` or similar utilities.

---

If any conventions or flows are unclear, please ask for clarification or propose updates to this file.
