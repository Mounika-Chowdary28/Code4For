const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    // Personal Information
    age: Number,
    location: String,
    phone: String,
    education: String,
    linkedin: String,
    website: String,
    
    // Career Information
    previousRole: String,
    experience: String,
    careerBreakDuration: String,
    desiredCareerPath: String,
    currentSalary: String,
    desiredSalary: String,
    
    // Skills & Qualifications
    skills: [String],
    certifications: [String],
    languages: [String],
    
    // Additional Information
    availability: String, // e.g., "Immediate", "2 weeks", "1 month"
    workPreference: String, // e.g., "Remote", "Hybrid", "On-site"
    relocationWillingness: Boolean,
    additionalNotes: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);