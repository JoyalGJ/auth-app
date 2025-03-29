import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import supabase from "@/lib/supabase";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "OTP Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        otp: { label: "OTP", type: "text", placeholder: "123456" },
      },
      async authorize(credentials) {
        const { email, otp } = credentials;
        const { data, error } = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: "email", 
        });

        if (error) throw new Error(error.message);
        return { id: data.user.id, email: data.user.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
