import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SuspendPopup({ onConfirm, onCancel, userId }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
      >
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md relative"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          <div className="text-center">
            <svg className="h-10 w-10 text-yellow-500 mx-auto mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4.843a1.875 1.875 0 00-3.465 0L3.133 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <p className="text-gray-700 mb-6">Suspend this user?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={onCancel}
                className="px-6 py-4 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirm(userId)}
                className="px-6 py-4 bg-yellow-500 text-white rounded-2xl hover:bg-yellow-700 transition-colors duration-200"
              >
                Suspend
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}