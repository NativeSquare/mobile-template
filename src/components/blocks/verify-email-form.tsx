import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { VerifyEmailSchema } from "@/validation/auth";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "expo-router";
import * as React from "react";
import { ActivityIndicator, View } from "react-native";
import z from "zod";
import { OTPInput } from "../custom/otp-input";

export function VerifyEmailForm({ email }: { email: string }) {
  const [code, setCode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<{
    code?: string;
  }>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const router = useRouter();
  const { signIn } = useAuthActions();

  async function onSubmit(submittedCode?: string) {
    const value = submittedCode ?? code;
    setFormError(null);
    setFieldErrors({});

    // Field Validation
    const result = VerifyEmailSchema.safeParse({ code: value });
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
        code: value,
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
              <OTPInput
                onTextChange={setCode}
                onFilled={(text) => {
                  onSubmit(text);
                }}
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
                onPress={() => onSubmit()}
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
