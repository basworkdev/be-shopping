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
            to: data.customer_email,
            subject: "",
            text: "",
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
        }
        sendMail(mail)
    } catch (error) {
        console.log(error)
    }
    
}

const sendMail = (data)=>{
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
          
          var mailOptions = {
            from: process.env.EMAIL_USER,
            to: data.to,
            subject: data.subject,
            text: data.text,
            html: data.html
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
                return error
            } else {
                console.log('Email sent: ' + info.response);
                return 'Email sent: ' + info.response
            }
        });
    } catch (error) {
        console.log("error : " , error)
        return error
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
          
          var mailOptions = {
            from: process.env.EMAIL_USER,
            to: data.to,
            subject: data.subject,
            text: data.text,
            html: data.html
          };
          
          transporter.sendMail(mailOptions, function(error, info){
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