"use client"; // Add this directive at the top

import Link from 'next/link';
import React, { useState, useEffect, ChangeEvent } from 'react';

const languages = [
  { code: 'yue-Hant-HK', name: 'Cantonese (Traditional), Hong Kong' },
  { code: 'yue-Hant-MO', name: 'Cantonese (Traditional), Macau' },
  { code: 'zh-Hans-CN', name: 'Chinese (Simplified)' },
  { code: 'en-US', name: 'English (United States)' },
  // Add more languages as needed
];

const Settings: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<string>('yue-Hant-HK');

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      setSelectedLang(savedLang);
    }
  }, []);

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newLang = event.target.value;
    setSelectedLang(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 text-white">
      <h1 className="text-4xl mb-6">Settings</h1>
      <div className="mb-4">
        <label className="mr-2">Select Language:</label>
        <select value={selectedLang} onChange={handleLanguageChange} className="p-2 rounded bg-gray-700 border border-cyan-500">
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
      </div>
      <Link href="/" className="px-4 py-2 bg-blue-500 rounded-full">Go Back</Link>
    </div>
  );
};

export default Settings;
