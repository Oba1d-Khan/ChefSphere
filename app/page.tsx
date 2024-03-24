import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-8 justify-around p-24">
      <h1>
        Welcome to <span className="font-lobster text-lg">ChefSphere!</span>
      </h1>
      <div className="flex gap-10">
        <Link href="/login" className="py-4 px-8 bg-green-700 rounded-lg">Login</Link>
        <Link href="/signup" className="py-4 px-8 bg-darkslategray rounded-lg">Signup</Link>
      </div>
    </main>
  );
}
