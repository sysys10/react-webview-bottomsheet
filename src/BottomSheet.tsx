import React, { useRef, useState, useEffect, useCallback } from "react";
import { useA11yProps } from "./hooks/useA11yProps";
import { useDragHandlers } from "./hooks/useDragHandlers";
import type { BottomSheetProps } from "./types";

// 서버사이드 렌더링을 확인하는 헬퍼 함수
const isBrowser = typeof window !== "undefined";

export const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  initialHeight = "30%",
  maxHeight = "90%",
  minHeight = "10%",
  isVisible = true,
  enableSnapping = true,
  isDraggable = true,
  snapPoints = [30, 60, 90],
  containerStyle,
  contentStyle,
  handleStyle,
  backdropColor = "rgba(0, 0, 0, 0.5)",
  showBackdrop = true,
  closeOnClickOutside = true,
  sheetHeight,
  setSheetHeight,
  onClose,
  onHeightChange,
  onSnap,
  onDragStart,
  onDragEnd,
  showHandle = true,
  roundedCorners = true,
  cornerRadius = "12px",
  animated = true,
  animationDuration = 300,
  id,
  className,
  contentClassName,
  handleClassName,
  closeOnEscape = true,
}) => {
  // Convert initial height to numeric value for calculations
  const getInitialHeightValue = useCallback(() => {
    if (!isBrowser) return 0; // 서버사이드에서는 0 반환

    if (typeof initialHeight === "string") {
      if (initialHeight.endsWith("%")) {
        return (parseFloat(initialHeight) / 100) * window.innerHeight;
      } else if (initialHeight.endsWith("px")) {
        return parseFloat(initialHeight);
      }
    }
    return isBrowser ? 0.3 * window.innerHeight : 0; // 서버사이드 대응
  }, [initialHeight]);

  // Convert string height values to numeric pixel values
  const getPixelValue = useCallback((value: string): number => {
    if (!isBrowser) return 0; // 서버사이드에서는 0 반환

    if (value.endsWith("%")) {
      return (parseFloat(value) / 100) * window.innerHeight;
    } else if (value.endsWith("px")) {
      return parseFloat(value);
    }
    return parseFloat(value);
  }, []);

  // 클라이언트에서만 초기 높이 설정
  useEffect(() => {
    if (isBrowser) {
      setSheetHeight(getInitialHeightValue());
    }
  }, [getInitialHeightValue]);

  // State to track if the user is currently dragging
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // State to track if the sheet is visible
  const [visible, setVisible] = useState<boolean>(isVisible);

  // Reference to the bottom sheet element
  const sheetRef = useRef<HTMLDivElement>(null);

  // Get pixel values for min and max heights
  const minHeightPx = isBrowser ? getPixelValue(minHeight) : 0;
  const maxHeightPx = isBrowser ? getPixelValue(maxHeight) : 0;

  // Track the starting position of the drag
  const dragStartY = useRef<number>(0);
  const dragStartHeight = useRef<number>(0);

  // Find the nearest snap point (if snapping is enabled)
  const findNearestSnapPoint = useCallback(
    (height: number): number => {
      if (!enableSnapping || !isBrowser) return height;

      const snapPointsPixels = snapPoints.map(
        (point) => (point / 100) * window.innerHeight
      );

      let nearestPoint = snapPointsPixels[0];
      let minDistance = Math.abs(height - nearestPoint);

      snapPointsPixels.forEach((point) => {
        const distance = Math.abs(height - point);
        if (distance < minDistance) {
          minDistance = distance;
          nearestPoint = point;
        }
      });

      // Find index of the snap point for the callback
      const snapIndex = snapPointsPixels.indexOf(nearestPoint);
      if (snapIndex !== -1 && onSnap) {
        onSnap(snapIndex);
      }

      return nearestPoint;
    },
    [enableSnapping, onSnap, snapPoints]
  );

  // Get drag handlers
  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useDragHandlers({
    isDraggable,
    isDragging,
    setIsDragging,
    dragStartY,
    dragStartHeight,
    minHeightPx,
    maxHeightPx,
    sheetHeight,
    setSheetHeight,
    onDragStart,
    onDragEnd,
    onHeightChange,
    enableSnapping,
    findNearestSnapPoint,
  });

  // Handle backdrop click
  const handleBackdropClick = useCallback(() => {
    if (closeOnClickOutside && onClose) {
      onClose();
    }
  }, [closeOnClickOutside, onClose]);

  // Handle escape key press
  useEffect(() => {
    if (!isBrowser) return; // 서버사이드에서는 실행하지 않음

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (closeOnEscape && visible && event.key === "Escape" && onClose) {
        onClose();
      }
    };

    if (closeOnEscape) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      if (closeOnEscape) {
        document.removeEventListener("keydown", handleEscapeKey);
      }
    };
  }, [closeOnEscape, visible, onClose]);

  // Update visibility when isVisible prop changes
  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  // Handle resize event to adjust heights
  useEffect(() => {
    if (!isBrowser) return; // 서버사이드에서는 실행하지 않음

    const handleResize = () => {
      setSheetHeight(getInitialHeightValue());
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [getInitialHeightValue]);

  // Get accessibility props
  const a11yProps = useA11yProps({ id, visible });

  // Calculate dynamic styles
  const backdropStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: backdropColor,
    display: showBackdrop && visible ? "block" : "none",
    opacity: visible ? 1 : 0,
    zIndex: 9998,
  };

  const bottomSheetStyle: React.CSSProperties = {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    height: `${sheetHeight}px`,
    backgroundColor: "white",
    borderTopLeftRadius: roundedCorners ? cornerRadius : 0,
    borderTopRightRadius: roundedCorners ? cornerRadius : 0,
    zIndex: 9999,
    boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
    transition:
      animated && !isDragging ? `height ${animationDuration}ms ease` : "none",
    transform: visible ? "translateY(0)" : "translateY(100%)",
    overflowX: "hidden",
    ...containerStyle,
  };

  const dragHandleStyle: React.CSSProperties = {
    width: "40px",
    height: "5px",
    borderRadius: "3px",
    backgroundColor: "#DDD",
    margin: "10px auto",
    cursor: isDraggable ? "grab" : "default",
    ...handleStyle,
  };

  const contentContainerStyle: React.CSSProperties = {
    padding: "0px 16px 16px 16px",
    height: "calc(100% - 25px)",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch", // For smoother scrolling on iOS
    ...contentStyle,
  };

  // 서버사이드 렌더링 중이고 백드롭도 표시하지 않는 경우 아무것도 렌더링하지 않음
  if ((!isBrowser || !visible) && !showBackdrop) {
    return null;
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div
        style={backdropStyle}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Bottom sheet */}
      <div
        ref={sheetRef}
        style={bottomSheetStyle}
        className={`bottom-sheet-container ${className || ""}`}
        {...a11yProps}
      >
        {/* Drag handle indicator */}
        {showHandle && (
          <div
            style={dragHandleStyle}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            className={`bottom-sheet-handle ${handleClassName || ""}`}
            role="button"
            tabIndex={0}
            aria-label="Drag handle"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                // Toggle between min and max height on Enter or Space
                if (sheetHeight < maxHeightPx) {
                  setSheetHeight(maxHeightPx);
                  if (onHeightChange) onHeightChange(maxHeightPx);
                } else {
                  setSheetHeight(minHeightPx);
                  if (onHeightChange) onHeightChange(minHeightPx);
                }
              }
            }}
          />
        )}

        {/* Content container */}
        <div
          style={contentContainerStyle}
          className={`bottom-sheet-content ${contentClassName || ""}`}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default BottomSheet;
