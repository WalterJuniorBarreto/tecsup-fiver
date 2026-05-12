import { useState, useEffect } from 'react';
import { freelanceService } from '../services/freelance.service';
import { PublicFreelancerProfile } from '../types/freelance.types';

export const useFreelancer = (id: string | null) => {
  const [profile, setProfile] = useState<PublicFreelancerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await freelanceService.getPublicProfile(id);
        setProfile(data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'No se pudo cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  return { profile, loading, error };
};