import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { SettingsRow, SettingsRowProps } from "./settings-row";

export type SettingsGroupProps = {
  title: string;
  items: SettingsRowProps[];
};

export function SettingsGroup({ title, items }: SettingsGroupProps) {
  return (
    <View className="gap-2">
      <Text className="px-1.5 text-[10px] font-semibold uppercase tracking-[0.4px] text-muted-foreground">
        {title}
      </Text>
      <View className="overflow-hidden rounded-xl border border-border/50 bg-secondary/60">
        <View className="divide-y divide-border/50">
          {items.map((item) => (
            <SettingsRow key={item.label} {...item} />
          ))}
        </View>
      </View>
    </View>
  );
}
