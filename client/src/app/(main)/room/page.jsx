// import React from 'react';

// const Room = () => {
//   return (
//     <div className="min-h-screen bg-white dark:bg-gray-800">
//       {/* Hero Section */}
//       <section className="pt-8 md:pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-700">
//         <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row md:items-center md:justify-between">
//           <div className="mt-8 md:mt-0 md:mr-8 flex flex-col items-center md:items-start text-center md:text-left">
//             <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">
//               Introducing ClipNote
//             </h1>
//             <p className="text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-300 mb-4">
//               Your Ultimate YouTube Video Note-Taking Extension for Chrome
//             </p>
//             <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl">
//               ClipNote revolutionizes the way you interact with YouTube videos, by allowing you to effortlessly create video notes from specific parts of any YouTube video. Whether you're studying, researching, or just watching for pleasure, ClipNote ensures you never miss any important information.
//             </p>
//             <div className="flex flex-wrap gap-4 justify-center md:justify-start">
//               <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition duration-200 dark:bg-blue-600 dark:hover:bg-blue-700">
//                 Get Started
//               </button>
//               <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition duration-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200">
//                 Learn More
//               </button>
//             </div>
//           </div>
//           <div className="flex justify-center md:justify-end w-full md:w-auto">
//             <img className="h-64 md:h-72 lg:h-80" src="logo_clipnote.png" alt="ClipNote extension logo" />
//           </div>
//         </div>
//       </section>

//       {/* Features Introduction */}
//       <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
//             Cutting-Edge Features for Your Ultimate YouTube Experience
//           </h2>
//           <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
//             Unlock the full potential of your YouTube viewing with our innovative video notes extension. Designed to enhance your productivity and streamline your learning, our extension offers a host of features that cater to your every need.
//           </p>
//         </div>
//       </section>

//       {/* Basic Features */}
//       <section className="py-8 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-xl sm:text-2xl font-bold py-4 px-6 mb-8 bg-blue-500 text-white dark:bg-blue-600 dark:text-white rounded-lg text-center">
//             Basic Features
//           </h2>

//           {/* Feature 1 */}
//           <div className="flex flex-col md:flex-row items-center mb-12 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
//             <div className="w-full md:w-2/3 p-6 md:p-8">
//               <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
//                 1. Time Stamped Notes
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400">
//                 The time-stamped notes feature is a super handy tool for keeping your notes organized with precise timestamps. Add notes at specific points in videos and jump back to them with a single click, making it easier to review important content.
//               </p>
//             </div>
//             <div className="w-full md:w-1/3 p-4 flex justify-center">
//               <img className="rounded-lg shadow-md max-h-56 object-contain" src="timestamp.jpg" alt="Time-stamped notes feature" />
//             </div>
//           </div>

//           {/* Feature 2 */}
//           <div className="flex flex-col-reverse md:flex-row items-center mb-12 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
//             <div className="w-full md:w-1/3 p-4 flex justify-center">
//               <img className="rounded-lg shadow-md max-h-56 object-contain" src="playlist.png" alt="Playlist integration feature" />
//             </div>
//             <div className="w-full md:w-2/3 p-6 md:p-8">
//               <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
//                 2. Playlist Integration
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400">
//                 The playlist integration feature offers a seamless way to enhance your learning and viewing experience. Automatically organize notes by playlist, making it easier to manage content from courses, tutorials, or your favorite channels.
//               </p>
//             </div>
//           </div>

//           {/* Feature 3 */}
//           <div className="flex flex-col md:flex-row items-center mb-12 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
//             <div className="w-full md:w-2/3 p-6 md:p-8">
//               <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
//                 3. Search Functionality
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400">
//                 The search functionality allows you to quickly find your video notes with ease, no matter how many you have. Search across all your notes to instantly locate information from any video you've watched.
//               </p>
//             </div>
//             <div className="w-full md:w-1/3 p-4 flex justify-center">
//               <img className="rounded-lg shadow-md max-h-56 object-contain" src="search.jpeg" alt="Search functionality feature" />
//             </div>
//           </div>

//           {/* Feature 4 */}
//           <div className="flex flex-col-reverse md:flex-row items-center mb-12 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
//             <div className="w-full md:w-1/3 p-4 flex justify-center">
//               <img className="rounded-lg shadow-md max-h-56 object-contain" src="summarize.webp" alt="AI summarization feature" />
//             </div>
//             <div className="w-full md:w-2/3 p-6 md:p-8">
//               <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
//                 4. AI Summarization
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400">
//                 Use AI to automatically summarize your notes, so you can review key information without having to go through all your notes manually. Perfect for quick reviews and studying essential points.
//               </p>
//             </div>
//           </div>

