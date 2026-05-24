import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const prisma = new PrismaClient();

const ReviewSchema = new mongoose.Schema({
  serviceId: { type: String, required: true, index: true },
  clientId: { type: String, required: true },
  clientName: { type: String, required: true },
  clientAvatar: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '', trim: true },
}, {
  timestamps: true,
  versionKey: false
});

ReviewSchema.index({ serviceId: 1, clientId: 1 }, { unique: true });

const ReviewModel = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

const categories = [
  { name: 'Diseño', description: 'Logo, identidad visual, UI/UX y piezas graficas.' },
  { name: 'Programacion', description: 'Web, apps, APIs, automatizaciones y software.' },
  { name: 'Video', description: 'Edicion, animacion, motion graphics y contenido audiovisual.' },
  { name: 'Marketing', description: 'Ads, SEO, redes sociales y crecimiento digital.' },
  { name: 'Redaccion', description: 'Copywriting, articulos, guiones y contenido SEO.' },
  { name: 'Traduccion', description: 'Traducciones profesionales y localizacion.' }
];

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const demoServices = [
  {
    title: 'Diseño de logo profesional con guia de marca',
    description: 'Logo, paleta, tipografia y lineamientos visuales listos para usar.',
    price: 150,
    deliveryDays: 4,
    category: 'Diseño',
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=900'
  },
  {
    title: 'Desarrollo de landing page con Next.js',
    description: 'Landing responsive, rapida y optimizada para conversiones.',
    price: 500,
    deliveryDays: 7,
    category: 'Programacion',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=900'
  },
  {
    title: 'Edicion de video para redes sociales',
    description: 'Cortes dinamicos, subtitulos, color y formato vertical u horizontal.',
    price: 200,
    deliveryDays: 3,
    category: 'Video',
    image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=900'
  },
  {
    title: 'Estrategia de marketing digital para tu negocio',
    description: 'Plan de contenidos, campanas y recomendaciones accionables.',
    price: 350,
    deliveryDays: 5,
    category: 'Marketing',
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&q=80&w=900'
  },
  {
    title: 'Redaccion de articulo SEO optimizado',
    description: 'Articulo investigado, estructurado y listo para publicar.',
    price: 80,
    deliveryDays: 2,
    category: 'Redaccion',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=900'
  },
  {
    title: 'Traduccion profesional ingles español',
    description: 'Traduccion clara, natural y revisada para documentos o contenido web.',
    price: 50,
    deliveryDays: 2,
    category: 'Traduccion',
    image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&q=80&w=900'
  }
];

async function main() {
  const categoryRecords = new Map();

  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: slugify(category.name) },
      update: {
        name: category.name,
        description: category.description,
        isActive: true
      },
      create: {
        name: category.name,
        slug: slugify(category.name),
        description: category.description,
        isActive: true
      }
    });
    categoryRecords.set(category.name, record);
  }

  const password = await bcrypt.hash('Demo12345', 10);
  const seller = await prisma.user.upsert({
    where: { email: 'demo.freelancer@devmarket.local' },
    update: {
      role: 'FREELANCER',
      isVerified: true,
      membershipTier: 'ELITE'
    },
    create: {
      email: 'demo.freelancer@devmarket.local',
      username: 'demo_freelancer',
      name: 'Freelancer Demo',
      password,
      role: 'FREELANCER',
      isVerified: true,
      membershipTier: 'ELITE',
      professionalTitle: 'Especialista creativo digital',
      location: 'Lima, Peru',
      bio: 'Perfil demo para probar busqueda, filtros y ordenamiento.'
    }
  });

  const client = await prisma.user.upsert({
    where: { email: 'demo.client@devmarket.local' },
    update: {
      role: 'CLIENT',
      isVerified: true
    },
    create: {
      email: 'demo.client@devmarket.local',
      username: 'demo_client',
      name: 'Cliente Demo',
      password,
      role: 'CLIENT',
      isVerified: true
    }
  });

  const existingServices = await prisma.service.count();
  if (existingServices === 0) {
    for (const service of demoServices) {
      const category = categoryRecords.get(service.category);
      await prisma.service.create({
        data: {
          title: service.title,
          description: service.description,
          price: service.price,
          deliveryDays: service.deliveryDays,
          image: service.image,
          sellerId: seller.id,
          categoryId: category.id,
          isPublished: true
        }
      });
    }
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI no esta definido en backend/.env');
  }

  await mongoose.connect(process.env.MONGO_URI);

  const publishedServices = await prisma.service.findMany({
    where: { isPublished: true },
    include: { category: true }
  });

  for (const service of publishedServices) {
    await ReviewModel.updateOne(
      { serviceId: service.id, clientId: client.id },
      {
        $setOnInsert: {
          serviceId: service.id,
          clientId: client.id,
          clientName: client.name || 'Cliente Demo',
          clientAvatar: client.avatar || '',
          rating: 5,
          comment: `Excelente servicio de ${service.category?.name || 'DevMarket'}. Entrega clara, rapida y profesional.`
        }
      },
      { upsert: true }
    );
  }

  const [categoryCount, serviceCount, reviewCount] = await Promise.all([
    prisma.category.count(),
    prisma.service.count(),
    ReviewModel.countDocuments()
  ]);

  console.log(`Seed listo: ${categoryCount} categorias, ${serviceCount} servicios, ${reviewCount} resenas.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await mongoose.disconnect();
  });
