# Step Component Refactoring Implementation Tasks

## Implementation Plan

This document outlines the coding tasks required to implement- [x] - [x] 6.4 Refactor - [x] 8.2. Create CoverLetterActions sub-componentain ProfileSectionsStep component.3 Create ProfileSectionsActions sub-componentthe step component refactoring feature. Each task builds incrementally on previous tasks and focuses on specific code implementation activities.

## Task List

### 1. Create Shared Action Components

- [x] 1.1 Create ActionBar shared component
  - Create `src/flow/steps/shared/actions/ActionBar.tsx` with TypeScript interface
  - Implement copy, download, and regenerate action buttons with loading states
  - Use existing UI components from `src/components/ui/`
  - **Requirement**: Extract shared action patterns across multiple step components (Requirement 1.3)

- [x] 1.2 Create individual action button components
  - Create `src/flow/steps/shared/actions/CopyButton.tsx` for standalone copy functionality
  - Create `src/flow/steps/shared/actions/DownloadButton.tsx` for standalone download functionality
  - Implement proper TypeScript interfaces and state management
  - **Requirement**: Extract shared action patterns across multiple step components (Requirement 1.3)

### 2. Create Shared Card Components

- [x] 2.1 Create EditorCard shared component
  - Create `src/flow/steps/shared/cards/EditorCard.tsx` with view/edit mode toggle
  - Implement TypeScript interface with content, editMode, and callback props
  - Use existing Card, Textarea, and Button components from UI library
  - **Requirement**: Extract shared card layouts across multiple step components (Requirement 1.2)

- [x] 2.2 Create ContentCard shared component
  - Create `src/flow/steps/shared/cards/ContentCard.tsx` for generic content display
  - Implement TypeScript interface with title, content, and optional actions
  - Use existing Card components and maintain consistent styling
  - **Requirement**: Extract shared card layouts across multiple step components (Requirement 1.2)

- [x] 2.3 Create LoadingCard shared component
  - Create `src/flow/steps/shared/cards/LoadingCard.tsx` for standardized loading states
  - Implement with Loader2 icon and configurable loading messages
  - Use existing Card components for consistent styling
  - **Requirement**: Extract shared card layouts across multiple step components (Requirement 1.2)

### 3. Create Shared State Display Components

- [x] 3.1 Create ErrorState shared component
  - Create `src/flow/steps/shared/states/ErrorState.tsx` for standardized error display
  - Implement TypeScript interface with error message and optional retry functionality
  - Use existing Alert components and error styling patterns
  - **Requirement**: Extract shared modal patterns across multiple step components (Requirement 1.1)

- [x] 3.2 Create EmptyState shared component
  - Create `src/flow/steps/shared/states/EmptyState.tsx` for standardized empty states
  - Implement with icon, message, and optional action button
  - Use existing UI components and maintain design consistency
  - **Requirement**: Extract shared modal patterns across multiple step components (Requirement 1.1)

- [x] 3.3 Create LoadingState shared component
  - Create `src/flow/steps/shared/states/LoadingState.tsx` for standardized loading display
  - Implement with spinner and configurable loading messages
  - Use existing Loader2 icon and Card components
  - **Requirement**: Extract shared modal patterns across multiple step components (Requirement 1.1)

### 4. Create Shared Form Components

- [x] 4.1 Create TextareaField shared component
  - Create `src/flow/steps/shared/forms/TextareaField.tsx` with character count display
  - Implement TypeScript interface with value, onChange, and validation props
  - Use existing Textarea and Label components from UI library
  - **Requirement**: Extract shared modal patterns across multiple step components (Requirement 1.1)

### 5. Refactor GenerateEditResumeStep (330 lines)

- [x] 5.1 Create ResumeEditor sub-component
  - Create `src/flow/steps/generateEditResume/components/ResumeEditor.tsx`
  - Extract editor functionality from main component (edit mode, content editing)
  - Implement TypeScript interface for resume content and edit state props
  - **Requirement**: Break down large step component into logical sub-components (Requirement 2.2)

- [x] 5.2 Create ResumeActions sub-component
  - Create `src/flow/steps/generateEditResume/components/ResumeActions.tsx`
  - Extract action button functionality (copy, download, export PDF, regenerate)
  - Use shared ActionBar component created in task 1.1
  - **Requirement**: Break down large step component into logical sub-components (Requirement 2.2)

- [x] 5.3 Create ResumeStates sub-component
  - Create `src/flow/steps/generateEditResume/components/ResumeStates.tsx`
  - Extract loading, error, and empty state displays from main component
  - Implement TypeScript interface for state props
  - **Requirement**: Break down large step component into logical sub-components (Requirement 2.2)

- [x] 5.4 Refactor main GenerateEditResumeStep component
  - Update `src/flow/steps/generateEditResume/GenerateEditResumeStep.tsx` to use sub-components
  - Maintain all Redux selectors and dispatch calls in main component
  - Pass state and callbacks to sub-components via props
  - **Requirement**: Maintain all existing Redux selectors and dispatch calls (Requirement 3.1)

- [x] 5.5 Create index.ts for generateEditResume
  - Create `src/flow/steps/generateEditResume/index.ts` export barrel
  - Export main step component for clean imports
  - **Requirement**: Organize sub-components in step's directory (Requirement 5.1)

### 6. Refactor JobRequirementsMatching (260 lines)

