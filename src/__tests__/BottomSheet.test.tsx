import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BottomSheet } from "../BottomSheet";

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe("BottomSheet", () => {
  it("renders children correctly", () => {
    render(
      <BottomSheet>
        <div data-testid="content">Bottom Sheet Content</div>
      </BottomSheet>
    );

    expect(screen.getByTestId("content")).toHaveTextContent(
      "Bottom Sheet Content"
    );
  });

  it("hides when isVisible is false", () => {
    const { container } = render(
      <BottomSheet isVisible={false}>
        <div>Content</div>
      </BottomSheet>
    );

    // Check that the bottom sheet is hidden
    const bottomSheet = container.querySelector(".bottom-sheet-container");
    expect(bottomSheet).toHaveStyle("transform: translateY(100%)");
  });

  it("shows drag handle when showHandle is true", () => {
    const { container } = render(
      <BottomSheet showHandle={true}>
        <div>Content</div>
      </BottomSheet>
    );

    const handle = container.querySelector(".bottom-sheet-handle");
    expect(handle).toBeInTheDocument();
  });

  it("hides drag handle when showHandle is false", () => {
    const { container } = render(
      <BottomSheet showHandle={false}>
        <div>Content</div>
      </BottomSheet>
    );

    const handle = container.querySelector(".bottom-sheet-handle");
    expect(handle).not.toBeInTheDocument();
  });

  it("calls onClose when clicking outside and closeOnClickOutside is true", () => {
    const onCloseMock = jest.fn();
    const { container } = render(
      <BottomSheet onClose={onCloseMock} closeOnClickOutside={true}>
        <div>Content</div>
      </BottomSheet>
    );

    // Simulate a click on the backdrop
    const backdrop = container.querySelector('div[aria-hidden="true"]');
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when clicking outside and closeOnClickOutside is false", () => {
    const onCloseMock = jest.fn();
    const { container } = render(
      <BottomSheet onClose={onCloseMock} closeOnClickOutside={false}>
        <div>Content</div>
      </BottomSheet>
    );

    // Simulate a click on the backdrop
    const backdrop = container.querySelector('div[aria-hidden="true"]');
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it("applies custom styles properly", () => {
    const customContainerStyle = { backgroundColor: "red" };
    const customContentStyle = { padding: "20px" };
    const customHandleStyle = { backgroundColor: "blue" };

    const { container } = render(
      <BottomSheet
        containerStyle={customContainerStyle}
        contentStyle={customContentStyle}
        handleStyle={customHandleStyle}
      >
        <div>Content</div>
      </BottomSheet>
    );

    const bottomSheet = container.querySelector(".bottom-sheet-container");
    const content = container.querySelector(".bottom-sheet-content");
    const handle = container.querySelector(".bottom-sheet-handle");

    expect(bottomSheet).toHaveStyle("background-color: red");
    expect(content).toHaveStyle("padding: 20px");
    expect(handle).toHaveStyle("background-color: blue");
  });

  it("adds accessibility attributes correctly", () => {
    const { container } = render(
      <BottomSheet id="test-sheet">
        <div>Content</div>
      </BottomSheet>
    );

    const bottomSheet = container.querySelector("#test-sheet");
    expect(bottomSheet).toHaveAttribute("role", "dialog");
    expect(bottomSheet).toHaveAttribute("aria-modal", "true");
    expect(bottomSheet).toHaveAttribute("aria-hidden", "false");
    expect(bottomSheet).toHaveAttribute("aria-labelledby", "test-sheet-title");
  });

  it("calls onClose when pressing Escape and closeOnEscape is true", () => {
    const onCloseMock = jest.fn();
    render(
      <BottomSheet onClose={onCloseMock} closeOnEscape={true}>
        <div>Content</div>
      </BottomSheet>
    );

    // Simulate pressing the Escape key
    fireEvent.keyDown(document, { key: "Escape" });

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when pressing Escape and closeOnEscape is false", () => {
    const onCloseMock = jest.fn();
    render(
      <BottomSheet onClose={onCloseMock} closeOnEscape={false}>
        <div>Content</div>
      </BottomSheet>
    );

    // Simulate pressing the Escape key
    fireEvent.keyDown(document, { key: "Escape" });

    expect(onCloseMock).not.toHaveBeenCalled();
  });
});
