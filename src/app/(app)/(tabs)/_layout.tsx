import { Icon } from "@/components/ui/icon";
import { THEME } from "@/lib/theme";
import { Tabs } from "expo-router";
import { House, User } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        animation: "shift",
        sceneStyle: { backgroundColor: "transparent" },
        tabBarInactiveTintColor: THEME[colorScheme ?? "light"].tabbarForeground,
        tabBarActiveTintColor: THEME[colorScheme ?? "light"].tabbarPrimary,
        tabBarStyle: {
          backgroundColor: THEME[colorScheme ?? "light"].tabbar,
          borderTopColor: THEME[colorScheme ?? "light"].tabbarBorder,
          height: 70 + insets.bottom,
          paddingTop: 10,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Icon as={House} color={color} size={28} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Icon as={User} color={color} size={28} />
          ),
        }}
      />
    </Tabs>
  );
}
