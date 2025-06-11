import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: ReactNode;
  containerId?: string;
}

const Portal: React.FC<PortalProps> = ({ children, containerId = 'portal-root' }) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Try to find existing container
    let portalContainer = document.getElementById(containerId);
    
    // Create container if it doesn't exist
    if (!portalContainer) {
      portalContainer = document.createElement('div');
      portalContainer.id = containerId;
      portalContainer.style.position = 'relative';
      portalContainer.style.zIndex = '9999';
      document.body.appendChild(portalContainer);
    }
    
    setContainer(portalContainer);
    
    // Cleanup function
    return () => {
      // Only remove if it's empty and we created it
      if (portalContainer && portalContainer.children.length === 0 && portalContainer.id === containerId) {
        document.body.removeChild(portalContainer);
      }
    };
  }, [containerId]);

  // Don't render until container is ready
  if (!container) return null;

  return createPortal(children, container);
};

export default Portal;
