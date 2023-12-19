// utils/resumeParser.js
function parseResume(fileBuffer) {
    // A simple keyword search to find skills - replace with more complex logic or third-party service
    const resumeText = fileBuffer.toString('utf8');
    const skills = ['JavaScript', 'Python', 'Java']; // Example skills
    const foundSkills = skills.filter(skill => resumeText.includes(skill));
    return foundSkills;
}

// utils/feedbackGenerator.js
function generateFeedback(foundSkills) {
    // Generate feedback based on found skills - replace with more complex logic
    if (foundSkills.length === 0) {
        return 'No skills found. Consider adding technical skills to your resume.';
    }
    let feedback = 'Skills found: ' + foundSkills.join(', ') + '. ';
    feedback += 'Consider highlighting these skills with examples of your work.';
    return feedback;
}

module.exports = {
    parseResume,
    generateFeedback
};
