// src/pages/RegistrationPage.tsx
import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    iceNumber: '',
    address: '',
    phone: '',
    openingDate: '',
    username: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Registration failed');
      toast.success('Registration successful');
      // Reset form or redirect...
      setFormData({
        firstName: '',
        lastName: '',
        iceNumber: '',
        address: '',
        phone: '',
        openingDate: '',
        username: '',
        password: ''
      });
    } catch (err) {
      console.error(err);
      toast.error('Registration failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Toaster position="top-right" />
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center mb-8">
          <UserPlus className="h-8 w-8 text-green-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Registration</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First + Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          {/* ICE */}
          <div>
            <label htmlFor="iceNumber" className="block text-sm font-medium text-gray-700 mb-2">
              ICE Registration Number
            </label>
            <input
              type="text"
              id="iceNumber"
              name="iceNumber"
              value={formData.iceNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Opening Date */}
          <div>
            <label htmlFor="openingDate" className="block text-sm font-medium text-gray-700 mb-2">
              Opening Date
            </label>
            <input
              type="date"
              id="openingDate"
              name="openingDate"
              value={formData.openingDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 flex items-center justify-center"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
