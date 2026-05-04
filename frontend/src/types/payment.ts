export interface PaymentIntentResponse {
  success: boolean;
  data?: {
    clientSecret: string;
    orderId: string;
  };
  error?: string;
}

export interface CreateIntentDto {
  userId: string;
  serviceId: string;
}