import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { AlertCircle } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();

    // Simplified Form Data (Address removed for initial sign up)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        terms: false
    });

    const [status, setStatus] = useState({
        loading: false,
        error: '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '' });

        try {
            // 1. Create User in DB (isVerified: false)
            const res = await fetch(`${import.meta.env.VITE_BASEURL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    terms: formData.terms
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || data.error || "Registration failed");

            // 2. Send OTP immediately after successful registration
            await sendOtpToUser();

            // 3. Save Email/Phone to LocalStorage so VerifyOtp page can read it
            // This allows the user to refresh the verify page without losing context
            localStorage.setItem('pending_email', formData.email);
            localStorage.setItem('pending_phone', formData.phone);
            
            // 4. Navigate to the dedicated OTP route
            navigate('/verify-otp');

        } catch (err) {
            setStatus({ loading: false, error: err.message });
        }
    };

    const sendOtpToUser = async () => {
        const res = await fetch(`${import.meta.env.VITE_BASEURL}/auth/otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: formData.email,
                phone: formData.phone
            })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to send OTP");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4 font-sans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">

                <div className="bg-amber-600 p-8 text-center">
                    <h2 className="text-3xl font-bold text-white tracking-wide">Join Us</h2>
                    <p className="text-amber-100 mt-2">Create your new account</p>
                </div>

                <div className="p-8">
                    {/* Error Message Display */}
                    {status.error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded flex items-center gap-2 border border-red-200 animate-fade-in">
                            <AlertCircle size={16} /> {status.error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4 animate-fade-in">
                        <FormInput 
                            label="Full Name" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                            placeholder="John Doe" 
                        />
                        <FormInput 
                            label="Email Address" 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            placeholder="john@example.com" 
                        />
                        <FormInput 
                            label="Phone Number" 
                            type="tel" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleChange} 
                            required 
                            placeholder="9876543210" 
                        />
                        <FormInput 
                            label="Password" 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            placeholder="••••••••" 
                        />

                        <div className="flex items-center pt-2">
                            <input 
                                type="checkbox" 
                                name="terms" 
                                checked={formData.terms} 
                                onChange={handleChange} 
                                required 
                                className="h-4 w-4 text-amber-600 focus:ring-amber-500 rounded border-gray-300" 
                            />
                            <span className="ml-2 text-sm text-stone-600">
                                I agree to Terms & Conditions
                            </span>
                        </div>

                        <Button 
                            text={status.loading ? "Creating Account..." : "Continue"} 
                            type="submit" 
                            disabled={status.loading} 
                        />
                    </form>

                    <div className="mt-6 text-center text-sm text-stone-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-amber-600 font-bold hover:underline">
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;