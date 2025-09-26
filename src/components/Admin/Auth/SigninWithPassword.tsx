"use client";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { formDataProps } from "./Signin";
import showToast from "../../../../api/lib/showToast";
import { loginApi } from "../../../../api/services/base.service";
import { useAuth } from "@/context/AuthContext";

export default function SigninWithPassword({
  form,
  setForm,setForgotPassClicked
}: {
  form: formDataProps;
  setForm: React.Dispatch<React.SetStateAction<formDataProps>>;
  forgotPassClicked: boolean;
  setForgotPassClicked: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {setUser}=useAuth()
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending,setIsPending]=useState<boolean>(false)
  const router = useRouter();

  const onChange =
    (name: "email" | "password") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (errorMsg) setErrorMsg(null);
      setForm((s) => ({ ...s, [name]: e.target.value }));
    };

  const toggleRemember = () =>
    setForm((s) => ({ ...s, remember: !s.remember }));

  const handleForgotPass = ()=>{
    if(!form.email.trim()){
      setErrorMsg('Please provide an email to change the password.')
      return;
    }
    setForm((p)=>({...p, password:''}))
    setForgotPassClicked(true)
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (errorMsg) return;
    setErrorMsg(null);

    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      setErrorMsg("Email and password are required");
      return;
    }

    try {
      setIsPending(true)
      const res = await loginApi({ email, password });
      // const options: Cookies.CookieAttributes = {
      //   secure: true,
      //   sameSite: "none",
      // };
      // if (form.remember) {
      //   options.expires = 7; // days
      // }
      // Cookies.set("token", res.token, options);
      setUser(res.data)
      showToast(true,'User found.')
      router.push("/admin");
    } catch (err: any) {
      setErrorMsg(        err      );
    }finally{
      setIsPending(false)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Email
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            name="email"
            value={form.email}
            onChange={onChange("email")}
            autoComplete="email"
            className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
        </div>
      </div>

      <div className="mb-5">
        <label
          htmlFor="password"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={form.password}
            onChange={onChange("password")}
            className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between gap-2 py-2">
        <label
          htmlFor="remember"
          className="flex cursor-pointer select-none items-center font-satoshi text-base font-medium text-dark dark:text-white"
        >
          <input
            type="checkbox"
            name="remember"
            id="remember"
            checked={form.remember}
            onChange={toggleRemember}
            className="peer sr-only"
          />
          <span
            className={`mr-2.5 inline-flex h-5.5 w-5.5 items-center justify-center rounded-md border border-primary bg-white text-white text-opacity-0 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-opacity-100 dark:border-stroke-dark dark:bg-white/5 ${
              form.remember ? "bg-primary" : ""
            }`}
          >
            <svg
              width="10"
              height="7"
              viewBox="0 0 10 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.70692 0.292787C9.89439 0.480314 9.99971 0.734622 9.99971 0.999786C9.99971 1.26495 9.89439 1.51926 9.70692 1.70679L4.70692 6.70679C4.51939 6.89426 4.26508 6.99957 3.99992 6.99957C3.73475 6.99957 3.48045 6.89426 3.29292 6.70679L0.292919 3.70679C0.110761 3.51818 0.00996641 3.26558 0.0122448 3.00339C0.0145233 2.74119 0.119692 2.49038 0.3051 2.30497C0.490508 2.11956 0.741321 2.01439 1.00352 2.01211C1.26571 2.00983 1.51832 2.11063 1.70692 2.29279L3.99992 4.58579L8.29292 0.292787C8.48045 0.105316 8.73475 0 8.99992 0C9.26508 0 9.51939 0.105316 9.70692 0.292787Z"
                fill="currentColor"
              />
            </svg>
          </span>
          Remember me
        </label>
        {/* <button
          onClick={handleForgotPass}
          className="select-none font-satoshi text-base font-medium text-black/80 cursor-pointer
 underline duration-300 hover:text-hoverPrimary dark:text-black/80 dark:hover:text-primary"
        >
          Forgot Password?
        </button> */}
      </div>

      {errorMsg && (
        <p className="mb-2 text-sm text-red-600" role="alert">
          {errorMsg}
        </p>
      )}

      <div className="mb-4.5">
        <button
          type="submit"
          disabled={isPending || (errorMsg ? true : false)}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-hoverPrimary disabled:bg-primary/50 disabled:cursor-not-allowed"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </button>
      </div>
    </form>
  );
}