- [x] 6.1 Create SectionsList sub-component
  - Create `src/flow/steps/jobRequirementsMatching/components/MatchingDisplay.tsx`
  - Extract profile section display and selection functionality
  - Implement TypeScript interface for selected sections and callback props
  - **Requirement**: Break down large step component into logical sub-components (Requirement 2.2)

- [x] 6.2 Create ModalsManager sub-component
  - Create `src/flow/steps/jobRequirementsMatching/components/MatchingActions.tsx`
  - Extract rematch and proceed action functionality
  - Use shared action components where applicable
  - **Requirement**: Break down large step component into logical sub-components (Requirement 2.2)

- [x] 6.3 Refactor main JobRequirementsMatching component
  - Update `src/flow/steps/jobRequirementsMatching/JobRequirementsMatching.tsx` to use sub-components
  - Maintain LLM service calls and Redux integration in main component
  - Pass state and callbacks to sub-components via props
  - **Requirement**: Maintain same service calls and data handling (Requirement 4.1)

- [x] 6.4 Create index.ts for jobRequirementsMatching
  - Create `src/flow/steps/jobRequirementsMatching/index.ts` export barrel
  - Export main step component for clean imports
  - **Requirement**: Include index.ts file that exports main step component (Requirement 5.3)

### 7. Refactor ProfileSectionsStep (233 lines)

- [x] 7.1 Create ProfileSectionForm sub-component
  - Create `src/flow/steps/profileSections/components/ProfileSectionForm.tsx`
  - Extract form input and validation functionality
  - Use shared TextareaField component created in task 4.1
  - **Requirement**: Break down large step component into logical sub-components (Requirement 2.2)

- [x] 7.2 Create ProfileSectionList sub-component
  - Create `src/flow/steps/profileSections/components/ProfileSectionList.tsx`
  - Extract profile section display and management functionality
  - Use shared ContentCard components where applicable
  - **Requirement**: Break down large step component into logical sub-components (Requirement 2.2)

- [x] 7.3 Create ProfileSectionActions sub-component
  - Create `src/flow/steps/profileSections/components/ProfileSectionActions.tsx`
  - Extract action button functionality (add, delete, import, export)
  - Use shared action components where applicable
  - **Requirement**: Break down large step component into logical sub-components (Requirement 2.2)

- [x] 7.4 Refactor main ProfileSectionsStep component
  - Update `src/flow/steps/profileSections/ProfileSectionsStep.tsx` to use sub-components
  - Maintain Redux state management in main component
  - Pass state and callbacks to sub-components via props
  - **Requirement**: Sub-components receive Redux state via props from parent (Requirement 3.2)

- [x] 7.5 Create index.ts for profileSections
  - Update `src/flow/steps/profileSections/index.ts` export barrel
  - Export main step component for clean imports
  - **Requirement**: Include index.ts file that exports main step component (Requirement 5.3)

### 8. Refactor GenerateCoverLetterStep (203 lines)

- [x] 8.1 Create CoverLetterEditor sub-component
  - Create `src/flow/steps/generateCoverLetter/components/CoverLetterEditor.tsx`
  - Extract editor functionality from main component
  - Use shared EditorCard component created in task 2.1
  - **Requirement**: Break down large step component into logical sub-components (Requirement 2.2)

- [x] 8.2 Create CoverLetterActions sub-component
  - Create `src/flow/steps/generateCoverLetter/components/CoverLetterActions.tsx`
  - Extract action button functionality (copy, download, regenerate)
  - Use shared ActionBar component created in task 1.1
  - **Requirement**: Break down large step component into logical sub-components (Requirement 2.2)

- [x] 8.3 Refactor main GenerateCoverLetterStep component
  - Update `src/flow/steps/generateCoverLetter/GenerateCoverLetterStep.tsx` to use sub-components
  - Maintain LLM service integration in main component
  - Pass state and callbacks to sub-components via props
  - **Requirement**: LLM logic separated from UI with main component handling service calls (Requirement 4.3)

- [x] 8.4 Create index.ts for generateCoverLetter
  - Create `src/flow/steps/generateCoverLetter/index.ts` export barrel
  - Export main step component for clean imports
  - **Requirement**: Include index.ts file that exports main step component (Requirement 5.3)

### 9. Update Existing Components to Use Shared Components

- [x] 9.1 Update existing steps to use shared ActionBar
  - Update smaller step components to use shared ActionBar where applicable
  - Replace duplicate action button implementations with shared components
  - **Requirement**: Maintain exact same visual appearance and functionality (Requirement 1.4)

- [x] 9.2 Update existing steps to use shared state components
  - Update existing error, loading, and empty state displays to use shared components
  - Ensure consistent styling and behavior across all steps
  - **Requirement**: Maintain exact same visual appearance and functionality (Requirement 1.4)

### 10. Update Import References and Integration

- [x] 10.1 Update all import statements for refactored components
  - Update imports in parent components that use refactored step components
  - Ensure all component references point to new sub-component structure
  - **Requirement**: Update all imports and references accordingly (Requirement 5.2)

- [x] 10.2 Verify all step components maintain existing functionality
  - Test that all refactored components maintain exact same Redux integration
  - Verify that LLM service calls continue to work as before
  - Ensure UI/UX remains identical after refactoring
  - **Requirement**: Maintain exact same visual appearance and user functionality (Requirement 2.4)
