/*
 * party.jsx - Handle requests to the /api/part[y|ies]
 */
import {get, post} from './api.jsx'

var querystring = require('querystring')

const url = '/api/ingredient/create'
const url_get = '/api/ingredients'

export default class ApiIngredient {
  
  get(name, exact) {
    return get(url_get + '?' + querystring.stringify({name:name, exact: exact ? 'Y' : 'N'}))
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

  create(name){
    let self = this;

    return post(url,{name:name})
  }
}
 