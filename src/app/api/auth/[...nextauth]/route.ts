import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || "uma-string-muito-segura-para-desenvolvimento",
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "seu@usuario.com" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const admin = await prisma.admin.findUnique({
            where: { email: credentials.email } as any,
          }) as any;

          if (!admin) {
            console.log("Admin não encontrado:", credentials.email);
            return null;
          }

          const isMatch = await bcrypt.compare(credentials.password, admin.password);
          
          if (isMatch) {
            console.log("Login bem sucedido para:", credentials.email);
            return { 
              id: (admin as any).id, 
              name: "Administrador", 
              email: (admin as any).email 
            };
          }

          console.log("Senha incorreta p/ admin:", credentials.email);
          return null;
        } catch (error) {
          console.error("Erro na autorização NextAuth:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
