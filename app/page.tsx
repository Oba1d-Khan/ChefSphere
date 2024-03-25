import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-8 justify-around p-24">
      <h1 className="text-lg">
        Welcome to <span className="font-lobster ">ChefSphere!</span>
      </h1>
      <div className="flex gap-10">
        <Link href="/login" className="py-4 px-8 bg-green rounded-lg font-semibold">Login</Link>
        <Link href="/signup" className="py-4 px-8 bg-green rounded-lg font-semibold">Signup</Link>
      </div>
    </main>
  );
}
