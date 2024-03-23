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
        <div className="flex flex-col gap-6 my-10 items-center justify-center">
            <h1 className="m-0 relative text-inherit tracking-[-0.04em] font-semibold font-inherit whitespace-nowrap mq450:text-[2.375rem] mq1000:text-[3.188rem]">
                Sign Up
            </h1>

            <label htmlFor="username" >Name</label>
            <input
                className="p-3 rounded-lg text-black"
                id="username"
                type="text"
                placeholder="Enter Username..."
                onChange={(e) => setUser({ ...user, username: e.target.value })}
            />

            <label htmlFor="email">Email:</label>
            <input
                className="p-3 rounded-lg text-black"
                id="email"
                type="text"
                placeholder="Enter Email..."
                onChange={(e) => setUser({ ...user, email: e.target.value })}
            />

            <label htmlFor="password">Password:</label>
            <input
                className="p-3 rounded-lg text-black"
                id="password"
                type="text"
                placeholder="Enter Password..."
                onChange={(e) => setUser({ ...user, password: e.target.value })}
            />

            <button
                className={`${buttonDisabled
                    ? "py-2 px-6 bg-blue-500 rounded-xl opacity-45 cursor-not-allowed"

                    : "py-2 px-6 bg-blue-500 rounded-xl "
                    }`}
                onClick={onSignUp}
            >
                SignUp
            </button>

            <Link className="underline " href="/login">
                Already have an account?
            </Link>
        </div >
    );
};

export default SignupPage;
