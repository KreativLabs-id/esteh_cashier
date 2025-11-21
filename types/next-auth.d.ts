import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            role: "admin" | "cashier";
            id: string;
            name: string;
        } & DefaultSession["user"];
    }
}
