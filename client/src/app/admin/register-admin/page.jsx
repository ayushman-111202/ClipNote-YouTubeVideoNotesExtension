"use client"
import { useFormik } from "formik";
import { useRouter } from "next/navigation"
import React from "react"
import { IconCheck, IconLoader3, IconArrowLeft } from "@tabler/icons-react";
import axios from "axios";
import toast from "react-hot-toast";
import * as Yup from 'yup';

const RegisterAdmin = () => {
    const router = useRouter();

    // Validation schema
    const RegisterSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, 'Name is too short!')
            .max(50, 'Name is too long!')
            .required('Name is required'),
        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm password is required'),
        contact: Yup.string()
            .matches(/^[0-9]+$/, "Phone number must contain only digits")
            .min(10, "Phone number must be at least 10 digits")
            .required("Contact number is required"),
    });

    const adminRegistrationForm = useFormik({
        initialValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            contact: "",
            role: "admin", // Set role to admin by default
        },
        validationSchema: RegisterSchema,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            // Remove confirmPassword as it's not needed in the backend
            const { confirmPassword, ...dataToSubmit } = values;
            
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/add`, dataToSubmit);
                toast.success("Admin registered successfully!");
                resetForm();
                setTimeout(() => {
                    router.push('/admin/dashboard');
                }, 1500);
            } catch (error) {
                console.error("Registration error:", error);
                
                if (error.response && error.response.data) {
                    // Check for specific error types
                    if (error.response.data.code === 11000) {
                        toast.error("Email already registered");
                    } else {
                        toast.error(error.response.data.message || "Registration failed");
                    }
                } else {
                    toast.error("Registration failed. Please try again.");
                }
                
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-8 pb-16">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-600 p-6">
                        <div className="flex items-center">
                            <button 
                                onClick={() => router.push('/admin/dashboard')}
                                className="mr-4 text-white hover:text-blue-200 transition-colors"
                            >
                                <IconArrowLeft size={24} />
                            </button>
                            <h1 className="text-2xl font-bold text-white">Register New Admin</h1>
                        </div>
                        <p className="text-blue-100 mt-2">Create a new administrator account with full system access</p>
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <form onSubmit={adminRegistrationForm.handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        onChange={adminRegistrationForm.handleChange}
                                        onBlur={adminRegistrationForm.handleBlur}
                                        value={adminRegistrationForm.values.name}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                    {adminRegistrationForm.touched.name && adminRegistrationForm.errors.name && (
                                        <p className="mt-1 text-sm text-red-500">{adminRegistrationForm.errors.name}</p>
                                    )}
                                </div>

                                {/* Contact */}
                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="contact" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Contact Number
                                    </label>
                                    <input
                                        type="text"
                                        id="contact"
                                        name="contact"
                                        onChange={adminRegistrationForm.handleChange}
                                        onBlur={adminRegistrationForm.handleBlur}
                                        value={adminRegistrationForm.values.contact}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                    {adminRegistrationForm.touched.contact && adminRegistrationForm.errors.contact && (
                                        <p className="mt-1 text-sm text-red-500">{adminRegistrationForm.errors.contact}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="col-span-2">
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        onChange={adminRegistrationForm.handleChange}
                                        onBlur={adminRegistrationForm.handleBlur}
                                        value={adminRegistrationForm.values.email}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                    {adminRegistrationForm.touched.email && adminRegistrationForm.errors.email && (
                                        <p className="mt-1 text-sm text-red-500">{adminRegistrationForm.errors.email}</p>
                                    )}
                                </div>

                                {/* Password */}
                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        onChange={adminRegistrationForm.handleChange}
                                        onBlur={adminRegistrationForm.handleBlur}
                                        value={adminRegistrationForm.values.password}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                    {adminRegistrationForm.touched.password && adminRegistrationForm.errors.password && (
                                        <p className="mt-1 text-sm text-red-500">{adminRegistrationForm.errors.password}</p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="col-span-2 md:col-span-1">
                                    <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        onChange={adminRegistrationForm.handleChange}
                                        onBlur={adminRegistrationForm.handleBlur}
                                        value={adminRegistrationForm.values.confirmPassword}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                    {adminRegistrationForm.touched.confirmPassword && adminRegistrationForm.errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-500">{adminRegistrationForm.errors.confirmPassword}</p>
                                    )}
                                </div>
                            </div>

                            {/* Admin role notice */}
                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    This user will be registered with administrative privileges and will have full access to the dashboard and management functions.
                                </p>
                            </div>

                            {/* Submit button */}
                            <div className="mt-8">
                                <button
                                    type="submit"
                                    disabled={adminRegistrationForm.isSubmitting}
                                    className="w-full flex justify-center items-center bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300 gap-3"
                                >
                                    {adminRegistrationForm.isSubmitting ? 'Registering...' : 'Register New Admin'}
                                    {adminRegistrationForm.isSubmitting ? <IconLoader3 className="animate-spin" /> : <IconCheck />}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterAdmin;