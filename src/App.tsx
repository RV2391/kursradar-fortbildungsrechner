
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Embed from "./pages/Embed";
import Provider from "./pages/Provider";
import BAfoeg from "./pages/BAfoeg";
import Bildungsurlaub from "./pages/Bildungsurlaub";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/anbieter" element={<Provider />} />
          <Route path="/bafoeg" element={<BAfoeg />} />
          <Route path="/bildungsurlaub" element={<Bildungsurlaub />} />
          <Route path="/embed" element={<Embed />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
