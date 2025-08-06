# Step Component Refactoring Design Document

## Overview

This design document outlines the technical approach for refactoring step components in the `src/flow/steps/` directory. The refactoring will extract shared components and break down large monolithic components into smaller, focused sub-components while preserving the exact same UI/UX and functionality.

### Current State Analysis

**Large Components (>200 lines) requiring breakdown:**
- `GenerateEditResumeStep.tsx` (330 lines)
- `JobRequirementsMatching.tsx` (260 lines) 
- `ProfileSectionsStep.tsx` (233 lines)
- `GenerateCoverLetterStep.tsx` (203 lines)

**Existing Shared Components:**
- `RegenerateBanner.tsx` - Alert banner for input changes
- `OptimizationSummaryCard.tsx` - Collapsible AI analysis display
- `getMatchedProfileSectionWithRequirements.ts` - Utility function

**Common Patterns Identified:**
- LLM loading states and error handling
- Copy/download action buttons
- Regeneration workflows
- Card-based content display
- Form input handling

## Architecture

### Component Organization Strategy

```
src/flow/steps/
├── shared/                           # Cross-step shared components
│   ├── actions/                      # Reusable action components
│   │   ├── ActionBar.tsx            # Copy, download, regenerate actions
│   │   ├── CopyButton.tsx           # Standalone copy functionality
│   │   └── DownloadButton.tsx       # Standalone download functionality
│   ├── cards/                       # Reusable card components
│   │   ├── ContentCard.tsx          # Generic content display card
│   │   ├── EditorCard.tsx           # Generic editor card with view/edit modes
│   │   └── LoadingCard.tsx          # Standard loading state card
│   ├── forms/                       # Reusable form components
│   │   ├── TextareaField.tsx        # Enhanced textarea with char count
│   │   └── FormField.tsx            # Generic form field wrapper
│   ├── states/                      # State display components
│   │   ├── ErrorState.tsx           # Standard error display
│   │   ├── EmptyState.tsx           # Standard empty state
│   │   └── LoadingState.tsx         # Standard loading state
│   ├── RegenerateBanner.tsx         # Existing - input change alert
│   ├── OptimizationSummaryCard.tsx  # Existing - AI analysis display
│   └── getMatchedProfileSectionWithRequirements.ts # Existing utility
├── [stepName]/                      # Individual step directories
│   ├── components/                  # Step-specific sub-components
│   │   ├── [StepName]Form.tsx      # Form-related components
│   │   ├── [StepName]Display.tsx   # Display-related components
│   │   └── [StepName]Actions.tsx   # Action-related components
│   ├── hooks/                       # Step-specific hooks
│   │   └── use[StepName].ts        # Custom hooks for step logic
│   ├── [StepName]Step.tsx          # Main step component
│   └── index.ts                    # Export barrel
```

### Component Breakdown Strategy

#### 1. Extract Shared Components First
Focus on components that appear in multiple steps:
- Action patterns (copy, download, regenerate)
- Card layouts for content display
- Form field patterns
- Loading/error/empty states

#### 2. Break Down Large Components
Apply the following breakdown pattern for components >200 lines:

**Main Step Component:**
- Redux integration and state management
- LLM service integration
- Coordination between sub-components
- High-level rendering logic

**Sub-components:**
- `[StepName]Form.tsx` - Form inputs and validation
- `[StepName]Display.tsx` - Content display and preview
- `[StepName]Actions.tsx` - Action buttons and controls

## Components and Interfaces

### Shared Components

#### ActionBar Component
```typescript
interface ActionBarProps {
  onCopy?: () => void;
  onDownload?: () => void;
  onRegenerate?: () => void;
  isLoading?: boolean;
  copied?: boolean;
  downloadFormat?: 'markdown' | 'pdf';
  className?: string;
}
```

#### ContentCard Component
```typescript
interface ContentCardProps {
  title: string;
  content: string;
  editMode?: boolean;
  onEdit?: (content: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
  actions?: React.ReactNode;
  className?: string;
}
```

#### EditorCard Component
```typescript
interface EditorCardProps {
  title: string;
  content: string;
  editMode: boolean;
  onToggleEdit: (editing: boolean) => void;
  onContentChange: (content: string) => void;
  actions?: React.ReactNode;
  placeholder?: string;
  minHeight?: string;
}
```

### Step-Specific Interfaces

#### GenerateEditResume Breakdown
```typescript
// Main component props
interface GenerateEditResumeProps {}

// Sub-component props
interface ResumeFormProps {
  resume: string;
  editMode: boolean;
  onContentChange: (content: string) => void;
  onToggleEdit: (editing: boolean) => void;
}

interface ResumeActionsProps {
  onCopy: () => void;
  onDownload: () => void;
  onExportPdf: () => void;
  onRegenerate: () => void;
  isLoading: boolean;
  isExportingPdf: boolean;
  copied: boolean;
}

interface ResumeDisplayProps {
  content: string;
  markdownContentRef: React.RefObject<HTMLDivElement>;
}
```

