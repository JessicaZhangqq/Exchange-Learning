const pathModule= require('path');
const express = require('express');
const bodyParser=require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const router = express.Router();

router.get('/addAsFriend/*', (req, res) => {
    //get the friend's email from url
    const frinendEmail = req.query.id;
    const frinendName = req.query.name;
    //get the user email who is loging in
    const userEmail = req.cookies.email;
    // insert the userEmail and FriendEmail into db
    const MongoClient = require('mongodb').MongoClient;
    const url = "mongodb://localhost:27017/";
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        const dbo = db.db("myProject");
        const myobj = { email:userEmail,friend:frinendEmail,name:frinendName};
        // check if the friend is already in our friend list
        dbo.collection("friendList").find(myobj).toArray(function(err, result) {
            if(err) throw err;
            const user = result[0];
            //when find an item that means this friend is in our list already.
            if(result.length>0){
                console.log('this user is in our friend list already!');
                db.close();
            }else{
                dbo.collection("friendList").insertOne(myobj, function(err, result) {
                    if (err) throw err;
                    console.log("add a friend successfully!");
                    if(result){
                        db.close();
                        //stay at search page
                        res.redirect('/search');
                        }
                    // res.send(`We got the following values from the query string: ${username}, ${password}`);
                });
            }
        });
        
    });
})
//show friend list
router.get('/friendList', (req, res) => {
    // get data from db with condition
    const userEmail = req.cookies.email;
    const MongoClient = require('mongodb').MongoClient;
    const url = "mongodb://localhost:27017/";
    MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    const dbo = db.db("myProject");
    const whereStr = {email:userEmail};  // select condition
    // console.log(whereStr);
    dbo.collection("friendList").find(whereStr).toArray(function(err, result) {
        if (err) throw err;
        // console.log('find data from db',result);
        if(result.length<=0){
            //no users were found
            noResult='no users fit for your conditions';
            // res.render('searchEmpty',{noResult:noResult});
            db.close();
        }else{//if the username doesn't exist, insert it to database
           res.render('friendList',{users:result,email:userEmail});
           db.close();
        }
        // console.log(result);
    });
 });
    
});
module.exports=router;