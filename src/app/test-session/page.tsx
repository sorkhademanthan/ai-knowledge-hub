"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function TestSession() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const refreshSession = () => {
    update();
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6">
      <h1 className="text-2xl font-bold mb-4">🧪 Session Test</h1>

      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-semibold">Session Status:</h3>
          <p className="text-lg">{status}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-semibold">Session Data:</h3>
          <pre className="text-sm overflow-auto mt-2">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => signIn()}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Sign In
          </button>

          <button
            onClick={refreshSession}
            className="px-4 py-2 bg-yellow-600 text-white rounded"
          >
            Refresh Session
          </button>

          {session && (
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
