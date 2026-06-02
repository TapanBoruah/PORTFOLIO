import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Github, 
  Linkedin, 
  Instagram, 
  Facebook, 
  BookOpen, 
  Award, 
  Briefcase, 
  Mail, 
  MapPin, 
  ExternalLink, 
  Cpu, 
  Settings, 
  ChevronRight, 
  GraduationCap,
  Sparkles,
  Menu,
  X,
  Send,
  Loader2
} from 'lucide-react';

const getAssetUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  
  // If the asset is a local frontend public asset, do not prepend the backend VITE_API_URL
  if (url.startsWith('/imagesportfolio/')) {
    return url;
  }
  
  const baseUrl = import.meta.env.VITE_API_URL || '';
  let cleanBase = baseUrl.trim();
  let cleanUrl = url.trim();
  
  // Remove duplicate /api prefix if VITE_API_URL already ends with it
  if (cleanBase.endsWith('/api') && cleanUrl.startsWith('/api/')) {
    cleanUrl = cleanUrl.substring(4);
  } else if (cleanBase.endsWith('/api/') && cleanUrl.startsWith('/api/')) {
    cleanUrl = cleanUrl.substring(5);
  }
  
  // Combine safely ensuring correct slash separation
  if (cleanBase.endsWith('/') && cleanUrl.startsWith('/')) {
    return cleanBase + cleanUrl.substring(1);
  } else if (!cleanBase.endsWith('/') && !cleanUrl.startsWith('/')) {
    return cleanBase + '/' + cleanUrl;
  }
  
  return cleanBase + cleanUrl;
};

