import { BottomSheetModal } from "@/components/custom/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { BottomSheetModal as GorhomBottomSheetModal } from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import { Camera, Image, LucideIcon } from "lucide-react-native";
import * as React from "react";
import { Alert, Dimensions, Linking, View } from "react-native";

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
      label: "Camera",
      onPress: handleTakePicture,
    },
    gallery: {
      icon: Image,
      label: "Gallery",
      onPress: handlePickFromGallery,
    },
  };

  const displayOptions = options.map((option) => optionMap[option]);

  const screenWidth = Dimensions.get("window").width;
  const padding = 32; // px-4 on each side (16px * 2)
  const gap = 12; // gap-3
  const itemCount = displayOptions.length;
  const gapsTotal = (itemCount - 1) * gap;
  const itemWidth = (screenWidth - padding - gapsTotal) / itemCount;

  return (
    <BottomSheetModal ref={bottomSheetModalRef}>
      <View className="flex-row flex-wrap gap-3 px-4 pb-6 pt-3">
        {displayOptions.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            onPress={option.onPress}
            style={{ width: itemWidth }}
            className="aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-border bg-card/60 px-3 py-4"
          >
            <Icon
              as={option.icon}
              size={26}
              className="text-muted-foreground"
            />
            <Text className="mt-2 text-sm font-normal text-muted-foreground">
              {option.label}
            </Text>
          </Button>
        ))}
      </View>
    </BottomSheetModal>
  );
}
