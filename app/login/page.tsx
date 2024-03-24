"use client";

import axios from "axios";
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
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6 my-10 items-center justify-center">
                <h1 className="font-bold text-xl ">Login</h1>
                <hr />
                <label htmlFor="email">Email:</label>
                <input
                    className="p-3 rounded-lg text-black"
                    id="email"
                    type="text"
                    placeholder="Enter Email..."
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                />

                <label htmlFor="password">Password:</label>
                <input
                    className="p-3 rounded-lg text-black"
                    id="password"
                    type="text"
                    placeholder="Enter Password..."
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                />

                <button className="py-2 px-6 bg-blue-500 rounded-xl"
                    type="submit"
                >
                    Login
                </button>

                <Link className="underline" href="/signup" >
                    New User? Register here!
                </Link>
            </div >
        </form >
    );
};

export default LoginPage;
