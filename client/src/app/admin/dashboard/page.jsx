
// "use client"
// import React, { useEffect, useState } from 'react';
// import { IconUsers, IconNotes, IconGraph, IconSettings, IconAlertCircle, IconClipboardText } from '@tabler/icons-react';
// import Link from 'next/link';
// import axios from 'axios';

// const AdminDashboard = () => {

//     const [userList, setUserList] = useState([]);
//     const [latestUsers, setLatestUsers] = useState([]);

//     const fetchUsers = async () => {
//         const res = await axios.get('http://localhost:5000/users/getall');
//         console.log(res.data);
//         setUserList(res.data)
//         setLatestUsers(res.data.slice(-5))
//     }

//     useEffect(() => {
//         fetchUsers()
//     }, [])

//     // Sample data for dashboard stats
//     const stats = [
//         { title: 'Total Users', value: '5283', icon: <IconUsers size={28} />, color: 'bg-blue-500' },
//         { title: 'Notes Created', value: '24,389', icon: <IconNotes size={28} />, color: 'bg-green-500' },
//         { title: 'Active Subscriptions', value: '1,093', icon: <IconClipboardText size={28} />, color: 'bg-purple-500' },
//         { title: 'Support Tickets', value: '37', icon: <IconAlertCircle size={28} />, color: 'bg-red-500' },
//     ];

//     return (
//         <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pb-16">
//             {/* Admin Header */}
//             <div className="bg-white dark:bg-gray-800 shadow-md">
//                 <div className="container mx-auto px-6 py-4">
//                     <div className="flex items-center justify-between">
//                         <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
//                         <div className="flex items-center space-x-2">
//                             <span className="text-gray-600 dark:text-gray-300">Admin User</span>
//                             <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
//                                 A
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="container mx-auto px-6 py-8">
//                 {/* Stats Cards */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//                     {stats.map((stat, index) => (
//                         <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
//                             <div className={`h-2 ${stat.color}`}></div>
//                             <div className="p-6">
//                                 <div className="flex items-center justify-between">
//                                     <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300">{stat.title}</h2>
//                                     <div className={`h-10 w-10 rounded-full ${stat.color} bg-opacity-20 flex items-center justify-center text-${stat.color.split('-')[1]}-500`}>
//                                         {stat.icon}
//                                     </div>
//                                 </div>
//                                 <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{stat.value}</p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Main Content - Two Column Layout */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     {/* Left Column - Quick Access */}
//                     <div className="lg:col-span-1">
//                         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
//                             <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Quick Access</h2>
//                             <div className="space-y-4">
//                                 <Link href="/admin/manage-users" className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition duration-200">
//                                     <IconUsers size={20} className="text-blue-500 mr-3" />
//                                     <span className="text-gray-700 dark:text-gray-200">Manage Users</span>
//                                 </Link>
//                                 <Link href="/admin/content" className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition duration-200">
//                                     <IconNotes size={20} className="text-blue-500 mr-3" />
//                                     <span className="text-gray-700 dark:text-gray-200">Content Management</span>
//                                 </Link>
//                                 <Link href="/admin/analytics" className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition duration-200">
//                                     <IconGraph size={20} className="text-blue-500 mr-3" />
//                                     <span className="text-gray-700 dark:text-gray-200">Analytics</span>
//                                 </Link>
//                                 <Link href="/admin/settings" className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition duration-200">
//                                     <IconSettings size={20} className="text-blue-500 mr-3" />
//                                     <span className="text-gray-700 dark:text-gray-200">Settings</span>
//                                 </Link>
//                             </div>
//                         </div>

