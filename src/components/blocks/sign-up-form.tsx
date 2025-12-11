import { SocialConnections } from "@/components/blocks/social-connections";
import { PasswordInput } from "@/components/custom/password-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { getConvexErrorMessage } from "@/utils/getConvexErrorMessage";
import { SignUpSchema } from "@/validation/auth";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "expo-router";
import * as React from "react";
import { ActivityIndicator, type TextInput, View } from "react-native";
import z from "zod";

export function SignUpForm() {
  const passwordInputRef = React.useRef<TextInput>(null);
  const confirmPasswordInputRef = React.useRef<TextInput>(null);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    acceptTerms?: string;
  }>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const router = useRouter();
  const { signIn } = useAuthActions();

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  function onPasswordSubmitEditing() {
    confirmPasswordInputRef.current?.focus();
  }

  async function onSubmit() {
    setFormError(null);
    setFieldErrors({});

    // Field Validation
    const result = SignUpSchema.safeParse({
      email,
      password,
      confirmPassword,
      acceptTerms,
    });
    if (!result.success) {
      const tree = z.treeifyError(result.error);

      setFieldErrors({
        email: tree.properties?.email?.errors?.[0],
        password: tree.properties?.password?.errors?.[0],
        confirmPassword: tree.properties?.confirmPassword?.errors?.[0],
        acceptTerms: tree.properties?.acceptTerms?.errors?.[0],
      });
      setFormError(tree.errors?.[0] ?? null);
      return;
    }

    // Submit
    setIsLoading(true);
    try {
      const { signingIn } = await signIn("password", {
        email,
        password,
        flow: "signUp",
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
            Create your account
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            Welcome! Please fill in the details to get started.
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
              </View>
              <PasswordInput
                ref={passwordInputRef}
                id="password"
                placeholder="Set a password"
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={onPasswordSubmitEditing}
                value={password}
                onChangeText={setPassword}
              />
              {fieldErrors.password && (
                <Text className="text-xs text-destructive mt-1">
                  {fieldErrors.password}
                </Text>
              )}
            </View>
            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
              </View>
              <PasswordInput
                ref={confirmPasswordInputRef}
                placeholder="Confirm password"
                id="confirmPassword"
                returnKeyType="send"
                onSubmitEditing={onSubmit}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              {fieldErrors.confirmPassword && (
                <Text className="text-xs text-destructive mt-1">
                  {fieldErrors.confirmPassword}
                </Text>
              )}
            </View>
            <View className="gap-1.5">
              <View className="flex flex-row items-center gap-3">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={setAcceptTerms}
                />
                <Label
                  onPress={() => setAcceptTerms(!acceptTerms)}
                  htmlFor="terms"
                >
                  Accept terms and conditions
                </Label>
              </View>
              {fieldErrors.acceptTerms && (
                <Text className="text-xs text-destructive mt-1">
                  {fieldErrors.acceptTerms}
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
              Already have an account?{" "}
            </Text>
            <Button
              variant={"link"}
              size={"sm"}
              className="text-md font-medium"
              onPress={() => {
                router.navigate("/sign-in");
              }}
            >
              <Text className="text-sm underline underline-offset-4">
                Sign In
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
