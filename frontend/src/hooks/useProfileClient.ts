import { useState, useEffect } from 'react';
import { profileService } from '../services/profile.service';
import { UserProfile } from '../types/profile.types';

export const useProfileClient= () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (error) {
      console.error("Error cargando perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async (data: any) => {
    setUpdating(true);
    try {
      await profileService.updateProfile(data);
      await fetchProfile(); 
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Error al actualizar' };
    } finally {
      setUpdating(false);
    }
  };

  return { profile, loading, updating, updateProfile, refetch: fetchProfile };
};