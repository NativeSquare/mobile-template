import { UploadMediaBottomSheetModal } from "@/components/shared/upload-media-bottom-sheet-modal";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { BottomSheetModal as GorhomBottomSheetModal } from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import { Upload } from "lucide-react-native";
import React from "react";
import { Pressable, View } from "react-native";

export type ImageUploaderProps = {
  onImageSelected: (image: ImagePicker.ImagePickerAsset) => void;
  uploadOptions?: ("camera" | "gallery")[];
  disabled?: boolean;
};

export function ImageUploader({
  onImageSelected,
  uploadOptions = ["camera", "gallery"],
  disabled = false,
}: ImageUploaderProps) {
  const bottomSheetModalRef = React.useRef<GorhomBottomSheetModal>(null);

  const handleOpenUploadModal = () => {
    if (!disabled) {
      bottomSheetModalRef.current?.present();
    }
  };

  return (
    <View>
      <Pressable
        onPress={handleOpenUploadModal}
        disabled={disabled}
        className="items-center justify-center rounded-xl border-2 border-dashed border-border py-6 gap-3"
        style={{ opacity: disabled ? 0.5 : 1 }}
      >
        <View className="items-center justify-center rounded-lg p-2">
          <Icon as={Upload} size={28} className="text-muted-foreground" />
        </View>
        <Text className="text-muted-foreground text-sm">
          Upload your image here
        </Text>
        <Button
          variant="outline"
          size="sm"
          onPress={handleOpenUploadModal}
          disabled={disabled}
          className="rounded-full px-6"
        >
          <Text className="text-sm">Browse</Text>
        </Button>
      </Pressable>

      <UploadMediaBottomSheetModal
        bottomSheetModalRef={bottomSheetModalRef}
        onImageSelected={onImageSelected}
        options={uploadOptions}
      />
    </View>
  );
}
