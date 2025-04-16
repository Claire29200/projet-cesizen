
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import InformationsList from "./pages/InformationsList";
import InformationPage from "./pages/InformationPage";
import DiagnosticPage from "./pages/DiagnosticPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import UserResources from "./pages/UserResources";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminInformations from "./pages/admin/AdminInformations";
import AdminDiagnostics from "./pages/admin/AdminDiagnostics";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import { SessionManager } from "./components/auth/SessionManager";
import AboutPage from "./pages/AboutPage";

// Création du client pour React Query
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SessionManager />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/informations" element={<InformationsList />} />
          <Route path="/informations/:slug" element={<InformationPage />} />
          <Route path="/diagnostic" element={<DiagnosticPage />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
          <Route path="/a-propos" element={<AboutPage />} />

          {/* Protected routes for logged in users */}
          <Route path="/profil" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/mes-ressources" element={
            <ProtectedRoute>
              <UserResources />
            </ProtectedRoute>
          } />

          {/* Protected routes for admin users */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/utilisateurs" element={
            <ProtectedRoute adminOnly>
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/informations" element={
            <ProtectedRoute adminOnly>
              <AdminInformations />
            </ProtectedRoute>
          } />
          <Route path="/admin/diagnostics" element={
            <ProtectedRoute adminOnly>
              <AdminDiagnostics />
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
