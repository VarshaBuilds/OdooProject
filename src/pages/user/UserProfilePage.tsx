import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/Layout/Navbar';
import { User, Calendar, Lock, LogOut, Camera, Save, X, Menu } from 'lucide-react';

const avatarStyles = [
  'adventurer',
  'avataaars',
  'bottts',
  'micah',
  'shapes',
  'thumbs'
];

const generateAvatars = (count = 20) => {
  return Array.from({ length: count }, () => {
    const style = avatarStyles[Math.floor(Math.random() * avatarStyles.length)];
    const seed = Math.floor(Math.random() * 100000);
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
  });
};

const UserProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'password'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'user',
    avatar: user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${Math.floor(Math.random() * 100000)}`
  });
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [avatars, setAvatars] = useState<string[]>(generateAvatars(20));
  const pickerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveChanges = async () => {
    if (user) {
      try {
        await updateProfile(user.id, formData);
        setIsEditing(false);
        setError(null);
      } catch (err) {
        setError('Failed to update profile. Please try again.');
      }
    }
  };

  const handleAvatarSelect = async (url: string) => {
    setFormData(prev => ({ ...prev, avatar: url }));
    setShowAvatarPicker(false);
    if (user) {
      try {
        await updateProfile(user.id, { avatar: url });
        setError(null);
      } catch (err) {
        setError('Failed to update avatar. Please try again.');
      }
    }
  };

  const handleRemoveAvatar = async () => {
    const defaultAvatar = '';
    setFormData(prev => ({ ...prev, avatar: defaultAvatar }));
    if (user) {
      try {
        await updateProfile(user.id, { avatar: defaultAvatar });
        setError(null);
      } catch (err) {
        setError('Failed to remove avatar. Please try again.');
      }
    }
  };

  const loadMoreAvatars = () => {
    setAvatars(prev => [...prev, ...generateAvatars(20)]);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && showAvatarPicker) {
          loadMoreAvatars();
        }
      },
      { threshold: 1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [showAvatarPicker]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node) && showAvatarPicker) {
        setShowAvatarPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAvatarPicker]);

  const renderProfileTab = () => (
    <div className="space-y-4 sm:space-y-6" style={{padding:'4%'}}>
      {/* Profile Picture Section */}
      <div className="text-center">
        <div className="relative inline-block">
          <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden mx-auto mb-4 shadow-md bg-gray-200 flex items-center justify-center">
            {formData.avatar ? (
              <img 
                src={formData.avatar} 
                alt="Profile avatar" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 xs:w-12 xs:h-12 sm:w-16 sm:h-16 text-gray-400" />
            )}
          </div>
          {isEditing && (
            <>
              <button 
                onClick={() => setShowAvatarPicker(true)}
                className="absolute bottom-0 right-4 xs:bottom-1 xs:right-4 sm:bottom-2 sm:right-6 bg-emerald-600 text-white p-1 xs:p-1.5 sm:p-2 rounded-full hover:bg-emerald-700 transition-colors shadow-sm"
                aria-label="Change avatar"
              >
                <Camera className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button 
                onClick={handleRemoveAvatar}
                className="absolute bottom-0 right-0 xs:bottom-1 xs:right-0 sm:bottom-2 sm:right-0 bg-red-600 text-white p-1 xs:p-1.5 sm:p-2 rounded-full hover:bg-red-700 transition-colors shadow-sm"
                aria-label="Remove avatar"
              >
                <X className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
              </button>
            </>
          )}
        </div>

        {/* Avatar Picker */}
        {showAvatarPicker && (
          <div 
            ref={pickerRef}
            className="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-xl border border-gray-200 p-3 xs:p-4 sm:p-4 max-h-48 xs:max-h-56 sm:max-h-64 overflow-y-auto z-50 w-11/12 xs:w-64 sm:w-80 animate-fade-in"
          >
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-xs xs:text-sm font-semibold text-gray-900">Choose Avatar</h3>
              <button 
                onClick={() => setShowAvatarPicker(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close avatar picker"
              >
                <X className="w-3 h-3 xs:w-4 xs:h-4 sm:w-4 sm:h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 gap-1 xs:gap-2 sm:gap-3">
              {avatars.map((url, index) => (
                <div 
                  key={index} 
                  className="cursor-pointer rounded-lg hover:bg-emerald-100 transition-colors duration-200 p-1 hover:scale-105"
                  onClick={() => handleAvatarSelect(url)}
                >
                  <img src={url} alt="Avatar option" className="w-full h-auto rounded-full shadow-sm" />
                </div>
              ))}
            </div>
            <div ref={loadMoreRef} className="h-1"></div>
          </div>
        )}
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors duration-200 text-xs xs:text-sm"
          />
        </div>

        <div>
          <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors duration-200 text-xs xs:text-sm"
          />
        </div>

        <div>
          <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors duration-200 text-xs xs:text-sm"
          />
        </div>

        <div>
          <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors duration-200 text-xs xs:text-sm"
          >
            <option value="user">User</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-2 xs:p-3 bg-red-100 text-red-800 rounded-lg text-xs animate-fade-in">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col xs:flex-row space-y-3 xs:space-y-0 xs:space-x-4">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-emerald-600 text-white px-4 xs:px-6 py-2 xs:py-2.5 sm:py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md hover:scale-105 text-xs xs:text-sm"
          >
            <User className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <>
            <button
              onClick={handleSaveChanges}
              className="bg-emerald-600 text-white px-4 xs:px-6 py-2 xs:py-2.5 sm:py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md hover:scale-105 text-xs xs:text-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  fullName: user?.fullName || '',
                  email: user?.email || '',
                  phone: user?.phone || '',
                  role: user?.role || 'user',
                  avatar: user?.avatar || ''
                });
                setError(null);
              }}
              className="bg-gray-200 text-gray-700 px-4 xs:px-6 py-2 xs:py-2.5 sm:py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200 shadow-sm hover:shadow-md hover:scale-105 text-xs xs:text-sm"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );

  const renderBookingsTab = () => (
    <div className="space-y-4 xs:space-y-6" >
      <h3 className="text-base xs:text-lg font-semibold text-gray-900 mb-4" >Your Bookings</h3>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 xs:px-3 sm:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-2 xs:px-3 sm:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Venue Name
                </th>
                <th className="px-2 xs:px-3 sm:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-2 xs:px-3 sm:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-2 xs:px-3 sm:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-2 xs:px-3 sm:px-6 py-2 xs:py-2.5 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-2 xs:px-3 sm:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap text-xs text-gray-900">#BK001</td>
                <td className="px-2 xs:px-3 sm:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap text-xs text-gray-900">SBR Badminton</td>
                <td className="px-2 xs:px-3 sm:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap text-xs text-gray-900">2024-01-15</td>
                <td className="px-2 xs:px-3 sm:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap text-xs text-gray-900">10:00 AM</td>
                <td className="px-2 xs:px-3 sm:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap">
                  <span className="px-1 xs:px-2 py-0.5 xs:py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Confirmed
                  </span>
                </td>
                <td className="px-2 xs:px-3 sm:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap text-xs font-medium">
                  <button className="text-emerald-600 hover:text-emerald-900 transition-colors duration-200">View</button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors duration-200">
                <td className="px-2 xs:px-3 sm:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap text-xs text-gray-900">#BK002</td>
                <td className="px-2 xs:px-3 sm:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap text-xs text-gray-900">Football Ground Plus</td>
                <td className="px-2 xs:px-3 sm:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap text-xs text-gray-900">2024-01-20</td>
                <td className="px-2 xs:px-3 sm:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap text-xs text-gray-900">2:00 PM</td>
                <td className="px-2 xs:px-3 sm:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap">
                  <span className="px-1 xs:px-2 py-0.5 xs:py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                    Pending
                  </span>
                </td>
                <td className="px-2 xs:px-3 sm:px-6 py-2 xs:py-3 sm:py-4 whitespace-nowrap text-xs font-medium">
                  <button className="text-emerald-600 hover:text-emerald-900 transition-colors duration-200">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPasswordTab = () => (
    <div className="space-y-4 xs:space-y-6">
      <h3 className="text-base xs:text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
            Current Password
          </label>
          <input
            type="password"
            className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 text-xs xs:text-sm"
            placeholder="Enter current password"
          />
        </div>

        <div>
          <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
            New Password
          </label>
          <input
            type="password"
            className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 text-xs xs:text-sm"
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-1 xs:mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            className="w-full px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200 text-xs xs:text-sm"
            placeholder="Confirm new password"
          />
        </div>
      </div>

      <button className="bg-emerald-600 text-white px-4 xs:px-6 py-2 xs:py-2.5 sm:py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md hover:scale-105 text-xs xs:text-sm">
        <Save className="w-4 h-4" />
        <span>Save Changes</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        menuItems={[
          { label: 'Profile', icon: <User className="w-4 h-4" />, onClick: () => setActiveTab('profile') },
          { label: 'My Bookings', icon: <Calendar className="w-4 h-4" />, onClick: () => setActiveTab('bookings') },
          { label: 'Change Password', icon: <Lock className="w-4 h-4" />, onClick: () => setActiveTab('password') },
          { label: 'Logout', icon: <LogOut className="w-4 h-4" />, onClick: () => console.log('Logout'), className: 'text-red-600 hover:bg-red-50' }
        ]}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
      />
      
      <div className="max-w-full xs:max-w-md sm:max-w-4xl lg:max-w-6xl mx-auto px-2 xs:px-3 sm:px-6 lg:px-8 py-6 xs:py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Sidebar */}
            <div className="w-full lg:w-56 xl:w-64 bg-gray-50 border-b lg:border-r lg:border-b-0 border-gray-200">
              <div className="p-4 xs:p-5 sm:p-6">
                <h2 className="text-base xs:text-lg md:text-xl sm:text-xl font-bold text-gray-900 mb-4 xs:mb-6" style={{padding:'4%'}}>Account Settings</h2>
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center space-x-2 md:text-xl xs:space-x-3 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg text-left transition-all duration-200 shadow-sm hover:shadow-md text-xs xs:text-sm ${
                      activeTab === 'profile'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <User className="w-4 h-4 xs:w-5 xs:h-5" />
                    <span>Profile</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`hidden sm:flex items-center space-x-2 md:text-xl xs:space-x-3 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg text-left transition-all duration-200 shadow-sm hover:shadow-md text-xs xs:text-sm ${
                      activeTab === 'bookings'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Calendar className="w-4 h-4 xs:w-5 xs:h-5" />
                    <span>My Bookings</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('password')}
                    className={`hidden sm:flex items-center space-x-2 md:text-xl xs:space-x-3 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg text-left transition-all duration-200 shadow-sm hover:shadow-md text-xs xs:text-sm ${
                      activeTab === 'password'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Lock className="w-4 h-4 xs:w-5 xs:h-5" />
                    <span >Change Password</span>
                  </button>
                  
                  <button className="hidden sm:flex items-center space-x-2 md:text-xl xs:space-x-3 px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-all duration-200 shadow-sm hover:shadow-md text-xs xs:text-sm">
                    <LogOut className="w-4 h-4 xs:w-5 xs:h-5" />
                    <span>Logout</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 xs:p-5 sm:p-6 md:text-xl" style={{padding:'4%'}}>
              {activeTab === 'profile' && renderProfileTab()}
              {activeTab === 'bookings' && renderBookingsTab()}
              {activeTab === 'password' && renderPasswordTab()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;