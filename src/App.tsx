
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { BrandHeader } from "@/components/BrandHeader";
import Index from "./pages/Index";
import Embed from "./pages/Embed";
import Provider from "./pages/Provider";
import BAfoeg from "./pages/BAfoeg";
import Bildungsurlaub from "./pages/Bildungsurlaub";
import BildungsurlaubBundesland from "./pages/BildungsurlaubBundesland";

// Header wird auf allen Routes gerendert AUSSER /embed (dort embedded, ohne Header)
const HeaderGate = () => {
  const location = useLocation();
  if (location.pathname === "/embed") return null;
  return <BrandHeader />;
};

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <HeaderGate />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/anbieter" element={<Provider />} />
            <Route path="/bafoeg" element={<BAfoeg />} />
            <Route path="/bildungsurlaub" element={<Bildungsurlaub />} />
            <Route path="/bildungsurlaub/:slug" element={<BildungsurlaubBundesland />} />
            <Route path="/embed" element={<Embed />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
