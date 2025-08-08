# Development Guide

Developer documentation for Resume Oracle's architecture, patterns, and development workflow.

## Project Architecture

### Core Structure

```
src/
├── app/                    # Next.js app router
├── components/ui/          # shadcn/ui components
├── flow/                   # Multi-step workflow logic
│   ├── MultiStepFlow.tsx   # Main flow orchestrator
│   ├── layout/             # Layout components
│   └── steps/              # Individual step implementations
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities
├── services/               # LLM service integrations
├── store/                  # Redux state management
├── types/                  # TypeScript definitions
└── utils/                  # Helper functions
```

### Step-Based Architecture

The application follows a 7-step workflow pattern:

1. **GetStartedStep** - Landing and introduction
2. **ProfileSectionsStep** - Profile data entry and management
3. **JobDescriptionStep** - Job and company context input
4. **JobRequirementsMatchingStep** - AI-powered requirement matching
5. **GenerateResumeSectionsStep** - Resume section generation
6. **GenerateEditResumeStep** - Final resume editing and export
7. **GenerateCoverLetterStep** - Cover letter generation

Each step is implemented as a self-contained component using the `createStep` utility.

## LLM Service Integration

### useLlmService Hook

Central hook for all AI operations with built-in caching and error handling:

```typescript
const [trigger, { isLoading, error, data, reset }] = useLlmService<OutputType>(
  serviceFunction
);

// Usage
const result = await trigger(...params);
```

**Features:**
- Automatic parameter caching with localStorage persistence
- LLM config injection from Redux state
- Type-safe with Zod schema validation
- Error handling and loading states

### Service Pattern

All LLM services follow a consistent pattern:

```typescript
export class ExampleService {
  async processData(
    input: InputType,
    llmConfig?: any
  ): Promise<OutputType> {
    const prompt = ChatPromptTemplate.fromTemplate(`...`);
    
    return await llmService.invokeWithStructuredOutput(
      prompt,
      OutputSchema,
      { input },
      llmConfig
    );
  }
}
```

### Auto re-trigger detection (useAutoRetrigger)

Use the generic useAutoRetrigger hook to automatically re-run LLM services when step inputs change and to show a banner for minor changes.

Usage pattern
1) Aggregate inputs for your step; keep the object shape stable.
2) Memoize your onAutoRun with useCallback and guard dispatches with isLatest().
3) Render ChangeAlertBanner when showBanner is true.


Example: Resume Sections Generation
```tsx
const payload = useMemo(() => getMatchedProfileSectionWithRequirements(selectedSections, profileSections), [selectedSections, profileSections]);
const inputs = useMemo(() => ({ payload }), [payload]);

const onGenerate = useCallback(async (isLatest: () => boolean) => {
  const result = await triggerGenerate(payload);
  if (!isLatest()) return;
  dispatch(setResumeSections(result));
}, [triggerGenerate, payload, dispatch]);

const { showBanner, onManualRun, isRunning, error } = useAutoRetrigger({
  stepKey: "generate-resume-sections",
  inputs,
  onAutoRun: onGenerate,
});
```

Tips
- Keep inputs stable: wrap arrays/objects in a memoized wrapper (e.g., { payload }).
- Avoid infinite loops: memoize onAutoRun with useCallback and don’t mutate inputs during render.
- Concurrency: always use the isLatest() predicate before applying results.
- Banner UX: use the shared ChangeAlertBanner from `@/flow/steps/shared`.

## State Management

### Redux Architecture

- **Slices**: Feature-based state slices with Redux Toolkit
- **Persistence**: Automatic persistence with redux-persist
- **Type Safety**: Full TypeScript integration with RootState

Key slices:
- `profileSectionsSlice` - User profile data
- `jobDescriptionSlice` - Job and company context
- `matchesSlice` - Requirement matching results
- `resumeSectionsSlice` - Generated resume content
- `coverLetterSlice` - Cover letter content

### Data Flow

```
User Input → Redux Store → LLM Service → Zod Validation → Redux Store → UI Update
```

## Component Patterns

### Compound Components

Complex features use compound component patterns:

```typescript
// Example: Enhancement Modal
<EnhanceProfileSectionModal>
  <ContextPanel>
    <CurrentSectionOverview />
    <MissingRequirements />
    <EnhancementTips />
  </ContextPanel>
  <EnhancementInterface>
    <InputPhase />
    <ReviewPhase />
  </EnhancementInterface>
</EnhanceProfileSectionModal>
```

### Step Components

Steps use the `createStep` higher-order component:

```typescript
export const MyStep = createStep({
  id: 'my-step',
  label: 'My Step',
  description: 'Step description'
})(MyStepComponent);
```

## Type Safety

### Zod Schemas

All LLM inputs/outputs use Zod schemas for runtime validation:

```typescript
export const ProfileSectionSchema = z.object({
  id: z.string(),
  type: z.string(),
  content: z.string()
});

export type ProfileSection = z.infer<typeof ProfileSectionSchema>;
```

### TypeScript Standards

- Strict mode enabled
- No implicit any
- Interface over type for object shapes
- Named exports preferred
- Proper dependency arrays in hooks

## Development Workflow

### File Organization

- **Co-location**: Feature components live near their feature modules
- **Atomic Design**: UI components broken into atomic, molecular levels
- **Modular**: Complex features split into focused sub-components

### Import Order

```typescript
// 1. React and external libraries
import React from 'react';
import { useDispatch } from 'react-redux';

// 2. Internal utilities and types
import { formatDate } from '@/utils/date';
import type { Task } from '@/types/task';

// 3. Component imports
import { Button } from '@/components/ui/Button';
```

### Testing Strategy

- Jest and React Testing Library for unit tests
- Focus on user behavior over implementation details
- Test LLM service integrations with mocked responses

## Performance Considerations

### Caching Strategy

- **LLM Results**: Cached in localStorage with parameter hashing
- **Component State**: React.memo for expensive renders
- **Redux Selectors**: Memoized selectors for derived state

### Optimization Techniques

- Lazy loading for step components
- Debounced inputs for real-time validation
- Virtualization for large lists (future consideration)

## Build and Deployment

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run type-check   # TypeScript validation
npm run lint         # ESLint check
```

### Environment Variables

```env
# LLM Service Configuration
NEXT_PUBLIC_LLM_ENDPOINT=
NEXT_PUBLIC_LLM_API_KEY=
```

## Troubleshooting

### Common Issues

1. **Type Errors**: Ensure Zod schemas match TypeScript interfaces
2. **Cache Issues**: Clear localStorage if LLM responses seem stale
3. **State Persistence**: Check redux-persist configuration for hydration issues

### Debug Tools

- Redux DevTools for state inspection
- React DevTools for component debugging
- Network tab for LLM service calls

## Future Architecture Plans

1. **Client-Side LLM**: Migrate to browser-based LLM processing
2. **Micro-Frontends**: Split into independent deployable modules  
3. **Plugin System**: Extensible architecture for community contributions
4. **Real-time Collaboration**: WebSocket integration for shared editing
