import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { ScrollView, View } from "react-native";
import { api } from "../../../../convex/_generated/api";

export default function Home() {
  const user = useQuery(api.functions.currentUser);
  const { signOut } = useAuthActions();
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6 mt-safe"
      keyboardDismissMode="interactive"
    >
      <View className="w-full max-w-sm">
        <Text>Hi, {user?.email}</Text>
        <Button onPress={() => signOut()}>
          <Text>Sign Out</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
