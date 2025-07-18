import { User as NextAuthUser } from "next-auth";

declare module "next-auth" {
    interface User extends NextAuthUser {
        id: string;
        username: string;
        token?: string;
    }

    interface Session {
        user?: {
            id: string,
            username: string,
            token: string
        }
    }
}