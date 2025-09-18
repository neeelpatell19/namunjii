import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './BlurImage.css';

const BlurImage = ({
  src,
  alt,
  className = "",
  placeholderSrc = null,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleImageError = () => {
    setHasError(true);
    if (onError) onError();
  };

  return (
    <div className={`blur-image-container ${className}`} {...props}>
      {/* Blur placeholder */}
      {!isLoaded && !hasError && (
        <div className="blur-placeholder">
          <div className="placeholder-content">
            <div className="shimmer"></div>
          </div>
        </div>
      )}

      {/* Actual image */}
      {!hasError && (
        <motion.img
          src={src}
          alt={alt}
          className="actual-image"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          animate={{
            opacity: isLoaded ? 1 : 0,
            filter: isLoaded ? 'blur(0px)' : 'blur(10px)'
          }}
          transition={{
            duration: 0.4,
            ease: "easeOut"
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="image-error">
          <div className="error-content">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#ccc" />
            </svg>
            <span>Image failed to load</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlurImage; 