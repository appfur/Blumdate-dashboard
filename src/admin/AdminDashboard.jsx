import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchUsers = async () => {
      try {
        const token = import.meta.env.VITE_API_TOKEN;
        if (!token) {
          setError('API token is missing. Please set VITE_API_TOKEN in your .env file.');
          setLoading(false);
          return;
        }
        const response = await fetch('https://api.blumdate.com/api/v1/admin/profiles', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.status === 'success') {
          const validUsers = data.data.profiles
            .filter(profile => profile.userId && profile.userId._id)
            .map(profile => ({
              id: profile.userId._id,
              name: `${profile.userId.firstName} ${profile.userId.lastName || ''}`,
              email: profile.userId.email,
              accountType: profile.userId.premium ? 'Premium' : 'Free',
              status: profile.userId.isBlocked ? 'Suspended' : 'Active',
              joinDate: new Date(profile.userId.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              avatar: profile.userId.photo || 'https://i.pinimg.com/736x/b5/f2/3c/b5f23cc57e500a2a7d79f903aeff550a.jpg',
              subscription: {
                status: profile.userId.premium ? 'Active' : 'Inactive',
                plan: profile.userId.premium ? 'Premium' : 'Free',
                startDate: profile.userId.createdAt ? new Date(profile.userId.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A',
                endDate: profile.userId.premium ? new Date(profile.userId.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A',
                renewal: profile.userId.premium ? 'Auto-Renew Enabled' : 'N/A',
                price: profile.userId.premium ? '$9.99/month' : 'N/A',
              },
            }));
          setUsers(validUsers);

          // Generate dynamic chart data starting from June 2024
          const monthlySubscriptions = Array(12).fill(0).map((_, index) => {
            const date = new Date(2024, 5); // June is month 5 (0-based)
            date.setMonth(date.getMonth() + index);
            const monthName = date.toLocaleString('en-US', { month: 'long' });
            return { name: monthName, users: 0 };
          }); // No reverse to keep chronological order from June

          validUsers.forEach(user => {
            const subDate = new Date(user.subscription.startDate);
            const monthName = subDate.toLocaleString('en-US', { month: 'long' });
            const monthData = monthlySubscriptions.find(m => m.name === monthName);
            if (monthData && user.subscription.status === 'Active') monthData.users += 1;
          });

          setChartData(monthlySubscriptions);
        } else {
          console.error('API returned non-success status:', data.message);
          setUsers([]);
          setChartData(Array(12).fill(0).map((_, index) => {
            const date = new Date(2024, 5); // June 2024
            date.setMonth(date.getMonth() + index);
            return { name: date.toLocaleString('en-US', { month: 'long' }), users: 0 };
          }));
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
        setChartData(Array(12).fill(0).map((_, index) => {
          const date = new Date(2024, 5); // June 2024
          date.setMonth(date.getMonth() + index);
          return { name: date.toLocaleString('en-US', { month: 'long' }), users: 0 };
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-2 sm:p-3 md:p-4 lg:p-6 bg-gray-50 overflow-y-auto">
          <div className="flex flex-col mb-2 sm:mb-3 md:mb-4 lg:mb-6 animate-pulse">
            <div className="h-6 sm:h-8 md:h-10 w-1/2 sm:w-1/3 md:w-1/4 bg-gray-300 rounded mb-1 sm:mb-2"></div>
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 mb-1 sm:mb-2">
              <div className="h-5 sm:h-6 md:h-8 w-5 sm:w-6 md:w-8 bg-gray-300 rounded-full"></div>
              <div className="h-4 sm:h-5 md:h-6 w-16 sm:w-20 md:w-24 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white p-2 sm:p-3 md:p-4 lg:p-6 rounded-lg shadow animate-pulse">
                <div className="h-4 w-1/2 sm:w-1/3 md:w-1/4 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 w-1/3 sm:w-1/4 md:w-1/5 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
          <div className="bg-white p-2 sm:p-3 md:p-4 lg:p-6 rounded-lg shadow animate-pulse">
            <div className="h-6 w-1/3 sm:w-1/4 md:w-1/5 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-1/2 sm:w-1/3 md:w-1/4 bg-gray-300 rounded mb-2"></div>
            <div className="h-400 w-full bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-y-auto">
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 md:ml-0 md:pl-6 p-2 sm:p-3 md:p-4 lg:p-6 bg-gray-50 overflow-y-auto">
        <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-4 lg:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-2xl lg:text-2xl font-semibold">Dashboard</h1>
          <div className="text-sm sm:text-base md:text-base text-gray-600">Admin</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-4 mb-2 sm:mb-3 md:mb-4 lg:mb-6">
          <div className="bg-white p-2 sm:p-3 md:p-4 lg:p-6 rounded-lg shadow">
            <p className="text-gray-500 text-xs sm:text-sm md:text-base">Total Users</p>
            <p className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold">{users.length}</p>
          </div>
          <div className="bg-white p-2 sm:p-3 md:p-4 lg:p-6 rounded-lg shadow">
            <p className="text-gray-500 text-xs sm:text-sm md:text-base">Active Subscriptions</p>
            <p className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold">{users.filter(user => user.subscription.status === 'Active').length}</p>
          </div>
          <div className="bg-white p-2 sm:p-3 md:p-4 lg:p-6 rounded-lg shadow">
            <p className="text-gray-500 text-xs sm:text-sm md:text-base">Verification Requests</p>
            <p className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold">0</p>
          </div>
          <div className="bg-white p-2 sm:p-3 md:p-4 lg:p-6 rounded-lg shadow">
            <p className="text-gray-500 text-xs sm:text-sm md:text-base">Reports Received</p>
            <p className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold">0</p>
          </div>
        </div>
        <div className="bg-white p-2 sm:p-3 md:p-4 lg:p-6 rounded-lg shadow">
          <h3 className="text-lg sm:text-xl md:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4 lg:mb-4">Overview</h3>
          <div className="flex flex-wrap space-x-2 sm:space-x-3 md:space-x-4 mb-2 sm:mb-3 md:mb-4 lg:mb-4 text-xs sm:text-sm md:text-base text-gray-500">
            <span>12 months</span>
            <span>3 months</span>
            <span>30 days</span>
            <span>7 days</span>
            <span>24 hours</span>
          </div>
          <ResponsiveContainer width="100%" height={300} sm={350} md={400} lg={400}>
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#c805b8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;