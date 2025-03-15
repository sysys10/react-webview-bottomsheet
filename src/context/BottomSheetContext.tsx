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

/**
 * 서버사이드 렌더링을 지원하는 Consumer 컴포넌트
 * 서버사이드에서는 null을 렌더링하고, 클라이언트에서만 실제 컴포넌트를 렌더링합니다.
 */
export const SSRSafeConsumer: React.FC<{
  children: (context: BottomSheetContextProps) => React.ReactNode;
}> = ({ children }) => {
  const isBrowser = typeof window !== "undefined";
  const [mounted, setMounted] = useState(false);

  // 클라이언트 사이드에서만 마운트 상태를 true로 설정
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 서버 사이드이거나 아직 마운트되지 않은 경우 null 반환
  if (!isBrowser || !mounted) {
    return null;
  }

  return <BottomSheetContext.Consumer>{children}</BottomSheetContext.Consumer>;
};
