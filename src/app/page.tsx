'use client'

import { useState, useEffect, useCallback } from 'react';
import Image from "next/image";
import OneSignal from 'react-onesignal';
import { useOneSignal } from './OneSignalProvider';

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isPushSupported, setIsPushSupported] = useState(true);
  const [isPushPermission, setIsPushPermission] = useState(true);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { isInitialized } = useOneSignal();

  const checkNotification = useCallback(async () => {
    if (!isInitialized) return;

    try {
      // 環境
      const isSupport = await OneSignal.Notifications.isPushSupported();
      setIsPushSupported(isSupport);
      if (!isSupport) {
        console.log('Push notifications are not supported in this environment');
        return;
      }

      // 権限
      const permissionNative = await OneSignal.Notifications.permissionNative;
      const isPermission = (permissionNative === 'denied')? false : true;
      setIsPushPermission(isPermission);
      if(!isPermission){
        throw new Error('Not Permission');
      }

      // 購読状態
      let optedIn = await OneSignal.User.PushSubscription.optedIn;
      const isOptedIn = (optedIn === true)? true : false;
      setIsSubscribed(isOptedIn);

    } catch (error) {
      console.error('Error checking notification status:', error);
    }
  }, [isInitialized]);


  useEffect(() => {
    if (isInitialized) {
      checkNotification();
    }
  }, [isInitialized, checkNotification]);

  const handleToggle = async () => {

    if (!isSubscribed) {
      await OneSignal.User.PushSubscription.optIn();
    } else {
      await OneSignal.User.PushSubscription.optOut();
    }
    setIsSubscribed(!isSubscribed);
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
      alert('プッシュ通知送信成功!');
      setNotificationMessage('');
    } catch (error) {
      console.error('Failed to send notification:', error);
      alert('Failed to send notification. Please try again.');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = function(e) {
        setImageSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image first.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setUploadedImageUrl(data.url);
      console.log('Image uploaded successfully:', data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
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
            onChange={handleFileSelect}
            className="mb-4"
          />
          {imageSrc && (
            <div style={{ position: 'relative', width: '100%', maxWidth: '500px', height: '300px' }}>
              <Image
                src={imageSrc}
                alt="Selected"
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            </div>
          )}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
              (!selectedFile || isUploading) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isUploading ? 'アップロード中...' : 'アップロード'}
          </button>
          {uploadedImageUrl && (
            <p>Image uploaded to: <a href={uploadedImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{uploadedImageUrl}</a></p>
          )}
        </div>
        <p>---------------------------------------------</p>
        <label>
          {isPushSupported ? 'プッシュ通知を受け取る' : 'プッシュ通知非対応環境'}：
          <input type="checkbox" checked={isSubscribed} disabled={!isPushPermission} onChange={handleToggle} />
          <p><small>{isPushPermission ? '' : 'プッシュ通知が拒否されています。設定を確認してください。'}</small></p>
        </label>
        
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
          <input
            type="text"
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
            disabled={!isSubscribed}
            placeholder="プッシュ通知メッセージ"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendNotification}
            disabled={!isSubscribed}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
          >
            テスト送信
          </button>
        </div>
      </main>
    </div>
  );
}