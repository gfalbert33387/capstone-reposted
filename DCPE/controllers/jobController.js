const jobModel = require('../models/job')
const prefsModel = require('../models/jobPrefs')
// const jobParamsModel = require('..models/jobParams)

exports.getAll = (req, res, next)=>{
    jobModel.find()
        .then(allJobs=>{
            // all meetings returned from model.find()
            res.render('./jobs/jobs', { jsonData: allJobs, percMatchArr: [] })
        })
        .catch(err=>next(err))
}

exports.getFiltered = (req, res, next)=>{
    const prefsId = req.params.id
    
    // find all jobs and the 1 jobPrefs in no particular order
    Promise.all([jobModel.find(), prefsModel.findById({_id: prefsId}) ])
        .then(results=>{
            if(results[0] && results[1]){
                // save relevant returned fields from each index to new constants
                const [allJobs, resPrefs] = results
                // Filter out excluded fields
                const excludedFields = ["_id", "title", "user", "createdAt", "updatedAt", "description", "citation", "__v"];
                const filterObj = Object.keys(resPrefs._doc)
                    .filter(key => !excludedFields.includes(key))
                    .reduce((obj, key) => {
                        obj[key] = resPrefs[key];
                        return obj;
                    }, {});

                let percMatch = []
                let filteredJobs = [] 
                
                // count # fields that aren't IDs
                    // accounts for multiple entries in 1 category (array)
                let totalFields = Object.keys(filterObj).length
                // remove fields from total that are essentially two halves of 1 field
                if("minAnnual" in filterObj & "maxAnnual" in filterObj){ totalFields -= 1 }
                if("minHourly" in filterObj & "maxHourly" in filterObj){ totalFields -= 1 }
                if("minGrowthPerc" in filterObj & "maxGrowthPerc" in filterObj){ totalFields -= 1 }
                if("minGrowthNum" in filterObj & "maxGrowthNum" in filterObj){ totalFields -= 1 }

                // iterate through allJobs
                allJobs.forEach((job)=>{
                    
                    let matchedFields = 0
                    
                    // iterate through all key: value pairs in each job, _doc contains the list
                    for(const key of Object.keys(job._doc)){
                        
                        const val = job._doc[key]

                        // Iterate matchedFields if key matches desired params
                        if ((filterObj[key] && (val === filterObj[key])) ||
                            checkRanges(key, val, filterObj) ||
                            checkKeywords(key, val, filterObj))
                        { matchedFields += 1; console.log(matchedFields) }
                    }
                    if(totalFields && (matchedFields > 0)){
                        // round to 2 decimals and push
                        percMatch.push(((matchedFields / totalFields) * 100).toFixed(0))
                        filteredJobs.push(job)
                    }
                });
                
                // Sort the jobs based on the percMatch ratio in descending order
                let sortedJobs = filteredJobs.sort((a, b) => percMatch[filteredJobs.indexOf(b)] - percMatch[filteredJobs.indexOf(a)])
                // Then sort percMatch in descending order
                percMatch.sort((a, b) => b - a)
                
                res.render(`./jobs/jobs`, { jsonData: sortedJobs, percMatchArr: percMatch })

            } else { throwNew404(prefsId, 'jobPrefs', next) }
        })
        .catch(err=>next(err))
}

