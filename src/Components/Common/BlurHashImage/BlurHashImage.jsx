import React, { useState, useRef, useEffect } from "react";
import { decode } from "blurhash";
import "./BlurHashImage.css";

const BlurHashImage = ({
  src,
  blurhash,
  alt = "",
  className = "",
  width = 32,
  height = 32,
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (blurhash && canvasRef.current) {
      try {
        const pixels = decode(blurhash, width, height);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const imageData = ctx.createImageData(width, height);

        for (let i = 0; i < pixels.length; i += 4) {
          imageData.data[i] = pixels[i]; // R
          imageData.data[i + 1] = pixels[i + 1]; // G
          imageData.data[i + 2] = pixels[i + 2]; // B
          imageData.data[i + 3] = 255; // A
        }

        ctx.putImageData(imageData, 0, 0);
      } catch (error) {
        console.warn("Failed to decode blurhash:", error);
      }
    }
  }, [blurhash, width, height]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`blurhash-container ${className}`} {...props}>
      {/* BlurHash placeholder */}
      {blurhash && !imageLoaded && !imageError && (
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="blurhash-placeholder"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}

      {/* Main image */}
      {src && (
        <img
          src={src}
          alt={alt}
          className={`blurhash-image ${imageLoaded ? "loaded" : "loading"}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            display: imageLoaded ? "block" : "none",
          }}
        />
      )}

      {/* Error fallback */}
      {imageError && (
        <div className="blurhash-error">
          <span>Failed to load image</span>
        </div>
      )}
    </div>
  );
};

export default BlurHashImage;
