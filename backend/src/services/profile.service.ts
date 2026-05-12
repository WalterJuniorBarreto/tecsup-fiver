import prisma from "../config/db.js";
import bcrypt from 'bcrypt';
import cloudinary from '../config/cloudinary.js';

export interface UpdateProfileData {
  name?: string;
  avatar?: string | null;
  professionalTitle?: string | null; 
  location?: string | null;          
  bio?: string | null;               
  rateType?: 'HOURLY' | 'FIXED' | 'NEGOTIABLE';
  hourlyRate?: number | null;       
  languages?: Array<{ name: string; level: string }> | null; 
  skills?: string[] | null;
  yearsOfExperience?: number | null;
  education?: string[] | null;
  portfolioUrl?: string | null;
}

export const profileService = {
  getMyProfile: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, username: true, name: true, role: true,
        avatar: true, professionalTitle: true, location: true,
        bio: true, rateType: true, hourlyRate: true, languages: true,
        skills: true, yearsOfExperience: true, education: true, portfolioUrl: true,
        createdAt: true
      }
    });

    if (!user) throw new Error('USER_NOT_FOUND');
    return user;
  },

  updateMyProfile: async (userId: string, data: UpdateProfileData) => {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        avatar: data.avatar,
        professionalTitle: data.professionalTitle,
        location: data.location,
        bio: data.bio,
        rateType: data.rateType,
        hourlyRate: data.hourlyRate,
        languages: data.languages ? JSON.parse(JSON.stringify(data.languages)) : undefined,
        skills: data.skills || undefined,
        yearsOfExperience: data.yearsOfExperience !== undefined ? data.yearsOfExperience : undefined,
        education: data.education || undefined,
        portfolioUrl: data.portfolioUrl || undefined,
      },
      select: {
        id: true, username: true, name: true, avatar: true,
        professionalTitle: true, location: true, bio: true,
        rateType: true, hourlyRate: true, languages: true,
        skills: true, yearsOfExperience: true, education: true, portfolioUrl: true
      }
    });

    return updatedUser;
  },








  getClientProfile: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        username: true, 
        email: true,
        avatar: true,
        location: true, 
        bio: true,
        phone: true,  
        provider: true, 
        createdAt: true,
        _count: { select: { ordersMade: true } }
      }
    });

    if (!user) throw new Error('Usuario no encontrado');

    const reviewsCount = 0; 

    return {
      ...user,
      ordersCount: user._count.ordersMade,
      reviewsCount: reviewsCount
    };
  },

  updateClientProfile: async (userId: string, data: any) => {
    let finalAvatarUrl = data.avatar;

    if (finalAvatarUrl && finalAvatarUrl.startsWith('data:image')) {
      try {
        console.log("Subiendo nueva imagen a Cloudinary...");
        const uploadResponse = await cloudinary.uploader.upload(finalAvatarUrl, {
          folder: 'devmarket/avatars', // 👈 Te creará esta carpeta en tu Cloudinary
          width: 400, // Redimensionamos para que no pesen tanto
          height: 400,
          crop: "fill"
        });
        
        // Obtenemos el link seguro (https) que nos devuelve Cloudinary
        finalAvatarUrl = uploadResponse.secure_url; 
        console.log("¡Imagen subida con éxito! URL:", finalAvatarUrl);
      } catch (error) {
        console.error("Error subiendo a Cloudinary:", error);
        throw new Error("No se pudo subir la imagen de perfil.");
      }
    }

    return await prisma.user.update({
      where: { id: userId },
      data: {
        username: data.username,
        name: data.username, 
        location: data.location,
        bio: data.bio,
        phone: data.phone,
        avatar: finalAvatarUrl, 
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatar: true,
        location: true,
        bio: true,
        phone: true
      }
    });
  },

  changePassword: async (userId: string, currentPass: string, newPass: string) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.password) throw new Error('Usuario inválido o registrado con Google');

    const isMatch = await bcrypt.compare(currentPass, user.password);
    if (!isMatch) throw new Error('La contraseña actual es incorrecta');

    const hashedNewPassword = await bcrypt.hash(newPass, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    return { success: true };
  },

  getPublicFreelancerProfile: async (freelancerId: string) => {
    const freelancer = await prisma.user.findUnique({
      where: { id: freelancerId },
      select: {
        id: true,
        name: true,
        username: true,
        avatar: true,
        location: true,
        bio: true,
        professionalTitle: true,  
        skills: true,            
        languages: true,         
        portfolioUrl: true,      
        createdAt: true,
        
        services: {
          where: { isPublished: true },
          select: {
            id: true,
            title: true,
            price: true,
            image: true,
            deliveryDays: true,
            categoryId: true
          }
        },
        
        _count: {
          select: { 
            ordersGotten: { 
              where: { status: 'COMPLETED' } 
            } 
          }
        }
      }
    });

    if (!freelancer) throw new Error('Freelancer no encontrado');

    const reviewsCount = 0; 
    const averageRating = 5.0;

    return {
      ...freelancer,
      completedOrders: freelancer._count.ordersGotten,
      reviewsCount,
      averageRating
    };
  },
};