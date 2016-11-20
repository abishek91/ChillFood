/*
 * party.jsx - Handle requests to the /api/part[y|ies]
 */
import get from './api.jsx'

var querystring = require('querystring')

const url = '/api/party/create'
const url_get = '/api/parties'

export default class Party {
  
  get() {
    return get(url_get)
    .then(function (data) {
      this.next = data.next;
      return data
    }.bind(this));    
  }

  load_more() {
    if (this.next) {
      return get(this.next)
      .then(function (data) {
        this.next = data.next;
        return data
      }.bind(this));
    } else {
      return Promise.resolve([])
    }
  }

  create(party){
    let self = this;

    var promise = new Promise(function (resolve,reject) {
      fetch(url, {  
        credentials: 'include',
        method: 'POST',  
        headers: {  
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-CSRFToken": getCookie('csrftoken')
        },
        body: JSON.stringify(party)
      })
      .then(function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        
        return response.text();
      })
      .then(function(text) { 
        var data = JSON.parse(text);
        resolve(data);
      })
      .catch(function(error) {
        Materialize.toast('There has been a problem, please contact your administrator.');
        console.log('There has been a problem with your fetch operation: ' + error.message,400);
        reject(error);
      });
    })

    return promise;
  }
}
 