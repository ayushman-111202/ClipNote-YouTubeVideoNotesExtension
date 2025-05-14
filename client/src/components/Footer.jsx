"use client"
import { IconBrandFacebook, IconBrandGithub, IconBrandInstagram, IconBrandLinkedin, IconBrandX } from '@tabler/icons-react';
import React from 'react';
import Link from 'next/link';

const Footer = () => {
    const github_url = process.env.NEXT_PUBLIC_GITHUB_URI;
    const linkedin_url = process.env.NEXT_PUBLIC_LINKEDIN_URI;
    const facebook_url = process.env.NEXT_PUBLIC_FACEBOOK_URI;
    const instagram_url = process.env.NEXT_PUBLIC_INSTAGRAM_URI;
    const twitter_url = process.env.NEXT_PUBLIC_TWITTER_URI;

    return (
        <footer className="bg-white dark:bg-gray-800 shadow-md">
            <div className="mx-auto max-w-screen-xl px-4 pb-6 pt-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-md">
                    <h2 className="block text-center text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                        Stay Updated with ClipNote
                    </h2>
                    <p className="mt-2 text-center text-gray-600 dark:text-gray-300 text-sm">
                        Subscribe to get notified about latest updates and new extensions
                    </p>
                    <form className="mt-6">
                        <div className="relative max-w-full">
                            <label className="sr-only" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="w-full rounded-lg border border-gray-300 bg-white dark:bg-gray-700 p-3 pr-32 text-sm font-medium dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="mail"
                                type="email"
                                placeholder="your@email.com"
                            />
                            <button className="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg bg-blue-500 text-white px-4 py-2 text-sm font-medium transition hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                                Subscribe
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
                    <div className="md:col-span-2">
                        <div className="flex items-center">
                            <img className="h-10 w-10" src="/logo_clipnote.png" alt="logo" />
                            <h1 className="text-xl font-bold px-2 text-gray-800 dark:text-white">ClipNote</h1>
                        </div>
                        <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm">
                            Follow our social handles to keep yourself updated about add-ons, updates, events, incoming versions, patches and many more...
                        </p>
                        <div className="mt-6 flex gap-5">
                            <Link
                                className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
                                href={github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span className="sr-only">Github</span>
                                <IconBrandGithub size={22} />
                            </Link>
                            <Link
                                className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
                                href={linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span className="sr-only">LinkedIn</span>
                                <IconBrandLinkedin size={22} />
                            </Link>
                            <Link
                                className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
                                href={facebook_url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span className="sr-only">Facebook</span>
                                <IconBrandFacebook size={22} />
                            </Link>
                            <Link
                                className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
                                href={instagram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span className="sr-only">Instagram</span>
                                <IconBrandInstagram size={22} />
                            </Link>
                            <Link
                                className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
                                href={twitter_url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span className="sr-only">Twitter</span>
                                <IconBrandX size={22} />
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-medium text-gray-900 dark:text-white text-lg">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    className="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200 text-sm"
                                    href="/room"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200 text-sm"
                                    href="/about"
                                >
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200 text-sm"
                                    href="/guide"
                                >
                                    Guide
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200 text-sm"
                                    href="/contact"
                                >
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-medium text-gray-900 dark:text-white text-lg">Help & Support</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    className="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200 text-sm"
                                    href="/privacy"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200 text-sm"
                                    href="/terms"
                                >
                                    Terms and Conditions
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200 text-sm"
                                    href="/contact"
                                >
                                    Get in Touch
                                </Link>
                            </li>
                            <li>
                                <Link
                                    className="text-gray-600 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200 text-sm"
                                    href="/support"
                                >
                                    Support
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
                    <div className="text-center sm:flex sm:justify-between sm:text-left">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            ClipNote - A Chrome Based Video Note Extension Cum Website For Youtube
                        </p>
                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                            © 2025 ClipNote. All rights reserved.
                        </p>
                    </div>
                    <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Created with ❤️ by{" "}
                        <Link
                            href={ linkedin_url }
                            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Ayushman Shukla
                        </Link>
                        {" "}and co-powered by{" "}
                        <Link
                            href='#'
                            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                        >
                            Digipodium
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;