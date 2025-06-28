import { Resend } from 'resend';

import { resetEmailTemplate } from '@/components/templates/reset-email-template';
import { ConfirmEmailTemplate } from '@/components/templates/confirm-email-template';
import { TwoFactorEmailTemplate } from '@/components/templates/two-factor-email-template';
import { OutgoingMailEmail } from '@/components/templates/outgoing-mail-template';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;
const defaultSender = 'وزارة الصناعة والتجارة <info@moit-secretary.com>';

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  try {
    await resend.emails.send({
      from: defaultSender,
      to: email,
      subject: 'رمز المصادقة الثنائية',
      react: TwoFactorEmailTemplate({ verificationCode: token }),
    });
  } catch (error) {
    console.error('Error sending two-factor token email:', error);
  }
};

export const sendOutgoingMailEmail = async (
  email: string,
  cc: string[],
  subject: string,
  refNum: string,
  fileUrl: string
) => {
  try {
    const recipients = email ? [...cc, email] : cc;

    await resend.emails.send({
      from: defaultSender,
      to: recipients,
      subject,
      react: OutgoingMailEmail({ subject, refNum, fileUrl }),
    });
  } catch (error) {
    console.error('Error sending outgoing mail email:', error);
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  try {
    const resetLink = `${domain}/auth/new-password?token=${token}`;

    await resend.emails.send({
      from: defaultSender,
      to: email,
      subject: 'إعادة تعيين كلمة المرور',
      react: resetEmailTemplate({ resetLink }),
    });
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};

export const sendVerificationEmail = async (
  email: string,
  token: string,
  name?: string
) => {
  try {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    await resend.emails.send({
      from: defaultSender,
      to: email,
      subject: 'التحقق من البريد الإلكتروني',
      react: ConfirmEmailTemplate({
        username: name,
        invitedByUsername: 'عماد',
        invitedByEmail: 'emad@proemad.dev',
        teamName: 'سكرتارية الوزارة',
        inviteLink: confirmLink,
        inviteFromIp: '185.240.64.160',
        inviteFromLocation: 'عدن، اليمن',
      }),
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};
