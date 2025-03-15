import React, { useRef, useState, useEffect } from "react";

// Bottom Sheet Props Interface
export interface BottomSheetProps {
  /**
   * Children to render inside the bottom sheet
   */
  children: React.ReactNode;

  /**
   * Initial height of the bottom sheet (when not expanded)
   * Can be a pixel value or percentage of viewport height
   * @default '30%'
   */
  initialHeight?: string;

  /**
   * Maximum height the bottom sheet can expand to
   * @default '90%'
   */
  maxHeight?: string;

  /**
   * Minimum height the bottom sheet can shrink to
   * @default '10%'
   */
  minHeight?: string;

  /**
   * Whether the bottom sheet is initially visible
   * @default true
   */
  isVisible?: boolean;

  /**
   * Whether the bottom sheet should snap to predefined points
   * @default true
   */
  enableSnapping?: boolean;

  /**
   * Whether the bottom sheet should be draggable
   * @default true
   */
  isDraggable?: boolean;

  /**
   * Snap points as percentage of viewport height
   * @default [30, 60, 90]
   */
  snapPoints?: number[];

  /**
   * Custom styles for the bottom sheet container
   */
  containerStyle?: React.CSSProperties;

  /**
   * Custom styles for the bottom sheet content
   */
  contentStyle?: React.CSSProperties;

  /**
   * Custom styles for the handle/drag indicator
   */
  handleStyle?: React.CSSProperties;

  /**
   * Background color of the overlay
   * @default 'rgba(0, 0, 0, 0.5)'
   */
  backdropColor?: string;

  /**
   * Whether to show the backdrop
   * @default true
   */
  showBackdrop?: boolean;

  /**
   * Whether to hide the bottom sheet when clicking outside
   * @default true
   */
  closeOnClickOutside?: boolean;

  /**
   * Callback when the bottom sheet is closed
   */
  onClose?: () => void;

  /**
   * Callback when the bottom sheet height changes
   */
  onHeightChange?: (height: number) => void;

  /**
   * Callback when the bottom sheet reaches a snap point
   */
  onSnap?: (snapIndex: number) => void;

  /**
   * Callback when the bottom sheet starts being dragged
   */
  onDragStart?: () => void;

  /**
   * Callback when the bottom sheet stops being dragged
   */
  onDragEnd?: () => void;

  /**
   * Whether to show the drag handle indicator
   * @default true
   */
  showHandle?: boolean;

  /**
   * Whether to round the top corners of the bottom sheet
   * @default true
   */
  roundedCorners?: boolean;

  /**
   * Radius for the top rounded corners (if enabled)
   * @default '12px'
   */
  cornerRadius?: string;

  /**
   * Whether the sheet should animate when appearing/disappearing
   * @default true
   */
  animated?: boolean;

  /**
   * Animation duration in milliseconds
   * @default 300
   */
  animationDuration?: number;
}

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
}) => {
  // Convert initial height to numeric value for calculations
  const getInitialHeightValue = () => {
    if (typeof initialHeight === "string") {
      if (initialHeight.endsWith("%")) {
        return (parseFloat(initialHeight) / 100) * window.innerHeight;
      } else if (initialHeight.endsWith("px")) {
        return parseFloat(initialHeight);
      }
    }
    return 0.3 * window.innerHeight; // Default 30% of window height
  };

  // State for the sheet's current height
  const [sheetHeight, setSheetHeight] = useState<number>(
    getInitialHeightValue()
  );

  // State to track if the user is currently dragging
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // State to track if the sheet is visible
  const [visible, setVisible] = useState<boolean>(isVisible);

  // Reference to the bottom sheet element
  const sheetRef = useRef<HTMLDivElement>(null);

  // Track the starting position of the drag
  const dragStartY = useRef<number>(0);
  const dragStartHeight = useRef<number>(0);

  // Update visibility when isVisible prop changes
  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  // Convert string height values to numeric pixel values
  const getPixelValue = (value: string): number => {
    if (value.endsWith("%")) {
      return (parseFloat(value) / 100) * window.innerHeight;
    } else if (value.endsWith("px")) {
      return parseFloat(value);
    }
    return parseFloat(value);
  };

  // Get pixel values for min and max heights
  const minHeightPx = getPixelValue(minHeight);
  const maxHeightPx = getPixelValue(maxHeight);

  // Find the nearest snap point (if snapping is enabled)
  const findNearestSnapPoint = (height: number): number => {
    if (!enableSnapping) return height;

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
  };

  // Handle drag start
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isDraggable) return;

    dragStartY.current = e.touches[0].clientY;
    dragStartHeight.current = sheetHeight;
    setIsDragging(true);

    if (onDragStart) onDragStart();
  };

  // Handle mouse down (for desktop)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDraggable) return;

    dragStartY.current = e.clientY;
    dragStartHeight.current = sheetHeight;
    setIsDragging(true);

    if (onDragStart) onDragStart();

    // Add mouse move and mouse up listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle touch move
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggable || !isDragging) return;

    const touch = e.touches[0];
    const currentY = touch.clientY;
    const deltaY = dragStartY.current - currentY;

    let newHeight = dragStartHeight.current + deltaY;

    // Clamp the height between min and max values
    newHeight = Math.max(minHeightPx, Math.min(maxHeightPx, newHeight));

    setSheetHeight(newHeight);

    if (onHeightChange) onHeightChange(newHeight);
  };

  // Handle mouse move (for desktop)
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggable || !isDragging) return;

    const currentY = e.clientY;
    const deltaY = dragStartY.current - currentY;

    let newHeight = dragStartHeight.current + deltaY;

    // Clamp the height between min and max values
    newHeight = Math.max(minHeightPx, Math.min(maxHeightPx, newHeight));

    setSheetHeight(newHeight);

    if (onHeightChange) onHeightChange(newHeight);
  };

  // Handle touch end
  const handleTouchEnd = () => {
    if (!isDraggable) return;

    setIsDragging(false);

    // Snap to nearest point if enabled
    if (enableSnapping) {
      const snappedHeight = findNearestSnapPoint(sheetHeight);
      setSheetHeight(snappedHeight);

      if (onHeightChange) onHeightChange(snappedHeight);
    }

    if (onDragEnd) onDragEnd();
  };

  // Handle mouse up (for desktop)
  const handleMouseUp = () => {
    if (!isDraggable) return;

    setIsDragging(false);

    // Snap to nearest point if enabled
    if (enableSnapping) {
      const snappedHeight = findNearestSnapPoint(sheetHeight);
      setSheetHeight(snappedHeight);

      if (onHeightChange) onHeightChange(snappedHeight);
    }

    if (onDragEnd) onDragEnd();

    // Remove mouse move and mouse up listeners
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Handle backdrop click
  const handleBackdropClick = () => {
    if (closeOnClickOutside && onClose) {
      onClose();
    }
  };

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
    transition: animated ? `opacity ${animationDuration}ms ease` : "none",
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
    ...contentStyle,
  };

  // If the sheet is not visible, don't render anything
  if (!visible && !showBackdrop) {
    return null;
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div style={backdropStyle} onClick={handleBackdropClick} />

      {/* Bottom sheet */}
      <div
        ref={sheetRef}
        style={bottomSheetStyle}
        className="bottom-sheet-container"
      >
        {/* Drag handle indicator */}
        {showHandle && (
          <div
            style={dragHandleStyle}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            className="bottom-sheet-handle"
          />
        )}

        {/* Content container */}
        <div style={contentContainerStyle} className="bottom-sheet-content">
          {children}
        </div>
      </div>
    </>
  );
};

export default BottomSheet;
