// nlpIntegration.js
const { spawn } = require('child_process');

function callSpaCyNLP(text) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['./nlp_spacy.py', text]);
        let dataString = '';
        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });
        pythonProcess.stdout.on('end', () => {
            resolve(JSON.parse(dataString));
        });
        pythonProcess.stderr.on('data', (data) => {
            reject(data.toString());
        });
    });
}

module.exports = { callSpaCyNLP };
