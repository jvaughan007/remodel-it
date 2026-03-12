'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  preferredContact: 'email' | 'phone' | 'either';
  bestTime: string;
};

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          service_interest: data.subject,
          source: 'website_contact',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to submit');
      }

      setIsSubmitted(true);
      reset();
    } catch (err) {
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: "📞",
      title: "Phone",
      details: "(972) 555-TRIN",
      subDetails: "Call or text anytime",
      action: "tel:9725558746"
    },
    {
      icon: "✉️",
      title: "Email",
      details: "hello@trinityremodelingdfw.com",
      subDetails: "I respond within 2 hours",
      action: "mailto:hello@trinityremodelingdfw.com"
    },
    {
      icon: "📍",
      title: "Address",
      details: "123 Trinity Drive",
      subDetails: "Dallas, TX 75201",
      action: "https://maps.google.com/?q=123+Remodel+Street+Dallas+TX+75201"
    },
    {
      icon: "🕒",
      title: "Business Hours",
      details: "Mon-Fri: 7:00 AM - 6:00 PM",
      subDetails: "Sat: 8:00 AM - 4:00 PM",
      action: null
    }
  ];

  const serviceAreas = [
    'Dallas', 'Fort Worth', 'Plano', 'Frisco', 'McKinney', 'Allen',
    'Arlington', 'Irving', 'Carrollton', 'Richardson', 'Garland',
    'Southlake', 'Colleyville', 'Grapevine', 'Flower Mound', 'Lewisville',
    'Mesquite', 'Grand Prairie', 'Denton', 'The Colony'
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg text-center"
        >
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            I&apos;ve received your message and will get back to you within 24 hours.
            For urgent matters, call me directly at (972) 555-TRIN.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setIsSubmitted(false)}
              className="btn-primary"
            >
              Send Another Message
            </button>
            <Link href="/quote" className="btn-secondary text-center">
              Get a Quote
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-44 pb-24" style={{ background: 'linear-gradient(to right, #111827, #1f2937, var(--deep-navy))' }}>
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
              Get In <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-200">
              Ready to start your dream project? Reach out directly to Nick for a free consultation and quote.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold font-serif mb-6">
                Send Us a <span className="gradient-text">Message</span>
              </h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and I&apos;ll get back to you within 24 hours.
                For immediate assistance, give me a call directly.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name & Email Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      {...register('name', { required: 'Name is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      style={{ '--tw-ring-color': 'var(--accent-teal)' } as React.CSSProperties}
                      onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-teal)'; }}
                      onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
                      placeholder="Your full name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-teal)'; }}
                      onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                {/* Phone & Subject Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...register('phone')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-teal)'; }}
                      onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
                      placeholder="(972) 555-0123"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      {...register('subject', { required: 'Please select a subject' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-teal)'; }}
                      onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
                    >
                      <option value="">Select a subject</option>
                      <option value="Kitchen Remodeling">Kitchen Remodeling</option>
                      <option value="Bathroom Renovation">Bathroom Renovation</option>
                      <option value="Whole Home Remodel">Whole Home Remodel</option>
                      <option value="Home Addition">Home Addition</option>
                      <option value="Outdoor Living">Outdoor Living</option>
                      <option value="Flooring">Flooring</option>
                      <option value="General Question">General Question</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
                  </div>
                </div>

                {/* Preferred Contact & Best Time */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="preferredContact" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Contact Method
                    </label>
                    <select
                      id="preferredContact"
                      {...register('preferredContact')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-teal)'; }}
                      onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
                    >
                      <option value="either">Either email or phone</option>
                      <option value="email">Email preferred</option>
                      <option value="phone">Phone preferred</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="bestTime" className="block text-sm font-medium text-gray-700 mb-2">
                      Best Time to Contact
                    </label>
                    <select
                      id="bestTime"
                      {...register('bestTime')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-teal)'; }}
                      onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
                    >
                      <option value="">Anytime</option>
                      <option value="Morning (8-12)">Morning (8AM-12PM)</option>
                      <option value="Afternoon (12-5)">Afternoon (12PM-5PM)</option>
                      <option value="Evening (5-8)">Evening (5PM-8PM)</option>
                      <option value="Weekend">Weekend</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    {...register('message', { required: 'Message is required' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
                    onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-teal)'; }}
                    onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
                    placeholder="Tell us about your project, timeline, budget, and any specific requirements..."
                  />
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>

                <p className="text-sm text-gray-500 text-center">
                  By submitting this form, you agree to be contacted by Trinity Remodeling
                  regarding your inquiry. We respect your privacy and will never share your information.
                </p>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold font-serif mb-6">
                  Get In <span className="gradient-text">Touch</span>
                </h2>
                <p className="text-gray-600 text-lg">
                  I&apos;m here to help with all your remodeling needs. Contact me today
                  for a free consultation and let&apos;s discuss how to transform your home.
                </p>
              </div>

              {/* Contact Info Cards */}
              <motion.div
                variants={stagger}
                initial="initial"
                animate="animate"
                className="space-y-4"
              >
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className="bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl group-hover:scale-110 transition-transform">
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {info.title}
                        </h3>
                        {info.action ? (
                          <a
                            href={info.action}
                            className="font-medium"
                            style={{ color: 'var(--accent-teal)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--teal-dark)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--accent-teal)'; }}
                          >
                            {info.details}
                          </a>
                        ) : (
                          <p className="text-gray-700 font-medium">{info.details}</p>
                        )}
                        <p className="text-gray-500 text-sm">{info.subDetails}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Quick Quote CTA */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="rounded-2xl p-6" style={{ backgroundColor: 'var(--accent-teal)' }}
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  Want a detailed estimate?
                </h3>
                <p className="text-white/90 mb-4">
                  Use our free quote form for a comprehensive project estimate within 24 hours.
                </p>
                <Link
                  href="/quote"
                  className="bg-white hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-all inline-block"
                  style={{ color: 'var(--accent-teal)' }}
                >
                  Get Free Quote
                </Link>
              </motion.div>

              {/* Emergency Contact */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="p-6 rounded-2xl border"
                style={{ backgroundColor: 'var(--teal-light-bg)', borderColor: 'var(--teal-light-border)' }}
              >
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--deep-navy)' }}>
                  Need Immediate Assistance?
                </h3>
                <p className="mb-4" style={{ color: 'var(--teal-light-text)' }}>
                  For urgent matters or emergency repairs, call us directly:
                </p>
                <a
                  href="tel:9725558746"
                  className="text-2xl font-bold transition-colors"
                  style={{ color: 'var(--teal-dark)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--deep-navy)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--teal-dark)'; }}
                >
                  (972) 555-TRIN
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6">
              Proudly Serving the <span className="gradient-text">DFW Area</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              I provide comprehensive remodeling services throughout the Dallas/Fort Worth
              metroplex and surrounding communities.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8"
          >
            {serviceAreas.map((area, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all text-center"
              >
                <span className="text-gray-700 font-medium">{area}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <p className="text-gray-600 mb-6">
              Don&apos;t see your city listed? We serve many more communities throughout the DFW area.
              Give me a call to confirm service in your area!
            </p>
            <a
              href="tel:9725558746"
              className="btn-primary inline-block"
            >
              Call to Confirm Service Area
            </a>
          </motion.div>
        </div>
      </section>

      {/* Map Section - Fixed button wrapping */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-serif mb-6">
              Visit Our <span className="gradient-text">Showroom</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Come see my work in person and discuss your project at the Dallas showroom.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gray-100 rounded-2xl p-8 text-center"
          >
            <div className="text-6xl mb-4">📍</div>
            <h3 className="text-2xl font-bold mb-4">Trinity Remodeling Showroom</h3>
            <address className="text-gray-600 not-italic mb-6">
              123 Trinity Drive<br />
              Dallas, TX 75201<br />
              <strong>Mon-Fri:</strong> 7:00 AM - 6:00 PM<br />
              <strong>Saturday:</strong> 8:00 AM - 4:00 PM<br />
              <strong>Sunday:</strong> By Appointment
            </address>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://maps.google.com/?q=123+Remodel+Street+Dallas+TX+75201"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Get Directions
              </a>
              <a
                href="tel:9725558746"
                className="btn-secondary"
              >
                Call Before Visiting
              </a>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              Appointments recommended to ensure I&apos;m available to meet with you.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
