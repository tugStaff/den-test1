'use client'

import { useEffect } from 'react';
import OneSignal from 'react-onesignal';

export default function OneSignalInitializer() {
  useEffect(() => {
    const initializeOneSignal = async () => {
      const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
      
      if (!appId) {
        console.error('OneSignal App ID is not set in environment variables');
        return;
      }

      try {
        await OneSignal.init({
          appId: appId,
          allowLocalhostAsSecureOrigin: true,
        });
        console.log('OneSignal initialized successfully');
      } catch (error) {
        console.error('Error initializing OneSignal:', error);
      }
    };

    initializeOneSignal();
  }, []);

  return null;
}