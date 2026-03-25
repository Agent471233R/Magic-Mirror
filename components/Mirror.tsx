import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Mic, MicOff, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { generateMirrorResponse, generateMirrorImage } from '../services/geminiService';
import { ImageSize } from '../types';

interface MirrorProps {
  imageSize: ImageSize;
}

export const Mirror: React.FC<MirrorProps> = ({ imageSize }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [mirrorText, setMirrorText] = useState("I am listening...");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize Camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user", width: { ideal: 1024 }, height: { ideal: 1024 } }, 
          audio: false 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setMirrorText("The mirror cannot see you. Check permissions.");
      }
    };
    startCamera();
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        
        recognition.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
          handleMagicRequest(text);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [imageSize]); // Dependency on imageSize ensures handleMagicRequest uses current size

  const handleMagicRequest = async (text: string) => {
    setIsProcessing(true);
    setGeneratedImage(null); // Clear previous image to show mirror again
    setMirrorText("Consulting the spirits...");

    try {
      // Parallel execution for speed (Flash Lite) and quality (Pro Image)
      const textPromise = generateMirrorResponse(text);
      const imagePromise = generateMirrorImage(text, imageSize);

      // Handle text response as soon as it's ready (Fast AI)
      textPromise.then(response => {
        setMirrorText(response);
      });

      // Handle image response (Slower but high quality)
      const imageResult = await imagePromise;
      if (imageResult) {
        setGeneratedImage(imageResult);
      }
    } catch (error) {
      setMirrorText("The magic faded... try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setGeneratedImage(null); // Reset to mirror view when starting new interaction
      setMirrorText("Speak your wish...");
      recognitionRef.current.start();
    }
  }, [isListening]);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      
      {/* The Mirror Frame */}
      <div className="relative w-full max-w-2xl aspect-square rounded-full border-8 border-purple-900/50 mirror-frame overflow-hidden bg-black group">
        
        {/* Live Camera Feed (The Reflection) */}
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted 
          className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1] opacity-80"
        />

        {/* Magic Overlay (Generated Image) */}
        {generatedImage && (
          <div className="absolute inset-0 z-10 animate-fade-in">
             <img 
               src={generatedImage} 
               alt="Magic Result" 
               className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          </div>
        )}

        {/* Loading Overlay */}
        {isProcessing && !generatedImage && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <Sparkles className="text-purple-400 w-12 h-12 animate-pulse-slow" />
              <p className="text-purple-200 font-serif mt-4 text-lg animate-pulse">Weaving reality...</p>
            </div>
          </div>
        )}

        {/* Text Response Area */}
        <div className="absolute bottom-12 left-0 right-0 z-30 text-center px-8">
          <p className="text-white font-serif text-xl md:text-2xl shadow-black drop-shadow-lg leading-relaxed">
            {mirrorText}
          </p>
          {transcript && isListening && (
            <p className="text-gray-400 font-sans text-sm mt-2 italic">"{transcript}"</p>
          )}
        </div>

        {/* Interaction Button (Centered in frame when idle, or bottom) */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-40">
           <button
             onClick={toggleListening}
             disabled={isProcessing}
             className={`
               p-4 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.5)]
               ${isListening ? 'bg-red-500/80 hover:bg-red-600' : 'bg-purple-600/80 hover:bg-purple-700'}
               ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
             `}
           >
             {isProcessing ? (
               <Loader2 className="w-8 h-8 text-white animate-spin" />
             ) : isListening ? (
               <MicOff className="w-8 h-8 text-white" />
             ) : generatedImage ? (
               <RefreshCw className="w-8 h-8 text-white" />
             ) : (
               <Mic className="w-8 h-8 text-white" />
             )}
           </button>
        </div>
      </div>
    </div>
  );
};
