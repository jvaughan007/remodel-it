import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card Content</Card>);

    expect(screen.getByText("Card Content")).toBeInTheDocument();
  });

  it("accepts and applies className", () => {
    render(<Card className="custom-card">Content</Card>);

    const card = screen.getByText("Content").closest("[data-slot='card']");
    expect(card).toHaveClass("custom-card");
  });

  it("renders with data-slot attribute of card", () => {
    render(<Card>Content</Card>);

    const card = screen.getByText("Content").closest("[data-slot='card']");
    expect(card).toBeInTheDocument();
  });

  it("includes base structural classes", () => {
    render(<Card>Content</Card>);

    const card = screen.getByText("Content").closest("[data-slot='card']");
    expect(card?.className).toContain("rounded-xl");
    expect(card?.className).toContain("bg-white");
  });
});

describe("CardHeader", () => {
  it("renders children", () => {
    render(<CardHeader>Header Content</CardHeader>);

    expect(screen.getByText("Header Content")).toBeInTheDocument();
  });

  it("accepts and applies className", () => {
    render(<CardHeader className="header-custom">Header</CardHeader>);

    const header = screen
      .getByText("Header")
      .closest("[data-slot='card-header']");
    expect(header).toHaveClass("header-custom");
  });

  it("renders with data-slot attribute of card-header", () => {
    render(<CardHeader>Header</CardHeader>);

    const header = screen
      .getByText("Header")
      .closest("[data-slot='card-header']");
    expect(header).toBeInTheDocument();
  });
});

describe("CardTitle", () => {
  it("renders children", () => {
    render(<CardTitle>My Card Title</CardTitle>);

    expect(screen.getByText("My Card Title")).toBeInTheDocument();
  });

  it("accepts and applies className", () => {
    render(<CardTitle className="title-custom">Title</CardTitle>);

    const title = screen
      .getByText("Title")
      .closest("[data-slot='card-title']");
    expect(title).toHaveClass("title-custom");
  });

  it("renders with data-slot attribute of card-title", () => {
    render(<CardTitle>Title</CardTitle>);

    const title = screen
      .getByText("Title")
      .closest("[data-slot='card-title']");
    expect(title).toBeInTheDocument();
  });
});

describe("CardDescription", () => {
  it("renders children", () => {
    render(<CardDescription>Some description text</CardDescription>);

    expect(screen.getByText("Some description text")).toBeInTheDocument();
  });

  it("accepts and applies className", () => {
    render(
      <CardDescription className="desc-custom">Description</CardDescription>
    );

    const desc = screen
      .getByText("Description")
      .closest("[data-slot='card-description']");
    expect(desc).toHaveClass("desc-custom");
  });

  it("applies muted text color class by default", () => {
    render(<CardDescription>Description</CardDescription>);

    const desc = screen
      .getByText("Description")
      .closest("[data-slot='card-description']");
    expect(desc?.className).toContain("text-[#71797E]");
  });
});

describe("CardContent", () => {
  it("renders children", () => {
    render(<CardContent>Main content area</CardContent>);

    expect(screen.getByText("Main content area")).toBeInTheDocument();
  });

  it("accepts and applies className", () => {
    render(<CardContent className="content-custom">Content</CardContent>);

    const content = screen
      .getByText("Content")
      .closest("[data-slot='card-content']");
    expect(content).toHaveClass("content-custom");
  });

  it("renders with data-slot attribute of card-content", () => {
    render(<CardContent>Content</CardContent>);

    const content = screen
      .getByText("Content")
      .closest("[data-slot='card-content']");
    expect(content).toBeInTheDocument();
  });
});

describe("CardFooter", () => {
  it("renders children", () => {
    render(<CardFooter>Footer actions</CardFooter>);

    expect(screen.getByText("Footer actions")).toBeInTheDocument();
  });

  it("accepts and applies className", () => {
    render(<CardFooter className="footer-custom">Footer</CardFooter>);

    const footer = screen
      .getByText("Footer")
      .closest("[data-slot='card-footer']");
    expect(footer).toHaveClass("footer-custom");
  });

  it("renders with data-slot attribute of card-footer", () => {
    render(<CardFooter>Footer</CardFooter>);

    const footer = screen
      .getByText("Footer")
      .closest("[data-slot='card-footer']");
    expect(footer).toBeInTheDocument();
  });

  it("includes border-t class for visual separator", () => {
    render(<CardFooter>Footer</CardFooter>);

    const footer = screen
      .getByText("Footer")
      .closest("[data-slot='card-footer']");
    expect(footer?.className).toContain("border-t");
  });
});

describe("Card composition", () => {
  it("renders all sub-components together as a composed card", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Project Estimate</CardTitle>
          <CardDescription>Kitchen remodel quote</CardDescription>
        </CardHeader>
        <CardContent>Detailed line items here</CardContent>
        <CardFooter>Total: $85,000</CardFooter>
      </Card>
    );

    expect(screen.getByText("Project Estimate")).toBeInTheDocument();
    expect(screen.getByText("Kitchen remodel quote")).toBeInTheDocument();
    expect(screen.getByText("Detailed line items here")).toBeInTheDocument();
    expect(screen.getByText("Total: $85,000")).toBeInTheDocument();
  });
});
