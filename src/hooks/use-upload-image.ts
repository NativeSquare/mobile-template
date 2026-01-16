import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useConvex, useMutation } from "convex/react";
import * as ImageManipulator from "expo-image-manipulator";
import React from "react";

export type UploadImageOptions = {
  /** Max width to resize to (maintains aspect ratio). Default: 1024 */
  width?: number;
  /** Compression quality 0-1. Default: 0.8 */
  compress?: number;
  /** Output format. Default: JPEG */
  format?: ImageManipulator.SaveFormat;
};

export function useUploadImage() {
  const convex = useConvex();
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const [isUploading, setIsUploading] = React.useState(false);

  /**
   * Uploads an image and returns the public URL.
   * Use this for user-facing images (profile pictures, etc.)
   */
  const uploadImage = React.useCallback(
    async (uri: string, options?: UploadImageOptions): Promise<string> => {
      const {
        width = 1024,
        compress = 0.8,
        format = ImageManipulator.SaveFormat.JPEG,
      } = options ?? {};

      setIsUploading(true);

      try {
        // Compress and resize image before upload (maintaining aspect ratio)
        const image = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width } }],
          { compress, format }
        );

        const response = await fetch(image.uri);
        const blob = await response.blob();

        const uploadUrl = await generateUploadUrl();
        const contentType =
          format === ImageManipulator.SaveFormat.PNG
            ? "image/png"
            : "image/jpeg";

        const uploadResult = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": contentType },
          body: blob,
        });

        const { storageId } = (await uploadResult.json()) as {
          storageId: Id<"_storage">;
        };

        // Get the public URL from the storage ID
        const imageUrl = await convex.query(api.storage.getImageUrl, {
          storageId,
        });

        if (!imageUrl) {
          throw new Error("Failed to get image URL from storage");
        }

        return imageUrl;
      } finally {
        setIsUploading(false);
      }
    },
    [convex, generateUploadUrl]
  );

  const uploadImages = React.useCallback(
    async (uris: string[], options?: UploadImageOptions): Promise<string[]> => {
      setIsUploading(true);
      try {
        return await Promise.all(uris.map((uri) => uploadImage(uri, options)));
      } finally {
        setIsUploading(false);
      }
    },
    [uploadImage]
  );

  return {
    uploadImage,
    uploadImages,
    isUploading,
  };
}
