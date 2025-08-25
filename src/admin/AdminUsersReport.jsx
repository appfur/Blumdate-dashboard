import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import SkeletonLoader from '../components/SkeletonLoader';

export default function AdminUsersReport() {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredReports, setFilteredReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reportsPerPage = 10;

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = import.meta.env.VITE_API_TOKEN;
        if (!token) {
          setError('API token is missing. Please set VITE_API_TOKEN in your .env file.');
          setLoading(false);
          return;
        }
        const baseUrl = import.meta.env.VITE_API_CALL || 'https://api.blumdate.com';
        const response = await fetch(`${baseUrl}/reports`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.status === 'success') {
          setReports(data.data);
          if (data.length === 0 || data.data.length === 0) {
            setError('No reports at the moment.');
          }
        } else {
          setError(data.message || 'Failed to fetch reports.');
        }
      } catch (error) {
        console.error('Error fetching reports:', error.message);
        // Simulate 404 with success body for Postman scenario
        if (error.message.includes('404')) {
          setError('Resource not found. The /reports endpoint returned a 404 error.');
        } else {
          setError('Failed to fetch reports. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = reports.filter(report =>
        (report.userId?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (report.reason || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredReports(filtered);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, reports]);

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = useMemo(() => filteredReports.slice(indexOfFirstReport, indexOfLastReport), [filteredReports, indexOfFirstReport, indexOfLastReport]);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

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

  if (reports.length === 0) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-y-auto">
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-xl sm:text-2xl font-semibold mb-4">Users Reports</h1>
            <p className="text-gray-600 text-lg sm:text-xl">No reports available at the moment.</p>
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
          <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-0">Users Reports</h1>
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
          <p className="text-gray-600 text-sm mb-4 sm:mb-0">Total Reports <span className="font-semibold">{reports.length}</span></p>
          <input
            type="text"
            placeholder="Search by email or reason..."
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
                  <span className="text-sm font-medium text-gray-700">Report ID</span>
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b-2 border-gray-200">
                  <span className="text-sm font-medium text-gray-700">User Email</span>
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b-2 border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Date</span>
                </th>
                <th className="py-2 sm:py-3 px-2 sm:px-4 border-b-2 border-gray-200">
                  <span className="text-sm font-medium text-gray-700">Reason</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentReports.map((report, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="py-2 sm:py-4 px-2 sm:px-4 border-b border-gray-200">
                    <span className="text-sm text-gray-700">{report._id || 'N/A'}</span>
                  </td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 border-b border-gray-200">
                    <span className="text-sm text-gray-700">{report.userId?.email || 'Unknown'}</span>
                  </td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 border-b border-gray-200">
                    <span className="text-sm text-gray-700">{new Date(report.createdAt).toLocaleDateString() || 'N/A'}</span>
                  </td>
                  <td className="py-2 sm:py-4 px-2 sm:px-4 border-b border-gray-200">
                    <span className="text-sm text-gray-700">{report.reason || 'N/A'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="md:hidden grid grid-cols-1 gap-2">
            {currentReports.map((report, index) => (
              <div key={index} className="grid grid-cols-1 gap-2 bg-white p-2 sm:p-4 rounded-lg shadow hover:bg-gray-50 transition-colors duration-200">
                <div className="font-medium text-gray-900">Report ID: {report._id || 'N/A'}</div>
                <div className="text-gray-600">User: {report.userId?.email || 'Unknown'}</div>
                <div className="text-gray-600">Date: {new Date(report.createdAt).toLocaleDateString() || 'N/A'}</div>
                <div className="text-gray-600">Reason: {report.reason || 'N/A'}</div>
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