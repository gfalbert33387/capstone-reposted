// mlModelIntegration.js
const axios = require('axios');

function callCustomMLModel(skillSet) {
    return axios.post('https://your-ml-model-api.com/compare', { skills: skillSet });
}
