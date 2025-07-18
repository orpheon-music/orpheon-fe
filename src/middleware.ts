import { NextResponse } from "next/server";
import protectedRoutes from "./middlewares/protected-routes";

export function mainMiddleware() {
    return NextResponse.next();
}

export default protectedRoutes(mainMiddleware, [
    "/mastering",
    "/library",
]);