const pathModule= require('path');
const express = require('express');
const bodyParser=require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const router = express.Router();
//create a new user
// Require express session to create and handle our server session

// We add this module to create a passwod hash to avoid storing the password in plain text
const bcrypt = require('bcrypt');

// login
router.post('/SignInSubmit', urlencodedParser, (req, res) => {
    console.log('gent into signIn module, we are going to save the profile info to collection logInfo');
    // const password = req.body.password;
    const password = bcrypt.hashSync(req.body.password, 10);
    const email = req.body.email;
    const myobj ={email:email,password:password};
    // console.log(req.body);//used to check the result of request
    //insert log info
    const MongoClient = require('mongodb').MongoClient;
        const url = "mongodb://localhost:27017/";
        MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        const dbo = db.db("myProject");
        const whereStr = {email:email};  // select condition
        dbo.collection("logInfo").find(whereStr).toArray(function(err, result) {
            console.log('find data from db',result);
            if(result.length>0){
                const errorMessage='This emails has registered, try another one';
                res.render('signIn',{errorMessage:errorMessage});
                console.log('email is occupied');
                db.close();
            }else{//if the username doesn't exist, insert it to database
                dbo.collection("logInfo").insertOne(myobj, function(err, result) {
                    if (err) throw err;
                    console.log("insert successfully!");
                    db.close();
                    //sign in successfullys
                    res.status(200).sendFile(pathModule.join(__dirname,'../../profile.html'));
                 });
            }
            // console.log(result);
        });
 });
});
router.post('/loginSubmit', urlencodedParser, (req, res) => {
    
    console.log('gent into /loginSubmit module');
    const password = req.body.password;
    const email = req.body.email;
    console.log('email:',email,'password:',password);
    //insert log info
    const MongoClient = require('mongodb').MongoClient;
        const url = "mongodb://localhost:27017/";
        MongoClient.connect(url, function(err, db) {
        const dbo = db.db("myProject");
        const whereStr = {email:email};
        dbo.collection("logInfo").find(whereStr).toArray(function(err, result) {
            if(err) throw err;
            const user = result[0];
            //when find an item 
            if(result.length>0){
                console.log('find data from collection where email=email.');
                //check if the password is the same with password used input
                if (user && bcrypt.compareSync(password, user.password)) {
                    // Set the authenticated session value to true
                    console.log('password is correct, login successfull!');
                    req.session.authenticated = true;
                    // res.redirect('/',);
                    dbo.collection("profile").find().limit(6).toArray(function(err, result) {
                        if (err) throw err;
                        const authenticated = req.session.authenticated || false;
                        res.cookie('email',email);
                             res.render('index',{users:result,user: { authenticated: authenticated },email:email });
                             db.close();
                        // console.log(result);
                    });
                } else {
                    console.log('find password, but it doesn\'t match');
                    res.render('login', {errorPassword1: true });
                }
            }else{
                //no value find with the condition email that user input
                res.render('login', { errorEmail: true });
            }
        });
 });
});

module.exports=router;
//log In
