import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { TextInput, View, type TextInputProps } from "react-native";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export function PasswordInput({
  className,
  placeholderClassName,
  ...props
}: TextInputProps & React.RefAttributes<TextInput>) {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <View className="relative">
      <Input
        className={className}
        placeholderClassName={placeholderClassName}
        {...props}
        secureTextEntry={!showPassword}
      />

      <Button
        variant="ghost"
        size="icon"
        onPress={() => setShowPassword((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2"
      >
        <Ionicons
          name={showPassword ? "eye-off-outline" : "eye-outline"}
          size={20}
          className="text-muted-foreground"
        />
      </Button>
    </View>
  );
}
