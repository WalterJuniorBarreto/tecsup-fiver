import { useState, useEffect } from 'react';
import { orderService } from '../services/order.service';
import { getStoredUser } from '../lib/auth';

export const useOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    fetchOrders();
  }, []);

  return { 
    orders, 
    isLoading, 
    refetch: fetchOrders 
  };
};