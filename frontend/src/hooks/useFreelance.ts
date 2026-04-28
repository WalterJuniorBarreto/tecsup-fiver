import { useState, useEffect, useCallback } from 'react';
import { freelanceService } from '../services/freelance.service';
import { ServiceData, ServiceStats } from '../types/freelance.types';

export const useFreelance = () => {
  const [stats, setStats] = useState<ServiceStats | null>(null);
  const [services, setServices] = useState<ServiceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsData, servicesData] = await Promise.all([
        freelanceService.getStats(),
        freelanceService.getMyServices()
      ]);
      setStats(statsData);
      setServices(servicesData);
    } catch (error) {
      console.error("Error cargando el dashboard de freelance:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const removeService = async (serviceId: string) => {
    try {
      await freelanceService.deleteService(serviceId);
      await loadData(); 
    } catch (error) {
      console.error("Error interno eliminando servicio:", error);
      throw error; 
    }
  };

  const progressPercentage = stats 
    ? Math.min((stats.totalServices / stats.maxServices) * 100, 100) 
    : 0;

    const editService = async (serviceId: string, data: Partial<ServiceData>) => {
    try {
      await freelanceService.updateService(serviceId, data);
      await loadData(); 
    } catch (error) {
      console.error("Error interno editando servicio:", error);
      throw error;
    }
  };

  return {
    stats,
    services,
    isLoading,
    progressPercentage,
    refreshData: loadData,
    removeService ,
    editService
  };
};