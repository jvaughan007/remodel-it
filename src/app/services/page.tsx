'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export default function Services() {
  const [activeService, setActiveService] = useState(0);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const services = [
    {
      title: "Kitchen Remodeling",
      slug: "kitchen-remodeling",
      shortDesc: "Transform your kitchen into the heart of your home",
      fullDesc: "Our kitchen remodeling services combine functionality with style to create the perfect space for cooking, entertaining, and family gatherings. From modern minimalist designs to traditional farmhouse aesthetics, we bring your vision to life.",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
      features: [
        "Custom cabinet design & installation",
        "Premium countertop materials",
        "Modern appliance integration",
        "Lighting & electrical upgrades",
        "Backsplash & flooring",
        "Kitchen island & storage solutions"
      ],
      priceRange: "$25,000 - $80,000",
      timeline: "3-8 weeks",
      icon: "🏠"
    },
    {
      title: "Bathroom Renovation",
      slug: "bathroom-renovation",
      shortDesc: "Create your personal spa retreat",
      fullDesc: "Transform your bathroom into a luxurious retreat with our comprehensive renovation services. Whether you want a spa-like master suite or a functional family bathroom, we deliver exceptional results.",
      image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop",
      features: [
        "Custom tile work & design",
        "Modern fixtures & vanities",
        "Walk-in showers & soaking tubs",
        "Heated floors & towel warmers",
        "Improved ventilation & lighting",
        "Storage optimization"
      ],
      priceRange: "$15,000 - $50,000",
      timeline: "2-5 weeks",
      icon: "🛁"
    },
    {
      title: "Whole Home Remodeling",
      slug: "whole-home-remodeling",
      shortDesc: "Complete home transformation",
      fullDesc: "Reimagine your entire living space with our comprehensive whole home remodeling services. We handle everything from architectural changes to interior design, creating a cohesive and stunning transformation.",
      image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
      features: [
        "Architectural planning & permits",
        "Structural modifications",
        "Complete interior renovation",
        "HVAC & electrical updates",
        "New flooring throughout",
        "Project management & coordination"
      ],
      priceRange: "$100,000 - $300,000",
      timeline: "3-6 months",
      icon: "🏡"
    },
    {
      title: "Home Additions",
      slug: "home-additions",
      shortDesc: "Expand your living space",
      fullDesc: "Add square footage and functionality to your home with our expertly designed and built additions. From extra bedrooms to expanded living areas, we seamlessly integrate new spaces with your existing home.",
      image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      features: [
        "Room additions & extensions",
        "Second story additions",
        "Garage conversions",
        "Sunrooms & enclosed patios",
        "In-law suites",
        "Structural engineering"
      ],
      priceRange: "$50,000 - $150,000",
      timeline: "2-4 months",
      icon: "🏗️"
    },
    {
      title: "Outdoor Living Spaces",
      slug: "outdoor-living",
      shortDesc: "Extend your home outdoors",
      fullDesc: "Create the perfect outdoor entertainment space with our outdoor living solutions. From covered patios to outdoor kitchens, we help you make the most of Texas outdoor living.",
      image: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop",
      features: [
        "Covered patios & pergolas",
        "Outdoor kitchens & grilling areas",
        "Fire pits & fireplaces",
        "Deck & patio construction",
        "Outdoor lighting & electrical",
        "Landscaping integration"
      ],
      priceRange: "$20,000 - $75,000",
      timeline: "3-8 weeks",
      icon: "🌿"
    },
    {
      title: "Flooring Installation",
      slug: "flooring-installation",
      shortDesc: "Beautiful floors for every room",
      fullDesc: "Update your home with beautiful, durable flooring that fits your lifestyle and budget. We offer a wide range of materials and expert installation for lasting results.",
      image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&h=600&fit=crop",
      features: [
        "Hardwood flooring installation",
        "Luxury vinyl plank (LVP)",
        "Tile & stone installation",
        "Carpet & area rugs",
        "Flooring removal & prep",
        "Subfloor repairs & upgrades"
      ],
      priceRange: "$8,000 - $25,000",
      timeline: "1-3 weeks",
      icon: "🏠"
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Initial Consultation",
      description: "We meet with you to discuss your vision, needs, and budget for your remodeling project."
    },
    {
      step: "2",
      title: "Design & Planning",
      description: "Our team creates detailed plans and 3D renderings to visualize your new space."
    },
    {
      step: "3",
      title: "Permits & Approval",
      description: "We handle all necessary permits and approvals to ensure your project meets local codes."
    },
    {
      step: "4",
      title: "Construction",
      description: "Our skilled craftsmen bring your vision to life with quality materials and expert workmanship."
    },
    {
      step: "5",
      title: "Final Walkthrough",
      description: "We conduct a thorough inspection with you to ensure everything exceeds your expectations."
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-24" style={{ background: 'linear-gradient(to right, #111827, #1f2937, var(--deep-navy))' }}>
        <div className="absolute inset-0 bg-black/40" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-20"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=1080&fit=crop")'
          }}
        />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold font-serif mb-6">
              Our <span className="gradient-text">Services</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-200">
              Comprehensive remodeling solutions for every room and every budget,
              backed by 15+ years of experience in the DFW area.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all cursor-pointer"
                onClick={() => setActiveService(index)}
              >
                <div className="relative h-64 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                    style={{ backgroundImage: `url("${service.image}")` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                  <div className="absolute top-4 right-4 text-white px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: 'var(--accent-teal)' }}>
                    {service.priceRange}
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-3xl mb-2">{service.icon}</div>
                    <h3 className="text-2xl font-bold">{service.title}</h3>
                    <p className="text-gray-200 text-sm">{service.timeline}</p>
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.shortDesc}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" style={{ color: 'var(--accent-teal)' }} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="font-semibold transition-colors inline-flex items-center"
                    style={{ color: 'var(--accent-teal)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--teal-dark)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--accent-teal)'; }}
                  >
                    Learn More
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Service Detail */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="text-5xl mb-4">{services[activeService].icon}</div>
              <h2 className="text-4xl font-bold font-serif mb-6">
                <span className="gradient-text">{services[activeService].title}</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {services[activeService].fullDesc}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div className="text-2xl font-bold" style={{ color: 'var(--accent-teal)' }}>
                    {services[activeService].priceRange}
                  </div>
                  <div className="text-sm text-gray-500">Investment Range</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div className="text-2xl font-bold" style={{ color: 'var(--accent-teal)' }}>
                    {services[activeService].timeline}
                  </div>
                  <div className="text-sm text-gray-500">Typical Timeline</div>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-4">What&apos;s Included:</h3>
              <ul className="space-y-2 mb-8">
                {services[activeService].features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3" style={{ color: 'var(--accent-teal)' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/quote" className="btn-primary">
                Get Free Quote for This Service
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div
                className="rounded-2xl shadow-2xl overflow-hidden h-96 bg-cover bg-center"
                style={{ backgroundImage: `url("${services[activeService].image}")` }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section - Fixed for mobile */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6">
              Our <span className="gradient-text">Process</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From initial consultation to final walkthrough, we ensure a smooth,
              transparent process that keeps you informed every step of the way.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {processSteps.map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="flex items-center mb-8"
              >
                <div className="flex items-center flex-row w-full max-w-2xl mx-auto">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: 'var(--accent-teal)' }}>
                    {process.step}
                  </div>
                  <div className="ml-6 bg-gray-50 p-6 rounded-xl shadow-md flex-1">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{process.title}</h3>
                    <p className="text-gray-600">{process.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="section-padding bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6">
              Proudly Serving the <span className="gradient-text">DFW Area</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              We provide our comprehensive remodeling services throughout the Dallas/Fort Worth metroplex,
              with deep knowledge of local building codes and architectural styles.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
              {['Dallas', 'Fort Worth', 'Plano', 'Frisco', 'McKinney', 'Arlington', 'Irving', 'Southlake', 'Colleyville', 'Grapevine', 'Carrollton', 'Richardson', 'Garland', 'Mesquite', 'Denton'].map((city, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-800 p-4 rounded-lg transition-colors cursor-pointer"
                  style={{ transition: 'background-color 0.3s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-teal)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; }}
                >
                  <span className="font-medium">{city}</span>
                </motion.div>
              ))}
            </div>

            <p className="text-gray-400 mt-8">
              And surrounding communities throughout the DFW metropolitan area
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--accent-teal)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold font-serif text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Contact us today for a free consultation and detailed quote for your remodeling project.
              Let&apos;s bring your dream home to life!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/quote"
                  className="bg-white hover:bg-gray-100 px-12 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg inline-block"
                  style={{ color: 'var(--accent-teal)' }}
                >
                  Get Free Quote
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="tel:9725558746"
                  className="bg-transparent border-2 border-white text-white hover:bg-white px-12 py-4 rounded-lg font-semibold text-lg transition-all inline-block"
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-teal)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#ffffff'; }}
                >
                  Call (972) 555-TRIN
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
