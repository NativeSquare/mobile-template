import { ConfirmationSheet } from "@/components/shared/confirmation-sheet";
import { UploadMediaBottomSheetModal } from "@/components/shared/upload-media-bottom-sheet-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as React from "react";
import { Pressable, View } from "react-native";

export type ProfilePictureFieldProps = {
  image: string | null;
  name: string;
  onImageChange: (uri: string) => void;
  onImageRemove?: () => void;
  error?: string;
};

export function ProfilePictureField({
  image,
  name,
  onImageChange,
  onImageRemove,
  error,
}: ProfilePictureFieldProps) {
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const confirmationSheetRef = React.useRef<BottomSheetModal>(null);

  const openPhotoActions = () => {
    bottomSheetModalRef.current?.present();
  };

  const openRemoveConfirmation = () => {
    confirmationSheetRef.current?.present();
  };

  const handleRemoveConfirm = () => {
    confirmationSheetRef.current?.dismiss();
    onImageRemove?.();
  };

  return (
    <View className="items-center gap-3">
      <View className="relative">
        <Avatar alt={name || "Guest"} className="size-32">
          {image ? (
            <AvatarImage source={{ uri: image }} />
          ) : (
            <AvatarFallback className="bg-background">
              <Text className="text-3xl font-semibold">
                {(name.trim()?.[0] ?? "🙂").toUpperCase()}
              </Text>
            </AvatarFallback>
          )}
        </Avatar>

        {image && onImageRemove && (
          <Pressable
            onPress={openRemoveConfirmation}
            className="absolute -top-1.5 -right-1.5 active:scale-95"
            accessibilityLabel="Remove profile photo"
            hitSlop={8}
          >
            <View className="size-11 items-center justify-center rounded-full bg-background shadow-sm shadow-black/10 border border-border">
              <Ionicons name="close" size={18} className="text-foreground" />
            </View>
          </Pressable>
        )}

        <Pressable
          onPress={openPhotoActions}
          className="absolute -bottom-1.5 -right-1.5 active:scale-95"
          accessibilityLabel="Change profile photo"
          hitSlop={8}
        >
          <View className="size-11 items-center justify-center rounded-full bg-background shadow-sm shadow-black/10 border border-border">
            <Ionicons name="camera" size={18} className="text-foreground" />
          </View>
        </Pressable>
      </View>
      <Text className="text-muted-foreground text-sm">Profile Photo</Text>
      {error && <Text className="text-xs text-destructive">{error}</Text>}

      <UploadMediaBottomSheetModal
        bottomSheetModalRef={bottomSheetModalRef}
        onImageSelected={(asset) => onImageChange(asset.uri)}
        allowsEditing
        aspect={[1, 1]}
      />

      <ConfirmationSheet
        sheetRef={confirmationSheetRef}
        icon="trash-outline"
        title="Remove Photo"
        description="Are you sure you want to remove your profile photo?"
        confirmLabel="Remove"
        destructive
        onConfirm={handleRemoveConfirm}
      />
    </View>
  );
}
