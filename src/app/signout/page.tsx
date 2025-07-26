"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function LogOutPage() {
    useEffect(() => {
        const clearAuthCache = async () => {
            try {
                // Hapus session dari localStorage & sessionStorage
                localStorage.removeItem("next-auth.session-token");
                sessionStorage.removeItem("next-auth.session-token");

                // Hapus semua cookies yang terkait dengan NextAuth
                const cookies = document.cookie.split("; ");
                cookies.forEach((cookie) => {
                    const [name] = cookie.split("=");
                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
                    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
                });


                toast.success("Logged out");

                await signOut({ redirect: true, callbackUrl: "/" });
            } catch (error) {
                console.error("Error clearing auth cache:", error);
            }
        };

        clearAuthCache();
    }, []);

    return <></>;
}