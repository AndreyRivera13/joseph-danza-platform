'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b">
      <div className="container h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-brand-700">Joseph Danza</Link>
        <div className="flex items-center gap-4">
          <Link href="/catalog" className="hover:text-brand-700">Catálogo</Link>
          {session?.user?.role && (session.user.role === 'ADMIN' || session.user.role === 'INSTRUCTOR') && (
            <Link href="/admin" className="hover:text-brand-700">Admin</Link>
          )}
          {session ? (
            <>
              <button onClick={() => signOut()} className="px-3 py-1 border rounded hover:bg-gray-50">Salir</button>
            </>
          ) : (
            <button onClick={() => signIn()} className="px-3 py-1 border rounded bg-brand-600 text-white hover:bg-brand-700">
              Ingresar
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}