'use client'
import { useSession, signOut } from "next-auth/react";

const UserProfile = () => {
    const { data: session } = useSession()
    console.log(session);

    return (
        <div className="h-[60vh] flex flex-col justify-around items-center  text-2xl">

            <h1 className="text-xl font-medium">PROFILE PAGE</h1>
            <h1 className="text-lg">Welcome! -
                {session &&
                    <span className="bg-green rounded-full px-4 py-2 mx-2 font-semibold italic">{session.user?.email} </span>
                }
            </h1>

            <button className="py-2 px-6 bg-green rounded-xl font-semibold"
                onClick={() => signOut()}
            >
                Logout
            </button>
        </div >
    );
}

export default UserProfile;