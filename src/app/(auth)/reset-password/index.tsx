import { ResetPasswordForm } from "@/components/blocks/reset-password-form";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";

export default function ResetPasswordScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6 mt-safe"
      keyboardDismissMode="interactive"
    >
      <View className="w-full max-w-sm">
        <ResetPasswordForm email={email} />
      </View>
    </ScrollView>
  );
}
