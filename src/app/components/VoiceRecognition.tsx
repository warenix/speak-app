"use client"; // Add this directive at the top

import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';

const VoiceRecognition: React.FC = () => {
  const [recognizing, setRecognizing] = useState(false);
  const [recognizedChunks, setRecognizedChunks] = useState<{ text: string, color: string }[]>([]);
  const [stopping, setStopping] = useState(false); // Track the stopping state
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const textBoxRef = useRef<HTMLDivElement>(null);
  const isRecognizing = useRef(false); // Track the recognizing state
  const hasStopped = useRef(false); // Track if the recognition should stop
  const retryIntervalRef = useRef<number | null>(null); // Ref to store the interval ID
  const [language, setLanguage] = useState('yue-Hant-HK'); // State for language setting

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = language;
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
              color: `#${Math.floor(Math.random() * 128 + 128).toString(16).padStart(2, '0')}${Math.floor(Math.random() * 128 + 128).toString(16).padStart(2, '0')}${Math.floor(Math.random() * 128 + 128).toString(16).padStart(2, '0')}`  // Lighter color
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
        console.log("onend");
        if (!hasStopped.current) {
          console.log("set interval");

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
          setStopping(false); // Update state to reflect that stopping has completed
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
  }, [recognizing, language]);

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
    if (retryIntervalRef.current !== null) {
      clearInterval(retryIntervalRef.current);
      retryIntervalRef.current = null;
    }

    hasStopped.current = true;
    setStopping(true); // Indicate that stopping process has started
    recognitionRef.current?.stop();
    setRecognizing(false);
    isRecognizing.current = false;
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 text-white">
      <div className="p-4 flex items-center justify-between">
        <div className="flex space-x-4">
          <button 
            onClick={recognizing ? handleStop : handleStart}
            className={`text-sm px-6 py-3 border-2 border-cyan-500 hover:border-cyan-300 transition duration-300 rounded-full ${stopping ? 'bg-gray-700' : 'bg-blue-500'}`}
            disabled={stopping}>
            {recognizing ? (stopping ? 'Stopping...' : 'Stop Recognition') : 'Start Recognition'}
          </button>
          <button 
            onClick={handleReload}
            className="text-sm px-6 py-3 border-2 border-cyan-500 hover:border-cyan-300 transition duration-300 rounded-full bg-gray-700">
            Reload Page
          </button>
          <Link href="/settings" className="text-sm px-6 py-3 border-2 border-cyan-500 hover:border-cyan-300 transition duration-300 rounded-full bg-gray-700">
            Settings
          </Link>
        </div>
      </div>
      <div 
        ref={textBoxRef}
        className="flex-grow p-6 border border-cyan-500 rounded-lg overflow-y-scroll bg-gray-800 text-4xl leading-relaxed">
        {recognizedChunks.map((chunk, index) => (
          <span key={index} style={{ color: chunk.color, marginRight: '0.5em' }}>{chunk.text}</span>
        ))}
      </div>
      {stopping && (
        <div className="p-2 bg-yellow-200 text-yellow-800 rounded text-center mt-2">
          Stopping...
        </div>
      )}
    </div>
  );
};

export default VoiceRecognition;
