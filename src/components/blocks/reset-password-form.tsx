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
import { ResetPasswordSchema } from "@/validation/auth";
import { useAuthActions } from "@convex-dev/auth/react";
import * as React from "react";
import { ActivityIndicator, TextInput, View } from "react-native";
import z from "zod";
import { OTPInput } from "../custom/otp-input";
import { PasswordInput } from "../custom/password-input";

export function ResetPasswordForm({ email }: { email: string }) {
  const [newPassword, setNewPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<{
    newPassword?: string;
    code?: string;
  }>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const codeInputRef = React.useRef<TextInput>(null);
  const { signIn } = useAuthActions();

  function onPasswordSubmitEditing() {
    codeInputRef.current?.focus();
  }

  async function onSubmit(submittedCode?: string) {
    const value = submittedCode ?? code;
    setFormError(null);
    setFieldErrors({});

    // Field Validation
    const result = ResetPasswordSchema.safeParse({ newPassword, code: value });
    if (!result.success) {
      const tree = z.treeifyError(result.error);

      setFieldErrors({
        newPassword: tree.properties?.newPassword?.errors?.[0],
        code: tree.properties?.code?.errors?.[0],
      });
      setFormError(tree.errors?.[0] ?? null);
      return;
    }

    setIsLoading(true);
    try {
      await signIn("password", {
        code: value,
        newPassword,
        email,
        flow: "reset-verification",
      });
    } catch (error) {
      setFormError("Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">
            Reset password
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            Enter the code sent to your email and set a new password
          </CardDescription>
        </CardHeader>
        {formError && (
          <Text className="text-destructive self-center">{formError}</Text>
        )}
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">New password</Label>
              </View>
              <PasswordInput
                id="password"
                secureTextEntry
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={onPasswordSubmitEditing}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              {fieldErrors.newPassword && (
                <Text className="text-xs text-destructive mt-1">
                  {fieldErrors.newPassword}
                </Text>
              )}
            </View>
            <View className="gap-1.5">
              <Label htmlFor="code">Verification code</Label>
              <OTPInput
                autoFocus={false}
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
            <Button
              className="w-full"
              onPress={() => onSubmit()}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text>Reset Password</Text>
              )}
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
