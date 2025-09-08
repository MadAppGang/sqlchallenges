# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SQL Interview Challenge website - A collaborative SQL practice platform built with React, TypeScript, and Vite. Based on Figma design: https://www.figma.com/design/W2mQlYkwPBf1ofOYuMRNnT/Collaboration-Challenge-Website

## Development Commands

```bash
npm i          # Install dependencies
npm run dev    # Start development server (port 3000)
npm run build  # Build for production (outputs to /build)
npm run lint   # Run Biome linter
npm run lint:fix # Fix linting issues
npm run format # Format code with Biome
```

## Architecture

### Tech Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC
- **Database**: PGlite (PostgreSQL in browser via WASM)
- **SQL Editor**: Monaco Editor (@monaco-editor/react)
- **UI Components**: Custom components built on Radix UI primitives
- **Styling**: Tailwind CSS with class-variance-authority for component variants
- **State Management**: React hooks (useState)
- **Data Visualization**: XYFlow for ER diagrams, Recharts for charts

### Core Application Structure
- **App.tsx**: Main application component managing:
  - Challenge selection state
  - SQL query execution against PGlite database
  - Collaboration features (mock)
  - Layout with ResizablePanelGroup (horizontal/vertical splits)
  
### Database Layer (`/src/lib/`)
- **database-init.ts**: PGlite initialization, schema creation, and query execution
  - Dynamically loads PGlite to avoid bundler issues
  - Creates e-commerce schema: categories, products, customers, orders, order_items
  - Provides `executeQuery()` function with error handling and timing
- **databaseSchema.ts**: Schema definitions and ER diagram relationships
- **taskParser.ts**: Parses task markdown with YAML frontmatter
- **taskContent.ts**: Contains hardcoded challenge content

### Component Organization
- `/src/components/ui/` - Radix UI-based reusable components
- `/src/components/` - Feature components:
  - **TaskAndSchemaView**: Tabs for task description and database schema
  - **TaskDescription**: Renders challenge markdown content
  - **DatabaseSchema**: Shows table structure in collapsible sections
  - **ERDiagram**: Interactive ER diagram using XYFlow with dagre layout
  - **CodeEditor**: Monaco editor with SQL syntax highlighting
  - **QueryResults**: Tabbed display of query results with execution timing

### Key Implementation Details
- **Path Alias**: `@` maps to `/src` directory
- **Vite Config**: Custom aliases for exact package versions to prevent conflicts
- **Server Port**: Development server runs on port 3000
- **Build Output**: Production build outputs to `/build` directory
- **Code Style**: Biome formatter with tabs, double quotes
- **No TypeScript Config**: Project works without explicit tsconfig.json
- we are using pnpm instead of npm, and we are using biome instead of eslint