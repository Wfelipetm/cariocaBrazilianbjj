"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthProvider";
import { useRouter } from "next/navigation";
import Header from "./componetes/Header/Header";
import Footer from "./componetes/Footer/Footer";
import Home from "./home/page"


export default function Page() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col justify-between w-screen h-screen">
      <Header />
      <Home />
      <Footer />
    </div>
  );
}
