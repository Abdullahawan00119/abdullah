import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "./components/Loader";

// Lazy load all heavy components for faster initial load
const Portfolio = lazy(() => import("./Portfolio"));
const Login = lazy(() => import("./Login"));
const AdminLayout = lazy(() => import("./AdminLayout"));
const AdminMessages = lazy(() => import("./AdminMessages"));
const AdminProfile = lazy(() => import("./AdminProfile"));
const AdminSkills = lazy(() => import("./AdminSkills"));
const AdminProjects = lazy(() => import("./AdminProjects"));
const AdminExperience = lazy(() => import("./AdminExperience"));
const AdminSettings = lazy(() => import("./AdminSettings"));
const AdminTestimonials = lazy(() => import("./AdminTestimonials"));
const AdminDashboard = lazy(() => import("./AdminDashboard"));
const ProjectsPage = lazy(() => import("./ProjectsPage"));
const ProjectDetails = lazy(() => import("./ProjectDetails"));

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader /></div>}>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="skills" element={<AdminSkills />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="experience" element={<AdminExperience />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
