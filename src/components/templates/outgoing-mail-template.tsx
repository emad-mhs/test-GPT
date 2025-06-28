import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface YelpRecentLoginEmailProps {
  subject: string;
  refNum: string;
  fileUrl: string;
}

export const OutgoingMailEmail = ({
  subject,
  refNum,
  fileUrl,
}: YelpRecentLoginEmailProps) => {
  const headerImg =
    'https://moit.b-cdn.net/public/%D8%A7%D9%84%D9%87%D9%8A%D8%AF%D8%B1-%D8%A7%D9%84%D8%B9%D9%84%D9%88%D9%8A.jpg';
  const footerImg =
    'https://moit.b-cdn.net/public/%D8%A7%D9%84%D9%81%D9%88%D8%AA%D8%B1.jpg';
  return (
    <Html dir='rtl'>
      <Head />
      <Preview>وزارة الصناعة والتجارة</Preview>
      <Body style={main}>
        <Container>
          <Section style={content}>
            <Row>
              <Img style={image} width={620} src={headerImg} />
            </Row>

            <Row style={{ ...boxInfos, paddingBottom: '0' }}>
              <Column>
                <Heading
                  style={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    textAlign: 'right',
                  }}
                >
                  تحية طيبة وبعد٫٫٫
                </Heading>
                <Heading
                  as='h2'
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'right',
                  }}
                >
                  مرفق لكم مذكرتنا ذات المرجع ({refNum}) بشأن {subject}.
                </Heading>

                <Text
                  style={{
                    color: 'rgb(0,0,0, 0.5)',
                    fontSize: 14,
                    textAlign: 'right',
                    marginTop: -5,
                  }}
                >
                  *يرجى تأكيد الاستلام.
                </Text>
              </Column>
            </Row>
            <Row style={{ ...boxInfos, paddingTop: '0' }}>
              <Column style={containerButton} colSpan={2}>
                <Button href={fileUrl} style={button}>
                  تحميل المرفقات
                </Button>
              </Column>
            </Row>
            <Section style={containerImageFooter}>
              <Img style={image} width={620} src={footerImg} />
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  height: '100vh',
  backgroundColor: '#fff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const containerButton = {
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
};

const button = {
  backgroundColor: '#e00707',
  borderRadius: 3,
  color: '#FFF',
  fontWeight: 'bold',
  border: '1px solid rgb(0,0,0, 0.1)',
  cursor: 'pointer',
  padding: '12px 30px',
};

const content = {
  border: '1px solid rgb(0,0,0, 0.1)',
  borderRadius: '3px',
  overflow: 'hidden',
};

const image = {
  maxWidth: '100%',
};

const boxInfos = {
  padding: '20px',
};

const containerImageFooter = {
  padding: '45px 0 0 0',
};
