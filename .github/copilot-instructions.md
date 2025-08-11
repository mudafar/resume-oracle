# Copilot Instructions for resume-oracle-ui


# Project Context
- Match user's experience to job requirements using a multi-step wizard UI
- Create tailored resumes and cover letters for a specific job applications
- Help users highlight and discover their skills and experience to improve probability of getting interviews

## Steps
  1. Import and parse user profile sections from linkedIn or resume
  2. Extract job requirements from job descriptions
  3. Match user profile sections to job requirements
    - Highlight missing requirements or gaps in user profile
    - Provide recommendations to fill gaps
    - Allow users to select which profile sections to enhance
    - Suggeste profile enhancements for missing requirements using recommendations
  4. List matched profile sections
    - Highlight matched job requirements
    - Provide a gap analysis and recommendations for each job requirement
    - Allow users to select which profile sections to enhance
    - Suggest profile enhancements for missing requirements using recommendations
  4. Generate resumes formatted sections based on matched profile sections
    - Provide a preview of the generated resume
    - Allow users to copy the resume to clipboard
    - Allow users to download the resume as a Markdown file
  5. Generate cover letters based on matched profile sections
    - Provide a preview of the generated cover letter
    - Allow users to copy the cover letter to clipboard
    - Allow users to download the cover letter as a Markdown file 




# Tech Stack
- Framework and version: Next.js v15.3 React v18+
- Language: TypeScript
- State management: Redux Toolkit + RTK Query
- Styling: Tailwind CSS v4 and Shadcn UI v2.10
- Testing: Jest and React Testing Library
- LLM Services: langchain-js v0.3 and zod v4 schemas 

# Type & Schema Organization (updated)
- Domain-driven structure for TypeScript types and Zod schemas.
- Types live under `src/types/<domain>` using `*.types.ts` files; schemas live under `src/schemas/<domain>` using `*.schema.ts` files.
- Do NOT import types directly from Redux slices. Use the store types barrel: `import type { ProfileSection } from "@/types/store"`.
- Zod schemas should be imported from their domain files, e.g., `@/schemas/profile/profileSection.schema`.
- When re-exporting types only, use `export type { ... }` to satisfy isolatedModules.

Recommended imports
```ts
// Types (store)
import type { ProfileSection, SectionTypeEnum } from "@/types/store";

// Zod schemas (domain-first)
import { ProfileSectionSchema } from "@/schemas/profile/profileSection.schema";

// Transitional (allowed, not preferred for new code)
import { SelectedSection } from "@/services/zodModels";
```

# Architecture Patterns
## Folder Structure
[See Folder Structure](/DEV.md#folder-structure)

## Component Architecture
- Use compound components for complex UI elements (e.g., step, modals, wizards)
- Implement container/presentational pattern for complex features
- Co-locate feature-specific components with their feature modules
- Keep shared UI components generic and reusable

## State Management Strategy
- Use Redux Toolkit slices for global application and persistent state
- Local useState for simple component-specific state
- Use RTK Query for server state management and caching
- Use RTK persistence middleware for local storage persistence

## LLM Services Architecture
- Use langchain-js for LLM service integration
- Define Zod schemas for output validation
- Use a custom React hook (`useLlmService`) to provide a consistent interface for LLM service calls
- Use `invokeWithStructuredOutput` for structured output from LLM services
 - Import inferred types from domain schemas when needed using `z.infer<typeof Schema>` 



# Code Standards
## TypeScript Requirements
- Use strict mode with no implicit any
- Define interfaces for all props, API responses, and complex objects
- Use type unions instead of enums where appropriate
- Prefer `interface` over `type` for object shapes
- Use generic types for reusable components and hooks
 - Prefer importing types from `@/types/...` barrels rather than slice files. Avoid `@/store/slices/...` for types.

## React Patterns
- Use functional components with hooks exclusively
- Prefer named exports over default exports
- Implement proper error boundaries for feature modules
- Use React.memo() for expensive components
- Always include dependency arrays in useEffect and useCallback

## Import Organization
```typescript
// 1. React and external libraries
import React from 'react';
import { useDispatch } from 'react-redux';

// 2. Internal utilities and types
import { formatDate } from '@/utils/date';
import type { ProfileSection } from '@/types/store';

// 3. Component imports
import { Button } from '@/components/ui/Button';
```

## Error Handling
- Use error boundaries for component-level error catching
- Implement proper try-catch blocks for async operations
- Display user-friendly error messages
<!-- - Log errors to monitoring service in production -->




# Naming Conventions

## Files and Folders
- Components: PascalCase (TaskCard.tsx, ProjectList.tsx)
- Hooks: camelCase starting with 'use' (useTaskFilters.ts)
- Utilities: camelCase (formatCurrency.ts, validateEmail.ts)
- Types: camelCase with .types.ts suffix by domain (e.g., profileSectionsSlice.types.ts)
- Schemas: kebab-case with .schema.ts suffix by domain (e.g., profile-section.schema.ts)
- Constants: UPPER_SNAKE_CASE (API_ENDPOINTS.ts)

## Variables and Functions
- React components: PascalCase (TaskCard, ProjectHeader)
- Functions and variables: camelCase (handleSubmit, isLoading)
- Constants: UPPER_SNAKE_CASE (MAX_FILE_SIZE, DEFAULT_PAGINATION)
- Boolean variables: Use is/has/can prefix (isVisible, hasPermission, canEdit)

## CSS Classes (Tailwind)
- Use semantic class names in templates
- Group related styles together
- Mobile-first responsive design approach

## API and Data
- API endpoints: kebab-case (/api/projects/{id}/tasks)
- Database fields: snake_case (created_at, user_id)
- Redux actions: UPPER_SNAKE_CASE (FETCH_TASKS_SUCCESS)
- Redux slice names: camelCase (taskSlice, authSlice)
- Types import policy: import state types from `@/types/store` and schema types from `@/schemas/<domain>/*.schema`; avoid importing types from slices.



# Styling Standards  
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing using design tokens
- Ensure proper focus states and accessibility


# Testing Strategy
[What and how to test]

# Performance Guidelines
[Optimization requirements]

# Security Requirements
[Security practices]

# Common Patterns
[Team-specific patterns]

# Anti-Patterns
[What to avoid]

