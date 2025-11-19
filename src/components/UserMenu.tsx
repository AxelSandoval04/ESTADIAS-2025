import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { LogOut, Shield, User, ChevronDown, AlertTriangle } from "lucide-react";

interface UserMenuProps {
  onNavigate: (page: string) => void;
}

export function UserMenu({ onNavigate }: UserMenuProps) {
  const { user, logout, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const handleLogoutClick = () => {
    setIsOpen(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    onNavigate("home");
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleNavigateAdmin = () => {
    setIsOpen(false);
    onNavigate("admin");
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <User className="h-4 w-4" />
        {user.name}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            <div className="px-4 py-2 border-b">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            
            <button
              onClick={() => { setIsOpen(false); onNavigate('profile'); }}
              className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center"
            >
              <User className="mr-2 h-4 w-4" />
              Editar Perfil
            </button>

            {isAdmin && (
              <button
                onClick={handleNavigateAdmin}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Shield className="mr-2 h-4 w-4" />
                Panel de Administración
              </button>
            )}

            <button
              onClick={handleLogoutClick}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Logout */}
      {showLogoutConfirm && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={cancelLogout}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header con ícono */}
            <div className="flex flex-col items-center pt-8 pb-6 px-6 border-b">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <LogOut className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">¿Cerrar Sesión?</h3>
              <p className="text-center text-gray-600 text-sm">
                Tu sesión se cerrará y deberás iniciar sesión nuevamente
              </p>
            </div>
            
            {/* Botones */}
            <div className="p-8">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={cancelLogout}
                  className="h-14 px-6 rounded-lg border-2 border-gray-300 bg-white hover:bg-gray-50 font-bold text-gray-900 text-base transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmLogout}
                  className="h-14 px-6 rounded-lg border-2 border-red-300 bg-white hover:bg-red-50 font-bold text-gray-900 text-base transition-all"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
