'use client'

import { useEffect } from 'react';
import OneSignal from 'react-onesignal';

export default function OneSignalInitializer() {
  useEffect(() => {
    const initializeOneSignal = async () => {
      const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
      
      console.log('OneSignal App ID:', appId);

      if (!appId) {
        console.error('OneSignal App ID is not set in environment variables');
        return;
      }

      try {
        await OneSignal.init({
          appId: appId,
          allowLocalhostAsSecureOrigin: true,
          serviceWorkerPath: '/OneSignalSDKWorker.js',
          serviceWorkerUpdaterPath: '/OneSignalSDKUpdaterWorker.js',
        });
        console.log('OneSignal initialized successfully');

        // 型アサーションを使用
        const isPushSupported = await (OneSignal as any).isPushNotificationsSupported();
        console.log('Push notifications supported:', isPushSupported);

        if (isPushSupported) {
          const notificationPermissionStatus = await (OneSignal as any).getNotificationPermission();
          console.log('Notification permission status:', notificationPermissionStatus);
        }
      } catch (error) {
        console.error('Error initializing OneSignal:', error);
      }
    };

    initializeOneSignal();
  }, []);

  return null;
}