"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NextResponse } from "next/server";
import { useState } from "react";

const LoginPage = () => {
    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const router = useRouter();
    const onLogin = async () => {
        try {
            const response = await axios.post("/api/users/login", user)
            router.push("/chat")
        } catch (error: any) {
            return error.message;
        }
    };

    return (
        <div className="flex flex-col gap-6 my-10 items-center justify-center">
            <h1 className="font-bold text-xl ">Login</h1>
            <hr />

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

            <button className="py-2 px-6 bg-blue-500 rounded-xl"
                onClick={onLogin}
            >
                Login
            </button>

            <Link className="underline" href="/signup" >
                New User? Register here!
            </Link>
        </div>
    );
};

export default LoginPage;
