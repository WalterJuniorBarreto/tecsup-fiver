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