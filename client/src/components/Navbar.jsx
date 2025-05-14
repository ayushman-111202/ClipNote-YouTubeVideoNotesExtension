// "use client"
// import React from 'react';
// import { IconAlbum, IconBrandYoutube, IconHome2, IconLogin2, IconSearch, IconUserCircle } from '@tabler/icons-react';
// import Link from 'next/link';

// const Navbar = ({ children }) => {
//     return (
//         <div className='z-999 dark:bg-gray-900'>
//             <nav className='px-2 bg-blue-200 h-[3rem] flex items-center justify-between dark:bg-gray-800'>
//                 <div className='order-1'>
//                     <Link className='flex items-center justify-center' href='/'>
//                         <img className='h-10 w-10' src="/logo_clipnote.png" alt="logo" />
//                         <h1 className='hidden md:text-md font-bold px-1 text-rose-700 dark:text-rose-300'>ClipNote</h1>
//                     </Link>
//                 </div>

//                 <div className='hidden md:flex items-center justify-center gap-4 order-2'>
//                     <ul className='flex items-center justify-center gap-4 xl:gap-8'>
//                         <Link className='hover:border-b-2 hover:border-red-700 dark:hover:border-red-300 dark:text-gray-200' href='/about'>About</Link>
//                         <Link className='hover:border-b-2 hover:border-red-700 dark:hover:border-red-300 dark:text-gray-200' href='/user/notes'>Notes</Link>
//                         <Link className='hover:border-b-2 hover:border-red-700 dark:hover:border-red-300 dark:text-gray-200' href='/room'>Home</Link>
//                         <Link className='hover:border-b-2 hover:border-red-700 dark:hover:border-red-300 dark:text-gray-200' href='/guide'>Guide</Link>
//                         <Link className='hover:border-b-2 hover:border-red-700 dark:hover:border-red-300 dark:text-gray-200' href='/premium'>Premium</Link>
//                         <Link className='hover:border-b-2 hover:border-red-700 dark:hover:border-red-300 dark:text-gray-200' href='/contact'>Contact</Link>
//                     </ul>

//                     <div className='flex items-center justify-center gap-4'>
//                         <input
//                             type="search"
//                             placeholder="Search"
//                             className='rounded-md p-1 dark:bg-gray-700 dark:text-white dark:placeholder-gray-300'
//                         />
//                         <button>
//                             <IconSearch strokeWidth={4} className='text-white dark:text-gray-200' />
//                         </button>
//                     </div>
//                 </div>

//                 <div className='flex items-center justify-center gap-2 order-2 md:hidden'>
//                     <input
//                         type="search"
//                         placeholder="Search"
//                         className='rounded-md p-1 dark:bg-gray-700 dark:text-white dark:placeholder-gray-300'
//                     />
//                     <button>
//                         <IconSearch strokeWidth={4} className='text-white dark:text-gray-200' />
//                     </button>
//                 </div>

//                 <div className='hidden md:flex items-center justify-center gap-4 order-3'>
//                     <Link href='/login'>
//                         <button className='flex items-center justify-center gap-1 p-1.5 px-3 rounded-lg font-semibold bg-green-400 text-white dark:bg-green-600 dark:text-gray-200'>
//                             Login <IconLogin2 />
//                         </button>
//                     </Link>
//                     <Link href='/signup'>
//                         <button className='flex items-center justify-center gap-1 p-1.5 px-3 rounded-lg font-semibold bg-green-400 text-white dark:bg-green-600 dark:text-gray-200'>
//                             Signup <IconLogin2 />
//                         </button>
//                     </Link>
//                     {children}
//                 </div>
//             </nav>

//             <div className='fixed w-full h-[4rem] bottom-0 bg-blue-500 flex items-center justify-evenly text-blue-200 md:hidden dark:bg-gray-800 dark:text-gray-200'>
//                 <ul className='flex items-center w-full justify-evenly gap-4 xl:gap-8'>
//                     <Link className='hover:border-b-2 hover:border-purple-200 dark:hover:border-purple-400' href='/room'>
//                         <IconHome2 size={40} />
//                     </Link>
//                     <Link className='hover:border-b-2 hover:border-purple-200 dark:hover:border-purple-400' href='/search'>
//                         <IconSearch size={38} />
//                     </Link>
//                     <Link className='hover:border-b-2 hover:border-purple-200 dark:hover:border-purple-400' href='https://www.youtube.com' target='_blank'>
//                         <IconBrandYoutube size={38} className='font-extrabold' />
//                     </Link>
//                     <Link className='hover:border-b-2 hover:border-purple-200 dark:hover:border-purple-400' href='/user/notes'>
//                         <IconAlbum size={40} />
//                     </Link>
//                     <Link className='hover:border-b-2 hover:border-purple-200 dark:hover:border-purple-400' href='/user-profile'>
//                         <IconUserCircle size={40} />
//                     </Link>
//                 </ul>
//             </div>
//         </div>
//     );
// };

