import { useState, useEffect } from 'react';
import { favoriteService } from '../services/favorite.service';
import { FavoriteItem } from '../types/favorite';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const data = await favoriteService.getMyFavorites();
      setFavorites(data);
    } catch (err: any) {
      setError('No se pudieron cargar tus favoritos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const isServiceFavorited = (serviceId: string) => {
    return favorites.some(fav => fav.serviceId === serviceId);
  };

  const toggleFavorite = async (serviceId: string) => {
    const isAlreadyFav = isServiceFavorited(serviceId);
    
    if (isAlreadyFav) {
      setFavorites(prev => prev.filter(f => f.serviceId !== serviceId));
    } else {
      setFavorites(prev => [...prev, { serviceId, service: { id: serviceId } } as any]);
    }

    try {
      await favoriteService.toggleFavorite(serviceId);
    } catch (err) {
      fetchFavorites(); 
    }
  };

  const removeFavorite = async (serviceId: string) => {
    setFavorites(prev => prev.filter(fav => fav.serviceId !== serviceId));
    try {
      await favoriteService.toggleFavorite(serviceId);
    } catch (err) {
      console.error('Error al quitar favorito, revirtiendo...');
      fetchFavorites();
    }
  };

  return { favorites, loading, error, removeFavorite, isServiceFavorited, toggleFavorite };
};