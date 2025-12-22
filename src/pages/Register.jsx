import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

const Register = () => {

    // State for form data matching your Schema
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        terms: false
    });

    const [status, setStatus] = useState({ loading: false, error: '', success: false });

    // Handle Input Changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: false });

        try {
            // API Call
            const response = await fetch(`${import.meta.env.VITE_BASEURL}/auth/register`, { // Update port if needed
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log(data);

            if (!response.ok) {
                throw new Error(data.message || data.details || data.error);
            }

            setStatus({ loading: false, error: '', success: true });

            // Optional: Redirect after 2 seconds
            setTimeout(() => {
                // navigate('/login'); // Uncomment this when you have a login page
                console.log("Redirecting...");
            }, 2000);

        } catch (err) {
            setStatus({ loading: false, error: err.message, success: false });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
            {/* Container: Responsive (Full width mobile, max-w-md desktop) */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-200">

                {/* Header / Brand Area */}
                <div className="bg-amber-600 p-8 text-center">
                    <h2 className="text-3xl font-bold text-white tracking-wide">Join Us</h2>
                    <p className="text-amber-100 mt-2">Create your new account</p>
                </div>

                {/* Form Area */}
                <div className="p-8">

                    {/* Error / Success Messages */}
                    {status.error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
                            {status.error}
                        </div>
                    )}
                    {status.success && (
                        <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded border border-green-200">
                            Account created successfully!
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <FormInput
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. John Doe"
                            required
                        />

                        <FormInput
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                        />

                        <FormInput
                            label="Phone Number"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+1 234 567 8900"
                            required
                        />

                        <FormInput
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />

                        {/* Terms Checkbox (Custom style) */}
                        <div className="flex items-center mb-6">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                checked={formData.terms}
                                onChange={handleChange}
                                required
                                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded cursor-pointer"
                            />
                            <label htmlFor="terms" className="ml-2 block text-sm text-stone-600">
                                I agree to the <a href="#" className="text-amber-600 hover:underline">Terms of Service</a>
                            </label>
                        </div>

                        <Button
                            text="Create Account"
                            type="submit"
                            disabled={status.loading}
                        />
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-stone-500">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-amber-600 hover:text-amber-700">
                                Log In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;