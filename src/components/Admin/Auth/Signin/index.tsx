"use client";
import React, { useState } from "react";
import SigninWithPassword from "../SigninWithPassword";
import ForgotPassword from "../ForgotPassword";
export interface formDataProps {
  email: string;
  password: string;
  remember: boolean;
}

export default function Signin() {
  const handleGoogleLogin=()=>{
    return null
  }
  const [forgotPassClicked,setForgotPassClicked]=useState<boolean>(false)
  const [form, setForm] = useState<formDataProps>({
      email: "",
      password: "",
      remember: false,
    });
    
  return (
    <>
      {/* <GoogleSigninButton handleGoogleLogin={handleGoogleLogin} text="Sign in" /> */}

      {/* <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit hover:text-hoverPrimary hover:cursor-pointer px-3 text-center font-medium dark:bg-gray-dark">
          Or sign in with email
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div> */}

      <div>
        {forgotPassClicked ? 
        <ForgotPassword 
          form={form} setForm={setForm}
          setForgotPassClicked={setForgotPassClicked}
         /> :
         <SigninWithPassword 
          form={form} setForm={setForm} 
          forgotPassClicked={forgotPassClicked} setForgotPassClicked={setForgotPassClicked}/>}
      </div>

      {/* <div className="mt-6 text-center">
        <p>
          Don’t have any account?{" "}
          <Link href="/auth/signup" className="text-primary">
            Sign Up
          </Link>
        </p>
      </div> */}
    </>
  );
}
