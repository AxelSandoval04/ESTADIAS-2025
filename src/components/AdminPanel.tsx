import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { projectsAPI, quotesAPI, reviewsAPI, categoriesAPI } from "../lib/api";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { 
  Briefcase, 
  MessageSquare, 
  Star,
  Folder,
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X,
  AlertCircle,
  ShieldAlert,
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
  HardHat
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "./ui/alert";

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
  categoryId?: { name: string; icon?: string; _id?: string } | string; // poblado o solo id
  category?: string; // fallback para datos antiguos
  mainImage?: string;
  images: string[];
  status?: string;
}

interface Quote {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'pending' | 'reviewed' | 'responded' | 'closed';
  response?: {
    message?: string;
    sentAt?: string;
    sentBy?: {
      name?: string;
      email?: string;
    }
  };
  createdAt: string;
}

interface Review {
  _id: string;
  createdBy: {
    name: string;
    email: string;
  };
  comment: string;
  rating: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export function AdminPanel() {
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("projects");

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "", icon: "Folder", order: 0 });
  const [showIconPicker, setShowIconPicker] = useState(false);


  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState<{title: string; description: string; categoryId: string; images: string; imageUrl: string}>({ 
    title: "", 
    description: "", 
    categoryId: "", 
    images: "", 
    imageUrl: "" 
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Quotes state
  const [quotes, setQuotes] = useState<Quote[]>([]);
  // Quotes reply state
  const [replyQuoteId, setReplyQuoteId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  // Delete dialog state for quotes
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  // Delete dialog state for reviews
  const [confirmDeleteReviewId, setConfirmDeleteReviewId] = useState<string | null>(null);
  // Delete dialog state for categories
  const [confirmDeleteCategoryId, setConfirmDeleteCategoryId] = useState<string | null>(null);
  // Delete dialog state for projects
  const [confirmDeleteProjectId, setConfirmDeleteProjectId] = useState<string | null>(null);
  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);

  // Redirigir si no está autenticado o no es admin
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para acceder al panel de administración");
      navigate("/login");
    } else if (!isAdmin) {
      toast.error("No tienes permisos para acceder al panel de administración");
      navigate("/home");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Fetch data on mount
  useEffect(() => {
    if (isAdmin) {
      console.log("Usuario es admin, cargando datos...");
      fetchCategories();
      fetchProjects();
      fetchQuotes();
      fetchReviews();
    } else {
      console.log("Usuario NO es admin. isAuthenticated:", isAuthenticated, "isAdmin:", isAdmin);
    }
  }, [isAdmin]);

  // Check if user is admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-4xl mx-auto py-20">
          <Alert className="border-red-500 bg-red-50">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-800">
              No tienes permisos para acceder a esta página. Solo los administradores pueden ver el panel de control.
            </AlertDescription>
          </Alert>
          <div className="text-center mt-6">
            <Button onClick={() => navigate("/home")}> 
              Volver al Inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Fetch functions
  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error: any) {
      console.error("Error al cargar categorías:", error.response?.status, error.response?.data);
      toast.error(error.response?.data?.error || "Error al cargar categorías");
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (error: any) {
      console.error("Error al cargar proyectos:", error.response?.status, error.response?.data);
      toast.error(error.response?.data?.error || "Error al cargar proyectos");
    }
  };

  const fetchQuotes = async () => {
    try {
      const response = await quotesAPI.getAll();
      setQuotes(response.data);
    } catch (error: any) {
      console.error("Error al cargar cotizaciones:", error.response?.status, error.response?.data);
      toast.error(error.response?.data?.error || "Error al cargar cotizaciones");
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getAllForAdmin();
      setReviews(response.data);
    } catch (error: any) {
      console.error("Error al cargar reseñas:", error.response?.status, error.response?.data);
      toast.error(error.response?.data?.error || "Error al cargar reseñas");
    }
  };

  // Reply to quote
  const handleQuoteRespond = async (id: string) => {
    if (!replyMessage.trim()) {
      toast.error("Escribe un mensaje de respuesta");
      return;
    }
    try {
      await quotesAPI.respond(id, replyMessage.trim());
      toast.success("Respuesta enviada");
      setReplyQuoteId(null);
      setReplyMessage("");
      fetchQuotes();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Error al responder cotización");
    }
  };

  // Category CRUD
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoriesAPI.update(editingCategory._id, categoryForm);
        toast.success("Categoría actualizada");
      } else {
        await categoriesAPI.create(categoryForm);
        toast.success("Categoría creada");
      }
  setCategoryForm({ name: "", description: "", icon: "Folder", order: 0 });
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      toast.error("Error al guardar categoría");
    }
  };

  const handleCategoryEdit = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({ 
      name: category.name, 
      description: category.description, 
      icon: category.icon,
      order: category.order ?? 0
    });
  };

  const handleCategoryDelete = async (id: string) => {
    setConfirmDeleteCategoryId(id);
  };

  // Icon options for categories (Lucide icon names)
  const iconOptions = [
    { name: 'Folder', component: Folder },
    { name: 'Factory', component: Factory },
    { name: 'Building2', component: Building2 },
    { name: 'Home', component: Home },
    { name: 'Store', component: Store },
    { name: 'Cpu', component: Cpu },
    { name: 'Wrench', component: Wrench },
    { name: 'Flame', component: Flame },
    { name: 'Battery', component: Battery },
    { name: 'Hammer', component: Hammer },
    { name: 'Cable', component: Cable },
    { name: 'Zap', component: Zap },
    { name: 'PanelsTopLeft', component: PanelsTopLeft },
    { name: 'Radio', component: Radio },
    { name: 'Satellite', component: Satellite },
    { name: 'Server', component: Server },
    { name: 'CircuitBoard', component: CircuitBoard },
    { name: 'HardHat', component: HardHat },
  ];

  // Project CRUD
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.categoryId) {
      toast.error('Selecciona una categoría');
      return;
    }
    try {
      const imagesArray = projectForm.images.split(',').map(i => i.trim()).filter(i => i);
      let payload: any;
      if (imageFile) {
        const fd = new FormData();
        fd.append('title', projectForm.title);
        fd.append('description', projectForm.description);
        fd.append('categoryId', projectForm.categoryId);
        imagesArray.forEach(img => fd.append('images', img));
        fd.append('image', imageFile);
        if (projectForm.imageUrl) fd.append('imageUrl', projectForm.imageUrl);
        payload = fd;
      } else {
        payload = {
          title: projectForm.title,
          description: projectForm.description,
          categoryId: projectForm.categoryId,
          images: imagesArray,
          imageUrl: projectForm.imageUrl || undefined
        };
      }
      if (editingProject) {
        await projectsAPI.update(editingProject._id, payload);
        toast.success('Proyecto actualizado');
      } else {
        await projectsAPI.create(payload);
        toast.success('Proyecto creado');
      }
      setProjectForm({ title: '', description: '', categoryId: '', images: '', imageUrl: '' });
      setImageFile(null);
      setEditingProject(null);
      fetchProjects();
    } catch (error:any) {
      toast.error(error.response?.data?.error || 'Error al guardar proyecto');
    }
  };

  const handleProjectEdit = (project: Project) => {
    setEditingProject(project);
    const catId = typeof project.categoryId === 'string'
      ? project.categoryId
      : (project.categoryId as any)?._id || '';
    setProjectForm({
      title: project.title,
      description: project.description,
      categoryId: catId || '',
      images: project.images?.join(', ') || '',
      imageUrl: project.mainImage || ''
    });
  };

  // Si no hay categoría seleccionada al cargar y existen categorías activas, seleccionar la primera.
  useEffect(() => {
    if (!editingProject && !projectForm.categoryId && categories.length) {
      const first = categories.filter(c => c.isActive).sort((a,b)=>(a.order??0)-(b.order??0))[0];
      if (first) setProjectForm(p => ({ ...p, categoryId: first._id }));
    }
  }, [categories, editingProject, projectForm.categoryId]);

  const handleProjectDelete = async (id: string) => {
    setConfirmDeleteProjectId(id);
  };

  // Review moderation
  const handleReviewModerate = async (id: string, status: "approved" | "rejected") => {
    try {
      await reviewsAPI.moderate(id, status);
      toast.success(`Reseña ${status === "approved" ? "aprobada" : "rechazada"}`);
      fetchReviews();
    } catch (error) {
      toast.error("Error al moderar reseña");
    }
  };

  const handleReviewDelete = async (id: string) => {
    setConfirmDeleteReviewId(id);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            style={{
              fill: star <= rating ? '#fbbf24' : 'transparent',
              color: star <= rating ? '#fbbf24' : '#d1d5db'
            }}
            className="w-4 h-4"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header mejorado */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
              <p className="text-blue-100">Gestiona todo el contenido de tu sitio desde aquí</p>
            </div>
            <Button 
              onClick={() => navigate("/home")}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Volver al Sitio
            </Button>
          </div>
        </div>
      </div>

      {/* Content mejorado con tarjetas estadísticas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-white hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("projects")}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Proyectos</p>
                <p className="text-3xl font-bold text-blue-600">{projects.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("quotes")}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Cotizaciones</p>
                <p className="text-3xl font-bold text-purple-600">{quotes.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("reviews")}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Reseñas</p>
                <p className="text-3xl font-bold text-amber-600">{reviews.length}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("categories")}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Categorías</p>
                <p className="text-3xl font-bold text-green-600">{categories.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Folder className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs de contenido */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-white border-b mb-6 p-0 h-auto rounded-none justify-start">
            <TabsTrigger 
              value="projects" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none px-6 py-3"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Proyectos
            </TabsTrigger>
            <TabsTrigger 
              value="quotes"
              className="data-[state=active]:border-b-2 data-[state=active]:border-purple-600 rounded-none px-6 py-3"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Cotizaciones
            </TabsTrigger>
            <TabsTrigger 
              value="reviews"
              className="data-[state=active]:border-b-2 data-[state=active]:border-amber-600 rounded-none px-6 py-3"
            >
              <Star className="w-4 h-4 mr-2" />
              Reseñas
            </TabsTrigger>
            <TabsTrigger 
              value="categories"
              className="data-[state=active]:border-b-2 data-[state=active]:border-green-600 rounded-none px-6 py-3"
            >
              <Folder className="w-4 h-4 mr-2" />
              Categorías
            </TabsTrigger>
          </TabsList>

            {/* PROJECTS TAB */}
            <TabsContent value="projects" className="space-y-6">
              {/* Project Form */}
              <Card className="p-6">
                <h2 className="text-xl mb-4 text-primary flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  {editingProject ? "Editar Proyecto" : "Nuevo Proyecto"}
                </h2>
                <form onSubmit={handleProjectSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="project-title">Título</Label>
                    <Input
                      id="project-title"
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      required
                      placeholder="Proyecto Residencial..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="project-description">Descripción</Label>
                    <Textarea
                      id="project-description"
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      required
                      placeholder="Descripción del proyecto..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="project-category">Categoría</Label>
                    <select
                      id="project-category"
                      value={projectForm.categoryId}
                      onChange={(e) => setProjectForm({ ...projectForm, categoryId: e.target.value })}
                      className="w-full border rounded-md px-3 py-2"
                      required
                    >
                      <option value="" disabled>Selecciona una categoría...</option>
                      {categories.filter(c => c.isActive).sort((a,b)=> (a.order??0)-(b.order??0)).map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="project-image-url">Imagen (URL opcional)</Label>
                      <Input
                        id="project-image-url"
                        type="url"
                        value={projectForm.imageUrl}
                        onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                        placeholder="https://imagen-principal.jpg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="project-image-file">Imagen (Archivo)</Label>
                      <Input
                        id="project-image-file"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                  {(projectForm.imageUrl || imageFile) && (
                    <div className="border rounded-md p-3 bg-gray-50 flex items-center gap-4">
                      <div className="text-xs text-muted-foreground">Vista previa:</div>
                      {imageFile ? (
                        <img src={URL.createObjectURL(imageFile)} alt="preview" className="h-20 w-28 object-cover rounded" />
                      ) : projectForm.imageUrl ? (
                        <img src={projectForm.imageUrl} alt="preview" className="h-20 w-28 object-cover rounded" />
                      ) : null}
                    </div>
                  )}
                  <div>
                    <Label htmlFor="project-images">URLs de Imágenes (separadas por comas)</Label>
                    <Textarea
                      id="project-images"
                      value={projectForm.images}
                      onChange={(e) => setProjectForm({ ...projectForm, images: e.target.value })}
                      placeholder="https://imagen1.jpg, https://imagen2.jpg"
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-accent hover:bg-accent/90">
                      {editingProject ? 'Actualizar' : 'Crear'} Proyecto
                    </Button>
                    {editingProject && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setEditingProject(null);
                          setProjectForm({ title: '', description: '', categoryId: '', images: '', imageUrl: '' });
                          setImageFile(null);
                        }}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </form>
              </Card>

              {/* Projects List */}
              <Card className="p-6">
                <h2 className="text-xl mb-4 text-primary">Proyectos Actuales</h2>
                <div className="space-y-3">
                  {projects.map((project) => (
                    <Card key={project._id} className="p-4 bg-secondary">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            {project.mainImage && (
                              <img 
                                src={project.mainImage.startsWith('http') ? project.mainImage : `http://localhost:4000${project.mainImage}`} 
                                alt={project.title} 
                                className="h-14 w-20 object-cover rounded border" 
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="font-semibold text-primary">{project.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {(() => {
                                  const label = typeof project.categoryId === 'string'
                                    ? project.categoryId
                                    : (project.categoryId as any)?.name || project.category || 'Sin categoría';
                                  return <>Categoría: {label} | Imágenes: {project.images?.length || 0}</>;
                                })()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleProjectEdit(project)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleProjectDelete(project._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* CATEGORIES TAB */}
            <TabsContent value="categories" className="space-y-6">
              {/* Category Form */}
              <Card className="p-6">
                <h2 className="text-xl mb-4 text-primary flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
                </h2>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="category-name">Nombre</Label>
                    <Input
                      id="category-name"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      required
                      placeholder="Residencial"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category-description">Descripción</Label>
                    <Textarea
                      id="category-description"
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      placeholder="Descripción de la categoría..."
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Icono</Label>
                    <div className="mt-2">
                      <Button type="button" variant="outline" onClick={() => setShowIconPicker(v => !v)} className="flex items-center gap-2">
                        {(() => { const iconDef = iconOptions.find(i => i.name === categoryForm.icon); if (iconDef) { const IconComp = iconDef.component; return <IconComp className="w-4 h-4" />; } return null; })()}
                        <span>{categoryForm.icon}</span>
                      </Button>
                    </div>
                    {showIconPicker && (
                      <div className="mt-3 grid grid-cols-6 gap-3 p-3 border rounded-lg bg-white max-h-56 overflow-y-auto">
                        {iconOptions.map(opt => {
                          const IconComp = opt.component;
                          return (
                            <button
                              type="button"
                              key={opt.name}
                              onClick={() => { setCategoryForm({ ...categoryForm, icon: opt.name }); setShowIconPicker(false); }}
                              className={`flex flex-col items-center gap-1 p-2 border rounded-md hover:bg-primary/5 transition text-xs ${categoryForm.icon === opt.name ? 'border-primary bg-primary/10' : 'border-border'}`}
                            >
                              <IconComp className="w-5 h-5" />
                              {opt.name}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="category-order">Orden</Label>
                    <Input
                      id="category-order"
                      type="number"
                      value={categoryForm.order}
                      onChange={(e) => setCategoryForm({ ...categoryForm, order: Number(e.target.value) })}
                      placeholder="0"
                      min={0}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Menor número aparece primero.</p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-accent hover:bg-accent/90">
                      {editingCategory ? "Actualizar" : "Crear"} Categoría
                    </Button>
                    {editingCategory && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setEditingCategory(null);
                          setCategoryForm({ name: "", description: "", icon: "Folder", order: 0 });
                        }}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </form>
              </Card>

              {/* Categories List */}
              <Card className="p-6">
                <h2 className="text-xl mb-4 text-primary">Categorías Actuales</h2>
                <div className="space-y-3">
                  {categories.filter(c => c.isActive).map((category) => (
                    <Card key={category._id} className="p-4 bg-secondary">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {(() => { const iconDef = iconOptions.find(i => i.name === category.icon); if (iconDef) { const IconComp = iconDef.component; return <IconComp className="w-4 h-4 text-primary" />; } return null; })()}
                            <h3 className="font-semibold text-primary">{category.name}</h3>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Orden {(category as any).order ?? 0}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">Icono: {category.icon}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCategoryEdit(category)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCategoryDelete(category._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* QUOTES TAB */}
            <TabsContent value="quotes" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl mb-4 text-primary">Cotizaciones Recibidas</h2>
                <div className="space-y-3">
                  {quotes.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No hay cotizaciones pendientes
                    </p>
                  ) : (
                    quotes.map((quote) => (
                      <Card key={quote._id} className="p-4 bg-white border shadow-sm">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm font-semibold text-primary">{quote.name}</p>
                            <p className="text-sm text-muted-foreground">{quote.email}</p>
                            {quote.phone && <p className="text-sm text-muted-foreground">{quote.phone}</p>}
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(quote.createdAt).toLocaleDateString("es-MX", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <div className="md:col-span-2 flex flex-col gap-2">
                            <p className="text-sm text-muted-foreground whitespace-pre-line">{quote.message}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`inline-block px-2 py-1 text-xs rounded ${
                                quote.status === "pending" 
                                  ? "bg-amber-100 text-amber-800" 
                                  : "bg-green-100 text-green-800"
                              }`}>
                                {quote.status === "pending" ? "Pendiente" : "Respondida"}
                              </span>
                              {quote.response?.sentAt && (
                                <span className="text-xs text-muted-foreground">
                                  Respondida el {new Date(quote.response.sentAt).toLocaleDateString("es-MX")}
                                </span>
                              )}
                              {quote.response?.sentBy?.name && (
                                <span className="text-xs text-muted-foreground">
                                  Por: {quote.response.sentBy.name}
                                </span>
                              )}
                            </div>
                            {quote.response?.message && (
                              <div className="mt-2 p-2 rounded bg-green-50 border border-green-200">
                                <p className="text-xs font-semibold text-green-700">Respuesta enviada:</p>
                                <p className="text-xs text-green-800 whitespace-pre-line">{quote.response.message}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2 flex-wrap">
                          {quote.status === 'pending' && (
                            <Button 
                              size="sm" 
                              onClick={() => {
                                setReplyQuoteId(prev => prev === quote._id ? null : quote._id);
                                setReplyMessage(prev => prev && replyQuoteId === quote._id ? prev : "");
                              }}
                              style={{
                                backgroundColor: '#9333ea',
                                color: 'white',
                                fontWeight: '600'
                              }}
                              className="hover:opacity-90"
                            >
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Responder
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setConfirmDeleteId(quote._id)}
                            style={{
                              borderColor: '#ef4444',
                              color: '#ef4444'
                            }}
                            className="hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                        {replyQuoteId === quote._id && (
                          <div className="mt-4 rounded-lg border border-purple-200 bg-white shadow-sm p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <Label htmlFor={`reply-${quote._id}`} className="text-sm font-semibold text-purple-700">
                                Respuesta para {quote.name}
                              </Label>
                              <span className="text-xs text-muted-foreground">{quote.email}</span>
                            </div>
                            <Textarea
                              id={`reply-${quote._id}`}
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                              placeholder="Escribe tu respuesta detallada..."
                              rows={4}
                              className="resize-none border-purple-300 focus:border-purple-500 focus:ring-purple-300/40 bg-purple-50"
                            />
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                size="sm"
                                onClick={() => handleQuoteRespond(quote._id)}
                                className="send-reply-btn inline-flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 text-sm font-medium rounded-md disabled:opacity-50"
                                disabled={!replyMessage.trim()}
                              >
                                <Check className="w-4 h-4" />
                                Enviar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setReplyQuoteId(null);
                                  setReplyMessage('');
                                }}
                                className="cancel-reply-btn px-4 py-1.5"
                              >
                                <X className="w-4 h-4" />
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        )}
                      </Card>
                    ))
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* REVIEWS TAB */}
            <TabsContent value="reviews" className="space-y-6">
              {/* Pendientes */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-primary">Reseñas Pendientes de Moderación</h2>
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                    {reviews.filter(r => r.status === 'pending').length} pendientes
                  </span>
                </div>
                <div className="space-y-4">
                  {reviews.filter(r => r.status === "pending").length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
                      <Check className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-muted-foreground">No hay reseñas pendientes de moderación</p>
                    </div>
                  ) : (
                    reviews.filter(r => r.status === "pending").map((review) => (
                      <Card key={review._id} className="p-5 bg-white border-l-4 border-l-amber-400 shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg text-primary">{review.createdBy.name}</h3>
                              <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                                Pendiente
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{review.createdBy.email}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(review.createdAt).toLocaleDateString("es-MX", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                              })}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {renderStars(review.rating)}
                            <span className="text-xs text-muted-foreground">{review.rating}/5 estrellas</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 mb-4 border">
                          <p className="text-sm text-gray-700 leading-relaxed italic">"{review.comment}"</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Button 
                            size="sm" 
                            onClick={() => handleReviewModerate(review._id, "approved")}
                            style={{ backgroundColor: '#16a34a', color: 'white' }}
                            className="hover:opacity-90"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Aprobar y Publicar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleReviewModerate(review._id, "rejected")}
                            style={{ borderColor: '#ef4444', color: '#ef4444' }}
                            className="hover:bg-red-50"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Rechazar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleReviewDelete(review._id)}
                            style={{ borderColor: '#6b7280', color: '#6b7280' }}
                            className="hover:bg-gray-100"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </Card>

              {/* Aprobadas */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-primary">Reseñas Aprobadas</h2>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {reviews.filter(r => r.status === 'approved').length} públicas
                  </span>
                </div>
                <div className="space-y-3">
                  {reviews.filter(r => r.status === 'approved').length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No hay reseñas aprobadas aún
                    </div>
                  ) : (
                    reviews.filter(r => r.status === 'approved').map((review) => (
                      <Card key={review._id} className="p-4 bg-green-50 border border-green-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-primary">{review.createdBy.name}</h3>
                              <span className="text-xs px-2 py-0.5 bg-green-200 text-green-800 rounded-full">
                                Pública
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(review.createdAt).toLocaleDateString("es-MX")}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            {renderStars(review.rating)}
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleReviewDelete(review._id)}
                              style={{ borderColor: '#ef4444', color: '#ef4444' }}
                              className="hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
                      </Card>
                    ))
                  )}
                </div>
              </Card>

              {/* Rechazadas */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-primary">Reseñas Rechazadas</h2>
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    {reviews.filter(r => r.status === 'rejected').length} rechazadas
                  </span>
                </div>
                <div className="space-y-3">
                  {reviews.filter(r => r.status === 'rejected').length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No hay reseñas rechazadas
                    </div>
                  ) : (
                    reviews.filter(r => r.status === 'rejected').map((review) => (
                      <Card key={review._id} className="p-4 bg-red-50 border border-red-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-primary">{review.createdBy.name}</h3>
                              <span className="text-xs px-2 py-0.5 bg-red-200 text-red-800 rounded-full">
                                Rechazada
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(review.createdAt).toLocaleDateString("es-MX")}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            {renderStars(review.rating)}
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                onClick={() => handleReviewModerate(review._id, "approved")}
                                style={{ backgroundColor: '#16a34a', color: 'white' }}
                                className="hover:opacity-90"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleReviewDelete(review._id)}
                                style={{ borderColor: '#6b7280', color: '#6b7280' }}
                                className="hover:bg-gray-100"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mt-2">{review.comment}</p>
                      </Card>
                    ))
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Confirm Delete Quote Dialog */}
  <Dialog open={!!confirmDeleteId} onOpenChange={(open: boolean) => !open && setConfirmDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle style={{ color: '#dc2626', fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Eliminar cotización
              </DialogTitle>
              <DialogDescription style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.5' }}>
                ¿Estás seguro? Esta acción es permanente y no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter style={{ gap: '0.75rem', marginTop: '1rem' }}>
              <Button 
                variant="outline" 
                onClick={() => setConfirmDeleteId(null)}
                style={{ 
                  paddingLeft: '1.5rem', 
                  paddingRight: '1.5rem',
                  fontWeight: '500'
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={async () => {
                  if (!confirmDeleteId) return;
                  try {
                    await quotesAPI.delete(confirmDeleteId);
                    toast.success('Cotización eliminada');
                    setConfirmDeleteId(null);
                    fetchQuotes();
                  } catch (err:any) {
                    toast.error(err.response?.data?.error || 'Error al eliminar');
                  }
                }}
                style={{ 
                  backgroundColor: '#dc2626',
                  color: 'white',
                  paddingLeft: '1.5rem',
                  paddingRight: '1.5rem',
                  fontWeight: '600'
                }}
                className="hover:opacity-90"
              >
                Eliminar definitivamente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirm Delete Review Dialog */}
  <Dialog open={!!confirmDeleteReviewId} onOpenChange={(open: boolean) => !open && setConfirmDeleteReviewId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle style={{ color: '#dc2626', fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Eliminar reseña
              </DialogTitle>
              <DialogDescription style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.5' }}>
                ¿Estás seguro? Esta acción es permanente y no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter style={{ gap: '0.75rem', marginTop: '1rem' }}>
              <Button 
                variant="outline" 
                onClick={() => setConfirmDeleteReviewId(null)}
                style={{ 
                  paddingLeft: '1.5rem', 
                  paddingRight: '1.5rem',
                  fontWeight: '500'
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={async () => {
                  if (!confirmDeleteReviewId) return;
                  try {
                    await reviewsAPI.delete(confirmDeleteReviewId);
                    toast.success('Reseña eliminada');
                    setConfirmDeleteReviewId(null);
                    fetchReviews();
                  } catch (err:any) {
                    toast.error(err.response?.data?.error || 'Error al eliminar');
                  }
                }}
                style={{ 
                  backgroundColor: '#dc2626',
                  color: 'white',
                  paddingLeft: '1.5rem',
                  paddingRight: '1.5rem',
                  fontWeight: '600'
                }}
                className="hover:opacity-90"
              >
                Eliminar definitivamente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirm Delete/Deactivate Category Dialog */}
  <Dialog open={!!confirmDeleteCategoryId} onOpenChange={(open: boolean) => !open && setConfirmDeleteCategoryId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle style={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Desactivar categoría
              </DialogTitle>
              <DialogDescription style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.5' }}>
                ¿Estás seguro de desactivar esta categoría? Dejará de aparecer en los filtros públicos, pero los proyectos asociados se mantendrán.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter style={{ gap: '0.75rem', marginTop: '1rem' }}>
              <Button 
                variant="outline" 
                onClick={() => setConfirmDeleteCategoryId(null)}
                style={{ 
                  paddingLeft: '1.5rem', 
                  paddingRight: '1.5rem',
                  fontWeight: '500'
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={async () => {
                  if (!confirmDeleteCategoryId) return;
                  try {
                    await categoriesAPI.deactivate(confirmDeleteCategoryId);
                    toast.success('Categoría desactivada');
                    setConfirmDeleteCategoryId(null);
                    fetchCategories();
                  } catch (err:any) {
                    toast.error(err.response?.data?.error || 'Error al desactivar');
                  }
                }}
                style={{ 
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  paddingLeft: '1.5rem',
                  paddingRight: '1.5rem',
                  fontWeight: '600'
                }}
                className="hover:opacity-90"
              >
                Desactivar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirm Delete Project Dialog */}
  <Dialog open={!!confirmDeleteProjectId} onOpenChange={(open: boolean) => !open && setConfirmDeleteProjectId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle style={{ color: '#dc2626', fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Eliminar proyecto
              </DialogTitle>
              <DialogDescription style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.5' }}>
                ¿Estás seguro? Esta acción desactivará el proyecto y dejará de mostrarse en la página pública.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter style={{ gap: '0.75rem', marginTop: '1rem' }}>
              <Button 
                variant="outline" 
                onClick={() => setConfirmDeleteProjectId(null)}
                style={{ 
                  paddingLeft: '1.5rem', 
                  paddingRight: '1.5rem',
                  fontWeight: '500'
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={async () => {
                  if (!confirmDeleteProjectId) return;
                  try {
                    await projectsAPI.delete(confirmDeleteProjectId);
                    toast.success('Proyecto eliminado');
                    setConfirmDeleteProjectId(null);
                    fetchProjects();
                  } catch (err:any) {
                    toast.error(err.response?.data?.error || 'Error al eliminar');
                  }
                }}
                style={{ 
                  backgroundColor: '#dc2626',
                  color: 'white',
                  paddingLeft: '1.5rem',
                  paddingRight: '1.5rem',
                  fontWeight: '600'
                }}
                className="hover:opacity-90"
              >
                Eliminar definitivamente
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
}
