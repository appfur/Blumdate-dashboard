import React from 'react';
import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DeletePopup({ onConfirm, onCancel, userId }) {
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
            <Trash2 className="h-10 w-10 text-red-500 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-700 mb-6">Delete this user?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={onCancel}
                className="px-6 py-4 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-6 py-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}