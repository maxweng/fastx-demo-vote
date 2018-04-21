let config = require('../config');
const exec = require('child_process').exec;


module.exports = function(req, res, next){
    let address = req.body.address;
    if(address){
        exec('cd /share/plasma-mvp && python plasma_demo/sendtx.py ' + address,
        (error, stdout, stderr) => {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            if (error !== null) {
                res.status(400).json({"detail": error})
            } else {
                res.send({"detail": stdout})
            }
        });
    }
}
