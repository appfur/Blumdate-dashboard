import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Trash2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import DeletePopup from '../components/DeletePopup';
import SkeletonLoader from '../components/SkeletonLoader';

export default function AdminProfiles() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const usersPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      try {
        const token = import.meta.env.VITE_API_TOKEN;
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
            }));
          setUsers(validUsers);
          setFilteredUsers(validUsers);
        } else {
          console.error('API returned non-success status:', data.message);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleViewUser = (userId) => {
    navigate(`/admin/profile/${userId}`);
  };

  const handleDeleteUser = (userId) => {
    setUserToDelete(userId);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const token = import.meta.env.VITE_API_TOKEN;
      const response = await fetch(`https://api.blumdate.com/api/v1/admin/profile/${userToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.status === 'Success') {
        setUsers(users.filter(user => user.id !== userToDelete));
        setFilteredUsers(filteredUsers.filter(user => user.id !== userToDelete));
        setShowDeletePopup(false);
        setUserToDelete(null);
      } else {
        console.error('Failed to delete user:', data.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
    setUserToDelete(null);
  };

  const handlePageChange = (direction) => {
    if (direction === 'prev' && currentPage > 1) setCurrentPage(currentPage - 1);
    else if (direction === 'next' && currentPage < totalPages) setCurrentPage(currentPage + 1);
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

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Management</h1>
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
        <div className="mb-6 flex items-center justify-between">
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-0 text-sm">
            <Link to="/admin/profiles" className="text-purple-700 hover:underline hover:text-purple-500">All Users</Link>
            <Link to="/admin/suspended/users" className="text-purple-700 hover:underline hover:text-purple-500">Suspended Users</Link>
            <Link to="/admin/users/requests" className="text-purple-700 hover:underline hover:text-purple-500">Verification Requests</Link>
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
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
                <th className="py-3 px-4 border-b-2 border-gray-200 text-sm font-semibold text-gray-700">Account Type</th>
                <th className="py-3 px-4 border-b-2 border-gray-200 text-sm font-semibold text-gray-700">Status</th>
                <th className="py-3 px-4 border-b-2 border-gray-200 text-sm font-semibold text-gray-700">Email</th>
                <th className="py-3 px-4 border-b-2 border-gray-200 text-sm font-semibold text-gray-700">Join Date</th>
                <th className="py-3 px-4 border-b-2 border-gray-200 text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => handleViewUser(user.id)}
                >
                  <td className="py-3 px-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" onError={(e) => { e.currentTarget.src = 'https://i.pinimg.com/736x/b5/f2/3c/b5f23cc57e500a2a7d79f903aeff550a.jpg'; }} />
                      <span className="text-sm text-gray-800 font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-600">{user.accountType}</td>
                  <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-600">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'Active' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-600">{user.email}</td>
                  <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-600">{user.joinDate}</td>
                  <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-600">
                    <div className="flex space-x-2">
                      <button onClick={(e) => { e.stopPropagation(); handleViewUser(user.id); }} className="text-purple-600 hover:text-purple-800 transition-colors duration-200">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.id); }} className="text-red-600 hover:text-red-800 transition-colors duration-200">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="md:hidden grid grid-cols-1 gap-2">
            {currentUsers.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-1 gap-2 bg-white p-2 sm:p-4 rounded-lg shadow hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                onClick={() => handleViewUser(user.id)}
              >
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-0 mr-1" />
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full mr-1" onError={(e) => { e.currentTarget.src = 'https://i.pinimg.com/736x/b5/f2/3c/b5f23cc57e500a2a7d79f903aeff550a.jpg'; }} />
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-gray-500 text-xs">{user.email.split('@')[0]}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium text-gray-700">Account Type</div>
                  <div className="text-gray-700">{user.accountType}</div>
                  <div className="font-medium text-gray-700">Status</div>
                  <div className={`inline-flex px-1 py-0.5 rounded-full text-xs font-medium ${
                    user.status === 'Active' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'
                  }`}>
                    {user.status}
                  </div>
                  <div className="font-medium text-gray-700">Email</div>
                  <div className="text-gray-700">{user.email}</div>
                  <div className="font-medium text-gray-700">Join Date</div>
                  <div className="text-gray-700">{user.joinDate}</div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button onClick={(e) => { e.stopPropagation(); handleViewUser(user.id); }} className="text-purple-600 hover:text-purple-800 transition-colors duration-200">
                    <Eye className="w-4 sm:w-5 h-4 sm:h-5" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.id); }} className="text-red-600 hover:text-red-800 transition-colors duration-200">
                    <Trash2 className="w-4 sm:w-5 h-4 sm:h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {showDeletePopup && (
          <DeletePopup
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
            userId={userToDelete}
          />
        )}
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
      </div>
    </div>
  );
}