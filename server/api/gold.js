let config = require('../config');
const exec = require('child_process').exec;


module.exports = function(req, res, next){
    let address = req.body.address;
    if(address){
        console.log(address);
        const cmd = 'cd ../plasma-mvp && python plasma_demo/sendtx.py ' + address + ' 0xfd02ecee62797e75d86bcff1642eb0844afb28c7 3bb369fecdc16b93b99514d8ed9c2e87c5824cf4a6a98d2e8e91b7dd0c063304';
        console.log(cmd);
        exec(cmd,
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
