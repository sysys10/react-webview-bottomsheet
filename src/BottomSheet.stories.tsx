import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { BottomSheet } from "./BottomSheet";

export default {
  title: "Components/BottomSheet",
  component: BottomSheet,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    initialHeight: { control: "text" },
    maxHeight: { control: "text" },
    minHeight: { control: "text" },
    isVisible: { control: "boolean" },
    enableSnapping: { control: "boolean" },
    isDraggable: { control: "boolean" },
    snapPoints: { control: "array" },
    backdropColor: { control: "color" },
    showBackdrop: { control: "boolean" },
    closeOnClickOutside: { control: "boolean" },
    closeOnEscape: { control: "boolean" },
    showHandle: { control: "boolean" },
    roundedCorners: { control: "boolean" },
    cornerRadius: { control: "text" },
    animated: { control: "boolean" },
    animationDuration: { control: "number" },
  },
} as ComponentMeta<typeof BottomSheet>;

const Template: ComponentStory<typeof BottomSheet> = (args) => {
  const [isVisible, setIsVisible] = useState(args.isVisible);

  return (
    <div style={{ height: "100vh", position: "relative" }}>
      <div style={{ padding: "20px" }}>
        <button onClick={() => setIsVisible(true)}>Open Bottom Sheet</button>
      </div>

      <BottomSheet
        {...args}
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
      >
        <div style={{ padding: "10px" }}>
          <h2 id={args.id ? `${args.id}-title` : undefined}>
            Bottom Sheet Content
          </h2>
          <p>This is the content of the bottom sheet component.</p>
          <p>
            You can drag this sheet up and down using the handle at the top.
          </p>
          <button onClick={() => setIsVisible(false)}>Close</button>

          <div style={{ marginTop: "20px" }}>
            <h3>Features</h3>
            <ul>
              <li>Draggable with touch and mouse support</li>
              <li>Snap points</li>
              <li>Customizable appearance</li>
              <li>Fully accessible</li>
            </ul>
          </div>

          <div
            style={{ marginTop: "20px", height: "400px", overflowY: "auto" }}
          >
            <h3>Scroll Test</h3>
            {Array.from({ length: 20 }).map((_, i) => (
              <p key={i}>Scroll content line {i + 1}</p>
            ))}
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  isVisible: false,
  initialHeight: "30%",
  maxHeight: "90%",
  minHeight: "10%",
  enableSnapping: true,
  isDraggable: true,
  snapPoints: [30, 60, 90],
  backdropColor: "rgba(0, 0, 0, 0.5)",
  showBackdrop: true,
  closeOnClickOutside: true,
  closeOnEscape: true,
  showHandle: true,
  roundedCorners: true,
  cornerRadius: "12px",
  animated: true,
  animationDuration: 300,
  id: "demo-bottom-sheet",
};

export const NonDraggable = Template.bind({});
NonDraggable.args = {
  ...Default.args,
  isDraggable: false,
  initialHeight: "50%",
};

export const CustomStyling = Template.bind({});
CustomStyling.args = {
  ...Default.args,
  containerStyle: {
    backgroundColor: "#f8f9fa",
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
  },
  handleStyle: {
    backgroundColor: "#6c757d",
    width: "60px",
    height: "6px",
  },
  contentStyle: {
    padding: "20px",
    backgroundColor: "#f8f9fa",
  },
  backdropColor: "rgba(33, 37, 41, 0.6)",
};

export const NoSnapping = Template.bind({});
NoSnapping.args = {
  ...Default.args,
  enableSnapping: false,
};

export const NoBackdrop = Template.bind({});
NoBackdrop.args = {
  ...Default.args,
  showBackdrop: false,
};

export const FixedHeight = Template.bind({});
FixedHeight.args = {
  ...Default.args,
  initialHeight: "300px",
  maxHeight: "500px",
  minHeight: "200px",
};
