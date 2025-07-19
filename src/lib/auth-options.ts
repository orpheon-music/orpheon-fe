import { BASE_URL, NEXTAUTH_SECRET } from "@/lib/env";
import axios from "axios";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { decodeJwt } from "./decode";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "email", placeholder: "orpheon@gmail.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const response = await axios.post(`${BASE_URL}/auth/login`, {
                        email: credentials?.email,
                        password: credentials?.password,
                    }, {
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                    });

                    const token = response.data?.access_token;
                    const decoded = decodeJwt(token);
                    if (token) {
                        return {
                            email: credentials?.email,
                            id: decoded.user_id,
                            username: credentials?.email.split("@")[0],
                            access_token: token,
                        };
                    }

                    return null;
                } catch (err) {
                    if (axios.isAxiosError(err)) {
                        throw new Error(err.response?.data.detail || "Login failed");
                    } else {
                        throw new Error("An unexpected error occurred during login.");
                    }
                }
            },
        }), 
    ],
    pages: {
        signIn: "/?signin=true",
    },
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 6, // 6 hour
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.access_token = user.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                access_token: token.access_token as string,
                ...session.user,
            };
            return session;
        },
    },
    secret: NEXTAUTH_SECRET,
};