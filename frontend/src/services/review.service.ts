import { api } from '../config/axios';
import { getAuthHeader } from '../lib/auth';
import { CreateReviewPayload, ServiceReviewsResponse } from '../types/review.types';

export const reviewService = {
  getServiceReviews: async (serviceId: string): Promise<ServiceReviewsResponse> => {
    const response = await api.get(`/api/reviews/service/${serviceId}`);
    return response.data.data;
  },

  createReview: async (payload: CreateReviewPayload): Promise<void> => {
    await api.post('/api/reviews', payload, { headers: getAuthHeader() });
  }
};