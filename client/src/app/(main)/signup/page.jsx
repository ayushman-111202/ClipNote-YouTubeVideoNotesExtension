"use client"
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useRouter } from "next/navigation"
import React from "react"
import { IconCheck, IconLoader3 } from "@tabler/icons-react";
import axios from "axios";
import toast from "react-hot-toast";

const signupSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Naam nhi hai kya?'),
    contact: Yup.number()
        .required('Please enter a 10 digit number!'),
    email: Yup.string().email('Email is required').required('please enter email'),
    password: Yup.string().required('password is required')
        .matches(/[a-z]/, 'lowercase is required')
        .matches(/[A-Z]/, 'uppercase is required')
        .matches(/[0-9]/, 'number is required')
        .matches(/\W/, 'specialchar  is required'),
    confirmPassword: Yup.string().required('please enter confirm password')
        .oneOf([Yup.ref('password'), null], 'password must match'),
    // profile: Yup.string()
})

const Signup = () => {

    const router = useRouter();

    const userSignupForm = useFormik({
        initialValues: {
            name: "",
            contact: "",
            email: "",
            password: "",
            confirmPassword: ""
        },
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            try {
                // POST
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/add`, values);
                // Handle successful signup
                toast.success('User registered successfully!');
                resetForm();
                router.push("/room"); // Redirect to the desired page
            } catch (error) {
                console.error(error);
                toast.error('Oops! Something went wrong.');
                setSubmitting(false);
            }
        },
        validationSchema: signupSchema,
    })

    console.log(userSignupForm.errors);


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md transition-all duration-300 ease-in-out">
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
                    Signup
                </h2>

                <form onSubmit={userSignupForm.handleSubmit}>
                    <div className="mb-4 transition-all duration-300 ease-in-out">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            onChange={userSignupForm.handleChange}
                            value={userSignupForm.values.name}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200"
                            required
                        />
                        {userSignupForm.errors.name && userSignupForm.touched.name && (
                            <p className="text-xs text-red-600 ">{userSignupForm.errors.name}</p>
                        )}
                        <label htmlFor="contact" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Contact
                        </label>
                        <input
                            type="number"
                            id="contact"
                            onChange={userSignupForm.handleChange}
                            value={userSignupForm.values.contact}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200"
                            required
                        />
                        {userSignupForm.errors.contact && userSignupForm.touched.contact && (
                            <p className="text-xs text-red-600 ">{userSignupForm.errors.contact}</p>
                        )}

                        <label htmlFor="mail" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            onChange={userSignupForm.handleChange}
                            value={userSignupForm.values.email}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200"
                            required
                        />

                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 order-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={userSignupForm.handleChange}
                            value={userSignupForm.values.password}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 order-2"
                            required
                        />

                        {userSignupForm.errors.password && userSignupForm.touched.password && (
                            <p className="text-xs text-red-600 ">{userSignupForm.errors.password}</p>
                        )}

                        <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 order-1">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            id="confirmPassword"
                            onChange={userSignupForm.handleChange}
                            value={userSignupForm.values.confirmPassword}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors duration-200 order-2"
                            required />
                    </div>

                    <button
                        type="submit"
                        disabled={userSignupForm.isSubmitting}
                        onSubmit={userSignupForm.handleSubmit}
                        className="flex justify-center items-center w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300 gap-3">
                        {userSignupForm.isSubmitting ? 'Submitting...' : 'Signup'}
                        {userSignupForm.isSubmitting ? <IconLoader3 className="animate-spin" /> : <IconCheck />}
                    </button>
                </form>
            </div>
        </div >
    )
}

export default Signup;


