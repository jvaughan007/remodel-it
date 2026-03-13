import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  describe("basic class merging", () => {
    it("returns a single class string unchanged", () => {
      expect(cn("text-red-500")).toBe("text-red-500");
    });

    it("merges two class strings with a space", () => {
      expect(cn("text-red-500", "bg-blue-200")).toBe("text-red-500 bg-blue-200");
    });

    it("merges multiple class strings", () => {
      const result = cn("px-4", "py-2", "rounded-lg");
      expect(result).toBe("px-4 py-2 rounded-lg");
    });

    it("returns empty string when called with no arguments", () => {
      expect(cn()).toBe("");
    });

    it("handles undefined values without throwing", () => {
      expect(cn("px-4", undefined)).toBe("px-4");
    });

    it("handles null values without throwing", () => {
      expect(cn("px-4", null)).toBe("px-4");
    });

    it("handles false values without throwing (clsx behavior)", () => {
      expect(cn("px-4", false)).toBe("px-4");
    });
  });

  describe("clsx conditional class behavior", () => {
    it("includes class when condition is true", () => {
      const isActive = true;
      expect(cn("base-class", isActive && "active-class")).toBe(
        "base-class active-class"
      );
    });

    it("excludes class when condition is false", () => {
      const isActive = false;
      expect(cn("base-class", isActive && "active-class")).toBe("base-class");
    });

    it("handles object syntax: includes keys with truthy values", () => {
      expect(cn({ "text-red-500": true, "text-blue-500": false })).toBe(
        "text-red-500"
      );
    });

    it("handles object syntax: excludes keys with falsy values", () => {
      expect(cn({ "font-bold": false, "font-normal": true })).toBe(
        "font-normal"
      );
    });

    it("handles array syntax", () => {
      expect(cn(["px-4", "py-2"])).toBe("px-4 py-2");
    });

    it("handles nested arrays (clsx behavior)", () => {
      expect(cn(["px-4", ["py-2", "rounded"]])).toBe("px-4 py-2 rounded");
    });

    it("combines string and object syntax", () => {
      const isError = true;
      const result = cn("border", { "border-red-500": isError, "border-gray-300": !isError });
      expect(result).toBe("border border-red-500");
    });
  });

  describe("tailwind-merge conflict resolution", () => {
    it("resolves conflicting padding classes in favor of the last one", () => {
      // tailwind-merge keeps the last padding utility when there is a conflict
      expect(cn("px-4", "px-6")).toBe("px-6");
    });

    it("resolves conflicting text color classes in favor of the last one", () => {
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });

    it("resolves conflicting background color classes in favor of the last one", () => {
      expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    });

    it("resolves conflicting font weight classes", () => {
      expect(cn("font-bold", "font-normal")).toBe("font-normal");
    });

    it("resolves conflicting margin classes", () => {
      expect(cn("m-4", "m-6")).toBe("m-6");
    });

    it("keeps non-conflicting classes from both arguments", () => {
      const result = cn("px-4 text-red-500", "py-2 text-blue-500");
      expect(result).toContain("px-4");
      expect(result).toContain("py-2");
      expect(result).toContain("text-blue-500");
      expect(result).not.toContain("text-red-500");
    });

    it("resolves conflict when overriding default variant class (typical button usage)", () => {
      // Simulates overriding a component's default bg with a custom one
      const result = cn("bg-[#2BB6C9]", "bg-red-500");
      expect(result).toBe("bg-red-500");
      expect(result).not.toContain("bg-[#2BB6C9]");
    });

    it("handles width and height conflicts", () => {
      expect(cn("w-4 h-4", "w-6")).toBe("h-4 w-6");
    });

    it("does not deduplicate identical non-conflicting classes", () => {
      // tailwind-merge deduplicates same utility class
      const result = cn("px-4", "px-4");
      expect(result).toBe("px-4");
    });
  });

  describe("real-world component usage patterns", () => {
    it("merges base component classes with conditional classes", () => {
      const isActive = true;
      const result = cn(
        "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm",
        isActive
          ? "bg-[#2BB6C9]/15 text-[#2BB6C9]"
          : "text-[#71797E] hover:text-white"
      );
      expect(result).toContain("bg-[#2BB6C9]/15");
      expect(result).toContain("text-[#2BB6C9]");
      expect(result).not.toContain("text-[#71797E]");
    });

    it("merges card base classes with custom className prop", () => {
      const result = cn(
        "flex flex-col gap-4 rounded-xl border bg-white",
        "mt-4 w-full"
      );
      expect(result).toContain("flex");
      expect(result).toContain("mt-4");
      expect(result).toContain("w-full");
    });
  });
});
