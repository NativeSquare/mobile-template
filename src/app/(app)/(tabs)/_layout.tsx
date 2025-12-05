import { THEME } from "@/lib/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
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
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
