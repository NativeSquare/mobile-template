import { ConfigContext, ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_QA = process.env.APP_VARIANT === "qa";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.findr.mobile.dev";
  }

  if (IS_QA) {
    return "com.findr.mobile.qa";
  }

  if (IS_PREVIEW) {
    return "com.findr.mobile.preview";
  }

  return "com.findr.mobile";
};

const getAppName = () => {
  if (IS_DEV) {
    return "FindR (Dev)";
  }

  if (IS_QA) {
    return "FindR (QA)";
  }

  if (IS_PREVIEW) {
    return "FindR (Preview)";
  }

  return "FindR";
};

export const getGoogleServicesJson = () => {
  if (IS_DEV) {
    return "./google-services-dev.json";
  }

  if (IS_QA) {
    return "./google-services-qa.json";
  }

  if (IS_PREVIEW) {
    return "./google-services-preview.json";
  }

  return "./google-services.json";
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: getAppName(),
  slug: "Findr",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "findr",
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
    googleServicesFile: getGoogleServicesJson(),
  },
  web: {
    output: "static",
    favicon: "./assets/images/favicon.png",
    bundler: "metro",
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    "expo-notifications",
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
    eas: {
      projectId: "be4ff23d-07e9-4524-bb48-d7056e34337f",
    },
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  updates: {
    url: "https://u.expo.dev/be4ff23d-07e9-4524-bb48-d7056e34337f",
  },
});
