import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Check, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import SkeletonLoader from '../components/SkeletonLoader';

export default function AdminUsersVerificationRequest() {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const requestsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const fetchRequests = async () => {
      try {
        // Simulate API unavailability with a timeout
        await new Promise((resolve, reject) => setTimeout(() => reject(new Error('API not available yet')), 1000));
      } catch (error) {
        setError('Error fetching verification requests: API not available yet. Please contact support if this persists.');
        console.error('Error fetching verification requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = requests.filter(request =>
        request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRequests(filtered);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, requests]);

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = useMemo(() => filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest), [filteredRequests, indexOfFirstRequest, indexOfLastRequest]);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  const handleViewRequest = (requestId) => {
    navigate(`/admin/verification/${requestId}`);
  };

  const handleApproveRequest = (requestId) => {
    console.log(`Approving request for user ${requestId}`);
  };

  const handleRejectRequest = (requestId) => {
    console.log(`Rejecting request for user ${requestId}`);
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

  if (requests.length === 0) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-y-auto">
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-600 text-lg">No verification requests available at this time.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-0">Verification Requests</h1>
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <img
              src="https://i.pinimg.com/736x/d3/9d/85/d39d854ad761552a841304300c779f53.jpg"
              alt="Admin Profile"
              className="w-6 sm:w-8 h-6 sm:h-8 rounded-full"
              onError={(e) => { e.currentTarget.src = 'https://i.pinimg.com/736x/b5/f2/3c/b5f23cc57e500a2a7d79f903aeff550a.jpg'; }}
            />
            <span className="text-sm sm:text-base text-gray-600">Admin</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-0 text-sm">
            <Link to="/admin/profiles" className="text-purple-700 hover:underline hover:text-purple-500">All Users</Link>
            <Link to="/admin/subscription" className="text-purple-700 hover:underline hover:text-purple-500">Subscriptions</Link>
            <Link to="/admin/users/requests" className="text-purple-700 hover:underline hover:text-purple-500">Verification Requests</Link>
          </div>
          <p className="text-gray-600 text-sm mb-4 sm:mb-0">Pending Requests <span className="font-semibold">{requests.length} requests</span></p>
          <input
            type="text"
            placeholder="Search User..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full shadow-xl text-left border-collapse hidden md:table">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b-2 border-gray-200">
                  <div className="flex items-center">
                    <input type="checkbox" className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-0 mr-1 sm:mr-2" />
                    <span className="text-sm font-medium text-gray-700">Name</span>
                  </div>
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b-2 border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Email Address</span>
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b-2 border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Status</span>
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b-2 border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Request Date</span>
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b-2 border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRequests.map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => handleViewRequest(request.id)}
                >
                  <td className="py-2 sm:py-4 px-2 sm:px-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-0 mr-1 sm:mr-2" />
                      <img src={request.avatar} alt={request.name} className="w-6 h-6 rounded-full mr-1 sm:mr-2" onError={(e) => { e.currentTarget.src = 'https://i.pinimg.com/736x/b5/f2/3c/b5f23cc57e500a2a7d79f903aeff550a.jpg'; }} />
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{request.name}</div>
                        <div className="text-gray-500 text-xs">{request.email.split('@')[0]}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 border-b border-gray-200">
                    <span className="text-sm text-gray-700">{request.email}</span>
                  </td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 border-b border-gray-200">
                    <span className={`inline-flex px-1 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                      request.status === 'Approved' ? 'text-purple-700 bg-purple-100' : 'text-yellow-700 bg-yellow-100'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 border-b border-gray-200">
                    <span className="text-sm text-gray-700">{request.requestDate}</span>
                  </td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 border-b border-gray-200">
                    <div className="flex space-x-1 sm:space-x-2">
                      <button onClick={(e) => { e.stopPropagation(); handleViewRequest(request.id); }} className="text-purple-600 hover:text-purple-800 transition-colors duration-200">
                        <Eye className="w-4 sm:w-5 h-4 sm:h-5" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleApproveRequest(request.id); }} className="text-green-600 hover:text-green-800 transition-colors duration-200">
                        <Check className="w-4 sm:w-5 h-4 sm:h-5" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleRejectRequest(request.id); }} className="text-red-600 hover:text-red-800 transition-colors duration-200">
                        <X className="w-4 sm:w-5 h-4 sm:h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="md:hidden grid grid-cols-1 gap-2">
            {currentRequests.map((request) => (
              <div
                key={request.id}
                className="grid grid-cols-1 gap-2 bg-white p-2 sm:p-4 rounded-lg shadow hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                onClick={() => handleViewRequest(request.id)}
              >
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-0 mr-1" />
                  <img src={request.avatar} alt={request.name} className="w-6 h-6 rounded-full mr-1" onError={(e) => { e.currentTarget.src = 'https://i.pinimg.com/736x/b5/f2/3c/b5f23cc57e500a2a7d79f903aeff550a.jpg'; }} />
                  <div>
                    <div className="font-medium text-gray-900">{request.name}</div>
                    <div className="text-gray-500 text-xs">{request.email.split('@')[0]}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium text-gray-700">Email</div>
                  <div className="text-gray-700">{request.email}</div>
                  <div className="font-medium text-gray-700">Status</div>
                  <div className={`inline-flex px-1 py-0.5 rounded-full text-xs font-medium ${
                    request.status === 'Approved' ? 'text-purple-700 bg-purple-100' : 'text-yellow-700 bg-yellow-100'
                  }`}>
                    {request.status}
                  </div>
                  <div className="font-medium text-gray-700">Request Date</div>
                  <div className="text-gray-700">{request.requestDate}</div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button onClick={(e) => { e.stopPropagation(); handleViewRequest(request.id); }} className="text-purple-600 hover:text-purple-800 transition-colors duration-200">
                    <Eye className="w-4 sm:w-5 h-4 sm:h-5" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleApproveRequest(request.id); }} className="text-green-600 hover:text-green-800 transition-colors duration-200">
                    <Check className="w-4 sm:w-5 h-4 sm:h-5" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleRejectRequest(request.id); }} className="text-red-600 hover:text-red-800 transition-colors duration-200">
                    <X className="w-4 sm:w-5 h-4 sm:h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 text-sm text-gray-500">
          <button
            onClick={() => handlePageChange('prev')}
            disabled={currentPage === 1}
            className="px-2 sm:px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 mb-2 sm:mb-0"
          >
            Previous
          </button>
          <div className="flex flex-wrap justify-center space-x-1 sm:space-x-2 mb-2 sm:mb-0">
            {[...Array(totalPages)].map((_, index) => (
              <span
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-2 sm:px-3 py-1 rounded cursor-pointer ${currentPage === index + 1 ? 'bg-purple-100 text-purple-700 font-medium' : 'hover:bg-gray-100'}`}
              >
                {index + 1}
              </span>
            ))}
          </div>
          <button
            onClick={() => handlePageChange('next')}
            disabled={currentPage === totalPages}
            className="px-2 sm:px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}