const PortfolioHome = () => {
  // Navigation State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic Portfolio Datasets
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [education, setEducation] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [profile, setProfile] = useState(null);

  // Active Category State for Skills Filtering
  const [activeSkillCategory, setActiveSkillCategory] = useState('all');

  // Contact Form State
  const [contactData, setContactData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: '' });

  // Data Loading States
  const [loadingData, setLoadingData] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const [skillsRes, projectsRes, edRes, achRes, profileRes] = await Promise.all([
          axios.get('/api/skills'),
          axios.get('/api/projects'),
          axios.get('/api/education'),
          axios.get('/api/achievements'),
          axios.get('/api/profile')
        ]);

        setSkills(skillsRes.data);
        setProjects(projectsRes.data);
        setEducation(edRes.data);
        setAchievements(achRes.data);
        setProfile(profileRes.data);
      } catch (err) {
        console.error('Error fetching portfolio database data:', err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchPortfolioData();
  }, []);

  // Skill category filter handler
  const filteredSkills = activeSkillCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === activeSkillCategory);

  // Form submit handler
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactData.name || !contactData.email || !contactData.message) {
      setFormStatus({ loading: false, success: false, error: 'Please enter all required fields.' });
      return;
    }

    setFormStatus({ loading: true, success: false, error: '' });
    try {
      await axios.post('/api/messages', contactData);
      setFormStatus({ loading: false, success: true, error: '' });
      setContactData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormStatus(prev => ({ ...prev, success: false })), 5000);
    } catch (err) {
      setFormStatus({ 
        loading: false, 
        success: false, 
        error: err.response?.data?.msg || 'Something went wrong. Please try again later.' 
      });
    }
  };

  return (
    <div className="relative min-h-screen bg-dark-900 tech-grid overflow-hidden">
      
      {/* Visual background glows */}
      <div className="bg-glow-sphere w-[500px] h-[500px] bg-blue-600 top-[-100px] left-[-100px]" />
      <div className="bg-glow-sphere w-[500px] h-[500px] bg-indigo-600 top-[30%] right-[-100px]" />
      <div className="bg-glow-sphere w-[600px] h-[600px] bg-purple-600 bottom-[-100px] left-[20%]" />

      {/* HEADER NAVBAR */}
      <header className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[92%] max-w-6xl z-50 transition-all duration-300">
        <div className="glass-card rounded-full px-6 py-3 flex justify-between items-center border border-white/10 shadow-lg shadow-black/40">
          <a href="#" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/30 overflow-hidden">
              <span className="relative z-10 font-bold font-sans">T</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-700 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-xl font-bold font-sans tracking-wide bg-gradient-to-r from-white via-slate-100 to-blue-400 bg-clip-text text-transparent">
              {profile?.fullName || 'Tapan Boruah'}
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors duration-200">Home</a>
            <a href="#about" className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors duration-200">About</a>
            <a href="#skills" className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors duration-200">Skills</a>
            <a href="#educations" className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors duration-200">Education</a>
            <a href="#projects" className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors duration-200">Projects</a>
            <a href="#contact" className="text-sm font-medium text-slate-300 hover:text-blue-400 transition-colors duration-200">Contact</a>
          </nav>



          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-300 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 mx-2 glass-card rounded-2xl p-6 border border-white/10 shadow-2xl flex flex-col gap-4 animate-fade-in">
            <a 
              href="#" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-blue-400 py-2 border-b border-white/5 text-base font-medium"
            >
              Home
            </a>
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-blue-400 py-2 border-b border-white/5 text-base font-medium"
            >
              About
            </a>
            <a 
              href="#skills" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-blue-400 py-2 border-b border-white/5 text-base font-medium"
            >
              Skills
            </a>
            <a 
              href="#educations" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-blue-400 py-2 border-b border-white/5 text-base font-medium"
            >
              Education & Awards
            </a>
            <a 
              href="#projects" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-blue-400 py-2 border-b border-white/5 text-base font-medium"
            >
              Projects
            </a>
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-blue-400 py-2 text-base font-medium"
            >
              Contact
            </a>

          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-6 sm:px-10 z-10 overflow-hidden">
        
        {/* Animated Engineering Gears Overlay representing Mechanical Engineering */}
        <div className="absolute right-[5%] top-[18%] opacity-10 pointer-events-none hidden lg:block animate-spin-slow">
          <Settings size={300} className="text-slate-400" strokeWidth={0.5} />
        </div>
        <div className="absolute right-[21%] top-[40%] opacity-15 pointer-events-none hidden lg:block animate-pulse-slow">
          <Cpu size={140} className="text-blue-400" strokeWidth={0.5} />
        </div>
        <div className="absolute right-[18%] top-[12%] opacity-10 pointer-events-none hidden lg:block animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '8s' }}>
          <Settings size={120} className="text-indigo-400" strokeWidth={0.5} />
        </div>

        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Hero Metadata */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6 animate-fade-in order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-semibold tracking-wide">
              <Sparkles size={14} className="animate-pulse" />
              {profile?.tagline || 'NIT Arunachal Pradesh Sophomore'}
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-sans tracking-tight text-white leading-tight">
              Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">{profile?.fullName || 'Tapan Boruah'}</span>
            </h1>
            
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-300 font-sans tracking-wide flex items-center justify-center lg:justify-start gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              {profile?.title || 'Mechanical Engineer & MERN Developer'}
            </h2>
            
            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Bridging the gap between the physical and digital world. I apply engineering precision and design logic to develop responsive full-stack applications.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <a 
                href={getAssetUrl(profile?.cvUrl) || '#projects'} 
                target={profile?.cvUrl ? "_blank" : undefined}
                rel={profile?.cvUrl ? "noopener noreferrer" : undefined}
                className="bg-blue-600 hover:bg-blue-500 hover:shadow-glow-blue text-white px-8 py-3.5 rounded-xl font-semibold tracking-wide shadow-lg shadow-blue-500/20 active:scale-95 transition-all duration-200 text-sm"
              >
                View CV
              </a>
              <a 
                href="#contact" 
                className="border border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-300 hover:text-white px-8 py-3.5 rounded-xl font-semibold tracking-wide transition-all duration-200 text-sm"
              >
                Get In Touch
              </a>
            </div>

            {/* Social Channels Icons */}
            <div className="flex justify-center lg:justify-start gap-4 pt-6">
              <a href={profile?.githubUrl || "https://github.com/TapanBoruah"} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl glass-card border border-white/10 hover:border-blue-400/50 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:shadow-glow-blue transition-all duration-300">
                <Github size={20} />
              </a>
              <a href={profile?.linkedinUrl || "https://www.linkedin.com/in/tapan-boruah-391a08330/"} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl glass-card border border-white/10 hover:border-blue-400/50 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:shadow-glow-blue transition-all duration-300">
                <Linkedin size={20} />
              </a>
              <a href={profile?.instagramUrl || "https://www.instagram.com/tttapan_music/"} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl glass-card border border-white/10 hover:border-blue-400/50 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:shadow-glow-blue transition-all duration-300">
                <Instagram size={20} />
              </a>
              <a href={profile?.facebookUrl || "https://www.facebook.com/tttapanmusic"} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl glass-card border border-white/10 hover:border-blue-400/50 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:shadow-glow-blue transition-all duration-300">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Profile Card / Glass Avatar with rotation shadows */}
          <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
            <div className="relative group w-64 sm:w-72 md:w-80 lg:w-full max-w-md aspect-square">
              {/* Spinning technical indicators surrounding avatar */}
              <div className="absolute inset-[-15px] border border-dashed border-blue-500/35 rounded-full animate-spin-slow" />
              <div className="absolute inset-[-5px] border border-slate-700/55 rounded-full" />
              
              {/* Backglow layer */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-3xl opacity-30 blur-2xl group-hover:opacity-40 transition-opacity duration-300" />
              
              {/* Premium geometric outlines */}
              <div className="absolute inset-0 border border-white/15 rounded-3xl transform rotate-6 scale-[1.03] transition-all duration-300 group-hover:rotate-12 group-hover:border-blue-500/30" />
              <div className="absolute inset-0 border border-white/10 rounded-3xl transform -rotate-3 scale-[0.98] transition-all duration-300 group-hover:-rotate-6 group-hover:border-purple-500/30" />
              
              <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/20 glass-card bg-slate-900/60 p-4">
                <img 
                  src={getAssetUrl(profile?.avatar) || "/imagesportfolio/me.png"} 
                  alt="Tapan Boruah Profile" 
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-[1.03] transition-transform duration-500 ease-out" 
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ABOUT ME SECTION */}
      <section id="about" className="relative py-24 px-6 sm:px-10 z-10 bg-dark-800/65 border-y border-white/5">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* About Side Photo */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 sm:w-80 lg:w-full max-w-md">
              <div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-blue-500" />
              <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-blue-500" />
              
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl shadow-black/50">
                <img 
                  src={getAssetUrl(profile?.aboutImage) || "/imagesportfolio/me1.jpg"} 
                  alt="Tapan Boruah Engineering" 
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* About Content */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="text-blue-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2 mb-2">
                <span className="w-6 h-[1px] bg-blue-500" />
                Who I Am
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                About Me
              </h2>
            </div>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
              {profile?.aboutText1 || "I’m Tapan Boruah, a 2nd-year Mechanical Engineering student with a Minor in Computer Science & Engineering at the National Institute of Technology, Arunachal Pradesh. Hailing from Lakhimpur, Assam, I hold a deep interest in both physical engineering processes and dynamic backend architectures."}
            </p>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
              {profile?.aboutText2 || "As a full-stack MERN Stack Developer, I build performant web applications using MongoDB, Express, React, and Node.js. My minor in Computer Science supplies me with strong foundations in programming and clean systems design."}
            </p>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
              {profile?.aboutText3 || "In addition to math, gears, and code, I am a trained musician (Tabla player, Percussionist, and Drummer) with a completed music degree (Prabhakar Degree, equivalent to B.Music). Operating across both logic-bound equations and musical rhythms grants me a unique, creative, and structured approach to problem-solving."}
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl border border-white/5 bg-slate-900/40 hover:border-blue-500/20 transition-all duration-200">
                <div className="text-3xl font-extrabold text-white">{profile?.cgpa || '8.73'}</div>
                <div className="text-xs text-slate-400 mt-1">Current College CGPA</div>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-slate-900/40 hover:border-blue-500/20 transition-all duration-200">
                <div className="text-3xl font-extrabold text-white">{projects.length || profile?.projectsCount || '4'}</div>
                <div className="text-xs text-slate-400 mt-1">Key Full-Stack Projects</div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SKILLS MATRIX SECTION */}
      <section id="skills" className="relative py-24 px-6 sm:px-10 z-10">
        <div className="w-full max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <div className="text-blue-500 font-bold uppercase tracking-widest text-xs inline-flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500/20 border border-blue-500 animate-pulse" />
              Technical Arsenal
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Skills & Proficiencies
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto font-light">
              A comprehensive view of my capabilities ranging from modern web engineering packages to mechanical system parameters.
            </p>
          </div>

          {/* Filtering Categories Bar */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { id: 'all', label: 'All Fields' },
              { id: 'frontend', label: 'Frontend Dev' },
              { id: 'backend', label: 'Backend Dev' },
              { id: 'languages', label: 'Programming' },
              { id: 'mechanical', label: 'Engineering' }
            ].map(category => (
              <button 
                key={category.id}
                onClick={() => setActiveSkillCategory(category.id)}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  activeSkillCategory === category.id 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                    : 'glass-card border border-white/5 text-slate-400 hover:text-white hover:border-white/10'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Dynamic Grid of Skills with Glassmorphic design and glows */}
          {loadingData ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-blue-500" size={36} />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredSkills.map(skill => (
                <div 
                  key={skill._id}
                  className="group relative rounded-2xl glass-card p-6 border border-white/5 flex flex-col items-center justify-center gap-4 text-center transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/30 hover:shadow-glow-blue overflow-hidden"
                >
                  {/* Subtle inner card radial glow */}
                  <div className="absolute inset-0 bg-radial-gradient(circle_at_center,_rgba(59,_130,_246,_0.04),_transparent_70%) opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="w-16 h-16 rounded-xl bg-slate-900/50 p-2 flex items-center justify-center border border-white/5 group-hover:border-blue-500/30 transition-colors duration-300">
                    <img 
                      src={getAssetUrl(skill.icon)} 
                      alt={skill.name} 
                      className="w-full h-full object-contain filter group-hover:scale-110 transition-transform duration-300" 
                      onError={(e) => {
                        e.target.src = 'https://img.icons8.com/color/96/settings-cog.png';
                      }}
                    />
                  </div>
                  
                  <div className="space-y-1 z-10">
                    <h3 className="font-semibold text-sm text-white group-hover:text-blue-400 transition-colors duration-200">
                      {skill.name}
                    </h3>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 group-hover:text-slate-400 transition-colors duration-200">
                      {skill.category}
                    </span>
                  </div>

                  {/* Dynamic Skill Proficiency Bar */}
                  <div className="w-full mt-2 space-y-1 z-10">
                    <div className="flex justify-between text-[9px] text-slate-500 font-bold">
                      <span>LEVEL</span>
                      <span>{skill.proficiency}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* EDUCATION & TIMELINES SECTION */}
      <section id="educations" className="relative py-24 px-6 sm:px-10 z-10 bg-dark-800/65 border-y border-white/5">
        <div className="w-full max-w-6xl mx-auto space-y-16">
          
          <div className="text-center space-y-4">
            <div className="text-blue-500 font-bold uppercase tracking-widest text-xs inline-flex items-center gap-2">
              <BookOpen size={14} />
              Chronology & Milestones
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Education & Achievements
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto font-light">
              An interactive historical track highlighting my formal engineering instruction alongside my music and leadership awards.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* EDUCATION COLUMN */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3 pb-3 border-b border-white/5">
                <GraduationCap className="text-blue-500" size={24} />
                Formal Education
              </h3>
              
              {loadingData ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="animate-spin text-blue-500" />
                </div>
              ) : (
                <div className="relative border-l-2 border-slate-800 pl-6 space-y-10 ml-2">
                  {education.map(ed => (
                    <div key={ed._id} className="relative group">
                      
                      {/* Timeline Glowing Node */}
                      <span className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-blue-500 group-hover:bg-blue-500 group-hover:shadow-glow-blue transition-all duration-300" />
                      
                      <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-colors duration-300">
                        <span className="text-xs font-semibold text-blue-400 tracking-wider">
                          {ed.duration}
                        </span>
                        <h4 className="text-lg font-bold text-white mt-1 group-hover:text-blue-400 transition-colors duration-200">
                          {ed.institution}
                        </h4>
                        <p className="text-slate-300 text-sm mt-1">
                          {ed.degree}
                        </p>
                        {ed.grade && (
                          <div className="inline-block mt-3 px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-xs font-semibold text-slate-200">
                            {ed.grade}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ACHIEVEMENTS COLUMN */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3 pb-3 border-b border-white/5">
                <Award className="text-indigo-500" size={24} />
                Key Achievements & Honors
              </h3>

              {loadingData ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="animate-spin text-blue-500" />
                </div>
              ) : (
                <div className="relative border-l-2 border-slate-800 pl-6 space-y-10 ml-2">
                  {achievements.map(ach => (
                    <div key={ach._id} className="relative group">
                      
                      {/* Timeline Glowing Node */}
                      <span className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-indigo-500 group-hover:bg-indigo-500 group-hover:shadow-glow-indigo transition-all duration-300" />
                      
                      <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-indigo-500/20 transition-colors duration-300">
                        <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors duration-200">
                          {ach.title}
                        </h4>
                        <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                          {ach.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" className="relative py-24 px-6 sm:px-10 z-10">
        <div className="w-full max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <div className="text-blue-500 font-bold uppercase tracking-widest text-xs inline-flex items-center gap-2">
              <Briefcase size={14} />
              Applications Registry
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Featured Projects
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto font-light">
              Explore some of my web structures, tools, and club portfolios built using React, Node, and advanced CSS layers.
            </p>
          </div>

          {/* Projects Responsive Grid with dynamic database contents */}
          {loadingData ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-blue-500" size={36} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map(project => (
                <div 
                  key={project._id}
                  className="group rounded-2xl overflow-hidden glass-card border border-white/5 hover:border-blue-500/30 hover:shadow-glow-blue transition-all duration-300 flex flex-col h-full"
                >
                  {/* Card Header Image Container */}
                  <div className="relative aspect-video overflow-hidden bg-slate-950 border-b border-white/5">
                    <img 
                      src={getAssetUrl(project.image)} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    
                    {/* Dark gradient shadow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-300" />
                  </div>

                  {/* Card Contents */}
                  <div className="p-6 flex flex-col flex-1 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors duration-200">
                        {project.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="px-2.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/10 text-blue-400 text-[10px] font-bold tracking-wide"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Footer Action Links */}
                    <div className="flex gap-4 pt-4 mt-auto border-t border-white/5">
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors duration-200"
                        >
                          <Github size={14} />
                          Source Code
                        </a>
                      )}
                      {project.liveUrl && (
                        <a 
                          href={project.liveUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200 ml-auto"
                        >
                          <ExternalLink size={14} />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* CONTACT & MESSAGING FORM */}
      <section id="contact" className="relative py-24 px-6 sm:px-10 z-10 bg-dark-800/65 border-t border-white/5">
        <div className="w-full max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <div className="text-blue-500 font-bold uppercase tracking-widest text-xs inline-flex items-center gap-2">
              <Mail size={14} />
              Secure Communication
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Get In Touch
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto font-light">
              Submit a formal inquiry or a simple note. Messages are securely stored and verified directly through the administrator dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Contact Details Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-6">
                
                <h3 className="text-xl font-bold text-white border-b border-white/5 pb-4">
                  Contact Information
                </h3>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-500 tracking-wider uppercase">EMAIL</span>
                    <a href={`mailto:${profile?.email || 'tapanboruah10@gmail.com'}`} className="text-slate-200 hover:text-blue-400 transition-colors text-sm font-medium">
                      {profile?.email || 'tapanboruah10@gmail.com'}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-500 tracking-wider uppercase">LOCATION</span>
                    <span className="text-slate-200 text-sm font-medium">
                      {profile?.location || 'NIT Arunachal Pradesh, Yupia Campus, Arunachal Pradesh, India'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                    <Settings className="animate-spin-slow" size={18} />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-500 tracking-wider uppercase">SECTOR</span>
                    <span className="text-slate-200 text-sm font-medium">
                      {profile?.sector || 'Mechanical Engineering + Full-Stack Systems'}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Contact Form Column */}
            <div className="lg:col-span-7">
              <form onSubmit={handleContactSubmit} className="glass-card p-8 rounded-3xl border border-white/5 space-y-6">
                
                <h3 className="text-xl font-bold text-white">
                  Send A Message
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 tracking-wide uppercase">Your Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      placeholder="Tapan Boruah"
                      value={contactData.name}
                      onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                      className="w-full input-field"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 tracking-wide uppercase">Your Email <span className="text-red-500">*</span></label>
                    <input 
                      type="email" 
                      required
                      placeholder="tapanboruah10@gmail.com"
                      value={contactData.email}
                      onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                      className="w-full input-field"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 tracking-wide uppercase">Subject</label>
                  <input 
                    type="text" 
                    placeholder="Collaboration opportunities"
                    value={contactData.subject}
                    onChange={(e) => setContactData({ ...contactData, subject: e.target.value })}
                    className="w-full input-field"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 tracking-wide uppercase">Your Message <span className="text-red-500">*</span></label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="Describe your proposal..."
                    value={contactData.message}
                    onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                    className="w-full input-field resize-none"
                  />
                </div>

                {/* Form feedback status alerts */}
                {formStatus.error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold rounded-xl animate-fade-in">
                    {formStatus.error}
                  </div>
                )}

                {formStatus.success && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold rounded-xl animate-fade-in">
                    ✓ Your inquiry has been securely sent. Thank you!
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={formStatus.loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 hover:shadow-glow-blue disabled:bg-blue-600/50 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] shadow-md shadow-blue-500/25"
                >
                  {formStatus.loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Secure Message
                    </>
                  )}
                </button>

              </form>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-slate-950/60 z-10 relative">
        <div className="w-full max-w-6xl mx-auto px-6 text-center space-y-4">
          <div className="flex justify-center items-center gap-2 text-slate-300 font-bold">
            <Settings className="animate-spin-slow text-blue-500" size={20} />
            <span>Tapan Boruah Portfolio</span>
          </div>
          <p className="text-slate-500 text-xs font-light tracking-wide">
            © {new Date().getFullYear()} Tapan Boruah. Constructed using MongoDB, Express, React, and Node.js.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default PortfolioHome;
