import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface TwoFactorEmailProps {
  verificationCode?: string;
}

// const baseUrl = process.env.NEXT_PUBLIC_APP_URL
//   ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
//   : '';

export function TwoFactorEmailTemplate({
  verificationCode,
}: TwoFactorEmailProps) {
  return (
    <Html dir='rtl' lang='ar'>
      <Head />
      <Preview>رمز المصادقة الثنائية</Preview>
      <Body style={main}>
        <Container dir='rtl' style={container}>
          <Section style={coverSection}>
            <Section style={imageSection}>
              <Img
                src='next.svg'
                // src={`${baseUrl}/public/next.svg`}
                width='75'
                height='45'
                alt="Notion's Logo"
              />
            </Section>
            <Section style={upperSection}>
              <Heading style={h1}>رمز تحقق المصادقة الثنائية</Heading>
              <Text style={mainText}>
                الرجاء إدخال رمز التحقق أدناه عند المطالبة به، إذا كنت لا تريد
                الدخول يمكنك تجاهل هذه الرسالة.
              </Text>
              <Section style={verificationSection}>
                <Text style={verifyText}>رمز التحقق</Text>

                <Text style={codeText}>{verificationCode}</Text>
                <Text style={validityText}>(هذا الرمز صالح لمدة 5 دقائق)</Text>
              </Section>
            </Section>
          </Section>
          <Text style={footerText}>
            تم إنتاج هذه الرسالة وتوزيعها من قبل وزارة الصناعة والتجارة -
            الديوان العام، جميع الحقوق محفوظة © {new Date().getFullYear()}{' '}
            لوزارة الصناعة والتجارة.
            <Link href='https://moit-ye.com' target='_blank' style={link}>
              {' '}
              moit-ye.com
            </Link>
            .{' '}
            <Link href='https://moit-ye.com' target='_blank' style={link}>
              سياسة الخصوصية
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#fff',
  color: '#212121',
};

const container = {
  padding: '20px',
  margin: '0 auto',
  backgroundColor: '#eee',
};

const h1 = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '15px',
};

const link = {
  color: '#2754C5',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  textDecoration: 'underline',
};

const text = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  margin: '24px 0',
};

const imageSection = {
  backgroundColor: '#252f3d',
  display: 'flex',
  padding: '20px 0',
  alignItems: 'center',
  justifyContent: 'center',
};

const coverSection = { backgroundColor: '#fff' };

const upperSection = { padding: '25px 35px' };

const footerText = {
  ...text,
  fontSize: '12px',
  padding: '0 20px',
};

const verifyText = {
  ...text,
  margin: 0,
  fontWeight: 'bold',
  textAlign: 'center' as const,
};

const codeText = {
  ...text,
  fontWeight: 'bold',
  fontSize: '36px',
  margin: '10px 0',
  textAlign: 'center' as const,
};

const validityText = {
  ...text,
  margin: '0px',
  textAlign: 'center' as const,
};

const verificationSection = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const mainText = { ...text, marginBottom: '14px' };
