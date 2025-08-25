import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import SkeletonLoader from '../components/SkeletonLoader';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminContentModeration() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = import.meta.env.VITE_API_TOKEN;
        if (!token) {
          setError('API token is missing. Please set VITE_API_TOKEN in your .env file.');
          setLoading(false);
          return;
        }
        const baseUrl = import.meta.env.VITE_API_CALL || 'https://api.blumdate.com';
        const response = await fetch(`${baseUrl}/users`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.status === 'success') {
          setUsers(data.data.users);
          if (data.results === 0 || data.data.users.length === 0) {
            setError('No user content available at the moment.');
          }
        } else {
          setError(data.message || 'Failed to fetch user content.');
        }
      } catch (error) {
        console.error('Error fetching users:', error.message);
        setError('Failed to fetch user content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = users.filter(user =>
        (user.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.favoriteColors.join(' ') || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, users]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = useMemo(() => filteredUsers.slice(indexOfFirstUser, indexOfLastUser), [filteredUsers, indexOfFirstUser, indexOfLastUser]);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage > 1) setCurrentPage(currentPage - 1);
    else if (direction === 'next' && currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const closePopup = () => {
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-y-auto">
          <SkeletonLoader />
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
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline ml-2"> {error}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-y-auto">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Content Moderation</h1>
            <p className="text-gray-600 text-lg sm:text-xl">No user content available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Content Moderation</h1>
          <div className="flex items-center space-x-3">
            <img
              src="https://i.pinimg.com/736x/d3/9d/85/d39d854ad761552a841304300c779f53.jpg"
              alt="Admin Profile"
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => { e.currentTarget.src = 'https://i.pinimg.com/736x/b5/f2/3c/b5f23cc57e500a2a7d79f903aeff550a.jpg'; }}
            />
            <span className="text-sm sm:text-base font-medium text-gray-700">Admin</span>
          </div>
        </div>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or favorite colors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/2 lg:w-1/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm transition duration-200"
          />
        </div>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left border-collapse bg-white shadow-lg rounded-lg hidden md:table">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b-2 border-gray-200 text-sm font-semibold text-gray-700">Name</th>
                <th className="py-3 px-4 border-b-2 border-gray-200 text-sm font-semibold text-gray-700">Email</th>
                <th className="py-3 px-4 border-b-2 border-gray-200 text-sm font-semibold text-gray-700">Media</th>
                <th className="py-3 px-4 border-b-2 border-gray-200 text-sm font-semibold text-gray-700">Favorite Colors</th>
                <th className="py-3 px-4 border-b-2 border-gray-200 text-sm font-semibold text-gray-700">Date Joined</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer" onClick={() => handleUserClick(user)}>
                  <td className="py-3 px-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <img src={user.photo.startsWith('http') ? user.photo : `https://api.blumdate.com/${user.photo}`} alt={`${user.firstName}'s photo`} className="w-10 h-10 rounded-full object-cover" onError={(e) => { e.currentTarget.src = 'https://i.pinimg.com/736x/b5/f2/3c/b5f23cc57e500a2a7d79f903aeff550a.jpg'; }} />
                      <span className="text-sm text-gray-800 font-medium">{user.firstName} {user.lastName || ''}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-600">{user.email}</td>
                  <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-600">{user.photo.startsWith('http') ? 'External Media' : 'Default Media'}</td>
                  <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-600">{user.favoriteColors.join(', ') || 'None'}</td>
                  <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="md:hidden grid grid-cols-1 gap-2">
            {currentUsers.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-1 gap-2 bg-white p-2 sm:p-4 rounded-lg shadow hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                onClick={() => handleUserClick(user)}
              >
                <div className="flex items-center space-x-2">
                  <img src={user.photo.startsWith('http') ? user.photo : `https://api.blumdate.com/${user.photo}`} alt={`${user.firstName}'s photo`} className="w-12 h-12 rounded-full mr-1" onError={(e) => { e.currentTarget.src = 'https://i.pinimg.com/736x/b5/f2/3c/b5f23cc57e500a2a7d79f903aeff550a.jpg'; }} />
                  <div>
                    <div className="font-medium text-gray-900">{user.firstName} {user.lastName || ''}</div>
                    <div className="text-gray-500 text-xs">{user.email.split('@')[0]}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium text-gray-700">Email</div>
                  <div className="text-gray-700">{user.email}</div>
                  <div className="font-medium text-gray-700">Media</div>
                  <div className="text-gray-700">{user.photo.startsWith('http') ? 'External Media' : 'Default Media'}</div>
                  <div className="font-medium text-gray-700">Favorite Colors</div>
                  <div className="text-gray-700">{user.favoriteColors.join(', ') || 'None'}</div>
                  <div className="font-medium text-gray-700">Join Date</div>
                  <div className="text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <button
            onClick={() => handlePageChange('prev')}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => handlePageChange('next')}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <AnimatePresence>
          {selectedUser && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePopup}
            >
              <motion.div
                className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md relative"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  onClick={closePopup}
                >
                  &times;
                </button>
                <h2 className="text-xl font-bold text-gray-900 mb-4">{selectedUser.firstName} {selectedUser.lastName || ''}'s Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col items-center">
                    <img
                      src={selectedUser.photo.startsWith('http') ? selectedUser.photo : `https://api.blumdate.com/${selectedUser.photo}`}
                      alt={`${selectedUser.firstName}'s photo`}
                      className="w-32 h-32 object-cover rounded-xl mb-2"
                      onError={(e) => { e.currentTarget.src = 'https://i.pinimg.com/736x/b5/f2/3c/b5f23cc57e500a2a7d79f903aeff550a.jpg'; }}
                    />
                    <p className="text-center text-gray-700 text-sm">Media: {selectedUser.photo.startsWith('http') ? 'External' : 'Default'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-700 text-sm"><span className="font-medium">Distance:</span> {selectedUser.distance} km</p>
                    <p className="text-gray-700 text-sm"><span className="font-medium">Role:</span> {selectedUser.role}</p>
                    <p className="text-gray-700 text-sm"><span className="font-medium">Email Verified:</span> {selectedUser.emailVerified ? 'Yes' : 'No'}</p>
                    <p className="text-gray-700 text-sm"><span className="font-medium">Phone Verified:</span> {selectedUser.phoneVerified ? 'Yes' : 'No'}</p>
                    <p className="text-gray-700 text-sm"><span className="font-medium">Facial Verified:</span> {selectedUser.facialVerified ? 'Yes' : 'No'}</p>
                    <p className="text-gray-700 text-sm"><span className="font-medium">Referral Code:</span> {selectedUser.referalCode}</p>
                    <p className="text-gray-700 text-sm"><span className="font-medium">Phone:</span> {selectedUser.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-gray-700 font-medium text-sm mb-2">Favorite Colors:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.favoriteColors.length > 0 ? (
                      selectedUser.favoriteColors.map((color) => (
                        <span
                          key={color}
                          className="w-6 h-6 rounded-full inline-block border border-gray-200"
                          style={{ backgroundColor: color.toLowerCase() }}
                          title={color}
                        ></span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">None</span>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}