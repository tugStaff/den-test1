'use client'

import { useEffect, useState } from 'react';
import OneSignal from 'react-onesignal';

// カスタム型定義
interface CustomFont {
  className: string;
  style: {
    fontFamily: string;
  };
  variable: string;
}

interface RootLayoutClientProps {
  children: React.ReactNode;
  geistSans: CustomFont;
  geistMono: CustomFont;
}

export default function RootLayoutClient({ children, geistSans, geistMono }: RootLayoutClientProps) {
  const [oneSignalInitialized, setOneSignalInitialized] = useState(false);

  useEffect(() => {
    const initOneSignal = async () => {
      if (!oneSignalInitialized) {
        try {
          await OneSignal.init({
            appId: "2db341ef-628c-481b-8a84-f388bdcd06bf",
            allowLocalhostAsSecureOrigin: true,
          });
          setOneSignalInitialized(true);
          console.log('OneSignal initialized successfully');
        } catch (error) {
          console.error('Error initializing OneSignal:', error);
        }
      }
    };

    initOneSignal();
  }, [oneSignalInitialized]);

  return (
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      {children}
    </body>
  );
}