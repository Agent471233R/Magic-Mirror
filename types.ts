export interface GlobalState {
  hasKey: boolean;
  isListening: boolean;
  isProcessing: boolean;
  generatedImage: string | null;
  mirrorText: string;
}

export type ImageSize = '1K' | '2K' | '4K';

export interface AppConfig {
  imageSize: ImageSize;
}

// Extend Window interface for AI Studio helpers
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}