import { useState, useEffect, useCallback } from 'react';
import { reviewService } from '../services/review.service';
import { Review, ReviewStats } from '../types/review.types';

export const useReviews = (serviceId: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ total: 0, average: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await reviewService.getServiceReviews(serviceId);
      setReviews(data.reviews);
      setStats(data.stats);
    } catch (err) {
      console.error('Error cargando reseñas:', err);
    } finally {
      setIsLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    if (serviceId) fetchReviews();
  }, [fetchReviews, serviceId]);

  const submitReview = async (rating: number, comment: string) => {
    setIsSubmitting(true);
    setError('');
    try {
      await reviewService.createReview({ serviceId, rating, comment });
      await fetchReviews(); 
      return true; 
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Error al enviar la reseña.';
      setError(errorMsg);
      return false; 
    } finally {
      setIsSubmitting(false);
    }
  };

  return { reviews, stats, isLoading, isSubmitting, error, submitReview };
};