import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function AdminCommunicationManagement() {
  const [activeTab, setActiveTab] = useState('messages');

  const tabs = [
    { id: 'messages', label: 'Messages' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'logs', label: 'Communication Logs' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
          Communication Management
        </h1>
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-4 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm sm:text-base font-medium rounded-t-lg ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          {activeTab === 'messages' && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-4">
                User Messages
              </h2>
              <p className="text-gray-600 mb-4">
                Manage and view user-to-user or admin-to-user messages. Add filters or send new messages here.
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-gray-700">User: john_doe</span>
                  <span className="text-gray-500">Last message: 08/21/2025</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-gray-700">User: jane_smith</span>
                  <span className="text-gray-500">Last message: 08/20/2025</span>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-4">
                Notifications
              </h2>
              <p className="text-gray-600 mb-4">
                Send or review system notifications to users. Schedule or edit notifications here.
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-gray-700">New Feature Alert</span>
                  <span className="text-gray-500">Sent: 08/22/2025</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-gray-700">Maintenance Notice</span>
                  <span className="text-gray-500">Scheduled: 08/23/2025</span>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'logs' && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-4">
                Communication Logs
              </h2>
              <p className="text-gray-600 mb-4">
                Track all communication activities for auditing. Filter by date or user.
              </p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-gray-700">Admin to john_doe</span>
                  <span className="text-gray-500">08/21/2025 14:30</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <span className="text-gray-700">System to jane_smith</span>
                  <span className="text-gray-500">08/20/2025 09:15</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}