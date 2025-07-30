import React from 'react';
import './ParticleBackground.css';

interface ParticleBackgroundProps {
  isVisible?: boolean;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ isVisible = true }) => {
  return (
    <div className={`particle-container ${!isVisible ? 'hidden' : ''}`}>
      {Array.from({ length: 100 }).map((_, index) => {
        const size = Math.random() * 4 + 4; // Increased size range from 4-8px
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = Math.random() * 2 + 2;
        
        return (
          <div
            key={index}
            className="particle"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              top: `${top}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
};

export default ParticleBackground; 