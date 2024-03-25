"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";



const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState({
    email: "",
    password: "",
  });


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!user.email || !user.password) {
        setError("please fill all the fields");
        return;
      }
      const res = await signIn("credentials", {
        email: user.email,
        password: user.password,
        redirect: false,
      });

      if (res?.error) {
        console.log(res);
        setError("error");
      }
      setError("");
      router.push("/profile");

    } catch (error) {
      console.log(error);
      setError("")
    } finally {
      setLoading(false);
      setUser({
        email: "",
        password: ""
      })
    }
  }

  return (
    <section className="max-w-[80vw] mx-auto py-20 ">
      <div>
        <h1 className="text-[64px] text-center tracking-[-0.04em] font-semibold text-black pb-20 ">
          Log In
        </h1>
      </div>

      <div className=" flex flex-col md:flex-row md:justify-center md:items-center gap-20">
        <div className=" rounded-2xl bg-gradient-to-b from-white to-green ">
          <Image
            src="/images/chef-2.png"
            width={500}
            height={500}
            alt="chef"
            className="object-cover  md:max-w-[30vw]"
          />
        </div>

        <div className="py-12">
          <form className="w-[20rem] mx-auto" onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block mb-2 text-xs font-medium text-gray-900  uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="shadow-sm bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                placeholder="Your email address..."
                required
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            </div>
            <div className="mb-5">
              <label className="block mb-2 text-xs font-medium text-gray-900 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="shadow-sm bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                placeholder="Your Password"
                required
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}

              />
            </div>

            <div className="flex justify-center items-center">
              <button
                type="submit"
                className="text-white bg-black hover:bg-black/35 font-medium rounded-xl text-sm px-12 py-5 text-center "
              >
                Login
              </button>
            </div>

            <div className="flex gap-2 py-10 items-center justify-center">
              <p>Don&apos;t have an account?</p>
              <Link href="/signup" className="text-orange font-medium">Sign Up</Link>
            </div>
          </form>
        </div>
      </div>


    </section>
  );
};

export default LoginPage;
