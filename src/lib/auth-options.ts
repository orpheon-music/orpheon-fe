import { BASE_URL, NEXTAUTH_SECRET } from "@/lib/env";
import axios from "axios";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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

                    const user = response.data?.users;

                    if (user && user.token) {
                        return {
                            id: user.id,
                            username: user.username,
                            token: user.token,
                        };
                    }

                    return null;
                } catch (err) {
                    if (axios.isAxiosError(err)) {
                        throw new Error(err.response?.data || "Login failed");
                    } else {
                        throw new Error("An unexpected error occurred during login.");
                    }
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 6, // 6 hour
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.token = user.token;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                ...session.user,
                id: token.id as string,
                username: token.username as string,
                token: token.token as string,
            };
            return session;
        },
    },
    secret: NEXTAUTH_SECRET,
};