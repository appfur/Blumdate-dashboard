import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, Trash2, Edit } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import DeletePopup from '../components/DeletePopup';
import SuspendPopup from '../components/SuspendPopup';
import Profile from '../components/profile/Profile';
import SubDetails from '../components/sub-details/SubDetails';
import SecurityPrivacy from '../components/security-privacy/SecurityPrivacy';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminUserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuspendPopup, setShowSuspendPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [activeSection, setActiveSection] = useState('#profile-media'); // Default to Profile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchUser = async () => {
      try {
        const token = import.meta.env.VITE_API_TOKEN;
        if (!token) {
          setError('API token is missing. Please set VITE_API_TOKEN in your .env file.');
          setLoading(false);
          return;
        }
        const response = await fetch(`https://api.blumdate.com/api/v1/admin/profile/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log('API Response:', data); // Debug log
        if (data.status === 'Success' && data.data.userId) {
          const profile = data.data;
          const newUser = {
            id: profile.userId._id,
            name: `${profile.userId.firstName} ${profile.userId.lastName || ''}`,
            username: profile.userId.email.split('@')[0],
            accountType: profile.userId.premium ? 'Premium' : 'Free',
            status: profile.userId.isBlocked ? 'Suspended' : 'Active',
            email: profile.userId.email,
            location: profile.userId.location ? `${profile.userId.location.coordinates[1]}, ${profile.userId.location.coordinates[0]}` : 'Unknown',
            joinDate: new Date(profile.userId.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            lastLogin: new Date(profile.userId.lastLogin || profile.userId.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            avatar: profile.userId.photo || 'https://i.pinimg.com/736x/b5/f2/3c/b5f23cc57e500a2a7d79f903aeff550a.jpg',
            images: profile.images || Array(9).fill('https://i.pinimg.com/736x/b5/f2/3c/b5f23cc57e500a2a7d79f903aeff550a.jpg'),
            subscription: {
              status: profile.userId.premium ? 'Active' : 'Inactive',
              plan: profile.userId.premium ? 'Premium' : 'Free',
              startDate: profile.userId.createdAt ? new Date(profile.userId.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A',
              endDate: profile.userId.premium ? new Date(profile.userId.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A',
              renewal: profile.userId.premium ? 'Auto-Renew Enabled' : 'N/A',
              price: profile.userId.premium ? '$9.99/month' : 'N/A',
            },
          };
          console.log('User object:', newUser); // Debug log
          setUser(newUser);
        } else {
          setError('User not found or failed to load.');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to fetch user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

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
          <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 md:gap-4 lg:gap-4">
            <div className="w-full bg-white p-2 sm:p-3 md:p-4 lg:p-7 rounded-3xl border-gray-50 border-2">
              <div className="h-20 sm:h-24 md:h-28 lg:h-32 w-20 sm:w-24 md:w-28 lg:w-32 bg-gray-300 rounded-full mx-auto mb-1 sm:mb-2 md:mb-3 lg:mb-3 animate-pulse"></div>
              <div className="h-5 sm:h-6 md:h-8 w-1/2 sm:w-2/3 md:w-2/3 bg-gray-300 rounded mx-auto mb-1 sm:mb-2 md:mb-4 animate-pulse"></div>
              <div className="h-3 sm:h-4 md:h-4 w-1/3 sm:w-1/4 md:w-1/4 bg-gray-300 rounded mx-auto mb-1 sm:mb-2 md:mb-4 animate-pulse"></div>
              <div className="space-y-1 sm:space-y-2 md:space-y-2 lg:space-y-2">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="flex justify-between items-center pb-1 sm:pb-2 md:pb-3">
                    <div className="h-3 sm:h-4 md:h-4 w-1/3 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-3 sm:h-4 md:h-4 w-1/2 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
              <div className="pt-1 sm:pt-2 md:pt-2 lg:pt-5 flex space-x-1 sm:space-x-2 md:space-x-2 lg:space-x-2">
                <div className="h-6 sm:h-8 md:h-10 w-1/2 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-6 sm:h-8 md:h-10 w-1/2 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="w-full bg-white p-2 sm:p-3 md:p-4 lg:p-4 rounded-lg">
              <div className="mb-1 sm:mb-2 md:mb-2 lg:mb-4">
                <div className="h-5 sm:h-6 md:h-8 w-1/4 sm:w-1/5 md:w-1/6 bg-gray-300 rounded animate-pulse mb-1 sm:mb-1 md:mb-1 lg:mb-2"></div>
                <div className="flex flex-wrap gap-1 sm:gap-2 md:gap-2 lg:space-x-4 text-xs sm:text-sm md:text-sm lg:text-sm">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="h-3 sm:h-4 md:h-4 w-1/4 sm:w-1/5 md:w-1/5 bg-gray-300 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
              <div>
                <div className="h-5 sm:h-6 md:h-8 w-1/4 sm:w-1/5 md:w-1/6 bg-gray-300 rounded animate-pulse mb-1 sm:mb-1 md:mb-1 lg:mb-2"></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-1 sm:gap-1 md:gap-2 lg:gap-2">
                  {[...Array(9)].map((_, index) => (
                    <div key={index} className="h-12 sm:h-16 md:h-20 lg:h-32 w-12 sm:w-16 md:w-20 lg:w-32 bg-gray-300 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-y-auto">
          <p className="text-gray-700">{error || 'User not found.'}</p>
        </div>
      </div>
    );
  }

  const handleSuspend = () => {
    setShowSuspendPopup(true);
  };

  const confirmSuspend = async (userId) => {
    try {
      const token = import.meta.env.VITE_API_TOKEN;
      const response = await fetch(`https://api.blumdate.com/api/v1/admin/user/blockandunblock/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: user.status === 'Suspended' ? 'unblock' : 'block' }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        setUser(prevUser => ({
          ...prevUser,
          status: prevUser.status === 'Suspended' ? 'Active' : 'Suspended'
        }));
        setShowSuspendPopup(false);
      } else {
        console.error('Failed to suspend/unblock user:', data.message);
      }
    } catch (error) {
      console.error('Error suspending/unblocking user:', error);
    }
  };

  const cancelSuspend = () => {
    setShowSuspendPopup(false);
  };

  const handleDelete = () => {
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    try {
      const token = import.meta.env.VITE_API_TOKEN;
      const response = await fetch(`https://api.blumdate.com/api/v1/admin/profile/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.status === 'Success') {
        navigate('/admin/profiles');
      } else {
        console.error('Failed to delete user:', data.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const cancelDelete = () => {
    setShowDeletePopup(false);
  };

  const handleLinkClick = (section) => {
    setActiveSection(section);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 p-2 sm:p-3 md:p-4 lg:p-6 bg-gray-50 overflow-y-auto">
        <button
          className="lg:hidden p-2 bg-gray-100 rounded-lg mb-2"
          onClick={toggleSidebar}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
        <motion.div
          className="flex flex-col mb-2 sm:mb-3 md:mb-4 lg:mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col sm:flex-col md:flex-col lg:flex-row justify-between items-center mb-2 sm:mb-3 md:mb-4">
            <h1 className="text-xl sm:text-2xl md:text-2xl lg:text-2xl font-semibold mb-2 sm:mb-2 md:mb-0">User Profile</h1>
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
              <img
                src="https://i.pinimg.com/736x/d3/9d/85/d39d854ad761552a841304300c779f53.jpg"
                alt="Admin Profile"
                className="w-5 sm:w-6 md:w-8 h-5 sm:h-6 md:h-8 rounded-full"
                onError={(e) => { e.currentTarget.src = 'https://i.pinimg.com/736x/b5/f2/3c/b5f23cc57e500a2a7d79f903aeff550a.jpg'; }}
              />
              <span className="text-sm sm:text-base md:text-base text-gray-600">Admin</span>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-2 sm:gap-3 md:gap-4 lg:gap-4">
            <motion.div
              className="w-full bg-white p-2 sm:p-3 md:p-4 lg:p-10 rounded-3xl border-gray-50 border-2 shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <img
                src={user.avatar}
                alt={`${user.name}'s profile`}
                className="w-20 sm:w-24 md:w-28 lg:w-32 h-20 sm:h-24 md:h-28 lg:h-32 rounded-full mx-auto mb-1 sm:mb-2 md:mb-3 lg:mb-3 object-cover border-2 border-gray-300"
                onError={(e) => { e.currentTarget.src = 'https://i.pinimg.com/736x/b5/f2/3c/b5f23cc57e500a2a7d79f903aeff550a.jpg'; }}
              />
              <p className="text-center text-xs sm:text-sm md:text-base lg:text-xl font-medium text-gray-700 mb-1 sm:mb-1 md:mb-2 lg:mb-2">{user.name}</p>
              <p className="text-center text-xs sm:text-sm md:text-sm lg:text-sm font-medium bg-green-100 text-green-800 px-1 sm:px-1 md:px-2 lg:px-2 py-0.5 sm:py-0.5 md:py-1 lg:py-1 rounded-full inline-block mb-1 sm:mb-2 md:mb-2 lg:mb-4">{user.subscription.status}</p>
              <div className="space-y-1 sm:space-y-2 md:space-y-2 lg:space-y-2 text-xs sm:text-sm md:text-sm lg:text-sm">
                <div className='flex justify-between items-center pb-1 sm:pb-2 md:pb-2 lg:pb-3'>
                  <p className="text-gray-600">User Name</p>
                  <p className="text-gray-900 font-medium">{user.username}</p>
                </div>
                <div className='flex justify-between items-center pb-1 sm:pb-2 md:pb-2 lg:pb-3'>
                  <p className="text-gray-600">Account Type</p>
                  <p className="font-medium text-purple-600">{user.accountType}</p>
                </div>
                <div className='flex justify-between items-center pb-1 sm:pb-2 md:pb-2 lg:pb-3'>
                  <p className="text-gray-600">Account ID</p>
                  <p className="text-gray-900 font-medium">ID-{user.id.slice(-6)}</p>
                </div>
                <div className='flex justify-between items-center pb-1 sm:pb-2 md:pb-2 lg:pb-3'>
                  <p className="text-gray-600">Email ID</p>
                  <p className="text-gray-900 font-medium break-all">{user.email}</p>
                </div>
                <div className='flex justify-between items-center pb-1 sm:pb-2 md:pb-2 lg:pb-3'>
                  <p className="text-gray-600">Location</p>
                  <p className="text-gray-900 font-medium">{user.location}</p>
                </div>
                <div className='flex justify-between items-center pb-1 sm:pb-2 md:pb-2 lg:pb-3'>
                  <p className="text-gray-600">Language</p>
                  <p className="text-gray-900 font-medium">English</p>
                </div>
                <div className='flex justify-between items-center pb-1 sm:pb-2 md:pb-2 lg:pb-3'>
                  <p className="text-gray-600">Date Joined</p>
                  <p className="text-gray-900 font-medium">{user.joinDate}</p>
                </div>
                <div className='flex justify-between items-center pb-1 sm:pb-2 md:pb-2 lg:pb-3'>
                  <p className="text-gray-600">Last Login</p>
                  <p className="text-gray-900 font-medium">{user.lastLogin}</p>
                </div>
                <div className="pt-1 sm:pt-2 md:pt-2 lg:pt-5 flex space-x-1 sm:space-x-2 md:space-x-2 lg:space-x-2">
                  <button
                    onClick={handleSuspend}
                    className="w-1/2 px-2 sm:px-3 md:px-3 lg:px-3 py-2 sm:py-3 md:py-3 lg:py-4 border-red-500 border rounded-2xl text-red-500 text-xs sm:text-sm md:text-sm lg:text-sm font-medium"
                  >
                    {user.status === 'Suspended' ? 'Unblock' : 'Suspend'}
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-1/2 px-2 sm:px-3 md:px-3 lg:px-3 py-2 sm:py-3 md:py-3 lg:py-2 bg-red-600 rounded-2xl text-white hover:bg-red-700 text-xs sm:text-sm md:text-sm lg:text-sm font-medium"
                  >
                    Delete User
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="w-full bg-white p-2 sm:p-3 md:p-4 lg:p-4 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="">
                <div className="flex flex-wrap gap-1 sm:gap-2 md:gap-2 lg:space-x-4 text-xs sm:text-sm md:text-sm">
                  <a
                    href="#profile-media"
                    onClick={(e) => { e.preventDefault(); handleLinkClick('#profile-media'); }}
                    className={`text-[15px] hover:text-purple-800 ${activeSection === '#profile-media' ? 'font-medium text-purple-600' : ''}`}
                  >
                    Profile Media
                  </a>
                  <a
                    href="#subscription-details"
                    onClick={(e) => { e.preventDefault(); handleLinkClick('#subscription-details'); }}
                    className={`text-[15px] hover:text-purple-800 ${activeSection === '#subscription-details' ? 'font-medium text-purple-600' : ''}`}
                  >
                    Subscription Details
                  </a>
                  <a
                    href="#security-privacy"
                    onClick={(e) => { e.preventDefault(); handleLinkClick('#security-privacy'); }}
                    className={`text-[15px] hover:text-purple-800 ${activeSection === '#security-privacy' ? 'font-medium text-purple-600' : ''}`}
                  >
                    Security & Privacy
                  </a>
                </div>
              </div>
              <hr />
              {activeSection === '#profile-media' && <Profile isLoading={loading} photo={user?.avatar} images={user?.images} />}
              {activeSection === '#subscription-details' && <SubDetails subscription={user?.subscription} />}
              {activeSection === '#security-privacy' && <SecurityPrivacy />}
            </motion.div>
          </div>
        </motion.div>
        <AnimatePresence>
          {showSuspendPopup && (
            <SuspendPopup
              onConfirm={() => confirmSuspend(userId)}
              onCancel={cancelSuspend}
            />
          )}
          {showDeletePopup && (
            <DeletePopup
              onConfirm={confirmDelete}
              onCancel={cancelDelete}
              userId={userId}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}