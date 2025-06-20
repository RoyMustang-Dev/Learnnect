import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, RotateCw, Move, ZoomIn, ZoomOut, Check, RotateCcw } from 'lucide-react';
import Portal from '../../utils/Portal';

interface ImageAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (adjustedImageBlob: Blob) => void;
  imageUrl: string;
  imageType: 'profile' | 'banner';
}

const ImageAdjustmentModal: React.FC<ImageAdjustmentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  imageUrl,
  imageType
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  const isProfile = imageType === 'profile';
  const aspectRatio = isProfile ? 1 : 1584 / 396; // 1:1 for profile, LinkedIn banner ratio for banner
  const canvasSize = isProfile ? { width: 300, height: 300 } : { width: 400, height: 100 };

  useEffect(() => {
    if (isOpen && imageUrl) {
      setImageLoaded(false);
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    }
  }, [isOpen, imageUrl]);

  useEffect(() => {
    if (imageLoaded) {
      drawImage();
    }
  }, [scale, position, rotation, imageLoaded]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    // Center the image initially
    if (imageRef.current && containerRef.current) {
      const img = imageRef.current;
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      
      // Calculate initial scale to fit the image
      const scaleX = containerRect.width / img.naturalWidth;
      const scaleY = containerRect.height / img.naturalHeight;
      const initialScale = Math.max(scaleX, scaleY);
      
      setScale(initialScale);
      setPosition({ x: 0, y: 0 });
    }
  };

  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || !imageLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context
    ctx.save();

    // Move to center
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // Apply transformations
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.translate(position.x, position.y);

    // Draw image centered
    ctx.drawImage(
      img,
      -img.naturalWidth / 2,
      -img.naturalHeight / 2,
      img.naturalWidth,
      img.naturalHeight
    );

    // Restore context
    ctx.restore();
  }, [scale, position, rotation, imageLoaded, canvasSize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleScaleChange = (newScale: number) => {
    setScale(Math.max(0.1, Math.min(3, newScale)));
  };

  const handleRotate = (degrees: number) => {
    setRotation((prev) => (prev + degrees) % 360);
  };

  const handleConfirm = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create final canvas with proper dimensions
    const finalCanvas = document.createElement('canvas');
    const finalCtx = finalCanvas.getContext('2d');
    if (!finalCtx) return;

    // Set final dimensions based on image type
    if (isProfile) {
      finalCanvas.width = 400;
      finalCanvas.height = 400;
    } else {
      finalCanvas.width = 1584;
      finalCanvas.height = 396;
    }

    // Draw the adjusted image to final canvas
    finalCtx.drawImage(canvas, 0, 0, finalCanvas.width, finalCanvas.height);

    // Convert to blob
    finalCanvas.toBlob((blob) => {
      if (blob) {
        onConfirm(blob);
      }
    }, 'image/jpeg', 0.9);
  };

  const resetAdjustments = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">
              Adjust {isProfile ? 'Profile Picture' : 'Banner Image'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded-lg"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 space-y-6">
            {/* Preview Area */}
            <div className="flex justify-center">
              <div
                ref={containerRef}
                className={`relative border-2 border-dashed border-gray-600 bg-gray-800 overflow-hidden ${
                  isProfile ? 'rounded-full' : 'rounded-lg'
                }`}
                style={{
                  width: canvasSize.width,
                  height: canvasSize.height,
                  cursor: isDragging ? 'grabbing' : 'grab'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                  style={{ pointerEvents: 'none' }}
                />
                
                {/* Overlay instructions */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">
                    <Move className="h-3 w-3 inline mr-1" />
                    Drag to position
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              {/* Scale Control */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Zoom</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleScaleChange(scale - 0.1)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <ZoomOut className="h-4 w-4 text-white" />
                  </button>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={scale}
                    onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <button
                    onClick={() => handleScaleChange(scale + 0.1)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <ZoomIn className="h-4 w-4 text-white" />
                  </button>
                  <span className="text-sm text-gray-400 w-12">{scale.toFixed(1)}x</span>
                </div>
              </div>

              {/* Rotation Control */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Rotation</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleRotate(-90)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <RotateCcw className="h-4 w-4 text-white" />
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    value={rotation}
                    onChange={(e) => setRotation(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <button
                    onClick={() => handleRotate(90)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <RotateCw className="h-4 w-4 text-white" />
                  </button>
                  <span className="text-sm text-gray-400 w-12">{rotation}°</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between p-6 border-t border-gray-700">
            <button
              onClick={resetAdjustments}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Reset
            </button>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-2 bg-neon-cyan hover:bg-cyan-400 text-black rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Check className="h-4 w-4" />
                <span>Apply Changes</span>
              </button>
            </div>
          </div>

          {/* Hidden image for loading */}
          <img
            ref={imageRef}
            src={imageUrl}
            onLoad={handleImageLoad}
            className="hidden"
            alt="Adjustment preview"
          />
        </div>
      </div>
    </Portal>
  );
};

export default ImageAdjustmentModal;
