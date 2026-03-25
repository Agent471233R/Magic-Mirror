import React from 'react';
import { ImageSize } from '../types';
import { Settings, Check } from 'lucide-react';

interface SettingsPanelProps {
  imageSize: ImageSize;
  setImageSize: (size: ImageSize) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ imageSize, setImageSize }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="absolute bottom-6 right-6 z-50">
      <div className={`
        bg-black/80 backdrop-blur-md border border-purple-500/30 rounded-lg 
        transition-all duration-300 overflow-hidden
        ${isOpen ? 'w-48 opacity-100 mb-4' : 'w-12 h-0 opacity-0'}
      `}>
        <div className="p-4 flex flex-col gap-2">
          <span className="text-purple-200 text-xs font-serif uppercase tracking-widest mb-2 border-b border-purple-800 pb-1">
            Crystal Quality
          </span>
          {(['1K', '2K', '4K'] as ImageSize[]).map((size) => (
            <button
              key={size}
              onClick={() => {
                setImageSize(size);
                setIsOpen(false);
              }}
              className={`
                flex items-center justify-between px-3 py-2 rounded text-sm font-sans
                ${imageSize === size 
                  ? 'bg-purple-900/50 text-purple-100 border border-purple-500/50' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'}
              `}
            >
              <span>{size}</span>
              {imageSize === size && <Check size={14} />}
            </button>
          ))}
        </div>
      </div>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-900/80 hover:bg-purple-800 text-purple-100 p-3 rounded-full shadow-lg border border-purple-500/50 transition-colors ml-auto flex"
        title="Mirror Settings"
      >
        <Settings size={20} />
      </button>
    </div>
  );
};
