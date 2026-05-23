import { motion, useScroll, useSpring, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Github, Linkedin, Mail, MapPin, Phone, ExternalLink, ChevronDown, Terminal, Palette, Database, Layers, Moon, Sun, Download, Code2, Copy, Check, Bot, Cpu, Sparkles, BrainCircuit, Rocket, ArrowUp } from 'lucide-react';
import { RESUME_DATA } from './constants';
import { cn } from './lib/utils';
import React, { useEffect, useState, useMemo, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function useMagnetic(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = el.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;

      if (Math.abs(distanceX) < width && Math.abs(distanceY) < height) {
        gsap.to(el, {
          x: distanceX * 0.2,
          y: distanceY * 0.2,
          duration: 0.4,
          ease: "power2.out"
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
    };

    window.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref]);
}

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [copied, setCopied] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const roles = useMemo(() => [
    {
      title: "Full Stack Developer",
      description: "specialized in building high-performance scalable web applications with a focus on seamless user interfaces and robust architectures."
    },
    {
      title: "UI/UX Designer",
      description: "dedicated to crafting intuitive, conversion-focused digital experiences that harmonize aesthetic elegance with functional precision."
    }
  ], []);

  // Typewriter effect for name
  useEffect(() => {
    const fullName = "Caleb Kolawole";
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullName.length) {
        setDisplayName(fullName.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Role rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [roles.length]);

  // High performance DOM Custom Cursor using GSAP quickTo (Bypasses React renders entirely!)
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const ring = cursorRingRef.current;
    const dot = cursorDotRef.current;
    if (!ring || !dot) return;

    gsap.set(ring, { xPercent: -50, yPercent: -50, opacity: 1 });
    gsap.set(dot, { xPercent: -50, yPercent: -50, opacity: 1 });

    const xRingTo = gsap.quickTo(ring, "x", { duration: 0.25, ease: "power3.out" });
    const yRingTo = gsap.quickTo(ring, "y", { duration: 0.25, ease: "power3.out" });
    const xDotTo = gsap.quickTo(dot, "x", { duration: 0.05, ease: "power3.out" });
    const yDotTo = gsap.quickTo(dot, "y", { duration: 0.05, ease: "power3.out" });

    const handleMouseMoveCursor = (e: MouseEvent) => {
      xRingTo(e.clientX);
      yRingTo(e.clientY);
      xDotTo(e.clientX);
      yDotTo(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMoveCursor, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMoveCursor);
    };
  }, []);

  // High performance DOM Scroll Progress Bar & ScrollToTop Button visibility (Bypasses Framer Motion state scroll loops!)
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScrollProgress = () => {
      const bar = progressBarRef.current;
      const scrollY = window.scrollY;

      // Scroll visibility for top button
      if (scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      // Progress bar percentage
      if (bar) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = totalHeight > 0 ? scrollY / totalHeight : 0;
        bar.style.transform = `scaleX(${pct})`;
      }

      // Active Section highlights
      const sections = ['hero', 'about', 'skills', 'experience', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top >= -150 && rect.top <= 350;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScrollProgress, { passive: true });
    handleScrollProgress();
    return () => window.removeEventListener("scroll", handleScrollProgress);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(RESUME_DATA.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    gsap.to(window, {
      duration: 1.2,
      scrollTo: { y: `#${id}`, autoKill: false },
      ease: "power3.inOut"
    });
  };

  const scrollToTop = () => {
    gsap.to(window, {
      duration: 1.0,
      scrollTo: { y: 0, autoKill: false },
      ease: "power3.inOut"
    });
  };

  const magneticCTA = useRef<HTMLButtonElement>(null);
  const magneticMail = useRef<HTMLDivElement>(null);
  useMagnetic(magneticCTA);
  useMagnetic(magneticMail);

  return (
    <div className={cn(
      "relative min-h-screen transition-colors duration-300 selection:bg-white selection:text-black cursor-none",
      theme === 'light' && "selection:bg-black selection:text-white"
    )}>
      {/* High-Performance Custom Cursor (Pure DOM & GPU Accelerated) */}
      <div 
        ref={cursorRingRef}
        className="fixed top-0 left-0 w-8 h-8 border border-green-500/50 rounded-full pointer-events-none z-[100] hidden md:block opacity-0"
        style={{ transform: "translate3d(-50%, -50%, 0)" }}
      />
      <div 
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-green-500 rounded-full pointer-events-none z-[100] hidden md:block opacity-0"
        style={{ transform: "translate3d(-50%, -50%, 0)" }}
      />

      {/* High-Performance Scroll Progress Bar */}
      <div
        ref={progressBarRef}
        className="fixed top-0 left-0 right-0 h-1 z-[60] origin-left transition-transform duration-75"
        style={{ 
          transform: 'scaleX(0)',
          backgroundColor: theme === 'light' ? '#22c55e' : '#22c55e' 
        }}
      />

      <div className="fixed inset-0 noise z-50 pointer-events-none" />
      
      {/* Dynamic Grid Background with Glows and Tech Intersections */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Subtle, glowing tech intersection nodes in green */}
        <div className="absolute inset-0 opacity-[0.2] dark:opacity-[0.25]">
          <div className="absolute top-[12%] left-[25%] w-2 h-2 rounded-full bg-green-500 blur-[2px] animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute top-[38%] left-[78%] w-2.5 h-2.5 rounded-full bg-green-400 blur-[2px] animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute top-[62%] left-[12%] w-2 h-2 rounded-full bg-green-600 blur-[2px] animate-pulse" style={{ animationDuration: '5s' }} />
          <div className="absolute top-[88%] left-[64%] w-3 h-3 rounded-full bg-green-500 blur-[3px] animate-pulse" style={{ animationDuration: '7s' }} />
        </div>
        
        {/* Technical Grid Lines */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
          backgroundImage: `
            linear-gradient(to right, var(--text) 1px, transparent 1px),
            linear-gradient(to bottom, var(--text) 1px, transparent 1px)
          `,
          backgroundSize: '120px 120px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 95%)'
        }} />

        {/* Dynamic ambient green background clouds */}
        <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-green-500/[0.04] dark:bg-green-500/[0.03] blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[45%] right-[-15%] w-[800px] h-[800px] rounded-full bg-green-600/[0.03] dark:bg-green-600/[0.02] blur-[200px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[-10%] left-[5%] w-[900px] h-[900px] rounded-full bg-green-500/[0.04] dark:bg-green-950/[0.03] blur-[180px]" />
      </div>
      
      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-[95%] md:max-w-7xl px-4 md:px-10 flex items-center justify-between pointer-events-none gap-4">
        {/* Left: Initials */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="pointer-events-auto h-14 w-14 rounded-2xl bg-card border border-border backdrop-blur-md flex items-center justify-center group cursor-pointer shadow-sm shrink-0"
        >
          <span className="font-display font-bold text-lg tracking-tighter text-green-500 group-hover:scale-110 transition-transform">CK</span>
        </motion.div>
 
        {/* Center: Tabs */}
        <div className="hidden md:flex items-center gap-10 bg-card border border-border rounded-2xl px-10 h-14 pointer-events-auto shadow-sm backdrop-blur-md">
          {[
            { id: 'hero', label: 'Intro' },
            { id: 'about', label: 'About' },
            { id: 'skills', label: 'Stack' },
            { id: 'experience', label: 'Story' },
            { id: 'contact', label: 'Connect' }
          ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleSmoothScroll(e, item.id)}
                className={cn(
                  "text-[10px] uppercase tracking-widest transition-all hover:text-text hover:scale-110",
                  activeSection === item.id ? "text-text font-bold" : "text-text-muted font-medium"
                )}
              >
                {item.label}
              </a>
          ))}
        </div>
 
        {/* Right: Theme Toggle */}
        <motion.button 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={toggleTheme}
          className="pointer-events-auto h-14 w-14 rounded-2xl bg-card border border-border backdrop-blur-md flex items-center justify-center text-text/40 hover:text-text hover:border-text/20 transition-all group shadow-sm shrink-0"
          aria-label="Toggle Theme"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 45, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center relative px-4 sm:px-6 overflow-hidden">
        
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="text-center z-10 w-full max-w-5xl mx-auto flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-text/5 border border-border rounded-full mb-8">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] uppercase tracking-wider text-text/60">Available for collaborations</span>
          </div>
          
          <h1 className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6 flex flex-col w-full text-center px-2">
            <span className="text-text-muted uppercase text-xs sm:text-sm md:text-base tracking-[0.4em] font-medium mb-4 flex items-center justify-center gap-2 sm:gap-4">
              <Sparkles size={16} className="text-yellow-500 animate-pulse shrink-0" />
              Crafting digital experiences
              <Sparkles size={16} className="text-yellow-500 animate-pulse shrink-0" />
            </span>
            <span className="text-text break-words">
              {displayName}
              <motion.span 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-1.5 h-10 sm:h-16 md:h-20 bg-green-500 align-middle ml-2"
              />
            </span>
          </h1>
          
          <div className="min-h-[7rem] sm:min-h-[5rem] mb-12 flex items-center justify-center w-full px-2">
            <AnimatePresence mode="wait">
              <motion.p 
                key={roleIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="max-w-2xl mx-auto text-text-secondary text-sm sm:text-base md:text-xl leading-relaxed font-light"
              >
                I'm a <span className="text-text font-medium">{roles[roleIndex].title}</span> {roles[roleIndex].description}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
            <a 
              href={RESUME_DATA.resumeUrl} 
              download="Caleb_Kolawole_Resume.pdf"
              className="flex items-center gap-2 bg-text text-bg px-10 py-4 rounded-full text-sm font-bold hover:bg-green-500 hover:text-white transition-all hover:scale-105 active:scale-95 group shadow-xl shadow-text/5 cursor-pointer"
            >
              <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" />
              Download Resume
            </a>
            <div className="flex items-center gap-6 text-text/40">
              <a href={RESUME_DATA.github} className="hover:text-green-500 transition-all hover:scale-110" target="_blank" rel="noreferrer"><Github size={24} /></a>
              <a href={RESUME_DATA.linkedin} className="hover:text-green-500 transition-all hover:scale-110" target="_blank" rel="noreferrer"><Linkedin size={24} /></a>
              <a href={`mailto:${RESUME_DATA.email}`} className="hover:text-green-500 transition-all hover:scale-110" title="Email Direct Link"><Mail size={24} /></a>
            </div>
          </div>
        </motion.div>

        <motion.a 
          href="#about"
          onClick={(e) => handleSmoothScroll(e, 'about')}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-text/20 hover:text-green-500 transition-colors cursor-pointer p-4 z-10"
        >
          <ChevronDown size={24} />
        </motion.a>
      </section>

      <AIDivider />

      {/* About Section */}
      <section id="about" className="py-10 sm:py-16 md:py-24 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 md:order-1"
          >
            <span className="text-text-muted uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block">The Architect</span>
            <h2 className="font-display text-3xl sm:text-5xl md:text-7xl font-medium text-text mb-6 tracking-tighter">Beyond the bits<br/>and bytes.</h2>
            <p className="text-text-secondary text-sm sm:text-base md:text-lg leading-relaxed mb-8 font-light italic">
              "{RESUME_DATA.about.story}"
            </p>
            
            {/* Unified Compact Details Panel */}
            <div className="mt-6 bg-card border border-border p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.01] to-transparent pointer-events-none" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {[
                  { label: 'Name', value: RESUME_DATA.about.details.name, icon: <Bot size={13} /> },
                  { label: 'Born', value: RESUME_DATA.about.details.dob, icon: <Sparkles size={13} /> },
                  { label: 'Location', value: RESUME_DATA.about.details.address, icon: <MapPin size={13} /> },
                  { label: 'Zip', value: RESUME_DATA.about.details.zip, icon: <Terminal size={13} /> },
                  { label: 'Email', value: RESUME_DATA.about.details.email, href: `mailto:${RESUME_DATA.about.details.email}`, icon: <Mail size={13} /> },
                  { label: 'Phone', value: RESUME_DATA.about.details.phone, href: `tel:${RESUME_DATA.about.details.phone}`, icon: <Phone size={13} /> },
                ].map(item => {
                  const content = (
                    <div className="group/item flex items-center gap-3 min-w-0 text-left">
                      <div className="w-8 h-8 rounded-lg bg-bg border border-border/60 flex items-center justify-center text-green-500 shrink-0 group-hover/item:border-green-500/30 group-hover/item:scale-105 transition-all">
                        {item.icon}
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0 text-left">
                        <span className="block text-[8px] uppercase tracking-[0.25em] text-text-muted font-bold">{item.label}</span>
                        <span className="text-xs sm:text-sm font-medium text-text truncate group-hover/item:text-green-500 transition-colors">{item.value}</span>
                      </div>
                    </div>
                  );

                  if (item.href) {
                    return (
                      <a key={item.label} href={item.href} className="block transition-all hover:opacity-90">
                        {content}
                      </a>
                    );
                  }

                  return <div key={item.label}>{content}</div>;
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-8 border-t border-border/10 pt-8">
              {RESUME_DATA.about.stats.map(stat => (
                <div key={stat.label}>
                  <span className="block text-2xl sm:text-3xl font-display font-medium text-text mb-1">{stat.value}</span>
                  <span className="text-[8px] sm:text-[10px] uppercase tracking-widest text-text/30 font-bold leading-none">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative order-1 md:order-2 group"
          >
            <div className="aspect-[4/5] rounded-[2rem] sm:rounded-[3rem] overflow-hidden border-2 border-border/20 shadow-2xl transition-all duration-500 group-hover:shadow-text/10 relative">
              <img 
                src={RESUME_DATA.about.image} 
                alt="Caleb Kolawole" 
                className="w-full h-full object-cover grayscale-0 opacity-100 group-hover:grayscale group-hover:opacity-80 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              {/* Scanning Effect Overlay */}
              <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-px bg-green-500/40 z-10 pointer-events-none shadow-[0_0_15px_rgba(34,197,94,0.5)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent pointer-events-none" />
            </div>
            
            {/* Robot Floating Illustration */}
            <motion.div 
               animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -top-10 -right-10 w-24 h-24 bg-card border border-border rounded-3xl backdrop-blur-xl flex items-center justify-center text-text/40 shadow-xl"
            >
               <Bot size={40} className="group-hover:text-text group-hover:scale-110 transition-all duration-500" />
            </motion.div>
            
            {/* Brain/Circuit Illustration */}
            <motion.div 
               animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -bottom-10 -left-10 w-24 h-24 bg-card border border-border rounded-3xl backdrop-blur-xl flex items-center justify-center text-text/40 shadow-xl"
            >
               <BrainCircuit size={40} className="group-hover:text-text group-hover:scale-110 transition-all duration-500" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <AIDivider />

      {/* Skills Section - Bento Grid Style */}
      <section id="skills" className="py-12 sm:py-16 md:py-24 bg-bg relative overflow-hidden px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <span className="text-text-muted uppercase tracking-[0.2em] text-[10px] font-bold mb-4 block">Proven Experience</span>
            <h2 className="font-display text-4xl md:text-5xl font-medium text-text">My Preferred Stack</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <SkillCard 
                title="Frontend Engineering" 
                icon={<Palette size={20} />} 
                items={RESUME_DATA.skills.frontend} 
                className="md:col-span-2"
                theme={theme}
             />
             <SkillCard 
                title="Systems & Backend" 
                icon={<Database size={20} />} 
                items={RESUME_DATA.skills.backend} 
                theme={theme}
             />
             <SkillCard 
                title="DevOps & Tooling" 
                icon={<Terminal size={20} />} 
                items={RESUME_DATA.skills.tools} 
                className="md:col-span-3"
                theme={theme}
             />
          </div>
        </div>
      </section>

      <AIDivider />

      {/* Experience Section */}
      <section id="experience" className="py-10 sm:py-16 md:py-24 px-4 sm:px-6 md:px-10 max-w-6xl mx-auto">
        <div className="mb-10 sm:mb-16">
          <div className="flex items-center gap-2 text-text-muted uppercase tracking-[0.2em] text-[10px] font-bold mb-3 justify-center md:justify-start">
            <Layers size={12} className="text-green-500 animate-pulse" />
            <span>Professional Milestones</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-medium text-text tracking-tighter text-center md:text-left">My Career Journey</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {RESUME_DATA.experience.map((exp, idx) => (
            <motion.div
              key={exp.company + idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.05, duration: 0.6 }}
              className="bg-card/50 border border-border rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 hover:border-green-500/20 transition-all duration-500 group relative overflow-hidden shadow-lg shadow-black/20"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] text-green-500 transition-opacity">
                <Cpu size={80} />
              </div>
              
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <span className="text-[10px] uppercase font-bold tracking-widest text-text-muted px-4 py-1.5 rounded-full border border-border bg-bg/50">
                  {exp.period}
                </span>
                <Sparkles size={14} className="text-text-muted group-hover:text-green-500 group-hover:scale-125 transition-all" />
              </div>

              <h3 className="text-xl sm:text-2xl font-medium text-text mb-2">{exp.role}</h3>
              <p className="text-text-secondary text-xs sm:text-sm mb-6 sm:mb-8 flex items-center gap-2 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {exp.company} — {exp.location}
              </p>
              
              <ul className="space-y-3 sm:space-y-4 relative z-10 w-full">
                {exp.details.map((detail, dIdx) => (
                  <li key={dIdx} className="text-text-secondary text-xs sm:text-sm leading-relaxed font-light flex items-start gap-3 sm:gap-4">
                    <div className="w-4 h-[1px] bg-green-500/30 mt-2.5 shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      <AIDivider />

      {/* Contact Section */}
      <section id="contact" className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-10 bg-card border-t border-border overflow-hidden relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
            <div className="space-y-8 sm:space-y-12">
              <h2 className="font-display text-4xl sm:text-6xl md:text-8xl font-medium text-text tracking-tighter leading-none">Let's start<br />a talk.</h2>
              <p className="text-text-secondary text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-md">
                Have a project in mind? Looking to collaborate? Or just want to say hi? Drop me a message and let's build something exceptional.
              </p>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Transmission dispatched! Thank you for reaching out, Caleb will be in touch shortly.");
                }}
                className="space-y-4 sm:space-y-6 relative z-10 w-full"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="NAME" 
                      required
                      className="bg-card border-2 border-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-[10px] tracking-widest font-bold focus:border-green-500/50 outline-none transition-all w-full text-text shadow-lg focus:shadow-green-500/5 placeholder:text-text-muted"
                    />
                  </div>
                  <div className="relative">
                    <input 
                      type="email" 
                      placeholder="EMAIL" 
                      required
                      className="bg-card border-2 border-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-[10px] tracking-widest font-bold focus:border-green-500/50 outline-none transition-all w-full text-text shadow-lg focus:shadow-green-500/5 placeholder:text-text-muted"
                    />
                  </div>
                </div>
                <div className="relative">
                  <textarea 
                    placeholder="MESSAGE" 
                    rows={5}
                    required
                    className="bg-card border-2 border-border rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-[10px] tracking-widest font-bold focus:border-green-500/50 outline-none transition-all w-full text-text shadow-lg focus:shadow-green-500/5 resize-none placeholder:text-text-muted"
                  ></textarea>
                </div>
                <button 
                  ref={magneticCTA}
                  type="submit"
                  className="bg-text text-bg w-full py-5 sm:py-6 rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-6 text-[10px] tracking-[0.4em] uppercase hover:bg-green-500 hover:text-white transition-all hover:scale-[1.01] active:scale-[0.99] shadow-2xl shadow-text/10 flex items-center justify-center gap-4 group cursor-pointer"
                >
                  Initialize Transmission
                  <Rocket size={16} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="flex flex-wrap gap-4 sm:gap-8 pt-4">
                <div ref={magneticMail} className="flex items-center gap-4 group cursor-pointer" onClick={copyEmail} title="Click to copy email">
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-muted group-hover:text-green-500 group-hover:border-green-500/20 transition-all shrink-0">
                    {copied ? <Check size={14} className="text-green-500 animate-bounce" /> : <Mail size={14} />}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-text-muted group-hover:text-green-500 min-w-0 break-all">{RESUME_DATA.email}</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center relative">
               <motion.div
                initial={{ opacity: 0, scale: 0.95, rotate: -5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                whileHover={{ scale: 1.01 }}
                viewport={{ once: true }}
                className="relative group w-full max-w-sm"
              >
                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border-2 border-border/20 shadow-2xl transition-all duration-500 group-hover:shadow-green-500/10 relative">
                  <img 
                    src={RESUME_DATA.about.image} 
                    alt="Caleb Kolawole" 
                    className="w-full h-full object-cover grayscale-0 opacity-100 group-hover:grayscale group-hover:opacity-80 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  {/* Scanning Effect Overlay */}
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-px bg-green-500/40 z-10 pointer-events-none shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent pointer-events-none" />
                </div>
                
                {/* Floating Rocket Illustration */}
                <motion.div 
                   animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute -top-10 -right-10 w-28 h-28 bg-card border border-border rounded-3xl backdrop-blur-xl flex items-center justify-center text-green-500 shadow-xl"
                >
                   <Rocket size={48} className="group-hover:scale-125 transition-all duration-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                </motion.div>
                
                {/* Secondary AI Accent */}
                <motion.div 
                   animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
                   transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute -bottom-10 -left-10 w-24 h-24 bg-card border border-border rounded-3xl backdrop-blur-xl flex items-center justify-center text-text/40 shadow-xl relative overflow-hidden"
                >
                   <Cpu size={40} className="group-hover:text-green-500 group-hover:scale-110 transition-all duration-500" />
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          <footer className="mt-16 sm:mt-24 pt-8 sm:pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-8 md:gap-12 relative w-full">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:flex gap-4 opacity-5">
               {Array.from({ length: 40 }).map((_, i) => (
                 <div key={i} className="h-4 w-[1px] bg-text" />
               ))}
            </div>

            <div className="flex flex-col items-center md:items-start gap-4">
              <span className="text-text-muted text-[10px] uppercase tracking-widest flex items-center gap-2">
                <Bot size={12} className="text-green-500" />
                © 2026 Caleb Kolawole
              </span>
              <span className="text-text-muted opacity-50 text-[9px] uppercase tracking-[0.4em] text-center md:text-left">Integrated Intelligence Enabled</span>
            </div>
            
            <div className="flex items-center gap-8 order-1 md:order-2 w-full md:w-auto justify-between md:justify-end">
               <div className="flex items-center gap-8">
                  <a href="#" className="text-text-muted text-[10px] uppercase tracking-widest hover:text-green-500 transition-colors">Terms</a>
                  <a href="#" className="text-text-muted text-[10px] uppercase tracking-widest hover:text-green-500 transition-colors">Privacy</a>
               </div>
               <div className="flex items-center gap-4">
                  <span className="hidden md:inline text-text-muted text-[10px] uppercase tracking-widest">GMT +1</span>
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)] animate-pulse" />
               </div>
            </div>
          </footer>
        </div>
      </section>

      {/* Floating Scroll to Top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-card border border-border shadow-2xl flex items-center justify-center text-green-500 hover:text-white hover:bg-green-500 hover:scale-110 active:scale-95 transition-all cursor-pointer group"
            aria-label="Scroll to Top"
          >
            <ArrowUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function AIDivider() {
  return (
    <div className="py-6 sm:py-10 md:py-12 flex items-center justify-center gap-12 overflow-hidden opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-text-muted to-transparent" />
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="shrink-0"
      >
        <Cpu size={24} className="text-text-muted hover:text-text transition-colors" />
      </motion.div>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-text-muted to-transparent" />
    </div>
  );
}

function SkillCard({ title, icon, items, className, theme }: { title: string, icon: ReactNode, items: string[], className?: string, theme: 'dark' | 'light' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn(
        "p-6 sm:p-10 bg-card border border-border rounded-2xl sm:rounded-[2rem] group hover:border-green-500/20 transition-all duration-500 relative overflow-hidden shadow-md",
        className
      )}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-green-500/[0.01] to-transparent group-hover:from-green-500/[0.03] transition-all" />

      <div className="flex items-center gap-4 text-text/60 mb-6 sm:mb-10 group-hover:text-text transition-colors relative z-10 w-full">
        <motion.div 
          whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
          className="w-10 h-10 rounded-xl bg-bg border border-border flex items-center justify-center group-hover:scale-110 group-hover:border-green-500/30 transition-all shadow-sm shrink-0"
        >
          {icon}
        </motion.div>
        <h3 className="font-display font-semibold uppercase tracking-[0.2em] text-[10px] pr-2 truncate">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-3 relative z-10 w-full">
        {items.map((item, idx) => (
          <motion.span 
            key={item} 
            whileHover={{ 
              scale: 1.05, 
              y: -2,
              transition: { type: "spring", stiffness: 300, damping: 15 }
            }}
            className="px-3.5 py-2 sm:px-5 sm:py-2.5 bg-text/5 border border-border rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-light text-text-secondary hover:text-green-500 hover:bg-green-500/[0.02] hover:border-green-500/20 transition-all cursor-default"
          >
            {item}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
