'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';

type QuoteFormData = {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Project Details
  serviceType: string;
  projectDescription: string;
  budgetRange: string;
  timeline: string;

  // Property Info
  address: string;
  city: string;
  zipCode: string;
  propertyType: string;
  homeAge: string;

  // Additional Info
  previousWork: string;
  designPreferences: string;
  specialRequirements: string;
  howDidYouHear: string;

  // Preferences
  preferredContactMethod: 'email' | 'phone' | 'either';
  bestTimeToCall: string;
  scheduleConsultation: boolean;
};

export default function Quote() {
  return (
    <Suspense>
      <QuoteContent />
    </Suspense>
  );
}

function QuoteContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<QuoteFormData>();

  const searchParams = useSearchParams();

  const slugToServiceType: Record<string, string> = {
    'kitchen-remodeling': 'Kitchen Remodeling',
    'bathroom-renovation': 'Bathroom Renovation',
    'whole-home-remodeling': 'Whole Home Remodel',
    'home-additions': 'Home Addition',
    'outdoor-living': 'Outdoor Living',
    'flooring-installation': 'Flooring Installation',
  };

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam && slugToServiceType[serviceParam]) {
      setCurrentStep(2);
      setValue('serviceType', slugToServiceType[serviceParam]);
    }
  }, [searchParams, setValue]);

  const totalSteps = 4;

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      console.log('Quote form submitted:', data);
      setIsSubmitted(true);
      setIsSubmitting(false);
      reset();
    }, 2000);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg text-center"
        >
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
          <p className="text-lg text-gray-600 mb-6">
            I&apos;ve received your quote request and I&apos;m already reviewing the details.
            You can expect to hear from me within 24 hours with your detailed estimate.
          </p>

          <div className="p-6 rounded-lg border mb-6" style={{ backgroundColor: 'var(--teal-light-bg)', borderColor: 'var(--teal-light-border)' }}>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--deep-navy)' }}>
              What happens next?
            </h3>
            <ul className="text-left space-y-2" style={{ color: 'var(--teal-light-text)' }}>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: 'var(--accent-teal)' }}>1.</span>
                I review your project details within 2 hours
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: 'var(--accent-teal)' }}>2.</span>
                I&apos;ll call or email you personally to schedule a consultation
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: 'var(--accent-teal)' }}>3.</span>
                I visit your home to assess the project and discuss options
              </li>
              <li className="flex items-start">
                <span className="mr-2" style={{ color: 'var(--accent-teal)' }}>4.</span>
                You receive a detailed written estimate within 48 hours
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsSubmitted(false)}
              className="btn-primary"
            >
              Request Another Quote
            </button>
            <a
              href="tel:9725558746"
              className="btn-secondary text-center"
            >
              Call Us Now
            </a>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            For immediate assistance, call me at (972) 555-TRIN
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative pt-36 pb-16" style={{ background: 'linear-gradient(to right, #111827, #1f2937, var(--deep-navy))' }}>
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
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
              Get Your Free <span className="gradient-text">Quote</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-200">
              Tell me about your project and receive a detailed estimate within 24 hours.
              No obligations, just honest pricing from a DFW remodeling professional you can trust.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%`, backgroundColor: 'var(--accent-teal)' }}
            />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="bg-white p-8 rounded-2xl shadow-lg"
              >
                <h2 className="text-3xl font-bold font-serif mb-6">
                  Let&apos;s Start with <span className="gradient-text">Your Information</span>
                </h2>
                <p className="text-gray-600 mb-8">
                  We need some basic information to create your personalized quote.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      {...register('firstName', { required: 'First name is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-teal)'; }}
                      onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
                      placeholder="Your first name"
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      {...register('lastName', { required: 'Last name is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-teal)'; }}
                      onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
                      placeholder="Your last name"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
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

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      {...register('phone', { required: 'Phone number is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-teal)'; }}
                      onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
                      placeholder="(972) 555-0123"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary"
                  >
                    Next Step →
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Project Details */}
            {currentStep === 2 && (
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="bg-white p-8 rounded-2xl shadow-lg"
              >
                <h2 className="text-3xl font-bold font-serif mb-6">
                  Tell Us About Your <span className="gradient-text">Project</span>
                </h2>
                <p className="text-gray-600 mb-8">
                  The more details you provide, the more accurate your estimate will be.
                </p>

                <div className="mb-6">
                  <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                    Type of Project *
                  </label>
                  <select
                    id="serviceType"
                    {...register('serviceType', { required: 'Please select a service type' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-teal)'; }}
                    onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
                  >
                    <option value="">Select your project type</option>
                    <option value="Kitchen Remodeling">Kitchen Remodeling</option>
                    <option value="Bathroom Renovation">Bathroom Renovation</option>
                    <option value="Whole Home Remodel">Whole Home Remodel</option>
                    <option value="Home Addition">Home Addition</option>
                    <option value="Outdoor Living">Outdoor Living Space</option>
                    <option value="Flooring Installation">Flooring Installation</option>
                    <option value="Multiple Projects">Multiple Projects</option>
                    <option value="Other">Other (please specify in description)</option>
                  </select>
                  {errors.serviceType && <p className="text-red-500 text-sm mt-1">{errors.serviceType.message}</p>}
                </div>

                <div className="mb-6">
                  <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Project Description *
                  </label>
                  <textarea
                    id="projectDescription"
                    rows={5}
                    {...register('projectDescription', { required: 'Project description is required' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
                    onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-teal)'; }}
                    onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
                    placeholder="Describe your project in detail. Include specific rooms, materials, features, and any special requirements..."
                  />
                  {errors.projectDescription && <p className="text-red-500 text-sm mt-1">{errors.projectDescription.message}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label htmlFor="budgetRange" className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range *
                    </label>
                    <select
                      id="budgetRange"
                      {...register('budgetRange', { required: 'Please select a budget range' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-teal)'; }}
                      onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
                    >
                      <option value="">Select your budget</option>
                      <option value="Under $15,000">Under $15,000</option>
                      <option value="$15,000 - $30,000">$15,000 - $30,000</option>
                      <option value="$30,000 - $50,000">$30,000 - $50,000</option>
                      <option value="$50,000 - $75,000">$50,000 - $75,000</option>
                      <option value="$75,000 - $100,000">$75,000 - $100,000</option>
                      <option value="$100,000 - $150,000">$100,000 - $150,000</option>
                      <option value="Over $150,000">Over $150,000</option>
                      <option value="Not sure yet">Not sure yet</option>
                    </select>
                    {errors.budgetRange && <p className="text-red-500 text-sm mt-1">{errors.budgetRange.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Timeline *
                    </label>
                    <select
                      id="timeline"
                      {...register('timeline', { required: 'Please select a timeline' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-teal)'; }}
                      onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
                    >
                      <option value="">When would you like to start?</option>
                      <option value="ASAP">As soon as possible</option>
                      <option value="Within 1 month">Within 1 month</option>
                      <option value="1-3 months">1-3 months</option>
                      <option value="3-6 months">3-6 months</option>
                      <option value="6+ months">6+ months from now</option>
                      <option value="Just planning">Just planning / exploring options</option>
                    </select>
                    {errors.timeline && <p className="text-red-500 text-sm mt-1">{errors.timeline.message}</p>}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn-secondary"
                  >
                    ← Previous Step
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary"
                  >
                    Next Step →
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Property Information */}
            {currentStep === 3 && (
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="bg-white p-8 rounded-2xl shadow-lg"
              >
                <h2 className="text-3xl font-bold font-serif mb-6">
                  About Your <span className="gradient-text">Property</span>
                </h2>
                <p className="text-gray-600 mb-8">
                  Property details help us provide more accurate estimates and planning.
                </p>

                <div className="mb-6">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Property Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    {...register('address', { required: 'Address is required' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-teal)'; }}
                    onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
                    placeholder="123 Main Street"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      {...register('city', { required: 'City is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-teal)'; }}
                      onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
                      placeholder="Dallas"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      {...register('zipCode', { required: 'ZIP code is required' })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-teal)'; }}
                      onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
                      placeholder="75201"
                    />
                    {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
                      Property Type
                    </label>
                    <select
                      id="propertyType"
                      {...register('propertyType')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-teal)'; }}
                      onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
                    >
                      <option value="">Select property type</option>
                      <option value="Single Family Home">Single Family Home</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Condo">Condominium</option>
                      <option value="Duplex">Duplex</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="homeAge" className="block text-sm font-medium text-gray-700 mb-2">
                      Approximate Home Age
                    </label>
                    <select
                      id="homeAge"
                      {...register('homeAge')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-teal)'; }}
                      onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
                    >
                      <option value="">Select age range</option>
                      <option value="Less than 5 years">Less than 5 years</option>
                      <option value="5-10 years">5-10 years</option>
                      <option value="10-20 years">10-20 years</option>
                      <option value="20-30 years">20-30 years</option>
                      <option value="30-50 years">30-50 years</option>
                      <option value="Over 50 years">Over 50 years</option>
                      <option value="Not sure">Not sure</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn-secondary"
                  >
                    ← Previous Step
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary"
                  >
                    Next Step →
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Final Details */}
            {currentStep === 4 && (
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                className="bg-white p-8 rounded-2xl shadow-lg"
              >
                <h2 className="text-3xl font-bold font-serif mb-6">
                  Final <span className="gradient-text">Details</span>
                </h2>
                <p className="text-gray-600 mb-8">
                  A few more details to ensure we provide the best possible service.
                </p>

                <div className="mb-6">
                  <label htmlFor="previousWork" className="block text-sm font-medium text-gray-700 mb-2">
                    Have you done any remodeling work before?
                  </label>
                  <select
                    id="previousWork"
                    {...register('previousWork')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-teal)'; }}
                    onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
                  >
                    <option value="">Select option</option>
                    <option value="This is our first project">This is our first remodeling project</option>
                    <option value="Small projects only">We&apos;ve done small projects (paint, fixtures)</option>
                    <option value="Major renovations">We&apos;ve done major renovations before</option>
                    <option value="Multiple projects">We&apos;ve completed multiple remodeling projects</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label htmlFor="designPreferences" className="block text-sm font-medium text-gray-700 mb-2">
                    Design Style Preferences
                  </label>
                  <textarea
                    id="designPreferences"
                    rows={3}
                    {...register('designPreferences')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
                    onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-teal)'; }}
                    onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
                    placeholder="Modern, traditional, farmhouse, contemporary, etc. Include any specific materials, colors, or features you prefer..."
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="specialRequirements" className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requirements or Considerations
                  </label>
                  <textarea
                    id="specialRequirements"
                    rows={3}
                    {...register('specialRequirements')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
                    onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-teal)'; }}
                    onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
                    placeholder="Accessibility needs, pet considerations, work schedule constraints, HOA requirements, etc."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="howDidYouHear" className="block text-sm font-medium text-gray-700 mb-2">
                      How did you hear about us?
                    </label>
                    <select
                      id="howDidYouHear"
                      {...register('howDidYouHear')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-teal)'; }}
                      onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
                    >
                      <option value="">Select option</option>
                      <option value="Google Search">Google Search</option>
                      <option value="Friend/Family Referral">Friend/Family Referral</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Home Show">Home Show</option>
                      <option value="Previous Customer">We&apos;re a previous customer</option>
                      <option value="Contractor Referral">Another contractor referred you</option>
                      <option value="Online Reviews">Online Reviews</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="preferredContactMethod" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Contact Method
                    </label>
                    <select
                      id="preferredContactMethod"
                      {...register('preferredContactMethod')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-teal)'; }}
                      onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
                    >
                      <option value="either">Either email or phone</option>
                      <option value="email">Email preferred</option>
                      <option value="phone">Phone call preferred</option>
                    </select>
                  </div>
                </div>

                <div className="mb-8">
                  <label htmlFor="bestTimeToCall" className="block text-sm font-medium text-gray-700 mb-2">
                    Best Time to Contact You
                  </label>
                  <select
                    id="bestTimeToCall"
                    {...register('bestTimeToCall')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 2px var(--accent-teal)'; }}
                    onBlur={(e) => { e.currentTarget.style.boxShadow = ''; }}
                  >
                    <option value="">Select preferred time</option>
                    <option value="Morning (8-12)">Morning (8AM-12PM)</option>
                    <option value="Afternoon (12-5)">Afternoon (12PM-5PM)</option>
                    <option value="Evening (5-8)">Evening (5PM-8PM)</option>
                    <option value="Weekend">Weekends</option>
                    <option value="Anytime">Anytime</option>
                  </select>
                </div>

                <div className="p-6 rounded-lg border mb-8" style={{ backgroundColor: 'var(--teal-light-bg)', borderColor: 'var(--teal-light-border)' }}>
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="scheduleConsultation"
                      {...register('scheduleConsultation')}
                      className="mt-1 w-4 h-4 rounded"
                      style={{ accentColor: 'var(--accent-teal)' }}
                    />
                    <div>
                      <label htmlFor="scheduleConsultation" className="font-medium" style={{ color: 'var(--deep-navy)' }}>
                        Schedule an in-home consultation
                      </label>
                      <p className="text-sm mt-1" style={{ color: 'var(--teal-light-text)' }}>
                        Check this box to schedule a free in-home consultation where we can discuss your project in detail and provide the most accurate estimate.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn-secondary"
                  >
                    ← Previous Step
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Get My Free Quote'}
                  </button>
                </div>

                <p className="text-sm text-gray-500 text-center mt-6">
                  By submitting this form, you agree to be contacted by Trinity Remodeling regarding your project.
                  We respect your privacy and will never share your information with third parties.
                </p>
              </motion.div>
            )}

          </form>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-serif mb-6">
              Why Choose My <span className="gradient-text">Free Quote Service</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡",
                title: "Quick Response",
                description: "Get your detailed quote within 24 hours of submission. I respect your time and act fast."
              },
              {
                icon: "📐",
                title: "Accurate Estimates",
                description: "My detailed quotes are based on 15+ years of experience and current market pricing."
              },
              {
                icon: "🤝",
                title: "No Pressure",
                description: "My quotes come with no obligations. Take your time to make the right decision for your home."
              },
              {
                icon: "🏆",
                title: "Expert Consultation",
                description: "Included free in-home consultation where I personally discuss your vision and ideas."
              },
              {
                icon: "💰",
                title: "Transparent Pricing",
                description: "No hidden costs or surprise fees. Every detail is clearly itemized in your quote."
              },
              {
                icon: "📋",
                title: "Comprehensive Planning",
                description: "I include timeline, materials, labor, and project phases in every detailed estimate."
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Phone CTA */}
      <section className="py-12" style={{ backgroundColor: 'var(--deep-navy)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300 text-lg mb-3">Prefer to talk to someone directly?</p>
          <a
            href="tel:9725558746"
            className="text-3xl font-bold text-white hover:text-gray-200 transition-colors"
          >
            Call (972) 555-TRIN
          </a>
        </div>
      </section>
    </div>
  );
}
