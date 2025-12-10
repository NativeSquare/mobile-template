import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import React from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";

type SettingItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  destructive?: boolean;
  onPress?: () => void;
};

function SettingsRow({ label, icon, destructive, onPress }: SettingItem) {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        "flex-row items-center gap-2.5 px-3.5 py-2.5",
        "active:bg-secondary/80",
        destructive && "active:bg-destructive/10"
      )}
    >
      <View
        className={cn(
          "bg-secondary/60 size-9 items-center justify-center rounded-lg",
          destructive && "bg-destructive/10"
        )}
      >
        <Ionicons
          name={icon}
          size={18}
          className={destructive ? "text-destructive" : "text-muted-foreground"}
        />
      </View>
      <Text
        className={cn(
          "flex-1 text-sm font-medium",
          destructive && "text-destructive"
        )}
      >
        {label}
      </Text>
      <Ionicons
        name="chevron-forward"
        size={16}
        className="text-muted-foreground"
      />
    </Pressable>
  );
}

function SettingsGroup({
  title,
  items,
}: {
  title: string;
  items: SettingItem[];
}) {
  return (
    <View className="gap-2">
      <Text className="px-1.5 text-[10px] font-semibold uppercase tracking-[0.4px] text-muted-foreground">
        {title}
      </Text>
      <View className="overflow-hidden rounded-xl border border-border/50 bg-secondary/60">
        <View className="divide-y divide-border/50">
          {items.map((item) => (
            <SettingsRow key={item.label} {...item} />
          ))}
        </View>
      </View>
    </View>
  );
}

export default function Profile() {
  const { signOut } = useAuthActions();
  const user = useQuery(api.functions.currentUser);

  const displayName = user?.name || "Guest";
  const displayEmail = user?.email || "guest@example.com";
  const avatarInitial = React.useMemo(() => {
    const fromName = displayName?.trim()?.[0];
    const fromEmail = displayEmail?.trim()?.[0];
    return (fromName || fromEmail || "?").toUpperCase();
  }, [displayName, displayEmail]);

  const handleDeleteAccount = React.useCallback(() => {
    Alert.alert("Delete Account", "This action will be available soon.");
  }, []);

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="mt-safe p-4 pb-10 sm:p-6 gap-5"
      keyboardDismissMode="interactive"
    >
      <View className="w-full max-w-2xl self-center gap-6">
        <Text variant="h3" className="text-left">
          Account
        </Text>

        <View className="bg-card flex-row items-center gap-4 rounded-2xl border shadow-sm shadow-black/5">
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
            { label: "Profile", icon: "person-outline", onPress: () => {} },
            { label: "Billing", icon: "card-outline", onPress: () => {} },
          ]}
        />

        <SettingsGroup
          title="Personalization"
          items={[
            {
              label: "Appearance",
              icon: "color-palette-outline",
              onPress: () => {},
            },
            { label: "Language", icon: "language-outline", onPress: () => {} },
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
              onPress: () => {},
            },
          ]}
        />

        <View className="overflow-hidden rounded-2xl border border-border/60 bg-secondary/60">
          <View className="divide-y divide-border/60">
            <SettingsRow
              label="Log out"
              icon="log-out-outline"
              onPress={() => signOut()}
            />
            <SettingsRow
              label="Delete Account"
              icon="trash-outline"
              destructive
              onPress={handleDeleteAccount}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
