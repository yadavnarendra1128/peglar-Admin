'use client'

import Loader from "@/components/Admin/common/Loader";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
const router=useRouter()
  useEffect(()=>{
    router.push('/admin')
  },[])

  return (
    <Loader/>
  );
}