//           {/* Feature 5 */}
//           <div className="flex flex-col md:flex-row items-center mb-12 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
//             <div className="w-full md:w-2/3 p-6 md:p-8">
//               <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
//                 5. Cross Platform Syncing
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400">
//                 Sync your notes across devices so you can access them anytime, anywhere, and on any platform. Start on your desktop and continue on your mobile device without missing a beat.
//               </p>
//             </div>
//             <div className="w-full md:w-1/3 p-4 flex justify-center">
//               <img className="rounded-lg shadow-md max-h-56 object-contain" src="cross-platform.png" alt="Cross platform syncing" />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Premium Features */}
//       <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-xl sm:text-2xl font-bold py-4 px-6 mb-8 bg-green-500 text-white dark:bg-green-600 dark:text-white rounded-lg text-center">
//             Premium Features
//           </h2>

//           {/* Feature 1 */}
//           <div className="flex flex-col md:flex-row items-center mb-12 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
//             <div className="w-full md:w-2/3 p-6 md:p-8">
//               <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
//                 1. Collaboration Tools
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400">
//                 Work together with others to take and share notes directly on YouTube videos. Perfect for study groups, team research, or collaborative learning environments.
//               </p>
//             </div>
//             <div className="w-full md:w-1/3 p-4 flex justify-center">
//               <img className="rounded-lg shadow-md max-h-56 object-contain" src="collaboration.jpeg" alt="Collaboration tools" />
//             </div>
//           </div>

//           {/* Feature 2 */}
//           <div className="flex flex-col-reverse md:flex-row items-center mb-12 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
//             <div className="w-full md:w-1/3 p-4 flex justify-center">
//               <img className="rounded-lg shadow-md max-h-56 object-contain" src="autopause.png" alt="Auto-pause feature" />
//             </div>
//             <div className="w-full md:w-2/3 p-6 md:p-8">
//               <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
//                 2. Auto-Pause
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400">
//                 Auto-pause the video when you add notes to ensure you're always in sync with your note-taking. This intelligent feature helps you focus on capturing important information without missing video content.
//               </p>
//             </div>
//           </div>

//           {/* Feature 3 */}
//           <div className="flex flex-col md:flex-row items-center mb-12 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
//             <div className="w-full md:w-2/3 p-6 md:p-8">
//               <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
//                 3. Export Options
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400">
//                 Export your video notes in different formats like PDF or text for easy sharing and printing. Ideal for creating study guides, sharing research, or archiving important information.
//               </p>
//             </div>
//             <div className="w-full md:w-1/3 p-4 flex justify-center">
//               <img className="rounded-lg shadow-md max-h-56 object-contain" src="convert-to-pdf.jpg" alt="Export to PDF" />
//             </div>
//           </div>

//           {/* Feature 4 */}
//           <div className="flex flex-col-reverse md:flex-row items-center mb-12 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
//             <div className="w-full md:w-1/3 p-4 flex justify-center">
//               <img className="rounded-lg shadow-md max-h-56 object-contain" src="annotations.png" alt="Annotations and highlights" />
//             </div>
//             <div className="w-full md:w-2/3 p-6 md:p-8">
//               <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
//                 4. Annotations and Highlights
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400">
//                 Add annotations and highlights to your notes for better organization and quick reference. Color-code important information, add emphasis to key points, and create visual cues for easier review.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 dark:bg-blue-800">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
//             Ready to Transform Your YouTube Experience?
//           </h2>
//           <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
//             Join thousands of students, researchers, and content creators who are already using ClipNote to enhance their YouTube experience.
//           </p>
//           <div className="flex flex-wrap gap-4 justify-center">
//             <button className="px-8 py-3 bg-white hover:bg-gray-100 text-blue-600 rounded-lg font-medium text-lg transition duration-200">
//               Install Now
//             </button>
//             <button className="px-8 py-3 bg-transparent hover:bg-blue-700 border-2 border-white text-white rounded-lg font-medium text-lg transition duration-200">
//               View Pricing
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Room;

import React from 'react';

