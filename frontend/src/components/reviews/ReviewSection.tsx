'use client';

import { useState } from 'react';
import { Star, Loader2, AlertCircle } from 'lucide-react';
import { useReviews } from '../../hooks/useReviews';
import { getStoredUser } from '../../lib/auth'; // O como obtengas tu usuario actual

interface ReviewSectionProps {
  serviceId: string;
}

export default function ReviewSection({ serviceId }: ReviewSectionProps) {
  const { reviews, stats, isLoading, isSubmitting, error, submitReview } = useReviews(serviceId);
  const currentUser = getStoredUser();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    const success = await submitReview(rating, comment);
    if (success) {
      setRating(0);
      setComment('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 text-[#00e676] animate-spin" /></div>;
  }

  return (
    <div className="mt-16 bg-[#0c0c0e] border border-zinc-800 rounded-[2rem] p-8">
      {/* 📊 CABECERA Y ESTADÍSTICAS */}
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-zinc-800/50">
        <div>
          <h2 className="text-3xl font-black text-white mb-2">Reseñas del servicio</h2>
          <p className="text-zinc-500 text-sm">Basado en clientes que han comprado este servicio</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end mb-1">
            <Star className="w-8 h-8 text-[#00e676] fill-[#00e676]" />
            <span className="text-4xl font-black text-white">{stats.average}</span>
          </div>
          <p className="text-zinc-500 text-sm font-bold tracking-widest uppercase">{stats.total} opiniones</p>
        </div>
      </div>

      {/* ✍️ FORMULARIO DE RESEÑA (Solo visible si es CLIENTE) */}
      {currentUser?.role === 'CLIENT' && (
        <form onSubmit={handleSubmit} className="mb-12 bg-[#121214] p-6 rounded-2xl border border-zinc-800">
          <h3 className="font-bold text-white mb-4">Deja tu opinión</h3>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          
          {showSuccess && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[#00e676] text-sm font-medium">
              ¡Gracias! Tu reseña ha sido publicada con éxito.
            </div>
          )}

          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoverRating || rating)
                      ? 'text-[#00e676] fill-[#00e676]'
                      : 'text-zinc-700'
                  }`}
                />
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="¿Qué te pareció el servicio? (Opcional)"
            className="w-full bg-[#0c0c0e] border border-zinc-800 rounded-xl p-4 text-sm text-white outline-none focus:border-[#00e676] transition-colors resize-none mb-4"
            rows={3}
          />

          <button
            type="submit"
            disabled={rating === 0 || isSubmitting}
            className="px-6 py-3 bg-[#00e676] text-black font-bold rounded-xl text-sm hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {isSubmitting ? 'Enviando...' : 'Publicar reseña'}
          </button>
        </form>
      )}

      {/* 📝 LISTA DE COMENTARIOS */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-10 text-zinc-500 italic">
            Aún no hay reseñas para este servicio.
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="p-6 bg-[#121214] border border-zinc-800 rounded-2xl flex gap-5">
              <img
                src={review.clientAvatar || `https://ui-avatars.com/api/?name=${review.clientName}&background=0c0c0e&color=00e676`}
                alt={review.clientName}
                className="w-12 h-12 rounded-full object-cover border-2 border-zinc-800 shrink-0"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-white text-lg">{review.clientName}</h4>
                    <p className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">
                      {new Date(review.createdAt).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-[#00e676] fill-[#00e676]' : 'text-zinc-800 fill-zinc-800'}`} />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-zinc-400 text-sm leading-relaxed mt-3">
                    "{review.comment}"
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}