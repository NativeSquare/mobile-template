import { Text } from "@/components/ui/text";
import { ScrollView, View } from "react-native";

export default function Home() {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6"
      keyboardDismissMode="interactive"
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="items-center gap-4 max-w-sm">
        <View className="w-16 h-16 rounded-2xl bg-muted items-center justify-center">
          <Text className="text-3xl">🏠</Text>
        </View>
        <Text className="text-xl font-semibold text-foreground text-center">
          Your Home Screen
        </Text>
        <Text className="text-muted-foreground text-center leading-relaxed">
          This is a template project. Replace this placeholder with your app's
          main content — dashboards, feeds, or whatever fits your needs.
        </Text>
      </View>
    </ScrollView>
  );
}
