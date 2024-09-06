'use client'

import { useState } from 'react';
import Image from "next/image";

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
            capture="environment"
            onChange={handleCapture}
            className="mb-4"
          />
          {imageSrc && (
            <img
              src={imageSrc}
              alt="Captured"
              style={{ maxWidth: '100%', marginTop: '20px' }}
              className="rounded-lg shadow-lg"
            />
          )}
        </div>
      </main>
    </div>
  );
}