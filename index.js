const express = require('express');
const app = express();
const pathModule=require('path');
const bodyParser=require('body-parser');
const cookieParser = require('cookie-parser')
const util = require('util');
const multer  = require('multer');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const upload = multer({ dest: 'public/upload' });
app.use(cookieParser());
app.set('view engine', 'pug');
app.use(express.static('public'));
const session = require('express-session');
app.use(session({
  secret: 'javascript learning session',
  resave: true,
  saveUninitialized: false
}));
    //start with
app.get('/',function(req,res){
    console.log('get / ');
    const authenticated = req.session.authenticated || false;
    const email=req.cookies.email;
    console.log(req.session.authenticated);
    // response.render('index', { user: { authenticated: authenticated } });
    const MongoClient = require('mongodb').MongoClient;
    const url = "mongodb://localhost:27017/";
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        const dbo = db.db("myProject");
        dbo.collection("profile").find().limit(6).toArray(function(err, result) {
            if (err) throw err;
            console.log('find data from db',result);
                 res.render('index',{users:result,user: { authenticated: authenticated },email:email });
                 db.close();
            // console.log(result);
        });
    });
});
    //get into login page
app.get('/loginPage',function(req,res){
    res.render('login');
});
    //get into sign up page
app.get('/SignIn',function(req,res){
    res.render('signIn');
});
    //profile set up page
app.get('/profile',function(req,res){
    res.status(200).sendFile(pathModule.join(__dirname,'profile.html'));
});

    //search a partner page
const loginSignin=require('./public/js/loginSigninServer');    
// const profile=require('./public/js/profileServer');    
app.use('/',loginSignin);

const search=require('./public/js/searchServer.js');    
app.use('/',search);

const profileServer=require('./public/js/profileServer.js');    
app.use('/',profileServer);

const friendServer=require('./public/js/friendServer.js');    
app.use('/',friendServer);
const sendMessageServer=require('./public/js/sendMessageServer.js');    
app.use('/',sendMessageServer);

app.get('/logout', (request, response, next) => {
    if (request.session) {
      // delete session object
      request.session.destroy((error) => {
        if (error) {
          // We can congigure an error handler
          return next(err);
        } else {
          // Redirect the user after logout
          return response.redirect('/');
        }
      });
    }
  });
// app.get('/sendMessage',function(req,res){
//     console.log('/sendMessage module');
//     res.render('sendMessage');
// });
  
  
app.listen(3000,function(err){
    if(err){
        console.log(err);
    }else{
        console.log('Server is running on port 3000');
    }
});