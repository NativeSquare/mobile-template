import { Ionicons } from "@expo/vector-icons";
import { cssInterop } from "nativewind";

cssInterop(Ionicons, {
  className: {
    target: "style",
  },
});
