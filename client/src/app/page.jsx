// import { IconArrowUp, IconBrandChrome, IconBrandFacebook, IconBrandGithub, IconBrandInstagram, IconBrandLinkedin, IconBrandX, IconBrandYoutube } from '@tabler/icons-react';
// import Link from 'next/link';
// import React from 'react';

// const Home = () => {

//   return (
//     <div className='bg-white dark:bg-gray-900'>
//       <header className='h-full flex flex-col xl:flex-row'>
//         <section className='w-full p-6 md:p-48'>

//           <div>
//             <h1 className='font-extrabold text-4xl sm:text-5xl md:text-6xl xl:text-7xl text-blue-600 dark:text-white'>
//               Your Digital Notes Manager <br /> Welcomes You!
//             </h1>
//             <p className='text-black dark:text-gray-400 mt-4 text-lg sm:text-xl md:text-2xl'>
//               Developed for learners to easily make video notes and get back to them quickly.
//             </p>
//             <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 mt-4">
//               <Link className='flex items-center justify-center gap-4 bg-slate-700 font-semibold text-white text-2xl sm:text-3xl w-full sm:w-1/3 rounded-xl mt-4 hover:text-blue-300 dark:hover:text-blue-400'
//                 href='/signup'
//               >
//                 <button className='flex items-center justify-center px-2 py-2 gap-2'>
//                   Get Started <IconArrowUp className='rotate-90' />
//                 </button>
//               </Link>
//             </div>
//           </div>

//           <div className="flex flex-col mt-16 sm:mt-20 gap-5">
//             <p className='text-gray-700 dark:text-gray-300 text-2xl sm:text-3xl'>Have a proper management of all your video notes</p>
//             <p className='text-gray-700 dark:text-gray-300 text-base sm:text-lg xl:text-xl xl:pr-32'>
//               Elevate your YouTube experience with ClipNote: seamlessly clip, note, and organize crucial parts of any video for effortless learning and sharing.
//               Transform how you take notes and never miss a key moment again!
//             </p>
//             <p className='text-gray-700 dark:text-gray-300 text-center text-lg md:text-start sm:text-xl mt-4'>Our Socials:</p>
//             <ul className='flex flex-wrap gap-8 justify-center sm:justify-start'>
//               <li><a href="https://www.github.com" target='_blank' ><IconBrandGithub size={40} className='text-purple-600 hover:text-blue-950 dark:hover:text-blue-400' /></a></li>
//               <li><a href="https://www.linkedin.com" target='_blank' ><IconBrandLinkedin size={40} className='text-purple-600 hover:text-blue-950 dark:hover:text-blue-400' /></a></li>
//               <li><a href="https://www.youtube.com" target='_blank' ><IconBrandYoutube size={40} className='text-purple-600 hover:text-blue-950 dark:hover:text-blue-400' /></a></li>
//               <li><a href="https://www.instagram.com" target='_blank' ><IconBrandInstagram size={40} className='text-purple-600 hover:text-blue-950 dark:hover:text-blue-400' /></a></li>
//               <li><a href="https://www.chromewebstore.google.com" target='_blank' ><IconBrandChrome size={40} className='text-purple-600 hover:text-blue-950 dark:hover:text-blue-400' /></a></li>
//               <li><a href="https://www.x.com" target='_blank' ><IconBrandX size={40} className='text-purple-600 hover:text-blue-950 dark:hover:text-blue-400' /></a></li>
//               <li><a href="https://www.facebook.com" target='_blank' ><IconBrandFacebook size={40} className='text-purple-600 hover:text-blue-950 dark:hover:text-blue-400' /></a></li>
//             </ul>
//           </div>
//         </section>

//         <aside className="w-full xl:w-1/3 flex justify-center items-center">
//           {/* Add any content for the aside if necessary */}
//         </aside>
//       </header>
//     </div>
//   );
// };

// export default Home;

// {/* <div className='border border-red-500'>
//           <img src="heroimage.jpeg" alt="Hero Image" className='w-full h-auto mt-8' />
//         </div> */}


