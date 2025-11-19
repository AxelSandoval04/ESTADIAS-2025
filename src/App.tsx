import { useState, useEffect } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/HomePage";
import { AboutPage } from "./components/AboutPage";
import { ServicesPage } from "./components/ServicesPage";
import { ProjectsPage } from "./components/ProjectsPage";
import { ContactPage } from "./components/ContactPage";
import { LoginPage } from "./components/LoginPage";
import { ReviewsPage } from "./components/ReviewsPage";
import { AdminPanel } from "./components/AdminPanel";

import { ProfilePage } from "./components/ProfilePage";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>("home");

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;
      case "about":
        return <AboutPage />;
      case "services":
        return <ServicesPage onNavigate={handleNavigate} />;
      case "projects":
        return <ProjectsPage />;
      case "contact":
        return <ContactPage onNavigate={handleNavigate} />;
      case "login":
        return <LoginPage onNavigate={handleNavigate} />;
      case "reviews":
        return <ReviewsPage onNavigate={handleNavigate} />;
      case "admin":
        return <AdminPanel onNavigate={handleNavigate} />;
      case "profile":
        return <ProfilePage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
        <main className="flex-1">{renderPage()}</main>
        <Footer />
        <Toaster position="top-left" />
      </div>
    </AuthProvider>
  );
}