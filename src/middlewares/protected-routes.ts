import { NEXTAUTH_SECRET } from "@/lib/env";
import { getToken } from "next-auth/jwt";
import {
    NextFetchEvent,
    NextMiddleware,
    NextRequest,
    NextResponse,
} from "next/server";

export default function protectedRoutes(
    middleware: NextMiddleware,
    requireAuth: string[] = []
) {
    return async (req: NextRequest, next: NextFetchEvent) => {
        const pathName = req.nextUrl.pathname;

        if (requireAuth.some((path) => pathName.startsWith(path))) {
            const token = await getToken({
                req,
                secret: NEXTAUTH_SECRET,
            });
            if (!token) {
                const url = new URL("/?signin=true", req.url);
                url.searchParams.set("callbackUrl", encodeURI(req.url));
                return NextResponse.redirect(url);
            }
        }

        return middleware(req, next);
    };
}