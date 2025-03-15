// Main component export
export { default as BottomSheet } from "./BottomSheet";

// Type exports
export type { BottomSheetProps } from "./types";

// Hooks exports
export { useA11yProps } from "./hooks/useA11yProps";
export { useDragHandlers } from "./hooks/useDragHandlers";

// Utilities
export {
  BottomSheetProvider,
  useBottomSheet,
} from "./context/BottomSheetContext";
