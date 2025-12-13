import { OnboardingFormData } from "@/app/(onboarding)";
import { BottomSheetModal } from "@/components/custom/bottom-sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal as GorhomBottomSheetModal } from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import { Focus, ImageIcon, Plus } from "lucide-react-native";
import * as React from "react";
import { Alert, View } from "react-native";

export function AddPhotoStep({
  formData,
  setFormData,
}: {
  formData: OnboardingFormData;
  setFormData: (data: OnboardingFormData) => void;
}) {
  const bottomSheetModalRef = React.useRef<GorhomBottomSheetModal>(null);

  const handleOpenBottomSheetModal = React.useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access the media library is required."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: false,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0].uri });
      bottomSheetModalRef.current?.dismiss();
    }
  };

  const openCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images", "videos"],
      allowsMultipleSelection: false,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    console.log(`Result: ${JSON.stringify(result)}`);
    if (!result.canceled) {
      setFormData({ ...formData, image: result.assets[0].uri });
      bottomSheetModalRef.current?.dismiss();
    }
  };

  return (
    <View className="flex-1 items-center gap-6 pt-8">
      <Avatar
        alt="User's Avatar"
        className="size-28 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-secondary/60"
      >
        <AvatarImage source={{ uri: formData.image }} />
        <AvatarFallback className="bg-secondary/60">
          <Ionicons name="person" size={48} className="text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      <Button variant="outline" onPress={handleOpenBottomSheetModal}>
        <Icon as={Plus} size={18} className="text-primary" />
        <Text className="text-primary text-sm font-medium">Add Photo</Text>
      </Button>
      <BottomSheetModal ref={bottomSheetModalRef}>
        <View className="flex items-start gap-3 p-4">
          <Button
            variant="link"
            onPress={openCamera}
            className="flex flex-row items-center gap-2"
          >
            ²
            <Icon as={Focus} size={24} className="text-foreground" />
            <Text className="text-muted-foreground">Take from camera</Text>
          </Button>
          <Separator className="bg-muted-foreground px-2" />
          <Button
            variant="link"
            onPress={pickImage}
            className="flex flex-row items-center gap-2"
          >
            <Icon as={ImageIcon} size={24} className="text-foreground" />
            <Text className="text-sm text-muted-foreground">
              Choose from gallery
            </Text>
          </Button>
        </View>
      </BottomSheetModal>
    </View>
  );
}
