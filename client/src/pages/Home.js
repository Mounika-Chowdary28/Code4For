import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import AssessmentIcon from '@mui/icons-material/Assessment';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null; // Will redirect
  }
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom color="primary">
          Welcome to Career Re-Entry Assistant
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Empowering Women to Confidently Return to Professional Careers
        </Typography>
        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          Our AI-powered platform helps you navigate your career re-entry journey with personalized guidance,
          skill gap analysis, and tailored recommendations for certifications, courses, and job opportunities.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" size="large" component={Link} to="/register" sx={{ mr: 2 }}>
            Get Started
          </Button>
          <Button variant="outlined" size="large" component={Link} to="/login">
            Sign In
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <WorkIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Profile Creation
              </Typography>
              <Typography variant="body2">
                Capture your previous work experience, career break duration, and desired career path
                to create a comprehensive profile for personalized recommendations.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <AssessmentIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                AI Analysis
              </Typography>
              <Typography variant="body2">
                Our AI analyzes your profile against current industry requirements to identify skill gaps
                and provide targeted recommendations for your career re-entry.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <SchoolIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h3" gutterBottom>
                Learning Roadmap
              </Typography>
              <Typography variant="body2">
                Receive a personalized learning plan with recommended certifications, courses,
                and resources to bridge skill gaps and prepare for your return to work.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Ready to Restart Your Career?
        </Typography>
        <Typography variant="body1" paragraph>
          Join thousands of women who have successfully returned to fulfilling careers with our guidance.
        </Typography>
        <Button variant="contained" size="large" component={Link} to="/register">
          Start Your Journey Today
        </Button>
      </Box>
    </Container>
  );
};

export default Home;