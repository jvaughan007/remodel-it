'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';


export default function About() {
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

  const values = [
    {
      title: "Quality Craftsmanship",
      description: "I never compromise on quality. Every detail matters, from the initial design to the final finish.",
      icon: "🔨"
    },
    {
      title: "Transparent Communication",
      description: "You work directly with me throughout every phase of your project. No middlemen, no runaround.",
      icon: "💬"
    },
    {
      title: "Client Satisfaction",
      description: "Your happiness is my success. I don't consider a job complete until you're 100% satisfied.",
      icon: "⭐"
    },
    {
      title: "Innovation",
      description: "I stay current with the latest trends, materials, and techniques to deliver modern solutions.",
      icon: "💡"
    },
    {
      title: "Integrity",
      description: "I do what I say I'll do, when I say I'll do it, at the price we agreed upon. My word is my bond.",
      icon: "🤝"
    },
    {
      title: "Local Expertise",
      description: "Deep understanding of DFW building codes, climate considerations, and local architectural styles.",
      icon: "📍"
    }
  ];

  const milestones = [
    { year: "2010", event: "Nick Stephens founds Trinity Remodeling in Dallas" },
    { year: "2013", event: "Expanded service area across the entire DFW metroplex" },
    { year: "2016", event: "Completed 200th successful project" },
    { year: "2019", event: "Received Best of Dallas Home Remodeling Award" },
    { year: "2021", event: "Achieved 98% customer satisfaction rating" },
    { year: "2024", event: "Completed over 500 dream home transformations" }
  ];

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
              Meet <span className="gradient-text">Nick Stephens</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-200">
              The craftsman behind Trinity Remodeling. Over 15 years of transforming DFW homes
              with hands-on expertise and an unwavering commitment to quality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Nick's Story */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold font-serif mb-6">
                My <span className="gradient-text">Story</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-600">
                <p>
                  I&apos;m Nick Stephens, and I founded Trinity Remodeling in 2010 with a straightforward
                  belief: homeowners deserve a remodeler who treats their home like his own. After
                  years working in construction and interior design across the DFW area, I set out
                  on my own to deliver the kind of craftsmanship and personal attention that larger
                  companies simply can&apos;t match.
                </p>
                <p>
                  My background in both construction and design means I see your project from every
                  angle &mdash; the structural integrity, the aesthetic vision, and the practical details
                  that make a space truly livable. When you hire Trinity Remodeling, you work directly
                  with me from the first consultation to the final walkthrough.
                </p>
                <p>
                  Over 500 completed projects and a 98% satisfaction rate later, I&apos;m still doing
                  what I love: helping Dallas/Fort Worth families turn their houses into dream homes.
                  Every project is personal to me, and I won&apos;t stop until you&apos;re thrilled with
                  the result.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative mb-8"
            >
              <div
                className="rounded-2xl shadow-2xl overflow-hidden max-w-xs sm:max-w-sm lg:max-w-none mx-auto"
                style={{
                  background: 'linear-gradient(135deg, #0A1A2F 0%, #1a3a5c 40%, #2BB6C9 100%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  padding: '1.5rem 1.5rem 0',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/nick-stephens-professional.png"
                  alt="Nick Stephens, founder of Trinity Remodeling"
                  className="w-48 sm:w-56 lg:w-72"
                  style={{
                    height: 'auto',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))',
                  }}
                />
              </div>
              <div className="hidden sm:block absolute -bottom-6 right-4 text-white p-6 rounded-2xl shadow-xl" style={{ backgroundColor: 'var(--accent-teal)' }}>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm font-medium">Projects Completed</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
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
              My <span className="gradient-text">Mission & Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              I&apos;m driven by a passion for creating beautiful, functional spaces that enhance
              my clients&apos; daily lives while adding lasting value to their homes.
            </p>
          </motion.div>

          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl p-8 shadow-lg mb-16 text-center"
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-900">My Mission</h3>
            <p className="text-lg text-gray-600 italic max-w-4xl mx-auto">
              &quot;To transform DFW homes through exceptional craftsmanship, innovative design, and the kind of
              personal service you only get when the owner is on the job site. I build spaces that reflect my
              clients&apos; unique lifestyles while exceeding their expectations at every turn.&quot;
            </p>
          </motion.div>

          {/* Values Grid */}
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white p-8 rounded-2xl shadow-lg text-center group hover:shadow-xl transition-all"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
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
              The <span className="gradient-text">Journey</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From a one-man operation to DFW&apos;s most trusted remodeling professional,
              here are the milestones along the way.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-center mb-8"
              >
                <div className="flex items-center flex-row w-full max-w-2xl mx-auto">
                  <div className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: 'var(--accent-teal)' }}>
                    {milestone.year}
                  </div>
                  <div className="ml-6 bg-gray-50 p-6 rounded-lg shadow-md flex-1">
                    <p className="text-gray-800 font-medium">{milestone.event}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Work Directly With Me */}
      <section className="section-padding bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6 text-center">
                Why Work <span className="gradient-text">Directly With Me</span>
              </h2>
              <p className="text-lg text-gray-300 mb-10 text-center">
                When you choose Trinity Remodeling, you&apos;re not handed off to a project
                manager or a rotating crew. I personally oversee every project from start to finish.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <div className="bg-gray-800 p-6 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: 'var(--accent-teal)' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <strong className="text-white text-lg">One point of contact.</strong>
                      <p className="text-gray-400 mt-1">You always know who to call, and I always pick up.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: 'var(--accent-teal)' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <strong className="text-white text-lg">Owner on the job site.</strong>
                      <p className="text-gray-400 mt-1">I&apos;m hands-on throughout your project, not behind a desk.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: 'var(--accent-teal)' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <strong className="text-white text-lg">Accountability.</strong>
                      <p className="text-gray-400 mt-1">My name and reputation are on every project. That&apos;s the best guarantee you&apos;ll get.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 p-6 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: 'var(--accent-teal)' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <strong className="text-white text-lg">Trusted network.</strong>
                      <p className="text-gray-400 mt-1">I work with the same skilled tradespeople I&apos;ve built relationships with over 15 years.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Credential strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-px rounded-2xl overflow-hidden"
              style={{ background: 'rgba(43,182,201,0.2)' }}
            >
              {[
                { stat: '500+', label: 'Projects Completed' },
                { stat: '98%', label: 'Client Satisfaction' },
                { stat: '15+', label: 'Years Experience' },
              ].map((item) => (
                <div
                  key={item.stat}
                  className="bg-gray-900 text-center py-8 px-4"
                >
                  <div
                    className="text-3xl sm:text-4xl font-bold mb-1"
                    style={{ color: 'var(--accent-teal)' }}
                  >
                    {item.stat}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400 font-medium uppercase tracking-wide">
                    {item.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
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
              Ready to Work
              <span className="block">With Nick?</span>
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss your project. I&apos;ll give you honest advice, a fair price,
              and the personal attention your home deserves.
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
