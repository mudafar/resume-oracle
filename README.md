# Resume Oracle

AI-driven resume and cover letter optimization platform that transforms job descriptions into tailored applications.

## Overview

Resume Oracle is a guided, step-by-step workflow that helps job seekers create highly targeted resumes and cover letters by analyzing job descriptions and matching them with existing experience. Unlike traditional resume builders, it starts with the job requirements and optimizes your profile accordingly.

### Key Features

- **Job-Description Centered**: Workflow driven by specific job requirements rather than generic templates
- **Zero Hallucination**: Uses only your existing experience - no fictional content added
- **Multi-Step Coaching**: 7-step guided process with persistent state management
- **AI-Powered Matching**: Intelligent scoring and gap analysis for profile sections vs. job requirements
- **ATS-Optimized Export**: Clean Markdown output optimized for applicant tracking systems

### Workflow Steps

1. **Profile Sections** - Import and structure your existing experience
2. **Job Description** - Paste target job description and company context
3. **Requirements Matching** - AI extracts and matches job requirements to your profile
4. **Profile Enhancement** - Enhance sections with missing requirements
5. **Resume Generation** - Create tailored resume sections
6. **Resume Editor** - Edit and export final resume as Markdown/PDF
7. **Cover Letter** - Generate personalized cover letter

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **State Management**: Redux Toolkit with persistence
- **AI Integration**: LangChain.js with custom `useLlmService` hook
- **Type Safety**: Zod schemas for LLM output validation

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start the application.

## Documentation

- [Development Guide](./DEV.md) - Architecture, patterns, and development workflow
- [Feature Overview](./feature_overview.md) - Detailed feature descriptions
- [UI Flow](./multi_step_ui_flow.md) - Complete user journey documentation

## Contributing

This project follows strict TypeScript patterns and uses AI-assisted development. See [DEV.md](./DEV.md) for development guidelines and architectural decisions. 
