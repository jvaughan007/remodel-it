# Services Inline Detail Panel - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the broken disconnected detail section on the services page with an inline detail panel that appears below the clicked card's row (desktop) or directly below the card (mobile accordion).

**Architecture:** Render service cards in explicit row groups (computed from window width matching Tailwind breakpoints). Each row group is its own CSS grid. The detail panel renders between row groups using AnimatePresence for smooth height animation. Quote page reads `?service=` query param to pre-select service type.

**Tech Stack:** React 19, Next.js 16, Framer Motion 12, Tailwind CSS v4

---

### Task 1: Rewrite Services Page - State and Row Grouping

**Files:**
- Modify: `src/app/services/page.tsx`

**Step 1: Replace state and add column tracking**

Replace `const [activeService, setActiveService] = useState(0);` with:

```tsx
const [expandedService, setExpandedService] = useState<number | null>(null);
const [cols, setCols] = useState(1);

useEffect(() => {
  const updateCols = () => {
    if (window.innerWidth >= 1280) setCols(3);
    else if (window.innerWidth >= 1024) setCols(2);
    else setCols(1);
  };
  updateCols();
  window.addEventListener('resize', updateCols);
  return () => window.removeEventListener('resize', updateCols);
}, []);
```

Add `useEffect` to the imports: `import { useState, useEffect } from 'react';`

Add `AnimatePresence` to framer-motion import: `import { motion, AnimatePresence } from 'framer-motion';`

**Step 2: Build the toggle handler**

```tsx
const toggleService = (index: number) => {
  setExpandedService(prev => prev === index ? null : index);
};
```

**Step 3: Commit**

```bash
git add src/app/services/page.tsx
git commit -m "feat(services): add expandedService state and column tracking"
```

---

### Task 2: Replace Card Grid with Row-Grouped Rendering

**Files:**
- Modify: `src/app/services/page.tsx` (lines 191-251 - the Services Grid section)

**Step 1: Replace the Services Grid section**

Replace lines 191-251 (the entire `{/* Services Grid */}` section) with row-grouped rendering:

