"use client";
import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

declare global {
    interface Window {
        ZegoUIKitPrebuilt: {
            generateKitTokenForTest: (appID: number, serverSecret: string, roomID: string, userID: string, userName: string) => string;
            create: (token: string) => {
                joinRoom: (config: {
                    container: HTMLElement;
                    sharedLinks?: Array<{ name: string; url: string }>;
                    scenario: { mode: string };
                }) => void;
            };
            OneONoneCall: string;
        };
    }
}

interface VideoInterviewProps {
    ngrokUrl?: string;
    appID?: number;
    serverSecret?: string;
    roomid?: boolean;
    isRoom?: boolean;
}

const VideoInterview: React.FC<VideoInterviewProps> = ({ 
    ngrokUrl = 'https://a4c4-150-107-16-12.ngrok-free.app',
    appID = 2128937685,
    serverSecret = "cdbd6af0aaa52e5a222272f8553195c5",
    roomid = false,
    isRoom = false
}) => {
    const [name, setName] = useState('');
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { roomid: urlRoomid } = useParams();

    useEffect(() => {
        // Check if script is already loaded
        if (window.ZegoUIKitPrebuilt) {
            setScriptLoaded(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@zegocloud/zego-uikit-prebuilt@1.0.0/zego-uikit-prebuilt.js';
        script.async = true;
        script.onload = () => setScriptLoaded(true);
        document.head.appendChild(script);

        return () => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    const handleNameSubmit = () => {
        if (name.trim()) {
            navigate(`/interview/${name.trim()}`);
        }
    };

    const myMeeting = async (element: HTMLDivElement) => {
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, urlRoomid?.toString() || '', Date.now().toString(), 'Swarup');

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
            container: element,
            sharedLinks: [
                {
                    name: 'Personal link',
                    url: 'https://ac05-150-107-16-112.ngrok-free.app/room/' + urlRoomid,
                },
            ],
            scenario: {
                mode: ZegoUIKitPrebuilt.OneONoneCall,
            },
        });
    };

    useEffect(() => {
        if (!containerRef.current || !scriptLoaded) {
            return;
        }
        if (urlRoomid) {
            myMeeting(containerRef.current);
        }
    }, [urlRoomid, scriptLoaded]);

    if (urlRoomid) {
        return (
            <div style={{ 
                width: '100vw', 
                height: '100vh',
                position: 'relative'
            }} ref={containerRef} />
        );
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                textAlign: 'center'
            }}>
                <h2 style={{
                    fontSize: '24px',
                    marginBottom: '20px',
                    color: '#333'
                }}>Enter Interview Name</h2>
                
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '20px'
                }}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                            padding: '12px',
                            fontSize: '16px',
                            border: '2px solid #ddd',
                            borderRadius: '4px',
                            width: '300px',
                            outline: 'none'
                        }}
                        placeholder="Enter name" 
                    />
                    <button
                        style={{
                            padding: '12px 24px',
                            fontSize: '16px',
                            backgroundColor: '#0070f3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                        onClick={handleNameSubmit}
                    >
                        OK
                    </button>
                </div>
                
                {name && (
                    <p style={{
                        color: '#666',
                        fontSize: '14px'
                    }}>
                        Click OK to join interview as: <strong>{name}</strong>
                    </p>
                )}
            </div>
        </div>
    );
};

export default VideoInterview; 