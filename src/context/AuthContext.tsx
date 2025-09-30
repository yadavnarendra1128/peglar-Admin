'use client'
import { User } from "@/types/user";
import { createContext, useContext, useEffect, useState } from "react";
import { getProfileApi } from "../../api/services/base.service";
import showToast from "../../api/lib/showToast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  loading: boolean;
  logOut: ()=>void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading,setLoading]=useState<boolean>(true)
    const router = useRouter()
    
    useEffect(()=>{
        const fetchProfile=async()=>{
            try{
                setLoading(true)
                const res = await getProfileApi()
                setUser(res)
            }catch(err){
                // router.push('/signin')
                showToast(false,'User not found.')
            }finally{
                setLoading(false)
            }
        }
        fetchProfile()
    },[])

    const logOut = ()=>{
         Cookies.remove("token");
        setUser(null)

         router.push('/admin/signin')
    }
    
    return (<AuthContext.Provider value={{user,setUser,logOut,loading}}>
        {children}
    </AuthContext.Provider>)
}

export const useAuth = ()=>{
    const context = useContext(AuthContext);
     if (!context)
       throw new Error("useAuth must be used within an AuthProvider");
     return context;
}