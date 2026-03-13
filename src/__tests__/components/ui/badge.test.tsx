import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  describe("default rendering", () => {
    it("renders with default variant when no variant is specified", () => {
      render(<Badge>New</Badge>);

      const badge = screen.getByText("New");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute("data-slot", "badge");
      expect(badge.className).toContain("bg-[#2BB6C9]/10");
      expect(badge.className).toContain("text-[#2BB6C9]");
    });

    it("renders children text", () => {
      render(<Badge>Estimate Scheduled</Badge>);

      expect(screen.getByText("Estimate Scheduled")).toBeInTheDocument();
    });

    it("renders as a span element", () => {
      render(<Badge>Label</Badge>);

      const badge = screen.getByText("Label");
      expect(badge.tagName).toBe("SPAN");
    });
  });

  describe("variants", () => {
    it("renders default variant with teal color scheme", () => {
      render(<Badge variant="default">Default</Badge>);

      const badge = screen.getByText("Default");
      expect(badge.className).toContain("bg-[#2BB6C9]/10");
      expect(badge.className).toContain("text-[#2BB6C9]");
      expect(badge.className).toContain("border-[#2BB6C9]/20");
    });

    it("renders secondary variant with gray color scheme", () => {
      render(<Badge variant="secondary">Secondary</Badge>);

      const badge = screen.getByText("Secondary");
      expect(badge.className).toContain("bg-[#71797E]/10");
      expect(badge.className).toContain("text-[#71797E]");
      expect(badge.className).toContain("border-[#71797E]/20");
    });

    it("renders destructive variant with red color scheme", () => {
      render(<Badge variant="destructive">Rejected</Badge>);

      const badge = screen.getByText("Rejected");
      expect(badge.className).toContain("bg-red-500/10");
      expect(badge.className).toContain("text-red-600");
      expect(badge.className).toContain("border-red-500/20");
    });

    it("renders outline variant with transparent background", () => {
      render(<Badge variant="outline">Outline</Badge>);

      const badge = screen.getByText("Outline");
      expect(badge.className).toContain("bg-transparent");
      expect(badge.className).toContain("text-[#0A1A2F]");
    });

    it("renders success variant with green color scheme", () => {
      render(<Badge variant="success">Won</Badge>);

      const badge = screen.getByText("Won");
      expect(badge.className).toContain("bg-green-500/10");
      expect(badge.className).toContain("text-green-600");
      expect(badge.className).toContain("border-green-500/20");
    });

    it("renders warning variant with amber color scheme", () => {
      render(<Badge variant="warning">Pending</Badge>);

      const badge = screen.getByText("Pending");
      expect(badge.className).toContain("bg-amber-500/10");
      expect(badge.className).toContain("text-amber-600");
      expect(badge.className).toContain("border-amber-500/20");
    });

    it("renders info variant with blue color scheme", () => {
      render(<Badge variant="info">In Progress</Badge>);

      const badge = screen.getByText("In Progress");
      expect(badge.className).toContain("bg-blue-500/10");
      expect(badge.className).toContain("text-blue-600");
      expect(badge.className).toContain("border-blue-500/20");
    });

    it("renders purple variant with purple color scheme", () => {
      render(<Badge variant="purple">VIP</Badge>);

      const badge = screen.getByText("VIP");
      expect(badge.className).toContain("bg-purple-500/10");
      expect(badge.className).toContain("text-purple-600");
      expect(badge.className).toContain("border-purple-500/20");
    });
  });

  describe("base classes", () => {
    it("includes rounded-full pill shape", () => {
      render(<Badge>Pill Badge</Badge>);

      const badge = screen.getByText("Pill Badge");
      expect(badge.className).toContain("rounded-full");
    });

    it("includes text-xs for small text size", () => {
      render(<Badge>Small Text</Badge>);

      const badge = screen.getByText("Small Text");
      expect(badge.className).toContain("text-xs");
    });

    it("includes inline-flex for inline layout", () => {
      render(<Badge>Inline</Badge>);

      const badge = screen.getByText("Inline");
      expect(badge.className).toContain("inline-flex");
    });
  });

  describe("className merging", () => {
    it("accepts and merges additional className", () => {
      render(<Badge className="custom-badge">Custom</Badge>);

      const badge = screen.getByText("Custom");
      expect(badge.className).toContain("custom-badge");
    });

    it("preserves variant classes alongside custom className", () => {
      render(
        <Badge variant="success" className="ml-2">
          Merged
        </Badge>
      );

      const badge = screen.getByText("Merged");
      expect(badge.className).toContain("text-green-600");
      expect(badge.className).toContain("ml-2");
    });
  });

  describe("lead status badges (real-world usage)", () => {
    it("renders a New lead status badge", () => {
      render(<Badge variant="default">New</Badge>);

      expect(screen.getByText("New")).toBeInTheDocument();
    });

    it("renders a Won status badge with success variant", () => {
      render(<Badge variant="success">Won</Badge>);

      const badge = screen.getByText("Won");
      expect(badge.className).toContain("text-green-600");
    });

    it("renders a Lost status badge with destructive variant", () => {
      render(<Badge variant="destructive">Lost</Badge>);

      const badge = screen.getByText("Lost");
      expect(badge.className).toContain("text-red-600");
    });
  });
});