'use client';

import { IconArrowUp, IconBrandChrome, IconBrandFacebook, IconBrandGithub, IconBrandInstagram, IconBrandLinkedin, IconBrandX, IconBrandYoutube } from '@tabler/icons-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

const Home = () => {
  const imgRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return (
    <div className='bg-white dark:bg-gray-900'>
      <header className='h-full flex flex-col xl:flex-row'>
        {/* Left Section */}
        <section className='w-2/3 p-6 md:p-48'>

          <div>
            <h1 className='font-extrabold text-4xl sm:text-5xl md:text-6xl xl:text-7xl text-blue-600 dark:text-white'>
              Your Digital Notes Manager <br /> Welcomes You!
            </h1>
            <p className='text-black dark:text-gray-400 mt-4 text-lg sm:text-xl md:text-2xl'>
              Developed for learners to easily make video notes and get back to them quickly.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 mt-4">
              <Link
                className='flex items-center justify-center gap-4 bg-slate-700 font-semibold text-white text-2xl sm:text-3xl w-full sm:w-1/3 rounded-xl mt-4 hover:text-blue-300 dark:hover:text-blue-400 transition-transform duration-300 ease-out hover:scale-105'
                href='/signup'
              >
                <button className='flex items-center justify-center px-2 py-2 gap-2'>
                  Get Started <IconArrowUp className='rotate-90' />
                </button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col mt-16 sm:mt-20 gap-5">
            <p className='text-gray-700 dark:text-gray-300 text-2xl sm:text-3xl'>Have a proper management of all your video notes</p>
            <p className='text-gray-700 dark:text-gray-300 text-base sm:text-lg xl:text-xl xl:pr-32'>
              Elevate your YouTube experience with ClipNote: seamlessly clip, note, and organize crucial parts of any video for effortless learning and sharing.
              Transform how you take notes and never miss a key moment again!
            </p>
            <p className='text-gray-700 dark:text-gray-300 text-center text-lg md:text-start sm:text-xl mt-4'>Our Socials:</p>
            <ul className='grid grid-cols-3 gap-8 justify-center sm:justify-start'>
              <li><a href="https://www.github.com" target='_blank'><IconBrandGithub size={40} className='text-purple-600 hover:text-blue-950 dark:hover:text-blue-400' /></a></li>
              <li><a href="https://www.linkedin.com" target='_blank'><IconBrandLinkedin size={40} className='text-purple-600 hover:text-blue-950 dark:hover:text-blue-400' /></a></li>
              <li><a href="https://www.youtube.com" target='_blank'><IconBrandYoutube size={40} className='text-purple-600 hover:text-blue-950 dark:hover:text-blue-400' /></a></li>
              <li><a href="https://www.instagram.com" target='_blank'><IconBrandInstagram size={40} className='text-purple-600 hover:text-blue-950 dark:hover:text-blue-400' /></a></li>
              <li><a href="https://www.chromewebstore.google.com" target='_blank'><IconBrandChrome size={40} className='text-purple-600 hover:text-blue-950 dark:hover:text-blue-400' /></a></li>
              <li><a href="https://www.x.com" target='_blank'><IconBrandX size={40} className='text-purple-600 hover:text-blue-950 dark:hover:text-blue-400' /></a></li>
              <li><a href="https://www.facebook.com" target='_blank'><IconBrandFacebook size={40} className='text-purple-600 hover:text-blue-950 dark:hover:text-blue-400' /></a></li>
            </ul>
          </div>

        </section>

        {/* Right Side Image with Scroll-based Animation + Hover Zoom */}
        <aside className="w-full xl:w-1/3 flex justify-center items-center pb-24 pr-8">
          <img
            ref={imgRef}
            src="/heroimage.jpeg"
            alt="Hero Image"
            className={`w-full h-auto object-contain rounded-xl shadow-lg transform transition-all duration-1000 ease-out
              ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-90'}
              hover:scale-105 hover:shadow-2xl
            `}
          />
        </aside>

      </header>
    </div>
  );
};

export default Home;