//                         {/* Recent Activities */}
//                         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
//                             <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Recent Activities</h2>
//                             <div className="space-y-4">
//                                 <div className="border-l-4 border-blue-500 pl-4 py-1">
//                                     <p className="text-sm text-gray-500 dark:text-gray-400">Today, 11:30 AM</p>
//                                     <p className="text-gray-700 dark:text-gray-300">New user registered: Sarah Johnson</p>
//                                 </div>
//                                 <div className="border-l-4 border-green-500 pl-4 py-1">
//                                     <p className="text-sm text-gray-500 dark:text-gray-400">Today, 10:15 AM</p>
//                                     <p className="text-gray-700 dark:text-gray-300">Premium subscription purchased: User #1092</p>
//                                 </div>
//                                 <div className="border-l-4 border-red-500 pl-4 py-1">
//                                     <p className="text-sm text-gray-500 dark:text-gray-400">Yesterday, 4:45 PM</p>
//                                     <p className="text-gray-700 dark:text-gray-300">Support ticket created: Issue with Chrome extension</p>
//                                 </div>
//                                 <div className="border-l-4 border-purple-500 pl-4 py-1">
//                                     <p className="text-sm text-gray-500 dark:text-gray-400">Yesterday, 2:30 PM</p>
//                                     <p className="text-gray-700 dark:text-gray-300">New tutorial content published: Using timestamps</p>
//                                 </div>
//                             </div>
//                             <button className="mt-6 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
//                                 View All Activities →
//                             </button>
//                         </div>
//                     </div>

//                     {/* Right Column - Graphs and Tables */}
//                     <div className="lg:col-span-2">
//                         {/* User Growth Graph (Placeholder) */}
//                         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
//                             <div className="flex items-center justify-between mb-6">
//                                 <h2 className="text-xl font-bold text-gray-800 dark:text-white">User Growth</h2>
//                                 <select className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm px-3 py-1">
//                                     <option>Last 7 days</option>
//                                     <option>Last 30 days</option>
//                                     <option>Last 3 months</option>
//                                 </select>
//                             </div>
//                             <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
//                                 <p className="text-gray-500 dark:text-gray-400">Growth Chart Visualization</p>
//                             </div>
//                         </div>

//                         {/* Recent Users Table */}
//                         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
//                             <div className="flex items-center justify-between mb-6">
//                                 <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recent Users</h2>
//                                 <Link href="/admin/manage-users" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
//                                     View All Users →
//                                 </Link>
//                             </div>

//                             <div className="overflow-x-auto">
//                                 <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//                                     <thead className="bg-gray-50 dark:bg-gray-700">
//                                         <tr>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
//                                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//                                         {
//                                             latestUsers.map((user) => {
//                                                 return (
//                                                     <tr key={user._id}>
//                                                         <td className="px-6 py-4 whitespace-nowrap">
//                                                             <div className="flex items-center">
//                                                                 <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white">S</div>
//                                                                 <div className="ml-4">
//                                                                     <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
//                                                                 </div>
//                                                             </div>
//                                                         </td>
//                                                         <td className="px-6 py-4 whitespace-nowrap">
//                                                             <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
//                                                         </td>
//                                                         <td className="px-6 py-4 whitespace-nowrap">
//                                                             <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
//                                                                 Active
//                                                             </span>
//                                                         </td>
//                                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.contact}</td>
//                                                     </tr>
//                                                 )
//                                             })
//                                         }
//                                     </tbody>
//                                 </table>
//                             </div>
//                             <div className="mt-6 flex justify-between items-center">
//                                 <div className="text-sm text-gray-500 dark:text-gray-400">
//                                     Showing 5 of 5,283 users
//                                 </div>
//                                 <div className="flex space-x-2">
//                                     <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
//                                         Previous
//                                     </button>
//                                     <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
//                                         Next
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminDashboard;

