/* eslint-disable no-unused-vars */
import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { setUser } = useContext(UserContext);

    // Validation errors
    const [errors, setErrors] = useState({});

    // Validate form fields
    const validateForm = () => {
        const validationErrors = {};

        // Email validation
        if (!email) {
            validationErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            validationErrors.email = 'Enter a valid email address';
        }

        // Password validation
        if (!password) {
            validationErrors.password = 'Password is required';
        } else if (password.length < 6) {
            validationErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    async function handleLoginSubmit(ev) {
        ev.preventDefault();

        // Validate before sending the request
        if (!validateForm()) return;

        try {
            const { data } = await axios.post('/login', { email, password });
            setUser(data);
            alert("Login successful");
            setRedirect(true);
        } catch (error) {
            alert("Login Failed. Please check your credentials.");
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />;
    }

    return (
        <div className="mt-4 grow flex flex-col lg:flex-row items-center justify-around px-4 sm:px-8">
            <div className="mb-16 sm:mb-32 w-full lg:w-1/3">
                <h1 className="text-3xl sm:text-4xl text-center mb-5">Login</h1>
                <form className="text-xl max-w-sm mx-auto sm:max-w-md bg-white" onSubmit={handleLoginSubmit}>
                    {/* Email Input */}
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full border rounded-lg p-2 mb-3 ${errors.email ? 'border-red-500' : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary'
                        }`}
                    />
                    {errors.email && <p className="text-red-500 text-xs sm:text-sm">{errors.email}</p>}

                    {/* Password Input */}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full border rounded-lg p-2 mb-3 ${errors.password ? 'border-red-500' : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary'
                        }`}
                    />
                    {errors.password && <p className="text-red-500 text-xs sm:text-sm">{errors.password}</p>}

                    {/* Submit Button */}
                    <button className="primary w-full bg-primary text-white py-2 rounded-lg hover:bg-red-600 transition duration-200">
                        Login
                    </button>
                    <div className="text-center py-2 text-gray-500 text-sm sm:text-base">
                        Don&apos;t have an account yet?{' '}
                        <Link className="text-blue-500 hover:underline" to={'/register'}>
                            Register Now
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
