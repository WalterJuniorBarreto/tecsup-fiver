import prisma from "../config/db.js";

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
  }
};