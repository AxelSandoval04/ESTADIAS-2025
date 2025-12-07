import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { reviewsAPI } from "../lib/api";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Star, AlertCircle, MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "./ui/alert";



export function ReviewsPage() {
    const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    comment: "",
    rating: 5,
  });

  // Fetch approved reviews
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await reviewsAPI.getApproved();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para dejar una reseña");
      navigate("/login");
      return;
    }

    if (formData.comment.trim().length < 10) {
      toast.error("El comentario debe tener al menos 10 caracteres");
      return;
    }

    setSubmitting(true);

    try {
      await reviewsAPI.create({
        comment: formData.comment,
        rating: formData.rating,
      });

      toast.success("¡Reseña enviada! Será revisada por un administrador.");
      setFormData({ comment: "", rating: 5 });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al enviar la reseña");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            style={{
              fill: star <= rating ? '#fbbf24' : 'transparent',
              color: star <= rating ? '#fbbf24' : '#d1d5db',
              cursor: interactive ? 'pointer' : 'default'
            }}
            className={`w-5 h-5 ${interactive ? "hover:scale-110 transition-transform" : ""}`}
            onClick={() => interactive && setFormData({ ...formData, rating: star })}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: {
        icon: Clock,
        text: "Pendiente",
        color: "text-amber-600 bg-amber-50 border-amber-200",
      },
      approved: {
        icon: CheckCircle,
        text: "Aprobada",
        color: "text-green-600 bg-green-50 border-green-200",
      },
      rejected: {
        icon: XCircle,
        text: "Rechazada",
        color: "text-red-600 bg-red-50 border-red-200",
      },
    };

    const badge = badges[status as keyof typeof badges];
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl mb-4">Reseñas</h1>
            <p className="text-lg opacity-90">
              Comparte tu experiencia con nosotros y ayuda a otros clientes a conocer nuestros servicios.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Review Form */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl text-primary">Deja tu Reseña</h2>
                </div>

                {!isAuthenticated && (
                  <Alert className="mb-4 border-amber-500 bg-amber-50">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800 text-sm">
                      Debes{" "}
                      <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="underline font-semibold hover:text-amber-900"
                      >
                        iniciar sesión
                      </button>
                      {" "}para dejar una reseña.
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="rating">Calificación</Label>
                    <div className="mt-2">
                      {renderStars(formData.rating, true)}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="comment">Comentario</Label>
                    <Textarea
                      id="comment"
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      placeholder="Comparte tu experiencia..."
                      rows={6}
                      className="mt-2"
                      disabled={!isAuthenticated}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Mínimo 10 caracteres
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={!isAuthenticated || submitting}
                  >
                    {submitting ? "Enviando..." : "Enviar Reseña"}
                  </Button>

                  {isAuthenticated && (
                    <p className="text-xs text-muted-foreground text-center">
                      Tu reseña será revisada antes de publicarse
                    </p>
                  )}
                </form>
              </Card>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl md:text-3xl mb-8 text-primary">
                Lo que dicen nuestros clientes
              </h2>

              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-4">Cargando reseñas...</p>
                </div>
              ) : reviews.length === 0 ? (
                <Card className="p-12 text-center">
                  <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">
                    Aún no hay reseñas. ¡Sé el primero en compartir tu experiencia!
                  </p>
                </Card>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <Card key={review._id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-primary">
                            {review.createdBy.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString("es-MX", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
