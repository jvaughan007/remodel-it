'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

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
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', data);
      setIsSubmitted(true);
      setIsSubmitting(false);
      reset();
    }, 1000);
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
      subDetails: "We respond within 2 hours",
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
            We&apos;ve received your message and will get back to you within 24 hours. 
            For urgent matters, please call us directly at (972) 555-TRIN.
          </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="btn-primary"
          >
            Send Another Message
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-r from-gray-900 via-gray-800 to-[#0A1A2F]">
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
              Contact <span className="gradient-text">Us</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-200">
              Ready to start your dream project? Get in touch with our expert team for a free consultation and quote.
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
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold font-serif mb-6">
                Send Us a <span className="gradient-text">Message</span>
              </h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we&apos;ll get back to you within 24 hours. 
                For immediate assistance, please call us directly.
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB6C9] focus:border-transparent transition-all"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB6C9] focus:border-transparent transition-all"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB6C9] focus:border-transparent transition-all"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB6C9] focus:border-transparent transition-all"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB6C9] focus:border-transparent transition-all"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB6C9] focus:border-transparent transition-all"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BB6C9] focus:border-transparent transition-all resize-none"
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
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold font-serif mb-6">
                  Get In <span className="gradient-text">Touch</span>
                </h2>
                <p className="text-gray-600 text-lg">
                  We&apos;re here to help with all your remodeling needs. Contact us today 
                  for a free consultation and see how we can transform your home.
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
                            className="text-[#2BB6C9] hover:text-[#239AA9] font-medium"
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

              {/* Emergency Contact */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-[#e8f8fa] border border-[#a8e4ec] p-6 rounded-2xl"
              >
                <h3 className="text-lg font-semibold text-[#0A1A2F] mb-2">
                  Need Immediate Assistance?
                </h3>
                <p className="text-[#1a6b77] mb-4">
                  For urgent matters or emergency repairs, call us directly:
                </p>
                <a 
                  href="tel:9725558746"
                  className="text-2xl font-bold text-[#239AA9] hover:text-[#0A1A2F] transition-colors"
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
              We Proudly Serve the <span className="gradient-text">DFW Area</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our team provides comprehensive remodeling services throughout the Dallas/Fort Worth 
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
              Give us a call to see if we service your location!
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

      {/* Map Section */}
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
              Come see our work in person and meet with our design team at our Dallas showroom.
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
            <div className="space-y-4">
              <a 
                href="https://maps.google.com/?q=123+Remodel+Street+Dallas+TX+75201"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mr-4"
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
              Appointments recommended to ensure a designer is available to meet with you.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}