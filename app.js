require("dotenv").config()

const Restify = require('restify');
const Methods = require("./methods");
const app = Restify.createServer({
  name: "ReportMilla ChatBot"
});
const { Queue } = require("buckets-js");
const log = require("./winstonLogger")

const token = process.env.VERIFY_TOKEN
const bot = new Methods(process.env.RM_ACCESS_TOKEN)
app.use(Restify.plugins.jsonp());
app.use(Restify.plugins.bodyParser());

const MILLISECOND_IN_A_SECOND = 1000;

const learnMoreMessageArray = require("./learnMoreMessages.json")


const master_learnMoreMessagesQueue = createLearnMoreMessagesQueue();

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
  
  res.send(200);

  if(response.object === "page"){

    const messageObject = bot.getMessageObject(response);
    const nlpObject = bot.getNLPObject(response);

    if(bot.prospectWantsToLearnMore(nlpObject)){
      let learnMoreMessagesQueue = {...master_learnMoreMessagesQueue}
      sendMultipleMessagesWithDelay(learnMoreMessagesQueue, messageObject.id)
    }
    if(bot.prospectHasGivenContactDetails(nlpObject)){
      bot.logProspectDetails(nlpObject, messageObject.id);
      // bot.toggleMessageBubble_On(messageObject.id)
      bot.sendText("Thanks for showing interest in ReportMilla! We'll be in contact soon!", messageObject.id)
    }
    else{
      return
    }

  }

})

app.listen(8000, () => {
  console.log(`Server listening on port 8000`)
})


function sendMultipleMessagesWithDelay(msgQueue, userId){
  if(msgQueue.size() < 1){
    bot.toggleMessageBubble_Off(userId);
    return
  }
  let messageToSend = msgQueue.dequeue();
  bot.toggleMessageBubble_Off(userId)
  bot.sendText(messageToSend.message, userId)
  setTimeout(bot.toggleMessageBubble_On.bind(bot, userId), 2 * MILLISECOND_IN_A_SECOND);
  setTimeout(sendMultipleMessagesWithDelay.bind(bot, msgQueue, userId), messageToSend.delayNext * MILLISECOND_IN_A_SECOND)
  return;
}

function createLearnMoreMessagesQueue(){
  const learnMoreMessageQueue = Queue();
  const delayArray = [12,16,15,12,18,10,7,5];
  learnMoreMessageArray.forEach((message, i) => {
    learnMoreMessageQueue.add({message, delayNext: delayArray[i]})
  })
  return learnMoreMessageQueue;
}

