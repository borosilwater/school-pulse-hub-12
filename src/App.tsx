import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Index from "./pages/Index";
import TestIndex from "./pages/TestIndex";
import Dashboard from "./pages/Dashboard";
import StudentPortal from "./pages/StudentPortal";
import TeacherDashboard from "./pages/TeacherDashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { NotificationCenter } from "./components/notifications/NotificationCenter";
import AdminDashboard from "./pages/AdminDashboard";
import News from "./pages/News";
import Announcements from "./pages/Announcements";
import Events from "./pages/Events";
import ExamResults from "./pages/ExamResults";
import Gallery from "./pages/Gallery";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Applications from "./pages/Applications";
import FeeManagement from "./pages/FeeManagement";
import Documents from "./pages/Documents";
import Faculty from "./pages/Faculty";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/test" element={<TestIndex />} />
              <Route element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/student" element={<StudentPortal />} />
                <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
                <Route path="/dashboard/notifications" element={<NotificationCenter />} />
                <Route path="/news" element={<News />} />
                <Route path="/announcements" element={<Announcements />} />
                <Route path="/events" element={<Events />} />
                <Route path="/results" element={<ExamResults />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/students" element={<Students />} />
                <Route path="/teachers" element={<Teachers />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/fee-management" element={<FeeManagement />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/faculty" element={<Faculty />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
