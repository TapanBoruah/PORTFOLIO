const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['frontend', 'backend', 'languages', 'mechanical', 'other'],
    default: 'frontend'
  },
  icon: {
    type: String,
    required: true,
    default: ''
  },
  proficiency: {
    type: Number,
    min: 0,
    max: 100,
    default: 80
  }
}, { timestamps: true });

module.exports = mongoose.model('Skill', SkillSchema);
