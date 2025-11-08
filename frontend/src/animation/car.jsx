

import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';

export default function PlaneAnimation() {
  return (
    <div className="fixed top-20 left-0 w-32 h-32 pointer-events-none z-50 animate-fly">
      <Player
        autoplay
        loop
        src="https://lottie.host/5002cf9d-451a-44ab-b587-a7edf22e078f/Ax1tU9ElHe.lottie"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}