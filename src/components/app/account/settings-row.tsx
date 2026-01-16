import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

export type SettingsRowProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  destructive?: boolean;
  showChevron?: boolean;
  onPress?: () => void;
};

export function SettingsRow({
  label,
  icon,
  destructive,
  showChevron = true,
  onPress,
}: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "flex-row items-center gap-2.5 px-3.5 py-2.5",
        "active:bg-secondary/80",
        destructive && "active:bg-destructive/10"
      )}
    >
      <View
        className={cn(
          "bg-secondary/60 size-9 items-center justify-center rounded-lg",
          destructive && "bg-destructive/10"
        )}
      >
        <Ionicons
          name={icon}
          size={18}
          className={destructive ? "text-destructive" : "text-muted-foreground"}
        />
      </View>
      <Text
        className={cn(
          "flex-1 text-sm font-medium",
          destructive && "text-destructive"
        )}
      >
        {label}
      </Text>
      {showChevron && (
        <Ionicons
          name="chevron-forward"
          size={16}
          className="text-muted-foreground"
        />
      )}
    </Pressable>
  );
}
