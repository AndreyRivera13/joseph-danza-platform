import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role;
  if (!session || (role !== 'ADMIN' && role !== 'INSTRUCTOR')) {
    redirect('/api/auth/signin');
  }

  const videos = await prisma.video.findMany({ orderBy: { createdAt: 'desc' }, take: 20 });

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold">Panel de administración</h1>
      <form action="/api/mux/create-upload" method="POST" className="grid gap-2 max-w-lg border rounded p-4">
        <h2 className="font-semibold">Subir nuevo video</h2>
        <input className="border p-2 rounded" name="title" placeholder="Título" required />
        <textarea className="border p-2 rounded" name="description" placeholder="Descripción" required />
        <input className="border p-2 rounded" name="categoryId" placeholder="Categoría (opcional)" />
        <select className="border p-2 rounded" name="level" defaultValue="BASICO">
          <option value="BASICO">Básico</option>
          <option value="INTERMEDIO">Intermedio</option>
          <option value="AVANZADO">Avanzado</option>
        </select>
        <p className="text-sm text-gray-500">Al enviar, se generará un URL de carga directa de Mux (Direct Upload).</p>
        <button className="px-4 py-2 rounded bg-brand-600 text-white" formAction="#" disabled>Generar upload (pendiente UI JS)</button>
      </form>

      <div>
        <h2 className="font-semibold mb-2">Videos recientes</h2>
        <ul className="space-y-2">
          {videos.map(v => (
            <li key={v.id} className="p-3 border rounded">
              <div className="font-medium">{v.title}</div>
              <div className="text-sm text-gray-500">Publicado: {v.published ? 'Sí' : 'No'} | Nivel: {v.level}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}