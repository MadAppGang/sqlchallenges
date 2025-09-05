# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SQL Interview Challenge website - A collaborative SQL practice platform built with React, TypeScript, and Vite. Based on Figma design: https://www.figma.com/design/W2mQlYkwPBf1ofOYuMRNnT/Collaboration-Challenge-Website

## Development Commands

```bash
npm i          # Install dependencies
npm run dev    # Start development server (port 3000)
npm run build  # Build for production (outputs to /build)
```

## Architecture

### Tech Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC
- **UI Components**: Custom components built on Radix UI primitives
- **Styling**: Tailwind CSS with class-variance-authority for component variants
- **State Management**: React hooks (useState)

### Key Directories
- `/src/components/` - React components
  - `/ui/` - Reusable UI components (built on Radix UI)
  - Main app components: TaskDescription, DataStructure, CodeEditor, QueryResults, etc.
- `/src/data/` - Mock data and SQL query execution logic (mockChallenges.ts)
- `/src/styles/` - Global styles (globals.css) + index.css in src root

### Component Architecture
- **App.tsx**: Main application component managing:
  - Challenge selection state
  - SQL query execution
  - Collaboration features
  - Layout with ResizablePanelGroup (horizontal/vertical splits)
- **UI Components**: All UI components follow Radix UI patterns with Tailwind styling
- **Path Alias**: `@` maps to `/src` directory

### Key Features
1. **SQL Challenge System**: Multiple challenges with difficulty levels
2. **Split Panel Layout**: Resizable panels for task/data/editor/results
3. **Live Collaboration**: Mock collaboration with user presence indicators
4. **SQL Query Execution**: Mock SQL engine in mockChallenges.ts
5. **Responsive Results Display**: Table view with execution time tracking

## Important Notes
- Lint scripts available: `npm run lint`, `npm run lint:fix`, `npm run format` (using Biome)
- Uses extensive Radix UI component library for accessibility
- Vite config includes specific version aliases for all dependencies
- Build target: ESNext, outputs to /build directory
- Use Biome for code formatting (configured with @biomejs/biome)