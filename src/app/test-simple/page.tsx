'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function SimpleTest() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6">
      <h1 className="text-2xl font-bold mb-4">🧪 Simple Authentication Test</h1>
      
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-semibold">Status:</h3>
          <p className="text-lg">{status}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-semibold">Session:</h3>
          <pre className="text-sm overflow-auto mt-2">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        <div className="flex gap-4">
          {!session ? (
            <button
              onClick={() => signIn('credentials')}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Sign In
            </button>
          ) : (
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
