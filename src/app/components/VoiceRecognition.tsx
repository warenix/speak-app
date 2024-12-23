"use client"; // Add this directive at the top

import React, { useEffect, useState, useRef } from 'react';

const VoiceRecognition: React.FC = () => {
  const [recognizing, setRecognizing] = useState(false);
  const [recognizedChunks, setRecognizedChunks] = useState<{ text: string, color: string }[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const textBoxRef = useRef<HTMLDivElement>(null);
  const isRecognizing = useRef(false); // Track the recognizing state
  const hasStopped = useRef(false); // Track if the recognition should stop
  const retryIntervalRef = useRef<number | null>(null); // Ref to store the interval ID

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'yue-Hant-HK';
      recognition.interimResults = false; // Disable interim results
      recognition.continuous = false; // Disable continuous mode

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
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
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech Recognition Error:", event.error);
        setRecognizing(false);
        isRecognizing.current = false;
      };

      recognition.onend = () => {
        console.log("onend")
        if (!hasStopped.current) {
        console.log("set interval")

          // Retry loop to start recognition again
          retryIntervalRef.current = window.setInterval(() => {
            if (!hasStopped.current) {
              try {
                recognition.start();
              } catch (error) {
                console.error("Failed to restart SpeechRecognition:", error);
              }
            }
          }, 100); // Retry every 100ms
        } else {
          isRecognizing.current = false;
        }
      };

      recognition.onstart = () => {
        if (retryIntervalRef.current !== null) {
          clearInterval(retryIntervalRef.current);
          retryIntervalRef.current = null;
        }
        isRecognizing.current = true;
      };
    } else {
      alert('Your browser does not support Speech Recognition.');
    }
  }, [recognizing]);

  useEffect(() => {
    if (textBoxRef.current) {
      textBoxRef.current.scrollTop = textBoxRef.current.scrollHeight;
    }
  }, [recognizedChunks]);

  const handleStart = () => {
    try {
      if (!isRecognizing.current) {
        hasStopped.current = false;
        recognitionRef.current?.start();
        setRecognizing(true);
        isRecognizing.current = true;
      }
    } catch (error) {
      console.error("Failed to start SpeechRecognition:", error);
    }
  };

  const handleStop = () => {
    window.location.reload();
    if (retryIntervalRef.current !== null) {
      clearInterval(retryIntervalRef.current);
      retryIntervalRef.current = null;
    }

    hasStopped.current = true;
    if (!recognitionRef.current) {
console.log("no ref to stop")
    }
    recognitionRef.current?.stop();
    setRecognizing(false);
    isRecognizing.current = false;
  };

  const handleClear = () => {
    setRecognizedChunks([]);
  };

  return (
    <div>
      <button 
        onClick={recognizing ? handleStop : handleStart}
        className="px-4 py-2 bg-blue-500 text-white rounded">
        {recognizing ? 'Stop Recognition' : 'Start Recognition'}
      </button>
      <button 
        onClick={handleClear}
        className="px-4 py-2 bg-red-500 text-white rounded ml-2">
        Clear Text
      </button>
      <div 
        ref={textBoxRef}
        className="mt-4 p-4 border rounded h-64 overflow-y-scroll bg-gray-100 text-4xl"
        contentEditable={true}
        suppressContentEditableWarning={true}>
        {recognizedChunks.map((chunk, index) => (
          <span key={index} style={{ color: chunk.color, marginRight: '0.5em' }}>{chunk.text}</span>
        ))}
      </div>
    </div>
  );
};

export default VoiceRecognition;
