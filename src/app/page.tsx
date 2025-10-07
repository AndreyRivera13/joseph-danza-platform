import Link from 'next/link';

export default function Page() {
  return (
    <div className="grid gap-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Aprende danzas con Joseph Danza</h1>
        <p className="text-gray-600 mb-6">Clases organizadas por niveles y estilos. Video bajo demanda, dónde y cuándo quieras.</p>
        <div className="flex justify-center gap-4">
          <Link href="/catalog" className="px-4 py-2 rounded bg-brand-600 text-white hover:bg-brand-700">Ver catálogo</Link>
          <form action="/api/stripe/checkout" method="POST">
            <button className="px-4 py-2 rounded border hover:bg-gray-50" type="submit">Suscribirme</button>
          </form>
        </div>
      </section>
    </div>
  );
}