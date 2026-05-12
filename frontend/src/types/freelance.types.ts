export interface ServiceStats {
  currentPlan: 'FREE' | 'PRO' | 'ELITE';
  totalServices: number;
  maxServices: number;
  canCreateMore: boolean;
}

export interface ServiceData {
  id: string;
  title: string;
  price: number;
  isPublished: boolean;
  categoryId?: string | null;
}

export interface PublicService {
  id: string;
  title: string;
  price: number;
  image: string | null;
  deliveryDays: number;
  categoryId: string | null;
}

export interface PublicFreelancerProfile {
  id: string;
  name: string | null;
  username: string | null;
  avatar: string | null;
  location: string | null;
  bio: string | null;
  professionalTitle: string | null;
  skills: string[];
  languages: any; 
  portfolioUrl: string | null;
  createdAt: string;
  services: PublicService[]; 
  completedOrders: number;
  reviewsCount: number;
  averageRating: number;
}