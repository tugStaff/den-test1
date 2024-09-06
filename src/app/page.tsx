'use client'

import { useState } from 'react';
import Image from "next/image";
import OneSignal from 'react-onesignal';

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const handleCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        setImageSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnableNotifications = async () => {
    try {
      // OneSignalの型定義が不完全な場合の対処
      const result = await (OneSignal as unknown as { showSlidedownPrompt: () => Promise<any> }).showSlidedownPrompt();
      console.log('Slidedown prompt result:', result);
    } catch (error) {
      console.error('Error showing notification prompt:', error);
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header>
        <h1 className="text-2xl font-bold mb-4">den-test1</h1>
      </header>
      <main className="flex flex-col gap-8 items-center sm:items-start">
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleCapture}
            className="mb-4"
          />
          {imageSrc && (
            <div style={{ position: 'relative', width: '100%', maxWidth: '500px', height: '300px' }}>
              <Image
                src={imageSrc}
                alt="Captured"
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            </div>
          )}
          <button
            onClick={handleEnableNotifications}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Enable Notifications
          </button>
        </div>
      </main>
    </div>
  );
}