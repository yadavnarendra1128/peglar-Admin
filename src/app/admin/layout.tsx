'use client'
import Loader from "@/components/Admin/common/Loader";
import { useAuth } from "@/context/AuthContext";
import { DeleteModalProvider } from "@/context/DeleteModalContext";
import "../globals.css";
import "../../../styles/admin.css";
import { useRouter } from "next/navigation";
import {useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router=useRouter()
  const { loading,user }=useAuth()

  useEffect(()=>{
    if(!loading && !user){
      router.push('/admin/signin')
    }
  },[loading,user])

  return (
      <div className="font-gilroyMedium bg-[url('/img/AGED-paper/paper.png')]">
        {loading ? (
          <Loader />
        ) : (
             <DeleteModalProvider>
              {children}
             </DeleteModalProvider>
        )}
      </div>
  );
}
