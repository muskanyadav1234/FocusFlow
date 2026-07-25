# FocusFlow – Smart Task Management Application

FocusFlow is a modern productivity and task management application designed to help users organize tasks, track progress, and improve daily workflow. The platform provides an intuitive interface for creating, managing, and monitoring tasks with a clean dashboard experience.

The application focuses on improving productivity through smart task organization, status tracking, and an interactive user-friendly interface.

---

# ✨ Features

## Task Management
- Create, update, and delete tasks.
- Organize tasks based on categories and priorities.
- Track task completion status.
- Manage daily workflows efficiently.

## Dashboard Analytics
- Overview of total tasks.
- Completed and pending task tracking.
- Visual representation of productivity progress.
- Quick access to important activities.

## Smart Organization
- Task filtering and searching.
- Priority-based task management.
- Category-wise task grouping.

## Modern UI Experience
- Responsive design for desktop and mobile.
- Clean and minimal user interface.
- Interactive components for better usability.

## Performance
- Fast development using Vite.
- Optimized React components.
- Efficient state management.

---

# 🛠 Tech Stack

## Frontend

- **React.js** – Component-based UI development
- **TypeScript** – Type-safe JavaScript development
- **Vite** – Fast frontend build tool
- **Tailwind CSS** – Utility-first styling framework
- **shadcn/ui** – Reusable UI components
- **React Router** – Client-side routing
- **React Query** – Server state management
- **Recharts** – Data visualization

---

## Backend

- **Supabase** – Backend as a Service
- **PostgreSQL** – Database management
- **Supabase Authentication** – User authentication
- **Supabase APIs** – Data communication

---

## Development Tools

- Git & GitHub
- VS Code
- npm
- ESLint
- Prettier

---

# System Architecture

```
                User
                 |
                 |
          React Application
                 |
        -------------------
        |                 |
   UI Components      State Management
        |
        |
      Supabase
        |
 --------------------
 |                  |
Database        Authentication
(PostgreSQL)
```

---

# Project Structure

```
src/
│
├── assets/
│   └── Images, icons, static files
│
├── components/
│   │
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── reusable shadcn components
│   │
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   │
│   ├── dashboard/
│   │   ├── TaskStats.tsx
│   │   ├── ProgressChart.tsx
│   │   └── ActivityCard.tsx
│   │
│   ├── tasks/
│   │   ├── TaskCard.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskList.tsx
│   │   └── TaskFilter.tsx
│   │
│   └── common/
│       ├── Loader.tsx
│       └── ErrorMessage.tsx
│
├── pages/
│   │
│   ├── Home.tsx
│   ├── Dashboard.tsx
│   ├── Tasks.tsx
│   ├── Profile.tsx
│   ├── Login.tsx
│   └── Signup.tsx
│
├── hooks/
│   ├── useTasks.ts
│   ├── useAuth.ts
│   └── useLocalStorage.ts
│
├── contexts/
│   ├── AuthContext.tsx
│   └── TaskContext.tsx
│
├── services/
│   ├── api.ts
│   ├── authService.ts
│   └── taskService.ts
│
├── routes/
│   └── AppRoutes.tsx
│
├── lib/
│   ├── utils.ts
│   └── constants.ts
│
├── types/
│   ├── task.ts
│   └── user.ts
│
├── styles/
│   └── globals.css
│
├── App.tsx
├── main.tsx
└── vite-env.d.ts
```

# Installation & Setup

## Prerequisites

Make sure you have installed:

- Node.js (v18 or above)
- npm
- Git

Check versions:

```bash
node -v
npm -v
```

---

# Clone Repository

```bash
git clone https://github.com/muskanyadav1234/FocusFlow.git
```

Navigate into project:

```bash
cd FocusFlow
```

---

# Install Dependencies

Using npm:

```bash
npm install
```

If dependency conflict occurs:

```bash
npm install --legacy-peer-deps
```

---

# Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url

VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Add your Supabase project credentials.

---

# Run Application

Start development server:

```bash
npm run dev
```

Application will run on:

```
http://localhost:5173
```

---

#  Production Build

Create optimized production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

# Future Enhancements

- AI-based task prioritization
- Smart productivity recommendations
- Calendar integration
- Reminder notifications
- Team collaboration features
- Mobile application
- Advanced analytics dashboard

---

# Contribution

Contributions are welcome.

Steps:

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added new feature"
```

4. Push branch

```bash
git push origin feature-name
```

5. Create a Pull Request

---

# License

This project is licensed under the MIT License.

---

# 👩‍💻 Author

**Muskan Yadav**

GitHub:
https://github.com/muskanyadav1234

LinkedIn:
https://www.linkedin.com/in/muskan-yadav-021462306
