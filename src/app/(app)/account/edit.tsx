import { NameField } from "@/components/app/account/name-field";
import { ProfilePictureField } from "@/components/app/account/profile-picture-field";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useUploadImage } from "@/hooks/use-upload-image";
import { getConvexErrorMessage } from "@/utils/getConvexErrorMessage";
import { UserProfileSchema } from "@/validation/account";
import { api } from "@convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import z from "zod";

type ProfileFormData = {
  name: string;
  image: string | null;
};

export default function EditProfileScreen() {
  const router = useRouter();
  const user = useQuery(api.table.users.currentUser);
  const patchUser = useMutation(api.table.users.patch);
  const { uploadImage, isUploading } = useUploadImage();

  const [formData, setFormData] = React.useState<ProfileFormData>({
    name: user?.name ?? "",
    image: user?.image ?? null,
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<{
    name?: string;
    image?: string;
  }>({});

  const hasChanges =
    formData.name.trim() !== (user?.name ?? "") ||
    formData.image !== (user?.image ?? null);

  const handleSubmit = async () => {
    setError(null);
    setFieldErrors({});

    const result = UserProfileSchema.safeParse(formData);

    if (!result.success) {
      const tree = z.treeifyError(result.error);

      setFieldErrors({
        name: tree.properties?.name?.errors?.[0],
        image: tree.properties?.image?.errors?.[0],
      });
      setError(tree.errors?.[0] ?? null);
      return;
    }

    if (!user?._id) {
      setError("You must be logged in to update your profile");
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = formData.image;

      // Upload image if it's a local file (not an HTTP URL)
      if (imageUrl && !imageUrl.startsWith("http")) {
        imageUrl = await uploadImage(imageUrl);
      }

      await patchUser({
        id: user._id,
        data: {
          name: formData.name.trim(),
          image: imageUrl ?? undefined,
        },
      });

      router.back();
    } catch (err) {
      setError(getConvexErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = () => {
    return (
      <View className="flex-row items-center justify-between px-5 pt-6">
        <Button variant="ghost" size="icon" onPress={() => router.back()}>
          <Icon as={ChevronLeft} size={24} />
        </Button>
        <Text className="text-lg font-semibold">Edit Profile</Text>
        <View className="size-6" />
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <View className="gap-2">
        {error && (
          <Text className="text-sm text-destructive text-center">{error}</Text>
        )}
        <Button
          className="w-full"
          onPress={handleSubmit}
          disabled={isLoading || isUploading || !hasChanges}
        >
          {isLoading || isUploading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text>Save</Text>
          )}
        </Button>
      </View>
    );
  };

  return (
    <View className="flex-1 mt-safe">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        contentContainerClassName="px-4 pb-6"
      >
        <View className="w-full max-w-md self-center flex flex-1 gap-6">
          {renderHeader()}

          <ProfilePictureField
            image={formData.image}
            name={formData.name}
            onImageChange={(uri) =>
              setFormData((prev) => ({ ...prev, image: uri }))
            }
            onImageRemove={() =>
              setFormData((prev) => ({ ...prev, image: null }))
            }
            error={fieldErrors.image}
          />

          <NameField
            value={formData.name}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, name: value }))
            }
            error={fieldErrors.name}
          />
        </View>
      </ScrollView>
      <View className="w-full max-w-md self-center px-4 pb-4 mb-safe">
        {renderFooter()}
      </View>
    </View>
  );
}
