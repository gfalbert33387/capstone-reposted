const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the user
const jobPrefsSchema = new Schema({
    title: {type: String, required: [true, 'title is required']},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: [true, 'user is required']},

    minAnnual: {type: Number, required: false},
    maxAnnual: {type: Number, required: false},
    minHourly: {type: Number, required: false},
    maxHourly: {type: Number, required: false},
    minGrowthNum: {type: Number, required: false},
    maxGrowthNum: {type: Number, required: false},
    minGrowthPerc: {type: Number, required: false},
    maxGrowthPerc: {type: Number, required: false},

    // not implemented
    reqEdu: {type: Array, required: false},
    reqWorkExp: {type: Array, required: false},
    reqSkillset: {type: Array, required: false},
},
    {timestamps: true}
)

// Function to remove a key-value pair from doc that is '', '[]', '{}' or mistyped
/*function delEmptyKey(val){
    if (val === '' || (Array.isArray(val) && val.length === 0) ||
       (typeof val === 'object' && Object.keys(val).length === 0)) {
        return true;
    }
    return false;
}*/

module.exports = mongoose.model('JobPrefs', jobPrefsSchema)