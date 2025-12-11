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
import { APP_ADDRESS, APP_NAME } from "../../constants";

interface ForgotPasswordProps {
  code?: string;
}

export const ForgotPassword = ({ code }: ForgotPasswordProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className="bg-white font-plaid">
        <Preview>Reset your password</Preview>
        <Container className="px-3 mx-auto">
          {/* <Img
            src={`${baseUrl}/static/notion-logo.png`}
            width="32"
            height="32"
            alt={`${APP_NAME}'s Logo`}
          /> */}
          <Text className="text-[#51525C] text-sm my-2">Hi there,</Text>
          <Text className="text-[#51525C] text-sm my-2">
            To reset your password, please use the following code:
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

ForgotPassword.PreviewProps = {
  code: "128433",
} as ForgotPasswordProps;

export default ForgotPassword;
