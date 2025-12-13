import { AddPhotoStep } from "@/components/app/onboarding/add-photo-step";
import { BasicInfoStep } from "@/components/app/onboarding/basic-info-step";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Progress } from "@/components/ui/progress";
import { Text } from "@/components/ui/text";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@convex/_generated/api";
import { Doc } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { ScrollView, View } from "react-native";

export type OnboardingFormData = Partial<Pick<Doc<"users">, "image" | "name">>;

export default function Onboarding() {
  const { signOut } = useAuthActions();
  const user = useQuery(api.functions.currentUser);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState<OnboardingFormData>({});
  const markOnboardingCompleted = useMutation(
    api.functions.markOnboardingCompleted
  );
  const updateUserAfterOnboarding = useMutation(
    api.functions.updateUserAfterOnboarding
  );

  const steps = [
    { component: AddPhotoStep, id: "photos", canSkip: true },
    { component: BasicInfoStep, id: "basic", canSkip: true },
  ];
  const CurrentStepComponent = steps[currentStep].component;

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
    } else {
      signOut();
    }
  };

  const goNext = () => {
    if (currentStep === steps.length - 1) {
      handleComplete();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, 2));
    }
  };

  const handleSkip = () => {
    if (!user?._id) return;
    markOnboardingCompleted({ userId: user._id });
  };

  const handleComplete = () => {
    if (!user?._id) return;
    updateUserAfterOnboarding({ userId: user._id, data: formData });
    markOnboardingCompleted({ userId: user._id });
  };

  const renderHeader = () => {
    const progress = ((currentStep + 1) / steps.length) * 100;
    return (
      <View className="gap-3 pt-2">
        <View className="flex-row items-center justify-between">
          <Button variant="ghost" onPress={goBack}>
            <Icon as={ChevronLeft} size={24} />
          </Button>

          <Button variant="ghost" onPress={handleSkip}>
            <Text className="text-sm font-medium text-foreground">Skip</Text>
          </Button>
        </View>
        <Progress
          value={progress}
          className="h-[3px] bg-primary/20"
          indicatorClassName="bg-primary"
        />
      </View>
    );
  };

  const renderFooter = () => {
    return (
      <View className="flex-row gap-3">
        {currentStep > 0 && (
          <Button
            variant="outline"
            className="flex-1 border-primary/80"
            onPress={goBack}
          >
            <Text className="text-primary">Back</Text>
          </Button>
        )}
        <Button className="flex-1" onPress={goNext}>
          <Text className="text-primary-foreground">Continue</Text>
        </Button>
      </View>
    );
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      contentContainerStyle={{ flexGrow: 1 }}
      contentContainerClassName="my-safe px-4 pb-4"
    >
      <View className="w-full max-w-md self-center flex-1 gap-8">
        {renderHeader()}
        <View className="flex-1">
          <CurrentStepComponent formData={formData} setFormData={setFormData} />
        </View>
        {renderFooter()}
      </View>
    </ScrollView>
  );
}
