import { THEME } from "@/lib/theme";
import { useColorScheme } from "nativewind";
import * as React from "react";
import { OtpInput, type OtpInputProps } from "react-native-otp-entry";

export function OTPInput({ ...props }: OtpInputProps) {
  const { colorScheme } = useColorScheme();
  const theme = colorScheme === "dark" ? THEME.dark : THEME.light;
  return (
    <OtpInput
      numberOfDigits={6}
      focusColor={theme.foreground}
      theme={{
        pinCodeContainerStyle: {
          borderColor: theme.border, // border-input
          backgroundColor:
            colorScheme === "dark"
              ? "rgba(255,255,255,0.03)"
              : theme.background,
        },

        focusedPinCodeContainerStyle: {
          borderColor: theme.ring, // focus ring equivalent
          shadowColor: theme.ring,
          shadowOpacity: 0.4,
          shadowRadius: 4,
        },

        pinCodeTextStyle: {
          color: theme.foreground, // text-foreground
          fontSize: 20,
        },
      }}
      {...props}
    />
  );
}
