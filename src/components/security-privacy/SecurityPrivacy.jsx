import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SecurityPrivacy = () => {
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isTwoFAEnabled, setIsTwoFAEnabled] = useState(false);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-5">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 text-sm md:text-base">Phone/Email Address Verification</span>
          <motion.label
            className="flex items-center cursor-pointer"
            whileTap={{ scale: 0.95 }}
          >
            <input
              type="checkbox"
              checked={isEmailVerified}
              onChange={() => setIsEmailVerified(!isEmailVerified)}
              className="hidden"
            />
            <div className={`w-12 h-6 rounded-full ${isEmailVerified ? 'bg-[#bf40bf]' : 'bg-gray-300'} transition-colors duration-300 relative`}>
              <motion.div
                className="w-4 h-4 bg-white rounded-full shadow-md absolute top-1 transition-transform duration-300"
                animate={{ x: isEmailVerified ? 20 : 0 }}
              />
            </div>
          </motion.label>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-700 text-sm md:text-base">2FA Authentication</span>
          <motion.label
            className="flex items-center cursor-pointer"
            whileTap={{ scale: 0.95 }}
          >
            <input
              type="checkbox"
              checked={isTwoFAEnabled}
              onChange={() => setIsTwoFAEnabled(!isTwoFAEnabled)}
              className="hidden"
            />
            <div className={`w-12 h-6 rounded-full ${isTwoFAEnabled ? 'bg-[#bf40bf]' : 'bg-gray-300'} transition-colors duration-300 relative`}>
              <motion.div
                className="w-4 h-4 bg-white rounded-full shadow-md absolute top-1 transition-transform duration-300"
                animate={{ x: isTwoFAEnabled ? 20 : 0 }}
              />
            </div>
          </motion.label>
        </div>
      </div>
    </div>
  );
};

export default SecurityPrivacy;