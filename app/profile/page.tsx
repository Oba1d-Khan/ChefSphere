'use client'
import { useSession, signOut } from "next-auth/react";

const UserProfile = () => {
    const { data: session } = useSession()
    console.log(session);

    return (
        <div className="h-screen flex flex-col justify-around items-center border border-gray-200 text-2xl">

            <h1>PROFILE PAGE</h1>
            <h1 className="">Welcome! -
                {session &&
                    <span className="bg-orange rounded-full px-4 py-2 mx-2 font-semibold italic">{session.user?.email} </span>
                }
            </h1>

            <button className="py-2 px-6 bg-blue-500 rounded-xl"
                onClick={() => signOut()}
            >
                Logout
            </button>
        </div >
    );
}

export default UserProfile;