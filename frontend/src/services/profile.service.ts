import { api } from '../config/axios';
import { UserProfile, ProfileResponse } from '../types/profile.types';
import { isAxiosError } from 'axios';
import { getAuthToken } from '../lib/auth'; 
import { CloudinarySignature } from '../types/cloudinary.types';
import axios from 'axios';

const getAuthHeader = () => {
  const token = getAuthToken(); 
  return { Authorization: `Bearer ${token}` };
};

export const profileService = {
  getMyProfile: async (): Promise<UserProfile> => {
    try {
      const response = await api.get<ProfileResponse>('/api/profile/me', {
        headers: getAuthHeader(), 
      });
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error)) throw new Error(error.response?.data?.message || 'Error al cargar perfil');
      throw new Error('Error de conexión');
    }
  },

  updateMyProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const response = await api.put<ProfileResponse>('/api/profile/me', data, {
        headers: getAuthHeader(),
      });
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.data?.issues && error.response.data.issues.length > 0) {
          throw new Error(error.response.data.issues[0]); 
        }
        
        throw new Error(error.response?.data?.message || 'Error al actualizar perfil');
      }
      throw new Error('Error de conexión');
    }
  },


  getUploadSignature: async (): Promise<CloudinarySignature> => {
    try {
      const response = await api.get<{ status: string; data: CloudinarySignature }>('/api/profile/upload-signature', {
        headers: getAuthHeader(),
      });
      return response.data.data;
    } catch (error) {
      throw new Error('Error obteniendo autorización para subir imagen');
    }
  },

  uploadToCloudinary: async (file: File, signatureData: CloudinarySignature): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', signatureData.apiKey);
    formData.append('timestamp', signatureData.timestamp.toString());
    formData.append('signature', signatureData.signature);
    formData.append('folder', signatureData.folder);
    formData.append('eager', signatureData.eager);
    formData.append('public_id', signatureData.publicId);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
        formData
      );
      return response.data.secure_url; 
    } catch (error) {
      throw new Error('Error subiendo imagen a la nube');
    }
  }
};