// onetIntegration.js
const axios = require('axios');
const apiKey = 'your_onet_api_key'; // Replace with your actual API key

function callONETApi(skill) {
    return axios.get(`https://services.onetcenter.org/ws/mnm/skills/${skill}?client=${apiKey}`);
}
