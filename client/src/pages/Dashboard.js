import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  LinearProgress,
  Chip,
  Avatar,
  Paper,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const Dashboard = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get('/api/profile');
      console.log('Dashboard fetched profile:', res.data);
      setProfile(res.data); // This contains the full user object
    } catch (err) {
      console.error('Dashboard profile fetch error:', err);
    }
  }, []);

  const fetchAnalysis = useCallback(async () => {
    try {
      const res = await axios.get('/api/analysis');
      setAnalysis(res.data);
    } catch (err) {
      // Analysis not available yet
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
      fetchAnalysis();
    }
  }, [isAuthenticated, fetchProfile, fetchAnalysis]);

  const getProfileCompletion = () => {
    if (!profile?.profile) return 0;
    const fields = ['previousRole', 'experience', 'careerBreakDuration', 'desiredCareerPath'];
    const completed = fields.filter(field => profile.profile[field]).length;
    return (completed / fields.length) * 100;
  };

  const isProfileComplete = () => {
    return profile?.profile?.previousRole && profile?.profile?.experience &&
           profile?.profile?.careerBreakDuration && profile?.profile?.desiredCareerPath;
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5">Please log in to view your dashboard.</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {profile?.name || 'User'}!
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Here's your career re-entry journey overview
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Status Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Typography variant="h6">Profile Status</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Complete your profile to get personalized recommendations
              </Typography>
              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography variant="body2" gutterBottom>
                  Profile Completion: {Math.round(getProfileCompletion())}%
                </Typography>
                <LinearProgress variant="determinate" value={getProfileCompletion()} />
              </Box>
              <Box sx={{ mt: 2 }}>
                {[
                  { key: 'previousRole', label: 'Previous Role' },
                  { key: 'experience', label: 'Experience' },
                  { key: 'careerBreakDuration', label: 'Career Break Duration' },
                  { key: 'desiredCareerPath', label: 'Desired Career Path' },
                ].map((item) => (
                  <Box key={item.key} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {profile?.profile?.[item.key] ? (
                      <CheckCircleIcon sx={{ color: 'success.main', mr: 1, fontSize: 16 }} />
                    ) : (
                      <RadioButtonUncheckedIcon sx={{ color: 'grey.400', mr: 1, fontSize: 16 }} />
                    )}
                    <Typography variant="body2">{item.label}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to="/profile">
                {isProfileComplete() ? 'Update Profile' : 'Complete Profile'}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Quick Actions Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/profile"
                  startIcon={<PersonIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Update Profile
                </Button>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/analysis"
                  startIcon={<AssessmentIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                  disabled={!isProfileComplete()}
                >
                  View Analysis
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Skills & Certifications */}
        {profile?.profile && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Your Skills & Certifications
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profile.profile.skills && profile.profile.skills.length > 0 ? (
                      profile.profile.skills.map((skill, index) => (
                        <Chip key={index} label={skill} color="primary" variant="outlined" />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No skills added yet
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Certifications
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {profile.profile.certifications && profile.profile.certifications.length > 0 ? (
                      profile.profile.certifications.map((cert, index) => (
                        <Chip key={index} label={cert} color="secondary" variant="outlined" />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No certifications added yet
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}

        {/* Analysis Preview */}
        {analysis && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AssessmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Latest Analysis</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  <strong>Skill Gap:</strong> {(typeof analysis.skillGapAnalysis === 'object' && analysis.skillGapAnalysis?.summary) ||
                    (typeof analysis.skillGapAnalysis === 'string' && analysis.skillGapAnalysis?.substring(0, 100)) ||
                    'Analysis not available'}...
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Next Steps:</strong> {(typeof analysis.learningRoadmap === 'object' && analysis.learningRoadmap?.summary) ||
                    (typeof analysis.learningRoadmap === 'string' && analysis.learningRoadmap?.substring(0, 100)) ||
                    'Analysis not available'}...
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to="/analysis">
                  View Full Analysis
                </Button>
              </CardActions>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;