/*
 * lists.jsx - Handle requests to the /api/lists
 */
var querystring = require('querystring')

const url = '/api/user'

export default class List {
    
  get(name){
    let self = this;

    var promise = new Promise(function (resolve,reject) {
      fetch(url + '?' + querystring.stringify({name:name}), {  
        credentials: 'include',
        method: 'GET',  
        headers: {  
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-CSRFToken": getCookie('csrftoken')
        }
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
 