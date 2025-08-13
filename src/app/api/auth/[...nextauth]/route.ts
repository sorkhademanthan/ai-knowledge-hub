// src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { type Session, type User, type AuthOptions } from 'next-auth';

// Extend the Session and User types to include 'role'
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  }
}
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs'; // ADD THIS: Import bcryptjs

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  // Don't use PrismaAdapter for JWT strategy

  providers: [
    // Keep only credentials provider for now to avoid OAuth complexity
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log('🔍 [AUTH] Starting authorization with:', { email: credentials?.email });
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ [AUTH] Missing credentials');
          return null;
        }

        try {
          console.log('🔍 [AUTH] Looking up user in database...');
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          console.log('🔍 [AUTH] User found:', !!user, 'Has password:', !!user?.password);

          if (!user || !user.password) {
            console.log('❌ [AUTH] No user or password found');
            return null;
          }

          console.log('🔍 [AUTH] Comparing passwords...');
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          console.log('🔍 [AUTH] Password valid:', isValidPassword);

          if (!isValidPassword) {
            console.log('❌ [AUTH] Invalid password');
            return null;
          }

          console.log('✅ [AUTH] Authentication successful for user:', user.email);
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error('💥 [AUTH] Database error:', error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }
      console.log('🔍 [JWT] JWT callback:', { token: { ...token, iat: undefined, exp: undefined }, user });
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      console.log('🔍 [SESSION] Session callback:', { session });
      return session;
    },
    async signIn({ user, account }) {
      console.log('🔍 [SIGNIN] SignIn callback:', { user, account });
      return true;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: false, // Turn off debug to reduce noise
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };