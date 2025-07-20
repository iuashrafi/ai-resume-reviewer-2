"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthProvider";
import { PreLoader } from "@/components/preloader";

export const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loadingUser } = useAuthContext();
  const pathname = usePathname();
  const router = useRouter();

  const [allowedToRender, setAllowedToRender] = useState(false);

  useEffect(() => {
    if (loadingUser) return;

    const publicRoutes = ["/login"];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!isAuthenticated && !isPublicRoute) {
      router.push("/login");
      return;
    }

    if (isAuthenticated && isPublicRoute) {
      router.push("/dashboard");
      return;
    }

    setAllowedToRender(true);
  }, [isAuthenticated, loadingUser, pathname]);

  if (loadingUser || !allowedToRender) {
    return <PreLoader />;
  }

  return <>{children}</>;
};
