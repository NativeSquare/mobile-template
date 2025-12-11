import { APP_ADDRESS, APP_NAME } from "@constants";
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

interface VerifyEmailProps {
  code?: string;
}

export const VerifyEmail = ({ code }: VerifyEmailProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className="bg-white font-plaid">
        <Preview>Verify your email</Preview>
        <Container className="px-3 mx-auto">
          {/* <Img
            src={`${baseUrl}/static/notion-logo.png`}
            width="32"
            height="32"
            alt={`${APP_NAME}'s Logo`}
          /> */}
          <Text className="text-[#51525C] text-sm my-2">Hi there,</Text>
          <Text className="text-[#51525C] text-sm my-2">
            To verify your email, please use the following code:
          </Text>
          <Text className="text-[#51525C] text-semibold text-3xl my-6">
            <strong>{code}</strong>
          </Text>
          <Text className="text-[#51525C] text-sm my-2">
            This code will only be valid for the next 5 minutes.
          </Text>
          <Text className="text-[#51525C] text-sm my-2">Thanks,</Text>
          <Text className="text-[#51525C] text-sm my-2">
            The {APP_NAME} Team
          </Text>
          <Hr />
          <Text className="text-[#51525C] text-sm my-2">
            © 2025 {APP_NAME}, {APP_ADDRESS}
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

VerifyEmail.PreviewProps = {
  code: "548734",
} as VerifyEmailProps;

export default VerifyEmail;
