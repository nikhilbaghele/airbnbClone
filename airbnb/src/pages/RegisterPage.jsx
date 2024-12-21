/* eslint-disable no-unused-vars */
import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({}); // State to track validation errors
    const [redirect, setRedirect] = useState(false);

    // Validation function
    function validateInputs() {
        const errors = {};

        // Name validation
        if (!name.trim()) {
            errors.name = 'Name is required.';
        }

        // Email validation
        if (!email.trim()) {
            errors.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Please enter a valid email address.';
        }

        // Password validation
        if (!password.trim()) {
            errors.password = 'Password is required.';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters long.';
        }

        setErrors(errors);
        return Object.keys(errors).length === 0; // Return true if no errors
    }

    async function registerUser(ev) {
        ev.preventDefault();

        // Perform client-side validation
        if (!validateInputs()) {
            return; // Stop execution if validation fails
        }

        try {
            await axios.post('/register', {
                name,
                email,
                password,
            });
            alert('Registration successful. Now you can Login');
            setRedirect(true);
        } catch (error) {
            alert('Registration failed. Please try again.');
        }
    }

    if (redirect) {
        return <Navigate to={'/login'} />;
    }

    return (
        <div className="mt-4 grow flex items-center justify-center px-4 sm:px-8">
            <div className="mb-16 w-full max-w-sm sm:max-w-md">
                <h1 className="text-3xl sm:text-4xl text-center mb-5">Register</h1>
                <form className="w-full text-xl" onSubmit={registerUser}>
                    {/* Name Input */}
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

                    {/* Email Input */}
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                    {/* Password Input */}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                    {/* Submit Button */}
                    <button className="w-full bg-primary text-white py-2 rounded-2xl hover:bg-red-600 transition duration-200">
                        Register
                    </button>

                    <div className="text-center py-2 text-gray-500 text-sm">
                        Already a member?{' '}
                        <Link className="text-blue-500 hover:underline" to={'/login'}>
                            Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
