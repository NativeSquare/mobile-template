import { ConfigContext, ExpoConfig } from "expo/config";
import { APP_NAME, APP_SLUG } from "./constants";

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return `com.${APP_SLUG}.dev`;
  }

  if (IS_PREVIEW) {
    return `com.${APP_SLUG}.preview`;
  }

  return `com.${APP_SLUG}`;
};

const getAppName = () => {
  if (IS_DEV) {
    return `${APP_NAME} (Dev)`;
  }

  if (IS_PREVIEW) {
    return `${APP_NAME} (Preview)`;
  }

  return APP_NAME;
};

export const getGoogleServicesJson = () => {
  if (IS_DEV) {
    return "./google-services-dev.json";
  }

  if (IS_PREVIEW) {
    return "./google-services-preview.json";
  }

  return "./google-services.json";
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: getAppName(),
  slug: APP_SLUG,
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: APP_SLUG,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: getUniqueIdentifier(),
  },
  android: {
    package: getUniqueIdentifier(),
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    // googleServicesFile: getGoogleServicesJson(),
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
    bundler: "metro",
  },
  plugins: [
    "expo-camera",
    "expo-image-picker",
    "expo-media-library",
    "expo-notifications",
    "expo-router",
    "expo-secure-store",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  owner: "nativesquare-expo",
  extra: {
    router: {},
  },
  runtimeVersion: {
    policy: "appVersion",
  },
});
