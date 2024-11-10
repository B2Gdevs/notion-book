'use client'

import { useEffect } from 'react';

export const useMiddleMouseScroll = () => {
  useEffect(() => {
    let isMiddleMouseDown = false;
    let startY = 0;
    let scrollY = 0;

    const handleMouseDown = (e: any) => {
      if (e.button === 1) { // 1 is the code for the middle mouse button
        isMiddleMouseDown = true;
        startY = e.clientY;
        scrollY = window.scrollY;
        document.body.style.cursor = 'grabbing';
        e.preventDefault(); // Prevent default action
      }
    };

    const handleMouseMove = (e: any) => {
      if (isMiddleMouseDown) {
        const deltaY = startY - e.clientY;
        window.scrollTo(0, scrollY + deltaY * 3); // Adjust scroll speed by changing the multiplier
      }
    };

    const handleMouseUp = (e: any) => {
      if (e.button === 1) {
        isMiddleMouseDown = false;
        document.body.style.cursor = 'default';
      }
    };

    const handleContextMenu = (e: any) => {
      if (e.button === 1) {
        e.preventDefault();
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);
};

