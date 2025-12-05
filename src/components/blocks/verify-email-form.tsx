import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { VerifyEmailSchema } from "@/validation/auth";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "expo-router";
import * as React from "react";
import { ActivityIndicator, View } from "react-native";
import z from "zod";

export function VerifyEmailForm({ email }: { email: string }) {
  const [code, setCode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<{
    code?: string;
  }>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const router = useRouter();
  const { signIn } = useAuthActions();

  async function onSubmit() {
    setFormError(null);
    setFieldErrors({});

    // Field Validation
    const result = VerifyEmailSchema.safeParse({ code });
    if (!result.success) {
      const tree = z.treeifyError(result.error);

      setFieldErrors({
        code: tree.properties?.code?.errors?.[0],
      });
      setFormError(tree.errors?.[0] ?? null);
      return;
    }

    setIsLoading(true);
    try {
      await signIn("password", {
        email,
        code,
        flow: "email-verification",
      });
    } catch (error) {
      setFormError("Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border pb-4 shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">
            Verify your email
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            Enter the verification code sent to {email}
          </CardDescription>
        </CardHeader>
        {formError && (
          <Text className="text-destructive self-center">{formError}</Text>
        )}
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="code">Verification code</Label>
              <Input
                id="code"
                autoCapitalize="none"
                returnKeyType="send"
                keyboardType="numeric"
                autoComplete="sms-otp"
                textContentType="oneTimeCode"
                onSubmitEditing={onSubmit}
                value={code}
                onChangeText={setCode}
              />
              {fieldErrors.code && (
                <Text className="text-xs text-destructive mt-1">
                  {fieldErrors.code}
                </Text>
              )}
            </View>
            <View className="gap-3">
              <Button
                className="w-full"
                onPress={onSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text>Continue</Text>
                )}
              </Button>
              <Button
                variant="link"
                className="mx-auto"
                onPress={() => {
                  router.navigate("/sign-in");
                }}
              >
                <Text>Cancel</Text>
              </Button>
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}

function useCountdown(seconds = 30) {
  const [countdown, setCountdown] = React.useState(seconds);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = React.useCallback(() => {
    setCountdown(seconds);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [seconds]);

  React.useEffect(() => {
    startCountdown();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startCountdown]);

  return { countdown, restartCountdown: startCountdown };
}
