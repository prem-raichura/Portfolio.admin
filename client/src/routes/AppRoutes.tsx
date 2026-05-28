import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";

import Projects from "../pages/Projects";
import CreateProject from "../pages/CreateProject";

import Experience from "../pages/Experience";
import CreateExperience from "../pages/CreateExperience";

function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Landing Page */}

        <Route
          path="/"
          element={<Landing />}
        />

        {/* Login */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* Register */}

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Dashboard */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
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