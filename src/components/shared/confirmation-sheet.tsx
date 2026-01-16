import { BottomSheetModal } from "@/components/custom/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal as GorhomBottomSheetModal } from "@gorhom/bottom-sheet";
import React from "react";
import { View } from "react-native";

export type ConfirmationSheetProps = {
  sheetRef: React.RefObject<GorhomBottomSheetModal | null>;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
};

export function ConfirmationSheet({
  sheetRef,
  icon,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmationSheetProps) {
  const handleCancel = () => {
    onCancel?.();
    sheetRef.current?.dismiss();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <BottomSheetModal ref={sheetRef}>
      <View className="gap-6 px-6 pb-2 pt-2">
        {/* Icon */}
        <View
          className={
            destructive
              ? "self-center rounded-full bg-destructive/10 p-4"
              : "self-center rounded-full bg-muted p-4"
          }
        >
          <Ionicons
            name={icon}
            size={32}
            className={destructive ? "text-destructive" : "text-foreground"}
          />
        </View>

        {/* Content */}
        <View className="gap-2">
          <Text className="text-center text-xl font-semibold">{title}</Text>
          <Text className="text-center text-muted-foreground">
            {description}
          </Text>
        </View>

        {/* Actions */}
        <View className="gap-3">
          <Button
            variant={destructive ? "destructive" : "default"}
            onPress={handleConfirm}
            disabled={loading}
            className="h-12"
          >
            <Text>{loading ? "Please wait..." : confirmLabel}</Text>
          </Button>
          <Button variant="outline" onPress={handleCancel} className="h-12">
            <Text>{cancelLabel}</Text>
          </Button>
        </View>
      </View>
    </BottomSheetModal>
  );
}
