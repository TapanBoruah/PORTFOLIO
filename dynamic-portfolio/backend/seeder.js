const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Models
const User = require('./models/User');
const Skill = require('./models/Skill');
const Project = require('./models/Project');
const Education = require('./models/Education');
const Achievement = require('./models/Achievement');
const Message = require('./models/Message');
const Profile = require('./models/Profile');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio';

// Initial Skills data from index.html
const skills = [
  { name: 'HTML', category: 'frontend', icon: 'https://img.icons8.com/color/144/html-5--v1.png', proficiency: 95 },
  { name: 'CSS', category: 'frontend', icon: 'https://img.icons8.com/color/144/css3.png', proficiency: 90 },
  { name: 'JAVASCRIPT', category: 'frontend', icon: 'https://img.icons8.com/color/144/javascript--v1.png', proficiency: 85 },
  { name: 'REACT JS', category: 'frontend', icon: 'https://img.icons8.com/plasticine/144/react.png', proficiency: 80 },
  { name: 'NODE JS', category: 'backend', icon: 'https://img.icons8.com/color/144/nodejs.png', proficiency: 75 },
  { name: 'MONGO DB', category: 'backend', icon: 'https://img.icons8.com/color/144/mongodb.png', proficiency: 75 },
  { name: 'EXPRESS JS', category: 'backend', icon: 'https://img.icons8.com/color/144/expressify.png', proficiency: 75 },
  { name: 'PYTHON', category: 'languages', icon: 'https://img.icons8.com/color/144/python--v1.png', proficiency: 80 },
  { name: 'C++', category: 'languages', icon: 'https://img.icons8.com/color/144/c-plus-plus-logo.png', proficiency: 85 },
  { name: 'C', category: 'languages', icon: 'https://img.icons8.com/color/144/c-programming.png', proficiency: 75 }
];

// Initial Education data from index.html
const education = [
  {
    institution: 'National Institute of Technology Arunachal Pradesh',
    degree: 'B.Tech in Mechanical Engineering (Minor in CSE)',
    duration: '',
    grade: '',
    order: 1
  },
  {
    institution: 'Kendriya Vidyalaya Kimin',
    degree: 'Class 12',
    duration: '2024',
    grade: '85%',
    order: 2
  },
  {
    institution: 'Kendriya Vidyalaya Kimin',
    degree: 'Class 10',
    duration: '2022',
    grade: '92.6%',
    order: 3
  }
];

// Initial Achievements data from index.html
const achievements = [
  {
    title: 'Completed Music Course / Prabhakar Degree (Eq. to B.Music)',
    description: 'Specialization in Tabla',
    order: 1
  },
  {
    title: 'Two-time National Performer / Regional Winner (Solo Percussion Instrumental)',
    description: 'Represented at K.V.S national-level cultural events / Secured first place in K.V.S regional competitions',
    order: 2
  },
  {
    title: 'Rajya Puraskar Awardee',
    description: 'Honored with the highest state-level scouting award for excellence, leadership, and community service.',
    order: 3
  },
  {
    title: 'Three-time Cluster Winner (Solo Percussion Instrumental)',
    description: 'Achieved top positions in cluster-level competitions',
    order: 4
  }
];

// Initial Projects data from index.html
// Using absolute references for relative image names for visual continuity
const projects = [
 
  {
    title: 'Karyalipi',
    description: 'A full-stack notes-taking website using MERN.',
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com/TapanBoruah/Karyalipi',
    liveUrl: 'https://github.com/TapanBoruah/Karyalipi',
    tags: ['MERN Stack', 'React', 'Node.js', 'Express', 'MongoDB']
  },
  {
    title: 'Music Club Website',
    description: 'Website for NITAP Music Club.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://www.nitap.ac.in/musicclub/#',
    liveUrl: 'https://www.nitap.ac.in/musicclub/#',
    tags: ['HTML', 'CSS', 'JavaScript']
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Seeder connected to MongoDB.');

    // Clear existing collections
    await User.deleteMany();
    await Skill.deleteMany();
    await Project.deleteMany();
    await Education.deleteMany();
    await Achievement.deleteMany();
    await Message.deleteMany();
    await Profile.deleteMany();

    console.log('Cleared existing collection entries.');

    // Seed Admin User
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const admin = new User({
      username: adminUsername,
      password: adminPassword // Plain text: will be hashed automatically by models/User.js pre-save middleware
    });

    await admin.save();
    console.log(`Successfully registered default Admin user (${adminUsername}).`);

    // Seed Default Profile
    const defaultProfile = new Profile();
    await defaultProfile.save();
    console.log('Seeded default Profile successfully.');

    // Seed Skills
    await Skill.insertMany(skills);
    console.log(`Seeded ${skills.length} skills successfully.`);

    // Seed Education
    await Education.insertMany(education);
    console.log(`Seeded ${education.length} education records successfully.`);

    // Seed Achievements
    await Achievement.insertMany(achievements);
    console.log(`Seeded ${achievements.length} achievements successfully.`);

    // Seed Projects
    await Project.insertMany(projects);
    console.log(`Seeded ${projects.length} project items successfully.`);

    console.log('Database loading completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Fatal seeding failure details:', err);
    process.exit(1);
  }
};

seedData();
