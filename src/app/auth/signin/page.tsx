'use client';

import { signIn, getSession } from 'next-auth/react';
import { useState } from 'react';

export default function SignIn() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('Attempting sign in...');

    try {
      console.log('🔄 [CLIENT] Attempting sign in with:', { email, password: '***' });
      
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      console.log('📝 [CLIENT] Sign in result:', signInResult);

      if (signInResult?.error) {
        setResult(`❌ Sign in failed: ${signInResult.error}\n\nDetails:\n- User ID: e9f57822-b498-49bc-abc5-e41e892d5d13\n- Has Password: true\n- Check server console for authentication flow logs.`);
        console.error('❌ [CLIENT] Sign in error:', signInResult.error);
      } else if (signInResult?.ok) {
        const session = await getSession();
        console.log('✅ [CLIENT] Session created:', session);
        setResult(`✅ Sign in successful!\n\nSession: ${JSON.stringify(session, null, 2)}`);
        
        // Optional: Redirect to dashboard or home page
        // window.location.href = '/dashboard';
      } else {
        setResult('⚠️ Unknown sign in result');
        console.log('⚠️ [CLIENT] Unknown result:', signInResult);
      }
    } catch (error) {
      console.error('💥 [CLIENT] Exception during sign in:', error);
      setResult(`💥 Exception: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const createTestUser = async () => {
    try {
      setResult('Creating test user...');
      const response = await fetch('/api/create-test-user', {
        method: 'POST',
      });
      const data = await response.json();
      setResult(`Test user creation: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setResult(`Error creating test user: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const testDirectAPI = async () => {
    try {
      const response = await fetch('/api/auth/callback/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email,
          password,
          csrfToken: 'test',
        }),
      });

      const text = await response.text();
      console.log('🔍 Direct API response:', response.status, text);
      setResult(`Direct API test: ${response.status}\n${text}`);
    } catch (error) {
      console.error('🔍 Direct API error:', error);
      setResult(`Direct API error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 border rounded-lg">
      <h1 className="text-2xl font-bold mb-4">🔐 Authentication Test</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Sign In'}
          </button>
          
          <button
            type="button"
            onClick={testDirectAPI}
            className="flex-1 py-2 px-4 bg-gray-600 text-white rounded"
          >
            Test Direct API
          </button>
        </div>
      </form>

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={createTestUser}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Create Test User
        </button>
      </div>

      <div className="bg-blue-50 p-4 rounded mb-4">
        <p className="text-sm font-medium">Test Credentials:</p>
        <p className="text-sm">Email: test@example.com</p>
        <p className="text-sm">Password: password123</p>
        <p className="text-sm text-gray-600 mt-2">💡 Check browser console and terminal for detailed logs</p>
      </div>

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-medium mb-2">Result:</h3>
          <pre className="whitespace-pre-wrap text-sm">{result}</pre>
        </div>
      )}
    </div>
  );
}
