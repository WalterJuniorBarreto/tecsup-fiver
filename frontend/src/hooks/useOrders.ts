import { useState, useEffect } from 'react';
import { orderService } from '../services/order.service';
import { getStoredUser } from '../lib/auth';

export const useOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Función para obtener la data (exportada por si necesitas recargar manualmente)
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const currentUser = getStoredUser();
      if (currentUser) {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error en useOrders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Se ejecuta automáticamente al montar el componente
  useEffect(() => {
    fetchOrders();
  }, []);

  return { 
    orders, 
    isLoading, 
    refetch: fetchOrders // 👈 Útil si necesitas recargar la lista después de alguna acción
  };
};