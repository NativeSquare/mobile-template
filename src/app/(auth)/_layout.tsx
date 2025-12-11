import { Slot } from "expo-router";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function AuthLayout() {
  return (
    <View className="flex-1 bg-background">
      <KeyboardAwareScrollView>
        <Slot />
      </KeyboardAwareScrollView>
    </View>
  );
}
