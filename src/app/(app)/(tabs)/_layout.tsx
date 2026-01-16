import {
  Label,
  Icon as NativeIcon,
  NativeTabs,
} from "expo-router/unstable-native-tabs";

export default function TabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <NativeIcon sf={"house.fill"} drawable={"ic_menu_mylocation"} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="account">
        <Label>Account</Label>
        <NativeIcon sf={"person.fill"} drawable={"ic_menu_mylocation"} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
