import { User as NextAuthUser } from "next-auth";

declare module "next-auth" {
    interface User extends NextAuthUser {
        access_token?: string;
    }

    interface Session {
        user?: {
            access_token?: string;
        }
    }
}

export interface DecodedJWT {
  user_id: string;
}