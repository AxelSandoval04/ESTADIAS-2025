import { MapPin, Phone, Mail, Zap, Facebook, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" fill="currentColor" />
              </div>
              <div>
                <div className="text-lg tracking-tight">
                  ISIELECT
                </div>
                <div className="text-xs opacity-80">
                  S. de R.L.
                </div>
              </div>
            </div>
            <p className="text-sm opacity-90 mb-4 max-w-md">
              Ingeniería y construcción eléctrica de calidad. Con más de 30 años de experiencia, 
              brindamos soluciones confiables en diseño, instalación y mantenimiento de sistemas eléctricos.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent hover:text-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-accent hover:text-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-accent">Contacto</h3>
            <div className="space-y-3 text-sm opacity-90">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <div>+52 (618) 112-8568</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>Isieldgo@hotmail.com</div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>Durango, Dgo., México</div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-accent">Enlaces Rápidos</h3>
            <div className="space-y-2 text-sm opacity-90">
              <div>
                <a href="#" className="hover:text-accent transition-colors">
                  Inicio
                </a>
              </div>
              <div>
                <a href="#" className="hover:text-accent transition-colors">
                  Servicios
                </a>
              </div>
              <div>
                <a href="#" className="hover:text-accent transition-colors">
                  Proyectos
                </a>
              </div>
              <div>
                <a href="#" className="hover:text-accent transition-colors">
                  Contacto
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm opacity-80">
          <p>
            © {new Date().getFullYear()} ISIELECT, S. de R.L. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}