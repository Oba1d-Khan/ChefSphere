import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const token = await getToken({
        req: req,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const publicPaths = path === "/" || path === "/signup" || path === "/login";

    if (publicPaths && token) {
        return NextResponse.redirect(new URL("/profile", req.nextUrl));
    }
    if (!publicPaths && !token) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }
}

export const config = {
    matcher: ["/", "/signup", "/login", "/profile"],
};