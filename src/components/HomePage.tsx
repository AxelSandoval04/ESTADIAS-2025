import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Zap, Lightbulb, Settings, LineChart, Award, Shield } from "lucide-react";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const services = [
    {
      icon: Zap,
      title: "Diseño",
      description: "Diseño de sistemas eléctricos industriales y comerciales con tecnología de punta.",
    },
    {
      icon: Settings,
      title: "Instalación",
      description: "Instalación profesional de subestaciones, líneas y sistemas de distribución.",
    },
    {
      icon: Lightbulb,
      title: "Mantenimiento",
      description: "Mantenimiento preventivo y correctivo para asegurar la continuidad operativa.",
    },
    {
      icon: LineChart,
      title: "Consultoría",
      description: "Asesoría especializada y supervisión de proyectos eléctricos complejos.",
    },
  ];

  const certifications = [
    {
      icon: Shield,
      title: "Contratista Confiable CFE",
      description: "Certificado por la Comisión Federal de Electricidad",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://res.cloudinary.com/djxicuowl/image/upload/v1763363059/Captura_de_pantalla_2025-11-17_010357_c5imrj.png"
            alt="Industrial electrical works"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/80"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6">
            Impulsando el progreso con soluciones eléctricas confiables
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Más de 30 años de experiencia en ingeniería y construcción eléctrica en México
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => onNavigate("contact")}
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Solicitar Cotización
            </Button>
            <Button
              onClick={() => onNavigate("about")}
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-primary bg-transparent"
            >
              Conocer Más
            </Button>
          </div>
        </div>
      </section>

      {/* Services Cards */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-primary">
              Nuestros Servicios
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Soluciones integrales en ingeniería eléctrica para proyectos industriales, comerciales y residenciales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={index}
                  className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 hover:border-accent"
                >
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-primary">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </Card>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Button
              onClick={() => onNavigate("services")}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              Ver Todos los Servicios
            </Button>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-accent/10 text-accent-foreground rounded-full mb-4">
                <span className="text-sm">Desde 1995</span>
              </div>
              <h2 className="text-3xl md:text-4xl mb-6 text-primary">
                30+ años de experiencia
              </h2>
              <p className="text-muted-foreground mb-6">
                Fundada por el Ing. Gerardo Barrientos en 1995, ISIELECT se ha consolidado como 
                una empresa líder en ingeniería y construcción eléctrica en Durango, México. 
                Contamos con la certificación de Contratista Confiable otorgada por la CFE.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certifications.map((cert, index) => {
                  const Icon = cert.icon;
                  return (
                    <div key={index} className="flex gap-3">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <div className="text-sm text-primary">{cert.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {cert.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://res.cloudinary.com/djxicuowl/image/upload/v1763362979/Captura_de_pantalla_2025-11-17_010228_cdajo1.png"
                  alt="Electrical engineers at work"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-accent rounded-2xl flex items-center justify-center shadow-xl">
                <div className="text-center text-primary">
                  <div className="text-4xl">500+</div>
                  <div className="text-sm">Proyectos</div>
                  <div className="text-sm">Completados</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl mb-6">
            ¿Listo para iniciar tu proyecto?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Contáctanos hoy y descubre cómo podemos ayudarte a alcanzar tus objetivos
          </p>
          <Button
            onClick={() => onNavigate("contact")}
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Contáctanos Ahora
          </Button>
        </div>
      </section>
    </div>
  );
}