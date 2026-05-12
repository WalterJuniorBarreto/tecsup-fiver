export interface FavoriteSeller {
  id: string;
  name: string | null;
  avatar: string | null;
}

export interface FavoriteCategory {
  id: string;
  name: string;
}

export interface FavoriteService {
  id: string;
  title: string;
  price: number;
  image: string | null;
  deliveryDays: number;
  seller: FavoriteSeller;
  category: FavoriteCategory | null;
}

export interface FavoriteItem {
  id: string;
  userId: string;
  serviceId: string;
  createdAt: string;
  service: FavoriteService;
}