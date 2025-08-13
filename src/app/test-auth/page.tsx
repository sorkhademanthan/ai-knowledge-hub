'use client';

import { signIn, getSession } from 'next-auth/react';
import { useState } from 'react';

export default function TestAuth() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setResult('Testing authentication...');

    try {
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setResult(`❌ Sign in failed: ${signInResult.error}`);
      } else {
        const session = await getSession();
        setResult(`✅ Sign in successful! Session: ${JSON.stringify(session, null, 2)}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        setResult(`❌ Error: ${error.message}`);
      } else {
        setResult('❌ An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          onClick={handleTest}
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Authentication'}
        </button>

        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
