import React, { useEffect, useRef, ButtonHTMLAttributes } from 'react';
import { OVERLAY_POSITION_STYLE, OVERLAY_Z_INDEX } from '@/Constants';

const OverlayButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.style.position = OVERLAY_POSITION_STYLE;
      buttonRef.current.style.zIndex = OVERLAY_Z_INDEX;
      buttonRef.current.style.top = '10px';
      buttonRef.current.style.right = '10px';
      buttonRef.current.style.backgroundColor = 'blue';
      buttonRef.current.style.color = 'white';
      buttonRef.current.style.padding = '15px';
      buttonRef.current.style.border = 'none';
      buttonRef.current.style.borderRadius = '5px';
    }
  }, []);

  return <button ref={buttonRef} className="overlay-button" {...props} />;
};

export default OverlayButton;
