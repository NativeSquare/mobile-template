import { SocialConnections } from "@/components/blocks/social-connections";
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
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { getConvexErrorMessage } from "@/utils/getConvexErrorMessage";
import { SignInSchema } from "@/validation/auth";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvex } from "convex/react";
import { useRouter } from "expo-router";
import * as React from "react";
import { ActivityIndicator, type TextInput, View } from "react-native";
import z from "zod";
import { api } from "../../../convex/_generated/api";
import { PasswordInput } from "../custom/password-input";

export function SignInForm() {
  const passwordInputRef = React.useRef<TextInput>(null);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<{
    email?: string;
    password?: string;
  }>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const router = useRouter();
  const { signIn } = useAuthActions();
  const convex = useConvex();

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  async function onSubmit() {
    setFormError(null);
    setFieldErrors({});

    // Field Validation
    const result = SignInSchema.safeParse({ email, password });
    if (!result.success) {
      const tree = z.treeifyError(result.error);

      setFieldErrors({
        email: tree.properties?.email?.errors?.[0],
        password: tree.properties?.password?.errors?.[0],
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

    // Submit
    setIsLoading(true);
    try {
      const { signingIn } = await signIn("password", {
        email,
        password,
        flow: "signIn",
      });
      if (!signingIn) {
        router.replace({
          pathname: "/verify-email",
          params: { email },
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
            Sign in to your app
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            Welcome back! Please sign in to continue
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
                onSubmitEditing={onEmailSubmitEditing}
                returnKeyType="next"
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
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password">Password</Label>
                <Button
                  variant="link"
                  size="sm"
                  className="web:h-fit ml-auto h-4 px-1 py-0 sm:h-4"
                  onPress={() => {
                    router.navigate("/forgot-password");
                  }}
                >
                  <Text className="font-normal leading-4">
                    Forgot your password?
                  </Text>
                </Button>
              </View>
              <PasswordInput
                ref={passwordInputRef}
                id="password"
                returnKeyType="send"
                onSubmitEditing={onSubmit}
                value={password}
                onChangeText={setPassword}
              />
              {fieldErrors.password && (
                <Text className="text-xs text-destructive mt-1">
                  {fieldErrors.password}
                </Text>
              )}
            </View>
            <Button className="w-full" onPress={onSubmit} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text>Continue</Text>
              )}
            </Button>
          </View>
          <View className="flex flex-row items-center justify-center">
            <Text className="text-center text-sm text-md font-medium">
              Don&apos;t have an account?{" "}
            </Text>
            <Button
              variant={"link"}
              size={"sm"}
              className="text-md font-medium"
              onPress={() => {
                router.navigate("/sign-up");
              }}
            >
              <Text className="text-sm underline underline-offset-4">
                Sign Up
              </Text>
            </Button>
          </View>
          <View className="flex-row items-center">
            <Separator className="flex-1" />
            <Text className="text-muted-foreground px-4 text-sm">or</Text>
            <Separator className="flex-1" />
          </View>
          <SocialConnections setError={setFormError} />
        </CardContent>
      </Card>
    </View>
  );
}
