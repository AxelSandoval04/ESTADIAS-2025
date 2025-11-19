import { useEffect, useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { categoriesAPI, projectsAPI } from "../lib/api";
import {
  Folder,
  Factory,
  Building2,
  Home,
  Store,
  Cpu,
  Wrench,
  Flame,
  Battery,
  Hammer,
  Cable,
  Zap,
  PanelsTopLeft,
  Radio,
  Satellite,
  Server,
  CircuitBoard,
  HardHat,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  order?: number;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  images: string[];
  mainImage?: string;
  categoryId?: Category | string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export function ProjectsPage() {
  const [filter, setFilter] = useState<string>("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const iconMap: Record<string, any> = {
    Folder,
    Factory,
    Building2,
    Home,
    Store,
    Cpu,
    Wrench,
    Flame,
    Battery,
    Hammer,
    Cable,
    Zap,
    PanelsTopLeft,
    Radio,
    Satellite,
    Server,
    CircuitBoard,
    HardHat,
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, projRes] = await Promise.all([
          categoriesAPI.getAll(),
          projectsAPI.getAll(),
        ]);
        setCategories(catRes.data.filter((c: Category) => c.isActive));
        setProjects(projRes.data);
      } catch (error) {
        console.error("Error cargando datos de proyectos/categorías:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((p) => {
          const cat = p.categoryId as Category | undefined;
          return cat && (cat as any)._id === filter;
        });

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl mb-4">Nuestros Proyectos</h1>
            <p className="text-lg opacity-90">
              Descubre algunos de los proyectos más destacados que hemos realizado 
              para nuestros clientes en diversos sectores.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                filter === "all"
                  ? "bg-primary text-white shadow-lg"
                  : "bg-secondary text-muted-foreground hover:bg-primary/10"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Todos</span>
            </button>
            {categories
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.name.localeCompare(b.name))
              .map((cat) => {
                const IconComp = iconMap[cat.icon] || Folder;
                return (
                  <button
                    key={cat._id}
                    onClick={() => setFilter(cat._id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                      filter === cat._id
                        ? "bg-primary text-white shadow-lg"
                        : "bg-secondary text-muted-foreground hover:bg-primary/10"
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading && (
              <div className="col-span-full text-center text-muted-foreground">Cargando proyectos…</div>
            )}
            {!loading && filteredProjects.map((project) => (
              <Card
                key={project._id}
                className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  {project.mainImage || (project.images && project.images[0]) ? (
                    <ImageWithFallback
                      src={(() => {
                        const imgUrl = project.mainImage || project.images[0];
                        return imgUrl.startsWith('http') ? imgUrl : `http://localhost:4000${imgUrl}`;
                      })()}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">Sin imagen</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    {project.status && (
                      <Badge className="bg-accent text-accent-foreground mb-2 capitalize">
                        {project.status.replace('-', ' ')}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-primary group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>
                  {(project.categoryId as any)?.name && (
                    <p className="mt-3 text-xs flex items-center gap-2 text-muted-foreground">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {(() => {
                          const cat = project.categoryId as any;
                          const Icon = iconMap[cat.icon] || Folder;
                          return <Icon className="w-3 h-3" />;
                        })()}
                        {(project.categoryId as any).name}
                      </span>
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {!loading && filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No hay proyectos en esta categoría.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl text-primary mb-2">
                500+
              </div>
              <div className="text-sm text-muted-foreground">
                Proyectos Completados
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl text-primary mb-2">
                30+
              </div>
              <div className="text-sm text-muted-foreground">
                Años de Experiencia
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl text-primary mb-2">
                200+
              </div>
              <div className="text-sm text-muted-foreground">
                Clientes Satisfechos
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl text-primary mb-2">
                100%
              </div>
              <div className="text-sm text-muted-foreground">
                Cumplimiento
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}