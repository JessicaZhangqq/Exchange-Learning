const pathModule= require('path');
const express = require('express');
const bodyParser=require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const router = express.Router();

router.get('/sendMessage', (req, res) => {
    //get the friend's email from url
    const frinendEmail = req.query.id;
    const frinendName = req.query.name;
    //get the user email who is loging in
    const userEmail = req.cookies.email;
    // insert the userEmail and FriendEmail into db
    res.render('chat');
        

})
//show friend list

module.exports=router;