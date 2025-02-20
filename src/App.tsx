
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Index from "./pages/Index";
import Notes from "./pages/Notes";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setAuthenticated(!!session);
    setLoading(false);
  };

  if (loading) {
    return null;
  }

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <nav className="bg-[#1A1F2C] text-white p-4" dir="rtl">
                    <div className="container mx-auto max-w-4xl flex gap-4">
                      <Link to="/" className="hover:text-gray-300 transition-colors">المصاريف</Link>
                      <Link to="/notes" className="hover:text-gray-300 transition-colors">الملاحظات</Link>
                    </div>
                  </nav>
                  <Index />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <>
                  <nav className="bg-[#1A1F2C] text-white p-4" dir="rtl">
                    <div className="container mx-auto max-w-4xl flex gap-4">
                      <Link to="/" className="hover:text-gray-300 transition-colors">المصاريف</Link>
                      <Link to="/notes" className="hover:text-gray-300 transition-colors">الملاحظات</Link>
                    </div>
                  </nav>
                  <Notes />
                </>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
