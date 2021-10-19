const db = require('../myconnect/myconnect')
const fs = require('fs');
const mime = require('mime');
let moment = require('moment');

exports.uploadImage = (req,res)=>{
    let folderName = req.body.folderName;
    let fileName = req.body.fileName;
    var matches = req.body.base64image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
    response = {};
    
    if (matches.length !== 3) {
    return new Error('Invalid input string');
    }
    
    response.type = matches[1];
    response.data = Buffer.from(matches[2], 'base64');
    let decodedImg = response;
    let imageBuffer = decodedImg.data;
    // let type = decodedImg.type;
    // console.log(type)
    // fileName = moment(Date.now()).format('YYYYMMDD_hhmmss') + "_" + fileName[0] + ".jpeg";
    try {
        fs.writeFileSync(folderName + fileName, imageBuffer, 'utf8');
        return res.send({"status":"success"});
    } catch (error) {
        console.log("error : " , error)
    }
    
}
exports.user99 = (req,res)=>{
    db.query("SELECT * FROM config WHERE name='OFFROAD'",(err,result)=>{
        if(err) {
            console.log(err);
        }else {
            res.send(result);
        }
    })
}

exports.login = (req,res)=>{
    console.log('function : /login');
    db.query("SELECT * FROM config WHERE name='OFFROAD'",(err,result)=>{
        if(err) {
            console.log(err);
            res.send({
                status : "error",
                message : "error",
                code : 0
            });
        }else {
            let md5 = require('md5');
            const userName = req.body.userName;
            const password = req.body.password;
            let logCode = md5(result[0].value+password);
            db.query(`SELECT * FROM admin WHERE userName='${userName}' AND password='${logCode}'`,(err,result)=>{
                if(err) {
                    console.log(err);
                    res.send({
                        status : "error",
                        message : "error",
                        code : 0
                    });
                }else {
                    console.log(result);
                    if(result.length > 0) {
                        res.send({
                            status : "success",
                            message : "login สำเร็จ",
                            name : result.name,
                            code : 1
                        });
                    }else {
                        res.send({
                            status : "fail",
                            message : "user name หรือ password ไม่ถูกต้อง",
                            code : 0
                        });
                    }
                    
                }
            });
            
            //res.send(result);
        }
    })
}