const request = require('./requestPromise');


module.exports = class Methods {
  constructor(access_token) {
    this.ACCESS_TOKEN = access_token;
  }

  async sendText(text, id){
    const json = {
      recipient: { id },
      message: { text }
    }
    const res = await request({
      url: 'https://graph.facebook.com/v2.12/me/messages',
      qs: {
        access_token: this.ACCESS_TOKEN
      },
      json,
      method: 'POST'
    })

    console.log(`Facebook says: ${res}\n`);
  }

  getMessageObject(json) {
    const message = json.entry[0].messaging[0].message.text
    const id = json.entry[0].messaging[0].sender.id
    
    return {message, id}
  }

  getNLPObject(json){
    return json.entry[0].messaging[0].message.nlp
  }

  prospectWantsToLearnMore(nlpObject){
    return nlpObject.entities.intent[0].value === "tellProspect" && nlpObject.entities.intent[0].confidence > 0.85
  }
}