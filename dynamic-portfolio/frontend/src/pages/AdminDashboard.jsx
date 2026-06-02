import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Settings, 
  Layers, 
  Briefcase, 
  BookOpen, 
  Mail, 
  Trash2, 
  Plus, 
  LogOut, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Lock,
  User,
  Eye,
  CheckCircle,
  Loader2,
  ListFilter,
  Pencil,
  X
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

const AdminDashboard = () => {
  const { isAuthenticated, login, logout, loading: authLoading } = useAuth();

  // Login form state
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard Active Tab
  const [activeTab, setActiveTab] = useState('overview');

  // Entities datasets
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [education, setEducation] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [messages, setMessages] = useState([]);
  const [profileData, setProfileData] = useState({ fullName: '', title: '', tagline: '', avatar: '', aboutImage: '', aboutText1: '', aboutText2: '', aboutText3: '', cgpa: '', projectsCount: 4, email: '', location: '', sector: '', githubUrl: '', linkedinUrl: '', instagramUrl: '', facebookUrl: '', cvUrl: '' });

  // Data Loading trigger
  const [loadingData, setLoadingData] = useState(false);

  // Credential update state
  const [credentialUpdate, setCredentialUpdate] = useState({ currentPassword: '', newUsername: '', newPassword: '', confirmPassword: '' });
  const [credentialStatus, setCredentialStatus] = useState({ loading: false, success: '', error: '' });

  // Dynamic Item Form States (for creating new elements)
  const [newSkill, setNewSkill] = useState({ name: '', category: 'frontend', icon: '', proficiency: 80 });
  const [newProject, setNewProject] = useState({ title: '', description: '', image: '', githubUrl: '', liveUrl: '', tags: '' });
  const [newEducation, setNewEducation] = useState({ institution: '', degree: '', duration: '', grade: '', order: 0 });
  const [newAchievement, setNewAchievement] = useState({ title: '', description: '', order: 0 });

  const [editingSkill, setEditingSkill] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editingEducation, setEditingEducation] = useState(null);
  const [editingAchievement, setEditingAchievement] = useState(null);

  // Form submission indicators
  const [submitting, setSubmitting] = useState(false);

  // Fetch Dashboard content from server
  const fetchDashboardData = async () => {
    if (!isAuthenticated) return;
    setLoadingData(true);
    try {
      const [skillsRes, projectsRes, edRes, achRes, msgRes, profileRes] = await Promise.all([
        axios.get('/api/skills'),
        axios.get('/api/projects'),
        axios.get('/api/education'),
        axios.get('/api/achievements'),
        axios.get('/api/messages'),
        axios.get('/api/profile')
      ]);

      setSkills(skillsRes.data);
      setProjects(projectsRes.data);
      setEducation(edRes.data);
      setAchievements(achRes.data);
      setMessages(msgRes.data);
      setProfileData(profileRes.data);
    } catch (err) {
      console.error('Failed to gather administrative datasets:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [isAuthenticated]);

  // Auth Submit Handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      setLoginError('Please enter both administrative fields.');
      return;
    }

    setLoginError('');
    setLoginLoading(true);
    const result = await login(credentials.username, credentials.password);
    setLoginLoading(false);
    if (!result.success) {
      setLoginError(result.msg);
    }
  };

  // CRUD API: Create or Update Skill
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.name || !newSkill.icon) return;
    setSubmitting(true);
    try {
      if (editingSkill) {
        const res = await axios.put(`/api/skills/${editingSkill._id}`, newSkill);
        setSkills(prev => prev.map(s => s._id === editingSkill._id ? res.data : s).sort((a,b) => b.proficiency - a.proficiency));
        setEditingSkill(null);
      } else {
        const res = await axios.post('/api/skills', newSkill);
        setSkills(prev => [...prev, res.data].sort((a,b) => b.proficiency - a.proficiency));
      }
      setNewSkill({ name: '', category: 'frontend', icon: '', proficiency: 80 });
    } catch (err) {
      alert(editingSkill ? 'Failed to update skill.' : 'Failed to insert new skill.');
    } finally {
      setSubmitting(false);
    }
  };

  const startEditSkill = (skill) => {
    setEditingSkill(skill);
    setNewSkill({
      name: skill.name,
      category: skill.category,
      icon: skill.icon,
      proficiency: skill.proficiency
    });
  };

  const cancelEditSkill = () => {
    setEditingSkill(null);
    setNewSkill({ name: '', category: 'frontend', icon: '', proficiency: 80 });
  };

  // CRUD API: Delete Skill
  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Are you sure you want to remove this skill record?')) return;
    try {
      await axios.delete(`/api/skills/${id}`);
      setSkills(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      alert('Failed to delete skill.');
    }
  };

  // CRUD API: Create or Update Project
  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.title || !newProject.description || !newProject.image) return;
    setSubmitting(true);
    try {
      if (editingProject) {
        const res = await axios.put(`/api/projects/${editingProject._id}`, newProject);
        setProjects(prev => prev.map(p => p._id === editingProject._id ? res.data : p));
        setEditingProject(null);
      } else {
        const res = await axios.post('/api/projects', newProject);
        setProjects(prev => [res.data, ...prev]);
      }
      setNewProject({ title: '', description: '', image: '', githubUrl: '', liveUrl: '', tags: '' });
    } catch (err) {
      alert(editingProject ? 'Failed to update project.' : 'Failed to insert project.');
    } finally {
      setSubmitting(false);
    }
  };

  const startEditProject = (project) => {
    setEditingProject(project);
    setNewProject({
      title: project.title,
      description: project.description,
      image: project.image,
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags
    });
  };

  const cancelEditProject = () => {
    setEditingProject(null);
    setNewProject({ title: '', description: '', image: '', githubUrl: '', liveUrl: '', tags: '' });
  };

  // CRUD API: Delete Project
  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to remove this project?')) return;
    try {
      await axios.delete(`/api/projects/${id}`);
      setProjects(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert('Failed to delete project.');
    }
  };

  // CRUD API: Create or Update Education
  const handleAddEducation = async (e) => {
    e.preventDefault();
    if (!newEducation.institution || !newEducation.degree || !newEducation.duration) return;
    setSubmitting(true);
    try {
      if (editingEducation) {
        const res = await axios.put(`/api/education/${editingEducation._id}`, newEducation);
        setEducation(prev => prev.map(ed => ed._id === editingEducation._id ? res.data : ed).sort((a,b) => a.order - b.order));
        setEditingEducation(null);
      } else {
        const res = await axios.post('/api/education', newEducation);
        setEducation(prev => [...prev, res.data].sort((a,b) => a.order - b.order));
      }
      setNewEducation({ institution: '', degree: '', duration: '', grade: '', order: 0 });
    } catch (err) {
      alert(editingEducation ? 'Failed to update education entry.' : 'Failed to insert education entry.');
    } finally {
      setSubmitting(false);
    }
  };

  const startEditEducation = (ed) => {
    setEditingEducation(ed);
    setNewEducation({
      institution: ed.institution,
      degree: ed.degree,
      duration: ed.duration,
      grade: ed.grade || '',
      order: ed.order || 0
    });
  };

  const cancelEditEducation = () => {
    setEditingEducation(null);
    setNewEducation({ institution: '', degree: '', duration: '', grade: '', order: 0 });
  };

  // CRUD API: Delete Education
  const handleDeleteEducation = async (id) => {
    if (!window.confirm('Are you sure you want to remove this education record?')) return;
    try {
      await axios.delete(`/api/education/${id}`);
      setEducation(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      alert('Failed to delete education.');
    }
  };

  // CRUD API: Create or Update Achievement
  const handleAddAchievement = async (e) => {
    e.preventDefault();
    if (!newAchievement.title || !newAchievement.description) return;
    setSubmitting(true);
    try {
      if (editingAchievement) {
        const res = await axios.put(`/api/achievements/${editingAchievement._id}`, newAchievement);
        setAchievements(prev => prev.map(ach => ach._id === editingAchievement._id ? res.data : ach).sort((a,b) => a.order - b.order));
        setEditingAchievement(null);
      } else {
        const res = await axios.post('/api/achievements', newAchievement);
        setAchievements(prev => [...prev, res.data].sort((a,b) => a.order - b.order));
      }
      setNewAchievement({ title: '', description: '', order: 0 });
    } catch (err) {
      alert(editingAchievement ? 'Failed to update achievement.' : 'Failed to insert achievement.');
    } finally {
      setSubmitting(false);
    }
  };

  const startEditAchievement = (ach) => {
    setEditingAchievement(ach);
    setNewAchievement({
      title: ach.title,
      description: ach.description,
      order: ach.order || 0
    });
  };

  const cancelEditAchievement = () => {
    setEditingAchievement(null);
    setNewAchievement({ title: '', description: '', order: 0 });
  };

  // Upload local image files
  const [uploadingFile, setUploadingFile] = useState(false);
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingFile(true);
    try {
      const res = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const uploadedUrl = res.data.url;
      if (type === 'skill') {
        setNewSkill(prev => ({ ...prev, icon: uploadedUrl }));
      } else if (type === 'project') {
        setNewProject(prev => ({ ...prev, image: uploadedUrl }));
      } else if (type === 'avatar') {
        setProfileData(prev => ({ ...prev, avatar: uploadedUrl }));
      } else if (type === 'aboutImage') {
        setProfileData(prev => ({ ...prev, aboutImage: uploadedUrl }));
      } else if (type === 'cv') {
        setProfileData(prev => ({ ...prev, cvUrl: uploadedUrl }));
      }
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to upload file.');
    } finally {
      setUploadingFile(false);
    }
  };

  // CRUD API: Update Dynamic Profile and Contact Settings
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.put('/api/profile', profileData);
      setProfileData(res.data);
      alert('Portfolio dynamic settings updated successfully!');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to update administrative profile settings.');
    } finally {
      setSubmitting(false);
    }
  };

  // CRUD API: Update Admin security credentials
  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    if (!credentialUpdate.currentPassword) {
      setCredentialStatus({ loading: false, success: '', error: 'Please enter your current password to authorize changes.' });
      return;
    }

    if (credentialUpdate.newPassword && credentialUpdate.newPassword !== credentialUpdate.confirmPassword) {
      setCredentialStatus({ loading: false, success: '', error: 'New passwords do not match.' });
      return;
    }

    setCredentialStatus({ loading: true, success: '', error: '' });
    try {
      await axios.put('/api/auth/update', {
        newUsername: credentialUpdate.newUsername || undefined,
        currentPassword: credentialUpdate.currentPassword,
        newPassword: credentialUpdate.newPassword || undefined
      });

      setCredentialStatus({ loading: false, success: 'Credentials updated successfully!', error: '' });
      setCredentialUpdate({ currentPassword: '', newUsername: '', newPassword: '', confirmPassword: '' });
      alert('Credentials updated successfully! Please keep track of your new login details.');
    } catch (err) {
      setCredentialStatus({
        loading: false,
        success: '',
        error: err.response?.data?.msg || 'Failed to update admin credentials.'
      });
    }
  };


  // CRUD API: Delete Achievement
  const handleDeleteAchievement = async (id) => {
    if (!window.confirm('Are you sure you want to remove this achievement?')) return;
    try {
      await axios.delete(`/api/achievements/${id}`);
      setAchievements(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      alert('Failed to delete achievement.');
    }
  };

  // CRUD API: Delete Contact Message
  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message catalog inquiry?')) return;
    try {
      await axios.delete(`/api/messages/${id}`);
      setMessages(prev => prev.filter(m => m._id !== id));
    } catch (err) {
      alert('Failed to delete inquiry message.');
    }
  };

  // Session state indicator
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-900">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  // RENDER LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900 tech-grid px-6">
        <div className="absolute top-[20%] left-[20%] bg-blue-500/10 w-96 h-96 rounded-full filter blur-[80px]" />
        <div className="absolute bottom-[20%] right-[20%] bg-indigo-500/10 w-96 h-96 rounded-full filter blur-[80px]" />

        <div className="w-full max-w-md glass-card p-8 rounded-3xl border border-white/10 shadow-2xl relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Lock size={22} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide font-sans">Admin Control Center</h1>
            <p className="text-slate-400 text-xs font-light">Verify credentials to edit portfolio contents</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-500">
                  <User size={16} />
                </span>
                <input 
                  type="text" 
                  placeholder="admin"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full input-field pl-10 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-500">
                  <Lock size={16} />
                </span>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full input-field pl-10 text-sm"
                />
              </div>
            </div>

            {loginError && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
                ⚠ {loginError}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loginLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm text-white active:scale-95 shadow-md shadow-blue-500/20"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Verifying Session...
                </>
              ) : (
                'Secure Authentication'
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-white/5 text-center">
            <a href="/" className="text-xs text-blue-400 hover:text-blue-300 font-semibold">
              ← Return to Live Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  // RENDER DASHBOARD LAYOUT
  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-dark-800 border-r border-white/5 flex flex-col p-6 flex-shrink-0">
        
        {/* Hub Branding */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            <Settings size={20} className="animate-spin-slow" />
          </div>
          <div>
            <h2 className="font-bold text-white text-sm">Dashboard</h2>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Administrator</span>
          </div>
        </div>

        {/* Navigation Sidebar Tabs */}
        <nav className="flex-1 space-y-2">
          {[
            { id: 'overview', label: 'Metrics Overview', icon: TrendingUp },
            { id: 'profile', label: 'Profile Settings', icon: User },
            { id: 'skills', label: 'Skills Editor', icon: Layers },
            { id: 'projects', label: 'Projects Manager', icon: Briefcase },
            { id: 'timeline', label: 'Timeline Editor', icon: BookOpen },
            { id: 'messages', label: 'Inquiries Inbox', icon: Mail, badge: messages.length }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span className="ml-auto px-2 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="pt-6 border-t border-white/5 mt-auto">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 border border-red-500/20 hover:bg-red-500/5 text-red-400 hover:text-red-300 font-semibold py-2.5 rounded-xl text-xs transition-colors"
          >
            <LogOut size={14} />
            Secure Log Out
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN WORKSPACE */}
      <main className="flex-1 p-6 md:p-10 max-h-screen overflow-y-auto space-y-6">
        
        {/* Header HUD panel */}
        <div className="flex justify-between items-center pb-4 border-b border-white/5">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight capitalize">
              {activeTab === 'timeline' ? 'Timeline Manager' : `${activeTab} interface`}
            </h1>
            <p className="text-slate-400 text-xs font-light mt-1">Manage database portfolios seamlessly</p>
          </div>
          <a 
            href="/" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1.5 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            View Live Site
            <ExternalLink size={12} />
          </a>
        </div>

        {/* TAB 1: METRICS OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Skills Catalogue', value: skills.length, color: 'border-blue-500/20 text-blue-400' },
                { label: 'Featured Projects', value: projects.length, color: 'border-indigo-500/20 text-indigo-400' },
                { label: 'Timeline Milestones', value: education.length + achievements.length, color: 'border-purple-500/20 text-purple-400' },
                { label: 'Visitor Inquiries', value: messages.length, color: 'border-emerald-500/20 text-emerald-400' }
              ].map((card, i) => (
                <div key={i} className={`glass-card p-6 rounded-2xl border ${card.color} flex flex-col justify-between h-28`}>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{card.label}</span>
                  <span className="text-4xl font-extrabold text-white">{card.value}</span>
                </div>
              ))}
            </div>

            {/* Quick Status and instructions */}
            <div className="glass-card p-8 rounded-3xl border border-white/5 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle size={18} className="text-blue-400" />
                Administrative Status: Connected
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-3xl font-light">
                Welcome Tapan. Use the sidebar to modify your database listings in real-time. Modifications made here are directly written to MongoDB and will propagate to your live page immediately.
              </p>
            </div>
          </div>
        )}

        {/* TAB: PROFILE & CONTACT SETTINGS */}
        {activeTab === 'profile' && (
          <div className="space-y-8 animate-fade-in">
            <form onSubmit={handleUpdateProfile} className="glass-card p-8 rounded-3xl border border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4">
              <User className="text-blue-500" size={20} />
              Portfolio Owner & Contact Info Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  className="w-full input-field py-2 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Professional Title / Role</label>
                <input 
                  type="text" 
                  required
                  value={profileData.title}
                  onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                  className="w-full input-field py-2 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Tagline / Header Status</label>
                <input 
                  type="text" 
                  required
                  value={profileData.tagline}
                  onChange={(e) => setProfileData({ ...profileData, tagline: e.target.value })}
                  className="w-full input-field py-2 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Avatar upload */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Avatar Image URL</label>
                <input 
                  type="text" 
                  value={profileData.avatar}
                  onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                  className="w-full input-field py-2 text-xs"
                />
                <div className="mt-1.5 flex items-center justify-between gap-2 border border-dashed border-white/10 rounded-xl p-2 bg-slate-950/20">
                  <span className="text-[10px] text-slate-400 font-medium">{uploadingFile ? 'Uploading...' : 'Or upload local avatar:'}</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    disabled={uploadingFile}
                    onChange={(e) => handleFileUpload(e, 'avatar')}
                    className="text-[10px] text-slate-400 file:bg-blue-600/10 file:border-0 file:text-blue-400 file:text-[10px] file:font-semibold file:px-2.5 file:py-1 file:rounded-lg file:mr-2 file:cursor-pointer hover:file:bg-blue-600/20 cursor-pointer w-48"
                  />
                </div>
              </div>

              {/* About image upload */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">About Image URL</label>
                <input 
                  type="text" 
                  value={profileData.aboutImage}
                  onChange={(e) => setProfileData({ ...profileData, aboutImage: e.target.value })}
                  className="w-full input-field py-2 text-xs"
                />
                <div className="mt-1.5 flex items-center justify-between gap-2 border border-dashed border-white/10 rounded-xl p-2 bg-slate-950/20">
                  <span className="text-[10px] text-slate-400 font-medium">{uploadingFile ? 'Uploading...' : 'Or upload local about image:'}</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    disabled={uploadingFile}
                    onChange={(e) => handleFileUpload(e, 'aboutImage')}
                    className="text-[10px] text-slate-400 file:bg-blue-600/10 file:border-0 file:text-blue-400 file:text-[10px] file:font-semibold file:px-2.5 file:py-1 file:rounded-lg file:mr-2 file:cursor-pointer hover:file:bg-blue-600/20 cursor-pointer w-48"
                  />
                </div>
              </div>

              {/* CV Document upload */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">CV Document (PDF) URL</label>
                <input 
                  type="text" 
                  value={profileData.cvUrl || ''}
                  onChange={(e) => setProfileData({ ...profileData, cvUrl: e.target.value })}
                  placeholder="/api/uploads/cv.pdf"
                  className="w-full input-field py-2 text-xs"
                />
                <div className="mt-1.5 flex items-center justify-between gap-2 border border-dashed border-white/10 rounded-xl p-2 bg-slate-950/20">
                  <span className="text-[10px] text-slate-400 font-medium">{uploadingFile ? 'Uploading...' : 'Or upload local CV (PDF):'}</span>
                  <input 
                    type="file" 
                    accept=".pdf"
                    disabled={uploadingFile}
                    onChange={(e) => handleFileUpload(e, 'cv')}
                    className="text-[10px] text-slate-400 file:bg-blue-600/10 file:border-0 file:text-blue-400 file:text-[10px] file:font-semibold file:px-2.5 file:py-1 file:rounded-lg file:mr-2 file:cursor-pointer hover:file:bg-blue-600/20 cursor-pointer w-48"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase border-b border-white/5 pb-2">Biography Paragraphs</h4>
              
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">About Paragraph 1</label>
                <textarea 
                  rows={3}
                  value={profileData.aboutText1}
                  onChange={(e) => setProfileData({ ...profileData, aboutText1: e.target.value })}
                  className="w-full input-field py-2 text-xs resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">About Paragraph 2</label>
                <textarea 
                  rows={3}
                  value={profileData.aboutText2}
                  onChange={(e) => setProfileData({ ...profileData, aboutText2: e.target.value })}
                  className="w-full input-field py-2 text-xs resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">About Paragraph 3</label>
                <textarea 
                  rows={3}
                  value={profileData.aboutText3}
                  onChange={(e) => setProfileData({ ...profileData, aboutText3: e.target.value })}
                  className="w-full input-field py-2 text-xs resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">CGPA Stat</label>
                <input 
                  type="text" 
                  value={profileData.cgpa}
                  onChange={(e) => setProfileData({ ...profileData, cgpa: e.target.value })}
                  className="w-full input-field py-2 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Contact Email</label>
                <input 
                  type="email" 
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full input-field py-2 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Contact Location</label>
                <input 
                  type="text" 
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  className="w-full input-field py-2 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Contact Sector Info</label>
                <input 
                  type="text" 
                  value={profileData.sector}
                  onChange={(e) => setProfileData({ ...profileData, sector: e.target.value })}
                  className="w-full input-field py-2 text-xs"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase border-b border-white/5 pb-2">Social Profile Coordinates</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">GitHub Profile URL</label>
                  <input 
                    type="text" 
                    value={profileData.githubUrl}
                    onChange={(e) => setProfileData({ ...profileData, githubUrl: e.target.value })}
                    className="w-full input-field py-2 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">LinkedIn Profile URL</label>
                  <input 
                    type="text" 
                    value={profileData.linkedinUrl}
                    onChange={(e) => setProfileData({ ...profileData, linkedinUrl: e.target.value })}
                    className="w-full input-field py-2 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Instagram Profile URL</label>
                  <input 
                    type="text" 
                    value={profileData.instagramUrl}
                    onChange={(e) => setProfileData({ ...profileData, instagramUrl: e.target.value })}
                    className="w-full input-field py-2 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Facebook Profile URL</label>
                  <input 
                    type="text" 
                    value={profileData.facebookUrl}
                    onChange={(e) => setProfileData({ ...profileData, facebookUrl: e.target.value })}
                    className="w-full input-field py-2 text-xs"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-md shadow-blue-500/10 active:scale-95 animate-pulse"
            >
              {submitting ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
              Save All Profile Settings
            </button>
          </form>

          {/* CREDENTIAL UPDATE FORM */}
          <form onSubmit={handleUpdateCredentials} className="glass-card p-8 rounded-3xl border border-white/5 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4">
              <Lock className="text-blue-500" size={20} />
              Change Admin Security Credentials
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">New Username (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Leave blank to keep current"
                  value={credentialUpdate.newUsername}
                  onChange={(e) => setCredentialUpdate({ ...credentialUpdate, newUsername: e.target.value })}
                  className="w-full input-field py-2 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">New Password (Optional)</label>
                <input 
                  type="password" 
                  placeholder="Min 6 characters. Leave blank to keep current"
                  value={credentialUpdate.newPassword}
                  onChange={(e) => setCredentialUpdate({ ...credentialUpdate, newPassword: e.target.value })}
                  className="w-full input-field py-2 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Confirm New Password</label>
                <input 
                  type="password" 
                  placeholder="Re-type new password"
                  value={credentialUpdate.confirmPassword}
                  onChange={(e) => setCredentialUpdate({ ...credentialUpdate, confirmPassword: e.target.value })}
                  className="w-full input-field py-2 text-xs"
                />
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 space-y-4">
              <div className="space-y-1 max-w-sm">
                <label className="block text-[10px] font-bold text-red-400 uppercase flex items-center gap-1">
                  <span>Current Password (Required to save changes)</span>
                  <span className="text-red-500">*</span>
                </label>
                <input 
                  type="password" 
                  required
                  placeholder="Enter current password"
                  value={credentialUpdate.currentPassword}
                  onChange={(e) => setCredentialUpdate({ ...credentialUpdate, currentPassword: e.target.value })}
                  className="w-full input-field py-2 text-xs border-red-500/20 focus:border-red-500/50"
                />
              </div>

              {credentialStatus.error && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
                  ⚠ {credentialStatus.error}
                </div>
              )}

              {credentialStatus.success && (
                <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold">
                  ✓ {credentialStatus.success}
                </div>
              )}

              <button 
                type="submit" 
                disabled={credentialStatus.loading}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-md shadow-blue-500/10 active:scale-95"
              >
                {credentialStatus.loading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                Update Account Credentials
              </button>
            </div>
          </form>
        </div>
      )}

        {/* TAB 2: SKILLS EDITOR */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
            
            {/* Skill Creation/Editing Form */}
            <div className="lg:col-span-4">
              <form onSubmit={handleAddSkill} className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-base font-bold text-white mb-2">
                  {editingSkill ? 'Edit Skill Node' : 'Register New Skill'}
                </h3>
                
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Skill Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Express.js"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="w-full input-field py-2 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Category</label>
                  <select 
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                    className="w-full input-field py-2 text-xs"
                  >
                    <option value="frontend">Frontend Dev</option>
                    <option value="backend">Backend Dev</option>
                    <option value="languages">Programming Language</option>
                    <option value="mechanical">Mechanical/Engineering</option>
                    <option value="other">Other Fields</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Icon Path / Image URL</label>
                  <input 
                    type="text" 
                    required
                    placeholder="https://img.icons8.com/color/96/expressify.png"
                    value={newSkill.icon}
                    onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
                    className="w-full input-field py-2 text-xs"
                  />
                  <div className="mt-1.5 flex items-center justify-between gap-2 border border-dashed border-white/10 rounded-xl p-2 bg-slate-950/20">
                    <span className="text-[10px] text-slate-400 font-medium">{uploadingFile ? 'Uploading...' : 'Or upload local image:'}</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      disabled={uploadingFile}
                      onChange={(e) => handleFileUpload(e, 'skill')}
                      className="text-[10px] text-slate-400 file:bg-blue-600/10 file:border-0 file:text-blue-400 file:text-[10px] file:font-semibold file:px-2.5 file:py-1 file:rounded-lg file:mr-2 file:cursor-pointer hover:file:bg-blue-600/20 cursor-pointer w-48"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span className="uppercase">Proficiency Level</span>
                    <span>{newSkill.proficiency}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="100"
                    value={newSkill.proficiency}
                    onChange={(e) => setNewSkill({ ...newSkill, proficiency: parseInt(e.target.value) })}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 text-xs mt-4 active:scale-95"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={14} /> : editingSkill ? <CheckCircle size={14} /> : <Plus size={14} />}
                    {editingSkill ? 'Update Skill' : 'Add Skill Node'}
                  </button>
                  {editingSkill && (
                    <button 
                      type="button"
                      onClick={cancelEditSkill}
                      className="border border-white/10 hover:border-white/20 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs mt-4 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Skills Table List */}
            <div className="lg:col-span-8 glass-card rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5 bg-slate-900/40 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white">Registered Skills ({skills.length})</h3>
              </div>
              
              {loadingData ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="animate-spin text-blue-500" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-slate-500 uppercase font-bold text-[10px]">
                        <th className="p-4">Icon</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Level</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {skills.map(skill => (
                        <tr key={skill._id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="p-4">
                            <img src={getAssetUrl(skill.icon)} alt="" className="w-7 h-7 object-contain bg-slate-900 rounded p-0.5 border border-white/5" />
                          </td>
                          <td className="p-4 font-bold text-white">{skill.name}</td>
                          <td className="p-4 capitalize text-slate-400">{skill.category}</td>
                          <td className="p-4 text-slate-300 font-semibold">{skill.proficiency}%</td>
                          <td className="p-4 text-right flex justify-end gap-1.5">
                            <button 
                              onClick={() => startEditSkill(skill)}
                              className="text-blue-400 hover:text-blue-300 p-1.5 hover:bg-blue-500/10 rounded-lg transition-colors"
                            >
                              <Pencil size={14} />
                            </button>
                            <button 
                              onClick={() => handleDeleteSkill(skill._id)}
                              className="text-red-400 hover:text-red-300 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PROJECTS MANAGER */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
            
            {/* Project Creation Form */}
            <div className="lg:col-span-5">
              <form onSubmit={handleAddProject} className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-base font-bold text-white mb-2">
                  {editingProject ? 'Edit Project Details' : 'Register New Project'}
                </h3>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Project Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="MERN Notes Application"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    className="w-full input-field py-2 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Description</label>
                  <textarea 
                    rows={3}
                    required
                    placeholder="Detailed explanation of development tools..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full input-field py-2 text-xs resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Display Cover URL</label>
                  <input 
                    type="text" 
                    required
                    placeholder="https://images.unsplash.com/photo-1555066931-4365d14bab8c"
                    value={newProject.image}
                    onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                    className="w-full input-field py-2 text-xs"
                  />
                  <div className="mt-1.5 flex items-center justify-between gap-2 border border-dashed border-white/10 rounded-xl p-2 bg-slate-950/20">
                    <span className="text-[10px] text-slate-400 font-medium">{uploadingFile ? 'Uploading...' : 'Or upload local image:'}</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      disabled={uploadingFile}
                      onChange={(e) => handleFileUpload(e, 'project')}
                      className="text-[10px] text-slate-400 file:bg-blue-600/10 file:border-0 file:text-blue-400 file:text-[10px] file:font-semibold file:px-2.5 file:py-1 file:rounded-lg file:mr-2 file:cursor-pointer hover:file:bg-blue-600/20 cursor-pointer w-48"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Tags / Stack Tools (comma-separated)</label>
                  <input 
                    type="text" 
                    placeholder="React, Node.js, Express, Tailwind"
                    value={newProject.tags}
                    onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                    className="w-full input-field py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">GitHub Repo URL</label>
                    <input 
                      type="text" 
                      placeholder="https://github.com/..."
                      value={newProject.githubUrl}
                      onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                      className="w-full input-field py-2 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Live Host URL</label>
                    <input 
                      type="text" 
                      placeholder="https://tapanboruah..."
                      value={newProject.liveUrl}
                      onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                      className="w-full input-field py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 text-xs active:scale-95"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={14} /> : editingProject ? <CheckCircle size={14} /> : <Plus size={14} />}
                    {editingProject ? 'Update Project' : 'Add Project Card'}
                  </button>
                  {editingProject && (
                    <button 
                      type="button"
                      onClick={cancelEditProject}
                      className="border border-white/10 hover:border-white/20 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Projects Table List */}
            <div className="lg:col-span-7 glass-card rounded-2xl border border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5 bg-slate-900/40">
                <h3 className="text-sm font-bold text-white">Created Projects ({projects.length})</h3>
              </div>

              {loadingData ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="animate-spin text-blue-500" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-slate-500 uppercase font-bold text-[10px]">
                        <th className="p-4">Preview</th>
                        <th className="p-4">Title</th>
                        <th className="p-4">Tags</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map(proj => (
                        <tr key={proj._id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="p-4">
                            <img src={getAssetUrl(proj.image)} alt="" className="w-12 aspect-video object-cover bg-slate-950 rounded border border-white/5" />
                          </td>
                          <td className="p-4 font-bold text-white">{proj.title}</td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {proj.tags.slice(0,2).map((t, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[9px] font-bold">
                                  {t}
                                </span>
                              ))}
                              {proj.tags.length > 2 && <span className="text-[9px] text-slate-500 font-bold">+{proj.tags.length - 2}</span>}
                            </div>
                          </td>
                          <td className="p-4 text-right flex justify-end gap-1.5">
                            <button 
                              onClick={() => startEditProject(proj)}
                              className="text-blue-400 hover:text-blue-300 p-1.5 hover:bg-blue-500/10 rounded-lg transition-colors"
                            >
                              <Pencil size={14} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProject(proj._id)}
                              className="text-red-400 hover:text-red-300 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: TIMELINE EDITOR (Education & Achievements) */}
        {activeTab === 'timeline' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-fade-in">
            
            {/* EDUCATION CONTROL PANEL */}
            <div className="space-y-6">
              {/* Form Education */}
              <form onSubmit={handleAddEducation} className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  {editingEducation ? <Pencil className="text-blue-400" size={16} /> : <Plus className="text-blue-400" size={16} />}
                  {editingEducation ? 'Edit Education Record' : 'Add Education Record'}
                </h3>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Institution / School</label>
                  <input 
                    type="text" 
                    required
                    placeholder="NIT Arunachal Pradesh"
                    value={newEducation.institution}
                    onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                    className="w-full input-field py-2 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Degree / Qualification</label>
                  <input 
                    type="text" 
                    required
                    placeholder="B.Tech in Mechanical Engineering"
                    value={newEducation.degree}
                    onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                    className="w-full input-field py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Duration Period</label>
                    <input 
                      type="text" 
                      required
                      placeholder="2024 – Present"
                      value={newEducation.duration}
                      onChange={(e) => setNewEducation({ ...newEducation, duration: e.target.value })}
                      className="w-full input-field py-2 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Grade / CGPA</label>
                    <input 
                      type="text" 
                      placeholder="CGPA: 8.73"
                      value={newEducation.grade}
                      onChange={(e) => setNewEducation({ ...newEducation, grade: e.target.value })}
                      className="w-full input-field py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl transition-colors text-xs flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    {submitting ? <Loader2 className="animate-spin animate-pulse" size={14} /> : editingEducation ? <CheckCircle size={14} /> : <Plus size={14} />}
                    {editingEducation ? 'Update Entry' : 'Add Education Entry'}
                  </button>
                  {editingEducation && (
                    <button 
                      type="button"
                      onClick={cancelEditEducation}
                      className="border border-white/10 hover:border-white/20 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* Education list review */}
              <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-slate-900/40">
                  <h3 className="text-sm font-bold text-white">Registered Educations ({education.length})</h3>
                </div>

                <div className="p-4 space-y-4">
                  {education.map(ed => (
                    <div key={ed._id} className="flex justify-between items-start pb-4 border-b border-white/5 last:border-b-0 last:pb-0">
                      <div>
                        <h4 className="font-bold text-sm text-slate-200">{ed.institution}</h4>
                        <span className="text-[10px] font-bold text-blue-400 uppercase">{ed.duration}</span>
                        <p className="text-xs text-slate-400 mt-0.5">{ed.degree} {ed.grade ? `(${ed.grade})` : ''}</p>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button 
                          onClick={() => startEditEducation(ed)}
                          className="text-blue-400 hover:text-blue-300 p-1.5 hover:bg-blue-500/10 rounded-lg transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button 
                          onClick={() => handleDeleteEducation(ed._id)}
                          className="text-red-400 hover:text-red-300 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ACHIEVEMENTS CONTROL PANEL */}
            <div className="space-y-6">
              {/* Form Achievement */}
              <form onSubmit={handleAddAchievement} className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  {editingAchievement ? <Pencil className="text-indigo-400" size={16} /> : <Plus className="text-indigo-400" size={16} />}
                  {editingAchievement ? 'Edit Achievement Record' : 'Add Achievement Record'}
                </h3>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Achievement Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Rajya Puraskar Awardee"
                    value={newAchievement.title}
                    onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                    className="w-full input-field py-2 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Details / Description</label>
                  <textarea 
                    rows={3}
                    required
                    placeholder="Summarize the accomplishment detail or honors context..."
                    value={newAchievement.description}
                    onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                    className="w-full input-field py-2 text-xs resize-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition-colors text-xs flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    {submitting ? <Loader2 className="animate-spin animate-pulse" size={14} /> : editingAchievement ? <CheckCircle size={14} /> : <Plus size={14} />}
                    {editingAchievement ? 'Update Entry' : 'Add Achievement Entry'}
                  </button>
                  {editingAchievement && (
                    <button 
                      type="button"
                      onClick={cancelEditAchievement}
                      className="border border-white/10 hover:border-white/20 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* Achievements list review */}
              <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-slate-900/40">
                  <h3 className="text-sm font-bold text-white">Registered Achievements ({achievements.length})</h3>
                </div>

                <div className="p-4 space-y-4">
                  {achievements.map(ach => (
                    <div key={ach._id} className="flex justify-between items-start pb-4 border-b border-white/5 last:border-b-0 last:pb-0">
                      <div className="pr-4">
                        <h4 className="font-bold text-sm text-slate-200">{ach.title}</h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ach.description}</p>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button 
                          onClick={() => startEditAchievement(ach)}
                          className="text-blue-400 hover:text-blue-300 p-1.5 hover:bg-blue-500/10 rounded-lg transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button 
                          onClick={() => handleDeleteAchievement(ach._id)}
                          className="text-red-400 hover:text-red-300 p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 5: INQUIRIES INBOX */}
        {activeTab === 'messages' && (
          <div className="glass-card rounded-2xl border border-white/5 overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-white/5 bg-slate-900/40 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Visitor Contact Messages ({messages.length})</h3>
            </div>

            {loadingData ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin text-blue-500" />
              </div>
            ) : messages.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <MessageSquare className="mx-auto text-slate-600 mb-2" size={32} />
                <span className="text-sm font-light">Inbox is empty. No messages received yet.</span>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {messages.map(msg => (
                  <div key={msg._id} className="p-6 hover:bg-white/5 transition-colors flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-bold text-sm text-white">{msg.name}</span>
                        <a href={`mailto:${msg.email}`} className="text-xs text-blue-400 hover:underline">
                          {msg.email}
                        </a>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                        Subject: {msg.subject}
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap pl-3 border-l border-slate-700 bg-slate-950/20 py-2 pr-4 rounded-r-xl">
                        {msg.message}
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => handleDeleteMessage(msg._id)}
                      className="flex items-center gap-1 border border-red-500/20 hover:bg-red-500/10 text-red-400 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors flex-shrink-0"
                    >
                      <Trash2 size={13} />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

    </div>
  );
};

export default AdminDashboard;
