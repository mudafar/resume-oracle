# Enhance Profile Section Modal

This directory contains the modular components for the profile section enhancement functionality.

## Structure

```
enhanceProfileSectionModal/
├── index.ts                           # Main exports
├── EnhanceProfileSectionModal.tsx     # Main modal container
├── ContextPanel.tsx                   # Left panel container
├── EnhancementInterface.tsx           # Right panel container
├── CurrentSectionOverview.tsx         # Current section display
├── MissingRequirements.tsx            # Missing requirements display
├── EnhancementTips.tsx                # Enhancement tips card
├── InputPhase.tsx                     # Input form interface
└── ReviewPhase.tsx                    # Review and edit interface
```

## Components

### EnhanceProfileSectionModal
Main modal component that orchestrates the enhancement flow. Manages state and coordinates between different phases.

### ContextPanel
Container for the left panel showing:
- Current section overview
- Missing requirements
- Enhancement tips

### EnhancementInterface
Container for the right panel that switches between:
- Input phase (experience input form)
- Review phase (enhanced content editor)

### Atomic Components
- **CurrentSectionOverview**: Displays the current profile section content and score
- **MissingRequirements**: Shows missing requirements as badges
- **EnhancementTips**: Static tips for enhancement best practices
- **InputPhase**: Form for entering additional experience and context
- **ReviewPhase**: Editor for reviewing and modifying enhanced content

## Usage

```tsx
import { EnhanceProfileSectionModal } from './enhanceProfileSectionModal';

<EnhanceProfileSectionModal
  open={isOpen}
  onClose={handleClose}
  selectedSection={selectedSection}
  profileSections={profileSections}
  onSaveEnhancement={handleSave}
/>
```
