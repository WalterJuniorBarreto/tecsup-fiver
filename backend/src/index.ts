import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './config/db.js';
import authRoutes from './routes/auth.routes.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors()); 
app.use(express.json()); 
app.use('/api/auth', authRoutes);

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'success',
      message: 'Servidor de Tecsup Fiver en línea',
      database: 'Conectada',
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error conectando a la base de datos',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Healthcheck: http://localhost:${PORT}/api/health`);
});