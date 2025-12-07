import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  Zap,
  Building2,
  Cable,
  Lightbulb,
  LineChart,
  Wrench,
  CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ServicesPage() {
  const navigate = useNavigate();
  const services = [
    {
      icon: Zap,
      title: "Diseño de Sistemas Eléctricos",
      description:
        "Desarrollamos proyectos eléctricos completos desde la conceptualización hasta los planos ejecutivos, cumpliendo con las normas NOM y NEC.",
      features: [
        "Cálculos de cargas y demandas",
        "Diseño de sistemas de iluminación",
        "Planos ejecutivos y diagramas unifilares",
        "Especificaciones técnicas de equipos",
      ],
      image: "https://images.unsplash.com/photo-1729551610640-e8adee1172e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBibHVlcHJpbnQlMjBlbmdpbmVlcmluZ3xlbnwxfHx8fDE3NTk3MzA0NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      icon: Building2,
      title: "Instalación de Subestaciones",
      description:
        "Instalación completa de subestaciones eléctricas de distribución, transformación y maniobra para proyectos industriales y comerciales.",
      features: [
        "Subestaciones tipo pedestal",
        "Subestaciones tipo compacto",
        "Tableros de medición CFE",
        "Sistemas de protección y control",
      ],
      image: "https://images.unsplash.com/photo-1744113511604-235e7010981f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwZWxlY3RyaWNhbCUyMHN1YnN0YXRpb24lMjBwb3dlcnxlbnwxfHx8fDE3NTk3MzA0NDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      icon: Cable,
      title: "Líneas de Media y Alta Tensión",
      description:
        "Construcción e instalación de líneas de transmisión y distribución eléctrica en media y alta tensión, cumpliendo con normas CFE.",
      features: [
        "Líneas aéreas y subterráneas",
        "Tendido de cable de potencia",
        "Instalación de postes y estructuras",
        "Pruebas y puesta en servicio",
      ],
      image: "https://images.unsplash.com/photo-1667730874046-6d7dfc97242c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwdm9sdGFnZSUyMHBvd2VyJTIwbGluZXN8ZW58MXx8fHwxNzU5NzMwNDQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      icon: Lightbulb,
      title: "Sistemas de Iluminación",
      description:
        "Diseño e instalación de sistemas de iluminación interior y exterior eficientes y de alta calidad para espacios industriales, comerciales y públicos.",
      features: [
        "Iluminación LED de bajo consumo",
        "Iluminación arquitectónica",
        "Iluminación deportiva y de áreas públicas",
        "Sistemas de control y automatización",
      ],
      image: "https://images.unsplash.com/photo-1753272691001-4d68806ac590?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwbGlnaHRpbmclMjBzeXN0ZW1zfGVufDF8fHx8MTc1OTczMDQ0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      icon: Wrench,
      title: "Mantenimiento Eléctrico",
      description:
        "Servicios de mantenimiento preventivo y correctivo para garantizar la operación continua y segura de instalaciones eléctricas.",
      features: [
        "Mantenimiento preventivo programado",
        "Mantenimiento correctivo de emergencia",
        "Termografía infrarroja",
        "Pruebas de equipos y protecciones",
      ],
      image: "https://images.unsplash.com/photo-1558054665-fbe00cd7d920?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2FsJTIwY29udHJvbCUyMHBhbmVsfGVufDF8fHx8MTc1OTczMDQ1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      icon: LineChart,
      title: "Consultoría y Supervisión",
      description:
        "Asesoría técnica especializada y supervisión de proyectos eléctricos para garantizar el cumplimiento de normas y especificaciones.",
      features: [
        "Estudios de factibilidad eléctrica",
        "Auditorías energéticas",
        "Supervisión de obra",
        "Gestión de proyectos eléctricos",
      ],
      image: "https://images.unsplash.com/photo-1564164494009-3876b2d197f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2FsJTIwaW5zdGFsbGF0aW9uJTIwY29tbWVyY2lhbCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc1OTczMDQ0OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl mb-4">Nuestros Servicios</h1>
            <p className="text-lg opacity-90">
              Soluciones integrales en ingeniería eléctrica para proyectos industriales, 
              comerciales y residenciales con los más altos estándares de calidad.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    !isEven ? "lg:flex-row-reverse" : ""
                  }`}
                  onClick={() => navigate("/contact")}
                  style={{ cursor: "pointer" }}
                >
                  <div className={isEven ? "lg:order-1" : "lg:order-2"}>
                    <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl mb-4 text-primary">
                      {service.title}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {service.description}
                    </p>
                    <div className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={isEven ? "lg:order-2" : "lg:order-1"}>
                    <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl group">
                      <ImageWithFallback
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl mb-4 text-primary">
            ¿Necesitas un servicio específico?
          </h2>
          <p className="text-muted-foreground mb-8">
            Contáctanos para discutir tus necesidades y obtener una cotización personalizada
          </p>
          <Button
            onClick={() => navigate("/contact")}
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Solicitar Cotización
          </Button>
        </div>
      </section>
    </div>
  );
}