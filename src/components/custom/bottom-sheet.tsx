import { THEME } from "@/lib/theme";
import {
  BottomSheetBackdrop as GorhomBottomSheetBackdrop,
  BottomSheetModal as GorhomBottomSheetModal,
  BottomSheetView as GorhomBottomSheetView,
} from "@gorhom/bottom-sheet";
import { useColorScheme } from "nativewind";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BottomSheetModalProps {
  ref: React.RefObject<GorhomBottomSheetModal | null>;
  children: React.ReactNode;
}

export type BottomSheetModalType = BottomSheetModalProps;

export function BottomSheetModal({ ref, children }: BottomSheetModalProps) {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();

  const input = THEME[colorScheme ?? "light"].input;

  return (
    <GorhomBottomSheetModal
      ref={ref}
      backgroundStyle={{
        backgroundColor:
          colorScheme === "dark"
            ? "#121212"
            : THEME[colorScheme ?? "light"].background,
      }}
      handleIndicatorStyle={{
        backgroundColor: THEME[colorScheme ?? "light"].secondary,
        width: 40,
        height: 5,
      }}
      handleStyle={{
        backgroundColor: colorScheme === "dark" ? "#121212" : input,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      }}
      backdropComponent={(props) => (
        <GorhomBottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.5}
        />
      )}
    >
      <GorhomBottomSheetView className={`pb-[${insets.bottom}px]`}>
        {children}
      </GorhomBottomSheetView>
    </GorhomBottomSheetModal>
  );
}
