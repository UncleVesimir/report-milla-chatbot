const request = require('./requestPromise');
const log = require("./winstonLogger")
const util = require("util")

module.exports = class Methods {
  constructor(access_token) {
    this.ACCESS_TOKEN = access_token
    this.messenger_path = "me/messages"
  }

  getFromFaceBook(path, qs) {
    return request({
      url: `https://graph.facebook.com/v2.12/${path}`,
      qs: {
        ...qs, 
        access_token: this.ACCESS_TOKEN
      },
      method: 'GET'
    })
  }

  postToFaceBook(path, json) {
    return request({
      url: `https://graph.facebook.com/v2.12/${path}`,
      qs: {
        access_token: this.ACCESS_TOKEN
      },
      json,
      method: 'POST'
    })
  }  

  async sendText(text, id){
    const json = {
      recipient: { id },
      message: { text }
    }
    let res = null;

    try{
       res = await this.postToFaceBook(this.messenger_path, json)
    }
    catch(error){
      console.error(error)
    }
    finally{
      if(res){
        console.log("Message Sent:", res)
      }
      else{
        console.log("Error switching bubble_on")
      }
    }
  }

  async toggleMessageBubble_On(id){
    const json = {
      recipient: { id },
      sender_action: "typing_on"
    }
    let res = null;

    try{
      res = await this.postToFaceBook(this.messenger_path, json)
    }
    catch(error){
      console.error(error)
    }
    finally{
      if(res){
        console.log("Toggle BUBBLE on:", res)
      }
      else{
        console.log("Error switching bubble_on")
      }
    }
  }

  async toggleMessageBubble_Off(id){
    const json = {
      recipient: { id },
      sender_action: "typing_off"
    }
    let res = null;
    try{
      res = await this.postToFaceBook(this.messenger_path, json)
    }
    catch(error){
      console.error(error)
    }
    finally{
      if(res){
        console.log("Toggle BUBBLE OFF:", res)
      }
      else{
        console.log("Error switching bubble_off")
      }
    }
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
    return nlpObject.entities.intent && (nlpObject.entities.intent[0].value === "tellProspect" && nlpObject.entities.intent[0].confidence > 0.85)
  }

  prospectEmail(entities){
    return entities.email && (entities.email[0].confidence > 0.9 && entities.email[0].value.length > 0 )
  }

  prospectPhoneNumber(entities){
    return entities.phone_number && (entities.phone_number[0].confidence > 0.9 && entities.phone_number[0].value.length > 0 )
  }
  prospectHasGivenContactDetails({ entities }) {
    return "email" in entities || "phone_number" in entities
  }

  async getProspectDetails({ entities }, id){
      console.log(`ENTITIES: ${util.inspect(entities, false, null)}`)
      let details = {};

      if(this.prospectPhoneNumber(entities)){
          details["phone_number"] = entities.phone_number[0].value;
        }
        if(this.prospectEmail(entities)){
          details["email"] = entities.email[0].value;
        }

      let user = await this.getUserFirstAndLastName(id)
      user = JSON.parse(user);


      if(user["first_name"]){
        details["first_name"] = user["first_name"]
      }
      if(user["last_name"]){
        details["last_name"] = user["last_name"]
      }

      return details;
    
    }
  
    async getUserFirstAndLastName(id){
      const details = await this.getFromFaceBook(id,{
        fields: "first_name,last_name" 
      })
  
      return details;
    }

    async logProspectDetails(nlpObject, id){
      let data = await this.getProspectDetails(nlpObject, id)
      console.dir(`Data: ${util.inspect(data, false, null)}`)
      log(data);
    }
}

