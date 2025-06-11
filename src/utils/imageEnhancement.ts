/**
 * Image Enhancement Utilities
 * Provides client-side image processing for profile pictures
 */

export interface ImageEnhancementOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  sharpen?: boolean;
  brighten?: number;
  contrast?: number;
}

export class ImageEnhancer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  /**
   * Enhance profile picture with automatic improvements
   */
  async enhanceProfilePicture(
    imageUrl: string, 
    options: ImageEnhancementOptions = {}
  ): Promise<string> {
    const {
      maxWidth = 400,
      maxHeight = 400,
      quality = 0.9,
      sharpen = true,
      brighten = 0.1,
      contrast = 0.1
    } = options;

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          // Calculate new dimensions maintaining aspect ratio
          const { width, height } = this.calculateDimensions(
            img.width, 
            img.height, 
            maxWidth, 
            maxHeight
          );

          // Set canvas size
          this.canvas.width = width;
          this.canvas.height = height;

          // Clear canvas
          this.ctx.clearRect(0, 0, width, height);

          // Draw image
          this.ctx.drawImage(img, 0, 0, width, height);

          // Apply enhancements
          if (brighten !== 0 || contrast !== 0) {
            this.adjustBrightnessContrast(brighten, contrast);
          }

          if (sharpen) {
            this.applySharpen();
          }

          // Convert to blob and return URL
          this.canvas.toBlob(
            (blob) => {
              if (blob) {
                const enhancedUrl = URL.createObjectURL(blob);
                resolve(enhancedUrl);
              } else {
                reject(new Error('Failed to create blob'));
              }
            },
            'image/jpeg',
            quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = imageUrl;
    });
  }

  /**
   * Calculate optimal dimensions maintaining aspect ratio
   */
  private calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    let { width, height } = { width: originalWidth, height: originalHeight };

    // Scale down if too large
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }

    return { width: Math.round(width), height: Math.round(height) };
  }

  /**
   * Adjust brightness and contrast
   */
  private adjustBrightnessContrast(brightness: number, contrast: number): void {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;

    const brightnessValue = brightness * 255;
    const contrastFactor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));

    for (let i = 0; i < data.length; i += 4) {
      // Apply brightness
      data[i] = Math.min(255, Math.max(0, data[i] + brightnessValue));     // Red
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + brightnessValue)); // Green
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + brightnessValue)); // Blue

      // Apply contrast
      data[i] = Math.min(255, Math.max(0, contrastFactor * (data[i] - 128) + 128));
      data[i + 1] = Math.min(255, Math.max(0, contrastFactor * (data[i + 1] - 128) + 128));
      data[i + 2] = Math.min(255, Math.max(0, contrastFactor * (data[i + 2] - 128) + 128));
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Apply sharpening filter
   */
  private applySharpen(): void {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Sharpening kernel
    const kernel = [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0
    ];

    const newData = new Uint8ClampedArray(data);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) { // RGB channels only
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const pixelIndex = ((y + ky) * width + (x + kx)) * 4 + c;
              const kernelIndex = (ky + 1) * 3 + (kx + 1);
              sum += data[pixelIndex] * kernel[kernelIndex];
            }
          }
          const currentIndex = (y * width + x) * 4 + c;
          newData[currentIndex] = Math.min(255, Math.max(0, sum));
        }
      }
    }

    const newImageData = new ImageData(newData, width, height);
    this.ctx.putImageData(newImageData, 0, 0);
  }

  /**
   * Create circular crop of image
   */
  async createCircularCrop(imageUrl: string, size: number = 200): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          this.canvas.width = size;
          this.canvas.height = size;

          // Create circular clipping path
          this.ctx.beginPath();
          this.ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
          this.ctx.clip();

          // Calculate crop area (center square)
          const minDimension = Math.min(img.width, img.height);
          const cropX = (img.width - minDimension) / 2;
          const cropY = (img.height - minDimension) / 2;

          // Draw cropped image
          this.ctx.drawImage(
            img,
            cropX, cropY, minDimension, minDimension,
            0, 0, size, size
          );

          this.canvas.toBlob(
            (blob) => {
              if (blob) {
                const croppedUrl = URL.createObjectURL(blob);
                resolve(croppedUrl);
              } else {
                reject(new Error('Failed to create blob'));
              }
            },
            'image/jpeg',
            0.9
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = imageUrl;
    });
  }

  /**
   * Clean up created object URLs
   */
  static revokeObjectURL(url: string): void {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }
}

// Singleton instance
export const imageEnhancer = new ImageEnhancer();

// Utility function for easy profile picture enhancement
export const enhanceProfilePicture = async (
  imageUrl: string,
  options?: ImageEnhancementOptions
): Promise<string> => {
  return imageEnhancer.enhanceProfilePicture(imageUrl, options);
};

// Utility function for circular crop
export const createCircularProfilePicture = async (
  imageUrl: string,
  size?: number
): Promise<string> => {
  return imageEnhancer.createCircularCrop(imageUrl, size);
};
