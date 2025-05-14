"use client"
import React from 'react';
import { IconMail, IconPhone, IconMapPin, IconBrandTwitter, IconBrandLinkedin, IconBrandInstagram } from '@tabler/icons-react';

const Contact = () => {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen py-16">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-white mb-4">Get In Touch</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Have questions or feedback about ClipNote? We'd love to hear from you! Reach out through any of the channels below.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Send Us a Message</h2>
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="How can we help you?"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us how we can help..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-blue-50 dark:bg-gray-800 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Contact Information</h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <IconMail size={24} className="text-blue-600 dark:text-blue-400 mr-4 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Email</h3>
                  <p className="text-gray-600 dark:text-gray-300">support@clipnote.com</p>
                  <p className="text-gray-600 dark:text-gray-300">info@clipnote.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <IconPhone size={24} className="text-blue-600 dark:text-blue-400 mr-4 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Phone</h3>
                  <p className="text-gray-600 dark:text-gray-300">+1 (123) 456-7890</p>
                  <p className="text-gray-600 dark:text-gray-300">+1 (987) 654-3210</p>
                </div>
              </div>

              <div className="flex items-start">
                <IconMapPin size={24} className="text-blue-600 dark:text-blue-400 mr-4 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Office Address</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    123 Innovation Way<br />
                    Tech District<br />
                    San Francisco, CA 94107
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    <IconBrandTwitter size={28} />
                  </a>
                  <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    <IconBrandLinkedin size={28} />
                  </a>
                  <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    <IconBrandInstagram size={28} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">How do I install the ClipNote browser extension?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                You can install our extension directly from the Chrome Web Store. Simply search for "ClipNote" or visit our website and click the "Install Extension" button.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Is ClipNote available for other browsers?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Currently, ClipNote is only available for Chrome. We're working on versions for Firefox, Safari, and Edge which will be released in the near future.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">How much does ClipNote cost?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                ClipNote offers a free plan with basic features and a premium plan with advanced features for $5.99/month or $49.99/year.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Can I export my notes?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! ClipNote allows you to export your notes in multiple formats including PDF, Markdown, and plain text.
              </p>
            </div>
          </div>
        </div>

        {/* Map Section (Placeholder) */}
        <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg shadow-md flex items-center justify-center">
          {/* <p className="text-gray-600 dark:text-gray-300">Interactive Map Would Go Here</p> */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3565.110645175942!2d80.81456367622782!3d26.6769435767886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bf7fb3f363263%3A0x4cd7177c21604c9b!2sMGIMT%20%7C%7C%20M.G%20Institute%20of%20Management%20%26%20Technology!5e0!3m2!1sen!2sin!4v1745649448859!5m2!1sen!2sin"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className='w-full h-full'
          />

        </div>

      </div>
    </div>
  );
};

export default Contact;