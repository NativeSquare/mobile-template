import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getConvexErrorMessage } from "@/utils/getConvexErrorMessage";
import { useAuthActions } from "@convex-dev/auth/react";
import { makeRedirectUri } from "expo-auth-session";
import { openAuthSessionAsync } from "expo-web-browser";
import { useColorScheme } from "nativewind";
import * as React from "react";
import { ActivityIndicator, Image, Platform, View } from "react-native";

const SOCIAL_CONNECTION_STRATEGIES = [
  {
    provider: "apple",
    source: { uri: "https://img.clerk.com/static/apple.png?width=160" },
    useTint: true,
  },
  {
    provider: "google",
    source: { uri: "https://img.clerk.com/static/google.png?width=160" },
    useTint: false,
  },
  {
    provider: "github",
    source: { uri: "https://img.clerk.com/static/github.png?width=160" },
    useTint: true,
  },
];

export function SocialConnections({
  setError,
}: {
  setError: (error: string | null) => void;
}) {
  const { colorScheme } = useColorScheme();
  const redirectTo = makeRedirectUri();
  const { signIn } = useAuthActions();
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleSocialSignIn(
    strategy: (typeof SOCIAL_CONNECTION_STRATEGIES)[number]
  ) {
    setIsLoading(true);
    setError(null);
    try {
      const { redirect } = await signIn(strategy.provider, { redirectTo });
      if (Platform.OS === "web") {
        return;
      }
      const result = await openAuthSessionAsync(
        redirect!.toString(),
        redirectTo
      );
      if (result.type === "success") {
        const { url } = result;
        const code = new URL(url).searchParams.get("code")!;
        await signIn(strategy.provider, { code, redirectTo: "findr://" });
      }
    } catch (error) {
      setError(getConvexErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View className="gap-2 sm:flex-row sm:gap-3">
      {SOCIAL_CONNECTION_STRATEGIES.map((strategy) => {
        return (
          <Button
            key={strategy.provider}
            variant="outline"
            size="sm"
            className="sm:flex-1"
            onPress={async () => {
              await handleSocialSignIn(strategy);
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Image
                className={cn(
                  "size-4",
                  strategy.useTint && Platform.select({ web: "dark:invert" })
                )}
                tintColor={Platform.select({
                  native: strategy.useTint
                    ? colorScheme === "dark"
                      ? "white"
                      : "black"
                    : undefined,
                })}
                source={strategy.source}
              />
            )}
          </Button>
        );
      })}
    </View>
  );
}
