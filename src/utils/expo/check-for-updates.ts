import * as Updates from "expo-updates";
import { Alert } from "react-native";

export async function checkForUpdates() {
  // Only check for updates in production builds
  if (!Updates.isEnabled) {
    return;
  }

  try {
    const update = await Updates.checkForUpdateAsync();

    if (update.isAvailable) {
      Alert.alert(
        "Update Available",
        "A new version of the app is available. Would you like to download and install it now?",
        [
          {
            text: "Later",
            style: "cancel",
          },
          {
            text: "Update Now",
            onPress: async () => {
              try {
                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync();
              } catch (error) {
                Alert.alert(
                  "Update Failed",
                  `Failed to install update: ${error}`
                );
              }
            },
          },
        ]
      );
    }
  } catch (error) {
    // Silently fail in production - we don't want to interrupt the user experience
    if (__DEV__) {
      console.error("Error checking for updates:", error);
    }
  }
}
