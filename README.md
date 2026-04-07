# Inkling - AI-Powered Project Management

A cognitive canvas for AI-assisted project management and collaboration.

## Overview

Inkling is a next-generation project management platform that integrates AI assistance directly into your workflow. Built with the "Cognitive Canvas" design philosophy, it provides a beautiful, themeable interface that adapts to your preference - from luminous light mode to deep obsidian dark mode.

## Features

### Phase 1 (Foundation)

- **Dashboard**: Overview of projects, tasks, and AI insights
- **Task Management**: List and Kanban board views with drag-and-drop
- **AI Architect**: Conversational project setup powered by AI
- **Resource Hub**: Centralized storage for documents, presentations, and demos
- **AI Assistance**: Context-aware help for individual tasks
- **Global Sidebar**: Persistent navigation across all views
- **Theme Toggle**: Switch between light and dark modes instantly

## Design System

Inkling uses "The Cognitive Canvas" design system with dual themes:

### Light Mode (Luminous Intelligence)
- **Colors**: Clean, airy palette with deep indigo accents
- **Typography**: Manrope (display) + Inter (body)
- **Feel**: Editorial-grade, premium workspace

### Dark Mode (Obsidian Intelligence)
- **Colors**: Deep obsidian with indigo pulse and warm accents
- **Typography**: Space Grotesk (display) + Inter (body)
- **Feel**: Immersive, focused studio environment

### Core Principles
- **No-Line Rule**: Boundaries defined by tonal shifts, not borders
- **Glassmorphism**: Backdrop blur for floating overlays
- **Tonal Layering**: Depth through color, not shadows
- **AI Accent**: Tertiary colors highlight intelligent features

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Custom UI components with Radix primitives
- **Icons**: Lucide React
- **AI Rendering**: react-markdown

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
inkling-frontend/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Dashboard
│   ├── tasks/               # Tasks page
│   ├── resources/           # Resource Hub
│   └── architect/           # AI Architect chat
├── components/              # React components
│   ├── ui/                  # Base UI components
│   ├── layout/              # Layout components
│   └── tasks/               # Task-specific components
├── lib/                     # Utilities and data
│   ├── utils.ts             # Helper functions
│   └── dummyData.ts         # Mock data for development
├── types/                   # TypeScript type definitions
└── tailwind.config.ts       # Tailwind configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Design Tokens

### Colors

- **Surface**: `#0c1324` (Background)
- **Primary**: `#c0c1ff` (Indigo accent)
- **Primary Container**: `#4b4dd8`
- **Tertiary**: `#ffb695` (AI insights)

### Typography

- **Display**: Space Grotesk (3.5rem - 1.125rem)
- **Body**: Inter (1.125rem - 0.875rem)
- **Labels**: Inter (0.875rem - 0.625rem)

## Roadmap

### Phase 2 (Collaboration)
- Real-time collaboration
- Comments and mentions
- Activity feeds

### Phase 3 (Advanced AI)
- Automated task breakdown
- Predictive timelines
- Smart resource suggestions

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT License - see LICENSE file for details

---

Built with ❤️ using Next.js and Tailwind CSS
