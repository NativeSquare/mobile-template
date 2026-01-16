import { SettingsGroup } from "@/components/app/account/settings-group";
import { SettingsRow } from "@/components/app/account/settings-row";
import { ConfirmationSheet } from "@/components/shared/confirmation-sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@convex/_generated/api";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";

export default function Account() {
  const router = useRouter();
  const { signOut } = useAuthActions();
  const user = useQuery(api.table.users.currentUser);
  const deleteAccount = useMutation(api.table.users.deleteAccount);

  const logoutSheetRef = React.useRef<BottomSheetModal>(null);
  const deleteAccountSheetRef = React.useRef<BottomSheetModal>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const displayName = user?.name || "Guest";
  const displayEmail = user?.email || "guest@example.com";
  const avatarInitial = React.useMemo(() => {
    const fromName = displayName?.trim()?.[0];
    const fromEmail = displayEmail?.trim()?.[0];
    return (fromName || fromEmail || "?").toUpperCase();
  }, [displayName, displayEmail]);

  const handleLogout = () => {
    logoutSheetRef.current?.dismiss();
    signOut();
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      deleteAccountSheetRef.current?.dismiss();
      signOut();
    } catch (error) {
      console.error("Failed to delete account:", error);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="p-4 pb-10 sm:p-6 gap-5"
        keyboardDismissMode="interactive"
        contentInsetAdjustmentBehavior="automatic"
      >
        <View className="w-full max-w-2xl self-center gap-6">
          <Text variant="h3" className="text-left">
            Account
          </Text>

          <View className="flex-row items-center gap-4 rounded-2xl">
            <Avatar alt={displayName} className="size-14">
              {user?.image ? (
                <AvatarImage source={{ uri: user.image }} />
              ) : (
                <AvatarFallback>
                  <Text className="text-lg font-semibold">{avatarInitial}</Text>
                </AvatarFallback>
              )}
            </Avatar>
            <View className="flex-1">
              <Text className="text-lg font-semibold">{displayName}</Text>
              <Text className="text-muted-foreground text-sm">
                {displayEmail}
              </Text>
            </View>
          </View>

          <SettingsGroup
            title="Account"
            items={[
              {
                label: "Profile",
                icon: "person-outline",
                onPress: () => router.push("/account/edit"),
              },
              { label: "Billing", icon: "card-outline", onPress: () => {} },
            ]}
          />

          <SettingsGroup
            title="Personalization"
            items={[
              {
                label: "Appearance",
                icon: "color-palette-outline",
                onPress: () => router.push("/account/appearance"),
              },
              {
                label: "Language",
                icon: "language-outline",
                onPress: () => {},
              },
            ]}
          />

          <SettingsGroup
            title="Notifications & Activity"
            items={[
              {
                label: "Notifications",
                icon: "notifications-outline",
                onPress: () => {},
              },
            ]}
          />

          <SettingsGroup
            title="Support & Legal"
            items={[
              {
                label: "Terms & Conditions",
                icon: "document-text-outline",
                onPress: () => {},
              },
              {
                label: "Privacy Policy",
                icon: "shield-checkmark-outline",
                onPress: () => {},
              },
              {
                label: "Send Feedback",
                icon: "chatbubbles-outline",
                onPress: () => router.push("/account/send-feedback"),
              },
            ]}
          />

          <View className="overflow-hidden rounded-2xl border border-border/60 bg-secondary/60">
            <View className="divide-y divide-border/60">
              <SettingsRow
                label="Log out"
                icon="log-out-outline"
                showChevron={false}
                onPress={() => logoutSheetRef.current?.present()}
              />
              <SettingsRow
                label="Delete Account"
                icon="trash-outline"
                destructive
                showChevron={false}
                onPress={() => deleteAccountSheetRef.current?.present()}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <ConfirmationSheet
        sheetRef={logoutSheetRef}
        icon="log-out-outline"
        title="Log out"
        description="Are you sure you want to log out? You'll need to sign in again to access your account."
        confirmLabel="Log out"
        onConfirm={handleLogout}
      />

      <ConfirmationSheet
        sheetRef={deleteAccountSheetRef}
        icon="trash-outline"
        title="Delete Account"
        description="This action is permanent and cannot be undone. All your data will be permanently deleted."
        confirmLabel="Delete Account"
        destructive
        loading={isDeleting}
        onConfirm={handleDeleteAccount}
      />
    </>
  );
}
