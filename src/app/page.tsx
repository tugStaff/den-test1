'use client'

import { useState, useEffect } from 'react';
import Image from "next/image";
import OneSignal from 'react-onesignal';

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      const isPushSupported = await (OneSignal as any).isPushNotificationsSupported();
      if (isPushSupported) {
        const permission = await (OneSignal as any).getNotificationPermission();
        setIsSubscribed(permission === 'granted');
      } else {
        console.log('Push notifications are not supported');
      }
    } catch (error) {
      console.error('Error checking notification permission:', error);
    }
  };

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

  const subscribeUser = async () => {
    try {
      const result = await (OneSignal as any).showNativePrompt();
      console.log('Prompt result:', result);
      await checkSubscriptionStatus();
    } catch (error) {
      console.error('Failed to subscribe the user: ', error);
    }
  };

  const sendNotification = async () => {
    if (!notificationMessage) {
      alert('Please enter a message for the notification.');
      return;
    }

    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: notificationMessage }),
      });
      const data = await response.json();
      console.log('Notification sent:', data);
      alert('Notification sent successfully!');
      setNotificationMessage('');
    } catch (error) {
      console.error('Failed to send notification:', error);
      alert('Failed to send notification. Please try again.');
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
        </div>
        <button
          onClick={subscribeUser}
          disabled={isSubscribed}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isSubscribed ? 'Subscribed to notifications' : 'Subscribe to notifications'}
        </button>
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
          <input
            type="text"
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
            placeholder="Enter notification message"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendNotification}
            disabled={!isSubscribed}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            Send Notification
          </button>
        </div>
      </main>
    </div>
  );
}