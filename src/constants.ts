import { Github, Linkedin, Mail, MapPin, Phone, ExternalLink } from 'lucide-react';

export const RESUME_DATA = {
  name: "Caleb Kolawole",
  role: "Full Stack Developer",
  email: "Kolawolebolarinwa771@gmail.com",
  location: "Lagos State, Nigeria",
  phone: "+2348139668474",
  github: "https://github.com/Caleb-Kolawole",
  linkedin: "https://linkedin.com/in/caleb-kolawole-24a462318/",
  website: "https://calebs-portfolio.netlify.app/",
  resumeUrl: "/resume.pdf", // Placeholder
  about: {
    story: "I thrive on challenges and love exploring new technologies to stay ahead of the curve. From HTML to JavaScript frameworks like React and Vue.js, I'm always up for a coding adventure.",
    image: "https://picsum.photos/seed/caleb/600/800",
    details: {
      name: "Caleb Kolawole",
      dob: "October 10, 2003",
      address: "Lagos, Nigeria",
      zip: "106104",
      email: "kolawolebolarinwa771@gmail.com",
      phone: "+2348139668474"
    },
    stats: [
      { label: "Years Experience", value: "4+" },
      { label: "Projects Delivered", value: "20+" },
      { label: "Code Commits", value: "2k+" }
    ]
  },
  summary: "Full Stack Developer with 4+ years of hands-on experience building scalable web apps. Known for creating clean, responsive designs and delivering back-end solutions that scale. A team player with strong communication skills and a passion for learning.",
  experience: [
    {
      company: "Koolboks",
      role: "Full Stack Developer",
      period: "Jan 2025 - Nov 2025",
      location: "Lagos, Nigeria",
      details: [
        "Built a staff management system that allowed team leads to onboard new members, assign roles and tasks, organize departments, and track task completion.",
        "Managed and automated internal operations using Zoho tools (Forms, CRM, Surveys, Workflow Automations)."
      ]
    },
    {
      company: "Xen AI",
      role: "Full Stack Developer",
      period: "Oct 2024 - Jan 2025",
      location: "Delaware, USA",
      details: [
        "Contributed to a medical automation tool used by radiologists to streamline report analysis.",
        "Improved backend logic and UI responsiveness to boost diagnostic speed and accuracy."
      ]
    },
    {
      company: "SunCore Digital",
      role: "Full Stack Developer",
      period: "Aug 2024 - Oct 2024",
      location: "Texas, USA",
      details: [
        "Designed and built a responsive WordPress landing page to promote the company’s crypto-mining solutions and attract early-stage customers.",
        "Contributed to the development of a user dashboard web app where customers could view mined crypto stats and withdrawal timelines."
      ]
    },
    {
      company: "ExRx Net",
      role: "Full Stack Developer",
      period: "Apr 2024 - Aug 2024",
      location: "Kansas, USA",
      details: [
        "Created a fitness web application where users could design and track custom workout plans.",
        "Ensured smooth UX across different devices using responsive front-end design."
      ]
    },
    {
      company: "KDN Plus",
      role: "Full Stack Developer",
      period: "Jan 2024 - Apr 2024",
      location: "Lagos, Nigeria",
      details: [
        "Developed a Nigerian movie streaming platform similar to Netflix, focusing on clean UI and smooth video playback.",
        "Built scalable components and optimized performance for both web and mobile users."
      ]
    },
    {
      company: "SOLENK",
      role: "Full Stack Developer",
      period: "Jan 2021 - Dec 2023",
      location: "Lagos, Nigeria",
      details: [
        "Built custom client-facing web apps, working closely with UI/UX designers and back-end developers.",
        "Focused on responsive design, accessibility, and clean front-end architecture."
      ]
    }
  ],
  skills: {
    frontend: ["JavaScript", "React", "HTML", "CSS", "Tailwind CSS", "Angular", "Responsive Design"],
    backend: ["Node.js", "Express.js", "MongoDB", "REST APIs", "Firebase", "SQL", "PHP", "Python"],
    tools: ["Git", "Webpack", "Docker", "Jenkins", "WordPress", "Figma", "Framer", "Zoho"]
  },
  projects: [
    {
      title: "Koolboks Management",
      description: "Employee onboarding and task management system for a global reach solar company.",
      tech: ["React", "Node.js", "Zoho"],
      link: "#"
    },
    {
      title: "Xen AI Medical",
      description: "AI-driven medical automation tool for diagnostic report analysis.",
      tech: ["React", "Python", "FastAPI"],
      link: "#"
    },
    {
      title: "SunCore Crypto",
      description: "Crypto-mining dashboard and high-conversion landing page.",
      tech: ["WordPress", "React", "Chart.js"],
      link: "#"
    },
    {
      title: "Fitness Tracker App",
      description: "A comprehensive fitness application for workout design and progress tracking.",
      tech: ["React", "Firebase", "Tailwind"],
      link: "#"
    }
  ]
};
