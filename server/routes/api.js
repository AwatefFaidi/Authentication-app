const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken')
const db = "mongodb://localhost:27017/eventsdb";


mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }, function(err){
    if(err){
        console.error('Error! ' + err)
    } else {
      console.log('Connected to mongodb')      
    }
});

//Middleware to verify token
function verifyToken(req, res, next) {
  if(!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  //extract token from bearer authorization
  let token = req.headers.authorization.split(' ')[1]
   
  if(token === 'null') {
    return res.status(401).send('Unauthorized request')    
  }
  //verify token with  function  jwt.verify
  let payload = jwt.verify(token, 'secretKey')
  if(!payload) {
    return res.status(401).send('Unauthorized request')    
  }
  req.userId = payload.subject
  next()
}

router.get('/', (req,res)=>
{
    res.send('from API routes')
})

router.get('/events', (req,res) => {
    let events = [
      {
        "_id": "1",
        "name": "Auto Expo",
        "description": "lorem ipsum",
        "date": "2012-04-23T18:25:43.511Z"
      },
      {
        "_id": "2",
        "name": "Auto Expo",
        "description": "lorem ipsum",
        "date": "2012-04-23T18:25:43.511Z"
      },
      {
        "_id": "3",
        "name": "Auto Expo",
        "description": "lorem ipsum",
        "date": "2012-04-23T18:25:43.511Z"
      },
      {
        "_id": "4",
        "name": "Auto Expo",
        "description": "lorem ipsum",
        "date": "2012-04-23T18:25:43.511Z"
      },
      {
        "_id": "5",
        "name": "Auto Expo",
        "description": "lorem ipsum",
        "date": "2012-04-23T18:25:43.511Z"
      },
      {
        "_id": "6",
        "name": "Auto Expo",
        "description": "lorem ipsum",
        "date": "2012-04-23T18:25:43.511Z"
      }
    ]
    res.json(events)
  })
  
  router.get('/special', verifyToken, (req, res) => {
    let specialEvents = [
      {
        "_id": "1",
        "name": "Auto Expo Special",
        "description": "lorem ipsum",
        "date": "2012-04-23T18:25:43.511Z"
      },
      {
        "_id": "2",
        "name": "Auto Expo Special",
        "description": "lorem ipsum",
        "date": "2012-04-23T18:25:43.511Z"
      },
      {
        "_id": "3",
        "name": "Auto Expo Special",
        "description": "lorem ipsum",
        "date": "2012-04-23T18:25:43.511Z"
      },
      {
        "_id": "4",
        "name": "Auto Expo Special",
        "description": "lorem ipsum",
        "date": "2012-04-23T18:25:43.511Z"
      },
      {
        "_id": "5",
        "name": "Auto Expo Special",
        "description": "lorem ipsum",
        "date": "2012-04-23T18:25:43.511Z"
      },
      {
        "_id": "6",
        "name": "Auto Expo Special",
        "description": "lorem ipsum",
        "date": "2012-04-23T18:25:43.511Z"
      }
    ]
    res.json(specialEvents)
  })

router.post('/register', (req, res) => {
    //extract user info from req
    let userData = req.body
    //pass userdata to user model to mangoose can understand
    let user = new User(userData)
    //save to DataBase
    user.save((err, registeredUser) => {
      if (err) {
        console.log(err)      
      } else {
        //define payload: data info
        let payload = {subject: registeredUser._id}
        //generate token with function sign
        let token = jwt.sign(payload, 'secretKey')
        //send token
        console.log(token)  
        res.status(200).send({token})
        //res.status(200).send(registeredUser)
      }
    })
  })

  //Login Api
  router.post('/login', (req, res) => {
      //extract user info from req
    let userData = req.body
    //verify email && password
    User.findOne({email: userData.email}, (err, user) => {
      if (err) {
        console.log(err)    
      } else {
        if (!user) {
          res.status(401).send('Invalid Email')
        } else 
        if ( user.password !== userData.password) {
          res.status(401).send('Invalid Password')
        } else {
          let payload = {subject: user._id}
          let token = jwt.sign(payload, 'secretKey')
          res.status(200).send({token})
          console.log(token) 
          //res.status(200).send(user)
        }
      }
    })
  })
module.exports = router