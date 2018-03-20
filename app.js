const Restify = require('restify');

const app = Restify.createServer();

const token = '123abc';

app.use(Restify.plugins.jsonp());
app.use(Restify.plugins.bodyParser());

app.get("/", (req, res, next)=> {

  if( req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === token){
    res.end(req.query['hub.challenge']);
  }
  else{
    next()
  }
})

app.post("/", (req, res) => {
  res.end()
})

app.listen(8080)