// src/types/next-auth.d.ts
import NextAuth from "next-auth"; // Import NextAuth to augment its modules
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt"; // For JWT type augmentation

// Extend the built-in Session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add your custom 'id' property here
      // Add other custom properties like 'role' if you plan to add them later
      // role?: "admin" | "member";
    } & DefaultSession["user"];
  }

  // Extend the built-in User type
  interface User extends DefaultUser {
    id: string; // Ensure User type also has 'id'
    // role?: "admin" | "member"; // Add custom role if you plan to store it directly on the User
  }
}

// Extend the built-in JWT type for the token callback
declare module "next-auth/jwt" {
  interface JWT {
    id: string; // Add your custom 'id' property here
    // role?: "admin" | "member"; // Add custom role if you plan to add it to the token
  }
}