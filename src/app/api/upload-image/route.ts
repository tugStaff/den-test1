// src/app/api/upload-image/route.ts
import { BlobServiceClient } from '@azure/storage-blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  console.log('AZURE_STORAGE_ACCOUNT_NAME:', process.env.AZURE_STORAGE_ACCOUNT_NAME);
  console.log('AZURE_STORAGE_CONTAINER_NAME:', process.env.AZURE_STORAGE_CONTAINER_NAME);

  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  if (!process.env.AZURE_STORAGE_ACCOUNT_NAME || !process.env.AZURE_STORAGE_ACCESS_KEY) {
    console.error('Azure Storage configuration is incomplete');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      `DefaultEndpointsProtocol=https;AccountName=${process.env.AZURE_STORAGE_ACCOUNT_NAME};AccountKey=${process.env.AZURE_STORAGE_ACCESS_KEY};EndpointSuffix=core.windows.net`
    );
    const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME || 'default-container');
    
    const blobName = `${Date.now()}-${file.name}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(await file.arrayBuffer(), {
      blobHTTPHeaders: { blobContentType: file.type }
    });

    return NextResponse.json({ url: blockBlobClient.url }, { status: 200 });
  } catch (error) {
    console.error('Error uploading to Azure Blob Storage:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to upload file', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Failed to upload file', details: 'An unknown error occurred' }, { status: 500 });
    }
  }
}