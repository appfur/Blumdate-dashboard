import React, { useState, useEffect } from 'react';

export default function Profile({ isLoading, photo, images, videos = [] }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!isLoading && (photo || images.length > 0)) {
      setImageLoaded(true);
    } else {
      setImageLoaded(false);
    }
  }, [isLoading, photo, images]);

  if (isLoading || !imageLoaded) {
    return (
      <div className="pt-6">
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 mb-1 sm:mb-2 md:mb-3 lg:mb-4">
          <div alt="Loading placeholder" className="animate-pulse h-5 sm:h-6 md:h-7 lg:h-8 xl:h-9 w-1/4 sm:w-1/5 md:w-1/6 lg:w-1/7 xl:w-1/8 bg-gray-200 rounded-lg"></div>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-1 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-5">
          {[...Array(6)].map((_, index) => (
            <img
              key={index}
              src="https://i.pinimg.com/736x/d3/df/f2/d3dff2fe437beac3e290c10082b894b4.jpg"
              alt={`Loading image ${index + 1}`}
              className="animate-pulse object-cover rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-6">
      {photo && (
        <div className="mb-4 flex justify-center">
          <img
            src={photo}
            alt="User profile"
            className="w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64 object-cover rounded-lg border-2 border-gray-300"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.currentTarget.src = 'https://cdn.blumdate.com/default-avatar.jpg';
            }}
          />
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-1 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-5">
        {images.length > 0 ? images.map((image, index) => (
          <img
            key={index}
            src={image || 'https://cdn.blumdate.com/default-avatar.jpg'}
            alt={`User image ${index + 1}`}
            className="w-24 sm:w-28 md:w-32 lg:w-36 xl:w-40 h-24 sm:h-28 md:h-32 lg:h-36 xl:h-40 object-cover rounded-lg"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.currentTarget.src = 'https://cdn.blumdate.com/default-avatar.jpg';
            }}
          />
        )) : (
          <div className="col-span-full text-center text-gray-500">No additional images available</div>
        )}
      </div>
    </div>
  );
}