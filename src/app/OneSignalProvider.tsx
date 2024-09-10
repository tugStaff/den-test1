'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import OneSignal from 'react-onesignal';

interface OneSignalContextType {
  isInitialized: boolean;
  error: string | null;
}

const OneSignalContext = createContext<OneSignalContextType>({
  isInitialized: false,
  error: null
});

export const useOneSignal = () => useContext(OneSignalContext);

interface OneSignalProviderProps {
  children: ReactNode;
}

export default function OneSignalProvider({ children }: OneSignalProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeOneSignal = async () => {
      const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
      if (!appId) {
        const errorMessage = 'OneSignal App ID is not set in environment variables';
        console.error(errorMessage);
        setError(errorMessage);
        return;
      }

      try {
        await OneSignal.init({
          appId: appId,
          allowLocalhostAsSecureOrigin: true,
        });
        console.log('OneSignal initialized successfully');
        setIsInitialized(true);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Error initializing OneSignal:', errorMessage);
        setError(errorMessage);
      }
    };

    initializeOneSignal();
  }, []);

  return (
    <OneSignalContext.Provider value={{ isInitialized, error }}>
      {children}
    </OneSignalContext.Provider>
  );
}