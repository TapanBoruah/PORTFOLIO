const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  fullName: { type: String, default: 'Tapan Boruah' },
  title: { type: String, default: 'Mechanical Engineer & MERN Developer' },
  tagline: { type: String, default: 'NIT Arunachal Pradesh Sophomore' },
  avatar: { type: String, default: '/imagesportfolio/me.png' },
  aboutImage: { type: String, default: '/imagesportfolio/me1.jpg' },
  aboutText1: { type: String, default: "I’m Tapan Boruah, a 2nd-year Mechanical Engineering student with a Minor in Computer Science & Engineering at the National Institute of Technology, Arunachal Pradesh. Hailing from Lakhimpur, Assam, I hold a deep interest in both physical engineering processes and dynamic backend architectures." },
  aboutText2: { type: String, default: "As a full-stack MERN Stack Developer, I build performant web applications using MongoDB, Express, React, and Node.js. My minor in Computer Science supplies me with strong foundations in programming and clean systems design." },
  aboutText3: { type: String, default: "In addition to math, gears, and code, I am a trained musician (Tabla player, Percussionist, and Drummer) with a completed music degree (Prabhakar Degree, equivalent to B.Music). Operating across both logic-bound equations and musical rhythms grants me a unique, creative, and structured approach to problem-solving." },
  cgpa: { type: String, default: '8.73' },
  projectsCount: { type: Number, default: 4 },
  email: { type: String, default: 'tapanboruah10@gmail.com' },
  location: { type: String, default: 'NIT Arunachal Pradesh, Yupia Campus, Arunachal Pradesh, India' },
  sector: { type: String, default: 'Mechanical Engineering + Full-Stack Systems' },
  githubUrl: { type: String, default: 'https://github.com/TapanBoruah' },
  linkedinUrl: { type: String, default: 'https://www.linkedin.com/in/tapan-boruah-391a08330/' },
  instagramUrl: { type: String, default: 'https://www.instagram.com/tttapan_music/' },
  facebookUrl: { type: String, default: 'https://www.facebook.com/tttapanmusic' },
  cvUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
