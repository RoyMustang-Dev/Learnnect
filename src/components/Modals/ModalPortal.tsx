import React from 'react';
import { createPortal } from 'react-dom';

interface ModalPortalProps {
  children: React.ReactNode;
  isOpen: boolean;
}

const ModalPortal: React.FC<ModalPortalProps> = ({ children, isOpen }) => {
  if (!isOpen) return null;

  // Create portal to render modal outside of component tree
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pt-20">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal Content Container */}
      <div className="relative w-full max-w-2xl max-h-[calc(100vh-6rem)] overflow-y-auto">
        {children}
      </div>
    </div>,
    document.body
  );
};

export default ModalPortal;
