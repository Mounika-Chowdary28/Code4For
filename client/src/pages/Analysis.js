import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Analysis = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [detailedDialog, setDetailedDialog] = useState(null); // 'skillGap', 'learning', 'jobs', 'interview'
  const [pdfGenerating, setPdfGenerating] = useState(null); // section name or null

  const generatePDF = async (section, title, content, images = []) => {
    setPdfGenerating(section);
    try {
      // Create a temporary div for PDF generation
      const tempDiv = document.createElement('div');
      tempDiv.style.width = '800px';
      tempDiv.style.padding = '20px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.innerHTML = `
        <h1 style="color: #1976d2; text-align: center; margin-bottom: 30px;">${title}</h1>
        <div style="line-height: 1.6; font-size: 14px; margin-bottom: 30px;">${content.replace(/\n/g, '<br>')}</div>
        ${images.length > 0 ? `
          <h2 style="color: #1976d2; margin-top: 40px; margin-bottom: 20px;">Visual Insights</h2>
          ${images.map((img, index) => `
            <div style="margin-bottom: 20px; text-align: center;">
              <img src="${img}" alt="Insight ${index + 1}" style="max-width: 100%; height: 200px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <p style="font-size: 12px; color: #666; margin-top: 8px;">Insight ${index + 1}</p>
            </div>
          `).join('')}
        ` : ''}
      `;
      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: 800,
        height: tempDiv.offsetHeight,
      });

      document.body.removeChild(tempDiv);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 20;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${section}-analysis.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF. Please try again.');
    }
    setPdfGenerating(null);
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const fetchAnalysis = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/analysis', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalysis(response.data);
    } catch (err) {
      console.error('Error fetching analysis:', err);
      setError('Failed to load analysis. Please try again.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalysis();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5">Please log in to view your career analysis.</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Career Re-Entry Analysis
        </Typography>

        <Button
          variant="contained"
          onClick={fetchAnalysis}
          disabled={loading}
          sx={{ mb: 3 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Refresh Analysis'}
        </Button>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {analysis && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AssessmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Skill Gap Analysis</Typography>
                  </Box>
                  <Typography variant="body2">
                    {truncateText(
                      (typeof analysis.skillGapAnalysis === 'object' && analysis.skillGapAnalysis?.summary) ||
                      (typeof analysis.skillGapAnalysis === 'string' && analysis.skillGapAnalysis) ||
                      'Analysis not available'
                    )}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => setDetailedDialog('skillGap')}
                    startIcon={<ExpandMoreIcon />}
                  >
                    View More
                  </Button>
                  <Button
                    size="small"
                    onClick={() => generatePDF('skill-gap', 'Skill Gap Analysis', 
                      (typeof analysis.skillGapAnalysis === 'object' && analysis.skillGapAnalysis?.detailed) ||
                      (typeof analysis.skillGapAnalysis === 'string' && analysis.skillGapAnalysis) ||
                      'Analysis not available',
                      (typeof analysis.skillGapAnalysis === 'object' && analysis.skillGapAnalysis?.images) || []
                    )}
                    disabled={pdfGenerating === 'skill-gap'}
                    startIcon={<PictureAsPdfIcon />}
                  >
                    {pdfGenerating === 'skill-gap' ? 'Generating...' : 'Download PDF'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Learning Roadmap</Typography>
                  </Box>
                  <Typography variant="body2">
                    {truncateText(
                      (typeof analysis.learningRoadmap === 'object' && analysis.learningRoadmap?.summary) ||
                      (typeof analysis.learningRoadmap === 'string' && analysis.learningRoadmap) ||
                      'Analysis not available'
                    )}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => setDetailedDialog('learning')}
                    startIcon={<ExpandMoreIcon />}
                  >
                    View More
                  </Button>
                  <Button
                    size="small"
                    onClick={() => generatePDF('learning-roadmap', 'Learning Roadmap', 
                      (typeof analysis.learningRoadmap === 'object' && analysis.learningRoadmap?.detailed) ||
                      (typeof analysis.learningRoadmap === 'string' && analysis.learningRoadmap) ||
                      'Analysis not available',
                      (typeof analysis.learningRoadmap === 'object' && analysis.learningRoadmap?.images) || []
                    )}
                    disabled={pdfGenerating === 'learning-roadmap'}
                    startIcon={<PictureAsPdfIcon />}
                  >
                    {pdfGenerating === 'learning-roadmap' ? 'Generating...' : 'Download PDF'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <WorkIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Job Suggestions</Typography>
                  </Box>
                  <Typography variant="body2">
                    {truncateText(
                      (typeof analysis.jobSuggestions === 'object' && analysis.jobSuggestions?.summary) ||
                      (typeof analysis.jobSuggestions === 'string' && analysis.jobSuggestions) ||
                      'Analysis not available'
                    )}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => setDetailedDialog('jobs')}
                    startIcon={<ExpandMoreIcon />}
                  >
                    View More
                  </Button>
                  <Button
                    size="small"
                    onClick={() => generatePDF('job-suggestions', 'Job Suggestions', 
                      (typeof analysis.jobSuggestions === 'object' && analysis.jobSuggestions?.detailed) ||
                      (typeof analysis.jobSuggestions === 'string' && analysis.jobSuggestions) ||
                      'Analysis not available',
                      (typeof analysis.jobSuggestions === 'object' && analysis.jobSuggestions?.images) || []
                    )}
                    disabled={pdfGenerating === 'job-suggestions'}
                    startIcon={<PictureAsPdfIcon />}
                  >
                    {pdfGenerating === 'job-suggestions' ? 'Generating...' : 'Download PDF'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <QuestionAnswerIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">Interview Preparation</Typography>
                  </Box>
                  <Typography variant="body2">
                    {truncateText(
                      (typeof analysis.interviewPrep === 'object' && analysis.interviewPrep?.summary) ||
                      (typeof analysis.interviewPrep === 'string' && analysis.interviewPrep) ||
                      'Analysis not available'
                    )}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => setDetailedDialog('interview')}
                    startIcon={<ExpandMoreIcon />}
                  >
                    View More
                  </Button>
                  <Button
                    size="small"
                    onClick={() => generatePDF('interview-prep', 'Interview Preparation', 
                      (typeof analysis.interviewPrep === 'object' && analysis.interviewPrep?.detailed) ||
                      (typeof analysis.interviewPrep === 'string' && analysis.interviewPrep) ||
                      'Analysis not available',
                      (typeof analysis.interviewPrep === 'object' && analysis.interviewPrep?.images) || []
                    )}
                    disabled={pdfGenerating === 'interview-prep'}
                    startIcon={<PictureAsPdfIcon />}
                  >
                    {pdfGenerating === 'interview-prep' ? 'Generating...' : 'Download PDF'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        )}

        {!analysis && !loading && !error && (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              No analysis available yet.
            </Typography>
            <Typography variant="body2">
              Please complete your profile to get personalized career re-entry recommendations.
            </Typography>
          </Paper>
        )}

        {/* Individual Detailed Analysis Dialogs */}
        <Dialog
          open={detailedDialog === 'skillGap'}
          onClose={() => setDetailedDialog(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              <AssessmentIcon sx={{ mr: 1, color: 'primary.main' }} />
              Detailed Skill Gap Analysis
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
              {(typeof analysis?.skillGapAnalysis === 'object' && analysis.skillGapAnalysis?.detailed) ||
               (typeof analysis?.skillGapAnalysis === 'string' && analysis.skillGapAnalysis) ||
               'Analysis not available'}
            </Typography>
            {(typeof analysis?.skillGapAnalysis === 'object' && analysis.skillGapAnalysis?.images && analysis.skillGapAnalysis.images.length > 0) && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Visual Insights
                </Typography>
                <Grid container spacing={2}>
                  {analysis.skillGapAnalysis.images.map((image, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box
                        component="img"
                        src={image}
                        alt={`Skill gap insight ${index + 1}`}
                        sx={{
                          width: '100%',
                          height: 200,
                          objectFit: 'cover',
                          borderRadius: 2,
                          boxShadow: 2
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailedDialog(null)}>Close</Button>
            <Button
              onClick={() => generatePDF('skill-gap', 'Skill Gap Analysis', 
                (typeof analysis.skillGapAnalysis === 'object' && analysis.skillGapAnalysis?.detailed) ||
                (typeof analysis.skillGapAnalysis === 'string' && analysis.skillGapAnalysis) ||
                'Analysis not available',
                (typeof analysis.skillGapAnalysis === 'object' && analysis.skillGapAnalysis?.images) || []
              )}
              disabled={pdfGenerating === 'skill-gap'}
              variant="contained"
              startIcon={<PictureAsPdfIcon />}
            >
              {pdfGenerating === 'skill-gap' ? 'Generating...' : 'Download PDF'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={detailedDialog === 'learning'}
          onClose={() => setDetailedDialog(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
              Detailed Learning Roadmap
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
              {(typeof analysis?.learningRoadmap === 'object' && analysis.learningRoadmap?.detailed) ||
               (typeof analysis?.learningRoadmap === 'string' && analysis.learningRoadmap) ||
               'Analysis not available'}
            </Typography>
            {(typeof analysis?.learningRoadmap === 'object' && analysis.learningRoadmap?.images && analysis.learningRoadmap.images.length > 0) && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Visual Insights
                </Typography>
                <Grid container spacing={2}>
                  {analysis.learningRoadmap.images.map((image, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box
                        component="img"
                        src={image}
                        alt={`Learning roadmap insight ${index + 1}`}
                        sx={{
                          width: '100%',
                          height: 200,
                          objectFit: 'cover',
                          borderRadius: 2,
                          boxShadow: 2
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailedDialog(null)}>Close</Button>
            <Button
              onClick={() => generatePDF('learning-roadmap', 'Learning Roadmap', 
                (typeof analysis.learningRoadmap === 'object' && analysis.learningRoadmap?.detailed) ||
                (typeof analysis.learningRoadmap === 'string' && analysis.learningRoadmap) ||
                'Analysis not available',
                (typeof analysis.learningRoadmap === 'object' && analysis.learningRoadmap?.images) || []
              )}
              disabled={pdfGenerating === 'learning-roadmap'}
              variant="contained"
              startIcon={<PictureAsPdfIcon />}
            >
              {pdfGenerating === 'learning-roadmap' ? 'Generating...' : 'Download PDF'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={detailedDialog === 'jobs'}
          onClose={() => setDetailedDialog(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              <WorkIcon sx={{ mr: 1, color: 'primary.main' }} />
              Detailed Job Suggestions
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
              {(typeof analysis?.jobSuggestions === 'object' && analysis.jobSuggestions?.detailed) ||
               (typeof analysis?.jobSuggestions === 'string' && analysis.jobSuggestions) ||
               'Analysis not available'}
            </Typography>
            {(typeof analysis?.jobSuggestions === 'object' && analysis.jobSuggestions?.images && analysis.jobSuggestions.images.length > 0) && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Visual Insights
                </Typography>
                <Grid container spacing={2}>
                  {analysis.jobSuggestions.images.map((image, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box
                        component="img"
                        src={image}
                        alt={`Job suggestions insight ${index + 1}`}
                        sx={{
                          width: '100%',
                          height: 200,
                          objectFit: 'cover',
                          borderRadius: 2,
                          boxShadow: 2
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailedDialog(null)}>Close</Button>
            <Button
              onClick={() => generatePDF('job-suggestions', 'Job Suggestions', 
                (typeof analysis.jobSuggestions === 'object' && analysis.jobSuggestions?.detailed) ||
                (typeof analysis.jobSuggestions === 'string' && analysis.jobSuggestions) ||
                'Analysis not available',
                (typeof analysis.jobSuggestions === 'object' && analysis.jobSuggestions?.images) || []
              )}
              disabled={pdfGenerating === 'job-suggestions'}
              variant="contained"
              startIcon={<PictureAsPdfIcon />}
            >
              {pdfGenerating === 'job-suggestions' ? 'Generating...' : 'Download PDF'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={detailedDialog === 'interview'}
          onClose={() => setDetailedDialog(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
              <QuestionAnswerIcon sx={{ mr: 1, color: 'primary.main' }} />
              Detailed Interview Preparation
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
              {(typeof analysis?.interviewPrep === 'object' && analysis.interviewPrep?.detailed) ||
               (typeof analysis?.interviewPrep === 'string' && analysis.interviewPrep) ||
               'Analysis not available'}
            </Typography>
            {(typeof analysis?.interviewPrep === 'object' && analysis.interviewPrep?.images && analysis.interviewPrep.images.length > 0) && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Visual Insights
                </Typography>
                <Grid container spacing={2}>
                  {analysis.interviewPrep.images.map((image, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box
                        component="img"
                        src={image}
                        alt={`Interview preparation insight ${index + 1}`}
                        sx={{
                          width: '100%',
                          height: 200,
                          objectFit: 'cover',
                          borderRadius: 2,
                          boxShadow: 2
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailedDialog(null)}>Close</Button>
            <Button
              onClick={() => generatePDF('interview-prep', 'Interview Preparation', 
                (typeof analysis.interviewPrep === 'object' && analysis.interviewPrep?.detailed) ||
                (typeof analysis.interviewPrep === 'string' && analysis.interviewPrep) ||
                'Analysis not available',
                (typeof analysis.interviewPrep === 'object' && analysis.interviewPrep?.images) || []
              )}
              disabled={pdfGenerating === 'interview-prep'}
              variant="contained"
              startIcon={<PictureAsPdfIcon />}
            >
              {pdfGenerating === 'interview-prep' ? 'Generating...' : 'Download PDF'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Analysis;