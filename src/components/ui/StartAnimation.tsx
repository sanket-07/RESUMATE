import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import CircleDotAnimation from './CircleDotAnimation';

interface StartAnimationProps {
  onAnimationComplete: () => void;
  onAnimationStart?: () => void;
  className?: string;
}

const StartAnimation: React.FC<StartAnimationProps> = ({ 
  onAnimationComplete, 
  onAnimationStart,
  className = "" 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleStartClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    onAnimationStart?.();
  };

  const handleAnimationComplete = () => {
    setIsAnimating(false);
    onAnimationComplete();
  };

  return (
    <>
      <Button
        id="startButton"
        onClick={handleStartClick}
        className={`absolute top-4 right-4 p-4 text-lg bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 hover:shadow-[0_0_20px_cyan] rounded-md transition-all duration-300 ${className}`}
        disabled={isAnimating}
      >
        {isAnimating ? "Starting..." : "Start"}
      </Button>
      {isAnimating && <CircleDotAnimation onAnimationComplete={handleAnimationComplete} />}
    </>
  );
};

export default StartAnimation; 