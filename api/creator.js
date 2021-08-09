const router = require('express').Router();





router.get('/new',async (req,res) => {
    console.log('[-] GET : /creator/new');
    let key = req.query.key;
    let author = req.query.author;
    let adminPwd = req.query.admin;
    
    if (adminPwd == process.env.ADMIN_PWD){
        if (key && author){
            let doesKeyExists = await db.checkCreatorKey(key);
            if (!doesKeyExists){
                console.log(`[+] New Creator -  ${key} : ${author}`);
                let sendObj = {
                    key:key,
                    creatorName:author
                }
                let newCreator = await db.newCreator(sendObj);
                res.json(sendObj);    
            }
            else if (doesKeyExists){
                res.send('This key already exists');
            }
    
        }
        else {
            res.send('Invalid query');
        }
    }
    else {
        res.send('Invalid admin password');
    }
});



router.get('/remove', async (req,res) => {
    console.log('[-] GET : /creator/remove');
    let key = req.query.key;
    let adminPwd = req.query.admin;
    
    if (adminPwd == process.env.ADMIN_PWD){
        if (key){
            let checkCreatorKey = await db.checkCreatorKey(key);
            let removeKey = await db.removeCreator(key);
            
            if (removeKey.deletedCount >= 1){
                console.log('[+] Removed a creator key from database');
    
                res.json({
                    key:key,
                    creatorName:checkCreatorKey.creatorName,
                    count:removeKey.deletedCount,
                    success:true,
                    message:'The key was successfully removed from database'                
                });
            }
            else {
                res.send('That key does not exist');
            }
        }
        else {
            res.send('Invalid query');
        }
    }
    else {
        res.send('Invalid admin password');
    }
});



module.exports = router;