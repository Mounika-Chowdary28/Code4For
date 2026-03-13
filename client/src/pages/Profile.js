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

const Profile = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    previousRole: '',
    experience: '',
    careerBreakDuration: '',
    desiredCareerPath: '',
    skills: [],
    certifications: [],
  });
  const [skillInput, setSkillInput] = useState('');
  const [certInput, setCertInput] = useState('');
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
      if (res.data.profile) {
        setProfile(res.data.profile);
      } else {
        // If no profile exists yet, keep the default empty profile
        setProfile({
          previousRole: '',
          experience: '',
          careerBreakDuration: '',
          desiredCareerPath: '',
          skills: [],
          certifications: [],
        });
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setMessage('');
    setError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Refetch profile to reset any unsaved changes
    fetchProfile();
    setMessage('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!profile.previousRole || !profile.experience || !profile.careerBreakDuration || !profile.desiredCareerPath) {
      setError('Please fill in all required fields');
      setMessage('');
      return;
    }

    console.log('Sending profile data:', profile);

    try {
      const res = await axios.put('/api/profile', profile);
      console.log('Profile save response:', res.data);
      setProfile(res.data.profile); // Update local state with saved profile data
      setMessage('Profile updated successfully!');
      setError('');
      setIsEditing(false);
    } catch (err) {
      console.error('Profile save error:', err);
      setError('Failed to update profile');
      setMessage('');
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove),
    });
  };

  const addCertification = () => {
    if (certInput.trim() && !profile.certifications.includes(certInput.trim())) {
      setProfile({
        ...profile,
        certifications: [...profile.certifications, certInput.trim()],
      });
      setCertInput('');
    }
  };

  const removeCertification = (certToRemove) => {
    setProfile({
      ...profile,
      certifications: profile.certifications.filter(cert => cert !== certToRemove),
    });
  };

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
          <Typography variant="h4" component="h1">
            Your Career Profile
          </Typography>
          {!isEditing && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
            >
              Edit Profile
            </Button>
          )}
        </Box>

        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {isEditing ? (
          // Edit Mode
          <Paper sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Previous Role"
                    value={profile.previousRole}
                    onChange={(e) => setProfile({ ...profile, previousRole: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Career Break Duration"
                    value={profile.careerBreakDuration}
                    onChange={(e) => setProfile({ ...profile, careerBreakDuration: e.target.value })}
                    placeholder="e.g., 3 years"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Work Experience"
                    value={profile.experience}
                    onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                    placeholder="Describe your previous work experience..."
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Desired Career Path"
                    value={profile.desiredCareerPath}
                    onChange={(e) => setProfile({ ...profile, desiredCareerPath: e.target.value })}
                    placeholder="What career path are you interested in pursuing?"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Skills
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Add a skill"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <Button variant="contained" onClick={addSkill}>
                      Add
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profile.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        onDelete={() => removeSkill(skill)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Certifications
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Add a certification"
                      value={certInput}
                      onChange={(e) => setCertInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                    />
                    <Button variant="contained" onClick={addCertification}>
                      Add
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profile.certifications.map((cert, index) => (
                      <Chip
                        key={index}
                        label={cert}
                        onDelete={() => removeCertification(cert)}
                        color="secondary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
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
          // View Mode
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Previous Role
                  </Typography>
                  <Typography variant="body1">
                    {profile.previousRole || 'Not specified'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Career Break Duration
                  </Typography>
                  <Typography variant="body1">
                    {profile.careerBreakDuration || 'Not specified'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Work Experience
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {profile.experience || 'Not specified'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Desired Career Path
                  </Typography>
                  <Typography variant="body1">
                    {profile.desiredCareerPath || 'Not specified'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profile.skills && profile.skills.length > 0 ? (
                      profile.skills.map((skill, index) => (
                        <Chip key={index} label={skill} color="primary" variant="filled" />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No skills added yet
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Certifications
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profile.certifications && profile.certifications.length > 0 ? (
                      profile.certifications.map((cert, index) => (
                        <Chip key={index} label={cert} color="secondary" variant="filled" />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No certifications added yet
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Profile;