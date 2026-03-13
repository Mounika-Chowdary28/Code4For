import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Chip,
  Paper,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const emptyProfile = {
  age: '',
  location: '',
  phone: '',
  education: '',
  linkedin: '',
  website: '',
  previousRole: '',
  experience: '',
  careerBreakDuration: '',
  desiredCareerPath: '',
  currentSalary: '',
  desiredSalary: '',
  skills: [],
  certifications: [],
  languages: [],
  availability: '',
  workPreference: '',
  relocationWillingness: false,
  additionalNotes: '',
};

const normalizeProfile = (data) => ({
  age: data.age || '',
  location: data.location || '',
  phone: data.phone || '',
  education: data.education || '',
  linkedin: data.linkedin || '',
  website: data.website || '',
  previousRole: data.previousRole || '',
  experience: data.experience || '',
  careerBreakDuration: data.careerBreakDuration || '',
  desiredCareerPath: data.desiredCareerPath || '',
  currentSalary: data.currentSalary || '',
  desiredSalary: data.desiredSalary || '',
  skills: data.skills || [],
  certifications: data.certifications || [],
  languages: data.languages || [],
  availability: data.availability || '',
  workPreference: data.workPreference || '',
  relocationWillingness: data.relocationWillingness || false,
  additionalNotes: data.additionalNotes || '',
});

