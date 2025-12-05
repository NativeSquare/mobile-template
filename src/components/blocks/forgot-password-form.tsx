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
import { getConvexErrorMessage } from "@/utils/getConvexErrorMessage";
import { ForgotPasswordSchema } from "@/validation/auth";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvex } from "convex/react";
import { useRouter } from "expo-router";
import * as React from "react";
import { ActivityIndicator, View } from "react-native";
import z from "zod";
import { api } from "../../../convex/_generated/api";

export function ForgotPasswordForm() {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<{
    email?: string;
  }>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const router = useRouter();
  const { signIn } = useAuthActions();
  const convex = useConvex();

  async function onSubmit() {
    setFormError(null);
    setFieldErrors({});

    // Field Validation
    const result = ForgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      const tree = z.treeifyError(result.error);

      setFieldErrors({
        email: tree.properties?.email?.errors?.[0],
      });
      setFormError(tree.errors?.[0] ?? null);
      return;
    }

    // Check if account exists
    const user = await convex.query(api.functions.getUserByEmail, {
      email: email,
    });
    if (!user) {
      setFormError("No account found with this email");
      return;
    }

    setIsLoading(true);
    try {
      const result = await signIn("password", {
        email,
        flow: "reset",
      });
      if (result) {
        router.replace({
          pathname: "/reset-password",
          params: { email: email },
        });
      }
    } catch (error) {
      setFormError(getConvexErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">
            Forgot password?
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>
        {formError && (
          <Text className="text-destructive self-center">{formError}</Text>
        )}
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m@example.com"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                returnKeyType="send"
                onSubmitEditing={onSubmit}
                submitBehavior="submit"
                value={email}
                onChangeText={setEmail}
              />
              {fieldErrors.email && (
                <Text className="text-xs text-destructive mt-1">
                  {fieldErrors.email}
                </Text>
              )}
            </View>
            <Button className="w-full" onPress={onSubmit} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text>Reset your password</Text>
              )}
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
