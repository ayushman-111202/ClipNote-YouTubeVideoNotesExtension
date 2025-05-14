// "use client"
// import { useFormik } from "formik";
// import { useRouter } from "next/navigation"
// import React from "react"
// import { IconCheck, IconLoader3 } from "@tabler/icons-react";
// import axios from "axios";
// import toast from "react-hot-toast";

// const Login = () => {

//     const router = useRouter();

//         const userLoginForm = useFormik({
//             initialValues: {
//                 email: "",
//                 password: "",
//             },
//             onSubmit: async (values, { resetForm, setSubmitting }) => {
//                 axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/authenticate`, values)
//                 .then((result) => {
//                     toast.success("Login Successfully");
//                     resetForm();
//                     localStorage.setItem('token', result.data.token);
                    
//                     router.push('/admin/dashboard');
//                 }).catch((err) => {
//                     toast.error('Invalid Credentials');
//                     setSubmitting(false)
//                 });
//                 // try {
//                 //     // POST
//                 //     const response = await axios.post('http://localhost:5000/users/authenticate', values);

//                 //     // Handle successful signup
//                 //     toast.success('User registered successfully!');
//                 //     resetForm();
//                 //     localStorage.setItem('token',)
//                 //     router.push("/"); // Redirect to the home page
//                 //     // Log the user in and set the authentication state
//                 //     // logIn(response.data.user); // Assuming the API returns user data
//                 //     router.push("/userDashboard"); // Redirect to the desired page
//                 // } catch (error) {
//                 //     console.error(error);
//                 //     toast.error('Oops! Something went wrong.');
//                 //     setSubmitting(false);
//                 // }
//             },
//         })

//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
//                 <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md transition-all duration-300 ease-in-out">
//                     <h2 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
//                         Login
//                     </h2>
//                     <form onSubmit={userLoginForm.handleSubmit}>
//                         <div className="mb-4">
//                             <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
//                                 Email
//                             </label>
//                             <input
//                                 type="email"
//                                 id="email"
//                                 onChange={userLoginForm.handleChange}
//                                 value={userLoginForm.values.email}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200"
//                                 required
//                             />
//                             <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 order-1">
//                                 Password
//                             </label>
//                             <input
//                                 type="password"
//                                 id="password"
//                                 onChange={userLoginForm.handleChange}
//                                 value={userLoginForm.values.password}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 order-2"
//                                 required
//                             />
//                         </div>
//                         <button
//                             type="submit"
//                             disabled={userLoginForm.isSubmitting}
//                             // onSubmit={userLoginForm.handleSubmit}
//                             className="flex justify-center items-center w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300 gap-3">
//                             {userLoginForm.isSubmitting ? 'Submitting...' : 'Login'}
//                             {userLoginForm.isSubmitting ? <IconLoader3 className="animate-spin" /> : <IconCheck />}
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         )
//     };

//     export default Login;



"use client"
import { useFormik } from "formik";
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { IconCheck, IconLoader3, IconUser, IconUserShield } from "@tabler/icons-react";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState('user');

    const userLoginForm = useFormik({
        initialValues: {
            email: "",
            password: "",
            role: "user",
        },
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            const dataToSubmit = {
                ...values,
                role: selectedRole
            };
            
            axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/authenticate`, dataToSubmit)
            .then((result) => {
                toast.success("Login Successfully");
                resetForm();
                localStorage.setItem('token', result.data.token);
                
                // Redirect based on role
                if (selectedRole === 'admin') {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/user/profile'); // Assuming there's a user dashboard
                }
            }).catch((err) => {
                toast.error('Invalid Credentials');
                setSubmitting(false)
            });
        },
    });

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        userLoginForm.setFieldValue('role', role);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md transition-all duration-300 ease-in-out">
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
                    Login
                </h2>
                
                {/* Role Selection */}
                <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Select Role
                    </label>
                    <div className="flex justify-center gap-8">
                        <div 
                            onClick={() => handleRoleSelect('user')}
                            className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                                selectedRole === 'user' 
                                ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500' 
                                : 'bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600'
                            }`}
                        >
                            <IconUser 
                                size={40} 
                                className={selectedRole === 'user' ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'} 
                            />
                            <span className={`mt-2 font-medium ${
                                selectedRole === 'user' ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
                            }`}>
                                User
                            </span>
                        </div>
                        
                        <div 
                            onClick={() => handleRoleSelect('admin')}
                            className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                                selectedRole === 'admin' 
                                ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500' 
                                : 'bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-gray-600'
                            }`}
                        >
                            <IconUserShield 
                                size={40} 
                                className={selectedRole === 'admin' ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'} 
                            />
                            <span className={`mt-2 font-medium ${
                                selectedRole === 'admin' ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
                            }`}>
                                Admin
                            </span>
                        </div>
                    </div>
                </div>
                
                <form onSubmit={userLoginForm.handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            onChange={userLoginForm.handleChange}
                            value={userLoginForm.values.email}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200"
                            required
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={userLoginForm.handleChange}
                            value={userLoginForm.values.password}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200"
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={userLoginForm.isSubmitting}
                        className="flex justify-center items-center w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300 gap-3">
                        {userLoginForm.isSubmitting ? 'Submitting...' : `Login as ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}
                        {userLoginForm.isSubmitting ? <IconLoader3 className="animate-spin" /> : <IconCheck />}
                    </button>
                </form>
                
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account? 
                        <a href="/register" className="text-blue-500 hover:text-blue-700 ml-1">
                            Register
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;