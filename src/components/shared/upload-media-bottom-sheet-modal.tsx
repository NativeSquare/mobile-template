import { BottomSheetModal } from "@/components/custom/bottom-sheet";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { BottomSheetModal as GorhomBottomSheetModal } from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import { Camera, Image, LucideIcon } from "lucide-react-native";
import * as React from "react";
import { Alert, Linking, Pressable, View } from "react-native";

interface UploadMediaBottomSheetModalProps {
  bottomSheetModalRef: React.RefObject<GorhomBottomSheetModal | null>;
  onImageSelected?: (image: ImagePicker.ImagePickerAsset) => void;
  onImagesSelected?: (images: ImagePicker.ImagePickerAsset[]) => void;
  options?: ("camera" | "gallery")[];
  allowsEditing?: boolean;
  allowsMultipleSelection?: boolean;
  aspect?: [number, number];
}

export function UploadMediaBottomSheetModal({
  bottomSheetModalRef,
  onImageSelected,
  onImagesSelected,
  options = ["camera", "gallery"],
  allowsEditing = false,
  allowsMultipleSelection = false,
  aspect,
}: UploadMediaBottomSheetModalProps) {
  const handleTakePicture = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant access to your camera to take photos.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                Linking.openSettings();
              },
            },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: allowsEditing,
        aspect: aspect,
        quality: 1.0,
      });

      if (!result.canceled && result.assets.length > 0) {
        if (onImagesSelected) {
          onImagesSelected(result.assets);
        } else if (onImageSelected && result.assets[0]) {
          onImageSelected(result.assets[0]);
        }
        bottomSheetModalRef.current?.dismiss();
      }
    } catch (error) {
      console.error("Error taking picture:", error);
      Alert.alert("Error", "Failed to take picture.");
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant access to your photo library to select images.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                Linking.openSettings();
              },
            },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: allowsMultipleSelection,
        allowsEditing: allowsEditing,
        quality: 1.0,
        selectionLimit: allowsMultipleSelection ? 10 : 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        if (onImagesSelected) {
          onImagesSelected(result.assets);
        } else if (onImageSelected && result.assets[0]) {
          onImageSelected(result.assets[0]);
        }
        bottomSheetModalRef.current?.dismiss();
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image from gallery.");
    }
  };

  const optionMap: Record<
    "camera" | "gallery",
    {
      icon: LucideIcon;
      label: string;
      onPress: () => void;
    }
  > = {
    camera: {
      icon: Camera,
      label: "Take Photo",
      onPress: handleTakePicture,
    },
    gallery: {
      icon: Image,
      label: "Upload From Gallery",
      onPress: handlePickFromGallery,
    },
  };

  const displayOptions = options.map((option) => optionMap[option]);

  return (
    <BottomSheetModal ref={bottomSheetModalRef}>
      <View className="gap-4 px-4 pt-3.5">
        <Text className="text-lg font-semibold text-foreground">
          Select Media
        </Text>
        <View className="flex-row gap-3">
          {displayOptions.map((option, index) => (
            <Pressable
              key={index}
              onPress={option.onPress}
              className="flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-card p-4"
            >
              <View className="size-9 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                <Icon as={option.icon} size={20} className="text-primary" />
              </View>
              <Text className="text-center text-xs font-medium text-foreground">
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </BottomSheetModal>
  );
}
