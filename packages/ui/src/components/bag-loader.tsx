
'use client';
import { FC } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import animationData from './lotties/pickup-order.json';

export const BagLoader: FC = () => {
  return (
    <div>
      <Player
        autoplay
        loop
        src={animationData}
        style={{ height: '400px', width: '400px' }}
      />
    </div>
  );
};