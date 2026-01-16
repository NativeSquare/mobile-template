import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

export type NameFieldProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
};

export function NameField({
  label = "Name",
  value,
  onChange,
  placeholder = "John Smith",
  error,
}: NameFieldProps) {
  return (
    <View className="gap-2">
      <Text className="text-xs font-semibold uppercase tracking-[0.4px] text-muted-foreground">
        {label}
      </Text>
      <Input
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        autoCapitalize="words"
        returnKeyType="done"
      />
      {error && <Text className="text-xs text-destructive mt-1">{error}</Text>}
    </View>
  );
}
