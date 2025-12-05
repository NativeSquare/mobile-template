import { Slot } from "expo-router";
import { View } from "react-native";

export default function AppLayout() {
  return (
    <View className="flex-1 bg-background">
      <Slot />
    </View>
  );
}
