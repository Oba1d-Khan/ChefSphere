import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
    return (
        <nav>
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <div>
                    <Link href="/" className="font-lobster text-xl" >
                        ChefSphere <span className="text-orange">.</span>
                    </Link>
                </div>

                <div className="hidden m-0 self-stretch md:flex flex-row items-start justify-between gap-[1.25rem] text-left text-[1rem] text-black" >

                    <Link href="/" className="relative tracking-[-0.02em] font-medium inline-block min-w-[2.813rem]">
                        Home
                    </Link>
                    <Link href="/recipes" className="relative tracking-[-0.02em] font-medium inline-block min-w-[3.688rem]">
                        Recipes
                    </Link>
                    <Link href="/chat" className="relative tracking-[-0.02em] font-medium inline-block min-w-[2.25rem]">
                        Chat
                    </Link>
                    <Link href="/contact" className="relative tracking-[-0.02em] font-medium inline-block min-w-[3.75rem]">
                        Contact
                    </Link>
                    <Link href="/about" className="relative tracking-[-0.02em] font-medium inline-block min-w-[4.188rem] whitespace-nowrap">
                        About us
                    </Link>
                </div>

            </div>
        </nav >
    );
};

export default Navbar;
