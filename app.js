const express = require('express');

const app = express();

const token = '123abc';

app.get("/", (req, res, next)=> {

  if( req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === token){
    res.end(req.query['hub.challenge']);
  }
  else{
    next()
  }
})

app.listen(8080)