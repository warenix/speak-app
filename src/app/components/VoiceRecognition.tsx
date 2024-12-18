"use client"; // Add this directive at the top

import React, { useEffect, useState, useRef } from 'react';

const VoiceRecognition: React.FC = () => {
  const [recognizing, setRecognizing] = useState(false);
  const [recognizedChunks, setRecognizedChunks] = useState<{ text: string, color: string }[]>([]);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const textBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'yue-Hant-HK';
      recognition.interimResults = true;
      recognition.continuous = true;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (final) {
          setRecognizedChunks(prev => [
            ...prev, 
            { 
              text: final, 
              color: `#${Math.floor(Math.random() * 128).toString(16).padStart(2, '0')}${Math.floor(Math.random() * 128).toString(16).padStart(2, '0')}${Math.floor(Math.random() * 128).toString(16).padStart(2, '0')}`  // Darker color
            }
          ]);
        }
        
        setInterimText(interim);
      };
    } else {
      alert('Your browser does not support Speech Recognition.');
    }
  }, []);

  useEffect(() => {
    if (textBoxRef.current) {
      textBoxRef.current.scrollTop = textBoxRef.current.scrollHeight;
    }
  }, [recognizedChunks, interimText]);

  const handleStart = () => {
    recognitionRef.current?.start();
    setRecognizing(true);
  };

  const handleStop = () => {
    recognitionRef.current?.stop();
    setRecognizing(false);
    setInterimText('');
  };

  return (
    <div>
      <button 
        onClick={recognizing ? handleStop : handleStart}
        className="px-4 py-2 bg-blue-500 text-white rounded">
        {recognizing ? 'Stop Recognition' : 'Start Recognition'}
      </button>
      <div 
        ref={textBoxRef}
        className="mt-4 p-4 border rounded h-64 overflow-y-scroll bg-gray-100 text-4xl"
        contentEditable={true}
        suppressContentEditableWarning={true}>
        {recognizedChunks.map((chunk, index) => (
          <span key={index} style={{ color: chunk.color, marginRight: '0.5em' }}>{chunk.text}</span>
        ))}
        <span className="text-blue-500">{interimText}</span> {/* Highlighting interim text in blue */}
      </div>
    </div>
  );
};

export default VoiceRecognition;
