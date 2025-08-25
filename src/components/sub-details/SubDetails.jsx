import React from 'react';

export default function SubDetails({ subscription }) {
  const {
    status = 'N/A',
    plan = 'N/A',
    startDate = 'N/A',
    endDate = 'N/A',
    renewal = 'N/A',
    price = 'N/A',
  } = subscription || {};

  // Determine status styling
  const getStatusClass = () => {
    if (status === 'Paused' || status === 'Inactive') return 'text-red-500 bg-red-100';
    if (status === 'Active') return 'text-green-500 bg-green-100';
    return '';
  };

  return (
    <div className="pt-6">
      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Current Plan</p>
            <p className="text-gray-900 font-medium text-sm">{plan}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Subscription Status</p>
            <p className={`text-gray-900 font-medium text-sm ${getStatusClass()} p-1 rounded-full`}>{status}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Start Date</p>
            <p className="text-gray-900 font-medium text-sm">{startDate}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">End Date</p>
            <p className="text-gray-900 font-medium text-sm">{endDate}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Auto Renew</p>
            <p className="text-gray-900 font-medium text-sm">{renewal}</p>
          </div>
        </div>
      </div>
      <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-base font-semibold text-gray-900 mb-4">History</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-600 border-b">
              <th className="text-left py-2">Plan</th>
              <th className="text-left py-2">Amount</th>
              <th className="text-left py-2">Date</th>
              {/* <th className="text-left py-2">Status</th> */}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">1 Week</td>
              <td className="py-2">{price}</td>
              <td className="py-2">{startDate}</td>
              {/* <td className="py-2 text-green-500">Active</td> */}
            </tr>
            <tr className="border-b">
              <td className="py-2">1 Week</td>
              <td className="py-2">{price}</td>
              <td className="py-2">{endDate}</td>
              {/* <td className="py-2 text-red-500">Failed</td> */}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}