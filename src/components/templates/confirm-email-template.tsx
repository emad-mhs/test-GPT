import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';

interface ConfirmEmailTemplateProps {
  username?: string;
  userImage?: string;
  invitedByUsername?: string;
  invitedByEmail?: string;
  teamName?: string;
  teamImage?: string;
  inviteLink?: string;
  inviteFromIp?: string;
  inviteFromLocation?: string;
}

// const baseUrl = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : '';

export const ConfirmEmailTemplate = ({
  username,
  // userImage,
  invitedByUsername,
  invitedByEmail,
  teamName,
  // teamImage,
  inviteLink,
  inviteFromIp,
  inviteFromLocation,
}: ConfirmEmailTemplateProps) => {
  // const previewText = `Join ${invitedByUsername} on Vercel`;

  return (
    <Html dir='rtl' lang='ar'>
      <Head />
      {/* <Preview>{previewText}</Preview> */}
      <Preview>الإنضمام إلى فريق وزارة الصناعة والتجارة</Preview>
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
              انضم إلى <strong>{teamName}</strong> في{' '}
              <strong>وزارة الصناعة والتجارة</strong>
              {/* Join <strong>{teamName}</strong> on <strong>Vercel</strong> */}
            </Heading>
            <Text className='text-black text-[14px] leading-[24px]'>
              مرحباً {username},
            </Text>
            <Text className='text-black text-[14px] leading-[24px]'>
              <strong>{invitedByUsername}</strong> (
              <Link
                href={`mailto:${invitedByEmail}`}
                className='text-blue-600 no-underline'
              >
                {invitedByEmail}
              </Link>
              ) قام بدعوتك للإنضمام إلى فريق <strong>{teamName}</strong> في{' '}
              <strong>وزارة الصناعة والتجارة</strong>.
            </Text>
            <Section>
              <Row>
                <Column align='left'>
                  <Img
                    className='rounded-full'
                    // src={userImage}
                    src='/vercel.svg'
                    width='64'
                    height='64'
                  />
                </Column>
                <Column align='center'>
                  <Img
                    // src={`${baseUrl}/static/vercel-arrow.png` }
                    src='/avatar.jpg'
                    width='12'
                    height='9'
                    alt='قام بدعوتك لـ'
                  />
                </Column>
                <Column align='right'>
                  <Img
                    className='rounded-full'
                    // src={teamImage}
                    src='/next.svg'
                    width='64'
                    height='64'
                  />
                </Column>
              </Row>
            </Section>
            <Section className='text-center mt-[32px] mb-[32px]'>
              <Button
                className='bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3'
                href={inviteLink}
              >
                انضم إلى الفريق
              </Button>
            </Section>
            <Text className='text-black text-[14px] leading-[24px]'>
              أو قم بنسخ ولصق الرابط أدناه في المتصفح الخاص بك:{' '}
              <Link href={inviteLink} className='text-blue-600 no-underline'>
                {inviteLink}
              </Link>
            </Text>
            <Hr className='border border-solid border-[#eaeaea] my-[26px] mx-0 w-full' />
            <Text className='text-[#666666] text-[12px] leading-[24px]'>
              هذه الدعوة مخصصة لـ <span className='text-black'>{username}</span>
              . هذه الدعوة مرسلة من{' '}
              <span className='text-black'>{inviteFromIp}</span> الواقع في{' '}
              <span className='text-black'>{inviteFromLocation}</span>. إذا لم
              تكن تتوقع هذه الدعوة ، يمكنك تجاهل هذا البريد الإلكتروني. إذا كنت
              قلقا بشأن سلامة حساباتك ، فيرجى الرد على هذا البريد الإلكتروني
              للتواصل معنا.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

// ConfirmEmailTemplate.PreviewProps = {
//   username: 'alanturing',
//   userImage: `${baseUrl}/static/vercel-user.png`,
//   invitedByUsername: 'Alan',
//   invitedByEmail: 'alan.turing@example.com',
//   teamName: 'Enigma',
//   teamImage: `${baseUrl}/static/vercel-team.png`,
//   inviteLink: 'https://vercel.com/teams/invite/foo',
//   inviteFromIp: '185.240.64.160',
//   inviteFromLocation: 'عدن، اليمن',
// } as ConfirmEmailTemplateProps;

// export default ConfirmEmailTemplate;
