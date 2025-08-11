import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import { 
  BarChart3, 
  MapPin, 
  Users, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Eye, 
  AlertTriangle,
  DollarSign,
  Building2,
  FileText,
  Shield,
  ArrowRight,
  TrendingUp,
  Search
} from 'lucide-react';
import MockAPI, { 
  AdminStats, 
  User, 
  Booking, 
  FacilityRegistration, 
  Report 
} from '../../services/MockAPI';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'facilities' | 'users' | 'bookings' | 'reports'>('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [pendingFacilities, setPendingFacilities] = useState<FacilityRegistration[]>([]);
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showBookingHistory, setShowBookingHistory] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsData, usersData, bookingsData, facilitiesData, reportsData] = await Promise.all([
        MockAPI.getAdminStats(),
        MockAPI.getAllUsers(),
        MockAPI.getAllBookings(),
        MockAPI.getPendingFacilities(),
        MockAPI.getAllReports()
      ]);
      
      setStats(statsData);
      setAllUsers(usersData);
      setAllBookings(bookingsData);
      setPendingFacilities(facilitiesData);
      setAllReports(reportsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveFacility = async (facilityId: string) => {
    if (!user) return;
    
    try {
      await MockAPI.approveFacility(facilityId, user.id, 'Approved by admin');
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error approving facility:', error);
    }
  };

  const handleRejectFacility = async (facilityId: string, reason: string) => {
    if (!user) return;
    
    try {
      await MockAPI.rejectFacility(facilityId, user.id, reason);
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error rejecting facility:', error);
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      await MockAPI.toggleUserStatus(userId);
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error toggling user status:', error);
    }
  };

  const handleUpdateReportStatus = async (reportId: string, status: Report['status'], notes?: string) => {
    try {
      await MockAPI.updateReportStatus(reportId, status, notes);
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating report status:', error);
    }
  };

  const getUserBookings = (userId: string) => {
    return allBookings.filter(booking => booking.userId === userId);
  };

  const handleViewUserBookings = (user: User) => {
    setSelectedUser(user);
    setShowBookingHistory(true);
  };

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || (statusFilter === 'active' ? user.isActive : !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const filteredBookings = allBookings.filter(booking => {
    const matchesSearch = booking.venue?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Sidebar */}
            <div className="w-full lg:w-64 bg-gray-50 border-r border-gray-200">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Admin Panel</h2>
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'dashboard'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span>Dashboard</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('facilities')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'facilities'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                    <span>Facility Approvals</span>
                    {(stats?.pendingApprovals || 0) > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {stats?.pendingApprovals || 0}
                      </span>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'users'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    <span>User Management</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'bookings'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Calendar className="w-5 h-5" />
                    <span>All Bookings</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('reports')}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === 'reports'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Shield className="w-5 h-5" />
                    <span>Reports</span>
                    {(stats?.activeReports || 0) > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {stats?.activeReports || 0}
                      </span>
                    )}
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
              {activeTab === 'dashboard' && (
                <div className="space-y-8">
                  <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
                  
                  {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
                    </div>
                  ) : (
                    <>
                      {/* Stats Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-2">Total Users</p>
                              <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                            </div>
                            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Users className="w-8 h-8 text-blue-600" />
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-2">Facility Owners</p>
                              <p className="text-3xl font-bold text-gray-900">{stats?.totalOwners || 0}</p>
                            </div>
                            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Building2 className="w-8 h-8 text-purple-600" />
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-2">Total Venues</p>
                              <p className="text-3xl font-bold text-gray-900">{stats?.totalVenues || 0}</p>
                            </div>
                            <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center">
                              <MapPin className="w-8 h-8 text-emerald-600" />
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-2">Total Bookings</p>
                              <p className="text-3xl font-bold text-gray-900">{stats?.totalBookings || 0}</p>
                            </div>
                            <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                              <Calendar className="w-8 h-8 text-orange-600" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Additional Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-2">Pending Approvals</p>
                              <p className="text-3xl font-bold text-yellow-600">{stats?.pendingApprovals || 0}</p>
                            </div>
                            <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center">
                              <AlertTriangle className="w-8 h-8 text-yellow-600" />
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-2">Total Revenue</p>
                              <p className="text-3xl font-bold text-green-600">₹{stats?.totalRevenue?.toLocaleString() || 0}</p>
                            </div>
                            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                              <DollarSign className="w-8 h-8 text-green-600" />
                            </div>
                          </div>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-2">Active Reports</p>
                              <p className="text-3xl font-bold text-red-600">{stats?.activeReports || 0}</p>
                            </div>
                            <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
                              <FileText className="w-8 h-8 text-red-600" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Charts Section */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Booking Activity Chart */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                          <h3 className="text-xl font-semibold text-gray-900 mb-6">Booking Activity Over Time</h3>
                          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <div className="text-center text-gray-500">
                              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                              <p className="text-lg">Chart coming soon...</p>
                            </div>
                          </div>
                        </div>

                        {/* User Registration Trends */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                          <h3 className="text-xl font-semibold text-gray-900 mb-6">User Registration Trends</h3>
                          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <div className="text-center text-gray-500">
                              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                              <p className="text-lg">Chart coming soon...</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <button 
                            onClick={() => setActiveTab('facilities')}
                            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-colors text-center"
                          >
                            <div className="flex flex-col items-center space-y-3">
                              <CheckCircle className="w-10 h-10 text-emerald-600" />
                              <span className="font-medium text-gray-700 text-lg">Review Facilities</span>
                              <span className="text-sm text-gray-500">{stats?.pendingApprovals || 0} pending</span>
                            </div>
                          </button>

                          <button 
                            onClick={() => setActiveTab('users')}
                            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                          >
                            <div className="flex flex-col items-center space-y-3">
                              <Users className="w-10 h-10 text-blue-600" />
                              <span className="font-medium text-gray-700 text-lg">Manage Users</span>
                              <span className="text-sm text-gray-500">{(stats?.totalUsers || 0) + (stats?.totalOwners || 0)} total</span>
                            </div>
                          </button>

                          <button 
                            onClick={() => setActiveTab('reports')}
                            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors text-center"
                          >
                            <div className="flex flex-col items-center space-y-3">
                              <Shield className="w-10 h-10 text-red-600" />
                              <span className="font-medium text-gray-700 text-lg">Handle Reports</span>
                              <span className="text-sm text-gray-500">{stats?.activeReports || 0} active</span>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
                        <div className="space-y-4">
                          {pendingFacilities.slice(0, 3).map((facility) => (
                            <div key={facility.id} className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                              <span className="text-sm text-gray-600 flex-1">
                                New facility registration: {facility.venueName}
                              </span>
                              <button 
                                onClick={() => setActiveTab('facilities')}
                                className="text-sm text-emerald-600 hover:text-emerald-800 font-medium flex items-center hover:bg-emerald-100 px-3 py-1 rounded-md transition-colors"
                              >
                                Review <ArrowRight className="w-4 h-4 ml-1" />
                              </button>
                            </div>
                          ))}
                          {allReports.slice(0, 2).map((report) => (
                            <div key={report.id} className="flex items-center space-x-4 p-4 bg-red-50 rounded-lg">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <span className="text-sm text-gray-600 flex-1">
                                New report: {report.reason} - {report.reporterName}
                              </span>
                              <button 
                                onClick={() => setActiveTab('reports')}
                                className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                              >
                                Handle <ArrowRight className="w-4 h-4 ml-1" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
              {activeTab === 'facilities' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-gray-900">Facility Approvals</h2>
                    <div className="text-lg text-gray-600">
                      {pendingFacilities.length} pending approval
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
                    </div>
                  ) : pendingFacilities.length === 0 ? (
                    <div className="text-center py-16">
                      <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                      <h3 className="text-xl font-medium text-gray-900 mb-3">No Pending Approvals</h3>
                      <p className="text-gray-600 text-lg">All facility registrations have been reviewed.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {pendingFacilities.map((facility) => (
                        <div key={facility.id} className="bg-white rounded-xl border border-gray-200 p-8">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0">
                            <div className="flex-1">
                              <div className="flex items-start space-x-6">
                                <img 
                                  src={facility.images[0]} 
                                  alt={facility.venueName}
                                  className="w-24 h-24 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{facility.venueName}</h3>
                                  <p className="text-gray-600 mb-4 text-lg">{facility.description}</p>
                                  <div className="grid grid-cols-2 gap-6 text-base mb-4">
                                    <div>
                                      <span className="font-medium text-gray-700">Owner:</span> {facility.ownerName}
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-700">Email:</span> {facility.ownerEmail}
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-700">Phone:</span> {facility.ownerPhone}
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-700">Location:</span> {facility.location}
                                    </div>
                                  </div>
                                  <div className="mb-4">
                                    <span className="font-medium text-gray-700 text-base">Amenities:</span>
                                    <div className="flex flex-wrap gap-3 mt-2">
                                      {facility.amenities.map((amenity, index) => (
                                        <span key={index} className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-full">
                                          {amenity}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Submitted: {new Date(facility.submittedAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col space-y-4 lg:ml-8">
                              <button
                                onClick={() => handleApproveFacility(facility.id)}
                                className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-3 text-base"
                              >
                                <CheckCircle className="w-5 h-5" />
                                <span>Approve</span>
                              </button>
                              
                              <button
                                onClick={() => {
                                  const reason = prompt('Enter rejection reason:');
                                  if (reason) handleRejectFacility(facility.id, reason);
                                }}
                                className="bg-red-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-3 text-base"
                              >
                                <XCircle className="w-5 h-5" />
                                <span>Reject</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'users' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
                    <div className="text-lg text-gray-600">
                      {filteredUsers.length} of {allUsers.length} users
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-3">Search</label>
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-3">Role</label>
                        <select
                          value={roleFilter}
                          onChange={(e) => setRoleFilter(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
                        >
                          <option value="">All Roles</option>
                          <option value="user">User</option>
                          <option value="owner">Owner</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-3">Status</label>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
                        >
                          <option value="">All Status</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                      
                      <div className="flex items-end">
                        <button 
                          onClick={() => {
                            setSearchTerm('');
                            setRoleFilter('');
                            setStatusFilter('');
                          }}
                          className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-base"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                              Joined
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-8 py-6 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                    {user.avatar ? (
                                      <img src={user.avatar} alt="" className="w-12 h-12 rounded-full" />
                                    ) : (
                                      <Users className="w-6 h-6 text-gray-400" />
                                    )}
                                  </div>
                                  <div className="ml-5">
                                    <div className="text-base font-medium text-gray-900">{user.fullName}</div>
                                    <div className="text-sm text-gray-500">{user.email}</div>
                                    {user.phone && (
                                      <div className="text-sm text-gray-500">{user.phone}</div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap">
                                <span className={`px-3 py-2 text-sm font-medium rounded-full ${
                                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                  user.role === 'owner' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                </span>
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap">
                                <span className={`px-3 py-2 text-sm font-medium rounded-full ${
                                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {user.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap text-base text-gray-900">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => handleToggleUserStatus(user.id)}
                                  className={`mr-4 px-4 py-2 rounded-lg text-sm font-medium ${
                                    user.isActive 
                                      ? 'text-red-600 hover:text-red-900 hover:bg-red-50' 
                                      : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                                  } transition-colors`}
                                >
                                  {user.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                <button 
                                  onClick={() => handleViewUserBookings(user)}
                                  className="text-emerald-600 hover:text-emerald-900 hover:bg-emerald-50 px-4 py-2 rounded-lg transition-colors"
                                >
                                  View Bookings
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'bookings' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-gray-900">All Bookings</h2>
                    <div className="text-lg text-gray-600">
                      {filteredBookings.length} of {allBookings.length} bookings
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-3">Search</label>
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search bookings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-base font-medium text-gray-700 mb-3">Status</label>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-base"
                        >
                          <option value="">All Status</option>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      
                      <div className="flex items-end">
                        <button 
                          onClick={() => {
                            setSearchTerm('');
                            setStatusFilter('');
                          }}
                          className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors text-base"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bookings Table */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                              Booking ID
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                              Venue
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                              Date & Time
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-8 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredBookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50">
                              <td className="px-8 py-6 whitespace-nowrap text-base font-medium text-gray-900">
                                {booking.id}
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap">
                                <div className="flex items-center">
                                  <img 
                                    src={booking.venue?.image} 
                                    alt={booking.venue?.name}
                                    className="w-12 h-12 object-cover rounded-lg mr-4"
                                  />
                                  <div>
                                    <div className="text-base font-medium text-gray-900">{booking.venue?.name}</div>
                                    <div className="text-sm text-gray-500">{booking.venue?.location}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap">
                                <div className="text-base text-gray-900">{booking.date}</div>
                                <div className="text-sm text-gray-500">{booking.timeSlot}</div>
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap text-base text-gray-900">
                                ₹{booking.totalAmount}
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap">
                                <span className={`px-3 py-2 text-sm font-medium rounded-full ${
                                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                                <button className="text-emerald-600 hover:text-emerald-900 hover:bg-emerald-50 px-4 py-2 rounded-lg transition-colors mr-3">View</button>
                                <button className="text-red-600 hover:text-red-900 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors">Cancel</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'reports' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-gray-900">Reports & Moderation</h2>
                    <div className="text-lg text-gray-600">
                      {allReports.filter(r => r.status === 'open' || r.status === 'investigating').length} active reports
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
                    </div>
                  ) : allReports.length === 0 ? (
                    <div className="text-center py-16">
                      <Shield className="w-20 h-20 text-green-500 mx-auto mb-6" />
                      <h3 className="text-xl font-medium text-gray-900 mb-3">No Reports</h3>
                      <p className="text-gray-600 text-lg">All reports have been resolved.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {allReports.map((report) => (
                        <div key={report.id} className="bg-white rounded-xl border border-gray-200 p-8">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0">
                            <div className="flex-1">
                              <div className="flex items-start space-x-6">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                  report.status === 'open' ? 'bg-red-100' :
                                  report.status === 'investigating' ? 'bg-yellow-100' :
                                  report.status === 'resolved' ? 'bg-green-100' :
                                  'bg-gray-100'
                                }`}>
                                  {report.status === 'open' ? (
                                    <AlertTriangle className="w-8 h-8 text-red-600" />
                                  ) : report.status === 'investigating' ? (
                                    <Eye className="w-8 h-8 text-yellow-600" />
                                  ) : report.status === 'resolved' ? (
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                  ) : (
                                    <XCircle className="w-8 h-8 text-gray-600" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-4 mb-3">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                      {report.reason}
                                    </h3>
                                    <span className={`px-3 py-2 text-sm font-medium rounded-full ${
                                      report.status === 'open' ? 'bg-red-100 text-red-800' :
                                      report.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                                      report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                    </span>
                                  </div>
                                  
                                  <p className="text-gray-600 mb-4 text-lg">{report.description}</p>
                                  
                                  <div className="grid grid-cols-2 gap-6 text-base mb-4">
                                    <div>
                                      <span className="font-medium text-gray-700">Reporter:</span> {report.reporterName}
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-700">Type:</span> {report.reportedType}
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-700">Reported ID:</span> {report.reportedId}
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-700">Submitted:</span> {new Date(report.submittedAt).toLocaleDateString()}
                                    </div>
                                  </div>
                                  
                                  {report.adminNotes && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                      <span className="font-medium text-gray-700 text-base">Admin Notes:</span>
                                      <p className="text-gray-600 mt-2">{report.adminNotes}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col space-y-4 lg:ml-8">
                              {report.status === 'open' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateReportStatus(report.id, 'investigating', 'Under investigation')}
                                    className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors flex items-center justify-center space-x-3 text-base"
                                  >
                                    <Eye className="w-5 h-5" />
                                    <span>Investigate</span>
                                  </button>
                                  
                                  <button
                                    onClick={() => {
                                      const notes = prompt('Enter admin notes:');
                                      if (notes) handleUpdateReportStatus(report.id, 'dismissed', notes);
                                    }}
                                    className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-3 text-base"
                                  >
                                    <XCircle className="w-5 h-5" />
                                    <span>Dismiss</span>
                                  </button>
                                </>
                              )}
                              
                              {report.status === 'investigating' && (
                                <button
                                  onClick={() => {
                                    const notes = prompt('Enter resolution notes:');
                                    if (notes) handleUpdateReportStatus(report.id, 'resolved', notes);
                                  }}
                                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-3 text-base"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                  <span>Resolve</span>
                                </button>
                              )}
                              
                              <button className="text-emerald-600 hover:text-emerald-900 hover:bg-emerald-50 px-4 py-2 rounded-lg transition-colors text-base">
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Booking History Modal */}
      {showBookingHistory && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  Booking History - {selectedUser.fullName}
                </h3>
                <button
                  onClick={() => setShowBookingHistory(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600 mt-2">{selectedUser.email}</p>
            </div>
            
            <div className="p-6">
              {getUserBookings(selectedUser.id).length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Bookings Found</h4>
                  <p className="text-gray-600">This user hasn't made any bookings yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getUserBookings(selectedUser.id).map((booking) => (
                    <div key={booking.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={booking.venue?.image} 
                            alt={booking.venue?.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <h5 className="font-medium text-gray-900">{booking.venue?.name}</h5>
                            <p className="text-sm text-gray-600">{booking.venue?.location}</p>
                            <p className="text-sm text-gray-500">{booking.date} at {booking.timeSlot}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                          <p className="text-lg font-semibold text-gray-900 mt-2">₹{booking.totalAmount}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