const Room = () => {
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-800">
      {/* Hero Section */}
      <section className="pt-8 md:pt-16 pb-12 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row md:items-center md:justify-between">
          <div className="mt-8 md:mt-0 md:mr-8 flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              Introducing ClipNote
            </h1>
            <p className="text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-300 mb-4">
              Your Ultimate YouTube Video Note-Taking Extension for Chrome
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl">
              ClipNote revolutionizes the way you interact with YouTube videos, by allowing you to effortlessly create video notes from specific parts of any YouTube video. Whether you're studying, researching, or just watching for pleasure, ClipNote ensures you never miss any important information.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition duration-200 dark:bg-blue-600 dark:hover:bg-blue-700">
                Get Started
              </button>
              <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition duration-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200">
                Learn More
              </button>
            </div>
          </div>
          <div className="flex justify-center md:justify-end w-full md:w-auto">
            <img className="h-64 md:h-72 lg:h-80" src="logo_clipnote.png" alt="ClipNote extension logo" />
          </div>
        </div>
      </section>

      {/* Features Introduction */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Cutting-Edge Features for Your Ultimate YouTube Experience
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Unlock the full potential of your YouTube viewing with our innovative video notes extension. Designed to enhance your productivity and streamline your learning, our extension offers a host of features that cater to your every need.
          </p>
        </div>
      </section>

      {/* Basic Features */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold py-4 px-6 mb-8 bg-blue-500 text-white dark:bg-blue-600 dark:text-white rounded-lg text-center">
            Basic Features
          </h2>

          {/* Feature 1 - Smart Timestamps */}
          <div className="flex flex-col md:flex-row items-center mb-12 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
            <div className="w-full md:w-2/3 p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                1. Smart Timestamps
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create perfectly synchronized notes with our intelligent timestamp system. ClipNote automatically captures the exact moment in videos when you take notes, allowing you to jump back to crucial points with a single click. Tag important moments with customizable labels like "Key Point," "Definition," or "Example" to organize your learning journey.
              </p>
            </div>
            <div className="w-full md:w-1/3 p-4 flex justify-center">
              <img className="rounded-lg shadow-md max-h-56 object-contain" src="timestamp.jpg" alt="Smart timestamp feature" />
            </div>
          </div>

          {/* Feature 2 - Library Organization */}
          <div className="flex flex-col-reverse md:flex-row items-center mb-12 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
            <div className="w-full md:w-1/3 p-4 flex justify-center">
              <img className="rounded-lg shadow-md max-h-56 object-contain" src="playlist.png" alt="Library organization feature" />
            </div>
            <div className="w-full md:w-2/3 p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                2. Library Organization
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Keep your video notes meticulously organized with our intuitive library system. ClipNote automatically categorizes notes by channel, playlist, and custom folders you create. Add tags, stars, and priority flags to quickly filter and find exactly what you need. The perfect solution for courses, research projects, or content curation.
              </p>
            </div>
          </div>

          {/* Feature 3 - Universal Search */}
          <div className="flex flex-col md:flex-row items-center mb-12 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
            <div className="w-full md:w-2/3 p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                3. Universal Search
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Find any information in seconds with our powerful search engine. ClipNote indexes all your notes, timestamps, tags, and even video transcripts to deliver instant results. Use advanced filters to narrow by date, channel, or content type. Never waste time scrolling through videos again – jump directly to the knowledge you need.
              </p>
            </div>
            <div className="w-full md:w-1/3 p-4 flex justify-center">
              <img className="rounded-lg shadow-md max-h-56 object-contain" src="search.jpeg" alt="Universal search feature" />
            </div>
          </div>

          {/* Feature 4 - AI Note Assistant */}
          <div className="flex flex-col-reverse md:flex-row items-center mb-12 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
            <div className="w-full md:w-1/3 p-4 flex justify-center">
              <img className="rounded-lg shadow-md max-h-56 object-contain" src="summarize.webp" alt="AI Note Assistant feature" />
            </div>
            <div className="w-full md:w-2/3 p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                4. AI Note Assistant
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Let artificial intelligence enhance your notes with our smart assistant. ClipNote can automatically generate summaries of your notes, suggest relevant tags, and identify key concepts. The AI can even create quick study guides from lengthy videos, extracting the most important points so you can review essential content in minutes instead of hours.
              </p>
            </div>
          </div>

          {/* Feature 5 - Seamless Sync */}
          <div className="flex flex-col md:flex-row items-center mb-12 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
            <div className="w-full md:w-2/3 p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                5. Seamless Sync
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access your notes anywhere with our cloud synchronization. ClipNote instantly backs up and syncs your notes across all your devices – desktop, laptop, tablet, and mobile. Start taking notes during your commute on mobile and continue seamlessly on your desktop at home. Your knowledge library travels with you, always available whether you're online or offline.
              </p>
            </div>
            <div className="w-full md:w-1/3 p-4 flex justify-center">
              <img className="rounded-lg shadow-md max-h-56 object-contain" src="cross-platform.png" alt="Seamless sync feature" />
            </div>
          </div>
        </div>
      </section>

      {/* Premium Features */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold py-4 px-6 mb-8 bg-green-500 text-white dark:bg-green-600 dark:text-white rounded-lg text-center">
            Premium Features
          </h2>

          {/* Feature 1 - Collaborative Workspaces */}
          <div className="flex flex-col md:flex-row items-center mb-12 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
            <div className="w-full md:w-2/3 p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                1. Collaborative Workspaces
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Transform learning into a social experience with our collaborative workspaces. Create shared study rooms where team members can contribute notes to the same videos in real-time. Track contributions, add comments, and discuss specific timestamps within the video. Perfect for study groups, research teams, and classroom environments where collective intelligence enhances understanding.
              </p>
            </div>
            <div className="w-full md:w-1/3 p-4 flex justify-center">
              <img className="rounded-lg shadow-md max-h-56 object-contain" src="collaboration.jpeg" alt="Collaborative workspaces" />
            </div>
          </div>

          {/* Feature 2 - Smart Viewing Mode */}
          <div className="flex flex-col-reverse md:flex-row items-center mb-12 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
            <div className="w-full md:w-1/3 p-4 flex justify-center">
              <img className="rounded-lg shadow-md max-h-56 object-contain" src="autopause.png" alt="Smart viewing mode feature" />
            </div>
            <div className="w-full md:w-2/3 p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                2. Smart Viewing Mode
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Experience intelligent video control with our advanced viewing mode. ClipNote automatically pauses videos when you start typing notes and resumes when you're done. Enable voice-to-text to dictate notes while watching. Set custom playback speeds for different content types, and use our focus mode to eliminate distractions. The extension even suggests optimal breaks during long videos to maximize retention.
              </p>
            </div>
          </div>

          {/* Feature 3 - Advanced Export Suite */}
          <div className="flex flex-col md:flex-row items-center mb-12 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
            <div className="w-full md:w-2/3 p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                3. Advanced Export Suite
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Share your knowledge professionally with our comprehensive export tools. Convert notes to beautifully formatted PDFs with custom templates, create interactive study guides with embedded video snippets, or export to Notion, Evernote, and other popular platforms. Generate flashcards automatically from your notes for spaced repetition learning, or create presentation slides for sharing insights with larger audiences.
              </p>
            </div>
            <div className="w-full md:w-1/3 p-4 flex justify-center">
              <img className="rounded-lg shadow-md max-h-56 object-contain" src="convert-to-pdf.jpg" alt="Advanced export suite" />
            </div>
          </div>

          {/* Feature 4 - Knowledge Enhancement Tools */}
          <div className="flex flex-col-reverse md:flex-row items-center mb-12 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
            <div className="w-full md:w-1/3 p-4 flex justify-center">
              <img className="rounded-lg shadow-md max-h-56 object-contain" src="annotations.png" alt="Knowledge enhancement tools" />
            </div>
            <div className="w-full md:w-2/3 p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                4. Knowledge Enhancement Tools
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Deepen your understanding with our advanced annotation system. Highlight video transcripts directly, add color-coded annotations, create mind maps from your notes, and generate concept connections between different videos. Our AI can identify knowledge gaps in your notes and suggest supplementary content to fill them. Create custom glossaries for technical terms and link definitions across your entire library.
              </p>
            </div>
          </div>

          {/* Feature 5 - Custom Integration API */}
          <div className="flex flex-col md:flex-row items-center mb-12 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
            <div className="w-full md:w-2/3 p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                5. Custom Integration API
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Connect ClipNote to your entire digital ecosystem with our powerful API. Build custom workflows that integrate with your learning management system, research database, or content creation tools. Automate note organization based on your curriculum schedule, sync with citation managers for academic work, or connect with productivity tools like Todoist to create action items from video notes. Perfect for educators, researchers, and professionals.
              </p>
            </div>
            <div className="w-full md:w-1/3 p-4 flex justify-center">
              <img className="rounded-lg shadow-md max-h-56 object-contain" src="/api/placeholder/400/320" alt="Custom integration API" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 dark:bg-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your YouTube Experience?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of students, researchers, and content creators who are already using ClipNote to enhance their YouTube experience.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-8 py-3 bg-white hover:bg-gray-100 text-blue-600 rounded-lg font-medium text-lg transition duration-200">
              Install Now
            </button>
            <button className="px-8 py-3 bg-transparent hover:bg-blue-700 border-2 border-white text-white rounded-lg font-medium text-lg transition duration-200">
              View Pricing
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Room;