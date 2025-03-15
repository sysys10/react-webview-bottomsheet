import React from "react";

/**
 * Props interface for the BottomSheet component
 */
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
   * Whether to close the bottom sheet when pressing the Escape key
   * @default true
   */
  closeOnEscape?: boolean;

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

  /**
   * ID for the bottom sheet component
   * Used for accessibility
   */
  id?: string;

  /**
   * Class name for the bottom sheet container
   */
  className?: string;

  /**
   * Class name for the content container
   */
  contentClassName?: string;

  /**
   * Class name for the handle
   */
  handleClassName?: string;
}

/**
 * Props for the drag handlers hook
 */
export interface DragHandlersProps {
  isDraggable: boolean;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  dragStartY: React.MutableRefObject<number>;
  dragStartHeight: React.MutableRefObject<number>;
  minHeightPx: number;
  maxHeightPx: number;
  sheetHeight: number;
  setSheetHeight: React.Dispatch<React.SetStateAction<number>>;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onHeightChange?: (height: number) => void;
  enableSnapping: boolean;
  findNearestSnapPoint: (height: number) => number;
}

/**
 * Props for accessibility hook
 */
export interface A11yProps {
  id?: string;
  visible: boolean;
}

/**
 * Return type for accessibility props hook
 */
export interface A11yReturnProps {
  role: string;
  "aria-modal": boolean;
  "aria-hidden": boolean;
  id?: string;
  "aria-labelledby"?: string;
}
