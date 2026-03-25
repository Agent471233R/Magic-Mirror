import React, { useState, useEffect } from 'react';
import { Mirror } from './components/Mirror';
import { SettingsPanel } from './components/SettingsPanel';
import { checkApiKey, openApiKeySelection } from './services/geminiService';
import { ImageSize } from './types';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function App() {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    verifyKey();
  }, []);

  const verifyKey = async () => {
    const valid = await checkApiKey();
    setHasKey(valid);
    setIsLoading(false);
  };

  const handleSelectKey = async () => {
    try {
      await openApiKeySelection();
      // Assume success after dialog interaction, retry check
      setHasKey(true);
    } catch (e) {
      console.error("Failed to select key", e);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!hasKey) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 p-[2px]">
               <div className="h-full w-full rounded-full bg-black flex items-center justify-center">
                 <Sparkles className="h-10 w-10 text-purple-400" />
               </div>
            </div>
            <h2 className="mt-6 text-3xl font-serif text-white tracking-tight">
              Enter the Magic Mirror
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              To gaze into the mirror and transform your reality, you must provide a magical key.
              <br/>
              <span className="text-xs text-gray-500 mt-2 block">
                Requires a paid Google Cloud Project key for Gemini 3 Pro Image Preview.
              </span>
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={handleSelectKey}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all shadow-[0_0_20px_rgba(126,34,206,0.3)] hover:shadow-[0_0_30px_rgba(126,34,206,0.5)]"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <Sparkles className="h-5 w-5 text-purple-300 group-hover:text-purple-200" />
              </span>
              Unlock Mirror
            </button>
            
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-center text-xs text-purple-400/60 hover:text-purple-400 transition-colors"
            >
              Learn about billing <ArrowRight className="ml-1 w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative selection:bg-purple-500/30">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black pointer-events-none"></div>

      <header className="absolute top-0 left-0 right-0 p-6 z-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <Sparkles className="text-purple-500 w-6 h-6" />
           <h1 className="font-serif text-xl tracking-widest text-purple-100/80">MAGIC MIRROR</h1>
        </div>
      </header>

      <main className="relative z-0 h-screen w-full flex flex-col items-center justify-center">
        <Mirror imageSize={imageSize} />
      </main>

      <SettingsPanel imageSize={imageSize} setImageSize={setImageSize} />
    </div>
  );
}
