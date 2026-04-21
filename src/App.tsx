import { motion, useScroll, useSpring, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Github, Linkedin, Mail, MapPin, Phone, ExternalLink, ChevronDown, Terminal, Palette, Database, Layers, Moon, Sun, Download, Code2, Copy, Check, Bot, Cpu, Sparkles, BrainCircuit, Rocket } from 'lucide-react';
import { RESUME_DATA } from './constants';
import { cn } from './lib/utils';
import { useEffect, useState, useMemo, type ReactNode } from 'react';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [filterTech, setFilterTech] = useState<string | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);

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

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const cursorX = useSpring(mouseX, { stiffness: 1000, damping: 50, mass: 0.1 });
  const cursorY = useSpring(mouseY, { stiffness: 1000, damping: 50, mass: 0.1 });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const blobY1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const blobY2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const allTech = useMemo(() => {
    const techs = new Set<string>();
    RESUME_DATA.projects.forEach(p => p.tech.forEach(t => techs.add(t)));
    return Array.from(techs);
  }, []);

  const filteredProjects = useMemo(() => {
    if (!filterTech) return RESUME_DATA.projects;
    return RESUME_DATA.projects.filter(p => p.tech.includes(filterTech));
  }, [filterTech]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'projects', 'skills', 'experience', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top >= -100 && rect.top <= 400;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(RESUME_DATA.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "relative min-h-screen transition-colors duration-300 selection:bg-white selection:text-black cursor-none",
      theme === 'light' && "selection:bg-black selection:text-white"
    )}>
      {/* Custom Cursor */}
      <motion.div 
        className="fixed top-0 left-0 w-6 h-6 border border-text/40 rounded-full pointer-events-none z-[100] hidden md:block"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div 
        className="fixed top-0 left-0 w-1 h-1 bg-text rounded-full pointer-events-none z-[100] hidden md:block"
        style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
      />

      {/* Dotted Grid Background */}
      <motion.div 
        style={{ y: gridY }}
        className="fixed inset-0 bg-dot-grid z-0 pointer-events-none" 
      />

      {/* Animated Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          style={{ y: blobY1 }}
          animate={{ x: [0, 100, 0] }}
          whileHover={{ scale: 1.2, opacity: 0.2 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] -left-[5%] w-96 h-96 bg-blue-500/10 blob cursor-pointer pointer-events-auto"
        />
        <motion.div 
          style={{ y: blobY2 }}
          animate={{ x: [0, -80, 0] }}
          whileHover={{ scale: 1.2, opacity: 0.2 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[20%] -right-[10%] w-[500px] h-[500px] bg-purple-500/10 blob cursor-pointer pointer-events-auto"
        />
      </div>

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 z-[60] origin-left"
        style={{ scaleX, backgroundColor: theme === 'light' ? '#000' : '#fff' }}
      />

      <div className="fixed inset-0 noise z-50 pointer-events-none" />
      
      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-[95%] md:max-w-7xl px-4 md:px-10 flex items-center justify-between pointer-events-none">
        {/* Left: Initials */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="pointer-events-auto h-12 w-12 rounded-2xl bg-card border border-border backdrop-blur-md flex items-center justify-center group cursor-pointer shadow-sm"
        >
          <span className="font-display font-bold text-lg tracking-tighter text-text group-hover:scale-110 transition-transform">CK</span>
        </motion.div>

        {/* Center: Tabs */}
        <div className="hidden md:flex items-center gap-8 bg-card/80 backdrop-blur-md border border-border rounded-full px-6 py-2.5 pointer-events-auto shadow-sm">
          {[
            { id: 'hero', label: 'Intro' },
            { id: 'about', label: 'About' },
            { id: 'projects', label: 'Work' },
            { id: 'skills', label: 'Stack' },
            { id: 'experience', label: 'Story' },
            { id: 'contact', label: 'Connect' }
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                "text-[10px] uppercase tracking-widest transition-colors hover:text-text",
                activeSection === item.id ? "text-text font-bold" : "text-text/40 font-medium"
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
          className="pointer-events-auto h-[46px] w-[46px] rounded-full bg-card/80 border border-border backdrop-blur-md flex items-center justify-center text-text/40 hover:text-text hover:border-text/20 transition-all group shadow-sm"
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
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center relative px-6 overflow-hidden">
        <div className="absolute inset-0 glow pointer-events-none" />
        
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="text-center z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-text/5 border border-border rounded-full mb-8">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] uppercase tracking-wider text-text/60">Available for collaborations</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-9xl font-bold tracking-tighter mb-6 flex flex-col">
            <span className="text-text/40 uppercase text-lg md:text-xl tracking-[0.4em] font-medium mb-4 flex items-center justify-center gap-4">
              <Sparkles size={20} className="text-yellow-500 animate-pulse" />
              Crafting digital experiences
              <Sparkles size={20} className="text-yellow-500 animate-pulse" />
            </span>
            <span className="text-text">
              {displayName}
              <motion.span 
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-1 h-12 md:h-20 bg-text align-middle ml-2"
              />
            </span>
          </h1>
          
          <div className="h-24 md:h-20 mb-12 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p 
                key={roleIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="max-w-2xl mx-auto text-text/50 text-base md:text-xl leading-relaxed font-light"
              >
                I'm a <span className="text-text">{roles[roleIndex].title}</span> {roles[roleIndex].description}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href={RESUME_DATA.resumeUrl} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 bg-text text-bg px-10 py-4 rounded-full text-sm font-bold hover:opacity-90 transition-all hover:scale-105 active:scale-95 group shadow-xl shadow-text/5"
            >
              <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" />
              Download Resume
            </a>
            <div className="flex items-center gap-6 text-text/40">
              <a href={RESUME_DATA.github} className="hover:text-text transition-all hover:scale-110" target="_blank" rel="noreferrer"><Github size={24} /></a>
              <a href={RESUME_DATA.linkedin} className="hover:text-text transition-all hover:scale-110" target="_blank" rel="noreferrer"><Linkedin size={24} /></a>
              <a href={`mailto:${RESUME_DATA.email}`} className="hover:text-text transition-all hover:scale-110"><Mail size={24} /></a>
            </div>
          </div>
        </motion.div>

        <motion.a 
          href="#about"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-text/20 hover:text-text transition-colors cursor-pointer p-4 z-10"
        >
          <ChevronDown size={24} />
        </motion.a>
      </section>

      <AIDivider />

      {/* About Section */}
      <section id="about" className="py-32 px-6 max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 md:order-1"
          >
            <span className="text-text/30 uppercase tracking-[0.3em] text-[10px] font-bold mb-6 block">The Architect</span>
            <h2 className="font-display text-4xl md:text-7xl font-medium text-text mb-8 tracking-tighter">Beyond the bits<br/>and bytes.</h2>
            <p className="text-text/50 text-lg md:text-xl leading-relaxed mb-10 font-light">
              {RESUME_DATA.about.story}
            </p>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-12 mt-12 bg-card/30 p-8 rounded-[2rem] border border-border/10 backdrop-blur-sm">
              {[
                { label: 'Name', value: RESUME_DATA.about.details.name },
                { label: 'Date of Birth', value: RESUME_DATA.about.details.dob },
                { label: 'Address', value: RESUME_DATA.about.details.address },
                { label: 'Zip Code', value: RESUME_DATA.about.details.zip },
                { label: 'Email', value: RESUME_DATA.about.details.email },
                { label: 'Phone', value: RESUME_DATA.about.details.phone },
              ].map(item => (
                <div key={item.label}>
                  <span className="block text-[10px] uppercase tracking-widest text-text/30 font-bold mb-1">{item.label}</span>
                  <span className="text-sm font-medium text-text/80">{item.value}</span>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-3 gap-8 mt-12 border-t border-border/10 pt-12">
              {RESUME_DATA.about.stats.map(stat => (
                <div key={stat.label}>
                  <span className="block text-3xl font-display font-medium text-text mb-1">{stat.value}</span>
                  <span className="text-[10px] uppercase tracking-widest text-text/30 font-bold">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            whileHover={{ rotate: 3, scale: 1.02 }}
            viewport={{ once: true }}
            className="relative order-1 md:order-2 group"
          >
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border-2 border-border/20 shadow-2xl transition-all duration-500 group-hover:shadow-text/10 relative">
              <img 
                src={RESUME_DATA.about.image} 
                alt="Caleb Kolawole" 
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              {/* Scanning Effect Overlay */}
              <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-px bg-text/20 z-10 pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.5)]"
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

      {/* Projects Section */}
      <section id="projects" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-10">
          <div>
            <span className="text-text/30 uppercase tracking-[0.2em] text-[10px] font-bold mb-4 block">Selected Works</span>
            <h2 className="font-display text-4xl md:text-6xl font-medium text-text">Digital Products</h2>
          </div>
          
          {/* Filtering mechanism */}
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setFilterTech(null)}
              className={cn(
                "px-5 py-2 rounded-full text-[10px] uppercase tracking-widest border transition-all",
                !filterTech ? "bg-text text-bg border-text font-bold" : "border-border text-text/40 hover:border-text/20"
              )}
            >
              All
            </button>
            {allTech.map(tech => (
              <button 
                key={tech}
                onClick={() => setFilterTech(prev => prev === tech ? null : tech)}
                className={cn(
                  "px-5 py-2 rounded-full text-[10px] uppercase tracking-widest border transition-all",
                  filterTech === tech ? "bg-text text-bg border-text font-bold" : "border-border text-text/40 hover:border-text/20"
                )}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                layout
                key={project.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: expandedProject === project.title ? 0 : -5 }}
                onClick={() => setExpandedProject(prev => prev === project.title ? null : project.title)}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className={cn(
                  "group relative bg-card border border-border rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-text/[0.03] cursor-pointer",
                  expandedProject === project.title && "md:col-span-2 ring-1 ring-text/10"
                )}
              >
                <div className="p-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map(t => (
                        <span key={t} className="text-[9px] uppercase tracking-widest text-text/40 border border-border px-3 py-1 rounded-full bg-bg/50">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                       <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()} 
                          className="p-3 rounded-full bg-bg border border-border text-text/40 hover:text-text hover:border-text/20 transition-all"
                          title="View Repository"
                       >
                          <Code2 size={16} />
                       </a>
                       <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()} 
                          className="p-3 rounded-full bg-text text-bg hover:opacity-90 transition-all flex items-center gap-2 px-5"
                          title="View Live Demo"
                       >
                          <span className="text-[10px] uppercase font-bold tracking-wider">Live Demo</span>
                          <ExternalLink size={14} />
                       </a>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="font-display text-3xl md:text-4xl font-medium mb-4 text-text">{project.title}</h3>
                    <AnimatePresence mode="wait">
                      {(expandedProject === project.title || true) && (
                        <motion.div
                          initial={false}
                          animate={{ 
                            height: expandedProject === project.title ? "auto" : "0",
                            opacity: expandedProject === project.title ? 1 : 0,
                            marginTop: expandedProject === project.title ? 24 : 0
                          }}
                          className="overflow-hidden"
                        >
                          <p className="text-text/60 text-lg leading-relaxed max-w-2xl mb-8">
                            {project.description} This project highlights my ability to architectural scale using {project.tech.join(", ")}. It focuses on delivering high-performance results with a clean, intuitive user experience.
                          </p>
                          
                          <div className="flex flex-wrap gap-10 border-t border-border pt-8">
                            <div>
                               <span className="block text-[10px] uppercase tracking-widest text-text/40 mb-2">Category</span>
                               <span className="text-sm font-medium text-text">Web Application</span>
                            </div>
                            <div>
                               <span className="block text-[10px] uppercase tracking-widest text-text/40 mb-2">Role</span>
                               <span className="text-sm font-medium text-text">Lead Developer</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!expandedProject && (
                      <p className="text-text/40 text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity mt-4 flex items-center gap-2">
                        <Cpu size={14} className="animate-spin-slow" />
                        Click to expand details
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="absolute top-0 right-0 p-10 pointer-events-none opacity-[0.03] group-hover:opacity-[0.07] transition-opacity text-text scale-[2.5]">
                  <Code2 className="w-24 h-24" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <AIDivider />

      {/* Skills Section - Bento Grid Style */}
      <section id="skills" className="py-32 bg-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-text/30 uppercase tracking-[0.2em] text-[10px] font-bold mb-4 block">Proven Experience</span>
            <h2 className="font-display text-4xl md:text-5xl font-medium text-text">Strategic Stack</h2>
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
      <section id="experience" className="py-32 px-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-20 text-text/30 uppercase tracking-[0.2em] text-[10px] font-bold">
          <Layers size={14} />
          <span>Professional Milestones</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {RESUME_DATA.experience.map((exp, idx) => (
            <motion.div
              key={exp.company + idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card/50 border border-border/50 rounded-[2.5rem] p-10 hover:border-text/10 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <Cpu size={80} />
              </div>
              
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] uppercase font-bold tracking-widest text-text/30 px-4 py-1.5 rounded-full border border-border bg-bg/50">
                  {exp.period}
                </span>
                <Sparkles size={14} className="text-text/20 group-hover:text-text/40 group-hover:scale-125 transition-all" />
              </div>

              <h3 className="text-2xl font-medium text-text mb-2">{exp.role}</h3>
              <p className="text-text/40 text-sm mb-8 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-text/20" />
                {exp.company} — {exp.location}
              </p>
              
              <ul className="space-y-4 relative z-10">
                {exp.details.map((detail, dIdx) => (
                  <li key={dIdx} className="text-text/50 text-sm leading-relaxed font-light flex items-start gap-4">
                    <div className="w-5 h-[1px] bg-text/20 mt-2.5 shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      <AIDivider />

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 bg-card border-t border-border overflow-hidden relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
            <div className="space-y-12">
              <h2 className="font-display text-5xl md:text-8xl font-medium text-text tracking-tighter leading-none">Let's start<br />a talk.</h2>
              <p className="text-text/40 text-lg font-light leading-relaxed max-w-md">
                Have a project in mind? Looking to collaborate? Or just want to say hi? Drop me a message and let's build something exceptional.
              </p>
              
              <form className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="NAME" 
                      className="bg-card border-2 border-border/50 rounded-3xl p-6 text-[10px] tracking-widest font-bold focus:border-blue-500/50 outline-none transition-all w-full text-text shadow-lg focus:shadow-blue-500/5 placeholder:text-text/20"
                    />
                  </div>
                  <div className="relative">
                    <input 
                      type="email" 
                      placeholder="EMAIL" 
                      className="bg-card border-2 border-border/50 rounded-3xl p-6 text-[10px] tracking-widest font-bold focus:border-blue-500/50 outline-none transition-all w-full text-text shadow-lg focus:shadow-blue-500/5 placeholder:text-text/20"
                    />
                  </div>
                </div>
                <div className="relative">
                  <textarea 
                    placeholder="MESSAGE" 
                    rows={5}
                    className="bg-card border-2 border-border/50 rounded-3xl p-6 text-[10px] tracking-widest font-bold focus:border-blue-500/50 outline-none transition-all w-full text-text shadow-lg focus:shadow-blue-500/5 resize-none placeholder:text-text/20"
                  ></textarea>
                </div>
                <button className="bg-text text-bg w-full py-6 rounded-[2.5rem] text-[10px] font-bold tracking-[0.4em] uppercase hover:bg-blue-600 hover:text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-text/10 flex items-center justify-center gap-4 group">
                  Initialize Transmission
                  <Rocket size={16} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              <div className="flex flex-wrap gap-8 pt-6">
                <div className="flex items-center gap-4 group cursor-pointer" onClick={copyEmail}>
                  <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text/40 group-hover:text-text transition-all">
                    {copied ? <Check size={14} className="text-green-500" /> : <Mail size={14} />}
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-text/30 group-hover:text-text/60">{RESUME_DATA.email}</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center relative">
               <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                whileHover={{ rotate: -3, scale: 1.02 }}
                viewport={{ once: true }}
                className="relative group w-full max-w-sm"
              >
                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border-2 border-border/20 shadow-2xl transition-all duration-500 group-hover:shadow-blue-500/10 relative">
                  <img 
                    src={RESUME_DATA.about.image} 
                    alt="Caleb Kolawole" 
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  {/* Scanning Effect Overlay */}
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-px bg-blue-500/40 z-10 pointer-events-none shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent pointer-events-none" />
                </div>
                
                {/* Floating Rocket Illustration */}
                <motion.div 
                   animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute -top-10 -right-10 w-28 h-28 bg-card border border-border rounded-3xl backdrop-blur-xl flex items-center justify-center text-blue-500 shadow-xl"
                >
                   <Rocket size={48} className="group-hover:scale-125 transition-all duration-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                </motion.div>
                
                {/* Secondary AI Accent */}
                <motion.div 
                   animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
                   transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute -bottom-10 -left-10 w-24 h-24 bg-card border border-border rounded-3xl backdrop-blur-xl flex items-center justify-center text-text/40 shadow-xl"
                >
                   <Cpu size={40} className="group-hover:text-text group-hover:scale-110 transition-all duration-500" />
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          <footer className="mt-40 pt-16 border-t border-border flex flex-col md:flex-row justify-between items-center gap-12 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4 opacity-5">
               {Array.from({ length: 40 }).map((_, i) => (
                 <div key={i} className="h-4 w-[1px] bg-text" />
               ))}
            </div>

            <div className="flex flex-col items-center md:items-start gap-4">
              <span className="text-text/20 text-[10px] uppercase tracking-widest flex items-center gap-2">
                <Bot size={12} className="text-text/40" />
                © 2026 Caleb Kolawole
              </span>
              <span className="text-text/10 text-[9px] uppercase tracking-[0.4em]">Integrated Intelligence Enabled</span>
            </div>
            
            <div className="flex items-center gap-8 order-1 md:order-2 w-full md:w-auto justify-between md:justify-end">
               <div className="flex items-center gap-8">
                  <a href="#" className="text-text/20 text-[10px] uppercase tracking-widest hover:text-text transition-colors">Terms</a>
                  <a href="#" className="text-text/20 text-[10px] uppercase tracking-widest hover:text-text transition-colors">Privacy</a>
               </div>
               <div className="flex items-center gap-4">
                  <span className="hidden md:inline text-text/20 text-[10px] uppercase tracking-widest">GMT +1</span>
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)] animate-pulse" />
               </div>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}

function AIDivider() {
  return (
    <div className="py-20 flex items-center justify-center gap-12 overflow-hidden opacity-10 grayscale hover:grayscale-0 hover:opacity-20 transition-all duration-1000">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-text to-transparent" />
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="shrink-0"
      >
        <Cpu size={24} className="text-text" />
      </motion.div>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-text to-transparent" />
    </div>
  );
}

function SkillCard({ title, icon, items, className, theme }: { title: string, icon: ReactNode, items: string[], className?: string, theme: 'dark' | 'light' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={cn(
        "p-10 bg-card border border-border rounded-[2rem] group hover:border-text/10 transition-all duration-500 relative overflow-hidden",
        className
      )}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-text/[0.01] to-transparent group-hover:from-text/[0.03] transition-all" />

      <div className="flex items-center gap-4 text-text/60 mb-10 group-hover:text-text transition-colors relative z-10">
        <motion.div 
          whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
          className="w-10 h-10 rounded-xl bg-bg border border-border flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"
        >
          {icon}
        </motion.div>
        <h3 className="font-display font-bold uppercase tracking-[0.2em] text-[10px]">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-3">
        {items.map((item, idx) => (
          <motion.span 
            key={item} 
            whileHover={{ 
              scale: 1.1, 
              y: -5,
              transition: { type: "spring", stiffness: 300, damping: 10 }
            }}
            className="px-5 py-2.5 bg-text/5 border border-border rounded-2xl text-xs font-light text-text/60 hover:text-text hover:bg-text/[1%] hover:border-text/20 transition-all cursor-default"
          >
            {item}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
