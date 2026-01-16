import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";

type SchemeOption = {
  value: "system" | "light" | "dark";
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  helper?: string;
};

const STORAGE_KEY = "appearance:colorScheme";

const OPTIONS: SchemeOption[] = [
  {
    value: "system",
    label: "System",
    icon: "contrast-outline",
  },
  { value: "light", label: "Light", icon: "sunny-outline" },
  { value: "dark", label: "Dark", icon: "moon" },
];

export default function AppearanceScreen() {
  const router = useRouter();
  const { setColorScheme } = useColorScheme();
  const [isLoadingPref, setIsLoadingPref] = React.useState(true);
  const [selected, setSelected] =
    React.useState<SchemeOption["value"]>("system");

  React.useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!isMounted) return;
        const preference =
          value === "light" || value === "dark" || value === "system"
            ? value
            : "system";
        setSelected(preference);
        setColorScheme(preference);
      })
      .finally(() => {
        if (isMounted) setIsLoadingPref(false);
      });
    return () => {
      isMounted = false;
    };
  }, [setColorScheme]);

  function handleSelect(value: SchemeOption["value"]) {
    setSelected(value);
    setColorScheme(value);
    AsyncStorage.setItem(STORAGE_KEY, value).catch(() => {});
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="mt-safe p-4 pb-10 sm:p-6 gap-6"
      keyboardDismissMode="interactive"
    >
      <View className="w-full max-w-xl self-center gap-6">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="size-10 items-center justify-center -ml-2 rounded-full active:bg-secondary/70"
            accessibilityLabel="Go back"
            hitSlop={6}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              className="text-foreground"
            />
          </Pressable>

          <Text className="text-lg font-semibold">Appearance</Text>

          <View className="size-10" />
        </View>

        <View className="gap-2">
          <Text className="text-base font-semibold">Color Scheme</Text>
          <Text className="text-muted-foreground text-sm">
            Turn on dark mode, or let the app automatically follow your device.
          </Text>
        </View>

        <View className="flex-row gap-3">
          {OPTIONS.map((option) => {
            const isActive = option.value === selected;
            return (
              <Pressable
                key={option.value}
                onPress={() => handleSelect(option.value)}
                disabled={isLoadingPref}
                className={cn(
                  "flex-1 gap-3 rounded-2xl border px-4 py-4",
                  "items-center justify-center",
                  "active:bg-secondary/80",
                  isActive
                    ? "border-primary bg-primary/10"
                    : "border-border bg-secondary/50"
                )}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
              >
                <View
                  className={cn(
                    "size-12 items-center justify-center rounded-full border",
                    isActive
                      ? "border-primary bg-primary/10"
                      : "border-border bg-background"
                  )}
                >
                  <Ionicons
                    name={option.icon}
                    size={22}
                    className={cn(
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </View>
                <Text
                  className={cn(
                    "text-base font-semibold",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {option.label}
                </Text>
                {option.helper && (
                  <Text className="text-xs text-muted-foreground">
                    {option.helper}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}
