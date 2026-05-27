'use client';

import { useEffect, useState } from 'react';
import { Star, Loader2, MessageSquarePlus, AlertCircle } from 'lucide-react';
import { useReviews } from '../../hooks/useReviews';
export default function ReviewSection({ serviceId, hasPaid, initialOpenForm = false }: { serviceId: string, hasPaid: boolean, initialOpenForm?: boolean }) {
  const { reviews, stats, isLoading, isSubmitting, error, submitReview } = useReviews(serviceId);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (hasPaid && initialOpenForm) {
      setShowForm(true);
      window.setTimeout(() => {
        document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [hasPaid, initialOpenForm]);

  if (isLoading) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-[#00e676] w-8 h-8" /></div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitReview(rating, comment);
    if (success) {
      setComment('');
      setShowForm(false);
    }
  };

  return (
    <section id="reviews" className="bg-[#121214] border border-zinc-800 rounded-[2rem] p-8 md:p-10 scroll-mt-24">
      
      {/* CABECERA DE RESEÑAS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-zinc-800 pb-8">
        <div>
          <h2 className="text-2xl font-black text-white mb-1">Reseñas del servicio</h2>
          <p className="text-zinc-500 text-sm">Basado en clientes que han comprado este servicio</p>
        </div>
        <div className="flex flex-col items-end mt-4 md:mt-0">
          <div className="flex items-center gap-2">
            <Star className="w-8 h-8 text-[#00e676] fill-[#00e676]" />
            <span className="text-4xl font-black text-white">{stats.average.toFixed(1)}</span>
          </div>
          <span className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase mt-1">
            {stats.total} OPINIONES
          </span>
        </div>
      </div>

      {/* 🚀 BOTÓN CONDICIONAL: Solo si pagó y no está viendo el formulario */}
      {hasPaid && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-8 flex items-center gap-2 px-6 py-3 bg-[#0a0a0a] border border-zinc-800 text-white rounded-xl hover:border-[#00e676] hover:text-[#00e676] transition-all font-bold text-sm shadow-lg"
        >
          <MessageSquarePlus size={18} /> Escribir una reseña
        </button>
      )}

      {/* FORMULARIO DE RESEÑA */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-10 bg-[#0a0a0a] p-6 rounded-2xl border border-[#00e676]/30 shadow-[0_0_20px_rgba(0,230,118,0.05)] animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="font-bold text-white mb-4 text-lg">Cuéntanos tu experiencia</h3>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-500 text-sm font-medium">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          
          <div className="mb-6">
            <p className="text-sm text-zinc-400 mb-3 font-bold">¿Cuántas estrellas le das?</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-125 duration-200"
                >
                  <Star
                    size={32}
                    className={star <= rating ? "text-[#00e676] fill-[#00e676]" : "text-zinc-800 fill-zinc-800"}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <textarea
              placeholder="Escribe tu opinión aquí. ¡Ayuda a otros compradores!"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              className="w-full bg-[#121214] border border-zinc-800 rounded-xl p-4 text-sm text-white outline-none focus:border-[#00e676]/50 transition-colors min-h-[120px] resize-y"
            />
          </div>
          
          <div className="flex gap-3 justify-end border-t border-zinc-800 pt-4">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="px-6 py-2.5 bg-[#00e676] text-black rounded-xl font-bold text-sm hover:bg-emerald-400 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Publicar reseña'}
            </button>
          </div>
        </form>
      )}

      {/* LISTA DE RESEÑAS */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-zinc-800 rounded-2xl bg-[#0a0a0a]">
            <Star className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 font-medium">Aún no hay reseñas. ¡Sé el primero en opinar!</p>
          </div>
        ) : (
          reviews.map((review) => {
            const avatar = review.clientAvatar || `https://ui-avatars.com/api/?name=${review.clientName}&background=121214&color=00e676`;
            const date = new Date(review.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

            return (
              <div key={review._id} className="p-6 bg-[#0a0a0a] border border-zinc-800/60 rounded-2xl flex flex-col md:flex-row gap-6 hover:border-zinc-700 transition-colors">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 shrink-0 bg-[#121214] rounded-full flex items-center justify-center border border-zinc-800 overflow-hidden text-[#00e676] font-bold text-sm">
                     <img src={avatar} alt={review.clientName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm mb-0.5">{review.clientName}</h4>
                    <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mb-3">{date}</p>
                    <p className="text-zinc-300 text-sm leading-relaxed break-words">{review.comment}</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0 bg-[#121214] p-2 rounded-lg h-fit border border-zinc-800/50">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={14} className={star <= review.rating ? "text-[#00e676] fill-[#00e676]" : "text-zinc-800 fill-zinc-800"} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
