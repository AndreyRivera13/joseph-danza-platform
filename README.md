# Joseph Danza Platform

Plataforma de video estilo "Netflix" para la academia Joseph Danza. Stack:

- Next.js 14 + TypeScript + App Router
- Tailwind CSS
- Prisma + PostgreSQL
- NextAuth (Email + Google)
- Mux (VOD, HLS, player)
- Stripe (suscripciones)
- Hosting recomendado: Vercel

## Requisitos

- Node.js 18+
- Cuenta de BD Postgres (Supabase o Neon)
- Cuenta de Mux (token ID/secret)
- Cuenta de Stripe (modo test)
- Google OAuth Client (para login con Google)
- SMTP (Mailtrap, Brevo, o tu proveedor) para links mágicos de Email

## Variables de entorno

Crea `.env` desde `.env.example`:

```
DATABASE_URL="postgresql://..."

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="genera_un_valor_aleatorio"

EMAIL_SERVER="smtp://USER:PASS@HOST:PORT"
EMAIL_FROM="soporte@tudominio.com"

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

MUX_TOKEN_ID=""
MUX_TOKEN_SECRET=""
MUX_WEBHOOK_SECRET="" # opcional si validas firmas

STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_PRICE_ID="" # ID del precio del plan de suscripción

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## Setup rápido

1. Instala dependencias:
   ```
   npm install
   ```

2. Configura Postgres (elige uno):
   - Supabase: crea un proyecto y toma `DATABASE_URL` (Role: `postgres`, incluye `?pgbouncer=false` si usas migraciones).
   - Neon: crea DB, copia la cadena.

3. Ejecuta migraciones:
   ```
   npx prisma migrate dev
   ```

4. Configura NextAuth:
   - Email: usa Mailtrap (gratis) para `EMAIL_SERVER`.
   - Google: crea credenciales OAuth (Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`).

5. Configura Mux:
   - Tokens (Read/Write).
   - Webhook URL: `https://TU-URL/api/mux/webhook`.
   - Si validas firmas, pon `MUX_WEBHOOK_SECRET`.

6. Configura Stripe (modo test):
   - Crea un producto de suscripción y un precio recurrente (mensual).
   - Copia `STRIPE_PRICE_ID`.
   - Webhook URL: `https://TU-URL/api/stripe/webhook` con eventos:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`

7. Ejecuta en desarrollo:
   ```
   npm run dev
   ```

8. Despliegue:
   - Vercel: importa el repo y define las env vars.
   - Ejecuta `prisma generate` en build (ya está en script `build`).

## Notas

- El panel admin incluye UI inicial. La generación de "direct upload" de Mux está incluida vía API pero la UI del form requiere un componente cliente con `fetch` (pendiente).
- El gateo de contenido por suscripción está listo a nivel de backend (Stripe webhook + tabla `Subscription`). En el reproductor se debe terminar la verificación para usuarios no staff.
- Extensiones siguientes:
  - Búsqueda/filtros por categoría/nivel
  - Progreso por usuario (guardar `timeupdate` del player)
  - Favoritos
  - Página de cuenta con estado de suscripción

