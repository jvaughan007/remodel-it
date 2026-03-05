'use client';

import { motion } from 'framer-motion';


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

  const teamMembers = [
    {
      name: "David Rodriguez",
      role: "Founder & Lead Designer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      bio: "With over 20 years in construction and design, David founded Trinity Remodeling to bring exceptional craftsmanship to DFW homeowners."
    },
    {
      name: "Sarah Mitchell",
      role: "Interior Design Director",
      image: "https://images.unsplash.com/photo-1494790108755-2616c67a0b4b?w=400&h=400&fit=crop&crop=face",
      bio: "Sarah brings 15 years of interior design expertise, specializing in creating functional and beautiful living spaces."
    },
    {
      name: "Mike Thompson",
      role: "Project Manager",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      bio: "Mike ensures every project runs smoothly from start to finish, coordinating all trades and maintaining quality standards."
    },
    {
      name: "Jennifer Lee",
      role: "Client Relations Manager",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      bio: "Jennifer is your primary point of contact, ensuring clear communication and exceptional customer service throughout your project."
    }
  ];

  const values = [
    {
      title: "Quality Craftsmanship",
      description: "We never compromise on quality. Every detail matters, from the initial design to the final finish.",
      icon: "🔨"
    },
    {
      title: "Transparent Communication",
      description: "Open, honest communication throughout every phase of your project. No surprises, just results.",
      icon: "💬"
    },
    {
      title: "Client Satisfaction",
      description: "Your happiness is our success. We don't consider a job complete until you're 100% satisfied.",
      icon: "⭐"
    },
    {
      title: "Innovation",
      description: "We stay current with the latest trends, materials, and techniques to deliver modern solutions.",
      icon: "💡"
    },
    {
      title: "Integrity",
      description: "We do what we say we'll do, when we say we'll do it, at the price we agreed upon.",
      icon: "🤝"
    },
    {
      title: "Local Expertise",
      description: "Deep understanding of DFW building codes, climate considerations, and local architectural styles.",
      icon: "📍"
    }
  ];

  const milestones = [
    { year: "2010", event: "Trinity Remodeling founded by David Rodriguez" },
    { year: "2013", event: "Expanded to serve entire DFW metroplex" },
    { year: "2016", event: "Completed 200th successful project" },
    { year: "2019", event: "Received Best of Dallas Home Remodeling Award" },
    { year: "2021", event: "Achieved 98% customer satisfaction rating" },
    { year: "2024", event: "Completed over 500 dream home transformations" }
  ];

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
              About <span className="gradient-text">Trinity Remodeling</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-200">
              Transforming DFW homes with passion, expertise, and unwavering commitment to quality since 2010.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold font-serif mb-6">
                Our <span className="gradient-text">Story</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-600">
                <p>
                  Founded in 2010 by David Rodriguez, Trinity Remodeling began with a simple mission: 
                  to help Dallas/Fort Worth families transform their houses into dream homes. 
                  What started as a small renovation company has grown into one of the most 
                  trusted names in DFW home remodeling.
                </p>
                <p>
                  David&apos;s background in both construction and interior design uniquely positioned 
                  him to understand that successful remodeling requires both technical expertise 
                  and creative vision. This dual focus has been the cornerstone of our approach 
                  for over a decade.
                </p>
                <p>
                  Today, with over 500 completed projects and a 98% customer satisfaction rate, 
                  we continue to push the boundaries of what&apos;s possible in home renovation. 
                  Every project is an opportunity to exceed expectations and create spaces that 
                  our clients will love for years to come.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div 
                className="rounded-2xl shadow-2xl overflow-hidden h-96 bg-cover bg-center"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop")'
                }}
              />
              <div className="absolute -bottom-8 -right-8 bg-accent-teal text-white p-6 rounded-2xl shadow-xl">
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
              Our <span className="gradient-text">Mission & Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We&apos;re driven by a passion for creating beautiful, functional spaces that enhance 
              our clients&apos; daily lives while adding lasting value to their homes.
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
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Our Mission</h3>
            <p className="text-lg text-gray-600 italic max-w-4xl mx-auto">
              &quot;To transform DFW homes through exceptional craftsmanship, innovative design, and unparalleled customer service, 
              creating spaces that reflect our clients&apos; unique lifestyles while exceeding their expectations at every turn.&quot;
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
              Our <span className="gradient-text">Journey</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From humble beginnings to becoming DFW&apos;s premier remodeling company, 
              here are the key milestones in our story.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`flex items-center mb-12 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} max-w-lg`}>
                  <div className="flex-shrink-0 w-16 h-16 bg-accent-teal rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {milestone.year}
                  </div>
                  <div className={`${index % 2 === 0 ? 'ml-6' : 'mr-6'} bg-gray-50 p-6 rounded-lg shadow-md`}>
                    <p className="text-gray-800 font-medium">{milestone.event}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
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
              Meet Our <span className="gradient-text">Team</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our experienced professionals are passionate about bringing your vision to life 
              with expertise, creativity, and attention to detail.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center group"
              >
                <div className="relative mb-6 mx-auto w-48 h-48 rounded-full overflow-hidden group-hover:scale-105 transition-transform">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url("${member.image}")` }}
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className="text-accent-teal font-semibold mb-4">{member.role}</p>
                <p className="text-gray-300 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-accent-teal">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold font-serif text-white mb-6">
              Ready to Work With
              <span className="block">Our Expert Team?</span>
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss your project and show you why homeowners throughout 
              the DFW area trust Trinity Remodeling with their most important investments.
            </p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a 
                href="/contact" 
                className="bg-white text-accent-teal hover:bg-gray-100 px-12 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg inline-block"
              >
                Start Your Project Today
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}