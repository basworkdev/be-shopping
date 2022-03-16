const db = require('../myconnect/myconnect')
const fs = require('fs');
const mime = require('mime');
let moment = require('moment');
let nodemailer = require('nodemailer');
const tc = require('../textConfig/textConfig.json')

const dotenv = require('dotenv');
dotenv.config();

exports.uploadImage = (req,res)=>{
    try {
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

exports.getCarModel = (req,res)=>{
    try {
        db.query(`SELECT * FROM car_model`,(err,result)=>{
            if(err) {
                console.log(err);
            }else {
                res.send(result);
            }
        })
    } catch (error) {
        console.log("error : " , error)
    }
}

exports.sendMailOrder = (req,res) => {
    try {
        let data = req.body;
        const mail = {
            from : process.env.EMAIL_USER,
            to: data.customer_email,
            subject: "",
            html: ""
        }
        if(data.status === "UPLOADSLIP") {
            let htmlMail = tc.sendEmail.UPLOADSLIP;
            htmlMail = htmlMail.replace("#id", data.id);
            htmlMail = htmlMail.replace("#url", `${process.env.WEP_APP}order-status/${data.id}`);
            mail.subject = `คำสั่งซื้อหมายเลข ${data.id} ได้ส่งหลักฐานการชำระเงินแล้ว`
            mail.html = htmlMail
        } else if(data.status === "PAY") {
            let htmlMail = tc.sendEmail.PAY;
            htmlMail = htmlMail.replace("#id", data.id);
            htmlMail = htmlMail.replace("#url", `${process.env.WEP_APP}order-status/${data.id}`);
            mail.subject = `คำสั่งซื้อหมายเลข ${data.id} ได้ทำการชำระเงินเรียบร้อย`
            mail.html = htmlMail
        } else if(data.status === "DELIVER") {
            let htmlMail = tc.sendEmail.DELIVER;
            htmlMail = htmlMail.replace("#id", data.id);
            htmlMail = htmlMail.replace("#url", `${process.env.WEP_APP}order-status/${data.id}`);
            mail.subject = `คำสั่งซื้อหมายเลข ${data.id} อยู่ระหว่างการจัดส่ง`
            mail.html = htmlMail
        } else if(data.status === "SUCCESS") {
            let htmlMail = tc.sendEmail.SUCCESS;
            htmlMail = htmlMail.replace("#id", data.id);
            htmlMail = htmlMail.replace("#url", `${process.env.WEP_APP}order-status/${data.id}`);
            mail.subject = `คำสั่งซื้อหมายเลข ${data.id} ถูกจัดส่งเรียบร้อยแล้ว`
            mail.html = htmlMail
        } else {
            res.send("ไม่สามารถส่ง email ได้ (ไม่มีสถานนะสินค้านี้ในการส่ง email)");
            return null;
        }
        sendMail(mail,function (status) {
            res.send(status);
        });
    } catch (error) {
        console.log(error)
    }
    
}

const sendMail = (data , callback)=> {
    console.log("data" , data)
    try {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
            }
        });
        // callback("xxxx");
        transporter.sendMail(data, function(error, info){
            if (error) {
                console.log(error);
                callback(error);
                // return error
            } else {
                console.log('Email sent: ' + info.response);
                callback(tc.sendEmail.statusSuccess);
                // return 'Email sent: ' + info.response
            }
        });
    } catch (error) {
        console.log("error : " , error)
        callback(error);
        // return error
    }
}

exports.sendMail = (data)=>{
    console.log("process.env.EMAIL_USER" , process.env.EMAIL_USER)
    console.log("process.env.EMAIL_PASS" , process.env.EMAIL_PASS)
    console.log("data" , data)
    try {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });
          
          
          transporter.sendMail(data, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });
    } catch (error) {
        console.log("error : " , error)
    }
}