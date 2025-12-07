import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<{ email?: boolean; password?: boolean }>({});
  const [loginAttempts, setLoginAttempts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldError({});

    try {
      if (isLogin) {
        const userData = await login(formData.email, formData.password);
        toast.success(`¡Bienvenido de vuelta, ${userData.name}! 👋`);
        setLoginAttempts(0);
        if (localStorage.getItem('forceChangePassword') === 'true') {
          toast.info('Por seguridad, debes cambiar tu contraseña.');
          navigate("/profile");
        } else {
          setTimeout(() => navigate("/"), 800);
        }
      } else {
        const userData = await register(formData.name, formData.email, formData.password);
        toast.success(`¡Cuenta creada exitosamente! Bienvenido a ISIELECT, ${userData.name}! 🎉`);
        setTimeout(() => navigate("/"), 800);
      }
    } catch (error: any) {
      let msg = error.message || "Error en la autenticación";
      if (isLogin) setLoginAttempts(attempts => attempts + 1);
      if (msg.toLowerCase().includes("credenciales inválidas") || msg.toLowerCase().includes("invalid credentials")) {
        setError("Correo o contraseña incorrectos. Por favor, verifica tus datos.");
        setFieldError({ email: true, password: true });
      } else if (msg.toLowerCase().includes("no está registrado") || msg.toLowerCase().includes("not found")) {
        setError("El correo no está registrado. Puedes crear una cuenta.");
        setFieldError({ email: true });
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Ingresa tus credenciales para continuar"
              : "Regístrate para solicitar cotizaciones y dejar reseñas"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 text-red-600 text-sm font-medium text-center">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre completo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required={!isLogin}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                autoComplete="username"
                className={fieldError.email ? "border-red-500 focus:border-red-500" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                autoComplete={isLogin ? "current-password" : "new-password"}
                className={fieldError.password ? "border-red-500 focus:border-red-500" : ""}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Cargando..." : isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </Button>
            {isLogin && (
              <div className="text-right mt-2">
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:underline"
                  onClick={() => navigate("/forgot-password")}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}
            {isLogin && loginAttempts >= 3 && (
              <div className="text-xs text-yellow-600 mt-2 text-center">
                ¿Problemas para iniciar sesión? <button className="underline" type="button" onClick={() => navigate("/forgot-password")}>Recupera tu contraseña aquí</button>.
              </div>
            )}
          </form>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setFieldError({});
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
