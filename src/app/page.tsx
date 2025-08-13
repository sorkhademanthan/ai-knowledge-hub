// src/app/page.tsx
'use client';

import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link"; // Import Link for navigation

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-5xl font-extrabold mb-4 text-center">
        Welcome to the <span className="text-blue-600 dark:text-blue-400">Knowledge Hub!</span>
      </h1>
      <p className="text-lg mb-8 text-center max-w-prose">
        Your AI-powered, real-time collaborative workspace. Let's get started.
      </p>

      {session ? (
        <>
          <p className="text-xl mb-4">Signed in as {session.user?.email}</p>
          <div className="flex space-x-4">
            <Link href="/dashboard" passHref>
              <Button size="lg" className="px-8 py-3 text-lg">
                Go to Dashboard
              </Button>
            </Link>
            <Button size="lg" className="px-8 py-3 text-lg" onClick={() => signOut()}>
              Sign Out
            </Button>
          </div>
        </>
      ) : (
        <Button size="lg" className="px-8 py-3 text-lg" onClick={() => window.location.href = '/api/auth/signin'}>
          Sign In
        </Button>
      )}

      <footer className="absolute bottom-4 text-sm text-gray-500 dark:text-gray-400">
        Built with Next.js, Tailwind CSS, and shadcn/ui
      </footer>
    </main>
  );
}