/*exports.testAll = (req, res, next)=>{
    jobModel.find()
        .then(allJobs=>{
            // all meetings returned from model.find()
            res.render('./testing/Greg', { jsonData: allJobs, percMatchArr: [] })
        })
        .catch(err=>next(err))
}

exports.testFiltered = (req, res, next)=>{
    const filterObject = {
        reqEdu: "Bachelor's degree",
        reqWorkExp: "None",
        minAnnual: 70000,
        minGrowthPerc: -1,
        maxGrowthPerc: 5,
        maxGrowthNum: 8000
    }
    
    jobModel.find()
        .then(allJobs=>{
            
            let percMatch = []
            let filteredJobs = [] 
            
            let totalFields = Object.keys(filterObject).length
            // remove fields from total that are essentially two halves of 1 field
            if("minAnnual" in filterObject & "maxAnnual" in filterObject){ totalFields -= 1 }
            if("minHourly" in filterObject & "maxHourly" in filterObject){ totalFields -= 1 }
            if("minGrowthPerc" in filterObject & "maxGrowthPerc" in filterObject){ totalFields -= 1 }
            if("minGrowthNum" in filterObject & "maxGrowthNum" in filterObject){ totalFields -= 1 }
            
            // iterate through allJobs
            allJobs.forEach((job)=>{

                let matchedFields = 0
                
                // iterate through all key: value pairs in job
                for(const key of Object.keys(job._doc)){
                    
                    const val = job._doc[key]

                    // Check if key matches desired params
                    if(val !== undefined && 
                                                                             // for release build
                        (key in filterObject && val == filterObject[key]) || // if ((filterObject.has(key) & val == filterObject._doc[key])
                            checkRanges(key, val, filterObject) || 
                            checkKeywords(key, val, filterObject)){
                            matchedFields += 1
                            console.log(matchedFields)
                    }
                }
                if(totalFields && (matchedFields > 0)){
                    // round to 2 decimals and push
                    percMatch.push(Math.round((matchedFields / totalFields) * 100) / 100)
                    filteredJobs.push(job)
                }
            });
            
            // Sort the jobs based on the percMatch ratio in descending order
            let sortedJobs = filteredJobs.sort((a, b) => percMatch[filteredJobs.indexOf(b)] - percMatch[filteredJobs.indexOf(a)])
            // Then sort percMatch in descending order
            percMatch.sort((a, b) => b - a)
            
            res.render(`./testing/Greg`, { jsonData: sortedJobs, percMatchArr: percMatch })
        })
        .catch(err=>next(err))
}*/

// Check if val is in ranges for given key, account for cases where one side is unbound
function checkRanges(key, val, filterObject){
    if(key == 'medianAnnual' && ('minAnnual' in filterObject || 'maxAnnual' in filterObject) &&
        ((filterObject.minAnnual==undefined || filterObject.minAnnual <= val) && 
        (filterObject.maxAnnual==undefined || val <= filterObject.maxAnnual))){
            return true
    }
    if(key == 'medianHourly' && ('minHourly' in filterObject || 'maxHourly' in filterObject) &&
        ((filterObject.minHourly==undefined || filterObject.minHourly <= val) && 
        (filterObject.maxHourly==undefined || val <= filterObject.maxHourly))){
            return true
    }
    if(key == 'jobGrowthPerc' && ('minGrowthPerc' in filterObject || 'maxGrowthPerc' in filterObject) &&
        ((filterObject.minGrowthPerc==undefined || filterObject.minGrowthPerc <= val) && 
        (filterObject.maxGrowthPerc==undefined || val <= filterObject.maxGrowthPerc))){
            return true
    }
    if(key == 'jobGrowthNum' && ('minGrowthNum' in filterObject || 'maxGrowthNum' in filterObject) &&
        ((filterObject.minGrowthNum==undefined || filterObject.minGrowthNum <= val) && 
        (filterObject.maxGrowthNum==undefined || val <= filterObject.maxGrowthNum))){
            return true
    }       
    return false
}

// Check if val is in array for given key, return true with at least 1 match, else false
function checkKeywords(key, arr, filterObject){
    if(typeof arr === 'string') {
        arr = [arr]
    }
    if(Array.isArray(arr)){
        if(key === 'reqEdu' && ('reqEdu' in filterObject) && filterObject['reqEdu'].some(value => 
            arr.map(str => str.trim().toLowerCase())
            .includes(   value.trim().toLowerCase()) )){
                return true
        }
        if(key === 'reqWorkExp' && 'reqWorkExp' in filterObject && filterObject['reqWorkExp'].some(value => 
            arr.map(str => str.trim().toLowerCase())
            .includes(   value.trim().toLowerCase()) )){
                return true
        }
        if(key === 'reqSkillset' && 'reqSkillset' in filterObject && filterObject['reqSkillset'].some(value => 
            arr.map(str => str.trim().toLowerCase().replace(/skills/g, ''))
            .includes(value.trim().toLowerCase().replace(/skills/g, '')) )){
                return true
        }
    }
    return false
}

// 404 handling
function throwNew404(id, doc, next){
    let err = new Error(`Cannot find a ${doc} document with id ${id}`)
    err.status = 404
    next(err)
}