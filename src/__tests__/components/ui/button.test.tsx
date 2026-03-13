import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  describe("default rendering", () => {
    it("renders with default variant and size", () => {
      render(<Button>Click Me</Button>);

      const button = screen.getByRole("button", { name: "Click Me" });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("data-slot", "button");
    });

    it("renders children text", () => {
      render(<Button>Submit</Button>);

      expect(screen.getByText("Submit")).toBeInTheDocument();
    });
  });

  describe("variants", () => {
    it("renders default variant with teal background classes", () => {
      render(<Button variant="default">Default</Button>);

      const button = screen.getByRole("button", { name: "Default" });
      expect(button.className).toContain("bg-[#2BB6C9]");
      expect(button.className).toContain("text-white");
    });

    it("renders destructive variant with red classes", () => {
      render(<Button variant="destructive">Delete</Button>);

      const button = screen.getByRole("button", { name: "Delete" });
      expect(button.className).toContain("text-red-600");
    });

    it("renders outline variant with border classes", () => {
      render(<Button variant="outline">Outline</Button>);

      const button = screen.getByRole("button", { name: "Outline" });
      expect(button.className).toContain("bg-white");
    });

    it("renders secondary variant", () => {
      render(<Button variant="secondary">Secondary</Button>);

      const button = screen.getByRole("button", { name: "Secondary" });
      expect(button.className).toContain("text-[#0A1A2F]");
    });

    it("renders ghost variant", () => {
      render(<Button variant="ghost">Ghost</Button>);

      const button = screen.getByRole("button", { name: "Ghost" });
      expect(button.className).toContain("text-[#0A1A2F]");
    });

    it("renders link variant with teal text and underline offset", () => {
      render(<Button variant="link">Link</Button>);

      const button = screen.getByRole("button", { name: "Link" });
      expect(button.className).toContain("text-[#2BB6C9]");
      expect(button.className).toContain("underline-offset-4");
    });
  });

  describe("sizes", () => {
    it("renders default size with h-9 and px-4", () => {
      render(<Button size="default">Default Size</Button>);

      const button = screen.getByRole("button", { name: "Default Size" });
      expect(button.className).toContain("h-9");
      expect(button.className).toContain("px-4");
    });

    it("renders sm size with h-8 and px-3", () => {
      render(<Button size="sm">Small</Button>);

      const button = screen.getByRole("button", { name: "Small" });
      expect(button.className).toContain("h-8");
      expect(button.className).toContain("px-3");
    });

    it("renders lg size with h-10 and px-6", () => {
      render(<Button size="lg">Large</Button>);

      const button = screen.getByRole("button", { name: "Large" });
      expect(button.className).toContain("h-10");
      expect(button.className).toContain("px-6");
    });

    it("renders icon size with size-9 class", () => {
      render(<Button size="icon" aria-label="Icon Button" />);

      const button = screen.getByRole("button", { name: "Icon Button" });
      expect(button.className).toContain("size-9");
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to the underlying button element", () => {
      const ref = createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Ref Button</Button>);

      expect(ref.current).not.toBeNull();
      expect(ref.current?.tagName).toBe("BUTTON");
    });
  });

  describe("className merging", () => {
    it("passes through additional className and merges with variant classes", () => {
      render(<Button className="custom-class">Custom</Button>);

      const button = screen.getByRole("button", { name: "Custom" });
      expect(button.className).toContain("custom-class");
      // Default variant classes are still present
      expect(button.className).toContain("bg-[#2BB6C9]");
    });

    it("tailwind-merge resolves conflicting classes in favor of passed className", () => {
      render(<Button className="bg-red-500">Override</Button>);

      const button = screen.getByRole("button", { name: "Override" });
      // tailwind-merge should keep bg-red-500 and drop bg-[#2BB6C9]
      expect(button.className).toContain("bg-red-500");
      expect(button.className).not.toContain("bg-[#2BB6C9]");
    });
  });

  describe("disabled state", () => {
    it("applies disabled attribute when disabled prop is true", () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole("button", { name: "Disabled" });
      expect(button).toBeDisabled();
    });

    it("applies disabled:opacity-50 and disabled:pointer-events-none classes", () => {
      render(<Button disabled>Disabled</Button>);

      const button = screen.getByRole("button", { name: "Disabled" });
      expect(button.className).toContain("disabled:opacity-50");
      expect(button.className).toContain("disabled:pointer-events-none");
    });
  });

  describe("onClick handler", () => {
    it("calls onClick handler when user clicks the button", async () => {
      const user = userEvent.setup();
      const mockOnClick = vi.fn();
      render(<Button onClick={mockOnClick}>Click Me</Button>);

      await user.click(screen.getByRole("button", { name: "Click Me" }));

      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when button is disabled", async () => {
      const user = userEvent.setup();
      const mockOnClick = vi.fn();
      render(
        <Button onClick={mockOnClick} disabled>
          Disabled
        </Button>
      );

      await user.click(screen.getByRole("button", { name: "Disabled" }));

      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it("passes native button props through to the DOM element", () => {
      render(
        <Button type="submit" aria-label="Submit form">
          Submit
        </Button>
      );

      const button = screen.getByRole("button", { name: "Submit form" });
      expect(button).toHaveAttribute("type", "submit");
    });
  });
});
