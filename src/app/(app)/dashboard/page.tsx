// src/app/(app)/dashboard/page.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Document {
  id: string;
  title: string;
  status: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // Redirect to sign-in if not authenticated
      router.push('/auth/signin');
    },
  });
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('🔍 [DASHBOARD] Session status:', status, 'Session:', session);

  useEffect(() => {
    if (session?.user?.id) {
      async function fetchDocuments() {
        try {
          const response = await fetch('/api/documents');
          if (response.ok) {
            const fetchedDocs = await response.json();
            setDocuments(fetchedDocs);
          } else {
            console.error('Failed to fetch documents:', response.status);
          }
        } catch (error) {
          console.error('Failed to fetch documents:', error);
        } finally {
          setLoading(false);
        }
      }
      fetchDocuments();
    } else if (status !== 'loading') {
      setLoading(false);
    }
  }, [session, status]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">Knowledge Hub Dashboard</h1>
          <p className="text-xl text-gray-600">
            Welcome back, {session?.user?.name || session?.user?.email}! 👋
          </p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/auth/signin' })}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
      
      {/* Debug Session Info */}
      <div className="mb-8 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">🔍 Debug Info:</h3>
        <p>Status: {status}</p>
        <p>User ID: {session?.user?.id}</p>
        <p>Email: {session?.user?.email}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Your Documents</h2>
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You have no documents yet.</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Create Your First Document
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="border border-gray-200 p-4 rounded-md hover:bg-gray-50">
                <h3 className="text-xl font-medium">{doc.title}</h3>
                <p className="text-gray-600">Status: <span className="capitalize">{doc.status}</span></p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Total Documents</h3>
          <p className="text-2xl font-bold text-blue-600">{documents.length}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Published</h3>
          <p className="text-2xl font-bold text-green-600">
            {documents.filter(doc => doc.status === 'PUBLISHED').length}
          </p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800">Drafts</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {documents.filter(doc => doc.status === 'DRAFT').length}
          </p>
        </div>
      </div>
    </div>
  );
}
