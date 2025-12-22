import React, { useEffect, useState } from 'react';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

const Settings = () => {
    // State for Profile Form
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    // State for Password Form
    const [security, setSecurity] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    async function handleApi() {
        if (profile.name === "") {
            return alert("Name should not empty")
        }
        if (profile.phone === "") {
            return alert("Phone should not empty")
        }
        const res = await fetch(`${import.meta.env.VITE_BASEURL}/auth/updateprofile`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ profile }),
            credentials: "include"
        });
        if (!res.ok) {
            return alert("Problem sending to backend")
        }
        const data = await res.json()
        return data
    }

    async function handleUpdateApi() {
        if (profile.password === '') {
            console.log(profileData);
            return alert("Password should not empty")
        }
        const profileData = {}
        for (const key in profile) {
            if (profile[key] !== "") {
                profileData[key] = profile[key]
            }
        }

        const res = await fetch(`${import.meta.env.VITE_BASEURL}/auth/updatepassword`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ profileData }),
            credentials: "include"
        });
        if (!res.ok) {
            return alert("Problem sending to backend")
        }
        const data = await res.json()
        return data
    }

    async function getUserProfile() {
        const res = await fetch(`${import.meta.env.VITE_BASEURL}/auth/getClient`, {
            credentials: "include"
        });

        const data = await res.json()
        setProfile(data)
    }

    useEffect(() => {
        getUserProfile()
    }, [])


    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const data = await handleApi()
        if (data) {
            // console.log(message);
            alert(data.message);
        }

    };

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        if (security.newPassword !== security.confirmPassword) {
            alert("New passwords do not match.");
            return;
        }
        fetch(`${import.meta.env.VITE_BASEURL}/auth/updatepassword`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ new: security.newPassword, old: security.currentPassword }),
            credentials: "include"
        });
        alert("Password changed successfully!");
        setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto pb-24 animate-fade-in">
            <h2 className="text-2xl font-bold text-stone-700 mb-6">Account Settings</h2>

            {/* 1. Profile Details Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 mb-6">
                <h3 className="text-lg font-bold text-amber-700 mb-4 border-b border-stone-100 pb-2">Personal Information</h3>
                <form onSubmit={handleProfileUpdate}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                            label="Full Name"
                            name="name"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}

                        />
                        <FormInput
                            label="Email Address"
                            name="email"
                            text={profile.email}
                            disable={true} // Email is usually hard to change
                            placeholder="john@example.com"

                        />
                    </div>
                    <div className="md:w-1/2 pr-0 md:pr-2">
                        <FormInput
                            label="Phone Number"
                            name="phone"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                    </div>
                    <div className="mt-2 text-right">
                        <button className="bg-stone-800 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-stone-900 transition-colors">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            {/* 2. Security Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-200 mb-6">
                <h3 className="text-lg font-bold text-amber-700 mb-4 border-b border-stone-100 pb-2">Security</h3>
                <form onSubmit={handlePasswordUpdate}>
                    <FormInput
                        label="Current Password"
                        type="password"
                        name="currentPassword"
                        value={security.currentPassword}
                        onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                            label="New Password"
                            type="password"
                            name="newPassword"
                            value={security.newPassword}
                            onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                        />
                        <FormInput
                            label="Confirm New Password"
                            type="password"
                            name="confirmPassword"
                            value={security.confirmPassword}
                            onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                        />
                    </div>
                    <div className="mt-2 text-right">
                        <button className="border border-amber-600 text-amber-600 px-6 py-2 rounded-lg text-sm font-bold hover:bg-amber-50 transition-colors" onClick={handleUpdateApi}>
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;