import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import SkeletonLoader from '../components/SkeletonLoader';

export default function AdminSuspendedUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchSuspendedUsers = async () => {
      try {
        const token = import.meta.env.VITE_API_TOKEN;
        if (!token) {
          setError('API token is missing. Please set VITE_API_TOKEN in your .env file.');
          setLoading(false);
          return;
        }
        const response = await fetch('https://api.blumdate.com/admin/users/blocked', { // Adjusted endpoint assumption
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.status === 'success') {
          const blockedUsers = data.data
            .filter(user => user.isBlocked === true)
            .map(user => ({
              id: user._id,
              name: `${user.email.split('@')[0]}`, // Using email username as fallback since name fields aren't explicit
              email: user.email,
              accountType: user.premium ? 'Premium' : 'Free',
              joinDate: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              avatar: user.photo || 'https://i.pinimg.com/736x/b5/f2/3c/b5f23cc57e500a2a7d79f903aeff550a.jpg',
            }));
          setUsers(blockedUsers);
        } else {
          setError('Failed to load suspended users.');
        }
      } catch (error) {
        console.error('Error fetching suspended users:', error);
        setError('Failed to fetch suspended users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSuspendedUsers();
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
          <div className="overflow-x-auto">
            <table className="w-full border-collapse hidden md:table">
              <thead className="bg-gray-50">
                <tr>
                  {['Name', 'Account Type', 'Status', 'Email Address', 'Join Date', 'Action'].map((header, index) => (
                    <th key={index} className="py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 border-b-2 border-gray-200">
                      <div className="flex items-center">
                        {index === 0 && <div className="h-4 w-4 bg-gray-300 rounded mr-1 sm:mr-2 md:mr-2"></div>}
                        <div className="h-4 w-16 sm:w-20 md:w-20 bg-gray-300 rounded"></div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <div className="h-4 w-4 bg-gray-300 rounded mr-1 sm:mr-2 md:mr-2"></div>
                        <div className="h-6 w-6 bg-gray-300 rounded-full mr-1 sm:mr-2 md:mr-2"></div>
                        <div>
                          <div className="h-4 w-20 sm:w-24 md:w-24 bg-gray-300 rounded"></div>
                          <div className="h-3 w-16 sm:w-20 md:w-20 bg-gray-300 rounded mt-1"></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 border-b border-gray-200">
                      <div className="h-4 w-16 sm:w-20 md:w-20 bg-gray-300 rounded"></div>
                    </td>
                    <td className="py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 border-b border-gray-200">
                      <div className="h-4 w-16 sm:w-20 md:w-20 bg-gray-300 rounded"></div>
                    </td>
                    <td className="py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 border-b border-gray-200">
                      <div className="h-4 w-24 sm:w-32 md:w-32 bg-gray-300 rounded"></div>
                    </td>
                    <td className="py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 border-b border-gray-200">
                      <div className="h-4 w-16 sm:w-20 md:w-20 bg-gray-300 rounded"></div>
                    </td>
                    <td className="py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 border-b border-gray-200">
                      <div className="flex space-x-1 sm:space-x-2 md:space-x-2">
                        <div className="h-4 w-4 sm:w-5 md:w-5 bg-gray-300 rounded"></div>
                        <div className="h-4 w-4 sm:w-5 md:w-5 bg-gray-300 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="md:hidden grid grid-cols-1 gap-2">
              {[...Array(5)].map((_, rowIndex) => (
                <div key={rowIndex} className="bg-white p-2 sm:p-3 md:p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-2">
                    <div className="h-4 w-4 bg-gray-300 rounded"></div>
                    <div className="h-6 w-6 bg-gray-300 rounded-full mr-1 sm:mr-2 md:mr-2"></div>
                    <div>
                      <div className="h-4 w-20 sm:w-24 md:w-24 bg-gray-300 rounded"></div>
                      <div className="h-3 w-16 sm:w-20 md:w-20 bg-gray-300 rounded mt-1"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1 sm:gap-2 md:gap-2 mt-1 sm:mt-2 md:mt-2">
                    <div className="h-4 w-16 sm:w-20 md:w-20 bg-gray-300 rounded"></div>
                    <div className="h-4 w-16 sm:w-20 md:w-20 bg-gray-300 rounded"></div>
                    <div className="h-4 w-24 sm:w-32 md:w-32 bg-gray-300 rounded"></div>
                    <div className="h-4 w-16 sm:w-20 md:w-20 bg-gray-300 rounded"></div>
                    <div className="col-span-2 flex justify-end space-x-1 sm:space-x-2 md:space-x-2">
                      <div className="h-4 w-4 sm:w-5 md:w-5 bg-gray-300 rounded"></div>
                      <div className="h-4 w-4 sm:w-5 md:w-5 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center mt-2 sm:mt-3 md:mt-4 lg:mt-6">
            <div className="h-8 w-20 sm:w-24 md:w-24 bg-gray-300 rounded mb-1 sm:mb-0"></div>
            <div className="flex flex-wrap justify-center space-x-1 sm:space-x-2 md:space-x-2 mb-1 sm:mb-0">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-6 w-6 sm:w-8 md:w-8 bg-gray-300 rounded"></div>
              ))}
            </div>
            <div className="h-8 w-20 sm:w-24 md:w-24 bg-gray-300 rounded"></div>
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
          <div className="flex flex-col items-center justify-center h-full">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-2 sm:p-3 md:p-4 lg:p-6 bg-gray-50 overflow-y-auto">
        <div className="flex flex-col mb-2 sm:mb-3 md:mb-4 lg:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-2xl lg:text-2xl font-semibold mb-2 sm:mb-2 md:mb-0">Suspended Users</h1>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse hidden md:table">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Account Type', 'Status', 'Email Address', 'Join Date', 'Action'].map((header) => (
                  <th key={header} className="py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 border-b-2 border-gray-200 text-left text-sm sm:text-base md:text-base">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        <img
                          src={user.avatar || 'https://i.pinimg.com/736x/b5/f2/3c/b5f23cc57e500a2a7d79f903aeff550a.jpg'}
                          alt={`${user.name}'s profile`}
                          className="w-6 sm:w-8 h-8 md:w-8 md:h-8 rounded-full mr-2"
                        />
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 border-b border-gray-200">
                      {user.accountType}
                    </td>
                    <td className="py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 border-b border-gray-200">
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs sm:text-sm md:text-sm">
                        Suspended
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 border-b border-gray-200 break-all">
                      {user.email}
                    </td>
                    <td className="py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 border-b border-gray-200">
                      {user.joinDate}
                    </td>
                    <td className="py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 border-b border-gray-200">
                      <button
                        onClick={() => navigate(`/admin/profile/${user.id}`)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {/* Unsuspend logic */}}
                        className="text-green-500 hover:text-green-700"
                      >
                        Unsuspend
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-gray-500">
                    No suspended users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="md:hidden grid grid-cols-1 gap-2">
            {users.length > 0 ? (
              users.map((user) => (
                <div key={user.id} className="bg-white p-2 sm:p-3 md:p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-2">
                    <input type="checkbox" className="mr-1 sm:mr-2 md:mr-2" />
                    <img
                      src={user.avatar || 'https://i.pinimg.com/736x/b5/f2/3c/b5f23cc57e500a2a7d79f903aeff550a.jpg'}
                      alt={`${user.name}'s profile`}
                      className="w-6 sm:w-8 h-8 md:w-8 md:h-8 rounded-full mr-1 sm:mr-2 md:mr-2"
                    />
                    <span className="text-sm sm:text-base md:text-base">{user.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 sm:gap-2 md:gap-2 mt-1 sm:mt-2 md:mt-2">
                    <div>
                      <p className="text-gray-600 text-xs sm:text-sm md:text-sm">Account Type</p>
                      <p className="text-gray-900 font-medium">{user.accountType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs sm:text-sm md:text-sm">Status</p>
                      <span className="bg-red-100 text-red-800 px-1 sm:px-2 md:px-2 py-0.5 sm:py-1 md:py-1 rounded-full text-xs sm:text-sm md:text-sm">
                        Suspended
                      </span>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-600 text-xs sm:text-sm md:text-sm">Email</p>
                      <p className="text-gray-900 font-medium break-all">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs sm:text-sm md:text-sm">Join Date</p>
                      <p className="text-gray-900 font-medium">{user.joinDate}</p>
                    </div>
                    <div className="col-span-2 flex justify-end space-x-1 sm:space-x-2 md:space-x-2">
                      <button
                        onClick={() => navigate(`/admin/profile/${user.id}`)}
                        className="text-blue-500 hover:text-blue-700 text-xs sm:text-sm md:text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {/* Unsuspend logic */}}
                        className="text-green-500 hover:text-green-700 text-xs sm:text-sm md:text-sm"
                      >
                        Unsuspend
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-4 text-center text-gray-500">
                No suspended users found.
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-2 sm:mt-3 md:mt-4 lg:mt-6">
          <div className="h-8 w-20 sm:w-24 md:w-24 bg-gray-300 rounded mb-1 sm:mb-0"></div>
          <div className="flex flex-wrap justify-center space-x-1 sm:space-x-2 md:space-x-2 mb-1 sm:mb-0">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-6 w-6 sm:w-8 md:w-8 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="h-8 w-20 sm:w-24 md:w-24 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}