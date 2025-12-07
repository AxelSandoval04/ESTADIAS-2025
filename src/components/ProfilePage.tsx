import { useState } from "react";
import { usersAPI } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { toast } from "sonner";


export function ProfilePage() {
    const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword && form.newPassword.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      if (localStorage.getItem('forceChangePassword') === 'true') {
        // Solo cambiar la contraseña, sin pedir la actual
        await usersAPI.updatePassword(form.newPassword);
        toast.success("Contraseña actualizada correctamente. Vuelve a iniciar sesión.");
        logout();
        localStorage.removeItem('forceChangePassword');
        navigate("/login");
      } else {
        await usersAPI.updateProfile({
          name: form.name,
          email: form.email,
          password: form.password,
          newPassword: form.newPassword,
        });
        toast.success("Perfil actualizado correctamente. Vuelve a iniciar sesión.");
        logout();
        localStorage.removeItem('forceChangePassword');
        navigate("/login");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-primary">Editar Perfil</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          {localStorage.getItem('forceChangePassword') === 'true' ? null : (
            <div>
              <Label htmlFor="password">Contraseña actual</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Solo si deseas cambiar datos"
              />
            </div>
          )}
          <div>
            <Label htmlFor="newPassword">Nueva contraseña</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="Dejar vacío si no cambia"
              minLength={6}
            />
            {form.newPassword && form.newPassword.length > 0 && form.newPassword.length < 6 && (
              <p className="text-xs text-red-600 mt-1">La nueva contraseña debe tener al menos 6 caracteres.</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
