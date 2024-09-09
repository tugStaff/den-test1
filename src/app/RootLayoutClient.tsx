'use client'

import { useEffect } from 'react';
import OneSignal from 'react-onesignal';

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
  useEffect(() => {
    OneSignal.init({
      appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || '',
      allowLocalhostAsSecureOrigin: true,
      serviceWorkerPath: '/OneSignalSDKWorker.js',
      serviceWorkerUpdaterPath: '/OneSignalSDKUpdaterWorker.js',
    }).then(() => {
      console.log('OneSignal initialized');
    });
  }, []);

  return (
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      {children}
    </body>
  );
}