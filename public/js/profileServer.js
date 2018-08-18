const pathModule= require('path');
const express = require('express');
const router = express.Router();
const bodyParser=require('body-parser');
const formidable = require('formidable');
// const util = require('util');
const multer  = require('multer');
const upload = multer({ dest: 'public/upload' });
// modified on 22:37
var cookieParser = require('cookie-parser')
var util = require('util');
var app = express();
app.use(cookieParser());
// modified on 22:37

const urlencodedParser = bodyParser.urlencoded({ extended: false });
 
//login
router.post('/profileSave', upload.single('profilePhoto'), (req, res) => {
    console.log('/user/profileSave module')
    const file = req.file;
    const filename=file.filename;
    const username = req.body.username;
    const nativeLanguage = req.body.nativeLanguage;
    const learningLan = req.body.learningLan;
    const level = req.body.level;
    const country = req.body.countries;
    const introduction = req.body.introduction;
    const email=req.cookies.email;
    //set cookie
    res.cookie('email',email);
    res.cookie('name',req.cookies.name);
//test cookies

    const MongoClient = require('mongodb').MongoClient;
        const url = "mongodb://localhost:27017/";
        MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        const dbo = db.db("myProject");
        const myobj = { email:email,username:username,filename:filename,nativeLanguage:nativeLanguage , learningLan: learningLan,level:level,country:country,introduction:introduction };
        // I need get the current user Id, then insert profile with id to collection Profile
        // const whereStr = {email:email};  // select condition
        dbo.collection("profile").insertOne(myobj, function(err, result) {
            if (err) throw err;
            console.log("insert successfully!");
            if(result){
                db.close();
                //sign in successfullys
                res.redirect('/');
                // res.send('sucessfull');
                }
            // res.send(`We got the following values from the query string: ${username}, ${password}`);
            });
    });
});

router.get('/profileCheck',function(req,res){
    console.log('/profileCheck module');
    const email=req.cookies.email;
    //display user's profile info
    const MongoClient = require('mongodb').MongoClient;
        const url = "mongodb://localhost:27017/";
        MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        const dbo = db.db("myProject");
        const whereStr = { email:email};
        console.log('find condition:',whereStr);
        // I need get the current user Id, then insert profile with id to collection Profile
        // const whereStr = {email:email};  // select condition
        dbo.collection("profile").find(whereStr).toArray(function(err, result){
            if (err) throw err;
            console.log("find user profile from db:",result);
            if(result.length>0){
                //sign in successfullys
                res.render('profileShow',{user:result[0]});
                db.close();
            }else{
                res.cookie('email',email);
                res.redirect('/profile');
            }
        });
    });
    // I need make a profile.pug file
});


module.exports=router;
//log In
