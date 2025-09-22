// src/components/Admin/Auth/SigninWithPassword.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/useUsers";
import { formDataProps } from "./Signin";

export default function ForgotPassword({
  form,
  setForm,
  setForgotPassClicked
}: {
  form: formDataProps;
  setForm: React.Dispatch<React.SetStateAction<formDataProps>>;
  setForgotPassClicked: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [allowEmailToEdit,setAllowEmailToEdit]=useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();
  const { mutateAsync, isPending } = useLogin();

  const onChange =
    (name: "email" | "password") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (errorMsg) setErrorMsg(null);
      setForm((s) => ({ ...s, [name]: e.target.value }));
    };

    const handleGoback=()=>{
        setForgotPassClicked(false)
        setForm((p)=>({...p,password:''}))
    }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (errorMsg) return;
    setErrorMsg(null);

    if (!form.password) {
      setErrorMsg("Email and password are required");
      return;
    }

    try {
      const res = await mutateAsync({ email:form.email, password:form.password });

      const options: Cookies.CookieAttributes = {
        secure: true,
        sameSite: "none",
      };
      Cookies.set("token", res.token, options);

      // Redirect
      router.push("/admin");
    } catch (err: any) {
      console.log(err);
      setErrorMsg(
        err.response.data?.error || err?.message || "Invalid credentials"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button
        onClick={handleGoback}
        className="text-primary hover:underline mb-2"
      >
        Go Back
      </button>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Email
        </label>
        <div className="relative w-full flex flex-col">
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            name="email"
            value={form.email}
            readOnly={!allowEmailToEdit}
            onChange={onChange("email")}
            autoComplete="email"
            className={`w-full rounded-lg border border-stroke py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary ${allowEmailToEdit ? 'bg-transparent' : 'bg-gray-200'}`}
          />
          <button
            onClick={() => setAllowEmailToEdit((p) => !p)}
            className="text-primary self-end mt-1 hover:text-hoverPrimary hover:underline cursor-pointer"
          >
            {!allowEmailToEdit ? "Edit email" : "Editing"}
          </button>
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
            placeholder="Enter new password"
            autoComplete="current-password"
            value={form.password}
            onChange={onChange("password")}
            className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
        </div>
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
          {isPending ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
}
