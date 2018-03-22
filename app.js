require("dotenv").config()

const Restify = require('restify');
const Methods = require("./methods");
const app = Restify.createServer({
  name: "ReportMilla ChatBot"
});

const token = process.env.VERIFY_TOKEN
const bot = new Methods(process.env.RM_ACCESS_TOKEN)
app.use(Restify.plugins.jsonp());
app.use(Restify.plugins.bodyParser());



app.get("/", (req, res, next)=> {

  if( req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === token){
    res.end(req.query['hub.challenge']);
  }
  else{
    res.send(200);
  }
})

app.post("/", (req, res) => {
  const response = req.body;

  if(response.object === "page"){
    const messageObject = bot.getMessageObject(response);
    const nlpObject = bot.getNLPObject(response);
    console.log(nlpObject)
    if(bot.prospectWantsToLearnMore(nlpObject)){
      bot.sendText(`Thanks for showing interest and giving us your valuable attention! 
      ReportMilla is a new way to handle your report writing process.
      
      Here at ReportMilla we don't believe survey report writing should be the time, money and energy burden it currently is!
      Imagine you're stood out in the rain. Holding your umbrella between your shoulder and cheek.
      Taking field notes with pen and paper or dictating to your phone. Water's getting everywhere and you'd rather get back in the car and go back to the office.
      Only you know when you get back, you'll have to type up those SAME notes you made moments earlier. If you're fortunate enough to have an assistant, take a good look at them next time you ask them to type up your notes. I'm sure they love the idea!
      
      And that's the thing! Not only do they know, but you probably think it too. It's a waste of time and resources. Costing your company money and taking away from the excellent service you could be providing to your clients.`, messageObject.id);
      
      bot.sendText("follow up", messageObject.id)
    }
    else{
      bot.sendText(`You said: ${messageObject.message}`, messageObject.id);
    }

  }
  res.send(200);
})

app.listen(8000, () => {
  console.log(`Server listening on port 8000`)
})


function sendMultipleMessagesWithDelay(msgArray){
  // caller function that takes a queue
  //show front of queue - send this message with the delay it is stored with
  // dequeue
  //call recursively with the smaller queue after interval/timeout
      //may need to wait for confirmation of message send if the order is getting messed up!
  //may have to restrict queue size

}