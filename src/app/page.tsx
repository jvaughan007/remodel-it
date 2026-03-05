'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';


export default function Home() {
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
      description: "Transform your kitchen into the heart of your home with custom designs and premium finishes.",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&crop=center",
      icon: "🏠"
    },
    {
      title: "Bathroom Renovation",
      description: "Create your personal spa retreat with luxury fixtures and thoughtful design.",
      image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop&crop=center",
      icon: "🛁"
    },
    {
      title: "Whole Home Remodel",
      description: "Reimagine your entire living space with comprehensive renovation solutions.",
      image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&h=400&fit=crop&crop=center",
      icon: "🏡"
    }
  ];

  const stats = [
    { number: "500+", label: "Projects Completed" },
    { number: "15+", label: "Years Experience" },
    { number: "98%", label: "Satisfaction Rate" },
    { number: "50+", label: "5-Star Reviews" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Plano, TX",
      text: "Trinity Remodeling transformed our outdated kitchen into a stunning modern space. The attention to detail and professionalism was exceptional.",
      rating: 5
    },
    {
      name: "Mike Chen",
      location: "Frisco, TX",
      text: "From design to completion, the team exceeded our expectations. Our whole home renovation was completed on time and within budget.",
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      location: "Southlake, TX",
      text: "The bathroom remodel is absolutely beautiful. High-quality work and excellent communication throughout the entire process.",
      rating: 5
    }
  ];

  const whyChooseUs = [
    {
      title: "Licensed & Insured",
      description: "Full licensing and comprehensive insurance for your peace of mind.",
      icon: "✅"
    },
    {
      title: "Local DFW Experts",
      description: "Deep understanding of local building codes and design preferences.",
      icon: "📍"
    },
    {
      title: "Quality Guarantee",
      description: "We stand behind our work with comprehensive warranties.",
      icon: "🏆"
    },
    {
      title: "Transparent Pricing",
      description: "No hidden costs. Clear, upfront pricing for every project.",
      icon: "💰"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&h=1080&fit=crop&crop=center")'
            }}
          />
          <div className="absolute inset-0 bg-gray-900/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold font-serif mb-6">
              Transform Your
              <span className="gradient-text block">Dream Home</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-200">
              Premier home remodeling services in Dallas/Fort Worth. From kitchens to whole home renovations,
              we bring your vision to life with exceptional craftsmanship.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md sm:max-w-none mx-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link href="/quote" className="btn-primary text-lg px-8 sm:px-12 py-4 block text-center">
                  Get Free Quote
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link href="/gallery" className="btn-secondary text-lg px-8 sm:px-12 py-4 block text-center">
                  View Portfolio
                </Link>
              </motion.div>
            </div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-gray-300"
            >
              <div className="flex items-center">
                <span style={{ color: 'var(--accent-teal)' }} className="mr-2">✓</span>
                Licensed & Insured
              </div>
              <div className="flex items-center">
                <span style={{ color: 'var(--accent-teal)' }} className="mr-2">✓</span>
                15+ Years Experience
              </div>
              <div className="flex items-center">
                <span style={{ color: 'var(--accent-teal)' }} className="mr-2">✓</span>
                500+ Happy Customers
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-white/60"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold mb-2" style={{ color: 'var(--accent-teal)' }}>
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6">
              Our <span className="gradient-text">Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From concept to completion, we provide comprehensive remodeling solutions
              tailored to your lifestyle and budget.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundImage: `url("${service.image}")` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-3xl mb-2">{service.icon}</div>
                    <h3 className="text-2xl font-bold">{service.title}</h3>
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  <Link
                    href="/services"
                    className="font-semibold transition-colors inline-flex items-center"
                    style={{ color: 'var(--accent-teal)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--teal-dark)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--accent-teal)'; }}
                  >
                    Learn More
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
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
              Why Choose <span className="gradient-text">Trinity Remodeling</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the difference with our commitment to excellence,
              local expertise, and customer satisfaction.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6">
              What Our <span className="gradient-text">Clients Say</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Don&apos;t just take our word for it. Here&apos;s what our satisfied customers
              throughout the DFW area have to say.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-gray-800 p-8 rounded-2xl"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" style={{ color: 'var(--accent-teal)' }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 mb-6 text-lg italic">
                  &quot;{testimonial.text}&quot;
                </p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm" style={{ color: 'var(--accent-teal)' }}>{testimonial.location}</div>
                </div>
              </motion.div>
            ))}
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
              Ready to Start Your
              <span className="block">Dream Project?</span>
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss your vision and provide you with a detailed,
              no-obligation quote for your remodeling project.
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
                <Link
                  href="/contact"
                  className="bg-transparent border-2 border-white text-white hover:bg-white px-12 py-4 rounded-lg font-semibold text-lg transition-all inline-block"
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-teal)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#ffffff'; }}
                >
                  Contact Us
                </Link>
              </motion.div>
            </div>

            <div className="mt-12 text-white/80">
              <p className="text-lg mb-4">Call us today for immediate assistance</p>
              <a
                href="tel:9725558746"
                className="text-3xl font-bold text-white hover:text-gray-200 transition-colors"
              >
                (972) 555-TRIN
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
