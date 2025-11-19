import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card } from "./ui/card";
import { Target, Eye, Shield, Award, Users, TrendingUp } from "lucide-react";

export function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Confiabilidad",
      description: "Cumplimos con los más altos estándares de calidad y seguridad en cada proyecto.",
    },
    {
      icon: Award,
      title: "Excelencia",
      description: "Buscamos la perfección en cada detalle de nuestro trabajo.",
    },
    {
      icon: Users,
      title: "Compromiso",
      description: "Trabajamos de la mano con nuestros clientes para superar sus expectativas.",
    },
    {
      icon: TrendingUp,
      title: "Innovación",
      description: "Implementamos las últimas tecnologías y mejores prácticas del sector.",
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl mb-4">Nosotros</h1>
            <p className="text-lg opacity-90">
              Conoce la historia, misión y valores que nos han convertido en líderes 
              en ingeniería y construcción eléctrica en Durango, México.
            </p>
          </div>
        </div>
      </section>

      {/* Company History */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://res.cloudinary.com/djxicuowl/image/upload/v1763362437/Captura_de_pantalla_2025-11-17_005334_pgri9j.png"
                alt="Team of engineers"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="inline-block px-4 py-2 bg-accent/10 text-primary rounded-full mb-4">
                <span className="text-sm">Nuestra Historia</span>
              </div>
              <h2 className="text-3xl md:text-4xl mb-6 text-primary">
                Fundada en 1995
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  ISIELECT, S. de R.L. fue fundada en 1995 por el Ingeniero Gerardo Barrientos 
                  con la visión de proporcionar servicios de ingeniería eléctrica de la más alta 
                  calidad en el estado de Durango y México.
                </p>
                <p>
                  A lo largo de más de tres décadas, hemos crecido desde una pequeña empresa 
                  familiar hasta convertirnos en uno de los principales contratistas eléctricos 
                  de la región, manteniendo siempre nuestro compromiso con la excelencia y la 
                  satisfacción del cliente.
                </p>
                <p>
                  Contamos con la certificación de Contratista Confiable otorgada por la 
                  Comisión Federal de Electricidad (CFE), lo que respalda nuestra experiencia, 
                  capacidad técnica y cumplimiento de los más altos estándares de calidad.
                </p>
                <p>
                  Hoy en día, ISIELECT es sinónimo de confianza, profesionalismo y resultados 
                  en proyectos eléctricos industriales, comerciales y residenciales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 border-2 hover:border-accent transition-colors">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-2xl md:text-3xl mb-4 text-primary">
                Misión
              </h2>
              <p className="text-muted-foreground">
                Proporcionar soluciones integrales en ingeniería y construcción eléctrica 
                que superen las expectativas de nuestros clientes, garantizando calidad, 
                seguridad y eficiencia en cada proyecto. Nos comprometemos a ser el socio 
                confiable que impulse el desarrollo y progreso de nuestros clientes y 
                comunidades.
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-accent transition-colors">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-2xl md:text-3xl mb-4 text-primary">
                Visión
              </h2>
              <p className="text-muted-foreground">
                Ser reconocidos como la empresa líder en ingeniería y construcción eléctrica 
                en el norte de México, destacando por nuestra innovación, excelencia técnica 
                y compromiso con la sostenibilidad. Aspiramos a expandir nuestros servicios 
                y establecer nuevos estándares de calidad en la industria eléctrica.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-primary">
              Nuestros Valores
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Los principios que guían cada decisión y acción en ISIELECT
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={index}
                  className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="mb-3 text-primary">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">
              Certificaciones y Reconocimientos
            </h2>
            <p className="text-lg opacity-90">
              Nuestro compromiso con la calidad está respaldado por certificaciones oficiales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card className="p-8 text-center bg-white">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <h3 className="mb-2 text-primary">
                Contratista Confiable
              </h3>
              <p className="text-sm text-muted-foreground">
                Certificado por la Comisión Federal de Electricidad (CFE)
              </p>
            </Card>

            <Card className="p-8 text-center bg-white">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-4 mx-auto">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h3 className="mb-2 text-primary">
                Personal Certificado
              </h3>
              <p className="text-sm text-muted-foreground">
                Ingenieros y técnicos con certificaciones vigentes
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}