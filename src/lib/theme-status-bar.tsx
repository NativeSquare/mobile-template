import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";

export function ThemeStatusBar() {
  const { colorScheme } = useColorScheme();
  const statusBarStyle = colorScheme === "dark" ? "light" : "dark";

  return <StatusBar style={statusBarStyle} />;
}
