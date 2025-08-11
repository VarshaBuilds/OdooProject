import React from 'react';
import Navbar from '../../components/Layout/Navbar';

const AdminProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Profile</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">Admin profile functionality coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
