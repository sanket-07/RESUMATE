'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatbotProps {
  messages?: string[];
  delay?: number;
  startDelay?: number;
  restartDelay?: number;
  loop?: boolean;
}

export default function Chatbot({
  messages = [
    "नमस्कार! क्या आप स्मार्ट कृषि के बारे में अधिक जानना चाहेंगे?🌱",  
"हाँ, मुझे आपके समाधानों के बारे में जानना है।",  
"हम IoT सेंसर, AI विश्लेषण और सतत कृषि पद्धतियों के साथ डेटा-चालित खेती समाधान प्रदान करते हैं।🌱",  
"यह तो बहुत रोचक है! मैं इसे कैसे शुरू कर सकता हूँ?",  
"मैं आपको हमारी टीम से जोड़ रहा हूँ !🌱"
  ],
  delay = 1000, // Slower display time
  startDelay = 1000, // First message delay
  restartDelay = 3000, // Delay before restart
  loop = true
}: ChatbotProps) {
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= messages.length) {
      if (loop) {
        setTimeout(() => {
          setChatMessages([]);
          setCurrentIndex(0);
        }, restartDelay);
      }
      return;
    }

    const isNextMessageFromUser = currentIndex % 2 !== 0;
    
    // Show appropriate typing indicator
    if (isNextMessageFromUser) {
      setIsUserTyping(true);
      setIsTyping(false);
    } else {
      setIsTyping(true);
      setIsUserTyping(false);
    }

    const messageDelay = currentIndex === 0 ? startDelay : delay;

    const messageTimeout = setTimeout(() => {
      setIsTyping(false);
      setIsUserTyping(false);
      setChatMessages(prev => [
        ...prev,
        {
          text: messages[currentIndex],
          isUser: currentIndex % 2 !== 0
        }
      ]);
      setCurrentIndex(prev => prev + 1);
    }, messageDelay);

    return () => clearTimeout(messageTimeout);
  }, [currentIndex, messages, delay, startDelay, restartDelay, loop]);

  return (
    <div className="w-full max-w-sm mx-auto bg-cyan-900/30 backdrop-blur-md rounded-3xl overflow-hidden border border-cyan-600/30 shadow-xl">
      <div className="p-4 bg-cyan-800/50 border-b border-cyan-600/30">
        <div className="flex items-center justify-between">
          <h3 
            className="text-lg font-semibold text-green-400 cursor-pointer hover:text-green-300 transition-colors"
            onClick={() => navigate('/login')}
          >
            Click here
          </h3>
          <button 
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-base font-medium rounded-lg transition-colors duration-300 flex items-center gap-2 shadow-lg hover:scale-105 transform"
            onClick={() => navigate('/login')}
          >
            <i className="fas fa-comment-dots"></i>
            Chat Now
            <i className="fas fa-robot"></i>
          </button>
        </div>
      </div>

      <div className="h-96 p-4 overflow-y-auto flex flex-col space-y-4">
        {chatMessages.map((message, index) => (
          <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.isUser ? 'bg-green-600/80 text-white ml-4' : 'bg-cyan-800/50 text-cyan-50 mr-4'
              } backdrop-blur-sm shadow-lg`}
            >
              {message.text}
            </div>
          </div>
        ))}

        {/* Bot typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-cyan-800/50 p-4 rounded-2xl flex space-x-2 backdrop-blur-sm">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}

        {/* User typing indicator */}
        {isUserTyping && (
          <div className="flex justify-end">
            <div className="bg-green-600/50 p-2 rounded-2xl flex items-center gap-1 backdrop-blur-sm">
              <div className="text-xs text-green-300">typing</div>
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

