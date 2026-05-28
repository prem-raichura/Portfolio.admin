import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Landing from "../pages/Landing";

import Login from "../pages/Login";

import AuthCallback from "../pages/AuthCallback";

import Dashboard from "../pages/Dashboard";

import Projects from "../pages/Projects";

import CreateProject from "../pages/CreateProject";

import Experience from "../pages/Experience";
import CreateExperience from "../pages/CreateExperience";

function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================= */}

        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/auth/github/callback"
          element={
            <AuthCallback />
          }
        />

        {/* =========================
            PROTECTED ROUTES
        ========================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Projects */}

        <Route
          path="/projects"
          element={<Projects />}
        />

        {/* Create Project */}

        <Route
          path="/projects/create"
          element={<CreateProject />}
        />

        {/* Experience */}

        <Route
          path="/experience"
          element={<Experience />}
        />

        {/* Create Experience */}

        <Route
          path="/experience/create"
          element={<CreateExperience />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;