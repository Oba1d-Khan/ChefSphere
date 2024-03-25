"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const SignupPage = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (
      user.username.length > 6 &&
      user.password.length > 6 &&
      user.email.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }

  }, [user]);

  const router = useRouter();
  const onSignUp = async () => {
    try {
      const response = await axios.post("/api/users/signup", user);
      router.push("/login")
    } catch (error: any) {
      console.log(error.message);

    }
  };

  return (
    <section className="max-w-[80vw] mx-auto py-20 ">
      <div>
        <h1 className="text-[64px] text-center tracking-[-0.04em] font-semibold text-black pb-20">
          Sign Up
        </h1>
      </div>

      <div className=" flex flex-col md:flex-row md:justify-center md:items-center gap-20">
        <div className=" rounded-3xl bg-gradient-to-b from-white to-green ">
          <Image
            src="/images/chef-1.png"
            width={400}
            height={400}
            alt="chef"
            className="object-cover  md:max-w-[20vw]"
          />
        </div>

        <div className="py-12">
          <form className="w-[20rem] mx-auto " onSubmit={onSignUp}>
            <div className="mb-5">
              <label className="block mb-2 text-xs font-medium text-gray-700  uppercase tracking-wider ">
                Name
              </label>
              <input
                type="name"
                className="shadow-sm bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
                placeholder="Enter your name..."
                required
                onChange={(e) => setUser({ ...user, username: e.target.value })}
              />
            </div>

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
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </div>

            <div className="flex justify-center items-center">
              <button
                type="submit"
                className="text-white bg-black hover:bg-black/35 font-medium rounded-xl text-sm px-12 py-5 text-center "
              >
                SignUp
              </button>
            </div>

            <div className="flex gap-2 py-10 items-center justify-center">
              <p>Already have an account?</p>
              <Link href="/login" className="text-orange font-medium">Log In</Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );

};

export default SignupPage;