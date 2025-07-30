import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CircleDotAnimationProps {
  onAnimationComplete: () => void;
}

const CircleDotAnimation: React.FC<CircleDotAnimationProps> = ({ onAnimationComplete }) => {
  const animationContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create and setup audio
    try {
      audioRef.current = new Audio('/beyonder/beyonder.mp3');
      audioRef.current.volume = 0.5;
      audioRef.current.preload = 'auto';
      
      // Add error handling for audio loading
      audioRef.current.onerror = (e) => {
        console.error('Audio loading error:', e);
      };

      // Add success handler
      audioRef.current.oncanplaythrough = () => {
        console.log('Audio loaded successfully');
      };
    } catch (error) {
      console.error('Error creating audio element:', error);
    }

    // Create animation container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.style.zIndex = '9999';
    container.style.pointerEvents = 'none';
    document.body.appendChild(container);
    animationContainerRef.current = container;

    // Create background circle
    const circle = document.createElement('div');
    circle.style.position = 'absolute';
    circle.style.width = '300px';
    circle.style.height = '300px';
    circle.style.top = '350px';
    circle.style.left = '760px';
    circle.style.opacity = '0';
    container.appendChild(circle);

    // Create main content
    const content = document.createElement('div');
    content.className = 'main-content';
    content.style.position = 'absolute';
    content.style.top = '50%';
    content.style.left = '50%';
    content.style.transform = 'translate(-50%, -50%)';
    content.style.color = 'cyan';
    content.style.textAlign = 'center';
    content.style.zIndex = '2';
    content.style.width = '200px';
    content.style.opacity = '0';
    container.appendChild(content);

    // Create text elements
    const h1 = document.createElement('h1');
    h1.className = 'hologram';
    h1.textContent = 'System Activated';
    h1.style.fontSize = '1px';
    h1.style.marginBottom = '8px';
    h1.style.animation = 'glow 1.5s infinite alternate';
    content.appendChild(h1);

    const p = document.createElement('p');
    p.className = 'hologram';
    p.textContent = 'Beyonder';
    p.style.fontFamily = 'sans-serif';
    p.style.fontSize = '1px';
    p.style.opacity = '0';
    p.style.animation = 'glow 1.5s infinite alternate';
    content.appendChild(p);

    // Create particles
    const numParticles = 50;
    const particles = [];

    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = '4px';
      particle.style.height = '4px';
      particle.style.backgroundColor = 'cyan';
      particle.style.borderRadius = '50%';
      particle.style.boxShadow = '0 0 10px cyan';
      particle.style.transformOrigin = 'center';
      circle.appendChild(particle);

      particles.push({
        element: particle,
        angle: (i / numParticles) * Math.PI * 2,
        radius: 0,
        frequency: Math.random() * 0.5 + 0.5
      });
    }

    // Add glow animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes glow {
        from {
          text-shadow: 0 0 10px cyan, 0 0 20px cyan, 0 0 30px cyan, 0 0 40px cyan;
        }
        to {
          text-shadow: 0 0 20px cyan, 0 0 30px cyan, 0 0 40px cyan, 0 0 50px cyan;
        }
      }
    `;
    document.head.appendChild(style);

    // Fade in the circle and content
    gsap.to(circle, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    });

    gsap.to(content, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    });

    // Animate particles outward
    gsap.to(particles, {
      radius: 150,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        particles.forEach(particle => {
          const x = Math.cos(particle.angle) * particle.radius;
          const y = Math.sin(particle.angle) * particle.radius;
          particle.element.style.transform = `translate(${x}px, ${y}px)`;
        });
      },
      onStart: () => {
        // Play audio when particles start expanding
        if (audioRef.current) {
          try {
            audioRef.current.currentTime = 0;
            const playPromise = audioRef.current.play();
            
            if (playPromise !== undefined) {
              playPromise.then(() => {
                console.log('Audio started playing successfully');
              }).catch(error => {
                console.error('Audio failed to play:', error);
              });
            }
          } catch (error) {
            console.error('Error playing audio:', error);
          }
        }
      }
    });

    // Animate text growth
    gsap.to(h1, {
      fontSize: '24px',
      duration: 2,
      ease: "power2.out"
    });

    gsap.to(p, {
      fontSize: '45px',
      duration: 2.5,
      ease: "power3.out",
      delay: 1,
      opacity: 1,
      onStart: () => {
        gsap.to(p, {
          scale: 1.1,
          duration: 0.5,
          ease: "power2.out",
          yoyo: true,
          repeat: 1
        });
      }
    });

    // Create background speaking animation
    let time = 0;
    const animate = () => {
      time += 0.02;
      particles.forEach(particle => {
        // Base radius
        const baseRadius = 150;
        
        // Frequency-based movement
        const frequency = particle.frequency;
        const amplitude = 20;
        const radius = baseRadius + Math.sin(time * frequency) * amplitude;
        
        // Rotation
        const rotationSpeed = 0.5;
        const currentAngle = particle.angle + time * rotationSpeed;
        
        // Calculate position
        const x = Math.cos(currentAngle) * radius;
        const y = Math.sin(currentAngle) * radius;
        
        // Apply transform
        particle.element.style.transform = `translate(${x}px, ${y}px)`;
        
        // Add glow effect
        const glowIntensity = (Math.sin(time * frequency) + 1) / 2;
        particle.element.style.boxShadow = `0 0 ${5 + glowIntensity * 10}px cyan`;
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start background speaking animation after circle emergence
    setTimeout(animate, 2000);

    // Text animation
    gsap.to(h1, {
      duration: 2,
      opacity: 0.5,
      repeat: -1,
      yoyo: true,
    });

    gsap.to(p, {
      duration: 2,
      opacity: 0.5,
      repeat: -1,
      yoyo: true,
    });

    // Set up the end animation after 7 seconds
    const endAnimation = setTimeout(() => {
      // Shrink and fade out the circle
      gsap.to(circle, {
        opacity: 0,
        duration: 1,
        ease: "power2.in"
      });

      // Shrink and fade out the text
      gsap.to(h1, {
        fontSize: '4px',
        opacity: 0,
        duration: 1,
        ease: "power2.in"
      });

      gsap.to(p, {
        fontSize: '3px',
        opacity: 0,
        duration: 1,
        ease: "power2.in",
        onComplete: () => {
          // Remove the animation elements
          if (animationContainerRef.current) {
            document.body.removeChild(animationContainerRef.current);
            animationContainerRef.current = null;
          }
          
          // Remove the style
          document.head.removeChild(style);
          
          // Stop and cleanup audio
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
          }
          
          // Call the completion callback
          onAnimationComplete();
        }
      });
    }, 7000);

    // Cleanup function
    return () => {
      // Clear all timeouts and intervals
      clearTimeout(endAnimation);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (animationContainerRef.current) {
        document.body.removeChild(animationContainerRef.current);
        animationContainerRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [onAnimationComplete]);

  return null; // This component doesn't render anything directly
};

export default CircleDotAnimation; 