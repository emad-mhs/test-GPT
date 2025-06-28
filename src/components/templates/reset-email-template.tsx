import {
  Body,
  Button,
  Container,
  // Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  // Link,
  Preview,
  // Row,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';

interface resetEmailTemplateProps {
  resetLink?: string;
}

// const baseUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : '';

export const resetEmailTemplate = ({ resetLink }: resetEmailTemplateProps) => {
  return (
    <Html dir='rtl' lang='ar'>
      <Head />
      {/* <Preview>{previewText}</Preview> */}
      <Preview>إعادة تعيين كلمة المرور</Preview>
      <Tailwind>
        <Body className='bg-white my-auto mx-auto font-sans px-2'>
          <Container
            dir='rtl'
            className='border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]'
          >
            <Section className='mt-[32px]'>
              <Img
                // src={`${baseUrl}/static/vercel-logo.png`}
                src='/vercel.svg'
                width='40'
                height='37'
                alt='Vercel'
                className='my-0 mx-auto'
              />
            </Section>
            <Heading className='text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0'>
              إعادة تعيين كلمة المرور
            </Heading>
            <Text className='text-black text-[14px] leading-[24px]'>
              مرحباً عزيزي الموظف/ـة،
            </Text>
            <Text className='text-black text-[14px] leading-[24px]'>
              طلب شخص ما مؤخراً
              <strong>تغيير كلمة المرور </strong> لحساب{' '}
              <strong>وزارة الصناعة والتجارة</strong> الخاص بك. إذا كان هذا أنت،
              يمكنك تعيين كلمة مرور جديدة من هنا:
            </Text>
            <Section className='text-center mt-[32px] mb-[32px]'>
              <Button
                className='bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3'
                href={resetLink}
              >
                تعيين كلمة مرور جديدة
              </Button>
            </Section>
            <Text className='text-black text-[14px] leading-[24px]'>
              إذا كنت لا تريد تغيير كلمة المرور الخاصة بك أو لم تطلب ذلك، فما
              عليك سوى تجاهل هذه الرسالة وحذفها.
            </Text>
            <Hr className='border border-solid border-[#eaeaea] my-[26px] mx-0 w-full' />
            <Text className='text-[#666666] text-[12px] leading-[24px]'>
              للحفاظ على أمان حسابك، يرجى عدم إعادة توجيه هذا البريد الإلكتروني
              إلى أي شخص. راجع إدارة تقنية المعلومات للحصول على مزيد من النصائح
              الأمنية.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

// resetEmailTemplate.PreviewProps = {
//   username: 'alanturing',
//   userImage: `${baseUrl}/static/vercel-user.png`,
//   invitedByUsername: 'Alan',
//   invitedByEmail: 'alan.turing@example.com',
//   teamName: 'Enigma',
//   teamImage: `${baseUrl}/static/vercel-team.png`,
//   inviteLink: 'https://vercel.com/teams/invite/foo',
//   inviteFromIp: '185.240.64.160',
//   inviteFromLocation: 'عدن، اليمن',
// } as resetEmailTemplateProps;

// export default resetEmailTemplate;
