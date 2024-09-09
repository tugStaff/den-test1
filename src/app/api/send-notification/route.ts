import { NextResponse } from 'next/server';
import https from 'https';


export async function GET(request: Request) {
  const publicEnvVar = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
  const privateEnvVar = process.env.ONESIGNAL_REST_API_KEY;

  return NextResponse.json({ 
    publicEnvVar,
    privateEnvVar: privateEnvVar ? 'Set (value hidden)' : 'Not set'
  });
}

export async function POST(request: Request): Promise<Response> {
  try {
    const { message } = await request.json();

    const data = JSON.stringify({
      app_id: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
      contents: { en: message },
      included_segments: ['All']
    });

    const options = {
      hostname: 'onesignal.com',
      path: '/api/v1/notifications',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${process.env.ONESIGNAL_REST_API_KEY}`
      }
    };

    return new Promise((resolve, reject) => {
      const apiReq = https.request(options, (apiRes) => {
        let responseBody = '';

        apiRes.on('data', (chunk) => {
          responseBody += chunk;
        });

        apiRes.on('end', () => {
          resolve(NextResponse.json(JSON.parse(responseBody)));
        });
      });

      apiReq.on('error', (error) => {
        console.error(error);
        reject(NextResponse.json({ error: 'Failed to send notification' }, { status: 500 }));
      });

      apiReq.write(data);
      apiReq.end();
    });
  } catch (error) {
    console.error('Error in send-notification route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}