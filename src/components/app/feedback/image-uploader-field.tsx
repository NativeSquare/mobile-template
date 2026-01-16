import { ImageUploader } from "@/components/custom/image-uploader";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import * as ImagePicker from "expo-image-picker";
import { X } from "lucide-react-native";
import { Image, Pressable, View } from "react-native";

export type ImageUploaderFieldProps = {
  label?: string;
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  uploadOptions?: ("camera" | "gallery")[];
  error?: string;
};

export function ImageUploaderField({
  label = "Add Photos",
  images,
  onImagesChange,
  maxImages = 3,
  uploadOptions = ["camera", "gallery"],
  error,
}: ImageUploaderFieldProps) {
  const handleImageSelected = (image: ImagePicker.ImagePickerAsset) => {
    if (images.length < maxImages) {
      onImagesChange([...images, image.uri]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    onImagesChange(updated);
  };

  const canAddMore = images.length < maxImages;

  return (
    <View className="gap-2">
      {label && <Text className="text-sm font-medium">{label}</Text>}

      <View className="gap-4">
        {/* Image Thumbnails */}
        {images.length > 0 && (
          <View className="flex-row gap-3">
            {images.map((uri, index) => (
              <View key={index} className="relative">
                <Image
                  source={{ uri }}
                  className="size-24 rounded-xl"
                  resizeMode="cover"
                />
                <Pressable
                  onPress={() => handleRemoveImage(index)}
                  className="absolute top-1.5 right-1.5 size-6 items-center justify-center rounded-full bg-background/80"
                >
                  <Icon as={X} size={14} className="text-foreground" />
                </Pressable>
              </View>
            ))}
          </View>
        )}

        <ImageUploader
          onImageSelected={handleImageSelected}
          uploadOptions={uploadOptions}
          disabled={!canAddMore}
        />
      </View>

      {error && <Text className="text-xs text-destructive mt-1">{error}</Text>}
    </View>
  );
}
