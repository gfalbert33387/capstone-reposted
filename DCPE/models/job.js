const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the user
const jobSchema = new Schema({
    title: {type: String, required: [true, 'title is required']},
    description: {type: String, required: false},
    medianAnnual: {type: Number, required: false},
    medianHourly: {type: Number, required: false},
    reqEdu: {type: String, required: false},
    reqWorkExp: {type: String, required: false},
    jobGrowthPerc: {type: String, required: false},
    jobGrowthNum: {type: String, required: false},
    hours: {type: Array, required: false},
    reqSkillset: {type: Array, required: false},
    citation: {type: Array, required: false},
},
    {timestamps: true}
)

// Function to remove a key-value pair from doc that is '', '[]', '{}' or mistyped
/*function delEmptyKey(val){
    if (val === '' || (Array.isArray(val) && val.length === 0) ||
       (typeof val === 'object' && Object.keys(val).length === 0)) {
        return undefined;
    }
    return val;
}*/

module.exports = mongoose.model('Job', jobSchema)