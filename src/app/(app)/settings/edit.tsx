import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { api } from "@convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";

export default function EditProfileScreen() {
  const router = useRouter();
  const user = useQuery(api.users.currentUser);
  const [name, setName] = React.useState(user?.name ?? "");
  const [photoUri, setPhotoUri] = React.useState<string | null>(
    user?.image ?? null
  );
  const [isPickingPhoto, setIsPickingPhoto] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    setName(user?.name ?? "");
    setPhotoUri(user?.image ?? null);
  }, [user?.name, user?.image]);

  const hasChanges =
    name.trim() !== (user?.name ?? "") ||
    (photoUri ?? null) !== (user?.image ?? null);

  const requestPermissions = React.useCallback(
    async (source: "camera" | "library") => {
      const permission =
        source === "camera"
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission needed",
          `Please allow access to your ${
            source === "camera" ? "camera" : "photo library"
          } to change your profile photo.`
        );
        return false;
      }
      return true;
    },
    []
  );

  const pickImage = React.useCallback(
    async (source: "camera" | "library") => {
      const allowed = await requestPermissions(source);
      if (!allowed) return;

      setIsPickingPhoto(true);
      try {
        const result =
          source === "camera"
            ? await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.9,
              })
            : await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.9,
              });

        if (!result.canceled && result.assets?.[0]?.uri) {
          setPhotoUri(result.assets[0].uri);
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Unable to pick image", "Please try again.");
      } finally {
        setIsPickingPhoto(false);
      }
    },
    [requestPermissions]
  );

  const openPhotoActions = React.useCallback(() => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Take Photo", "Choose From Library"],
          cancelButtonIndex: 0,
        },
        (index) => {
          if (index === 1) pickImage("camera");
          if (index === 2) pickImage("library");
        }
      );
    } else {
      Alert.alert("Change photo", undefined, [
        { text: "Take Photo", onPress: () => pickImage("camera") },
        { text: "Choose From Library", onPress: () => pickImage("library") },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  }, [pickImage]);

  const handleSave = React.useCallback(async () => {
    if (!hasChanges || isSaving) return;
    setIsSaving(true);
    try {
      // TODO: wire up to backend profile update mutation when available.
      await new Promise((resolve) => setTimeout(resolve, 500));
      Alert.alert("Profile saved");
      router.back();
    } finally {
      setIsSaving(false);
    }
  }, [hasChanges, isSaving, router]);

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="mt-safe p-4 pb-10 sm:p-6 gap-5"
      keyboardDismissMode="interactive"
    >
      <View className="w-full max-w-xl self-center gap-8">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="size-10 items-center justify-center -ml-2 rounded-full active:bg-secondary/70"
            accessibilityLabel="Go back"
            hitSlop={6}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              className="text-foreground"
            />
          </Pressable>

          <Text className="text-lg font-semibold">Edit Profile</Text>

          <Button
            variant="ghost"
            size="sm"
            disabled={!hasChanges || isSaving}
            className="px-2"
            onPress={handleSave}
          >
            {isSaving ? (
              <ActivityIndicator size="small" />
            ) : (
              <Text
                className={cn(
                  "text-base font-semibold",
                  !hasChanges && "text-muted-foreground"
                )}
              >
                Save
              </Text>
            )}
          </Button>
        </View>

        <View className="items-center gap-3">
          <View className="relative">
            <Avatar alt={user?.name ?? "Guest"} className="size-32">
              {photoUri ? (
                <AvatarImage source={{ uri: photoUri }} />
              ) : (
                <AvatarFallback className="bg-secondary/80">
                  <Text className="text-3xl font-semibold">
                    {(name.trim()?.[0] ?? "🙂").toUpperCase()}
                  </Text>
                </AvatarFallback>
              )}
            </Avatar>

            {isPickingPhoto && (
              <View className="absolute inset-0 items-center justify-center rounded-full bg-background/70">
                <ActivityIndicator />
              </View>
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
        </View>

        <View className="gap-2">
          <Text className="text-xs font-semibold uppercase tracking-[0.4px] text-muted-foreground">
            Name
          </Text>
          <Input
            value={name}
            onChangeText={setName}
            placeholder="John Smith"
            autoCapitalize="words"
            returnKeyType="done"
          />
        </View>
      </View>
    </ScrollView>
  );
}
