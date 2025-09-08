# SQL Interview Challenge Platform

An interactive web application for practicing SQL interview questions with real-time query execution in the browser. Built with React, TypeScript, and PGlite (PostgreSQL in WebAssembly).

![SQL Interview Challenge](https://img.shields.io/badge/SQL-Practice-blue)
![React](https://img.shields.io/badge/React-18-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-In_Browser-336791)

## Features

- **Real SQL Execution**: Full PostgreSQL database running in your browser using PGlite
- **Interactive Challenges**: Multiple difficulty levels (Easy, Medium, Hard) with real-world scenarios
- **Live SQL Editor**: Monaco Editor with syntax highlighting and auto-completion
- **Visual Database Schema**: Interactive ER diagrams and table structure views
- **Instant Feedback**: See query results immediately with execution time metrics
- **Collaborative Interface**: Mock collaboration features with user presence indicators
- **Responsive Layout**: Resizable panels for optimal workspace arrangement

## Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/sqlinterview.git
cd sqlinterview

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at http://localhost:3000

### Building for Production

```bash
npm run build
```

Production files will be generated in the `/build` directory.

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run lint` - Run Biome linter
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Format code with Biome

## Project Structure

```
sqlinterview/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components (Radix UI based)
│   │   ├── CodeEditor.tsx
│   │   ├── DatabaseSchema.tsx
│   │   ├── ERDiagram.tsx
│   │   ├── QueryResults.tsx
│   │   ├── TaskDescription.tsx
│   │   └── TaskAndSchemaView.tsx
│   ├── lib/
│   │   ├── database-init.ts    # PGlite initialization
│   │   ├── databaseSchema.ts   # Schema definitions
│   │   ├── taskParser.ts       # Markdown/YAML parser
│   │   └── taskContent.ts      # Challenge content
│   ├── styles/
│   │   └── globals.css         # Global styles
│   ├── App.tsx                 # Main application
│   ├── main.tsx               # Entry point
│   └── index.css              # Root styles
├── public/                    # Static assets
├── package.json
├── vite.config.ts            # Vite configuration
├── biome.json                # Code formatter config
└── README.md
```

## Database Schema

The application uses an e-commerce database schema with the following tables:

- **categories** - Product categories
- **products** - Product catalog with pricing and stock
- **customers** - Customer information
- **orders** - Order records
- **order_items** - Individual items within orders

All tables are pre-populated with sample data for testing queries.

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool with SWC for fast compilation
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives

### Database
- **PGlite** - PostgreSQL running in WebAssembly
- Full SQL support including JOINs, aggregations, and subqueries

### Editor & Visualization
- **Monaco Editor** - VS Code editor in browser
- **XYFlow** - Interactive ER diagram rendering
- **Recharts** - Data visualization

### Code Quality
- **Biome** - Fast formatter and linter
- Tab indentation with double quotes

## Usage Guide

1. **Select a Challenge**: Use the dropdown to choose from available SQL challenges
2. **Review the Task**: Read the requirements in the Task Description tab
3. **Explore the Schema**: Switch to the Database Schema tab to understand table structures
4. **Write Your Query**: Use the SQL editor to write your solution
5. **Execute**: Click "Run Query" or press Ctrl+Enter to execute
6. **Review Results**: Check the output in the results panel below

## Development

### Code Style

The project uses Biome for formatting with:
- Tab indentation
- Double quotes for strings
- No semicolons in TypeScript/JavaScript

Run formatting before committing:
```bash
npm run format
```

### Adding New Challenges

Challenges are defined in `/src/lib/taskContent.ts` with YAML frontmatter:

```typescript
export const taskContent = `
---
id: 4
title: Your Challenge Title
difficulty: Medium
category: Analytics
timeEstimate: 15 minutes
tables:
  - table1
  - table2
skills:
  - JOINs
  - Aggregation
---

## Challenge Description

Write your challenge content here in Markdown...
`;
```

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 15+
- Edge 90+

WebAssembly support is required for PGlite to function.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built from [Figma design](https://www.figma.com/design/W2mQlYkwPBf1ofOYuMRNnT/Collaboration-Challenge-Website)
- Powered by [PGlite](https://github.com/electric-sql/pglite) for in-browser PostgreSQL
- UI components from [Radix UI](https://www.radix-ui.com/)

## Support

For issues, questions, or suggestions, please open an issue on GitHub.