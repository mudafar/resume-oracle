# Step Component Refactoring Requirements

## Introduction

This document outlines the requirements for minimal refactoring of existing step components in the `src/flow/steps/` directory. The goal is to extract shared components and break down large monolithic components into smaller, focused sub-components where it improves maintainability, while preserving the exact same UI/UX.

## Requirements

### 1. Extract Shared Components

**User Story**: As a developer, I want common UI patterns across steps to be extracted into reusable shared components, so that I can maintain consistency and reduce code duplication.

**Acceptance Criteria**:
1. **WHEN** multiple step components use similar modal patterns, **THEN** they **SHALL** use a shared modal component from `src/flow/steps/shared/`
2. **WHEN** multiple step components use similar card layouts, **THEN** they **SHALL** use shared card components
3. **WHEN** multiple step components have similar action patterns (copy, download, regenerate), **THEN** they **SHALL** use shared action components
4. **WHEN** shared components are created, **THEN** they **SHALL** maintain the exact same visual appearance and functionality

### 2. Break Down Large Components

**User Story**: As a developer, I want large step components to be broken into smaller, focused sub-components, so that I can more easily understand and maintain individual parts.

**Acceptance Criteria**:
1. **WHEN** a step component exceeds 200 lines, **THEN** it **SHALL** be broken down into logical sub-components
2. **WHEN** a step component has distinct functional areas (forms, displays, actions), **THEN** each area **SHALL** be extracted into separate components
3. **WHEN** sub-components are created, **THEN** they **SHALL** be organized within the step's directory (e.g., `generateCoverLetter/CoverLetterForm.tsx`)
4. **WHEN** step components are refactored, **THEN** they **SHALL** maintain the exact same visual appearance and user functionality

### 3. Maintain State Management

**User Story**: As a developer, I want refactored step components to maintain seamless Redux integration, so that existing data flow continues to work without changes.

**Acceptance Criteria**:
1. **WHEN** a step component is refactored, **THEN** it **SHALL** maintain all existing Redux selectors and dispatch calls
2. **WHEN** sub-components need Redux state, **THEN** they **SHALL** receive it via props from the parent component
3. **WHEN** shared components need state, **THEN** they **SHALL** receive it through props rather than direct Redux access
4. **WHEN** components manage local state, **THEN** it **SHALL** remain in the main step component

### 4. Preserve LLM Service Integration

**User Story**: As a developer, I want refactored step components to maintain existing LLM service integrations, so that AI-powered features continue to work seamlessly.

**Acceptance Criteria**:
1. **WHEN** a step component uses LLM services, **THEN** the refactored version **SHALL** maintain the same service calls and data handling
2. **WHEN** LLM-related UI (loading, errors, results) is extracted, **THEN** it **SHALL** be moved to dedicated sub-components
3. **WHEN** LLM logic is separated from UI, **THEN** the main step component **SHALL** handle service calls and pass results to sub-components
4. **WHEN** shared LLM UI patterns exist, **THEN** they **SHALL** be extracted to shared components

### 5. Consistent File Organization

**User Story**: As a developer, I want step components to follow consistent organizational patterns, so that I can quickly navigate and understand any step component.

**Acceptance Criteria**:
1. **WHEN** a step has sub-components, **THEN** they **SHALL** be organized in the step's directory (e.g., `generateCoverLetter/EditorCard.tsx`)
2. **WHEN** components are shared across multiple steps, **THEN** they **SHALL** be placed in `src/flow/steps/shared/`
3. **WHEN** step directories are created, **THEN** they **SHALL** include an `index.ts` file that exports the main step component
4. **WHEN** file names are chosen, **THEN** they **SHALL** clearly indicate the component's purpose (e.g., `RegenerateBanner.tsx`, `OptimizationSummaryCard.tsx`)
