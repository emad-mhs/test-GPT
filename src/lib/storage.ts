import { generateDocumentPath } from '@/modules/secretary/documents/utils';
import { generateMailPath } from '@/modules/secretary/mails/utils';

const BUNNY_STORAGE_API_HOST = 'storage.bunnycdn.com';

const uploadToBunny = async (
  buffer: ArrayBuffer,
  path: string,
  fileName: string
) => {
  const currentYear = new Date().getFullYear();

  const uploadUrl = new URL(
    `/${process.env.NEXT_PUBLIC_BUNNYCDN_STORAGE_ZONE}/v1/${currentYear}/${path}/${fileName}`,
    `https://${BUNNY_STORAGE_API_HOST}`
  );

  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      AccessKey: process.env.NEXT_PUBLIC_BUNNYCDN_API_KEY!,
      'Content-Type': 'application/octet-stream',
    },
    body: buffer,
  });

  if (res.ok) {
    return `https://${process.env.NEXT_PUBLIC_BUNNYCDN_STORAGE_ZONE}.b-cdn.net/v1/${currentYear}/${path}/${fileName}`;
  }

  return undefined;
};

interface uploadAvatarProps {
  image: File;
  name: string;
}

export const uploadAvatar = async ({ image, name }: uploadAvatarProps) => {
  const buffer = await image.arrayBuffer();
  const path = `الصور الشخصية/${encodeURIComponent(name)}`;
  const fileName = `${encodeURIComponent(name)}-${Date.now()}.jpg`;

  return uploadToBunny(buffer, path, fileName);
};

interface uploadDocumentProps {
  file: File;
  subject: string;
  categoryId: string;
}

export const uploadDocument = async ({
  file,
  subject,
  categoryId,
}: uploadDocumentProps) => {
  const buffer = await file.arrayBuffer();
  const path = await generateDocumentPath(categoryId);
  const fileName = `${encodeURIComponent(subject)}-${Date.now()}.pdf`;

  return uploadToBunny(buffer, path, fileName);
};

interface uploadMailProps {
  file: File;
  subject: string;
  categoryId?: string;
  type?: string;
  senderId?: string;
  receiverId?: string;
  refNum?: string | null;
}

export const uploadMail = async ({
  file,
  subject,
  categoryId,
  type,
  senderId,
  receiverId,
  refNum,
}: uploadMailProps) => {
  const buffer = await file.arrayBuffer();

  const path = refNum
    ? await generateMailPath(type, senderId, receiverId, refNum)
    : await generateDocumentPath(categoryId);

  const extension = file.type === 'application/pdf' ? 'pdf' : 'docx';
  const fileName = `${encodeURIComponent(subject)}-${Date.now()}.${extension}`;

  return uploadToBunny(buffer, path, fileName);
};
