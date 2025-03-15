# React Webview BottomSheet

A lightweight, customizable, draggable bottom sheet component for React applications, optimized for webviews in mobile applications.

## Features

- 📱 Optimized for mobile and webview experiences
- 🔄 Smooth drag gestures with touch support
- ⚡ Snap points functionality
- 🎨 Highly customizable appearance and behavior
- 🌈 Responsive design with percentage and pixel-based sizing
- 📝 Written in TypeScript with complete type definitions
- 🔧 Zero dependencies (other than React)

## Installation

```bash
npm install react-webview-bottomsheet
# or
yarn add react-webview-bottomsheet
```

## Usage

```jsx
import React, { useState } from "react";
import { BottomSheet } from "react-webview-bottomsheet";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Bottom Sheet</button>

      <BottomSheet
        isVisible={isOpen}
        onClose={() => setIsOpen(false)}
        initialHeight="30%"
        maxHeight="90%"
        enableSnapping={true}
        snapPoints={[20, 50, 90]}
      >
        <div>
          <h2>Bottom Sheet Content</h2>
          <p>This is the content of your bottom sheet</p>
        </div>
      </BottomSheet>
    </div>
  );
};

export default App;
```

## Props

| Prop                  | Type                        | Default              | Description                                                  |
| --------------------- | --------------------------- | -------------------- | ------------------------------------------------------------ |
| `children`            | ReactNode                   | (required)           | Content to render inside the bottom sheet                    |
| `initialHeight`       | string                      | '30%'                | Initial height of the bottom sheet (when not expanded)       |
| `maxHeight`           | string                      | '90%'                | Maximum height the bottom sheet can expand to                |
| `minHeight`           | string                      | '10%'                | Minimum height the bottom sheet can shrink to                |
| `isVisible`           | boolean                     | true                 | Whether the bottom sheet is initially visible                |
| `enableSnapping`      | boolean                     | true                 | Whether the bottom sheet should snap to predefined points    |
| `isDraggable`         | boolean                     | true                 | Whether the bottom sheet should be draggable                 |
| `snapPoints`          | number[]                    | [30, 60, 90]         | Snap points as percentage of viewport height                 |
| `containerStyle`      | CSSProperties               | {}                   | Custom styles for the bottom sheet container                 |
| `contentStyle`        | CSSProperties               | {}                   | Custom styles for the bottom sheet content                   |
| `handleStyle`         | CSSProperties               | {}                   | Custom styles for the handle/drag indicator                  |
| `backdropColor`       | string                      | 'rgba(0, 0, 0, 0.5)' | Background color of the overlay                              |
| `showBackdrop`        | boolean                     | true                 | Whether to show the backdrop                                 |
| `closeOnClickOutside` | boolean                     | true                 | Whether to hide the bottom sheet when clicking outside       |
| `onClose`             | () => void                  | undefined            | Callback when the bottom sheet is closed                     |
| `onHeightChange`      | (height: number) => void    | undefined            | Callback when the bottom sheet height changes                |
| `onSnap`              | (snapIndex: number) => void | undefined            | Callback when the bottom sheet reaches a snap point          |
| `onDragStart`         | () => void                  | undefined            | Callback when the bottom sheet starts being dragged          |
| `onDragEnd`           | () => void                  | undefined            | Callback when the bottom sheet stops being dragged           |
| `showHandle`          | boolean                     | true                 | Whether to show the drag handle indicator                    |
| `roundedCorners`      | boolean                     | true                 | Whether to round the top corners of the bottom sheet         |
| `cornerRadius`        | string                      | '12px'               | Radius for the top rounded corners (if enabled)              |
| `animated`            | boolean                     | true                 | Whether the sheet should animate when appearing/disappearing |
| `animationDuration`   | number                      | 300                  | Animation duration in milliseconds                           |

## Advanced Examples

### Custom Snap Points with Callbacks

```jsx
import React, { useState } from "react";
import { BottomSheet } from "react-webview-bottomsheet";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSnapPoint, setCurrentSnapPoint] = useState(0);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Bottom Sheet</button>

      <BottomSheet
        isVisible={isOpen}
        onClose={() => setIsOpen(false)}
        enableSnapping={true}
        snapPoints={[20, 50, 80]}
        onSnap={(snapIndex) => {
          setCurrentSnapPoint(snapIndex);
          console.log(`Snapped to index ${snapIndex}`);
        }}
      >
        <div>
          <h2>Bottom Sheet Content</h2>
          <p>Current snap point: {currentSnapPoint}</p>
          <button onClick={() => setIsOpen(false)}>Close</button>
        </div>
      </BottomSheet>
    </div>
  );
};
```

### Custom Styling

```jsx
import React, { useState } from "react";
import { BottomSheet } from "react-webview-bottomsheet";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Bottom Sheet</button>

      <BottomSheet
        isVisible={isOpen}
        onClose={() => setIsOpen(false)}
        containerStyle={{
          backgroundColor: "#f8f9fa",
          borderTopLeftRadius: "20px",
          borderTopRightRadius: "20px",
        }}
        handleStyle={{
          backgroundColor: "#e9ecef",
          width: "60px",
          height: "6px",
        }}
        contentStyle={{
          padding: "20px",
        }}
        backdropColor="rgba(33, 37, 41, 0.6)"
      >
        <div>
          <h2>Custom Styled Bottom Sheet</h2>
          <p>This bottom sheet has custom styling applied</p>
        </div>
      </BottomSheet>
    </div>
  );
};
```

## Browser Support

The component is designed to work on all modern browsers that support touch events, including:

- Chrome (Desktop & Mobile)
- Safari (Desktop & Mobile)
- Firefox (Desktop & Mobile)
- Edge

## Optimizations for Mobile WebViews

This component is specifically optimized for use in mobile webviews:

- Smooth touch interactions with proper touch event handling
- Performance optimizations to reduce jank during dragging
- Proper handling of viewport heights for mobile screens
- Appropriate defaults for mobile UX patterns

## License

MIT © [신윤수](https://github.com/sysys10)
