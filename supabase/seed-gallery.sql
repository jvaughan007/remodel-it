-- Seed gallery_projects with the 9 default showcase projects.
-- Run this once in Supabase SQL Editor to populate the gallery.

INSERT INTO gallery_projects
  (title, description, service_type, location, before_image_url, after_image_url, additional_images, featured, display_order, published)
VALUES
  (
    'Modern Kitchen Transformation',
    'Complete kitchen renovation featuring custom white oak cabinets, quartz waterfall island, and premium stainless steel appliances.',
    'kitchen-remodeling',
    'Plano, TX',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=600&h=400&fit=crop',
    '{}',
    true,
    1,
    true
  ),
  (
    'Luxury Master Bathroom Retreat',
    'Spa-like master bathroom with freestanding tub, walk-in shower with dual heads, and heated floors.',
    'bathroom-renovation',
    'Frisco, TX',
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&h=400&fit=crop',
    '{}',
    true,
    2,
    true
  ),
  (
    'Whole Home Renovation',
    'Complete home transformation including open floor plan, updated electrical, new flooring throughout, and modern fixtures.',
    'whole-home-remodel',
    'Southlake, TX',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop',
    '{}',
    true,
    3,
    true
  ),
  (
    'Outdoor Living Paradise',
    'Backyard transformation with covered patio, outdoor kitchen, fire pit area, and professional landscaping.',
    'outdoor-living',
    'Allen, TX',
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1769503236428-7773271074cf?w=600&h=400&fit=crop',
    '{}',
    false,
    4,
    true
  ),
  (
    'Two-Story Home Addition',
    'Added 800 sq ft with new master suite upstairs and expanded living room downstairs.',
    'home-additions',
    'McKinney, TX',
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=400&fit=crop',
    '{}',
    false,
    5,
    true
  ),
  (
    'Contemporary Kitchen Remodel',
    'Sleek contemporary kitchen with handle-less cabinets, integrated appliances, and statement lighting.',
    'kitchen-remodeling',
    'Richardson, TX',
    'https://images.unsplash.com/photo-1754212536450-1b3591a3b837?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1704731529088-19083feb5b43?w=600&h=400&fit=crop',
    '{}',
    false,
    6,
    true
  ),
  (
    'Guest Bathroom Makeover',
    'Compact bathroom renovation maximizing space with clever storage solutions and modern finishes.',
    'bathroom-renovation',
    'Carrollton, TX',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=600&h=400&fit=crop',
    '{}',
    false,
    7,
    true
  ),
  (
    'Victorian Home Restoration',
    'Historic home renovation preserving original character while adding modern conveniences throughout.',
    'whole-home-remodel',
    'Dallas, TX',
    'https://images.unsplash.com/photo-1757992141434-983a12b82da3?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551279816-a650ca6fb15b?w=600&h=400&fit=crop',
    '{}',
    false,
    8,
    true
  ),
  (
    'Backyard Pool House Addition',
    'Custom pool house with full bathroom, kitchenette, and entertaining area for year-round enjoyment.',
    'home-additions',
    'Coppell, TX',
    'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1766603636617-0c71c2188160?w=600&h=400&fit=crop',
    '{}',
    false,
    9,
    true
  );
