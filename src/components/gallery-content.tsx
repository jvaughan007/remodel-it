'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

export type Project = {
  id: string;
  title: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  description: string;
  location: string;
};

interface GalleryContentProps {
  projects: Project[];
  categories: string[];
}

export default function GalleryContent({ projects, categories }: GalleryContentProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showBefore, setShowBefore] = useState<{[key: string]: boolean}>({});

  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter(project => project.category === activeFilter);

  const toggleBeforeAfter = (projectId: string) => {
    setShowBefore(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

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

  const stats = [
    { number: "500+", label: "Projects Completed", icon: "🏠" },
    { number: "98%", label: "Satisfaction Rate", icon: "⭐" },
    { number: "15+", label: "Years Experience", icon: "📅" },
    { number: "50+", label: "5-Star Reviews", icon: "💯" }
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
              Project <span className="gradient-text">Gallery</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-200">
              Explore our portfolio of stunning home transformations across the Dallas/Fort Worth metroplex.
            </p>
          </motion.div>
        </div>
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
                className="text-center group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-4xl lg:text-5xl font-bold mb-2" style={{ color: 'var(--accent-teal)' }}>
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-gray-50 sticky top-20 z-40 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeFilter === category
                    ? 'text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow-md hover:shadow-lg'
                }`}
                style={activeFilter === category ? { backgroundColor: 'var(--accent-teal)' } : undefined}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            key={activeFilter}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  variants={fadeInUp}
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 60 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                      style={{
                        backgroundImage: `url("${showBefore[project.id] ? project.beforeImage : project.afterImage}")`
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Before/After Toggle */}
                    {project.beforeImage && project.afterImage && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBeforeAfter(project.id);
                        }}
                        className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-semibold transition-all"
                      >
                        {showBefore[project.id] ? "Show After" : "Show Before"}
                      </button>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 text-white px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: 'var(--accent-teal)' }}>
                      {project.category}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                      {project.location && (
                        <p className="text-sm text-gray-200">{project.location}</p>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>

                    <div className="flex justify-end items-center">
                      <button
                        className="font-semibold transition-colors inline-flex items-center"
                        style={{ color: 'var(--accent-teal)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--teal-dark)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--accent-teal)'; }}
                      >
                        View Details
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold font-serif mb-6">
              Ready for Your Own
              <span className="block gradient-text">Transformation?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Let&apos;s bring your vision to life. Schedule your free consultation today
              and see why homeowners across DFW trust Trinity Remodeling with their dreams.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/quote"
                  className="text-white px-12 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg inline-block"
                  style={{ backgroundColor: 'var(--accent-teal)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--teal-dark)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--accent-teal)'; }}
                >
                  Get Free Quote
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="tel:8178097997"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-12 py-4 rounded-lg font-semibold text-lg transition-all inline-block"
                >
                  Call (817) 809-7997
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Before/After Images */}
                <div className="grid md:grid-cols-2 gap-4 p-6">
                  {selectedProject.beforeImage && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-700">Before</h4>
                      <div
                        className="h-64 bg-cover bg-center rounded-lg"
                        style={{ backgroundImage: `url("${selectedProject.beforeImage}")` }}
                      />
                    </div>
                  )}
                  {selectedProject.afterImage && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-700">After</h4>
                      <div
                        className="h-64 bg-cover bg-center rounded-lg"
                        style={{ backgroundImage: `url("${selectedProject.afterImage}")` }}
                      />
                    </div>
                  )}
                </div>

                {/* Project Details */}
                <div className="px-6 pb-6">
                  <div className="mb-4">
                    <h2 className="text-3xl font-bold font-serif mb-2">{selectedProject.title}</h2>
                    <p className="font-semibold" style={{ color: 'var(--accent-teal)' }}>{selectedProject.category} Project</p>
                  </div>

                  {selectedProject.location && (
                    <div className="mb-6">
                      <div className="inline-block bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-2">📍 Location</h4>
                        <p className="text-gray-600">{selectedProject.location}</p>
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-3">Project Description</h4>
                    <p className="text-gray-600 leading-relaxed">{selectedProject.description}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                    <Link
                      href="/quote"
                      onClick={() => setSelectedProject(null)}
                      className="btn-primary flex-1 text-center"
                    >
                      Start Your Project
                    </Link>
                    <Link
                      href="/quote"
                      onClick={() => setSelectedProject(null)}
                      className="btn-secondary flex-1 text-center"
                    >
                      Get Similar Quote
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
