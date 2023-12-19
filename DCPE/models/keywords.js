
const mongoose = require('mongoose');

const keywordsSchema = new mongoose.Schema({

    // each array contains all relevant keywords from all jobs in that category
    // 1 document total
    uniqueSkills: {type: Array, required: true},
    uniqueExp: {type: Array, required: true},
    uniqueEdu: {type: Array, required: true},
},
    {timestamps: true}
)

module.exports = mongoose.model('keywords', keywordsSchema);