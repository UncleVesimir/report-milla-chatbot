const request = require('request');


module.exports = class Methods {
  constructor(access_token) {
    this.ACCESS_TOKEN = access_token;
  }

  async sendText(){
    request({
      url: 'https://graph.facebook.com/v2.12/me/message',
      qs: {
        access_token: this.ACCESS_TOKEN
      },
      json,
      method: 'POST'
    })
  }
}