"use client"
import React from 'react';
import { IconInfoCircle, IconBuilding, IconUsers, IconHistory, IconTargetArrow } from '@tabler/icons-react';

const About = () => {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-16">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-white mb-4">About ClipNote</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Learn about our journey to create the ultimate video note-taking experience for learners and content creators.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-blue-50 dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <div className="flex items-center mb-6">
              <IconInfoCircle size={32} className="text-blue-600 dark:text-blue-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Our Mission</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              ClipNote was born from a simple idea: make learning from videos more efficient and effective. 
              We're dedicated to helping students, professionals, and anyone who learns from video content 
              to better organize, reference, and retain important information from the videos they watch.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <div className="flex items-center mb-6">
              <IconHistory size={32} className="text-blue-600 dark:text-blue-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Our Story</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Founded in 2024, ClipNote started as a passion project by students who were frustrated with 
              the lack of tools for taking effective notes while watching educational videos. What began as 
              a simple Chrome extension has grown into a comprehensive platform for video-based learning.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <div className="flex items-center mb-6">
              <IconTargetArrow size={32} className="text-blue-600 dark:text-blue-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Our Vision</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              We envision a world where digital learning is seamless and efficient. Our goal is to build 
              tools that bridge the gap between watching videos and truly understanding their content, 
              making educational videos even more valuable for learners of all types.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <div className="flex items-center mb-6">
              <IconUsers size={32} className="text-blue-600 dark:text-blue-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Our Team</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              Behind ClipNote is a dedicated team of developers, designers, and educators who are passionate 
              about improving digital learning experiences. We combine technical expertise with educational 
              insights to create tools that truly enhance the learning process.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-blue-600 dark:text-white mb-8">What Makes ClipNote Special</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Smart Timestamps</h3>
              <p className="text-gray-600 dark:text-gray-300">Create notes linked directly to specific moments in videos for easy reference.</p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Organized Collections</h3>
              <p className="text-gray-600 dark:text-gray-300">Keep your video notes organized by topics, courses, or any system that works for you.</p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Seamless Experience</h3>
              <p className="text-gray-600 dark:text-gray-300">Access your notes across devices with our Chrome extension and web app.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-blue-600 dark:bg-blue-800 text-white rounded-lg shadow-xl p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your video learning?</h2>
          <p className="text-xl mb-6">Join thousands of learners who are already using ClipNote to enhance their study experience.</p>
          <button className="bg-white text-blue-600 hover:bg-blue-100 font-bold py-3 px-6 rounded-lg transition duration-200">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;