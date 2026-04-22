import { useState, useEffect } from 'react';
import { profileService } from '../services/profile.service';
import { UserProfile, LanguageLevel } from '../types/profile.types';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');



  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await profileService.getMyProfile();
        setProfile(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    setError(null);
    setSuccessMsg('');
    
    let finalAvatarUrl = profile.avatar === "" ? null : profile.avatar; 

    try {
      if (selectedFile) {
        setUploadStatus('Obteniendo autorización...');
        const signatureData = await profileService.getUploadSignature();
        
        setUploadStatus('Subiendo y optimizando foto en la nube...');
        const cloudinaryUrl = await profileService.uploadToCloudinary(selectedFile, signatureData);
        
        finalAvatarUrl = cloudinaryUrl; 
        setUploadStatus('Imagen subida. Guardando perfil...');
      }

      const payloadToUpdate = {
        ...profile,
        avatar: finalAvatarUrl, 
        hourlyRate: profile.hourlyRate ? Number(profile.hourlyRate) : undefined,
        yearsOfExperience: profile.yearsOfExperience ? Number(profile.yearsOfExperience) : undefined,
        languages: profile.languages?.map(lang => ({
          name: lang.name,
          level: lang.level.toUpperCase() as LanguageLevel 
        }))
      };

      const updatedData = await profileService.updateMyProfile(payloadToUpdate);
      setProfile(updatedData);
      setSelectedFile(null);
      setSuccessMsg('Perfil actualizado correctamente');
      
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setIsSaving(false);
      setUploadStatus('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => prev ? { 
      ...prev, 
      [name]: name === 'hourlyRate' ? Number(value) : value 
    } : null);
  };




  return {
    profile,
    setProfile, 
    isLoading,
    isSaving,
    error,
    successMsg,
    handleChange,
    handleSave,
    setSelectedFile,
    uploadStatus,
  
  };
};