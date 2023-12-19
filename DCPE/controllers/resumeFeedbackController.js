const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const Feedback = require('../models/Feedback');
const { parseResume, generateFeedback } = require('../utils/resumeParser');

exports.getForm = (req, res) => {
    res.render('resume-feedback');
};

exports.uploadResume = upload.single('resume');

exports.provideFeedback = async (req, res) => {
    const fileBuffer = req.file.buffer;
    const foundSkills = parseResume(fileBuffer);
    const feedback = generateFeedback(foundSkills);
    
    // Save feedback to MongoDB
    const newFeedback = new Feedback({ resume: fileBuffer, feedback });
    await newFeedback.save();

    res.render('resume-feedback', { feedback });
};
