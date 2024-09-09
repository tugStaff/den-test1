'use client'

import { useEffect } from 'react';
import OneSignal from 'react-onesignal';

export default function OneSignalInitializer() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initializeOneSignal = async () => {
        try {
          await OneSignal.init({
            appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || '',
            allowLocalhostAsSecureOrigin: true,
          });
          console.log('OneSignal initialized successfully');
        } catch (error) {
          console.error('Error initializing OneSignal:', error);
        }
      };

      initializeOneSignal();
    }
  }, []);

  return null;
}