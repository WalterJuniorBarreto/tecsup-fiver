export interface Review {
  _id: string;
  serviceId: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ReviewStats {
  total: number;
  average: number;
}

export interface ServiceReviewsResponse {
  stats: ReviewStats;
  reviews: Review[];
}

export interface CreateReviewPayload {
  serviceId: string;
  rating: number;
  comment?: string;
}