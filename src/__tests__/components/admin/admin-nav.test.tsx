import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import * as navigation from "next/navigation";
import { AdminNav } from "@/components/admin/admin-nav";

describe("AdminNav", () => {
  beforeEach(() => {
    // Reset to the default mock value from setup.ts (/admin) before each test
    vi.spyOn(navigation, "usePathname").mockReturnValue("/admin");
  });

  describe("nav item rendering", () => {
    it("renders all 4 navigation items", () => {
      render(<AdminNav />);

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Leads")).toBeInTheDocument();
      expect(screen.getByText("Pipeline")).toBeInTheDocument();
      expect(screen.getByText("Gallery")).toBeInTheDocument();
    });

    it("renders the Dashboard link with href /admin", () => {
      render(<AdminNav />);

      const dashboardLink = screen.getByRole("link", { name: /dashboard/i });
      expect(dashboardLink).toHaveAttribute("href", "/admin");
    });

    it("renders the Leads link with href /admin/leads", () => {
      render(<AdminNav />);

      const leadsLink = screen.getByRole("link", { name: /leads/i });
      expect(leadsLink).toHaveAttribute("href", "/admin/leads");
    });

    it("renders the Pipeline link with href /admin/pipeline", () => {
      render(<AdminNav />);

      const pipelineLink = screen.getByRole("link", { name: /pipeline/i });
      expect(pipelineLink).toHaveAttribute("href", "/admin/pipeline");
    });

    it("renders the Gallery link with href /admin/gallery", () => {
      render(<AdminNav />);

      const galleryLink = screen.getByRole("link", { name: /gallery/i });
      expect(galleryLink).toHaveAttribute("href", "/admin/gallery");
    });

    it("renders exactly 4 links", () => {
      render(<AdminNav />);

      const links = screen.getAllByRole("link");
      expect(links).toHaveLength(4);
    });
  });

  describe("active state styling", () => {
    it("applies active styles to Dashboard link when pathname is /admin", () => {
      vi.spyOn(navigation, "usePathname").mockReturnValue("/admin");
      render(<AdminNav />);

      const dashboardLink = screen.getByRole("link", { name: /dashboard/i });
      expect(dashboardLink.className).toContain("bg-[#2BB6C9]/15");
      expect(dashboardLink.className).toContain("text-[#2BB6C9]");
    });

    it("does not apply active styles to Leads, Pipeline, Gallery when pathname is /admin", () => {
      vi.spyOn(navigation, "usePathname").mockReturnValue("/admin");
      render(<AdminNav />);

      const leadsLink = screen.getByRole("link", { name: /leads/i });
      const pipelineLink = screen.getByRole("link", { name: /pipeline/i });
      const galleryLink = screen.getByRole("link", { name: /gallery/i });

      expect(leadsLink.className).not.toContain("bg-[#2BB6C9]/15");
      expect(pipelineLink.className).not.toContain("bg-[#2BB6C9]/15");
      expect(galleryLink.className).not.toContain("bg-[#2BB6C9]/15");
    });

    it("applies active styles to Leads link when pathname is /admin/leads", () => {
      vi.spyOn(navigation, "usePathname").mockReturnValue("/admin/leads");
      render(<AdminNav />);

      const leadsLink = screen.getByRole("link", { name: /leads/i });
      expect(leadsLink.className).toContain("bg-[#2BB6C9]/15");
      expect(leadsLink.className).toContain("text-[#2BB6C9]");
    });

    it("does not apply active styles to Dashboard when pathname is /admin/leads", () => {
      vi.spyOn(navigation, "usePathname").mockReturnValue("/admin/leads");
      render(<AdminNav />);

      const dashboardLink = screen.getByRole("link", { name: /dashboard/i });
      expect(dashboardLink.className).not.toContain("bg-[#2BB6C9]/15");
    });

    it("applies active styles to Pipeline link when pathname is /admin/pipeline", () => {
      vi.spyOn(navigation, "usePathname").mockReturnValue("/admin/pipeline");
      render(<AdminNav />);

      const pipelineLink = screen.getByRole("link", { name: /pipeline/i });
      expect(pipelineLink.className).toContain("bg-[#2BB6C9]/15");
      expect(pipelineLink.className).toContain("text-[#2BB6C9]");
    });

    it("applies active styles to Gallery link when pathname is /admin/gallery", () => {
      vi.spyOn(navigation, "usePathname").mockReturnValue("/admin/gallery");
      render(<AdminNav />);

      const galleryLink = screen.getByRole("link", { name: /gallery/i });
      expect(galleryLink.className).toContain("bg-[#2BB6C9]/15");
      expect(galleryLink.className).toContain("text-[#2BB6C9]");
    });

    it("applies active styles to Leads link for a nested leads route like /admin/leads/123", () => {
      vi.spyOn(navigation, "usePathname").mockReturnValue("/admin/leads/123");
      render(<AdminNav />);

      const leadsLink = screen.getByRole("link", { name: /leads/i });
      expect(leadsLink.className).toContain("bg-[#2BB6C9]/15");
    });

    it("does not apply active styles to Dashboard link for nested routes", () => {
      // Dashboard uses exact match (pathname === '/admin'), so /admin/leads should NOT activate it
      vi.spyOn(navigation, "usePathname").mockReturnValue("/admin/leads");
      render(<AdminNav />);

      const dashboardLink = screen.getByRole("link", { name: /dashboard/i });
      expect(dashboardLink.className).not.toContain("bg-[#2BB6C9]/15");
    });

    it("applies inactive text color when link is not active", () => {
      vi.spyOn(navigation, "usePathname").mockReturnValue("/admin");
      render(<AdminNav />);

      const leadsLink = screen.getByRole("link", { name: /leads/i });
      expect(leadsLink.className).toContain("text-[#71797E]");
    });
  });

  describe("nav element structure", () => {
    it("renders a nav element as the root", () => {
      const { container } = render(<AdminNav />);

      const nav = container.querySelector("nav");
      expect(nav).toBeInTheDocument();
    });

    it("nav element has flex layout classes", () => {
      const { container } = render(<AdminNav />);

      const nav = container.querySelector("nav");
      expect(nav?.className).toContain("flex");
      expect(nav?.className).toContain("items-center");
    });
  });
});
