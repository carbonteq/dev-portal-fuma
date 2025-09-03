"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WavyBackground, GlowCard, GlowButton, GlowingEffect, BackgroundGradient, SmoothScroll } from '@/components/ui/effects';

interface GridItemProps {
  area: string;
  href: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ area, href, icon, title, description }: GridItemProps) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(href);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  const handleSubLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <li className={`min-h-[8rem] list-none ${area}`}>
      <div className="relative h-full rounded-2xl border border-[var(--color-fd-border)] dark:border-neutral-800 p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          blur={0}
          borderWidth={3}
          spread={80}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div 
          className="block h-full cursor-pointer"
          onClick={handleCardClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label={`Navigate to ${title}`}
        >
          <div className="border-0.75 relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-xl p-4 md:p-5 bg-[var(--color-fd-card)] dark:bg-[#1a1a1a]/80 backdrop-blur-sm dark:shadow-[0px_0px_27px_0px_#2D2D2D] hover:bg-[var(--color-fd-muted)] dark:hover:bg-[#1a1a1a]/90 transition-colors duration-200">
            <div className="relative flex flex-1 flex-col justify-between gap-2">
              <div className="w-fit rounded-lg border border-[var(--color-fd-border)] dark:border-[#4a4a4a] p-2">
                {icon}
              </div>
              <div className="space-y-2">
                <h3 className="-tracking-4 pt-0.5 font-sans text-2xl/[1.5rem] font-semibold text-balance text-[var(--color-fd-foreground)] md:text-3xl/[2rem] dark:text-white">
                  {title}
                </h3>
                <h2 className="font-sans text-base/[1.25rem] text-[var(--color-fd-muted-foreground)] md:text-lg/[1.5rem] dark:text-[#a0a0a0] [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                  <div onClick={handleSubLinkClick}>
                    {description}
                  </div>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default function HomePage() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[var(--color-fd-background)] text-[var(--color-fd-foreground)] dark:bg-black dark:text-white">
      {/* Hero Section with Wavy Background */}
      <WavyBackground 
        className="text-center"
        containerClassName="h-[75vh] min-h-[550px]"
        colors={["#084734", "#0f5132", "#CEF17B", "#a3e635", "#166534"]}
        waveWidth={40}
        backgroundFill="rgb(2, 6, 3)"
        blur={8}
        speed="fast"
        waveOpacity={0.8}
      >
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Build Better Software,{' '}
            <span className="bg-gradient-to-r from-[#084734] via-[#CEF17B] to-[#0f5132] bg-clip-text text-transparent">
              Together
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Your comprehensive developer portal for best practices, learning resources, and building amazing things.
          </p>
        </div>
      </WavyBackground>

      {/* Documentation Links Section */}
      <section className="py-20 bg-[var(--color-fd-background)] dark:bg-black">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-[var(--color-fd-foreground)] dark:text-white text-center mb-4">
            Explore Our Documentation
          </h2>
          <p className="text-[var(--color-fd-muted-foreground)] dark:text-[#a0a0a0] text-center mb-12 text-lg">
            Discover comprehensive guides, best practices, and resources to accelerate your development journey.
          </p>
          
          {/* Bento Grid Layout */}
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-6 lg:gap-4 h-[90vh] min-h-[800px]">
            {/* Training Card - Equal width */}
            <GridItem
              area="md:[grid-area:1/1/4/7]"
              href="/docs/training/backend-typescript/headless-doc-management"
              icon={
                <svg className="w-5 h-5 text-black dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              }
              title="Developer Training"
              description={
                <div className="space-y-4">
                  <p className="text-sm">Comprehensive training modules covering architecture, backend development, DevOps, frontend, and QA.</p>
                  <div className="flex flex-col gap-2">
                    <Link href="/docs/training/architecture/realestatesystemdesign" className="text-sm px-3 py-2 rounded-lg transition-all duration-200 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-700/50 dark:text-emerald-300 dark:hover:text-lime-300 dark:hover:bg-emerald-800/40">→ Architecture</Link>
                    <Link href="/docs/training/backend-typescript/headless-doc-management" className="text-sm px-3 py-2 rounded-lg transition-all duration-200 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-700/50 dark:text-emerald-300 dark:hover:text-lime-300 dark:hover:bg-emerald-800/40">→ Backend TS</Link>
                    <Link href="/docs/training/devops/build_your_own_k8_container" className="text-sm px-3 py-2 rounded-lg transition-all duration-200 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-700/50 dark:text-emerald-300 dark:hover:text-lime-300 dark:hover:bg-emerald-800/40">→ DevOps</Link>
                    <Link href="/docs/training/frontend-react/pos-application" className="text-sm px-3 py-2 rounded-lg transition-all duration-200 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-700/50 dark:text-emerald-300 dark:hover:text-lime-300 dark:hover:bg-emerald-800/40">→ Frontend</Link>
                  </div>
                </div>
              }
            />

            {/* Best Practices Card - Equal width */}
            <GridItem
              area="md:[grid-area:1/7/4/13]"
              href="/docs/best-practices/backend/overview"
              icon={
                <svg className="w-5 h-5 text-black dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Best Practices"
              description={
                <div className="space-y-4">
                  <p className="text-sm">Discover proven patterns, principles, and methodologies for frontend, backend, and full-stack development.</p>
                  <div className="flex flex-col gap-2">
                    <Link href="/docs/best-practices/frontend/overview" className="text-sm px-3 py-2 rounded-lg transition-all duration-200 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-700/50 dark:text-emerald-300 dark:hover:text-lime-300 dark:hover:bg-emerald-800/40">→ Frontend</Link>
                    <Link href="/docs/best-practices/backend/overview" className="text-sm px-3 py-2 rounded-lg transition-all duration-200 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-700/50 dark:text-emerald-300 dark:hover:text-lime-300 dark:hover:bg-emerald-800/40">→ Backend</Link>
                    <Link href="/docs/best-practices/javascript" className="text-sm px-3 py-2 rounded-lg transition-all duration-200 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-700/50 dark:text-emerald-300 dark:hover:text-lime-300 dark:hover:bg-emerald-800/40">→ JavaScript</Link>
                    <Link href="/docs/best-practices/solid" className="text-sm px-3 py-2 rounded-lg transition-all duration-200 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-700/50 dark:text-emerald-300 dark:hover:text-lime-300 dark:hover:bg-emerald-800/40">→ SOLID</Link>
                  </div>
                </div>
              }
            />

            {/* Build Your Own X Card - Larger position */}
            <GridItem
              area="md:[grid-area:4/1/7/7]"
              href="/docs/build-your-own-x/cloud-architectural-patterns"
              icon={
                <svg className="w-5 h-5 text-black dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              }
              title="Build Your Own X"
              description={
                <div className="space-y-4">
                  <p className="text-sm">Hands-on tutorials to build fundamental systems from scratch - DNS clients, rate limiters, websockets, and more.</p>
                  <div className="flex flex-col gap-2">
                    <Link href="/docs/build-your-own-x/networking" className="text-sm px-3 py-2 rounded-lg transition-all duration-200 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-700/50 dark:text-emerald-300 dark:hover:text-lime-300 dark:hover:bg-emerald-800/40">→ Networking</Link>
                    <Link href="/docs/build-your-own-x/cloud-architectural-patterns" className="text-sm px-3 py-2 rounded-lg transition-all duration-200 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-700/50 dark:text-emerald-300 dark:hover:text-lime-300 dark:hover:bg-emerald-800/40">→ Cloud Patterns</Link>
                    <Link href="/docs/build-your-own-x/graphics" className="text-sm px-3 py-2 rounded-lg transition-all duration-200 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-700/50 dark:text-emerald-300 dark:hover:text-lime-300 dark:hover:bg-emerald-800/40">→ Graphics</Link>
                    <Link href="/docs/build-your-own-x/frontend" className="text-sm px-3 py-2 rounded-lg transition-all duration-200 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:border-emerald-700/50 dark:text-emerald-300 dark:hover:text-lime-300 dark:hover:bg-emerald-800/40">→ Frontend</Link>
                  </div>
                </div>
              }
            />

            {/* Learning Resources Card - Full width */}
            <GridItem
              area="md:[grid-area:4/7/6/13]"
              href="/docs/learning-resources/frontend/beginner/courses"
              icon={
                <svg className="w-5 h-5 text-black dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              title="Learning Resources"
              description="Curated courses, tutorials, and utilities to accelerate your learning journey."
            />

            {/* About Us Card */}
            <GridItem
              area="md:[grid-area:6/7/7/10]"
              href="/docs/about-us/why-we-exist"
              icon={
                <svg className="w-5 h-5 text-black dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              title="About Us"
              description="Our mission and values at CarbonTeq."
            />

            {/* Browse All Docs Card - Smallest emphasis */}
            <GridItem
              area="md:[grid-area:6/10/7/13]"
              href="/docs"
              icon={
                <svg className="w-5 h-5 text-black dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              }
              title="Browse All"
              description="Complete documentation library."
            />
          </ul>
        </div>
      </section>

      {/* Careers Section */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Join the CarbonTeq Team
          </h2>
          <p className="text-xl text-[#d0d0d0] mb-8">
            We're building the future of software development. Be part of a team that values innovation, 
            collaboration, and continuous learning.
          </p>
          
          <BackgroundGradient 
            containerClassName="mb-8"
            className="rounded-2xl p-8 bg-[#1a1a1a]/90 backdrop-blur-sm w-full"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Why CarbonTeq?</h3>
            <div className="grid md:grid-cols-3 gap-8 text-white">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-3 text-lg">Innovation First</h4>
                <p className="text-sm text-white/80 leading-relaxed">Work with cutting-edge technologies and push the boundaries of what's possible.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-3 text-lg">Team Culture</h4>
                <p className="text-sm text-white/80 leading-relaxed">Collaborate with passionate developers who share knowledge and support growth.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h4 className="font-semibold mb-3 text-lg">Growth Opportunities</h4>
                <p className="text-sm text-white/80 leading-relaxed">Continuous learning, mentorship, and career advancement in a supportive environment.</p>
              </div>
            </div>
          </BackgroundGradient>

          <div className="space-y-4">
            <GlowButton 
              className="transform hover:scale-105"
              proximity={30}
              spread={25}
              variant="default"
            >
              View Open Positions
            </GlowButton>
            <p className="text-[#a0a0a0] text-sm">
              Don't see a perfect fit? Send us your resume anyway - we're always looking for exceptional talent.
            </p>
          </div>
        </div>
      </section>
    </div>
    </SmoothScroll>
  );
}
