// src/app/page.tsx
"use client"; // <--- Add this line at the very top

import { Button } from "@/components/ui/button"; // Import a shadcn/ui component

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-5xl font-extrabold mb-4 text-center">
        Welcome to the <span className="text-blue-600 dark:text-blue-400">Knowledge Hub!</span>
      </h1>
      <p className="text-lg mb-8 text-center max-w-prose">
        Your AI-powered, real-time collaborative workspace. Let&apos;s get started.
      </p>

      {/* Example shadcn/ui Button */}
      <Button size="lg" className="px-8 py-3 text-lg" onClick={() => alert("Ready to build!")}>
        Start Exploring
      </Button>

      <footer className="absolute bottom-4 text-sm text-gray-500 dark:text-gray-400">
        Built with Next.js, Tailwind CSS, and shadcn/ui
      </footer>
    </main>
  );
}