```tsx
{/* Services Grid */}
<section className="section-padding bg-white">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    {Array.from({ length: Math.ceil(services.length / cols) }, (_, rowIdx) => {
      const rowServices = services.slice(rowIdx * cols, rowIdx * cols + cols);
      const expandedInThisRow = expandedService !== null
        && expandedService >= rowIdx * cols
        && expandedService < rowIdx * cols + cols;

      return (
        <div key={rowIdx}>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
            {rowServices.map((service, colIdx) => {
              const serviceIndex = rowIdx * cols + colIdx;
              const isExpanded = expandedService === serviceIndex;

              return (
                <motion.div
                  key={serviceIndex}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: colIdx * 0.2 }}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all cursor-pointer ${
                    isExpanded ? 'ring-2' : ''
                  }`}
                  style={isExpanded ? { borderColor: 'var(--accent-teal)', boxShadow: '0 0 0 2px var(--accent-teal)' } : {}}
                  onClick={() => toggleService(serviceIndex)}
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
                          <svg className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: 'var(--accent-teal)' }} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <span
                      className="font-semibold inline-flex items-center"
                      style={{ color: 'var(--accent-teal)' }}
                    >
                      {isExpanded ? 'Close Details' : 'View Details'}
                      <svg
                        className="w-4 h-4 ml-2 transition-transform duration-300"
                        style={{ transform: isExpanded ? 'rotate(90deg)' : 'none' }}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Inline Detail Panel */}
          <AnimatePresence>
            {expandedInThisRow && expandedService !== null && (
              <motion.div
                key={`detail-${expandedService}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="overflow-hidden mb-8"
              >
                <div className="bg-gray-50 rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12">
                  <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    {/* Left: Details */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-4xl">{services[expandedService].icon}</span>
                        <h2 className="text-3xl font-bold font-serif">
                          <span className="gradient-text">{services[expandedService].title}</span>
                        </h2>
                      </div>
                      <p className="text-lg text-gray-600 mb-6">
                        {services[expandedService].fullDesc}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="text-xl font-bold" style={{ color: 'var(--accent-teal)' }}>
                            {services[expandedService].priceRange}
                          </div>
                          <div className="text-sm text-gray-500">Investment Range</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <div className="text-xl font-bold" style={{ color: 'var(--accent-teal)' }}>
                            {services[expandedService].timeline}
                          </div>
                          <div className="text-sm text-gray-500">Typical Timeline</div>
                        </div>
                      </div>

                      <h3 className="text-lg font-bold mb-3">What&apos;s Included:</h3>
                      <ul className="space-y-2 mb-8">
                        {services[expandedService].features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 mr-3 flex-shrink-0" style={{ color: 'var(--accent-teal)' }} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                          href={`/quote?service=${services[expandedService].slug}`}
                          className="btn-primary text-center"
                        >
                          Get Free Quote for {services[expandedService].title}
                        </Link>
                        <a
                          href="tel:9725558746"
                          className="btn-secondary text-center"
                        >
                          Call (972) 555-TRIN
                        </a>
                      </div>
                    </div>

                    {/* Right: Image */}
                    <div className="relative">
                      <div
                        className="rounded-2xl shadow-xl overflow-hidden h-64 sm:h-80 lg:h-96 bg-cover bg-center"
                        style={{ backgroundImage: `url("${services[expandedService].image}")` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    })}
  </div>
</section>
```

**Step 2: Commit**

```bash
git add src/app/services/page.tsx
git commit -m "feat(services): replace card grid with row-grouped inline detail panel"
```

---

### Task 3: Remove Old Featured Service Detail Section

**Files:**
- Modify: `src/app/services/page.tsx` (lines 253-317 approximately)

**Step 1: Delete the entire `{/* Featured Service Detail */}` section**

Remove everything from `{/* Featured Service Detail */}` through the closing `</section>` tag (the section with `className="section-padding bg-gray-50"`). The Process section should follow directly after the Services Grid section.

**Step 2: Remove unused stagger/fadeInUp variants if no longer needed**

Check if `stagger` and `fadeInUp` animation variants are still used. If not, remove them.

**Step 3: Commit**

```bash
git add src/app/services/page.tsx
git commit -m "fix(services): remove broken disconnected detail section"
```

---

### Task 4: Quote Page - Read Service Query Param

**Files:**
- Modify: `src/app/quote/page.tsx`

**Step 1: Add useSearchParams and slug-to-value mapping**

Add to imports: `import { useSearchParams } from 'next/navigation';`

Inside the Quote component, add after the useForm call:

```tsx
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
    // Jump to step 2 (Project Details) and pre-fill service type
    setCurrentStep(2);
    // Use setValue from react-hook-form to set the value
    setValue('serviceType', slugToServiceType[serviceParam]);
  }
}, [searchParams, setValue]);
```

Add `setValue` to the useForm destructure:

```tsx
const {
  register,
  handleSubmit,
  reset,
  setValue,
  formState: { errors }
} = useForm<QuoteFormData>();
```

Add `useEffect` to imports: already imported via `useState`.

Update import line to: `import { useState, useEffect } from 'react';`

**Step 2: Commit**

```bash
git add src/app/quote/page.tsx
git commit -m "feat(quote): pre-select service type from URL query param"
```

---

### Task 5: Visual Verification

**Step 1: Start dev server and verify with Playwright**

```bash
npm run dev
```

Verify:
1. Navigate to `/services` -- cards render in grid
2. Click a card -- detail panel slides open below the card's row
3. Click same card -- panel closes
4. Click different card in same row -- panel swaps content
5. Click card in different row -- panel moves to new row
6. On mobile (375px) -- accordion behavior, panel appears directly below card
7. Click "Get Free Quote for Kitchen Remodeling" -- navigates to `/quote?service=kitchen-remodeling`
8. Quote page opens on Step 2 with "Kitchen Remodeling" pre-selected

**Step 2: Commit all remaining changes and push**

```bash
git add -A
git commit -m "feat(services): inline detail panel with quote pre-selection

Replaces disconnected detail section with Google Images-style
inline detail panel. Desktop: panel inserts below clicked card's
row. Mobile: accordion pattern. CTA links to /quote with service
pre-selected via query param."
git push origin master
```
