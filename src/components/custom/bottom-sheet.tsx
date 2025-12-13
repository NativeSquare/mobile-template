// ================================================================================ //
// ======================== Default Bottom Sheet Component ======================== //
// ================================================================================ //

import { THEME } from "@/lib/theme";
import {
  BottomSheetBackdrop as GorhomBottomSheetBackdrop,
  BottomSheetModal as GorhomBottomSheetModal,
  BottomSheetView as GorhomBottomSheetView,
} from "@gorhom/bottom-sheet";
import { useColorScheme } from "nativewind";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Interface Definition ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

interface BottomSheetModalProps {
  ref: React.RefObject<GorhomBottomSheetModal | null>;
  children: React.ReactNode;
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Component Definition ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

export type BottomSheetModalType = BottomSheetModalProps;

export function BottomSheetModal({ ref, children }: BottomSheetModalProps) {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  return (
    <GorhomBottomSheetModal
      ref={ref}
      handleIndicatorStyle={{
        backgroundColor: THEME[colorScheme ?? "light"].mutedForeground,
        width: 40,
        height: 5,
      }}
      handleStyle={{
        backgroundColor: THEME[colorScheme ?? "light"].muted,
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
      <GorhomBottomSheetView className={`pb-[${insets.bottom}px] bg-input`}>
        {children}
      </GorhomBottomSheetView>
    </GorhomBottomSheetModal>
  );
}
