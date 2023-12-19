const express = require('express');
const router = express.Router();
const resumeFeedbackController = require('../controllers/resumeFeedbackController');

// Route to display the resume feedback form
router.get('/resume-feedback', resumeFeedbackController.getForm);

// Route to handle the resume upload and provide feedback
router.post('/resume-feedback', resumeFeedbackController.uploadResume, resumeFeedbackController.provideFeedback);

module.exports = router;