const Profile = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [profile, setProfile] = useState(emptyProfile);
  const [skillInput, setSkillInput] = useState('');
  const [certInput, setCertInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/profile');
      console.log('Profile fetched:', res.data);
      if (res.data && res.data.profile) {
        setProfile(normalizeProfile(res.data.profile));
      } else {
        setProfile(emptyProfile);
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setProfile(emptyProfile);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage('');
    setError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile();
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profile.previousRole || !profile.experience || !profile.careerBreakDuration || !profile.desiredCareerPath) {
      setError('Please fill in all required fields');
      setMessage('');
      return;
    }

    console.log('Sending profile data:', profile);

    try {
      await axios.put('/api/profile', profile);

      // ✅ KEY FIX: re-fetch from server so view mode always shows
      // the persisted data, regardless of what shape the PUT response returns
      await fetchProfile();

      setMessage('Profile updated successfully!');
      setError('');
      setIsEditing(false);
    } catch (err) {
      console.error('Profile save error:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to update profile');
      setMessage('');
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };
  const removeSkill = (s) => setProfile({ ...profile, skills: profile.skills.filter(x => x !== s) });

  const addCertification = () => {
    if (certInput.trim() && !profile.certifications.includes(certInput.trim())) {
      setProfile({ ...profile, certifications: [...profile.certifications, certInput.trim()] });
      setCertInput('');
    }
  };
  const removeCertification = (c) => setProfile({ ...profile, certifications: profile.certifications.filter(x => x !== c) });

  const addLanguage = () => {
    if (languageInput.trim() && !profile.languages.includes(languageInput.trim())) {
      setProfile({ ...profile, languages: [...profile.languages, languageInput.trim()] });
      setLanguageInput('');
    }
  };
  const removeLanguage = (l) => setProfile({ ...profile, languages: profile.languages.filter(x => x !== l) });

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5">Please log in to view your profile.</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">Your Career Profile</Typography>
          {!isEditing && (
            <Button variant="contained" startIcon={<EditIcon />} onClick={handleEdit}>
              Edit Profile
            </Button>
          )}
        </Box>

        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {isEditing ? (
          // ── Edit Mode ──────────────────────────────────────
          <Paper sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>

                <Grid item xs={12} sm={6}>
                  <TextField fullWidth required label="Previous Role" value={profile.previousRole}
                    onChange={(e) => setProfile({ ...profile, previousRole: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth required label="Career Break Duration" value={profile.careerBreakDuration}
                    placeholder="e.g., 3 years"
                    onChange={(e) => setProfile({ ...profile, careerBreakDuration: e.target.value })} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth required multiline rows={3} label="Work Experience" value={profile.experience}
                    placeholder="Describe your previous work experience..."
                    onChange={(e) => setProfile({ ...profile, experience: e.target.value })} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth required label="Desired Career Path" value={profile.desiredCareerPath}
                    placeholder="What career path are you interested in pursuing?"
                    onChange={(e) => setProfile({ ...profile, desiredCareerPath: e.target.value })} />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2 }}>Personal Information</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth type="number" label="Age" value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Location" value={profile.location} placeholder="City, State/Country"
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Phone Number" value={profile.phone} placeholder="+1 (555) 123-4567"
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Education" value={profile.education} placeholder="Highest degree or education level"
                    onChange={(e) => setProfile({ ...profile, education: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="LinkedIn Profile" value={profile.linkedin} placeholder="https://linkedin.com/in/yourprofile"
                    onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Personal Website/Portfolio" value={profile.website} placeholder="https://yourwebsite.com"
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })} />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2 }}>Career Details</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Current Salary Range" value={profile.currentSalary} placeholder="e.g., $50,000 - $70,000"
                    onChange={(e) => setProfile({ ...profile, currentSalary: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Desired Salary Range" value={profile.desiredSalary} placeholder="e.g., $70,000 - $90,000"
                    onChange={(e) => setProfile({ ...profile, desiredSalary: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Availability" value={profile.availability} placeholder="e.g., Immediate, 2 weeks, 1 month"
                    onChange={(e) => setProfile({ ...profile, availability: e.target.value })} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Work Preference" value={profile.workPreference} placeholder="Remote, Hybrid, or On-site"
                    onChange={(e) => setProfile({ ...profile, workPreference: e.target.value })} />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Languages</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField fullWidth label="Add a language" value={languageInput} placeholder="e.g., English, Spanish"
                      onChange={(e) => setLanguageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())} />
                    <Button variant="contained" onClick={addLanguage}>Add</Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profile.languages.map((l, i) => (
                      <Chip key={i} label={l} onDelete={() => removeLanguage(l)} color="info" variant="outlined" />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Skills</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField fullWidth label="Add a skill" value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                    <Button variant="contained" onClick={addSkill}>Add</Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profile.skills.map((s, i) => (
                      <Chip key={i} label={s} onDelete={() => removeSkill(s)} color="primary" variant="outlined" />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Certifications</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField fullWidth label="Add a certification" value={certInput}
                      onChange={(e) => setCertInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())} />
                    <Button variant="contained" onClick={addCertification}>Add</Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profile.certifications.map((c, i) => (
                      <Chip key={i} label={c} onDelete={() => removeCertification(c)} color="secondary" variant="outlined" />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2 }}>Additional Information</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <input type="checkbox" id="relocation" checked={profile.relocationWillingness}
                      onChange={(e) => setProfile({ ...profile, relocationWillingness: e.target.checked })}
                      style={{ marginRight: '8px' }} />
                    <label htmlFor="relocation">Open to relocation</label>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth multiline rows={4} label="Additional Notes" value={profile.additionalNotes}
                    placeholder="Any additional information you'd like to share..."
                    onChange={(e) => setProfile({ ...profile, additionalNotes: e.target.value })} />
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button type="submit" variant="contained" size="large" startIcon={<SaveIcon />}>
                      Save Changes
                    </Button>
                    <Button variant="outlined" size="large" onClick={handleCancel} startIcon={<CancelIcon />}>
                      Cancel
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        ) : (
          // ── View Mode ──────────────────────────────────────
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card><CardContent>
                <Typography variant="h6" color="primary" gutterBottom>Previous Role</Typography>
                <Typography variant="body1">{profile.previousRole || 'Not specified'}</Typography>
              </CardContent></Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card><CardContent>
                <Typography variant="h6" color="primary" gutterBottom>Career Break Duration</Typography>
                <Typography variant="body1">{profile.careerBreakDuration || 'Not specified'}</Typography>
              </CardContent></Card>
            </Grid>
            <Grid item xs={12}>
              <Card><CardContent>
                <Typography variant="h6" color="primary" gutterBottom>Work Experience</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{profile.experience || 'Not specified'}</Typography>
              </CardContent></Card>
            </Grid>
            <Grid item xs={12}>
              <Card><CardContent>
                <Typography variant="h6" color="primary" gutterBottom>Desired Career Path</Typography>
                <Typography variant="body1">{profile.desiredCareerPath || 'Not specified'}</Typography>
              </CardContent></Card>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>Personal Information</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card><CardContent>
                <Typography variant="h6" color="primary" gutterBottom>Age</Typography>
                <Typography variant="body1">{profile.age || 'Not specified'}</Typography>
              </CardContent></Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card><CardContent>
                <Typography variant="h6" color="primary" gutterBottom>Location</Typography>
                <Typography variant="body1">{profile.location || 'Not specified'}</Typography>
              </CardContent></Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card><CardContent>
                <Typography variant="h6" color="primary" gutterBottom>Phone Number</Typography>
                <Typography variant="body1">{profile.phone || 'Not specified'}</Typography>
              </CardContent></Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card><CardContent>
                <Typography variant="h6" color="primary" gutterBottom>Education</Typography>
                <Typography variant="body1">{profile.education || 'Not specified'}</Typography>
              </CardContent></Card>
            </Grid>
            {profile.linkedin && (
              <Grid item xs={12} md={6}>
                <Card><CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>LinkedIn Profile</Typography>
                  <Typography variant="body1">
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>
                      {profile.linkedin}
                    </a>
                  </Typography>
                </CardContent></Card>
              </Grid>
            )}
            {profile.website && (
              <Grid item xs={12} md={6}>
                <Card><CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>Personal Website</Typography>
                  <Typography variant="body1">
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>
                      {profile.website}
                    </a>
                  </Typography>
                </CardContent></Card>
              </Grid>
            )}

            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>Career Details</Typography>
            </Grid>
            {(profile.currentSalary || profile.desiredSalary) && (
              <>
                <Grid item xs={12} md={6}>
                  <Card><CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>Current Salary Range</Typography>
                    <Typography variant="body1">{profile.currentSalary || 'Not specified'}</Typography>
                  </CardContent></Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card><CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>Desired Salary Range</Typography>
                    <Typography variant="body1">{profile.desiredSalary || 'Not specified'}</Typography>
                  </CardContent></Card>
                </Grid>
              </>
            )}
            {(profile.availability || profile.workPreference) && (
              <>
                <Grid item xs={12} md={6}>
                  <Card><CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>Availability</Typography>
                    <Typography variant="body1">{profile.availability || 'Not specified'}</Typography>
                  </CardContent></Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card><CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>Work Preference</Typography>
                    <Typography variant="body1">{profile.workPreference || 'Not specified'}</Typography>
                  </CardContent></Card>
                </Grid>
              </>
            )}
            <Grid item xs={12} md={6}>
              <Card><CardContent>
                <Typography variant="h6" color="primary" gutterBottom>Relocation Willingness</Typography>
                <Typography variant="body1">
                  {profile.relocationWillingness ? 'Open to relocation' : 'Not open to relocation'}
                </Typography>
              </CardContent></Card>
            </Grid>

            {profile.languages && profile.languages.length > 0 && (
              <Grid item xs={12}>
                <Card><CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>Languages</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profile.languages.map((l, i) => (
                      <Chip key={i} label={l} color="info" variant="filled" />
                    ))}
                  </Box>
                </CardContent></Card>
              </Grid>
            )}

            {profile.additionalNotes && (
              <Grid item xs={12}>
                <Card><CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>Additional Notes</Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{profile.additionalNotes}</Typography>
                </CardContent></Card>
              </Grid>
            )}

            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>Skills &amp; Certifications</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card><CardContent>
                <Typography variant="h6" color="primary" gutterBottom>Skills</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profile.skills && profile.skills.length > 0 ? (
                    profile.skills.map((s, i) => <Chip key={i} label={s} color="primary" variant="filled" />)
                  ) : (
                    <Typography variant="body2" color="text.secondary">No skills added yet</Typography>
                  )}
                </Box>
              </CardContent></Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card><CardContent>
                <Typography variant="h6" color="primary" gutterBottom>Certifications</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profile.certifications && profile.certifications.length > 0 ? (
                    profile.certifications.map((c, i) => <Chip key={i} label={c} color="secondary" variant="filled" />)
                  ) : (
                    <Typography variant="body2" color="text.secondary">No certifications added yet</Typography>
                  )}
                </Box>
              </CardContent></Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Profile;