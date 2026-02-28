# Task Management SPA

A modern Single Page Application for task management built with React.js, TypeScript, Vite, and Tailwind CSS. The application features a clean Glassmorphism design and provides a comprehensive suite of productivity tools.

## Features

- **Authentication**: Secure email/password authentication powered by Supabase.
- **Task Management**: Full CRUD operations for tasks including titles, descriptions, and categories.
- **Pomodoro Timer**: Integrated timer to boost focus and productivity.
- **Gamification System**: Earn points and level up as you complete tasks to stay motivated.
- **Modern UI/UX**: Fully responsive Glassmorphism design with smooth animations.
- **Dashboard**: Track your productivity statistics and progress.
- **Real-time State**: Global state structure configured for real-time data sync.

## Tech Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend/BaaS**: Supabase (Authentication & Database)
- **Routing**: React Router (including Protected Routes)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- npm

### Installation

1. Clone the repository and navigate into the project directory:
   ```bash
   cd "To-Do List"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Variables:
   Rename the `.env.example` file to `.env` (or create one) and fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `src/components/`: Reusable UI components and route guards (e.g., `ProtectedRoute`)
- `src/contexts/`: React Context providers for global state (e.g., `AuthContext`)
- `src/services/`: API wrappers and backend client setups (e.g., `supabaseClient.ts`, `api.ts`)
- `src/pages/`: Main application views
- `src/types/`: TypeScript interfaces and type definitions
