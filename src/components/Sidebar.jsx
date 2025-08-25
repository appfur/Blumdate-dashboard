import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "/src/assets/logo-text.png"
import { Menu, LayoutDashboard, Users, ShieldCheck, CreditCard, Flag, Mail, User, LogOut } from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Simple logout logic: clear token/session and redirect
    localStorage.removeItem('authToken'); // Example: remove token from localStorage
    navigate('/login');
  };

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="md:hidden lg:hidden fixed top-2 left-2 z-50 p-1 sm:p-2 bg-gray-100 rounded"
      >
        <Menu className="w-5 sm:w-6 h-5 sm:h-6" />
      </button>
      <div
        className={`shadow-lg h-screen bg-gray-200 flex flex-col justify-between transition-all duration-300 ease-in-out fixed md:static z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 w-64 sm:w-64 md:w-64 lg:w-72 xl:w-72 p-2 sm:p-3 md:p-4`}
      >
        <div>
          <div className="flex items-center mb-4 sm:mb-6 md:mb-8">
            <img
              className="h-8 sm:h-10 md:h-10 lg:h-10 w-auto m-2 sm:m-3 md:m-4"
              src={logo}
              alt="blumdate-logo"
            />
          </div>
          <Link
            to="/admin/dashboard"
            className="w-full text-left bg-[#c805b8] rounded-xl text-white py-2 sm:py-2 md:py-3 px-3 sm:px-4 md:px-4 mb-1 sm:mb-2 md:mb-2 hover:bg-purple-700 flex items-center text-sm sm:text-sm md:text-base"
          >
            <LayoutDashboard className="w-4 sm:w-5 md:w-5 h-4 sm:h-5 md:h-5 mr-1 sm:mr-2 md:mr-2" />
            Dashboard
          </Link>
          <Link
            to="/admin/profiles"
            className="w-full hover:bg-gray-100 text-left text-gray-700 py-2 sm:py-2 md:py-3 px-3 sm:px-4 md:px-4 mb-1 sm:mb-2 md:mb-2 hover:rounded-xl flex items-center text-sm sm:text-sm md:text-base"
          >
            <Users className="w-4 sm:w-5 md:w-5 h-4 sm:h-5 md:h-5 mr-1 sm:mr-2 md:mr-2" />
            User Management
          </Link>
          <Link
            to="/admin/content/moderation"
            className="w-full hover:bg-gray-100 text-left text-gray-700 py-2 sm:py-2 md:py-3 px-3 sm:px-4 md:px-4 mb-1 sm:mb-2 md:mb-2 hover:rounded-xl flex items-center text-sm sm:text-sm md:text-base"
          >
            <ShieldCheck className="w-4 sm:w-5 md:w-5 h-4 sm:h-5 md:h-5 mr-1 sm:mr-2 md:mr-2" />
            Content Moderation
          </Link>
          <Link
            to="/admin/subscriptions"
            className="w-full hover:bg-gray-100 text-left text-gray-700 py-2 sm:py-2 md:py-3 px-3 sm:px-4 md:px-4 mb-1 sm:mb-2 md:mb-2 hover:rounded-xl flex items-center text-sm sm:text-sm md:text-base"
          >
            <CreditCard className="w-4 sm:w-5 md:w-5 h-4 sm:h-5 md:h-5 mr-1 sm:mr-2 md:mr-2" />
            Subscriptions
          </Link>
          <Link
            to="/admin/report/abuse"
            className="w-full hover:bg-gray-100 text-left text-gray-700 py-2 sm:py-2 md:py-3 px-3 sm:px-4 md:px-4 mb-1 sm:mb-2 md:mb-2 hover:rounded-xl flex items-center text-sm sm:text-sm md:text-base"
          >
            <Flag className="w-4 sm:w-5 md:w-5 h-4 sm:h-5 md:h-5 mr-1 sm:mr-2 md:mr-2" />
            Reports & Abuse
          </Link>
          <Link
            to="/admin/communication-mgt"
            className="w-full hover:bg-gray-100 text-left text-gray-700 py-2 sm:py-2 md:py-3 px-3 sm:px-4 md:px-4 mb-1 sm:mb-2 md:mb-2 hover:rounded-xl flex items-center text-sm sm:text-sm md:text-base"
          >
            <Mail className="w-4 sm:w-5 md:w-5 h-4 sm:h-5 md:h-5 mr-1 sm:mr-2 md:mr-2" />
            Communication Mgt
          </Link>
          {/* <Link
            to="/admin/profile"
            className="w-full hover:bg-gray-100 text-left text-gray-700 py-2 sm:py-2 md:py-3 px-3 sm:px-4 md:px-4 mb-1 sm:mb-2 md:mb-2 hover:rounded-xl flex items-center text-sm sm:text-sm md:text-base"
          >
            <User className="w-4 sm:w-5 md:w-5 h-4 sm:h-5 md:h-5 mr-1 sm:mr-2 md:mr-2" />
            Profile
          </Link> */}
          <button
            onClick={handleLogout}
            className="w-full hover:bg-red-200 rounded-xl text-left text-red-500 py-2 sm:py-2 md:py-3 px-3 sm:px-4 md:px-4 flex items-center text-sm sm:text-sm md:text-base"
          >
            <LogOut className="w-4 sm:w-5 md:w-5 h-4 sm:h-5 md:h-5 mr-1 sm:mr-2 md:mr-2" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}