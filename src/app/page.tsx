'use client';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard');
    }
  }, [status, router]);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-8 py-4 bg-white shadow">
        <span className="text-xl font-bold text-gray-800" tabIndex={0} aria-label="Vendash">Vendash</span>
        <button
          onClick={() => signIn('google')}
          className="px-4 py-2 bg-blue-600 text-white rounded-full animate-pulse border-2 border-transparent hover:bg-white hover:border-blue-600 hover:text-blue-600 transition-colors duration-300 ease-in-out cursor-pointer"
          aria-label="Login as Vendor"
          tabIndex={0}
        >
          Login as Vendor
        </button>
      </header>
      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Welcome to Vendash</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl">
          Vendash is a vendor management system for managing vendors where you can create new vendors, update and delete vendor details.
        </p>
        <span className="text-lg text-white bg-green-600 p-3 rounded-2xl font-medium">
          Login to Open Dashboard
        </span>
      </section>
    </main>
  );
} 