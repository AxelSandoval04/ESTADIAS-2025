import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Zap, LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { UserMenu } from "./UserMenu";

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Inicio", path: "/" },
    { name: "Nosotros", path: "/about" },
    { name: "Servicios", path: "/services" },
    { name: "Proyectos", path: "/projects" },
    { name: "Reseñas", path: "/reviews" },
    { name: "Contacto", path: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-accent" fill="currentColor" />
            </div>
            <div>
              <div className="text-lg tracking-tight text-primary">
                ISIELECT
              </div>
              <div className="text-xs text-muted-foreground">
                S. de R.L.
              </div>
            </div>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`transition-colors ${
                  window.location.pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.name}
              </button>
            ))}
            <Button
              onClick={() => navigate("/contact")}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Solicitar Cotización
            </Button>
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/login")}
                className="gap-2"
              >
                <LogIn className="h-4 w-4" />
                Iniciar Sesión
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-primary" />
            ) : (
              <Menu className="w-6 h-6 text-primary" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-2 transition-colors ${
                    window.location.pathname === item.path
                      ? "text-primary bg-secondary"
                      : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <Button
                onClick={() => {
                  navigate("/contact");
                  setMobileMenuOpen(false);
                }}
                className="mx-4 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Solicitar Cotización
              </Button>
              <div className="mx-4 pt-4 border-t border-border">
                {isAuthenticated ? (
                  <UserMenu />
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    Iniciar Sesión
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}