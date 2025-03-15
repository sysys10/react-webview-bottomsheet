import { useCallback } from "react";
import type { DragHandlersProps } from "../types";

/**
 * Hook to manage drag events for the bottom sheet
 *
 * @param props - Drag handlers props
 * @returns An object containing drag event handlers
 */
export const useDragHandlers = ({
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
}: DragHandlersProps) => {
  // Handle drag start for touch events
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!isDraggable) return;

      dragStartY.current = e.touches[0].clientY;
      dragStartHeight.current = sheetHeight;
      setIsDragging(true);

      if (onDragStart) onDragStart();
    },
    [
      isDraggable,
      sheetHeight,
      onDragStart,
      setIsDragging,
      dragStartY,
      dragStartHeight,
    ]
  );

  // Handle drag movement for touch events
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDraggable || !isDragging) return;

      // Prevent default to avoid page scrolling while dragging
      e.preventDefault();

      const touch = e.touches[0];
      const currentY = touch.clientY;
      const deltaY = dragStartY.current - currentY;

      let newHeight = dragStartHeight.current + deltaY;

      // Clamp the height between min and max values
      newHeight = Math.max(minHeightPx, Math.min(maxHeightPx, newHeight));

      setSheetHeight(newHeight);

      if (onHeightChange) onHeightChange(newHeight);
    },
    [
      isDraggable,
      isDragging,
      dragStartY,
      dragStartHeight,
      minHeightPx,
      maxHeightPx,
      setSheetHeight,
      onHeightChange,
    ]
  );

  // Handle drag end for touch events
  const handleTouchEnd = useCallback(() => {
    if (!isDraggable) return;

    setIsDragging(false);

    // Snap to nearest point if enabled
    if (enableSnapping) {
      const snappedHeight = findNearestSnapPoint(sheetHeight);
      setSheetHeight(snappedHeight);

      if (onHeightChange) onHeightChange(snappedHeight);
    }

    if (onDragEnd) onDragEnd();
  }, [
    isDraggable,
    enableSnapping,
    findNearestSnapPoint,
    sheetHeight,
    setSheetHeight,
    onHeightChange,
    onDragEnd,
    setIsDragging,
  ]);

  // Handle drag start for mouse events
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isDraggable) return;

      dragStartY.current = e.clientY;
      dragStartHeight.current = sheetHeight;
      setIsDragging(true);

      if (onDragStart) onDragStart();

      // Add mouse move and mouse up listeners
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [
      isDraggable,
      sheetHeight,
      onDragStart,
      setIsDragging,
      dragStartY,
      dragStartHeight,
    ]
  );

  // Handle drag movement for mouse events
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggable || !isDragging) return;

      // Prevent default to avoid unwanted selections
      e.preventDefault();

      const currentY = e.clientY;
      const deltaY = dragStartY.current - currentY;

      let newHeight = dragStartHeight.current + deltaY;

      // Clamp the height between min and max values
      newHeight = Math.max(minHeightPx, Math.min(maxHeightPx, newHeight));

      setSheetHeight(newHeight);

      if (onHeightChange) onHeightChange(newHeight);
    },
    [
      isDraggable,
      isDragging,
      dragStartY,
      dragStartHeight,
      minHeightPx,
      maxHeightPx,
      setSheetHeight,
      onHeightChange,
    ]
  );

  // Handle drag end for mouse events
  const handleMouseUp = useCallback(() => {
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
  }, [
    isDraggable,
    enableSnapping,
    findNearestSnapPoint,
    sheetHeight,
    setSheetHeight,
    onHeightChange,
    onDragEnd,
    setIsDragging,
  ]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
