// app/not-found.tsx (Next.js 13 app router)

"use client";

import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 px-4 text-center">
            {/* Logo */}
            <div className="mb-8">
                <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={150}
                    height={150}
                    className="mx-auto h-16 w-auto"
                />
            </div>

            {/* Main message */}
            <h1 className="text-5xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-lg text-gray-600 mb-6">
                Oops! The page you are looking for does not exist.
            </p>

            {/* Navigation button */}
            <Link
                href="/"
                className="inline-block rounded-lg bg-yellow-400 px-6 py-3 text-white font-medium shadow-lg transition hover:bg-yellow-400/90"
            >
                Go Back Home
            </Link>

            {/* Optional illustration */}
            <div className="mt-12 max-w-sm">
                <Image
                    src="/not-found.png"
                    alt="Not Found Illustration"
                    width={400}
                    height={300}
                    className="mx-auto"
                />
            </div>
        </div>
    );
}