#### GenerateCoverLetter Breakdown
```typescript
interface CoverLetterFormProps {
  coverLetter: string;
  editMode: boolean;
  onContentChange: (content: string) => void;
  onToggleEdit: (editing: boolean) => void;
}

interface CoverLetterActionsProps {
  onCopy: () => void;
  onDownload: () => void;
  onRegenerate: () => void;
  isLoading: boolean;
  copied: boolean;
}
```

#### JobRequirementsMatching Breakdown
```typescript
interface MatchingDisplayProps {
  selectedSections: any[];
  onSectionSelect: (section: any) => void;
  onSectionDeselect: (sectionId: string) => void;
}

interface MatchingActionsProps {
  onRematch: () => void;
  onProceed: () => void;
  isLoading: boolean;
  hasSelections: boolean;
}
```

## Data Models

### Shared Data Interfaces

```typescript
// Action button states
interface ActionStates {
  isLoading: boolean;
  copied: boolean;
  isExporting?: boolean;
}

// Content edit states
interface EditStates {
  editMode: boolean;
  hasChanges: boolean;
  isDirty: boolean;
}

// LLM service states
interface LLMStates {
  isLoading: boolean;
  error: string | null;
  data: any | null;
}
```

### Component State Management

**State Location Strategy:**
- **Global State (Redux):** Content data, LLM service results, user preferences
- **Local State:** UI states (editMode, copied, expanded), form values, temporary states
- **Shared State:** Pass down from main step component to sub-components via props

**Props vs State Guidelines:**
- Sub-components receive data via props from parent
- Sub-components emit events via callback props
- No direct Redux access in sub-components (except main step component)

## Error Handling

### Standardized Error Components

#### ErrorState Component
```typescript
interface ErrorStateProps {
  error: string | Error;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}
```

#### Error Boundary Integration
- Each main step component will have error boundary
- Sub-components will propagate errors to parent
- Standardized error display across all steps

### Error Flow
1. LLM service errors caught in main step component
2. Form validation errors handled in form sub-components
3. Network errors displayed in standardized error states
4. User-friendly error messages for all error types

## Testing Strategy
No testing is required at this time
SKIP TESTINGS

## Implementation Plan

### Phase 1: Extract Shared Components (Priority: High)
1. Create `src/flow/steps/shared/actions/ActionBar.tsx`
2. Create `src/flow/steps/shared/cards/EditorCard.tsx`
3. Create `src/flow/steps/shared/states/` components
4. Create `src/flow/steps/shared/forms/` components

### Phase 2: Refactor Large Components (Priority: High)
1. **GenerateEditResumeStep** (330 lines)
   - Extract `ResumeEditor.tsx`
   - Extract `ResumeActions.tsx`
   - Extract `ResumeDisplay.tsx`

2. **JobRequirementsMatching** (260 lines)
   - Extract `MatchingDisplay.tsx`
   - Extract `MatchingActions.tsx`
   - Extract `MatchingFilters.tsx`

3. **ProfileSectionsStep** (233 lines)
   - Extract `ProfileSectionForm.tsx`
   - Extract `ProfileSectionList.tsx`
   - Extract `ProfileSectionActions.tsx`

4. **GenerateCoverLetterStep** (203 lines)
   - Extract `CoverLetterEditor.tsx`
   - Extract `CoverLetterActions.tsx`

### Phase 3: Optimize Remaining Components (Priority: Medium)
1. Apply shared components to smaller steps
2. Standardize patterns across all steps
3. Update import statements and references

### Migration Strategy

**Backward Compatibility:**
- Maintain existing component exports during transition
- Update imports incrementally
- Test each refactored component before proceeding

**File Organization:**
- Create new sub-component files first
- Refactor main component to use sub-components
- Remove old code once verified
- Update all import references

### Success Metrics

**Code Quality Metrics:**
- Reduce average component size from 200+ lines to <150 lines
- Achieve >80% code reuse for common patterns
- Maintain 100% functional equivalence

**Developer Experience Metrics:**
- Faster component location and modification
- Easier testing and debugging
- Consistent patterns across all steps

### Risk Mitigation

**Technical Risks:**
- **State management complexity:** Mitigated by keeping Redux in main components
- **Props drilling:** Mitigated by limiting component depth to 2-3 levels


**Integration Risks:**
- **LLM service integration:** Mitigated by maintaining service calls in main components
- **Redux state management:** Mitigated by preserving existing selectors and dispatchers
- **UI/UX consistency:** Mitigated by using exact same UI components and styling
