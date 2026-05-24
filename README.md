# DevMarket / Tecsup Fiver

Proyecto full stack con:

- Frontend: Next.js en `frontend/`
- Backend: Express + TypeScript en `backend/`
- Base principal: PostgreSQL con Prisma
- Reseñas: MongoDB
- Cache / sockets: Redis
- Servicios locales: Docker Compose

## Cambios hechos hasta ahora

- Se corrigió `docker-compose.yml`: faltaba declarar el volumen `mongodata`.
- Se configuró el build del backend para generar `dist/` desde TypeScript.
- Se corrigieron tipos que impedían compilar el backend.
- Se agregó `npm run seed` para cargar categorías y servicios demo.
- Se reforzaron los filtros de `/explore` para buscar por título, descripción, categoría y vendedor.
- Se corrigió el filtro de categorías para comparar por `id`, `slug` o nombre normalizado.
- Se ajustó `/explore` para que el modo claro/oscuro use los tokens globales de tema.
- Se ajustó el modo claro del dashboard de vendedor en perfil, resumen, servicios y mensajes.
- Se corrigieron superficies de inputs, tarjetas, filas de pedidos y botones que quedaban grises por fondos oscuros translúcidos.
- Se ajustó el modal de membresía en modo claro para usar superficies del tema.
- Se conectó la membresía a Stripe: el backend expone el intent de suscripción, el modal monta `PaymentElement` y el webhook activa el plan pagado.
- Se separó el flujo de membresía en dos pasos: confirmación del plan y pantalla de checkout con métodos de pago, dejando PayPal preparado para una integración posterior.
- Se integró PayPal Sandbox en el checkout de membresía con creación/captura de órdenes y activación del plan al capturar el pago.

## Requisitos

Instala o ten abierto:

- Node.js
- npm
- Docker Desktop

Antes de correr el proyecto, asegúrate de que Docker Desktop esté iniciado.

## Variables de entorno

El proyecto ya tiene archivos `.env` locales en:

- `backend/.env`
- `frontend/.env`

Valores importantes:

```env
# backend/.env
DATABASE_URL="postgresql://admin:secretpassword123@localhost:5433/tecsup_academy_db?schema=public"
REDIS_URL="redis://localhost:6379"
MONGO_URI="mongodb://localhost:27017/tecsup_reviews"
PORT=4000
```

```env
# frontend/.env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

## Primera instalación

Desde la raíz del proyecto:

```bash
cd backend
npm install
```

```bash
cd ../frontend
npm install
```

## Levantar servicios de base de datos

Desde la raíz del proyecto:

```bash
docker compose up -d
```

Esto levanta:

- PostgreSQL: `localhost:5433`
- MongoDB: `localhost:27017`
- Redis: `localhost:6379`
- pgAdmin: `http://localhost:5050`

## Preparar Prisma sin romper la base

Entra al backend:

```bash
cd backend
```

Genera el cliente Prisma:

```bash
npx prisma generate
```

Aplica migraciones existentes:

```bash
npx prisma migrate deploy
```

Carga datos demo para poder probar explore, categorías y filtros:

```bash
npm run seed
```

## Importante sobre Prisma

Usa este comando cuando solo quieres que Prisma actualice su cliente:

```bash
npx prisma generate
```

Usa este comando cuando ya existen migraciones y quieres aplicarlas a tu base:

```bash
npx prisma migrate deploy
```

Evita usar este comando si no cambiaste `backend/prisma/schema.prisma`:

```bash
npx prisma migrate dev
```

`migrate dev` es para desarrollo de esquema. Si Prisma detecta diferencias puede crear una migración nueva o pedir resetear la base. Eso puede dejarte sin categorías o servicios, y entonces los filtros de `/explore` parecerán fallar porque no hay datos que filtrar.

Solo usa `migrate dev` cuando realmente editaste modelos, campos, relaciones o enums en:

```text
backend/prisma/schema.prisma
```

Después de `migrate dev`, vuelve a cargar datos si hace falta:

```bash
npm run seed
```

## Correr el backend

Para desarrollo:

```bash
cd backend
npm run dev
```

Backend disponible en:

```text
http://localhost:4000
```

Healthcheck:

```text
http://localhost:4000/api/health
```

Para correr con build:

```bash
cd backend
npm run build
npm start
```

## Correr el frontend

En otra terminal:

```bash
cd frontend
npm run dev
```

Frontend disponible normalmente en:

```text
http://localhost:3000
```

Si el puerto `3000` está ocupado, Next usará otro, por ejemplo:

```text
http://localhost:3001
```

Abre la URL que aparezca en la terminal.

## Flujo recomendado para correr todo

Desde cero:

```bash
docker compose up -d
```

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run seed
npm run dev
```

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

## Verificar que hay datos

Si `/explore` aparece vacío o los filtros parecen no funcionar, revisa que existan categorías y servicios:

```bash
cd backend
node -e 'const {PrismaClient}=require("@prisma/client"); const prisma=new PrismaClient(); Promise.all([prisma.category.count(), prisma.service.count(), prisma.user.count()]).then(([categories,services,users])=>console.log({categories,services,users})).finally(()=>prisma.$disconnect())'
```

Lo esperado después del seed:

```text
categories: 6
services: 6
```

Si sale `0`, corre:

```bash
npm run seed
```

## Comandos útiles

Backend:

```bash
npm run dev
npm run build
npm start
npm run seed
npx prisma generate
npx prisma migrate deploy
npx prisma migrate status
```

Frontend:

```bash
npm run dev
npx tsc --noEmit
npm run build
```

## Pagos de prueba

Stripe usa:

```env
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

PayPal Sandbox usa:

```env
PAYPAL_CLIENT_ID
PAYPAL_CLIENT_SECRET
PAYPAL_ENV=sandbox
NEXT_PUBLIC_PAYPAL_CLIENT_ID
```

Para probar PayPal, usa una cuenta `Personal` de Sandbox desde el dashboard de PayPal Developer.

Docker:

```bash
docker compose up -d
docker compose ps
docker compose down
```

## Problemas conocidos

- `frontend npm run build` puede fallar por páginas existentes que usan `useSearchParams()` sin `Suspense`, como `/auth/login` o `/dashboard/client/messages`. El chequeo de tipos con `npx tsc --noEmit` sí pasa.
- Si `http://localhost:3000/explore` no refleja cambios, revisa si Next levantó en `3001` porque el puerto `3000` estaba ocupado.
- Si no hay datos en PostgreSQL, los filtros no mostrarán resultados. Corre `npm run seed` en `backend/`.
