import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { quotesAPI } from "../lib/api";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { MapPin, Phone, Mail, Clock, MessageSquare, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "./ui/alert";

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const { isAuthenticated, user } = useAuth();
  const mapsPlaceUrl =
    "https://www.google.com/maps/search/?api=1&query=Nuevo%20M%C3%A9xico%20506%2C%20Universal%2C%2034165%20Durango%2C%20Dgo.";
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para solicitar una cotización");
      onNavigate("login");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await quotesAPI.create({
        phone: formData.phone,
        message: formData.message,
      });
      
      toast.success("¡Cotización enviada correctamente! Nos pondremos en contacto pronto.");
      setFormData({ 
        name: user?.name || "", 
        email: user?.email || "", 
        phone: "", 
        message: "" 
      });
      
      // Redirigir al home después de 1.5 segundos
      setTimeout(() => {
        onNavigate("home");
      }, 1500);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al enviar la cotización");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Teléfono",
      details: ["+52 (618) 112-8568"],
    },
    {
      icon: Mail,
      title: "Email",
      details: ["Isieldgo@hotmail.com",],
    },
    {
      icon: MapPin,
      title: "Dirección",
      details: ["Nuevo México 506, Universal", "Durango, Dgo. 34165"],
    },
    {
      icon: Clock,
      title: "Horario",
      details: ["Lunes a Viernes: 8:00 AM - 1:00 PM", "Sábado: 8:00 AM - 2:00 PM"],
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl mb-4">Contacto</h1>
            <p className="text-lg opacity-90">
              ¿Tienes un proyecto en mente? Contáctanos y con gusto te ayudaremos 
              a encontrar la mejor solución eléctrica para tus necesidades.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl md:text-3xl mb-6 text-primary">
                Información de Contacto
              </h2>
              <div className="space-y-6">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Card key={index} className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="mb-2 text-primary">{item.title}</h3>
                          {item.details.map((detail, detailIndex) => (
                            <p
                              key={detailIndex}
                              className="text-sm text-muted-foreground"
                            >
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* WhatsApp Button */}
              <Card className="p-6 mt-6 bg-[#25D366] text-white border-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-[#25D366]" />
                  </div>
                  <div>
                    <h3 className="mb-1">WhatsApp</h3>
                    <p className="text-sm opacity-90">
                      Contáctanos directamente
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full mt-4 bg-white text-[#25D366] hover:bg-white/90"
                  onClick={() => window.open("https://wa.me/526181234567", "_blank")}
                >
                  Enviar Mensaje
                </Button>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h2 className="text-2xl md:text-3xl mb-6 text-primary">
                  Solicitar Cotización
                </h2>
                
                {!isAuthenticated && (
                  <Alert className="mb-6 border-amber-500 bg-amber-50">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      Debes{" "}
                      <button
                        type="button"
                        onClick={() => onNavigate("login")}
                        className="underline font-semibold hover:text-amber-900"
                      >
                        iniciar sesión
                      </button>
                      {" "}para solicitar una cotización.
                    </AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Tu nombre completo"
                      className="mt-2"
                      readOnly={isAuthenticated}
                      disabled={isAuthenticated}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="tu@email.com"
                        className="mt-2"
                        readOnly={isAuthenticated}
                        disabled={isAuthenticated}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+52 618 112-8568"
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Mensaje</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Describe tu proyecto o consulta..."
                      rows={6}
                      className="mt-2"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={!isAuthenticated || isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Solicitar Cotización"}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl mb-4 text-primary">
              Ubicación
            </h2>
            <p className="text-muted-foreground">
              Visítanos en nuestras oficinas en Durango
            </p>
          </div>

          <Card className="overflow-hidden">
            <div className="relative h-[450px] bg-muted">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d270.8772112933726!2d-104.64856775453976!3d24.014315932462132!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x869bb7fab503af21%3A0x6519c98a0fd294c4!2sISIEL%20S.A.%20DE%20C.V.!5e0!3m2!1ses-419!2smx!4v1763287897676!5m2!1ses-419!2smx"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="ISIELECT Location"
              ></iframe>
            </div>
            <div className="p-4 border-t bg-background/60 flex items-center justify-between flex-wrap gap-3">
              <p className="text-sm text-muted-foreground">Ubicación exacta en Google Maps</p>
              <Button
                variant="outline"
                onClick={() => window.open(mapsPlaceUrl, "_blank")}
              >
                Abrir en Google Maps
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}