"use client"
import React, { useEffect, useState } from 'react';
import { IconUsers, IconNotes, IconGraph, IconSettings, IconAlertCircle, IconClipboardText, IconUserPlus } from '@tabler/icons-react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
    const router = useRouter();
    const [userList, setUserList] = useState([]);
    const [latestUsers, setLatestUsers] = useState([]);

    const fetchUsers = async () => {
        const res = await axios.get('http://localhost:5000/users/getall');
        console.log(res.data);
        setUserList(res.data)
        setLatestUsers(res.data.slice(-5))
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    // Handle register admin button click
    const handleRegisterAdmin = () => {
        router.push('/admin/register-admin');
    }

    // Sample data for dashboard stats
    const stats = [
        { title: 'Total Users', value: '5283', icon: <IconUsers size={28} />, color: 'bg-blue-500' },
        { title: 'Notes Created', value: '24,389', icon: <IconNotes size={28} />, color: 'bg-green-500' },
        { title: 'Active Subscriptions', value: '1,093', icon: <IconClipboardText size={28} />, color: 'bg-purple-500' },
        { title: 'Support Tickets', value: '37', icon: <IconAlertCircle size={28} />, color: 'bg-red-500' },
    ];

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen pb-16">
            {/* Admin Header */}
            <div className="bg-white dark:bg-gray-800 shadow-md">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
                        <div className="flex items-center space-x-4">
                            {/* Register Admin Button */}
                            <button 
                                onClick={handleRegisterAdmin}
                                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
                            >
                                <IconUserPlus className="mr-2" size={20} />
                                <span>Register Admin</span>
                            </button>
                            <div className="flex items-center space-x-2">
                                <span className="text-gray-600 dark:text-gray-300">Admin User</span>
                                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                    A
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                            <div className={`h-2 ${stat.color}`}></div>
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300">{stat.title}</h2>
                                    <div className={`h-10 w-10 rounded-full ${stat.color} bg-opacity-20 flex items-center justify-center text-${stat.color.split('-')[1]}-500`}>
                                        {stat.icon}
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content - Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Quick Access */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Quick Access</h2>
                            <div className="space-y-4">
                                <Link href="/admin/manage-users" className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition duration-200">
                                    <IconUsers size={20} className="text-blue-500 mr-3" />
                                    <span className="text-gray-700 dark:text-gray-200">Manage Users</span>
                                </Link>
                                <Link href="/admin/content" className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition duration-200">
                                    <IconNotes size={20} className="text-blue-500 mr-3" />
                                    <span className="text-gray-700 dark:text-gray-200">Content Management</span>
                                </Link>
                                <Link href="/admin/analytics" className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition duration-200">
                                    <IconGraph size={20} className="text-blue-500 mr-3" />
                                    <span className="text-gray-700 dark:text-gray-200">Analytics</span>
                                </Link>
                                <Link href="/admin/settings" className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900 transition duration-200">
                                    <IconSettings size={20} className="text-blue-500 mr-3" />
                                    <span className="text-gray-700 dark:text-gray-200">Settings</span>
                                </Link>
                                {/* Admin Registration Link */}
                                <Link href="/admin/register-admin" className="flex items-center p-3 bg-blue-50 dark:bg-blue-900 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition duration-200">
                                    <IconUserPlus size={20} className="text-blue-500 mr-3" />
                                    <span className="text-blue-700 dark:text-blue-200 font-medium">Register New Admin</span>
                                </Link>
                            </div>
                        </div>

                        {/* Recent Activities */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Recent Activities</h2>
                            <div className="space-y-4">
                                <div className="border-l-4 border-blue-500 pl-4 py-1">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Today, 11:30 AM</p>
                                    <p className="text-gray-700 dark:text-gray-300">New user registered: Sarah Johnson</p>
                                </div>
                                <div className="border-l-4 border-green-500 pl-4 py-1">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Today, 10:15 AM</p>
                                    <p className="text-gray-700 dark:text-gray-300">Premium subscription purchased: User #1092</p>
                                </div>
                                <div className="border-l-4 border-red-500 pl-4 py-1">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Yesterday, 4:45 PM</p>
                                    <p className="text-gray-700 dark:text-gray-300">Support ticket created: Issue with Chrome extension</p>
                                </div>
                                <div className="border-l-4 border-purple-500 pl-4 py-1">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Yesterday, 2:30 PM</p>
                                    <p className="text-gray-700 dark:text-gray-300">New tutorial content published: Using timestamps</p>
                                </div>
                            </div>
                            <button className="mt-6 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                                View All Activities →
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Graphs and Tables */}
                    <div className="lg:col-span-2">
                        {/* User Growth Graph (Placeholder) */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">User Growth</h2>
                                <select className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-sm px-3 py-1">
                                    <option>Last 7 days</option>
                                    <option>Last 30 days</option>
                                    <option>Last 3 months</option>
                                </select>
                            </div>
                            <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <p className="text-gray-500 dark:text-gray-400">Growth Chart Visualization</p>
                            </div>
                        </div>

                        {/* Recent Users Table */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Recent Users</h2>
                                <Link href="/admin/manage-users" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                                    View All Users →
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {
                                            latestUsers.map((user) => {
                                                return (
                                                    <tr key={user._id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
                                                                    {user.name.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                                Active
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.contact}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                                ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>
                                                                {user.role || 'user'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-6 flex justify-between items-center">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Showing 5 of 5,283 users
                                </div>
                                <div className="flex space-x-2">
                                    <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                                        Previous
                                    </button>
                                    <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;