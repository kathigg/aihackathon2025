
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AuthGuard from "./pages/AuthGuard";
import Index from "./pages/Index";
import Solutions from "./pages/Solutions";
import Domain from "./pages/Domain";
import RegisterPage from "./pages/RegisterPage";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import FeedPage from "./pages/Feed";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/feed" element={<Index />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/domain/:slug" element={<Domain />} />
          <Route path="/d/:slug" element={<Domain />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:threadId" element={<Messages />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
