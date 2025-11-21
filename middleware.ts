import { auth } from "@/lib/auth";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;
    const role = req.auth?.user?.role;

    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
    const isPublicRoute = nextUrl.pathname === "/login";
    const isAuthRoute = nextUrl.pathname.startsWith("/login");

    if (isApiAuthRoute) {
        return;
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            if (role === "admin") {
                return Response.redirect(new URL("/admin/dashboard", nextUrl));
            } else {
                return Response.redirect(new URL("/pos", nextUrl));
            }
        }
        return;
    }

    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/login", nextUrl));
    }

    if (isLoggedIn) {
        if (nextUrl.pathname.startsWith("/admin") && role !== "admin") {
            return Response.redirect(new URL("/pos", nextUrl));
        }
        if (nextUrl.pathname.startsWith("/pos") && role !== "cashier") {
            // Admins can access POS? Prompt says "Admins cannot create transactions".
            // But usually admins might want to see it. 
            // "Admin -> /admin/dashboard", "Cashier -> /pos".
            // Let's restrict strict separation for now as per prompt "Strict role-based access control".
            return Response.redirect(new URL("/admin/dashboard", nextUrl));
        }
    }

    return;
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
