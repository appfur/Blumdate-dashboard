import React from 'react';

export default function SkeletonLoader() {
  const usersPerPage = 10;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 animate-pulse">
        <div className="h-8 w-1/2 sm:w-1/4 bg-gray-300 rounded mb-2 sm:mb-0"></div>
        <div className="flex items-center space-x-2">
          <div className="h-6 sm:h-8 w-6 sm:w-8 bg-gray-300 rounded-full"></div>
          <div className="h-6 w-20 sm:w-24 bg-gray-300 rounded"></div>
        </div>
      </div>
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex flex-wrap gap-2 mb-2 sm:mb-0 text-sm">
            <div className="h-4 w-16 bg-gray-300 rounded"></div>
            <div className="h-4 w-20 bg-gray-300 rounded"></div>
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
          </div>
          <div className="h-4 w-20 bg-gray-300 rounded mb-2 sm:mb-0"></div>
          <div className="h-8 w-full sm:w-1/3 bg-gray-300 rounded"></div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse hidden md:table">
          <thead className="bg-gray-50">
            <tr>
              {['Name', 'Account Type', 'Status', 'Email Address', 'Join Date', 'Action'].map((header, index) => (
                <th key={index} className="py-2 sm:py-3 px-2 sm:px-4 border-b-2 border-gray-200">
                  <div className="flex items-center">
                    {index === 0 && <div className="h-4 w-4 bg-gray-300 rounded mr-1 sm:mr-2"></div>}
                    <div className="h-4 w-16 sm:w-20 bg-gray-300 rounded"></div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(usersPerPage)].map((_, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="py-2 sm:py-4 px-2 sm:px-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className="h-4 w-4 bg-gray-300 rounded mr-1 sm:mr-2"></div>
                    <div className="h-6 w-6 bg-gray-300 rounded-full mr-1 sm:mr-2"></div>
                    <div>
                      <div className="h-4 w-20 sm:w-24 bg-gray-300 rounded"></div>
                      <div className="h-3 w-16 sm:w-20 bg-gray-300 rounded mt-1"></div>
                    </div>
                  </div>
                </td>
                <td className="py-2 sm:py-4 px-2 sm:px-4 border-b border-gray-200">
                  <div className="h-4 w-16 sm:w-20 bg-gray-300 rounded"></div>
                </td>
                <td className="py-2 sm:py-4 px-2 sm:px-4 border-b border-gray-200">
                  <div className="h-4 w-16 sm:w-20 bg-gray-300 rounded"></div>
                </td>
                <td className="py-2 sm:py-4 px-2 sm:px-4 border-b border-gray-200">
                  <div className="h-4 w-24 sm:w-32 bg-gray-300 rounded"></div>
                </td>
                <td className="py-2 sm:py-4 px-2 sm:px-4 border-b border-gray-200">
                  <div className="h-4 w-16 sm:w-20 bg-gray-300 rounded"></div>
                </td>
                <td className="py-2 sm:py-4 px-2 sm:px-4 border-b border-gray-200">
                  <div className="flex space-x-1 sm:space-x-2">
                    <div className="h-4 w-4 sm:w-5 bg-gray-300 rounded"></div>
                    <div className="h-4 w-4 sm:w-5 bg-gray-300 rounded"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="md:hidden grid grid-cols-1 gap-2">
          {[...Array(usersPerPage)].map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-1 gap-1 bg-white p-2 sm:p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="h-4 w-4 bg-gray-300 rounded"></div>
                <div className="h-6 w-6 bg-gray-300 rounded-full mr-1"></div>
                <div>
                  <div className="h-4 w-20 sm:w-24 bg-gray-300 rounded"></div>
                  <div className="h-3 w-16 sm:w-20 bg-gray-300 rounded mt-1"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="h-4 w-16 sm:w-20 bg-gray-300 rounded"></div>
                <div className="h-4 w-16 sm:w-20 bg-gray-300 rounded"></div>
                <div className="h-4 w-16 sm:w-20 bg-gray-300 rounded"></div>
                <div className="h-4 w-24 sm:w-32 bg-gray-300 rounded"></div>
                <div className="h-4 w-16 sm:w-20 bg-gray-300 rounded"></div>
                <div className="flex justify-end space-x-1 sm:space-x-2">
                  <div className="h-4 w-4 sm:w-5 bg-gray-300 rounded"></div>
                  <div className="h-4 w-4 sm:w-5 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6">
        <div className="h-8 w-20 sm:w-24 bg-gray-300 rounded mb-2 sm:mb-0"></div>
        <div className="flex flex-wrap justify-center space-x-1 sm:space-x-2 mb-2 sm:mb-0">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-6 w-6 sm:w-8 bg-gray-300 rounded"></div>
          ))}
        </div>
        <div className="h-8 w-20 sm:w-24 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}