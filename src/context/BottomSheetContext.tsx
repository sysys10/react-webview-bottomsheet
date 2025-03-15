import React, { createContext, useContext, useState, useCallback } from "react";
import type { BottomSheetProps } from "../types";

// Define the context interface
interface BottomSheetContextProps {
  isVisible: boolean;
  showBottomSheet: (props?: Partial<BottomSheetProps>) => void;
  hideBottomSheet: () => void;
  sheetProps: Partial<BottomSheetProps>;
}

// Create context with default values
const BottomSheetContext = createContext<BottomSheetContextProps>({
  isVisible: false,
  showBottomSheet: () => {},
  hideBottomSheet: () => {},
  sheetProps: {},
});

// Provider props interface
interface BottomSheetProviderProps {
  children: React.ReactNode;
  defaultProps?: Partial<BottomSheetProps>;
}

/**
 * Provider component that manages BottomSheet visibility and props
 */
export const BottomSheetProvider: React.FC<BottomSheetProviderProps> = ({
  children,
  defaultProps = {},
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [sheetProps, setSheetProps] =
    useState<Partial<BottomSheetProps>>(defaultProps);

  // Show the bottom sheet with optional additional props
  const showBottomSheet = useCallback((props?: Partial<BottomSheetProps>) => {
    if (props) {
      setSheetProps((prev) => ({ ...prev, ...props }));
    }
    setIsVisible(true);
  }, []);

  // Hide the bottom sheet
  const hideBottomSheet = useCallback(() => {
    setIsVisible(false);
  }, []);

  return (
    <BottomSheetContext.Provider
      value={{
        isVisible,
        showBottomSheet,
        hideBottomSheet,
        sheetProps,
      }}
    >
      {children}
    </BottomSheetContext.Provider>
  );
};

/**
 * Hook to access and control the bottom sheet from any component
 */
export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);

  if (!context) {
    throw new Error("useBottomSheet must be used within a BottomSheetProvider");
  }

  return context;
};
