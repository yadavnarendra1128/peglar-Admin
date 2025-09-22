'use client'
import Loader from "@/components/Admin/common/Loader";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { DeleteModalProvider } from "@/context/DeleteModalContext";
import { ToastContainer } from "react-toastify";
import "../globals.css";
import "../../../styles/admin.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { loading }=useAuth()

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
