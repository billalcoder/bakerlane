import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import { CheckCircle } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();

    // Steps: register -> otp
    const [step, setStep] = useState('register');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        flatNo: '',
        buildingName: '',
        area: '',
        city: '',
        pincode: '',
        state: '',
        terms: false,
        otp: ''
    });

    const [status, setStatus] = useState({
        loading: false,
        error: '',
        success: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    /* ===============================
       STEP 1: REGISTER USER
    =============================== */
    const handleRegister = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: false });

        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                terms: formData.terms,
                address: {
                    flatNo: formData.flatNo,
                    buildingName: formData.buildingName,
                    area: formData.area,
                    city: formData.city,
                    pincode: formData.pincode,
                    state: formData.state
                }
            };

            const res = await fetch(`${import.meta.env.VITE_BASEURL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || data.error || "Registration failed");

            await sendOtpToUser();
            setStep('otp');
            setStatus({ loading: false, error: '', success: false });

        } catch (err) {
            setStatus({ loading: false, error: err.message, success: false });
        }
    };

    /* ===============================
       SEND OTP
    =============================== */
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

    /* ===============================
       VERIFY OTP
    =============================== */
    const handleVerify = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: '', success: false });

        try {
            const res = await fetch(`${import.meta.env.VITE_BASEURL}/auth/varify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    otp: formData.otp
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Invalid OTP");

            setStatus({ loading: false, error: '', success: true });

            setTimeout(() => navigate('/login'), 2000);

        } catch (err) {
            setStatus({ loading: false, error: err.message, success: false });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-stone-200">

                <div className="bg-amber-600 p-8 text-center">
                    <h2 className="text-3xl font-bold text-white">
                        {step === 'register' ? 'Join Us' : 'Verify Account'}
                    </h2>
                    <p className="text-amber-100 mt-2">
                        {step === 'register'
                            ? 'Create your new account'
                            : `OTP sent to ${formData.email}`}
                    </p>
                </div>

                <div className="p-8">
                    {status.error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
                            {status.error}
                        </div>
                    )}

                    {status.success && (
                        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded flex gap-2">
                            <CheckCircle size={16} /> Verified! Redirecting...
                        </div>
                    )}

                    {/* REGISTER FORM */}
                    {step === 'register' && (
                        <form className="space-y-4">
                            <h3 className="font-semibold">Personal Details</h3>

                            <FormInput label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                            <FormInput label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
                            <FormInput label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
                            <FormInput label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required />

                            <h3 className="font-semibold pt-4">Address Details</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <FormInput label="Flat No" name="flatNo" value={formData.flatNo} onChange={handleChange} required />
                                <FormInput label="Building Name" name="buildingName" value={formData.buildingName} onChange={handleChange} required />
                            </div>

                            <FormInput label="Area" name="area" value={formData.area} onChange={handleChange} required />

                            <div className="grid grid-cols-2 gap-4">
                                <FormInput label="City" name="city" value={formData.city} onChange={handleChange} required />
                                <FormInput label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} required />
                            </div>

                            <FormInput label="State" name="state" value={formData.state} onChange={handleChange} required />

                            <div className="flex items-center">
                                <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} required />
                                <span className="ml-2 text-sm">I agree to Terms</span>
                            </div>

                            <Button text="Continue" onClick={handleRegister} disabled={status.loading} />
                        </form>
                    )}

                    {/* OTP FORM */}
                    {step === 'otp' && (
                        <form className="space-y-4">
                            <FormInput
                                label="Enter OTP"
                                name="otp"
                                value={formData.otp}
                                onChange={handleChange}
                                required
                            />

                            <Button text="Verify & Login" onClick={handleVerify} disabled={status.loading} />

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => sendOtpToUser()}
                                    className="text-sm text-amber-600 underline"
                                >
                                    Resend OTP
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 'register' && (
                        <p className="mt-6 text-center text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-amber-600 font-semibold">
                                Log In
                            </Link>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;
