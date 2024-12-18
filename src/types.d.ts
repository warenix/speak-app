declare global {
    interface Window {
      SpeechRecognition: typeof SpeechRecognition;
      webkitSpeechRecognition: typeof SpeechRecognition;
    }
  
    interface SpeechRecognition extends EventTarget {
      start(): void;
      stop(): void;
      lang: string;
      interimResults: boolean;
      continuous: boolean;
      onresult: (event: SpeechRecognitionEvent) => void;
    }
  
    interface SpeechRecognitionEvent extends Event {
      results: {
        isFinal: boolean;
        [key: number]: {
          transcript: string;
        };
      }[];
      resultIndex: number;
    }
  }
  
  export {};
  