import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { TextInput, View, type TextInputProps } from "react-native";
import { Input } from "../ui/input";

export function SearchInput({
  className,
  placeholderClassName,
  ...props
}: TextInputProps & React.RefAttributes<TextInput>) {
  return (
    <View className="relative">
      <View className="absolute left-3 top-1/2 -translate-y-1/2">
        <Ionicons
          name="search-outline"
          size={20}
          className="text-muted-foreground"
        />
      </View>
      <Input
        placeholder={props.placeholder ?? "Search"}
        className={cn("pl-10", className)}
        placeholderClassName={placeholderClassName}
        {...props}
      />
    </View>
  );
}
