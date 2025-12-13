import { OnboardingFormData } from "@/app/(onboarding)";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import * as React from "react";
import { View } from "react-native";

export function BasicInfoStep({
  formData,
  setFormData,
}: {
  formData: OnboardingFormData;
  setFormData: (data: OnboardingFormData) => void;
}) {
  const BIO_LIMIT = 500;
  return (
    <View className="gap-5">
      <View className="gap-2">
        <Text className="text-sm text-muted-foreground">Name</Text>
        <Input
          placeholder="John"
          value={formData.name}
          onChangeText={(value) => setFormData({ ...formData, name: value })}
          autoCapitalize="words"
          returnKeyType="next"
        />
      </View>
      <View className="gap-2">
        <Text className="text-sm text-muted-foreground">Bio</Text>
        <Textarea
          placeholder="Share a little about yourself"
          placeholderClassName="text-primary"
          value={formData.bio}
          onChangeText={(value) => setFormData({ ...formData, bio: value })}
          className="min-h-32"
        />
        <Text className="text-xs text-muted-foreground self-end">
          {formData.bio?.length}/{BIO_LIMIT}
        </Text>
      </View>
    </View>
  );
}
