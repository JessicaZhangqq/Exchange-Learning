const pathModule= require('path');
const express = require('express');
const bodyParser=require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const router = express.Router();


router.get('/search', (req, res) => {
    // get data from db with condition
    const nativeLanguage = req.query.nativeLanguage;
    const learningLan = req.query.learningLan;
    const MongoClient = require('mongodb').MongoClient;
    const url = "mongodb://localhost:27017/";
    const email=req.cookies.email;
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const dbo = db.db("myProject");
    // const whereStr = {nativeLanguage:learningLan,learningLan:learningLan};  // select condition
    dbo.collection("profile").find().limit(10).toArray(function(err, result) {
        if (err) throw err;
        // console.log('find data from db',result);
        if(result.length<=0){
            //no users were found
            res.send('no users fit for your conditions');
            db.close();
        }else{//if the username doesn't exist, insert it to database
        const authenticated = req.session.authenticated || false;
           res.render('search',{users:result,user: { authenticated: authenticated },email:email});
        }
        // console.log(result);
        });
    });
});


router.get('/searchSubmit', (req, res) => {
    // get data from db with condition
    console.log('/serachSubmit path');
    const nativeLanguage = req.query.nativeLanguage;
    const learningLan = req.query.learningLan;
    const MongoClient = require('mongodb').MongoClient;
    const url = "mongodb://localhost:27017/";
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const dbo = db.db("myProject");
    const whereStr = {nativeLanguage:nativeLanguage,learningLan:learningLan};  // select condition
    // console.log(whereStr);
    dbo.collection("profile").find(whereStr).limit(10).toArray(function(err, result) {
        if (err) throw err;
        // console.log('find data from db',result);
        if(result.length<=0){
            //no users were found
            noResult='no users fit for your conditions';
            res.render('searchEmpty',{noResult:noResult});
            db.close();
        }else{//if the username doesn't exist, insert it to database
           res.render('search',{users:result});
        }
        // console.log(result);
    });
 });
    
});
module.exports=router;