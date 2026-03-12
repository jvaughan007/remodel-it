export const SITE = {
  name: "Trinity Remodeling",
  url: "https://trinityremodelingdfw.com",
  title: "Trinity Remodeling | Premier Home Remodeling in Dallas/Fort Worth",
  description: "Dallas/Fort Worth's trusted home remodeling professional. Kitchen remodels, bathroom renovations, whole home remodeling, and more.",
  author: "Nick Stephens",
  email: "hello@trinityremodelingdfw.com",
  phone: "(972) 555-TRIN",
  address: {
    street: "123 Trinity Drive",
    city: "Dallas",
    state: "TX",
    zip: "75201",
    country: "US",
  },
  social: {
    facebook: "#",
    instagram: "#",
    linkedin: "#",
  },
};

export const SERVICES = [
  {
    slug: "kitchen-remodeling",
    title: "Kitchen Remodeling",
    shortTitle: "Kitchen",
    description: "Transform your kitchen into the heart of your home with custom designs and premium finishes.",
    icon: "ChefHat",
  },
  {
    slug: "bathroom-renovation",
    title: "Bathroom Renovation",
    shortTitle: "Bathroom",
    description: "Create your personal spa retreat with luxury fixtures and thoughtful design.",
    icon: "Bath",
  },
  {
    slug: "whole-home-remodel",
    title: "Whole Home Remodel",
    shortTitle: "Whole Home",
    description: "Reimagine your entire living space with comprehensive renovation solutions.",
    icon: "Home",
  },
  {
    slug: "home-additions",
    title: "Home Additions",
    shortTitle: "Additions",
    description: "Expand your living space with seamlessly integrated home additions.",
    icon: "PlusSquare",
  },
  {
    slug: "outdoor-living",
    title: "Outdoor Living",
    shortTitle: "Outdoor",
    description: "Create beautiful outdoor spaces for entertaining and relaxation.",
    icon: "Trees",
  },
  {
    slug: "flooring-installation",
    title: "Flooring Installation",
    shortTitle: "Flooring",
    description: "Premium flooring installation with expert craftsmanship and quality materials.",
    icon: "Layers",
  },
];

export const LEAD_SOURCES = [
  { value: "website_contact", label: "Website Contact Form" },
  { value: "website_quote", label: "Website Quote Form" },
  { value: "google", label: "Google Search" },
  { value: "google_maps", label: "Google Maps" },
  { value: "yelp", label: "Yelp" },
  { value: "nextdoor", label: "Nextdoor" },
  { value: "referral", label: "Referral" },
  { value: "repeat_customer", label: "Repeat Customer" },
  { value: "yard_sign", label: "Yard Sign" },
  { value: "manual", label: "Manually Added" },
];

export const LEAD_STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "estimate_scheduled", label: "Estimate Scheduled" },
  { value: "estimate_done", label: "Estimate Done" },
  { value: "proposal_sent", label: "Proposal Sent" },
  { value: "negotiating", label: "Negotiating" },
  { value: "won", label: "Won" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "lost", label: "Lost" },
  { value: "unresponsive", label: "Unresponsive" },
];

export const NAP = {
  name: SITE.name,
  address: `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.state} ${SITE.address.zip}`,
  phone: SITE.phone,
};