// export default Navbar;


"use client"
import React, { useState } from 'react';
import { IconAlbum, IconBrandYoutube, IconHome2, IconLogin2, IconSearch, IconUserCircle, IconNotes, IconSettings, IconMenu2, IconX } from '@tabler/icons-react';
import Link from 'next/link';

const Navbar = ({ children }) => {
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className='z-50 relative bg-white dark:bg-gray-800 shadow-md'>
            <nav className='px-4 sm:px-6 h-16 flex items-center justify-between'>
                <div className='flex items-center'>
                    <Link className='flex items-center justify-center' href='/'>
                        <img className='h-8 w-8 sm:h-10 sm:w-10' src="/logo_clipnote.png" alt="logo" />
                        <h1 className='text-lg sm:text-xl font-bold px-1 text-gray-800 dark:text-white'>ClipNote</h1>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className='hidden lg:flex items-center justify-center gap-4 flex-1 max-w-2xl ml-8'>
                    <ul className='flex items-center justify-center gap-4 xl:gap-8 flex-1'>
                        <Link className='text-gray-600 hover:text-blue-500 font-medium dark:text-gray-300 dark:hover:text-blue-400 transition duration-200' href='/room'>Home</Link>
                        <Link className='text-gray-600 hover:text-blue-500 font-medium dark:text-gray-300 dark:hover:text-blue-400 transition duration-200' href='/about'>About</Link>
                        <Link className='text-gray-600 hover:text-blue-500 font-medium dark:text-gray-300 dark:hover:text-blue-400 transition duration-200' href='/user/notes'>Notes</Link>
                        <Link className='text-gray-600 hover:text-blue-500 font-medium dark:text-gray-300 dark:hover:text-blue-400 transition duration-200' href='/guide'>Guide</Link>
                        <Link className='text-gray-600 hover:text-blue-500 font-medium dark:text-gray-300 dark:hover:text-blue-400 transition duration-200' href='/premium'>Premium</Link>
                        <Link className='text-gray-600 hover:text-blue-500 font-medium dark:text-gray-300 dark:hover:text-blue-400 transition duration-200' href='/contact'>Contact</Link>
                    </ul>
                </div>

                {/* Desktop Search */}
                <div className='hidden md:flex items-center justify-end gap-2 flex-1'>
                    <div className='relative max-w-xs w-full'>
                        <input
                            type="search"
                            placeholder="Search"
                            className='w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
                        />
                        <IconSearch className='absolute left-3 top-2.5 text-gray-500 dark:text-gray-400' size={18} />
                    </div>
                </div>

                {/* Mobile Search Toggle */}
                <div className='flex md:hidden items-center ml-auto mr-2'>
                    <button
                        onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                        className='p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors'
                    >
                        <IconSearch size={20} className='text-gray-600 dark:text-gray-300' />
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <div className='flex lg:hidden items-center'>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className='p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors'
                    >
                        {mobileMenuOpen ?
                            <IconX size={20} className='text-gray-600 dark:text-gray-300' /> :
                            <IconMenu2 size={20} className='text-gray-600 dark:text-gray-300' />
                        }
                    </button>
                </div>

                {/* Desktop Auth Buttons */}
                <div className='hidden md:flex items-center justify-center gap-3 ml-4'>
                    <Link href='/login'>
                        <button className='flex items-center justify-center gap-1 py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg text-sm sm:text-base font-medium bg-blue-500 text-white hover:bg-blue-600 transition duration-200 dark:bg-blue-600 dark:hover:bg-blue-700'>
                            Login <IconLogin2 size={18} className="hidden sm:block" />
                        </button>
                    </Link>
                    <Link href='/signup'>
                        <button className='flex items-center justify-center gap-1 py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg text-sm sm:text-base font-medium bg-green-500 text-white hover:bg-green-600 transition duration-200 dark:bg-green-600 dark:hover:bg-green-700'>
                            Signup <IconUserCircle size={18} className="hidden sm:block" />
                        </button>
                    </Link>
                    {children}
                </div>
            </nav>

            {/* Mobile Search Bar (Expandable) */}
            {mobileSearchOpen && (
                <div className='md:hidden px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-b border-gray-200 dark:border-gray-600'>
                    <div className='relative'>
                        <input
                            type="search"
                            placeholder="Search ClipNote..."
                            className='w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400'
                            autoFocus
                        />
                        <IconSearch className='absolute left-3 top-2.5 text-gray-500 dark:text-gray-400' size={18} />
                    </div>
                </div>
            )}

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
                <div className='lg:hidden px-4 py-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg'>
                    <ul className='flex flex-col space-y-2 py-2'>
                        <Link className='text-gray-600 hover:text-blue-500 font-medium dark:text-gray-300 dark:hover:text-blue-400 transition duration-200 py-2' href='/room' onClick={() => setMobileMenuOpen(false)}>Home</Link>
                        <Link className='text-gray-600 hover:text-blue-500 font-medium dark:text-gray-300 dark:hover:text-blue-400 transition duration-200 py-2' href='/about' onClick={() => setMobileMenuOpen(false)}>About</Link>
                        <Link className='text-gray-600 hover:text-blue-500 font-medium dark:text-gray-300 dark:hover:text-blue-400 transition duration-200 py-2' href='/user/notes' onClick={() => setMobileMenuOpen(false)}>Notes</Link>
                        <Link className='text-gray-600 hover:text-blue-500 font-medium dark:text-gray-300 dark:hover:text-blue-400 transition duration-200 py-2' href='/guide' onClick={() => setMobileMenuOpen(false)}>Guide</Link>
                        <Link className='text-gray-600 hover:text-blue-500 font-medium dark:text-gray-300 dark:hover:text-blue-400 transition duration-200 py-2' href='/premium' onClick={() => setMobileMenuOpen(false)}>Premium</Link>
                        <Link className='text-gray-600 hover:text-blue-500 font-medium dark:text-gray-300 dark:hover:text-blue-400 transition duration-200 py-2' href='/contact' onClick={() => setMobileMenuOpen(false)}>Contact</Link>
                    </ul>
                    <div className='flex items-center justify-center gap-4 py-4 border-t border-gray-200 dark:border-gray-700 mt-2 md:hidden'>
                        <Link href='/login' className='w-full' onClick={() => setMobileMenuOpen(false)}>
                            <button className='w-full flex items-center justify-center gap-1 py-2 px-4 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-600 transition duration-200 dark:bg-blue-600 dark:hover:bg-blue-700'>
                                Login <IconLogin2 size={18} />
                            </button>
                        </Link>
                        <Link href='/signup' className='w-full' onClick={() => setMobileMenuOpen(false)}>
                            <button className='w-full flex items-center justify-center gap-1 py-2 px-4 rounded-lg font-medium bg-green-500 text-white hover:bg-green-600 transition duration-200 dark:bg-green-600 dark:hover:bg-green-700'>
                                Signup <IconUserCircle size={18} />
                            </button>
                        </Link>
                    </div>
                </div>
            )}

            {/* Mobile Bottom Navigation */}
            <div className='fixed w-full h-16 bottom-0 bg-white border-t border-gray-200 flex items-center justify-evenly text-gray-600 md:hidden dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 shadow-lg z-50'>
                <ul className='flex items-center w-full justify-evenly'>
                    <Link className='flex flex-col items-center justify-center p-2 hover:text-blue-500 dark:hover:text-blue-400 transition duration-200' href='/room'>
                        <IconHome2 size={22} />
                        <span className='text-xs mt-1'>Home</span>
                    </Link>
                    <Link className='flex flex-col items-center justify-center p-2 hover:text-blue-500 dark:hover:text-blue-400 transition duration-200' href='/search'>
                        <IconSearch size={22} />
                        <span className='text-xs mt-1'>Search</span>
                    </Link>
                    <Link className='flex flex-col items-center justify-center p-2 hover:text-blue-500 dark:hover:text-blue-400 transition duration-200' href='https://www.youtube.com' target='_blank'>
                        <IconBrandYoutube size={22} />
                        <span className='text-xs mt-1'>YouTube</span>
                    </Link>
                    <Link className='flex flex-col items-center justify-center p-2 hover:text-blue-500 dark:hover:text-blue-400 transition duration-200' href='/user/notes'>
                        <IconNotes size={22} />
                        <span className='text-xs mt-1'>Notes</span>
                    </Link>
                    <Link className='flex flex-col items-center justify-center p-2 hover:text-blue-500 dark:hover:text-blue-400 transition duration-200' href='/user-profile'>
                        <IconUserCircle size={22} />
                        <span className='text-xs mt-1'>Profile</span>
                    </Link>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;