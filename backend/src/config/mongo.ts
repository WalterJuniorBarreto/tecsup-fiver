import mongoose from 'mongoose';

export const connectMongoDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI no está definido en las variables de entorno');

    await mongoose.connect(uri);
    console.log('[MongoDB] Conexión establecida con éxito (Módulo de Reseñas)');
  } catch (error) {
    console.error('[MongoDB] Error conectando a la base de datos:', error);
    process.exit(1);
  }
};