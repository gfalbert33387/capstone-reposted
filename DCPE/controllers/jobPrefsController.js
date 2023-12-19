const prefsModel = require('../models/jobPrefs');
const userModel = require('../models/User');
const keywordsModel = require('../models/keywords');

// GET request to serve the New Job Prefs form
// thisRouter.get('/new', controller.getNew);
exports.getNew = (req, res, next)=>{ 
    let userId = req.session.userId
    let keywSkills, keywExps, keywEdus

    Promise.all([ userModel.findById(userId), keywordsModel.findOne() ])
        .then(results=>{
            const [resUser, resKWords] = results
            if(!resUser){ throwNew404(userId, 'user', next) }
            if(!resKWords){ throwNew404('6573638379fa19f11189ef8f', 'resKWords', next) }
            else{
                return res.render('./jobPrefs/newPrefs', {
                    user: resUser,
                    keySkills: resKWords.uniqueSkills, 
                    keyExps: resKWords.uniqueExp, 
                    keyEdus: resKWords.uniqueEdu
                })
            }
        })
        .catch(err=>{ next(err) }) 
}

// POST request to submit the New Job Prefs form
// thisRouter.post('/new', controller.postNew);
exports.postNew = (req, res, next)=>{

    let reqPrefs = new prefsModel(req.body)
    let userId = req.session.userId
    let set = { user: userId }

    // build filter
    for (const [key, val] of Object.entries(reqPrefs._doc)) {
        // if 0 or (not falsy nor empty)
        if (val === 0 || !(val === '' || !val || (Array.isArray(val) && val.length == 0) || 
            (typeof val === 'object' && Object.keys(val).length == 0))) {
                
            // populate set with val
            set[key] = val;
        } 
    }
    
    // overwrite the whole document except set values and self _id
    reqPrefs.overwrite(set)

    Promise.all([ userModel.findById(userId), reqPrefs.save() ])
        .then(results=>{
            const [resUser, resPrefs] = results
            
            if(!resUser){ throwNew404(userId, 'user', next) }
            if(!resPrefs){ throwNew404(prefsId, 'jobPrefs', next) }
            else{
                req.flash('success', `Your "${resPrefs.title}" Preferences were saved successfully`);
                return res.redirect('../user/profile' )
            }
        })
        .catch(err=>{next(err)})
}

// GET request to serve the Edit Job Prefs form
// thisRouter.get('/:id', controller.getEdit);
exports.getEdit = (req, res, next)=>{
    let userId = req.session.userId
    let prefsId = req.params.id

    Promise.all([ userModel.findById(userId), prefsModel.findByIdAndUpdate(prefsId), keywordsModel.findOne() ])
        .then(results=>{
            const [resUser, resPrefs, resKWords] = results
            
            if(!resUser){ throwNew404(userId, 'user', next) }
            if(!resPrefs){ throwNew404(prefsId, 'jobPrefs', next) }
            if(!resKWords){ throwNew404('6573638379fa19f11189ef8f', 'resKWords', next) }
            else{
                return res.render('./jobPrefs/editPrefs', {
                    user: resUser, 
                    prefSet: resPrefs,
                    keySkills: resKWords.uniqueSkills, 
                    keyExps: resKWords.uniqueExp, 
                    keyEdus: resKWords.uniqueEdu
                })
            }
        })
        .catch(err=>{ next(err) })
}

// PUT request to submit the Edit Job Prefs form
// thisRouter.put('/:id/edit', controller.putEdit);
exports.putEdit = (req, res, next)=>{
    const userId = req.session.userId
    const prefsId = req.params.id
    let reqPrefs = req.body
    let unset = {};
    let set = {};

    // build filter
    for (const [key, val] of Object.entries(reqPrefs)) {
        // populate null values with 1s to overwrite with unset
        if (val === '' || (Array.isArray(val) && val.length === 0) || 
            (typeof val === 'object' && Object.keys(val).length === 0)) {
                // add the field to the $unset list
                unset[key] = 1; 

                console.log("unset", key, val)
        // otherwise, populate set with val
        } else{
            set[key] = val;
            console.log("set", key, val)
        }
    }
    // check for unpassed checkboxes
    if(!("reqEdu" in reqPrefs)){
        unset['reqEdu'] = 1;
    }
    if(!("reqWorkExp" in reqPrefs)){
        unset['reqWorkExp'] = 1;
    }
    if(!("reqSkillset" in reqPrefs)){
        unset['reqSkillset'] = 1;
    }

    const filter = {
        $set: set,
        $unset: unset
    };

    Promise.all([ userModel.findById(userId), 
        prefsModel.findByIdAndUpdate(prefsId, filter, { new: true }, {runValidators: true}) ])
        .then(results=>{
            const [resUser, resPrefs] = results
            
            if(!resUser){ throwNew404(userId, 'user', next) }
            if(!resPrefs){ throwNew404(prefsId, 'jobPrefs', next) }
            else{
                req.flash('success', `Your "${resPrefs.title}" Preferences were saved successfully`);
                return res.redirect('../user/profile' )
            }
        })
        .catch(err=>{ next(err) })
}

// DELETE request to delete the specified Job Prefs form
// thisRouter.delete('/:id', jobPrefsController.delete);
exports.delete = (req, res, next)=>{

    const userId = req.session.userId
    const prefsId = req.params.id

    Promise.all([ userModel.findById(userId), 
        prefsModel.findByIdAndDelete(prefsId, {useFindAndModify: false}) ])
        .then(results=>{
            const [resUser, resPrefs] = results
            
            if(!resUser){ throwNew404(userId, 'user', next) }
            if(!resPrefs){ throwNew404(prefsId, 'jobPrefs', next) }
            else{
                req.flash('success', `Your "${resPrefs.title}" Preferences were deleted successfully`);
                return res.redirect('../user/profile' )
            }
        })
        .catch(err=>{ next(err) })
}



function throwNew404(id, doc, next){
    let err = new Error(`Cannot find a ${doc} document with id ${id}`)
    err.status = 404
    next(err)
}